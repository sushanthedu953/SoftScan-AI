import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Features', to: '/#features' },
  { label: 'Demo', to: '/#demo' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Export', to: '/#export' },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !onHome
          ? 'bg-[#05060A]/90 backdrop-blur-xl border-b border-[rgba(167,139,250,0.15)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.6)]">
            <Bot size={18} className="text-white" />
          </div>
          <span className="font-bold text-[#F5F3FF] text-lg tracking-tight">SoftScan AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-[#C4B5FD] hover:text-[#F5F3FF] text-sm font-medium transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/docs"
            className="text-[#C4B5FD] hover:text-[#F5F3FF] text-sm font-medium transition-colors px-4 py-2"
          >
            Docs
          </Link>
          <Link
            to="/#chat-section"
            className="px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-sm font-semibold hover:bg-[#7C3AED] transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_28px_rgba(139,92,246,0.6)]"
          >
            Try Free
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden text-[#C4B5FD] hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#05060A]/95 backdrop-blur-xl border-b border-[rgba(167,139,250,0.15)] px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-[#C4B5FD] hover:text-white text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/docs" className="text-[#C4B5FD] text-sm font-medium">
            Docs
          </Link>
          <Link
            to="/#chat-section"
            className="w-full py-2 rounded-lg bg-[#8B5CF6] text-white text-sm font-semibold text-center shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            Try Free
          </Link>
        </div>
      )}
    </nav>
  );
}
