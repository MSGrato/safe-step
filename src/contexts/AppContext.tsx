import React, { createContext, useContext, useState, useCallback } from 'react';
import { storage, type DecoySkin } from '@/lib/storage';

type AppMode = 'decoy' | 'real';

interface AppContextType {
  mode: AppMode;
  toggleMode: () => void;
  exitToDecoy: () => void;
  decoySkin: DecoySkin;
  setDecoySkin: (skin: DecoySkin) => void;
  hasAcceptedPrivacy: boolean;
  acceptPrivacy: () => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AppMode>('decoy');
  const [decoySkin, setDecoySkinState] = useState<DecoySkin>(storage.getDecoySkin());
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(storage.isPrivacyAccepted());
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(storage.isOnboardingComplete());

  const acceptPrivacy = useCallback(() => {
    storage.setPrivacyAccepted();
    setHasAcceptedPrivacy(true);
  }, []);

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

  const resetApp = useCallback(() => {
    // Clear all safestep keys
    Object.keys(localStorage).filter(k => k.startsWith('safestep_')).forEach(k => localStorage.removeItem(k));
    setHasAcceptedPrivacy(false);
    setHasCompletedOnboarding(false);
    setDecoySkinState('recipe');
    setMode('decoy');
  }, []);

  return (
    <AppContext.Provider value={{ mode, toggleMode, exitToDecoy, decoySkin, setDecoySkin, hasAcceptedPrivacy, acceptPrivacy, hasCompletedOnboarding, completeOnboarding, resetApp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
