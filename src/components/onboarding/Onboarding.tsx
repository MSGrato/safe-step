import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import type { DecoySkin } from '@/lib/storage';
import { PRIVACY_POLICY_SECTIONS } from '@/lib/privacyPolicy';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, BookOpen, Calculator, StickyNote, AlertTriangle } from 'lucide-react';

const skins: {id: DecoySkin;label: string;icon: React.ReactNode;desc: string;}[] = [
{ id: 'recipe', label: 'Recipe App', icon: <BookOpen className="w-8 h-8" />, desc: 'A food recipe collection' },
{ id: 'notes', label: 'Notes App', icon: <StickyNote className="w-8 h-8" />, desc: 'A simple notepad' },
{ id: 'calculator', label: 'Calculator', icon: <Calculator className="w-8 h-8" />, desc: 'A standard calculator' }];


export function Onboarding() {
  const { setDecoySkin, completeOnboarding, hasAcceptedPrivacy, acceptPrivacy } = useApp();
  const [step, setStep] = useState(hasAcceptedPrivacy ? 2 : 0);
  const [selectedSkin, setSelectedSkin] = useState<DecoySkin>('recipe');
  const [privacyChecked, setPrivacyChecked] = useState(false);

  // Step 0: Welcome — "You are safe here"
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
      </div>);

  }

  // Step 1: Privacy Policy
  if (step === 1) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6 pt-12 pb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Privacy Policy & Disclosures</h1>
        <p className="text-sm text-muted-foreground mb-4">Please read before continuing.</p>
        <ScrollArea className="flex-1 border border-border rounded-xl mb-6">
          <div className="p-5 space-y-6">
            {PRIVACY_POLICY_SECTIONS.map((section, i) =>
            <div key={i}>
                {section.isWarning ?
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-[#f50000]">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm mb-1 text-[#ed0202]">{section.title}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{section.content}</p>
                    </div>
                  </div> :

              <>
                    <h2 className="text-base font-semibold text-foreground mb-2">{section.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                  </>
              }
              </div>
            )}
          </div>
        </ScrollArea>
        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <Checkbox
            checked={privacyChecked}
            onCheckedChange={(checked) => setPrivacyChecked(checked === true)}
            className="mt-0.5" />
          
          <span className="text-sm text-foreground leading-snug">
            I have read and accept the Privacy Policy
          </span>
        </label>
        <Button
          onClick={() => {acceptPrivacy();setStep(2);}}
          disabled={!privacyChecked}
          className="w-full h-12 text-base">
          
          Continue
        </Button>
      </div>);

  }

  // Step 2: Decoy skin selection
  if (step === 2) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-8 pt-16">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Choose your disguise</h1>
        <p className="text-muted-foreground mb-8">This is what others will see when they look at your phone.</p>
        <div className="space-y-3 flex-1">
          {skins.map((skin) =>
          <button
            key={skin.id}
            onClick={() => setSelectedSkin(skin.id)}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
            selectedSkin === skin.id ?
            'border-primary bg-primary/5' :
            'border-border bg-card'}`
            }>
            
              <div className={`p-3 rounded-xl ${selectedSkin === skin.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {skin.icon}
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{skin.label}</p>
                <p className="text-sm text-muted-foreground">{skin.desc}</p>
              </div>
            </button>
          )}
        </div>
        <Button
          onClick={() => {setDecoySkin(selectedSkin);setStep(3);}}
          className="w-full h-12 text-base mb-8">
          
          Continue
        </Button>
      </div>);

  }

  // Step 3: Safety notice
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
    </div>);

}