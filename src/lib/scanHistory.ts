import type { AppHealth } from './aiService';

export interface ScanSummary {
  total: number;
  security: number;
  update: number;
  ok: number;
}

export interface ScanRecord {
  id: string;
  createdAt: string;
  fileName: string;
  apps: AppHealth[];
  summary: ScanSummary;
}

const STORAGE_KEY = 'softscan-scan-history';
const MAX_SCANS = 20;

export function buildScanSummary(apps: AppHealth[]): ScanSummary {
  return {
    total: apps.length,
    security: apps.filter((a) => a.status === 'security').length,
    update: apps.filter((a) => a.status === 'update').length,
    ok: apps.filter((a) => a.status === 'ok').length,
  };
}

export function loadScanHistory(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScanRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r) => r?.id && r?.createdAt && Array.isArray(r.apps))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function persistScanHistory(records: ScanRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_SCANS)));
  } catch (err) {
    console.warn('Failed to save scan history:', err);
  }
}

export function createScanRecord(fileName: string, apps: AppHealth[]): ScanRecord {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    fileName,
    apps,
    summary: buildScanSummary(apps),
  };
}

export function addScanRecord(fileName: string, apps: AppHealth[]): ScanRecord {
  const record = createScanRecord(fileName, apps);
  const history = [record, ...loadScanHistory()].slice(0, MAX_SCANS);
  persistScanHistory(history);
  return record;
}

export function deleteScanRecord(id: string): ScanRecord[] {
  const history = loadScanHistory().filter((r) => r.id !== id);
  persistScanHistory(history);
  return history;
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function formatScanDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
