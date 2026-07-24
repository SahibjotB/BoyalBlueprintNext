'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAiSearch = pathname === '/ai-search';
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (isAiSearch) return;

    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the page
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      setShowFooter(isBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAiSearch) return null;

  return (
    <>
      {/* Spacer to allow scrolling past the last content so the footer can slide in */}
      <div className="h-[100px] w-full bg-white" />
      
      <footer 
        className={`fixed bottom-0 left-0 w-full bg-[#f97316] text-white py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between z-50 transition-transform duration-500 ease-in-out ${
          showFooter ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8 font-semibold text-[15px] mb-4 md:mb-0">
          <Link href="/ai-search" className="hover:opacity-80 transition-opacity">Ai Search</Link>
          <Link href="/learn" className="hover:opacity-80 transition-opacity">Learn</Link>
          <Link href="/deals" className="hover:opacity-80 transition-opacity">Deals</Link>
          <Link href="/contact" className="hover:opacity-80 transition-opacity">Contact</Link>
        </nav>
        <div className="text-[15px] text-white/90 font-medium text-center md:text-right">
          &copy; 2025 &middot; All rights reserved
        </div>
      </footer>
    </>
  );
}
