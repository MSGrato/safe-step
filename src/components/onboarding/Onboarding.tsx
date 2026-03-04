import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import type { DecoySkin } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Shield, BookOpen, Calculator, StickyNote } from 'lucide-react';

const skins: { id: DecoySkin; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'recipe', label: 'Recipe App', icon: <BookOpen className="w-8 h-8" />, desc: 'A food recipe collection' },
  { id: 'notes', label: 'Notes App', icon: <StickyNote className="w-8 h-8" />, desc: 'A simple notepad' },
  { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-8 h-8" />, desc: 'A standard calculator' },
];

export function Onboarding() {
  const { setDecoySkin, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [selectedSkin, setSelectedSkin] = useState<DecoySkin>('recipe');

  if (step === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <Shield className="w-16 h-16 text-primary mb-8" />
        <h1 className="text-2xl font-semibold text-foreground mb-4">You are safe here.</h1>
        <p className="text-muted-foreground leading-relaxed mb-12">
          This app is private and stores nothing outside your device.
        </p>
        <Button onClick={() => setStep(1)} className="w-full max-w-xs h-12 text-base">
          Continue
        </Button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-8 pt-16">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Choose your disguise</h1>
        <p className="text-muted-foreground mb-8">This is what others will see when they look at your phone.</p>
        <div className="space-y-3 flex-1">
          {skins.map(skin => (
            <button
              key={skin.id}
              onClick={() => setSelectedSkin(skin.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                selectedSkin === skin.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className={`p-3 rounded-xl ${selectedSkin === skin.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {skin.icon}
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{skin.label}</p>
                <p className="text-sm text-muted-foreground">{skin.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <Button
          onClick={() => { setDecoySkin(selectedSkin); setStep(2); }}
          className="w-full h-12 text-base mb-8"
        >
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-8">
        <Shield className="w-8 h-8 text-destructive" />
      </div>
      <h1 className="text-xl font-semibold text-foreground mb-4">Safety Notice</h1>
      <p className="text-muted-foreground leading-relaxed mb-12">
        If you think someone may have installed monitoring software on this phone, use a trusted friend's device or a library computer instead. Monitoring software can see everything you do, even inside this app.
      </p>
      <Button onClick={completeOnboarding} className="w-full max-w-xs h-12 text-base">
        I understand
      </Button>
    </div>
  );
}
