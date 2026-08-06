import React from 'react';

export default function ConsultationSection() {
  return (
    <section className="relative w-full bg-white pb-20 pt-10 overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 md:px-8 border border-[#f97316] pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-6 ">

          {/* Left Column */}
          <div className="w-full flex items-end justify-center overflow-hidden min-h-[400px] lg:min-h-[500px]">
            <img
              src="/realtor-image2.png"
              alt="Kultej Boyal"
              className="w-full h-auto object-contain object-bottom -mb-4"
            />
          </div>

          {/* Right Column */}
          <div className="w-full flex items-start justify-center pt-0 md:pt-0">
            <div className="w-full max-w-[700px] flex flex-col">
              <div className="bg-white w-full aspect-square flex flex-col items-center justify-center text-center px-8 md:px-12 lg:px-16 pb-32">
                <img
                  src="/certified.png"
                  alt="Certified"
                  className="w-100 aspect-[16/9] z-10 mb-8"
                />
                <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-sans font-semibold text-black leading-[1.15] tracking-tight mb-8">
                  Free consultation with <br className="hidden sm:block" /> a Real Estate expert
                </h2>
                <button className="bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white px-8 py-3 rounded-xl font-semibold text-[16px]">
                  Contact an Expert
                </button>
              </div>

              <div className="mt-8 flex flex-col items-right text-right">
                <h3 className="text-xl lg:text-[22px] font-semibold text-[#f97316] font-sans tracking-tight mb-1">Kultej Boyal</h3>
                <p className="text-[16px] lg:text-[18px] text-black font-serif">Co-Founder, Boyal Realty Group</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
