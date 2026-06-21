import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 mt-auto"
      style={{ backgroundColor: '#0c0e12' }}>
      <div className="max-w-[1200px] mx-auto px-lg py-xl flex flex-col md:flex-row justify-between items-center gap-lg">
        <div className="flex flex-col gap-sm items-center md:items-start">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-on-surface text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
            <span className="text-headline-md font-inter font-semibold text-on-surface">MindMatch</span>
          </div>
          <span className="text-body-md font-inter text-on-surface-variant opacity-80">
            © 2024 MindMatch. Discover your compatibility.
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-lg">
          <Link href="#" className="text-label-caps font-inter text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 uppercase tracking-widest">
            Privacy Policy
          </Link>
          <Link href="#" className="text-label-caps font-inter text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 uppercase tracking-widest">
            Terms of Service
          </Link>
          <Link href="#" className="text-label-caps font-inter text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 uppercase tracking-widest">
            Contact
          </Link>
          <Link href="/admin" className="text-label-caps font-inter text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 uppercase tracking-widest">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
