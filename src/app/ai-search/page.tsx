'use client';

import Link from "next/link";
import Image from "next/image";
import { Bot, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropertyDetailsModal from "../components/PropertyDetailsModal";

interface MockProperty {
  id: string;
  mockId: number;
  address: {
    unparsedAddress: string;
    city: string;
    stateOrProvince: string;
    postalCode: string;
  };
  listPrice: number;
  bedroomsAboveGrade: number;
  bathroomsTotal: number;
  propertySubType: string;
  approximateAge: string;
  lotSizeArea: number | null;
  rawSqftTotal: number;
  associationFee: number | null;
  propertyFeatures: string[];
  mediaImages: string[];
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  properties?: MockProperty[];
  showViewOnMap?: boolean;
  hasDotPrefix?: boolean;
}

// Mock properties matching "2 bedroom 2 bathroom house in Toronto under 500K"
const torontoMockProperties: MockProperty[] = [
  {
    id: "TOR-1",
    mockId: 1,
    address: {
      unparsedAddress: "102 Bloor St W #804",
      city: "Toronto",
      stateOrProvince: "ON",
      postalCode: "M5S 1M8"
    },
    listPrice: 489000,
    bedroomsAboveGrade: 2,
    bathroomsTotal: 2,
    propertySubType: "Condo Apartment",
    approximateAge: "2012",
    lotSizeArea: null,
    rawSqftTotal: 850,
    associationFee: 480,
    propertyFeatures: ["MODERN KITCHEN", "BALCONY WITH VIEW", "24/7 SECURITY"],
    mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
  },
  {
    id: "TOR-2",
    mockId: 2,
    address: {
      unparsedAddress: "55 Front St E #1201",
      city: "Toronto",
      stateOrProvince: "ON",
      postalCode: "M5E 1B3"
    },
    listPrice: 499000,
    bedroomsAboveGrade: 2,
    bathroomsTotal: 2,
    propertySubType: "Condo Apartment",
    approximateAge: "2015",
    lotSizeArea: null,
    rawSqftTotal: 900,
    associationFee: 520,
    propertyFeatures: ["OPEN CONCEPT LAYOUT", "GRANITE COUNTERTOPS", "CLOSE TO SUBWAY"],
    mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
  },
  {
    id: "TOR-3",
    mockId: 3,
    address: {
      unparsedAddress: "25 The Esplanade #405",
      city: "Toronto",
      stateOrProvince: "ON",
      postalCode: "M5E 1W5"
    },
    listPrice: 475000,
    bedroomsAboveGrade: 2,
    bathroomsTotal: 2,
    propertySubType: "Condo Apartment",
    approximateAge: "2010",
    lotSizeArea: null,
    rawSqftTotal: 820,
    associationFee: 460,
    propertyFeatures: ["ROOFTOP PATIO ACCESS", "PARKING INCLUDED", "HARDWOOD FLOORS"],
    mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
  },
  {
    id: "TOR-4",
    mockId: 4,
    address: {
      unparsedAddress: "80 Queens Quay W #1509",
      city: "Toronto",
      stateOrProvince: "ON",
      postalCode: "M5J 2Y5"
    },
    listPrice: 495000,
    bedroomsAboveGrade: 2,
    bathroomsTotal: 2,
    propertySubType: "Condo Apartment",
    approximateAge: "2018",
    lotSizeArea: null,
    rawSqftTotal: 880,
    associationFee: 510,
    propertyFeatures: ["LAKE VIEW", "FLOOR TO CEILING WINDOWS", "STAINLESS STEEL APPLIANCES"],
    mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
  },
  {
    id: "TOR-5",
    mockId: 5,
    address: {
      unparsedAddress: "15 Fort York Blvd #2208",
      city: "Toronto",
      stateOrProvince: "ON",
      postalCode: "M5V 3Y3"
    },
    listPrice: 460000,
    bedroomsAboveGrade: 2,
    bathroomsTotal: 2,
    propertySubType: "Condo Apartment",
    approximateAge: "2014",
    lotSizeArea: null,
    rawSqftTotal: 800,
    associationFee: 490,
    propertyFeatures: ["IN-SUITE LAUNDRY", "INDOOR POOL ACCESS", "WALK-IN CLOSET"],
    mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
  }
];

// Mock properties matching "semi-detached ones for cheaper"
const semiDetachedMockProperties: MockProperty[] = [
  {
    id: "SEMI-1",
    mockId: 1,
    address: {
      unparsedAddress: "12 Skyview Dr",
      city: "Brampton",
      stateOrProvince: "ON",
      postalCode: "L6R 2K1"
    },
    listPrice: 420000,
    bedroomsAboveGrade: 2,
    bathroomsTotal: 2,
    propertySubType: "Semi-Detached",
    approximateAge: "2002",
    lotSizeArea: 2500,
    rawSqftTotal: 1100,
    associationFee: null,
    propertyFeatures: ["PRIVATE BACKYARD", "NEW ROOF (2021)", "SPACIOUS DRIVEWAY"],
    mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
  },
  {
    id: "SEMI-2",
    mockId: 2,
    address: {
      unparsedAddress: "45 Meadowvale Rd",
      city: "Scarborough",
      stateOrProvince: "ON",
      postalCode: "M1C 1S7"
    },
    listPrice: 435000,
    bedroomsAboveGrade: 2,
    bathroomsTotal: 2,
    propertySubType: "Semi-Detached",
    approximateAge: "1995",
    lotSizeArea: 3000,
    rawSqftTotal: 1200,
    associationFee: null,
    propertyFeatures: ["FINISHED BASEMENT", "CLOSE TO PARKS", "UPGRADED BATHROOMS"],
    mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
  },
  {
    id: "SEMI-3",
    mockId: 3,
    address: {
      unparsedAddress: "88 Derry Rd E",
      city: "Mississauga",
      stateOrProvince: "ON",
      postalCode: "L4T 1A1"
    },
    listPrice: 415000,
    bedroomsAboveGrade: 2,
    bathroomsTotal: 2,
    propertySubType: "Semi-Detached",
    approximateAge: "1998",
    lotSizeArea: 2800,
    rawSqftTotal: 1150,
    associationFee: null,
    propertyFeatures: ["RENO KITCHEN", "POT LIGHTS", "DECK IN YARD"],
    mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
  }
];

export default function AiSearchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<MockProperty | null>(null);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const queryText = inputValue;
    setInputValue("");

    if (!isSearched) {
      // First Search transition
      setIsSearched(true);

      // Add user message
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        sender: "user",
        text: queryText
      };
      setMessages([userMsg]);

      // Trigger typing state
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const botMsg: Message = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "We found these 5 properties that match your criteria, would you like to view them on the map?",
          properties: torontoMockProperties,
          showViewOnMap: true
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1200);

    } else {
      // Follow-up search
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        sender: "user",
        text: queryText
      };
      setMessages(prev => [...prev, userMsg]);

      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        // Custom replies based on search queries
        const isSemiDetachedQuery = queryText.toLowerCase().includes("semi-detached") || queryText.toLowerCase().includes("semi detached") || queryText.toLowerCase().includes("cheaper");

        const botMsg: Message = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: isSemiDetachedQuery
            ? "I updated the map view with some more results, take a look!"
            : "I searched for options matching your updated criteria. Take a look at these new options!",
          properties: isSemiDetachedQuery ? semiDetachedMockProperties : torontoMockProperties.slice(0, 3),
          showViewOnMap: false,
          hasDotPrefix: true
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1200);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInputValue(suggestionText);
    // Submit query
    if (!isSearched) {
      setIsSearched(true);
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        sender: "user",
        text: suggestionText
      };
      setMessages([userMsg]);
      setInputValue("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botMsg: Message = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "We found these 5 properties that match your criteria, would you like to view them on the map?",
          properties: torontoMockProperties,
          showViewOnMap: true
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1200);
    } else {
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        sender: "user",
        text: suggestionText
      };
      setMessages(prev => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botMsg: Message = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "I updated the map view with some more results, take a look!",
          properties: semiDetachedMockProperties,
          showViewOnMap: false,
          hasDotPrefix: true
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1200);
    }
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
                            {msg.properties.map((prop) => (
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
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* View on Map dashed link */}
                        {msg.showViewOnMap && (
                          <button
                            onClick={() => alert("To view these properties, click on a house thumbnail to see detailed pricing and MLS features.")}
                            className="text-[#E57C35] font-bold text-base md:text-lg border-b border-dashed border-[#E57C35] pb-0.5 hover:opacity-80 transition-opacity mt-1 cursor-pointer"
                          >
                            View on map
                          </button>
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
