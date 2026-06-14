import { Link } from 'react-router-dom';
import { Bot, Github, Twitter, Mail } from 'lucide-react';
import { footerColumns, socialLinks } from '../content/siteConfig';

const socialItems = [
  { Icon: Github, href: socialLinks.github, label: 'GitHub' },
  { Icon: Twitter, href: socialLinks.twitter, label: 'Twitter' },
  { Icon: Mail, href: socialLinks.email, label: 'Email' },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(167,139,250,0.12)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 w-fit">
              <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.5)]">
                <Bot size={14} className="text-white" />
              </div>
              <span className="font-bold text-[#F5F3FF] text-base tracking-tight">SoftScan AI</span>
            </Link>
            <p className="text-[#9CA3AF] text-xs leading-relaxed max-w-xs">
              Intelligent software health monitoring and security analysis for Windows systems.
            </p>
            <div className="flex gap-3 mt-4">
              {socialItems.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className="w-7 h-7 rounded-lg border border-[rgba(167,139,250,0.2)] bg-[rgba(139,92,246,0.06)] flex items-center justify-center text-[#9CA3AF] hover:text-[#C4B5FD] hover:border-[rgba(167,139,250,0.4)] transition-all duration-200"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[#F5F3FF] text-xs font-semibold uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[#9CA3AF] text-xs hover:text-[#C4B5FD] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[rgba(167,139,250,0.1)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6B7280] text-xs">
            &copy; {new Date().getFullYear()} SoftScan AI. All rights reserved.
          </p>
          <Link
            to="/status"
            className="flex items-center gap-1.5 text-[#9CA3AF] text-xs hover:text-[#C4B5FD] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System status
          </Link>
        </div>
      </div>
    </footer>
  );
}
