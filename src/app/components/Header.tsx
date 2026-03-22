import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 flex items-center justify-between py-6 px-12 bg-transparent">
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
