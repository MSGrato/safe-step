import { useApp } from '@/contexts/AppContext';
import { X } from 'lucide-react';

export function QuickExitButton() {
  const { exitToDecoy } = useApp();

  return (
    <button
      onClick={exitToDecoy}
      className="fixed top-3 right-3 z-50 w-9 h-9 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md active:scale-95 transition-transform"
      aria-label="Quick exit"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
