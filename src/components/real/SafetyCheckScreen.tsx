import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Phone, AlertTriangle, X } from 'lucide-react';

interface SafetyCheckScreenProps {
  onSafe: () => void;
  onExit: () => void;
}

export function SafetyCheckScreen({ onSafe, onExit }: SafetyCheckScreenProps) {
  const [showHotline, setShowHotline] = useState(false);

  if (showHotline) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">National DV Hotline</h1>
        <p className="text-muted-foreground mb-6">
          Free, confidential, 24/7 support
        </p>
        <a
          href="tel:1-800-799-7233"
          className="text-2xl font-bold text-primary underline mb-8"
        >
          1-800-799-7233
        </a>
        <p className="text-sm text-muted-foreground mb-8">
          You can also text START to 88788
        </p>
        <Button variant="outline" onClick={() => setShowHotline(false)} className="w-full max-w-xs h-12">
          <X className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
      <div className="relative w-20 h-20 flex items-center justify-center mb-8">
        <div className="absolute inset-0 rounded-full bg-destructive/10" />
        <Shield className="relative z-10 w-10 h-10" color="#eb0a0a" fill="#eb0a0a" fillOpacity={0.2} />
      </div>
      <h1 className="text-xl font-semibold text-foreground mb-2">Are you safe?</h1>
      <p className="text-muted-foreground mb-10">
        Take a moment before continuing.
      </p>
      <div className="w-full max-w-xs space-y-3">
        <Button onClick={onSafe} className="w-full h-12 text-base">
          Yes, I am safe
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowHotline(true)}
          className="w-full h-12 text-base"
        >
          <Phone className="w-4 h-4 mr-2" />
          No, I need DV Hotline
        </Button>
        <Button
          variant="outline"
          onClick={() => {}}
          disabled
          className="w-full h-12 text-base"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          No, I need 911
        </Button>
      </div>
      <button
        onClick={onExit}
        className="mt-8 text-sm text-muted-foreground underline"
      >
        Go back
      </button>
    </div>
  );
}
