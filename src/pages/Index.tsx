import { useApp } from '@/contexts/AppContext';
import { useTripleTap } from '@/hooks/useTripleTap';
import { RecipeApp } from '@/components/decoys/RecipeApp';
import { NotesApp } from '@/components/decoys/NotesApp';
import { WeatherApp } from '@/components/decoys/WeatherApp';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { RealInterface } from '@/components/real/RealInterface';
import { SafetyCheckScreen } from '@/components/real/SafetyCheckScreen';

const Index = () => {
  const { mode, toggleMode, hasCompletedOnboarding, decoySkin, pendingRealMode, enterRealMode, exitToDecoy } = useApp();
  const handleTripleTap = useTripleTap(toggleMode, 500);

  // Onboarding has no skin selected yet — use the default theme
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  // All post-onboarding screens share the same theme so the transition
  // from decoy → safety check → real UI is visually seamless
  const themeClass = `theme-${decoySkin}`;
  const DecoyComponent = decoySkin === 'notes' ? NotesApp : decoySkin === 'weather' ? WeatherApp : RecipeApp;

  if (pendingRealMode) {
    return (
      <div className={themeClass}>
        <SafetyCheckScreen onSafe={enterRealMode} onExit={exitToDecoy} />
      </div>
    );
  }

  if (mode === 'real') {
    return (
      <div className={themeClass}>
        <RealInterface />
      </div>
    );
  }

  return (
    <div className={`no-select ${themeClass}`}>
      <DecoyComponent onTripleTap={handleTripleTap} />
    </div>
  );
};

export default Index;
