import { useState } from 'react';
import { QuickExitButton } from './QuickExitButton';
import { PlanTab } from './PlanTab';
import { ResourcesTab } from './ResourcesTab';
import { ChatTab } from './ChatTab';
import { ClipboardList, LifeBuoy, MessageCircle } from 'lucide-react';

const tabs = [
  { id: 'plan', label: 'Plan', icon: ClipboardList },
  { id: 'resources', label: 'Resources', icon: LifeBuoy },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
] as const;

type TabId = typeof tabs[number]['id'];

export function RealInterface() {
  const [activeTab, setActiveTab] = useState<TabId>('plan');

  return (
    <div className="min-h-screen bg-background">
      <QuickExitButton />

      <div className="pb-16">
        {activeTab === 'plan' && <PlanTab />}
        {activeTab === 'resources' && <ResourcesTab />}
        {activeTab === 'chat' && <ChatTab />}
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
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
