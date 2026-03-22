'use client';

import Spline from '@splinetool/react-spline';
import AiRealtor from './components/AiRealtor';

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
              d="M -5 100 Q 25 45 48 70 T 80 62"
              fill="none"
              stroke="black"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* 3 Metallic Spheres tracking the path */}
          <div className="absolute left-[20%] top-[67%] w-[70px] h-[70px] md:w-[90px] md:h-[90px] rounded-full shadow-[0_20px_25px_rgba(0,0,0,0.15)] pointer-events-auto"
            style={{ background: 'radial-gradient(circle at 35% 35%, #fff1eb 0%, #facaba 40%, #dba090 70%, #9a6659 100%)', transform: 'translate(-50%, -50%)' }} />

          <div className="absolute left-[48%] top-[70%] w-[50px] h-[50px] md:w-[65px] md:h-[65px] rounded-full shadow-[0_15px_20px_rgba(0,0,0,0.15)] pointer-events-auto"
            style={{ background: 'radial-gradient(circle at 35% 35%, #fff1eb 0%, #facaba 40%, #dba090 70%, #9a6659 100%)', transform: 'translate(-50%, -50%)' }} />

          <div className="absolute left-[75%] top-[74%] w-[35px] h-[35px] md:w-[45px] md:h-[45px] rounded-full shadow-[0_10px_15px_rgba(0,0,0,0.15)] pointer-events-auto"
            style={{ background: 'radial-gradient(circle at 35% 35%, #fff1eb 0%, #facaba 40%, #dba090 70%, #9a6659 100%)', transform: 'translate(-50%, -50%)' }} />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 w-full max-w-7xl mx-auto pointer-events-none">
          {/* Text Container */}
          <div className="absolute top-[12%] lg:top-[16%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-full px-4 pointer-events-auto">
            <h1 className="text-6xl md:text-[85px] leading-[1.05] font-serif text-black font-medium tracking-tight">
              Welcome To<br />
              Boyal Blueprint
            </h1>

            <p className="mt-6 text-xl md:text-2xl font-serif text-black">
              A Clear Path to Home Ownership.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button className="bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-[0_4px_10px_rgba(249,115,22,0.3)]">
                Get Started
              </button>
              <button className="bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-[0_4px_10px_rgba(249,115,22,0.3)]">
                Our Services
              </button>
            </div>
          </div>
        </div>

        {/* Floating Video House */}
        <div className="absolute right-[0%] lg:-right-[5%] top-[45%] lg:top-[40%] -translate-y-1/2 z-20 pointer-events-none">
          <video
            src="/Home Page Concept 1_1_prob4.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-[500px] md:w-[700px] lg:w-[850px] h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)]"
          />
        </div>
      </main>

      <AiRealtor />
    </div>
  );
}
