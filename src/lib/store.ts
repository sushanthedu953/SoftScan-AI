import { create } from 'zustand';
import { AppHealth } from './aiService';
import {
  addScanRecord,
  clearScanHistory,
  deleteScanRecord,
  loadScanHistory,
  ScanRecord,
} from './scanHistory';

interface SoftwareStore {
  scannedApps: AppHealth[];
  isScanning: boolean;
  scanHistory: ScanRecord[];
  activeScanId: string | null;
  activeScanLabel: string | null;
  lastScannedAt: string | null;
  setScannedApps: (apps: AppHealth[]) => void;
  setScanning: (status: boolean) => void;
  hydrateHistory: () => void;
  saveScanToHistory: (fileName: string, apps: AppHealth[]) => void;
  restoreScan: (id: string) => void;
  removeScanFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useSoftwareStore = create<SoftwareStore>((set, get) => ({
  scannedApps: [],
  isScanning: false,
  scanHistory: [],
  activeScanId: null,
  activeScanLabel: null,
  lastScannedAt: null,

  setScannedApps: (apps: AppHealth[]) => set({ scannedApps: apps }),
  setScanning: (status: boolean) => set({ isScanning: status }),

  hydrateHistory: () => {
    const history = loadScanHistory();
    set({ scanHistory: history });
    if (history.length > 0 && get().scannedApps.length === 0) {
      const latest = history[0];
      set({
        scannedApps: latest.apps,
        activeScanId: latest.id,
        activeScanLabel: latest.fileName,
        lastScannedAt: latest.createdAt,
      });
    }
  },

  saveScanToHistory: (fileName: string, apps: AppHealth[]) => {
    if (apps.length === 0) return;
    const record = addScanRecord(fileName, apps);
    set({
      scanHistory: loadScanHistory(),
      activeScanId: record.id,
      activeScanLabel: record.fileName,
      lastScannedAt: record.createdAt,
      scannedApps: apps,
    });
  },

  restoreScan: (id: string) => {
    const record = get().scanHistory.find((r) => r.id === id);
    if (!record) return;
    set({
      scannedApps: record.apps,
      activeScanId: record.id,
      activeScanLabel: record.fileName,
      lastScannedAt: record.createdAt,
    });
  },

  removeScanFromHistory: (id: string) => {
    const history = deleteScanRecord(id);
    const state = get();
    const wasActive = state.activeScanId === id;
    const nextActive = wasActive ? history[0] : state.scanHistory.find((r) => r.id === state.activeScanId);

    if (wasActive) {
      if (nextActive) {
        set({
          scanHistory: history,
          scannedApps: nextActive.apps,
          activeScanId: nextActive.id,
          activeScanLabel: nextActive.fileName,
          lastScannedAt: nextActive.createdAt,
        });
      } else {
        set({
          scanHistory: history,
          scannedApps: [],
          activeScanId: null,
          activeScanLabel: null,
          lastScannedAt: null,
        });
      }
    } else {
      set({ scanHistory: history });
    }
  },

  clearHistory: () => {
    clearScanHistory();
    set({
      scanHistory: [],
      scannedApps: [],
      activeScanId: null,
      activeScanLabel: null,
      lastScannedAt: null,
    });
  },
}));
