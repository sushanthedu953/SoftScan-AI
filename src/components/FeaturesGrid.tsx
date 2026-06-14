import { Shield, Zap, Bell, BarChart3, Search, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Diagnostics',
    description:
      'Deep scans every installed application and cross-references against global version databases to detect outdated software in seconds.',
    glow: 'rgba(139,92,246,0.4)',
  },
  {
    icon: Shield,
    title: 'Security Alerts',
    description:
      'Monitors CVE databases and immediately flags applications with known security vulnerabilities, keeping your system protected.',
    glow: 'rgba(239,68,68,0.35)',
  },
  {
    icon: Bell,
    title: 'Update Reminders',
    description:
      'Set smart update schedules and get notified at the right time. Never miss a critical patch with intelligent reminder logic.',
    glow: 'rgba(251,191,36,0.35)',
  },
  {
    icon: BarChart3,
    title: 'Health Reports',
    description:
      "Visual software health dashboards with trend tracking, giving you a full picture of your system's software hygiene over time.",
    glow: 'rgba(16,185,129,0.35)',
  },
  {
    icon: Zap,
    title: 'Instant Scan',
    description:
      'Zero-config scanning. Upload your software report or connect directly and get a full analysis in under a second.',
    glow: 'rgba(139,92,246,0.4)',
  },
  {
    icon: RefreshCw,
    title: 'Batch Updates',
    description:
      'Generate one-click PowerShell commands to update all outdated applications simultaneously — no manual effort needed.',
    glow: 'rgba(167,139,250,0.4)',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(167,139,250,0.3)] bg-[rgba(139,92,246,0.1)] mb-4">
            <Zap size={12} className="text-[#A78BFA]" />
            <span className="text-[#C4B5FD] text-xs font-medium tracking-wide">Everything You Need</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F5F3FF] mb-4 tracking-tight">
            Built for Security-Conscious Teams
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
            A complete software lifecycle management suite — from detection to remediation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-[rgba(167,139,250,0.12)] bg-[rgba(139,92,246,0.04)] hover:border-[rgba(167,139,250,0.3)] transition-all duration-300 p-6 overflow-hidden cursor-default"
                style={{ backdropFilter: 'blur(12px)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${feature.glow.replace('0.4', '0.12').replace('0.35', '0.1')}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${feature.glow.replace('0.4', '0.08').replace('0.35', '0.07')} 0%, transparent 70%)`,
                    transform: 'translate(30%, -30%)',
                  }}
                />

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${feature.glow.replace('0.4', '0.15').replace('0.35', '0.12')}`,
                    border: `1px solid ${feature.glow.replace('0.4', '0.3').replace('0.35', '0.25')}`,
                  }}
                >
                  <Icon size={18} style={{ color: feature.glow.split(',')[0].replace('rgba(', 'rgb(').replace('0.4', '1').replace('0.35', '1') }} />
                </div>

                <h3 className="text-[#F5F3FF] font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
