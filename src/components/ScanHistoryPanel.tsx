import { History, Trash2, RotateCcw, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { useSoftwareStore } from '../lib/store';
import { formatScanDate } from '../lib/scanHistory';

export default function ScanHistoryPanel() {
  const {
    scanHistory,
    activeScanId,
    restoreScan,
    removeScanFromHistory,
    clearHistory,
  } = useSoftwareStore();

  if (scanHistory.length === 0) return null;

  return (
    <div className="mb-8 rounded-2xl border border-[rgba(167,139,250,0.15)] bg-[rgba(139,92,246,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(167,139,250,0.12)]">
        <div className="flex items-center gap-2">
          <History size={16} className="text-[#A78BFA]" />
          <h3 className="text-[#F5F3FF] text-sm font-semibold">Scan history</h3>
          <span className="text-[10px] font-bold text-[#9CA3AF] bg-[rgba(167,139,250,0.1)] px-2 py-0.5 rounded-full">
            {scanHistory.length} saved locally
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Delete all saved scans from this browser?')) {
              clearHistory();
            }
          }}
          className="text-[10px] font-medium text-[#9CA3AF] hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="p-3 flex gap-2 overflow-x-auto custom-scrollbar">
        {scanHistory.map((record) => {
          const isActive = record.id === activeScanId;
          const { security, update, ok, total } = record.summary;

          return (
            <div
              key={record.id}
              className={`flex-shrink-0 w-[220px] rounded-xl border p-3 transition-all duration-200 ${
                isActive
                  ? 'border-[rgba(167,139,250,0.45)] bg-[rgba(139,92,246,0.12)] shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                  : 'border-[rgba(167,139,250,0.1)] bg-[rgba(139,92,246,0.02)] hover:border-[rgba(167,139,250,0.25)]'
              }`}
            >
              <p className="text-[#F5F3FF] text-xs font-semibold truncate" title={record.fileName}>
                {record.fileName}
              </p>
              <p className="text-[#9CA3AF] text-[10px] mt-0.5 mb-2">
                {formatScanDate(record.createdAt)} · {total} apps
              </p>

              <div className="flex gap-2 text-[9px] font-bold mb-3">
                {security > 0 && (
                  <span className="flex items-center gap-0.5 text-red-400">
                    <AlertCircle size={9} /> {security}
                  </span>
                )}
                {update > 0 && (
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <RefreshCw size={9} /> {update}
                  </span>
                )}
                <span className="flex items-center gap-0.5 text-emerald-400">
                  <CheckCircle size={9} /> {ok}
                </span>
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => restoreScan(record.id)}
                  disabled={isActive}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-[#8B5CF6] text-white hover:bg-[#7C3AED] disabled:opacity-40 disabled:cursor-default transition-colors"
                >
                  <RotateCcw size={10} />
                  {isActive ? 'Active' : 'Restore'}
                </button>
                <button
                  type="button"
                  onClick={() => removeScanFromHistory(record.id)}
                  className="p-1.5 rounded-lg border border-[rgba(167,139,250,0.15)] text-[#9CA3AF] hover:text-red-400 hover:border-red-400/30 transition-colors"
                  title="Remove from history"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
