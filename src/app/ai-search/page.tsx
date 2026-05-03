'use client';

import Link from "next/link";
import { Bot } from "lucide-react";
import { useEffect, useRef } from "react";

export default function AiSearchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const checkTime = () => {
      // Stop the video 0.5 seconds before the very end. 
      // This ensures we freeze on a fully visible frame before any blank frames or native end behavior occurs.
      if (video.duration && video.currentTime >= video.duration - 0.5) {
        video.pause();
      } else {
        rafId = requestAnimationFrame(checkTime);
      }
    };

    video.addEventListener('play', () => {
      rafId = requestAnimationFrame(checkTime);
    });

    // If it's already playing by the time this runs
    if (!video.paused) {
      rafId = requestAnimationFrame(checkTime);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Area */}
      <main className="flex-1 w-full bg-gradient-to-b from-[#FCE4D6] from-30% via-[#fef4ed] to-white flex flex-col pt-24">
        {/* Ribbon Video - Pulling it up slightly to overlap with the empty top space */}
        <div className="w-full -mt-12 md:-mt-24 lg:-mt-92 z-0">
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
        <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center -mt-16 md:-mt-32 lg:-mt-96 pb-20 z-10 relative">
          <h1 className="text-5xl md:text-[80px] font-serif text-black leading-[1.1] tracking-tight mb-16">
            Describe the home you are<br />looking for...
          </h1>

          {/* Search Input Container */}
          <div className="relative w-full max-w-[850px] mb-14">
            <div className="relative flex items-center w-full bg-transparent border border-black rounded-full p-2 h-[75px] md:h-[85px]">
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-xl md:text-3xl text-black px-6 h-full"
              />
              <button className="relative flex-shrink-0 flex items-center justify-center bg-[#E5A57A] border border-black h-full aspect-[1.3] rounded-[28px] hover:bg-[#D9956A] transition-colors">
                <Bot className="w-8 h-8 md:w-9 md:h-9 text-black stroke-[1.5]" />
                {/* Red notification dot */}
                <div className="absolute -bottom-1 -right-2 w-3.5 h-3.5 md:w-4 md:h-4 bg-[#e11d48] rounded-full"></div>
              </button>
            </div>
          </div>

          <h2 className="text-2xl md:text-[34px] font-sans font-bold text-black tracking-tight">
            Our AI will filter through thousands of results for you
          </h2>
        </div>
      </main>

    </div>
  );
}
