import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.25) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(167,139,250,0.1) 0%, transparent 60%)',
        }}
      />

      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full py-20">
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(167,139,250,0.3)] bg-[rgba(139,92,246,0.1)] w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
            <span className="text-[#C4B5FD] text-xs font-medium tracking-wide">AI-Powered Software Health</span>
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-[#F5F3FF] leading-[1.1] tracking-tight">
            Your Personal{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #C4B5FD 100%)',
              }}
            >
              Software Health
            </span>{' '}
            Assistant
          </h1>

          <p className="text-[#9CA3AF] text-lg leading-relaxed max-w-lg">
            Scans your installed applications, identifies outdated software, and helps keep your PC secure — all through an intelligent AI-powered chat interface.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/#chat-section"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] text-white font-semibold text-sm hover:bg-[#7C3AED] transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.5)] hover:shadow-[0_0_36px_rgba(139,92,246,0.7)]"
            >
              Try Demo
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/how-it-works"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[rgba(167,139,250,0.3)] text-[#C4B5FD] font-semibold text-sm hover:border-[rgba(167,139,250,0.6)] hover:text-[#F5F3FF] transition-all duration-200 bg-[rgba(139,92,246,0.05)] hover:bg-[rgba(139,92,246,0.1)]"
            >
              Learn More
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-2">
            {[
              { icon: Shield, label: 'Security First' },
              { icon: Zap, label: 'Instant Scan' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={14} className="text-[#8B5CF6]" />
                <span className="text-[#9CA3AF] text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          <div
            className="relative w-full max-w-md rounded-2xl border border-[rgba(167,139,250,0.25)] overflow-hidden"
            style={{
              background: 'rgba(139,92,246,0.08)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 0 60px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(167,139,250,0.15)]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[#C4B5FD] text-xs font-medium mx-auto">SoftScan Dashboard</span>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {[
                { name: 'VS Code', version: '1.85.0', status: 'update', badge: 'Update Available', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
                { name: 'Google Chrome', version: '121.0.6167', status: 'security', badge: 'Security Patch', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
                { name: 'MySQL 8.0', version: '8.0.36', status: 'ok', badge: 'Up to Date', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
                { name: 'Node.js', version: '18.12.0', status: 'update', badge: 'Update Available', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
                { name: 'Git', version: '2.43.0', status: 'ok', badge: 'Up to Date', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
              ].map((app) => (
                <div
                  key={app.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-[rgba(167,139,250,0.1)] bg-[rgba(139,92,246,0.05)] hover:border-[rgba(167,139,250,0.25)] transition-all duration-200"
                >
                  <div>
                    <p className="text-[#F5F3FF] text-sm font-medium">{app.name}</p>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">v{app.version}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${app.bg} ${app.color}`}>
                    {app.badge}
                  </span>
                </div>
              ))}

              <div className="mt-1 pt-3 border-t border-[rgba(167,139,250,0.1)] flex items-center justify-between">
                <span className="text-[#9CA3AF] text-xs">5 apps scanned</span>
                <button className="text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors">
                  Fix All Issues →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
