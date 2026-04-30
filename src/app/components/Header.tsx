'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the page
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      setHideHeader(isBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between py-6 px-12 bg-transparent transition-transform duration-500 ease-in-out ${
        hideHeader ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <Link href="/">
        <Image
          src="/boyal-blueprint-black.png"
          alt="Boyal Blueprint Logo"
          width={180}
          height={60}
          className="object-contain"
          priority
        />
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-black font-semibold text-[15px]">
        <Link href="/ai-search" className="hover:opacity-70 transition-opacity">
          Ai Search
        </Link>
        <Link href="/calculator" className="hover:opacity-70 transition-opacity">
          Calculator
        </Link>
        <Link href="/learn" className="hover:opacity-70 transition-opacity">
          Learn
        </Link>
        <Link href="/deals" className="hover:opacity-70 transition-opacity">
          Deals
        </Link>
        <Link href="/contact" className="hover:opacity-70 transition-opacity flex items-center gap-1">
          Contact <span className="font-bold">&rarr;</span>
        </Link>
      </nav>
    </header>
  );
}
