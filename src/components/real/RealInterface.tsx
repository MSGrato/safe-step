import { useState } from 'react';
import { QuickExitButton } from './QuickExitButton';
import { PlanTab } from './PlanTab';
import { ResourcesTab } from './ResourcesTab';
import { ChatTab } from './ChatTab';
import { useApp } from '@/contexts/AppContext';
import { ClipboardList, LifeBuoy, MessageCircle, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tabs = [
  { id: 'plan', label: 'Plan', icon: ClipboardList },
  { id: 'resources', label: 'Resources', icon: LifeBuoy },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type TabId = typeof tabs[number]['id'];

export function RealInterface() {
  const [activeTab, setActiveTab] = useState<TabId>('plan');
  const { resetApp } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <QuickExitButton />

      <div className="pb-16">
        {activeTab === 'plan' && <PlanTab />}
        {activeTab === 'resources' && <ResourcesTab />}
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'settings' && (
          <div className="px-5 pt-14 pb-24">
            <h2 className="text-xl font-semibold text-foreground mb-6">Settings</h2>
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-1">Reset App</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  This will clear all data — your safety plan, chat history, and settings — and return you to onboarding so you can choose a new decoy.
                </p>
                {!confirmReset ? (
                  <Button variant="destructive" className="w-full" onClick={() => setConfirmReset(true)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Everything
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-destructive text-center">Are you sure? This cannot be undone.</p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setConfirmReset(false)}>Cancel</Button>
                      <Button variant="destructive" className="flex-1" onClick={resetApp}>Yes, Reset</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom tabs */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t border-border flex justify-around py-2 z-40">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
