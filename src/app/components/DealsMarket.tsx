import React from 'react';
import Link from 'next/link';

export default function DealsMarket() {
  const deals = [
    {
      id: 1,
      image: '/house1.jpg',
      title: '4 bed & 4 bath home with a rent ready basement, double garage, and bright open-concept layout.',
      tag: 'Insights',
      time: '4 min'
    },
    {
      id: 2,
      image: '/house2.jpg',
      title: 'Move-in ready home with basement income potential, parking for 6 in a prime family-friendly location.',
      tag: 'Strategy',
      time: '7 min'
    },
    {
      id: 3,
      image: '/house3.jpg',
      title: 'Finished basement, and large backyard in a high-demand community.',
      tag: 'Insights',
      time: '5 min'
    }
  ];

  return (
    <section className="w-full py-20 bg-white flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-semibold text-black mb-16 tracking-tight">Deals on the market</h2>

      <div className="w-full max-w-4xl px-6 flex flex-col gap-8">
        {deals.map((deal, index) => (
          <div key={deal.id} className={`flex flex-col md:flex-row gap-6 pb-8 ${index !== deals.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="w-full md:w-72 h-56 md:h-44 shrink-0">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <h3 className="text-xl md:text-[22px] font-semibold text-black mb-3 leading-tight">
                {deal.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-2 font-mono uppercase tracking-wider text-[11px]">
                {deal.tag} <span className="text-gray-300 text-[10px]">●</span> {deal.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/deals"
          className="bg-black text-white px-6 py-3 font-semibold text-sm hover:bg-gray-800 transition-colors inline-block"
        >
          Find Deals Now
        </Link>
      </div>
    </section>
  );
}
