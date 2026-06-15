'use client';

import Spline from '@splinetool/react-spline';
import AiRealtor from './components/AiRealtor';
import RentOrBuy from './components/RentOrBuy';
import ResourcesSection from './components/ResourcesSection';
import DealsMarket from './components/DealsMarket';
import ConsultationSection from './components/ConsultationSection';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <main className="relative w-full overflow-hidden bg-white min-h-screen">
        {/* Background Spline */}
        <div className="absolute inset-0 z-0">
          <Spline scene="https://prod.spline.design/CeYjA1n1a4bMH2hR/scene.splinecode" />
        </div>

        {/* SVG Curve overlaid */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M -5 100 Q 25 45 48 70 T 70 40"
              fill="none"
              stroke="black"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* 3 Glass Spheres tracking the path */}
          <div
            className="absolute left-[25%] top-[63%] group pointer-events-auto flex items-center"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <button
              onClick={() => document.getElementById('airealtor')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] rounded-full backdrop-blur-lg border border-white/40 bg-gradient-to-br from-white/30 via-[rgba(242,80,21,0.1)] to-[rgba(242,80,21,0.3)] shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),0_20px_25px_rgba(0,0,0,0.15)] cursor-pointer group-hover:scale-110 group-hover:shadow-[0_25px_35px_rgba(242,80,21,0.2)] transition-all duration-300"
              aria-label="Scroll to AI Realtor"
            />
            <span className="absolute left-full ml-4 px-4 py-2 bg-white/90 backdrop-blur-md text-black font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg border border-white/50 text-sm md:text-base translate-x-[-10px] group-hover:translate-x-0">
              AI Realtor
            </span>
          </div>

          <div
            className="absolute left-[46%] top-[68%] group pointer-events-auto flex items-center"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <button
              onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-[50px] h-[50px] md:w-[65px] md:h-[65px] rounded-full backdrop-blur-md border border-white/40 bg-gradient-to-br from-white/30 via-[rgba(242,80,21,0.1)] to-[rgba(242,80,21,0.3)] shadow-[inset_0_3px_6px_rgba(255,255,255,0.4),0_15px_20px_rgba(0,0,0,0.15)] cursor-pointer group-hover:scale-110 group-hover:shadow-[0_20px_30px_rgba(242,80,21,0.2)] transition-all duration-300"
              aria-label="Scroll to Resources"
            />
            <span className="absolute left-full ml-4 px-4 py-2 bg-white/90 backdrop-blur-md text-black font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg border border-white/50 text-sm md:text-base translate-x-[-10px] group-hover:translate-x-0">
              Resources
            </span>
          </div>

          <div
            className="absolute left-[64%] top-[76%] group pointer-events-auto flex items-center"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <button
              onClick={() => document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-[35px] h-[35px] md:w-[45px] md:h-[45px] rounded-full backdrop-blur-sm border border-white/40 bg-gradient-to-br from-white/30 via-[rgba(242,80,21,0.1)] to-[rgba(242,80,21,0.3)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_10px_15px_rgba(0,0,0,0.15)] cursor-pointer group-hover:scale-110 group-hover:shadow-[0_15px_20px_rgba(242,80,21,0.2)] transition-all duration-300"
              aria-label="Scroll to Consultation"
            />
            <span className="absolute left-full ml-4 px-4 py-2 bg-white/90 backdrop-blur-md text-black font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg border border-white/50 text-sm md:text-base translate-x-[-10px] group-hover:translate-x-0">
              Consultation
            </span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 w-full max-w-7xl mx-auto pointer-events-none">
          {/* Text Container */}
          <div className="absolute top-[12%] lg:top-[16%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-full px-4 pointer-events-none">
            <h2 className="text-5xl md:text-6xl lg:text-[80px] leading-tight font-serif text-black mb-[-10px] tracking-tight">
              Welcome To
            </h2>
            <h3 className="text-5xl md:text-6xl lg:text-[80px] leading-tight font-sans font-medium text-black tracking-tight">
              Boyal Blueprint
            </h3>

            <p className="mt-6 text-xl md:text-2xl font-serif text-black font-light">
              A Clear Path to Home Ownership.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button className="bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-[0_4px_10px_rgba(249,115,22,0.3)] pointer-events-auto">
                Get Started
              </button>
              <button className="bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-[0_4px_10px_rgba(249,115,22,0.3)] pointer-events-auto">
                Our Services
              </button>
            </div>
          </div>
        </div>

        {/* Floating Video House */}
        <div className="absolute left-[50%] lg:left-[52%] top-[42%] lg:top-[47%] -translate-y-1/2 z-20 pointer-events-none">
          <video
            src="/Home Page Concept 1_1_prob4.webm"
            autoPlay
            muted
            playsInline
            className="w-[500px] md:w-[700px] lg:w-[850px] h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)]"
          />
        </div>
      </main>

      <div id="airealtor" className="w-full scroll-mt-20"><AiRealtor /></div>
      <RentOrBuy />
      <div id="resources" className="w-full scroll-mt-20"><ResourcesSection /></div>
      <DealsMarket />
      <div id="consultation" className="w-full scroll-mt-20"><ConsultationSection /></div>
    </div>
  );
}
