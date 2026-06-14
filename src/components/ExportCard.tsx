import { useState } from 'react';
import { Terminal, Copy, Check, Upload, FileJson, FileText } from 'lucide-react';

const commands = [
  {
    id: 'basic',
    label: 'Basic Export',
    icon: FileText,
    command: 'winget list | Out-File installed_apps.txt',
    description: 'Export a plain text list of all installed applications.',
  },
  {
    id: 'json',
    label: 'JSON Export (Recommended)',
    icon: FileJson,
    command: 'winget list | ConvertTo-Json | Out-File installed_apps.json',
    description: 'Structured JSON format — best for AI analysis and bot upload.',
    recommended: true,
  },
  {
    id: 'report',
    label: 'PDF-Ready Report',
    icon: FileText,
    command: 'winget list | Out-File installed_apps_report.txt',
    description: 'Generate a report file you can print as PDF via Windows.',
  },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code">
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl border border-[rgba(167,139,250,0.2)] bg-[rgba(0,0,0,0.4)]"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Terminal size={13} className="text-[#A78BFA] flex-shrink-0" />
          <code className="text-[#C4B5FD] text-xs font-mono truncate">{code}</code>
        </div>
        <button
          onClick={handleCopy}
          className={`ml-3 flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            copied
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-[rgba(139,92,246,0.15)] border border-[rgba(167,139,250,0.2)] text-[#A78BFA] hover:bg-[rgba(139,92,246,0.25)] hover:text-[#C4B5FD]'
          }`}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export default function ExportCard() {
  const [activeTab, setActiveTab] = useState('json');

  const active = commands.find((c) => c.id === activeTab) ?? commands[1];

  return (
    <section id="export" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 80%, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(167,139,250,0.3)] bg-[rgba(139,92,246,0.1)] mb-4">
            <Terminal size={12} className="text-[#A78BFA]" />
            <span className="text-[#C4B5FD] text-xs font-medium tracking-wide">PowerShell Export</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F5F3FF] mb-4 tracking-tight">
            Export Your Installed Apps Report
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
            Copy one of the commands below, run it in PowerShell, then upload the generated file for instant AI analysis.
          </p>
        </div>

        <div
          className="rounded-2xl border border-[rgba(167,139,250,0.25)] overflow-hidden"
          style={{
            background: 'rgba(139,92,246,0.07)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 80px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[rgba(167,139,250,0.15)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-[#C4B5FD] text-sm font-medium ml-2">Windows PowerShell</span>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {commands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => setActiveTab(cmd.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                      activeTab === cmd.id
                        ? 'bg-[rgba(139,92,246,0.2)] border-[rgba(167,139,250,0.4)] text-[#C4B5FD]'
                        : 'bg-transparent border-[rgba(167,139,250,0.1)] text-[#9CA3AF] hover:border-[rgba(167,139,250,0.25)] hover:text-[#C4B5FD]'
                    }`}
                  >
                    <Icon size={12} />
                    {cmd.label}
                    {cmd.recommended && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8B5CF6] text-white uppercase tracking-wide">
                        Best
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[#9CA3AF] text-sm mb-4">{active.description}</p>

            <CodeBlock code={active.command} />

            <div
              className="mt-6 p-4 rounded-xl border border-[rgba(167,139,250,0.15)] bg-[rgba(139,92,246,0.05)] flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-[rgba(139,92,246,0.15)] border border-[rgba(167,139,250,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Upload size={14} className="text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-[#F5F3FF] text-sm font-medium mb-1">How to use this file</p>
                <p className="text-[#9CA3AF] text-xs leading-relaxed">
                  Copy the command above, open PowerShell as Administrator, paste and run it. Once the file is generated, upload it to SoftScan AI and the bot will automatically analyze outdated software, flag security vulnerabilities, and suggest update commands.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  const chatSec = document.getElementById('chat-section');
                  if (chatSec) {
                    chatSec.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] text-white font-semibold text-sm hover:bg-[#7C3AED] transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:shadow-[0_0_36px_rgba(139,92,246,0.6)]"
              >
                <Upload size={16} />
                Upload Report for Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
