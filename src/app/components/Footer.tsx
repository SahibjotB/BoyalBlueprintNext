import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f97316] text-white py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between z-20">
      <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8 font-semibold text-[15px] mb-4 md:mb-0">
        <Link href="/ai-search" className="hover:opacity-80 transition-opacity">Ai Search</Link>
        <Link href="/calculator" className="hover:opacity-80 transition-opacity">Calculator</Link>
        <Link href="/learn" className="hover:opacity-80 transition-opacity">Learn</Link>
        <Link href="/deals" className="hover:opacity-80 transition-opacity">Deals</Link>
        <Link href="/contact" className="hover:opacity-80 transition-opacity">Contact</Link>
      </nav>
      <div className="text-[15px] text-white/90 font-medium text-center md:text-right">
        &copy; 2025 &middot; All rights reserved
      </div>
    </footer>
  );
}
