'use client';

import Link from "next/link";
import Image from "next/image";
import { Bot, ArrowRight, Search, SlidersHorizontal, ArrowUpDown, Sparkles, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropertyDetailsModal from "../components/PropertyDetailsModal";
import PropertyCard from "../components/PropertyCard";
import { Property } from "@/lib/types/property";
import { saveProperties, getSavedProperties, updateChatContext, getSavedChatContext } from "@/lib/services/storageService";
import { mockProperties } from "@/lib/data/mockProperties";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  properties?: Property[];
  showViewOnMap?: boolean;
  hasDotPrefix?: boolean;
}

const loadingPhrases = [
  "Searching through property database",
  "Filtering thousands of active listings",
  "Analyzing local market trends",
  "Finding your perfect results"
];

function LoadingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = loadingPhrases[phraseIndex];

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    } else {
      const typingSpeed = isDeleting ? 30 : 60;
      timeout = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mr-auto pl-2 py-2"
    >
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="w-2 h-2 bg-[#E57C35]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-[#E57C35]/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-[#E57C35] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      <span className="text-[#E57C35] font-medium text-xs sm:text-sm">
        {text}
        <span className="animate-[pulse_1s_ease-in-out_infinite] ml-0.5">|</span>
      </span>
    </motion.div>
  );
}

export default function AiSearchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<'hero' | 'centered' | 'sidebar'>('hero');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Split-screen results panel state
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('price-desc');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const cities = ['All', 'Brampton', 'Toronto', 'Mississauga'];
  const types = ['All', 'Detached', 'Condo', 'Semi-Detached'];

  const handleToggleFavorite = (propertyId: string, isFav: boolean) => {
    setFavorites((prev) => ({
      ...prev,
      [propertyId]: isFav,
    }));
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        const queryLower = searchQuery.toLowerCase().trim();
        const addressLower = (prop.address?.unparsedAddress || '').toLowerCase();
        const cityLower = (prop.address?.city || '').toLowerCase();
        const idLower = (prop.id || '').toLowerCase();

        const matchesQuery = searchQuery === '' ||
          addressLower.includes(queryLower) ||
          cityLower.includes(queryLower) ||
          idLower.includes(queryLower);

        const propCity = (prop.address?.city || '').trim().toLowerCase();
        const matchesCity = selectedCity === 'All' || propCity === selectedCity.toLowerCase();

        const subType = (prop.propertySubType || '').toLowerCase();
        const structType = Array.isArray(prop.structureType)
          ? prop.structureType.join(' ').toLowerCase()
          : (prop.structureType || '').toLowerCase();

        const matchesType = selectedType === 'All' ||
          (selectedType === 'Detached' && (structType.includes('detached') || subType.includes('detached') || subType.includes('house') || subType.includes('single family'))) ||
          (selectedType === 'Condo' && (subType.includes('condo') || subType.includes('apartment'))) ||
          (selectedType === 'Semi-Detached' && (subType.includes('semi')));

        return matchesQuery && matchesCity && matchesType;
      })
      .sort((a, b) => {
        const priceA = a.listPrice ?? 0;
        const priceB = b.listPrice ?? 0;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'beds-desc') {
          const bedsA = a.bedroomsTotal ?? 0;
          const bedsB = b.bedroomsTotal ?? 0;
          return bedsB - bedsA;
        }
        return 0;
      });
  }, [properties, searchQuery, selectedCity, selectedType, sortBy]);

  // Manage video ending cleanly
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const checkTime = () => {
      if (video.duration && video.currentTime >= video.duration - 0.5) {
        video.pause();
      } else {
        rafId = requestAnimationFrame(checkTime);
      }
    };

    video.addEventListener('play', () => {
      rafId = requestAnimationFrame(checkTime);
    });

    if (!video.paused) {
      rafId = requestAnimationFrame(checkTime);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [viewMode]);

  // Manage html/body class overrides for layout, backgrounds and scrollbar hiding
  useEffect(() => {
    document.documentElement.classList.add('ai-search-page');
    document.body.classList.add('ai-search-page');

    return () => {
      document.documentElement.classList.remove('ai-search-page');
      document.body.classList.remove('ai-search-page');
      document.documentElement.classList.remove('searched');
      document.body.classList.remove('searched');
    };
  }, []);

  useEffect(() => {
    if (viewMode !== 'hero') {
      document.documentElement.classList.add('searched');
      document.body.classList.add('searched');
    } else {
      document.documentElement.classList.remove('searched');
      document.body.classList.remove('searched');
    }
  }, [viewMode]);

  // Keep chat messages scroll area scrolled to bottom
  useEffect(() => {
    const scrollArea = chatScrollAreaRef.current;
    if (scrollArea) {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, viewMode]);

  // Load saved properties on mount if coming back to refine
  useEffect(() => {
    const saved = getSavedProperties();
    if (saved && saved.length > 0) {
      setProperties(saved);
      setViewMode('sidebar');
      setMessages([
        {
          id: `init-refine-${Date.now()}`,
          sender: "bot",
          text: `I've loaded your list of ${saved.length} properties. Let me know how you'd like to refine or narrow them down (e.g., "must have finished basement" or "under $800k in Brampton")!`,
          properties: saved,
          showViewOnMap: true
        }
      ]);
    }
  }, []);

  const sendMessageToBot = async (queryText: string) => {
    // If we're starting from hero, move to centered mode immediately while searching!
    if (viewMode === 'hero') {
      setViewMode('centered');
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: queryText
    };

    const currentMessages = [...messages, userMsg];
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const savedContext = getSavedChatContext() || {};
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery: queryText,
          context: savedContext
        })
      });

      const data = await res.json();
      setIsTyping(false);

      if (!res.ok || data.error) {
        let fallbackProps = properties.length > 0 ? properties : (getSavedProperties() || mockProperties);
        if (fallbackProps.length === 0) fallbackProps = mockProperties;
        saveProperties(fallbackProps);
        setProperties(fallbackProps);
        setViewMode('sidebar');

        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: data.error
            ? `Notice: ${data.error}. Displaying matching sample listings on the left!`
            : "I couldn't reach the live MLS database right now, but I've loaded matching sample listings on the left for you to explore!",
          properties: fallbackProps,
          showViewOnMap: true,
          hasDotPrefix: currentMessages.length > 1
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      if (data.contextUpdate) {
        try {
          updateChatContext(data.contextUpdate);
        } catch (storageError) {
          console.warn("Could not save chat context (possibly quota exceeded):", storageError);
        }
      }

      let botText = "I found some matching listings for you.";
      let newProperties: Property[] = data.properties || [];

      // Ensure whenever properties are returned in data, we save and update them
      if (newProperties && newProperties.length > 0) {
        saveProperties(newProperties);
        setProperties(newProperties);
      } else if (properties.length === 0) {
        // If no properties returned and state is empty, use mockProperties as fallback
        newProperties = mockProperties;
        saveProperties(newProperties);
        setProperties(newProperties);
      } else {
        newProperties = properties;
      }

      if (data.type === "property_search") {
        botText = `We found ${newProperties.length} properties matching your search. Displayed on the left!`;
      } else if (data.type === "text") {
        botText = data.content || botText;
      } else if (data.type === "refinement") {
        const existingProps = properties.length > 0 ? properties : (getSavedProperties() || mockProperties);
        if (data.propertyIds && existingProps.length > 0 && data.propertyIds.length > 0) {
          const matched = existingProps.filter(p => data.propertyIds.includes(p.id));
          if (matched.length === 0) {
            newProperties = existingProps;
            botText = "I couldn't narrow down to exact IDs for that filter, showing current matching properties on the left.";
          } else {
            newProperties = matched;
            botText = `I narrowed down the list to the ${newProperties.length} matching properties shown on the left.`;
            saveProperties(newProperties);
            setProperties(newProperties);
          }
        } else {
          botText = "I refined your search results on the left.";
        }
      } else if (data.type === "clarification") {
        const fields = data.missingFields?.join(', ') || 'details';
        botText = `I need a little more information. Could you please specify the following: ${fields}?`;
      } else if (data.content) {
        botText = data.content;
      }

      // Always transition to sidebar once we have properties so the user sees results!
      setViewMode('sidebar');

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: botText,
        properties: newProperties.length > 0 ? newProperties : undefined,
        showViewOnMap: newProperties.length > 0,
        hasDotPrefix: currentMessages.length > 1
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error calling chat API:", error);
      setIsTyping(false);
      let fallbackProps = properties.length > 0 ? properties : (getSavedProperties() || mockProperties);
      if (fallbackProps.length === 0) fallbackProps = mockProperties;
      saveProperties(fallbackProps);
      setProperties(fallbackProps);
      setViewMode('sidebar');

      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text: "Sorry, I encountered an error communicating with the search server. Displaying sample matching listings on the left!",
        properties: fallbackProps,
        showViewOnMap: true
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const queryText = inputValue;
    setInputValue("");
    sendMessageToBot(queryText);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInputValue("");
    sendMessageToBot(suggestionText);
  };

  const renderMessages = () => (
    messages.map((msg) => (
      <div key={msg.id} className="w-full flex flex-col">
        {msg.sender === "user" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[85%] bg-[#1E293B] text-white px-4.5 py-3 rounded-2xl rounded-br-sm text-sm sm:text-base font-medium ml-auto shadow-sm leading-relaxed"
          >
            {msg.text}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[94%] mr-auto flex flex-col items-start bg-white border border-neutral-200/80 rounded-2xl rounded-bl-sm p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#E57C35] mb-1.5 uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Realtor</span>
            </div>
            <div className="text-neutral-800 text-sm sm:text-base leading-relaxed font-normal">
              {msg.text}
            </div>

            {msg.properties && msg.properties.length > 0 && viewMode === 'sidebar' && (
              <div className="mt-3 w-full bg-orange-50 border border-orange-200/80 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-[#E57C35]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse flex-shrink-0" />
                  <span>Updated {msg.properties.length} listings displayed on left</span>
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    ))
  );

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className={`w-full flex flex-col justify-center transition-all duration-700 ease-in-out relative min-h-screen overflow-hidden ${
        viewMode === 'sidebar'
          ? "bg-[#fafafc] pt-[115px] pb-0"
          : viewMode === 'centered'
            ? "bg-gradient-to-b from-[#FFFDFB] via-[#fef4ed] to-[#FCE4D6] pt-[115px] pb-8"
            : "bg-gradient-to-b from-[#FCE4D6] from-30% via-[#fef4ed] to-white pt-24"
      }`}>

        {/* Stage 1: Slide-out Initial Hero Elements */}
        <AnimatePresence mode="popLayout">
          {viewMode === 'hero' && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -150,
                transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
              }}
              className="w-full flex flex-col items-center z-0"
            >
              {/* Ribbon Video */}
              <div className="w-full -mt-12 md:-mt-24 lg:-mt-92">
                <video
                  ref={videoRef}
                  src="/Ai-Page.webm"
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-auto mix-blend-multiply"
                />
              </div>

              {/* Text and Search Container */}
              <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center z-10 relative -mt-16 md:-mt-32 lg:-mt-96">
                <h1 className="text-5xl md:text-[80px] font-serif text-black leading-[1.1] tracking-tight mb-16">
                  Describe the home you are<br />looking for...
                </h1>

                <motion.div
                  layoutId="search-bar-container"
                  className="relative w-full max-w-[850px] mb-14"
                  transition={{ type: "spring", stiffness: 100, damping: 18 }}
                >
                  <form onSubmit={handleSearchSubmit} className="w-full">
                    <div className="relative flex items-center w-full bg-transparent border border-black rounded-full p-2 h-[75px] md:h-[85px]">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Try typing something..."
                        className="flex-1 bg-transparent border-none outline-none text-xl md:text-3xl text-black px-6 h-full placeholder:text-black/30"
                      />
                      <button
                        type="submit"
                        className="relative flex-shrink-0 flex items-center justify-center bg-[#E5A57A] border border-black h-full aspect-[1.3] rounded-[28px] hover:bg-[#D9956A] transition-colors cursor-pointer"
                      >
                        <Bot className="w-8 h-8 md:w-9 md:h-9 text-black stroke-[1.5]" />
                        <div className="absolute -bottom-1 -right-2 w-3.5 h-3.5 md:w-4 md:h-4 bg-[#e11d48] rounded-full animate-pulse"></div>
                      </button>
                    </div>
                  </form>
                </motion.div>

                <h2 className="text-2xl md:text-[34px] font-sans font-bold text-black tracking-tight">
                  Our AI will filter through thousands of results for you
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2 & 3: Continuously mounted chat box that slides & morphs across the screen when transitioning from centered to sidebar */}
        {viewMode !== 'hero' && (
          <div className="w-full h-[calc(100vh-115px)] flex flex-col lg:flex-row overflow-hidden relative z-10">
            {/* LEFT SIDE: RESULTS DISPLAY (Slides in cleanly when results arrive in sidebar mode) */}
            <AnimatePresence>
              {viewMode === 'sidebar' && (
                <motion.div
                  key="results-panel"
                  initial={{ opacity: 0, width: 0, x: -80 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -80 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col border-b lg:border-b-0 lg:border-r border-neutral-200"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {/* Header Block */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#E57C35]/15 flex items-center justify-center text-[#E57C35]">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                          AI Search Results
                        </h1>
                        <p className="text-sm text-neutral-500">
                          Live matching properties filtered by your AI conversation
                        </p>
                      </div>
                    </div>

                    {/* Quick Search inside results & Reset button */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Filter by address or ID..."
                          className="w-full bg-white border border-neutral-200 rounded-full py-2 px-4 pl-9 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#E57C35] text-sm shadow-sm"
                        />
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        onClick={() => {
                          setViewMode('hero');
                          setMessages([]);
                          setProperties([]);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold rounded-full border border-neutral-200 shadow-sm transition-all whitespace-nowrap cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        New AI Search
                      </button>
                    </div>
                  </div>

                  {/* Filter Bar Block */}
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 mt-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 shadow-sm flex-shrink-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filter By
                      </div>

                      {/* City Filter */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-neutral-500 font-medium">City:</span>
                        <div className="flex gap-1">
                          {cities.map((city) => (
                            <button
                              key={city}
                              onClick={() => setSelectedCity(city)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                selectedCity === city
                                  ? 'bg-[#E57C35] text-white shadow-sm'
                                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/60'
                              }`}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-4 w-px bg-neutral-200 mx-1 hidden sm:block"></div>

                      {/* Type Filter */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-neutral-500 font-medium">Type:</span>
                        <div className="flex gap-1">
                          {types.map((type) => (
                            <button
                              key={type}
                              onClick={() => setSelectedType(type)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                selectedType === type
                                  ? 'bg-[#E57C35] text-white shadow-sm'
                                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/60'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sorting / Results Count */}
                    <div className="flex items-center justify-between xl:justify-end gap-6 border-t xl:border-t-0 pt-3 xl:pt-0 border-neutral-100">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-600">
                        {filteredProperties.length} {filteredProperties.length === 1 ? 'result' : 'results'} found
                      </span>

                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold py-1.5 pl-2 pr-7 text-neutral-700 focus:outline-none focus:border-[#E57C35] cursor-pointer"
                        >
                          <option value="price-desc">Price: High to Low</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="beds-desc">Bedrooms: Most to Least</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Grid of PropertyCard items */}
                  {isTyping && filteredProperties.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mt-6 pb-12">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white border border-neutral-200 rounded-[20px] aspect-[4/3] p-4 animate-pulse flex flex-col justify-between shadow-sm">
                          <div className="w-full h-48 bg-neutral-100 rounded-xl"></div>
                          <div className="space-y-2 mt-4">
                            <div className="w-3/4 h-5 bg-neutral-200 rounded"></div>
                            <div className="w-1/2 h-4 bg-neutral-100 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mt-6 pb-12">
                      {filteredProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          onSelect={(prop) => setSelectedProperty(prop)}
                          onToggleFavorite={handleToggleFavorite}
                          isFavoriteInitial={!!favorites[property.id]}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center mt-6 flex flex-col items-center shadow-sm flex-1 justify-center max-h-[400px]">
                      <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4">
                        <RefreshCw className="w-8 h-8 animate-spin-slow" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-800">No matching properties right now</h3>
                      <p className="text-neutral-500 mt-2 text-sm max-w-md">
                        We couldn&apos;t find listings matching your exact filters. Try clearing your filters or asking the AI assistant on the right to widen your search!
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCity('All');
                          setSelectedType('All');
                        }}
                        className="mt-6 bg-[#E57C35] hover:bg-[#D96B24] text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-sm cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* RIGHT SIDE (OR CENTER): AI CHAT BOX (Continuously mounted, layout prop animates the slide across screen) */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className={
                viewMode === 'centered'
                  ? "w-full max-w-[950px] mx-auto my-auto bg-white border border-neutral-300 rounded-[32px] p-6 md:p-10 flex flex-col shadow-2xl relative h-[600px] max-h-[calc(100vh-9rem)] z-20 self-center"
                  : "w-full lg:w-[420px] xl:w-[450px] 2xl:w-[480px] flex-shrink-0 bg-white flex flex-col h-[550px] lg:h-full relative shadow-xl border-t lg:border-t-0 lg:border-l border-neutral-200 z-20"
              }
            >
              {/* Chat Box Header */}
              <motion.div layout className={`flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 flex-shrink-0 ${
                viewMode === 'sidebar' ? "px-5 pt-4 -mx-6 -mt-6 bg-neutral-50/80 rounded-t-3xl" : ""
              }`}>
                <div className="flex items-center gap-2.5 font-bold text-neutral-900">
                  <div className="w-8 h-8 rounded-xl bg-[#E57C35] flex items-center justify-center shadow-sm text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base leading-tight font-bold">AI Real Estate Assistant</div>
                    <div className="text-[11px] font-medium text-neutral-500 flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${viewMode === 'sidebar' ? 'bg-emerald-500' : 'bg-orange-400'} animate-pulse`}></span>
                      {viewMode === 'sidebar' ? 'Active • Narrowing your results' : 'Searching our database & analyzing matches...'}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Messages Scroll Area */}
              <div
                ref={chatScrollAreaRef}
                className={`flex-1 overflow-y-auto flex flex-col gap-4 rounded-2xl ${
                  viewMode === 'sidebar' ? "p-4 bg-[#F8FAFC]" : "pr-2 bg-[#F8FAFC] p-4"
                }`}
                style={{ scrollbarWidth: 'thin' }}
              >
                {renderMessages()}
                {isTyping && <LoadingIndicator />}
              </div>

              {/* Suggestion Chips (Only in Sidebar Mode when minimal messages) */}
              {viewMode === 'sidebar' && messages.length <= 2 && !isTyping && (
                <div className="px-4 py-2.5 bg-white border-t border-neutral-150 flex flex-wrap gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleSuggestionClick("Are there any semi-detached ones for cheaper?")}
                    className="bg-neutral-50 hover:bg-orange-50 text-neutral-700 hover:text-[#E57C35] border border-neutral-200 hover:border-orange-200 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer truncate max-w-full"
                  >
                    Are there any semi-detached ones for cheaper?
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Must have finished basement and garage")}
                    className="bg-neutral-50 hover:bg-orange-50 text-neutral-700 hover:text-[#E57C35] border border-neutral-200 hover:border-orange-200 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer truncate max-w-full"
                  >
                    Must have finished basement
                  </button>
                </div>
              )}

              {/* Input Form Box */}
              <motion.div layout className={`flex-shrink-0 ${viewMode === 'sidebar' ? "p-4 border-t border-neutral-200 bg-white" : "mt-6"}`}>
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <div className="relative flex items-center w-full bg-neutral-100 border border-neutral-300 focus-within:border-[#E57C35] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#E57C35]/20 rounded-2xl p-1.5 transition-all">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={viewMode === 'sidebar' ? "Continue talking to narrow down results..." : "Add details while we search (e.g. Brampton, detached)..."}
                      className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-neutral-900 px-3.5 py-2.5 placeholder:text-neutral-400"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={`flex-shrink-0 flex items-center justify-center bg-[#E57C35] hover:bg-[#D96B24] disabled:opacity-40 disabled:hover:bg-[#E57C35] text-white rounded-xl transition-all cursor-pointer shadow-sm ${
                        viewMode === 'sidebar' ? "w-10 h-10" : "w-12 h-12"
                      }`}
                    >
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </form>
                {viewMode === 'sidebar' && (
                  <div className="mt-2 text-[11px] text-neutral-400 text-center font-medium">
                    Try asking: &quot;Under $750k&quot;, &quot;In Brampton&quot;, or &quot;3+ bedrooms&quot;
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
      />
    </div>
  );
}

