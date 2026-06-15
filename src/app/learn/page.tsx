"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function LearnPage() {
  const handleDownloadResources = () => {
    const files = [
      '/learn-mortgage.pdf',
      '/learn-down-payments.pdf',
      '/learn-realtors.pdf'
    ];

    files.forEach((file, index) => {
      // Small delay to ensure the browser processes all downloads
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file;
        link.download = file.split('/').pop() || '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      {/* Top Split Hero Section */}
      <section className="flex flex-col md:flex-row min-h-[600px] w-full pt-16 md:pt-0">
        {/* Left Side - Gradient Background */}
        <div className="md:w-1/2 w-full bg-gradient-to-b from-[#bde2fa] via-[#e2eaf4] to-[#f8ecd0] relative flex items-center justify-center p-8 md:p-12 lg:min-h-[75vh]">
          {/* Card Stack */}
          <div className="relative w-full max-w-[420px] mx-auto z-10 mt-10 md:mt-0">
            {/* Background cards for stack effect */}
            <div className="absolute inset-0 bg-white/70 rounded-xl translate-y-2 scale-x-[0.95] shadow-sm" />

            {/* Main Card */}
            <div className="relative bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 flex gap-5 items-center border border-gray-50 z-10">
              <div className="relative w-[140px] h-[140px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src="/house_placeholder.png"
                  alt="Terrain"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className="bg-[#fcf04c] text-black text-[11px] font-bold px-4 py-1.5 rounded-full mb-3">
                  Savings
                </span>
                <h3 className="font-bold text-xl leading-tight mb-4 text-black pr-2">
                  Don't Get Caught With Hidden Fees
                </h3>
                <a
                  href="/learn-hidden-fees.pdf"
                  download="learn-hidden-fees.pdf"
                  className="text-sm font-bold flex items-center gap-1.5 hover:underline text-black"
                >
                  Download PDF <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="md:w-1/2 w-full bg-white flex items-center p-8 md:p-16 lg:p-24">
          <div className="max-w-xl">


            <p className="text-gray-500 font-medium mb-4 text-lg font-serif">Free Resources</p>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-black leading-[1.05] tracking-tight mb-10">
              Access free resources that jump start your home-buying journey
            </h1>
            <button
              onClick={handleDownloadResources}
              className="bg-[#f97316] hover:bg-orange-600 text-white font-semibold py-3.5 px-8 rounded-lg transition-colors text-lg shadow-sm"
            >
              Get Resources
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#f8f9fc] rounded-[24px] p-10 shadow-sm border border-gray-50/50">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black mb-8"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2v10"></path>
            </svg>
            <h3 className="text-[16px] tracking-tight font-bold text-black mb-4 leading-snug whitespace-nowrap">
              Understanding Your Down Payment
            </h3>
            <p className="text-gray-700 font-serif text-[16px] leading-relaxed">
              We believe better decisions start with better data—measured, visible, and
              trusted.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f8f9fc] rounded-[24px] p-10 shadow-sm border border-gray-50/50">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black mb-8"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              <path d="M2 12h20"></path>
            </svg>
            <h3 className="text-[16px] tracking-tight font-bold text-black mb-4 leading-snug whitespace-nowrap">
              Finding Your Right Mortgage
            </h3>
            <p className="text-gray-700 font-serif text-[16px] leading-relaxed">
              We build tools that help teams connect the dots between operations, impact,
              and accountability.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f8f9fc] rounded-[24px] p-10 shadow-sm border border-gray-50/50">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black mb-8"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 16L16 8"></path>
              <path d="M8 8h8v8"></path>
            </svg>
            <h3 className="text-[16px] tracking-tight font-bold text-black mb-4 leading-snug whitespace-nowrap">
              Don't Get Caught With Hidden Fees
            </h3>
            <p className="text-gray-700 font-serif text-[16px] leading-relaxed">
              We support real-world momentum—helping organizations move from ambition to
              measurable change.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
