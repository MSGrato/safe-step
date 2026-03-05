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

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  // Safety check gate before entering real mode
  if (pendingRealMode) {
    return <SafetyCheckScreen onSafe={enterRealMode} onExit={exitToDecoy} />;
  }

  if (mode === 'real') {
    return <RealInterface />;
  }

  const DecoyComponent = decoySkin === 'notes' ? NotesApp : decoySkin === 'weather' ? WeatherApp : RecipeApp;
  return (
    <div className="no-select">
      <DecoyComponent onTripleTap={handleTripleTap} />
    </div>
  );
};

export default Index;
