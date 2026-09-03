import React from 'react';

export default function DealsPage() {
  const deals = [
    {
      id: 1,
      image: '/house1.jpg',
      title: '4 bed & 4 bath home with a rent ready basement, double garage, and bright open-concept layout.',
      tag: 'Insights',
      time: '4 min',
      excerpt: 'Discover how an open-concept layout and a rent-ready basement can maximize your living space and generate consistent rental income.'
    },
    {
      id: 2,
      image: '/house2.jpg',
      title: 'Move-in ready home with basement income potential, parking for 6 in a prime family-friendly location.',
      tag: 'Strategy',
      time: '7 min',
      excerpt: 'A strategic look at why multi-family potential and ample parking make this property a top choice for forward-thinking investors.'
    },
    {
      id: 3,
      image: '/house3.jpg',
      title: 'Finished basement, and large backyard in a high-demand community.',
      tag: 'Insights',
      time: '5 min',
      excerpt: 'Explore the benefits of moving into a highly sought-after neighborhood, featuring a spacious backyard perfect for entertaining.'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      title: 'placeholder',
      tag: 'Showcase',
      time: '6 min',
      excerpt: 'placeholder'
    }
  ];

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center py-20 md:py-32">
      <h1 className="text-5xl md:text-6xl font-bold text-black mb-16 md:mb-24 tracking-tight">Latest Deals</h1>

      <div className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {deals.map((deal) => (
          <div key={deal.id} className="flex flex-col group cursor-pointer">
            <div className="w-full aspect-[3/2] overflow-hidden mb-6 bg-gray-100">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <h2 className="text-2xl font-bold text-black mb-3 leading-snug">
              {deal.title}
            </h2>

            <p className="text-sm text-gray-400 flex items-center gap-2 font-mono uppercase tracking-wider text-[11px] mb-4">
              {deal.tag} <span className="text-gray-300 text-[10px]">●</span> {deal.time}
            </p>

            <p className="text-gray-800 font-serif text-[17px] leading-relaxed">
              {deal.excerpt}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
