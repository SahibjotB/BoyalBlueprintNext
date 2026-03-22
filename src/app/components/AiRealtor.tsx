import React from 'react';

const features = [
  {
    number: '001',
    title: 'Track',
    description: 'Find listings catered to your needs.',
  },
  {
    number: '002',
    title: 'Save',
    description: 'Collect listings for you to return to.',
  },
  {
    number: '003',
    title: 'Consult',
    description: 'Instantly schedule a meeting with a professional realtor.',
  },
  {
    number: '004',
    title: 'Ask',
    description: 'Our AI will help you plan, no matter what stage you are in.',
  }
];

export default function AiRealtor() {
  return (
    <section className="relative w-full bg-white pt-24 pb-32">
      {/* Faint dot background pattern over the bottom portion */}
      <div
        className="absolute inset-x-0 bottom-0 h-[250px] pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl md:text-[40px] font-bold tracking-tight text-center mb-16 text-black">
          Your Free Personal AI Realtor
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left: AI Image Placeholder */}
          <div className="w-full flex justify-center items-center mt-6">
            <div className="relative w-full max-w-[450px] aspect-[4/3] flex items-center justify-center">
              {/* Replace with the actual SVG once saved to public folder */}
              <img
                src="/ai-robot.svg"
                alt="AI Realtor Robot"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = "w-full h-[300px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center text-gray-500 font-medium";
                  fallback.innerHTML = "Please save the SVG code you pasted as<br/><strong class='text-black relative z-20 mt-2'>public/ai-robot.svg</strong><br/>to display the robot graphic here!";
                  e.currentTarget.parentElement?.appendChild(fallback);
                }}
              />
            </div>
          </div>

          {/* Right: Features List */}
          <div className="w-full flex flex-col pl-0 lg:pl-4">
            {features.map((feature, idx) => (
              <div key={idx} className="border-t border-gray-200 py-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[22px] font-bold text-black">{feature.title}</h3>
                  <span className="text-sm font-mono tracking-widest text-[#a1a1aa]">{feature.number}</span>
                </div>
                <p className="text-[#3f3f46] text-lg font-serif">
                  {feature.description}
                </p>
              </div>
            ))}

            {/* Button Container */}
            <div className="border-t border-gray-200 pt-8 mt-2">
              <button className="w-full bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white py-4 rounded-xl font-semibold text-lg duration-300">
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
