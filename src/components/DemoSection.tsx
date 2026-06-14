import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Monitor,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { useSoftwareStore } from '../lib/store';
import { useState, useEffect } from 'react';
import type { AppHealth } from '../lib/aiService';
import { formatScanDate } from '../lib/scanHistory';
import { buildBatchPs1, buildSingleAppPs1, downloadTextFile } from '../lib/updateScripts';
import ScanHistoryPanel from './ScanHistoryPanel';

const statusConfig = {
  ok: {
    icon: CheckCircle,
    label: 'Up to date',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/25',
  },
  update: {
    icon: RefreshCw,
    label: 'Update available',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/25',
  },
  security: {
    icon: AlertCircle,
    label: 'Security patch',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/25',
  },
};

export default function DemoSection() {
  const { scannedApps, isScanning, lastScannedAt, activeScanLabel } = useSoftwareStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedApp, setCopiedApp] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [scannedApps]);

  const updates = scannedApps.filter((a) => a.status === 'update').length;
  const security = scannedApps.filter((a) => a.status === 'security').length;
  const ok = scannedApps.filter((a) => a.status === 'ok').length;

  const totalPages = Math.max(1, Math.ceil(scannedApps.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApps = scannedApps.slice(indexOfFirstItem, indexOfLastItem);

  const handleCopyCommand = async (app: AppHealth) => {
    const cmd = app.updateCommand || `winget upgrade --id ${app.name}`;
    const fullCmd = `${cmd} --accept-package-agreements --accept-source-agreements`;
    try {
      await navigator.clipboard.writeText(fullCmd);
      setCopiedApp(app.name);
      setTimeout(() => setCopiedApp(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadIndividual = (app: AppHealth) => {
    const safeName = app.name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').toLowerCase();
    downloadTextFile(`update_${safeName}.ps1`, buildSingleAppPs1(app));
  };

  const handleDownloadBatch = () => {
    const appsToUpdate = scannedApps.filter((a) => a.status === 'update' || a.status === 'security');
    if (appsToUpdate.length === 0) return;
    downloadTextFile('update_all_apps.ps1', buildBatchPs1(appsToUpdate));
  };

  const lastScanLabel =
    lastScannedAt && activeScanLabel
      ? `${formatScanDate(lastScannedAt)} · ${activeScanLabel}`
      : lastScannedAt
        ? formatScanDate(lastScannedAt)
        : null;

  return (
    <section id="demo" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(167,139,250,0.3)] bg-[rgba(139,92,246,0.1)] mb-4">
            <Monitor size={12} className="text-[#A78BFA]" />
            <span className="text-[#C4B5FD] text-xs font-medium tracking-wide">Live Dashboard Preview</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F5F3FF] mb-4 tracking-tight">
            See Everything at a Glance
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
            {scannedApps.length > 0
              ? `Your system health report is ready. I've mapped ${scannedApps.length} applications across ${totalPages} pages.`
              : 'Upload a software export file in the section below to populate your health dashboard.'}
          </p>
        </div>

        <ScanHistoryPanel />

        <div
          className="rounded-2xl border border-[rgba(167,139,250,0.2)] overflow-hidden"
          style={{
            background: 'rgba(139,92,246,0.06)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 80px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(167,139,250,0.15)] bg-[rgba(139,92,246,0.04)]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className={`w-3 h-3 rounded-full bg-red-500/70 ${isScanning ? 'animate-pulse' : ''}`} />
                <div className={`w-3 h-3 rounded-full bg-yellow-500/70 ${isScanning ? 'animate-pulse delay-75' : ''}`} />
                <div className={`w-3 h-3 rounded-full bg-green-500/70 ${isScanning ? 'animate-pulse delay-150' : ''}`} />
              </div>
              <span className="text-[#C4B5FD] text-sm font-medium">
                {isScanning ? 'Scanning system...' : `Detected Applications — ${scannedApps.length} total`}
              </span>
            </div>

            {scannedApps.length > itemsPerPage && (
              <div className="flex items-center gap-2 bg-[rgba(167,139,250,0.1)] rounded-lg px-2 py-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1 hover:text-[#F5F3FF] text-[#9CA3AF] disabled:opacity-20 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-bold text-[#C4B5FD] w-12 text-center">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 hover:text-[#F5F3FF] text-[#9CA3AF] disabled:opacity-20 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {scannedApps.length > 0 && (
              <div className="flex gap-4 text-xs hidden md:flex">
                <span className="flex items-center gap-1.5 text-red-400">
                  <AlertTriangle size={12} /> {security}
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <RefreshCw size={12} /> {updates}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle size={12} /> {ok}
                </span>
              </div>
            )}
          </div>

          {scannedApps.length > 0 && (updates > 0 || security > 0) && (
            <div className="mx-6 mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.05)] animate-in fade-in duration-300">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 flex-shrink-0 animate-pulse">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="text-[#F5F3FF] text-sm font-semibold">Outdated or Vulnerable Tools Detected</h4>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">
                    We detected {security} security risk(s) and {updates} pending update(s). You can download a single
                    combined script to patch all of them.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadBatch}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs tracking-wide transition-all duration-200 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
              >
                <Download size={14} />
                Download Batch Update Script (.ps1)
              </button>
            </div>
          )}

          <div className="p-6">
            {scannedApps.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-[rgba(139,92,246,0.1)] flex items-center justify-center mb-4 border border-[rgba(167,139,250,0.2)]">
                  <Search className="text-[#A78BFA]" size={32} />
                </div>
                <h3 className="text-[#F5F3FF] font-semibold mb-2">No Applications Detected</h3>
                <p className="text-[#9CA3AF] text-sm max-w-xs">
                  Upload an app export file in the chat assistant below to begin your analysis. Past scans reappear here
                  automatically.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {currentApps.map((app) => {
                  const cfg = statusConfig[app.status as keyof typeof statusConfig];
                  const StatusIcon = cfg.icon;
                  const isCopied = copiedApp === app.name;
                  return (
                    <div
                      key={app.name}
                      className="group relative rounded-xl border border-[rgba(167,139,250,0.1)] bg-[rgba(139,92,246,0.02)] hover:border-[rgba(167,139,250,0.3)] hover:bg-[rgba(139,92,246,0.06)] transition-all duration-300 p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{app.icon}</span>
                          <div>
                            <p className="text-[#F5F3FF] text-sm font-semibold truncate max-w-[120px]">{app.name}</p>
                            <p className="text-[#9CA3AF] text-[10px] uppercase font-bold tracking-wider">{app.category}</p>
                          </div>
                        </div>

                        {app.status !== 'ok' && (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleCopyCommand(app)}
                              className="p-1.5 rounded-lg bg-[rgba(139,92,246,0.1)] border border-[rgba(167,139,250,0.15)] text-[#A78BFA] hover:text-[#C4B5FD] hover:bg-[rgba(139,92,246,0.25)] transition-all"
                              title={`Copy winget command for ${app.name}`}
                            >
                              {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadIndividual(app)}
                              className="p-1.5 rounded-lg bg-[rgba(139,92,246,0.1)] border border-[rgba(167,139,250,0.15)] text-[#A78BFA] hover:text-[#C4B5FD] hover:bg-[rgba(139,92,246,0.25)] transition-all"
                              title={`Download PowerShell update script for ${app.name}`}
                            >
                              <Download size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-[#9CA3AF]">
                          <span className="text-[#C4B5FD] font-mono">v{app.foundVersion}</span>
                          {app.status !== 'ok' && (
                            <span className="ml-1 opacity-50">→ v{app.latestVersion}</span>
                          )}
                        </div>
                        <span
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}
                        >
                          <StatusIcon size={10} />
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-[rgba(167,139,250,0.15)] flex items-center justify-between">
            <span className="text-[#9CA3AF] text-xs">
              {isScanning
                ? 'Processing data...'
                : lastScanLabel
                  ? `Last scan: ${lastScanLabel}`
                  : scannedApps.length > 0
                    ? 'Last scanned: just now'
                    : 'System ready for scan'}
            </span>
            {scannedApps.length > 0 && (
              <button
                type="button"
                onClick={() => document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors"
              >
                <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
                New Scan
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
