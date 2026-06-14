import { useEffect } from 'react';
import { useSoftwareStore } from '../lib/store';

/** Loads scan history from localStorage once on app start. */
export default function HistoryBootstrap() {
  const hydrateHistory = useSoftwareStore((s) => s.hydrateHistory);

  useEffect(() => {
    hydrateHistory();
  }, [hydrateHistory]);

  return null;
}
