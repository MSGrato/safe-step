import React, { createContext, useContext, useState, useCallback } from 'react';
import { storage, type DecoySkin } from '@/lib/storage';

type AppMode = 'decoy' | 'real';

interface AppContextType {
  mode: AppMode;
  toggleMode: () => void;
  exitToDecoy: () => void;
  enterRealMode: () => void;
  decoySkin: DecoySkin;
  setDecoySkin: (skin: DecoySkin) => void;
  hasAcceptedPrivacy: boolean;
  acceptPrivacy: () => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetApp: () => void;
  pendingRealMode: boolean;
  setPendingRealMode: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AppMode>('decoy');
  const [decoySkin, setDecoySkinState] = useState<DecoySkin>(storage.getDecoySkin());
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(storage.isPrivacyAccepted());
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(storage.isOnboardingComplete());
  const [pendingRealMode, setPendingRealMode] = useState(false);

  const acceptPrivacy = useCallback(() => {
    storage.setPrivacyAccepted();
    setHasAcceptedPrivacy(true);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      if (prev === 'decoy') {
        // Don't switch directly — signal that safety check is needed
        setPendingRealMode(true);
        return 'decoy';
      }
      return 'decoy';
    });
  }, []);

  const enterRealMode = useCallback(() => {
    setPendingRealMode(false);
    setMode('real');
  }, []);

  const exitToDecoy = useCallback(() => {
    setPendingRealMode(false);
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

  const resetApp = useCallback(() => {
    Object.keys(localStorage).filter(k => k.startsWith('safestep_')).forEach(k => localStorage.removeItem(k));
    setHasAcceptedPrivacy(false);
    setHasCompletedOnboarding(false);
    setDecoySkinState('recipe');
    setMode('decoy');
    setPendingRealMode(false);
  }, []);

  return (
    <AppContext.Provider value={{ mode, toggleMode, exitToDecoy, enterRealMode, decoySkin, setDecoySkin, hasAcceptedPrivacy, acceptPrivacy, hasCompletedOnboarding, completeOnboarding, resetApp, pendingRealMode, setPendingRealMode }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
