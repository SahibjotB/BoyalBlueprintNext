'use client';

import Link from "next/link";
import Image from "next/image";
import { Bot, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropertyDetailsModal from "../components/PropertyDetailsModal";
import { Property } from "@/lib/types/property";
import { saveProperties, getSavedProperties, updateChatContext, getSavedChatContext } from "@/lib/services/storageService";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  properties?: Property[];
  showViewOnMap?: boolean;
  hasDotPrefix?: boolean;
}

export default function AiSearchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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
  }, [isSearched]);

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
    if (isSearched) {
      document.documentElement.classList.add('searched');
      document.body.classList.add('searched');
    } else {
      document.documentElement.classList.remove('searched');
      document.body.classList.remove('searched');
    }
  }, [isSearched]);

  // Keep chat messages scroll area scrolled to bottom
  useEffect(() => {
    const scrollArea = chatScrollAreaRef.current;
    if (scrollArea) {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  // Load saved properties on mount if coming back to refine
  useEffect(() => {
    const saved = getSavedProperties();
    if (saved && saved.length > 0) {
      setIsSearched(true);
      setMessages([
        {
          id: `init-refine-${Date.now()}`,
          sender: "bot",
          text: `I've loaded your list of ${saved.length} properties. Let me know how you'd like to refine or narrow them down (e.g., "must have finished basement" or "with a garage")!`,
          properties: saved,
          showViewOnMap: true
        }
      ]);
    }
  }, []);

  const sendMessageToBot = async (queryText: string) => {
    if (!isSearched) {
      setIsSearched(true);
    }

    // Add user message
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

      if (data.contextUpdate) {
        try {
          updateChatContext(data.contextUpdate);
        } catch (storageError) {
          console.warn("Could not save chat context (possibly quota exceeded):", storageError);
        }
      }

      let botText = "I found some matching listings for you.";
      let properties: Property[] = [];

      if (data.type === "property_search") {
        properties = data.properties || [];
        botText = `We found ${properties.length} properties that match your criteria.`;
        saveProperties(properties);
      } else if (data.type === "text") {
        botText = data.content;
      } else if (data.type === "refinement") {
        const existingProps = messages.flatMap(m => m.properties || []);
        if (data.propertyIds && existingProps.length > 0) {
          properties = existingProps.filter(p => data.propertyIds.includes(p.id));
          botText = `I refined the list to the ${properties.length} matching properties.`;
          saveProperties(properties);
        } else {
          botText = "I refined your search results.";
        }
      } else if (data.type === "clarification") {
        const fields = data.missingFields?.join(', ') || 'details';
        botText = `I need a little more information. Could you please specify the following: ${fields}?`;
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: botText,
        properties: properties.length > 0 ? properties : undefined,
        showViewOnMap: properties.length > 0,
        hasDotPrefix: currentMessages.length > 1
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error calling chat API:", error);
      setIsTyping(false);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text: "Sorry, I encountered an error searching for listings. Please try again."
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

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className={`w-full flex flex-col justify-center transition-all duration-1000 ease-in-out relative h-screen overflow-hidden ${isSearched
        ? "bg-gradient-to-b from-[#FFFDFB] via-[#fef4ed] to-[#FCE4D6] pt-24 pb-8"
        : "bg-gradient-to-b from-[#FCE4D6] from-30% via-[#fef4ed] to-white pt-24"
        }`}>

        {/* Slide-out Initial Elements */}
        <AnimatePresence mode="popLayout">
          {!isSearched && (
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

              {/* Text and Search Container (Pulled up to overlay the video) */}
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

        {/* Outer Grid/Flex Container for Content (Only shown when searched) */}
        {isSearched && (
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-10 relative px-4">
            {/* Chat Box View (First Screenshot Style) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="w-full max-w-[950px] bg-white border border-neutral-300 rounded-[32px] p-6 md:p-10 flex flex-col shadow-sm relative h-[600px] max-h-[calc(100vh-9rem)]"
            >
              {/* Chat Message Scroll Area */}
              <div
                ref={chatScrollAreaRef}
                className="flex-1 overflow-y-auto mb-6 pr-2 flex flex-col gap-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >

                {messages.map((msg) => (
                  <div key={msg.id} className="w-full flex flex-col">
                    {msg.sender === "user" ? (
                      /* User Bubble */
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[85%] bg-[#F1F3F5] text-black px-6 py-4 rounded-[28px] rounded-br-[8px] text-lg md:text-xl font-medium ml-auto shadow-sm"
                      >
                        {msg.text}
                      </motion.div>
                    ) : (
                      /* Bot Message (Orange text, thumbnails, View on Map link) */
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[90%] mr-auto flex flex-col items-start"
                      >
                        <div className="text-[#E57C35] text-lg md:text-xl font-bold tracking-tight flex items-start leading-snug">
                          {msg.hasDotPrefix && (
                            <span className="w-3.5 h-3.5 bg-[#E57C35] rounded-full inline-block mr-3.5 mt-1.5 flex-shrink-0"></span>
                          )}
                          <span>{msg.text}</span>
                        </div>

                        {/* Property Thumbnails list */}
                        {msg.properties && msg.properties.length > 0 && (
                          <div className="flex gap-4 overflow-x-auto py-3 my-2 w-full scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {msg.properties.slice(0, 4).map((prop) => (
                              <div
                                key={prop.id}
                                onClick={() => setSelectedProperty(prop)}
                                className="flex flex-col min-w-[130px] md:min-w-[155px] cursor-pointer group flex-shrink-0 transition-transform duration-300 hover:scale-105"
                              >
                                <div className="relative w-32 h-22 md:w-38 md:h-26 overflow-hidden rounded-[16px] border border-gray-150 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                  <Image
                                    src={prop.mediaImages?.[0] || "/house_placeholder.png"}
                                    alt={prop.address?.unparsedAddress || "Property"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 130px, 155px"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* View all matches link */}
                        {msg.properties && msg.properties.length > 0 && (
                          <Link
                            href="/ai-result"
                            className="text-[#E57C35] font-bold text-base md:text-lg border-b border-dashed border-[#E57C35] pb-0.5 hover:opacity-80 transition-opacity mt-1 cursor-pointer inline-block"
                          >
                            View all
                          </Link>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}

                {/* Bot Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 mr-auto pl-4 py-2">
                    <span className="w-2.5 h-2.5 bg-[#E57C35]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-[#E57C35]/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-[#E57C35] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                )}
              </div>

              {/* Suggestion pills if showing first search reply */}
              {messages.length === 2 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2.5 mb-6"
                >
                  <button
                    onClick={() => handleSuggestionClick("Are there any semi-detached ones for cheaper?")}
                    className="bg-orange-50/70 hover:bg-orange-100/90 text-[#E57C35] border border-orange-200/80 rounded-full px-5 py-2.5 text-base font-bold transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Are there any semi-detached ones for cheaper?
                  </button>
                </motion.div>
              )}

              {/* Chat Input Field (Morphed Search Bar) */}
              <motion.div
                layoutId="search-bar-container"
                className="w-full"
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
              >
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <div className="relative flex items-center w-full bg-transparent border border-black rounded-full p-2 h-[75px] md:h-[85px]">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask a follow-up or try typing something..."
                      className="flex-1 bg-transparent border-none outline-none text-xl md:text-3xl text-black px-6 h-full placeholder:text-black/30"
                    />
                    <button
                      type="submit"
                      className="relative flex-shrink-0 flex items-center justify-center bg-[#E5A57A] border border-black h-full aspect-[1.3] rounded-[28px] hover:bg-[#D9956A] transition-colors cursor-pointer"
                    >
                      <Bot className="w-8 h-8 md:w-9 md:h-9 text-black stroke-[1.5]" />
                    </button>
                  </div>
                </form>
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
