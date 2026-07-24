'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WebinarBookingModal from './WebinarBookingModal';

export default function ResourcesSection() {
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);

  return (
    <section className="relative w-full bg-white pb-12 lg:pb-24 overflow-hidden pt-40">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-[#f6f8fa] rounded-3xl p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-8 lg:gap-12 w-full">
          {/* Left Side: Video */}
          <div className="h-auto w-[700px] relative rounded-lg overflow-hidden">
            <video
              src="/Hand Shake.webm"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Right Side: Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center pr-0 md:pr-8 lg:pr-12 text-center">
            <h3 className="text-3xl md:text-4xl lg:text-[40px] font-sans font-bold text-black mb-6 tracking-tight leading-tight">
              Make smarter and more informed decisions.
            </h3>
            <p className="font-serif text-[18px] lg:text-[20px] text-[#3f3f46] mb-10 leading-relaxed">
              Whether you're a first-time homebuyer or a seasoned investor, our library of free resources has you covered. Sign up to get our latest guides sent directly to your inbox, or join one of our upcoming live webinars to learn from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setIsWebinarModalOpen(true)}
                className="bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white px-8 py-3 md:py-4 rounded-xl font-semibold text-[15px] lg:text-base tracking-wide h-fit shadow-md hover:shadow-lg cursor-pointer"
              >
                Free Webinar
              </button>
              <Link
                href="/learn"
                className="bg-black hover:bg-gray-800 transition-colors text-white px-8 py-3 md:py-4 rounded-xl font-semibold text-[15px] lg:text-base tracking-wide h-fit cursor-pointer flex items-center justify-center text-center"
              >
                Free Resources
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Free Webinar Booking Modal */}
      <WebinarBookingModal
        isOpen={isWebinarModalOpen}
        onClose={() => setIsWebinarModalOpen(false)}
      />
    </section>
  );
}
