import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  cta?: { label: string; path: string };
}

export default function PageLayout({ title, subtitle, children, cta }: PageLayoutProps) {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A78BFA] hover:text-[#C4B5FD] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-bold text-[#F5F3FF] tracking-tight mb-2">{title}</h1>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">{subtitle}</p>
        </header>

        <div className="space-y-8">{children}</div>

        {cta && (
          <div className="mt-12 pt-8 border-t border-[rgba(167,139,250,0.12)]">
            <Link
              to={cta.path}
              className="inline-flex px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-sm font-semibold hover:bg-[#7C3AED] transition-colors shadow-[0_0_20px_rgba(139,92,246,0.25)]"
            >
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
