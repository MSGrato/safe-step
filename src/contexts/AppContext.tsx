import React, { createContext, useContext, useState, useCallback } from 'react';
import { storage, type DecoySkin } from '@/lib/storage';

type AppMode = 'decoy' | 'real';

interface AppContextType {
  mode: AppMode;
  toggleMode: () => void;
  exitToDecoy: () => void;
  decoySkin: DecoySkin;
  setDecoySkin: (skin: DecoySkin) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AppMode>('decoy');
  const [decoySkin, setDecoySkinState] = useState<DecoySkin>(storage.getDecoySkin());
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(storage.isOnboardingComplete());

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'decoy' ? 'real' : 'decoy');
  }, []);

  const exitToDecoy = useCallback(() => {
    setMode('decoy');
  }, []);

  const setDecoySkin = useCallback((skin: DecoySkin) => {
    storage.setDecoySkin(skin);
    setDecoySkinState(skin);
  }, []);

  const completeOnboarding = useCallback(() => {
    storage.setOnboardingComplete();
    setHasCompletedOnboarding(true);
  }, []);

  return (
    <AppContext.Provider value={{ mode, toggleMode, exitToDecoy, decoySkin, setDecoySkin, hasCompletedOnboarding, completeOnboarding }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
