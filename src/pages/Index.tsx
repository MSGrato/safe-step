import { useApp } from '@/contexts/AppContext';
import { useTripleTap } from '@/hooks/useTripleTap';
import { RecipeApp } from '@/components/decoys/RecipeApp';
import { NotesApp } from '@/components/decoys/NotesApp';
import { CalculatorApp } from '@/components/decoys/CalculatorApp';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { RealInterface } from '@/components/real/RealInterface';

const Index = () => {
  const { mode, toggleMode, hasCompletedOnboarding, decoySkin } = useApp();
  const handleTripleTap = useTripleTap(toggleMode, 500);

  if (mode === 'decoy') {
    const DecoyComponent = decoySkin === 'notes' ? NotesApp : decoySkin === 'calculator' ? CalculatorApp : RecipeApp;
    return (
      <div className="no-select" onPointerDown={handleTripleTap}>
        <DecoyComponent />
      </div>
    );
  }

  // Real mode
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return <RealInterface />;
};

export default Index;
