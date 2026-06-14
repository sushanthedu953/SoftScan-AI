import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getAiConnectionInfo, testAiConnection } from '../lib/aiService';

interface CheckItem {
  name: string;
  ok: boolean;
  detail: string;
}

export default function StatusPage() {
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [testing, setTesting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function runChecks() {
      setTesting(true);
      let storageOk = false;
      try {
        localStorage.setItem('softscan-status-probe', '1');
        localStorage.removeItem('softscan-status-probe');
        storageOk = true;
      } catch {
        storageOk = false;
      }

      const aiProvider = await testAiConnection();
      if (cancelled) return;

      setChecks([
        {
          name: 'Web app',
          ok: true,
          detail: 'SoftScan UI is running in your browser.',
        },
        {
          name: 'Local scan history',
          ok: storageOk,
          detail: storageOk
            ? 'localStorage is available for saved scans.'
            : 'localStorage blocked — history will not persist.',
        },
        {
          name: 'AI provider',
          ok: aiProvider.state === 'connected',
          detail: aiProvider.detail,
        },
        {
          name: 'winget integration',
          ok: true,
          detail: 'Update scripts assume winget on Windows (user-run locally).',
        },
      ]);
      setTesting(false);
    }

    runChecks();
    return () => {
      cancelled = true;
    };
  }, []);

  const allOk = !testing && checks.length > 0 && checks.every((c) => c.ok);
  const aiProviderCheck = checks.find((c) => c.name === 'AI provider');

  return (
    <PageLayout
      title="Status"
      subtitle="Live checks for this browser session and configuration."
      cta={{ label: 'Back to app', path: '/' }}
    >
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border mb-6 ${
          testing
            ? 'border-[rgba(167,139,250,0.2)] bg-[rgba(139,92,246,0.04)]'
            : allOk
              ? 'border-emerald-500/25 bg-emerald-500/5'
              : 'border-amber-500/25 bg-amber-500/5'
        }`}
      >
        {testing ? (
          <Loader2 size={16} className="text-[#A78BFA] animate-spin" />
        ) : (
          <span className={`w-2 h-2 rounded-full ${allOk ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
        )}
        <span className={`text-sm font-medium ${testing ? 'text-[#C4B5FD]' : allOk ? 'text-emerald-400' : 'text-amber-400'}`}>
          {testing ? 'Testing AI provider connection…' : allOk ? 'All systems operational' : 'Degraded — review items below'}
        </span>
      </div>

      <ul className="space-y-3">
        {checks.map((check) => (
          <li
            key={check.name}
            className="flex gap-3 p-4 rounded-xl border border-[rgba(167,139,250,0.12)] bg-[rgba(139,92,246,0.03)]"
          >
            {check.ok ? (
              <CheckCircle size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-[#F5F3FF] text-sm font-semibold">{check.name}</p>
              <p className="text-[#9CA3AF] text-xs mt-0.5">{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      {aiProviderCheck && !aiProviderCheck.ok && (
        <p className="mt-6 text-xs text-[#9CA3AF] leading-relaxed">
          Current mode: <strong className="text-[#C4B5FD]">{getAiConnectionInfo().label}</strong>. For the hosted app,
          set <code className="text-[#C4B5FD]">GROQ_API_KEY</code> in Cloudflare Pages environment variables and redeploy.
          For local Gemini testing, set <code className="text-[#C4B5FD]">VITE_GEMINI_API_KEY</code> in <code className="text-[#C4B5FD]">.env</code>.
        </p>
      )}
    </PageLayout>
  );
}
