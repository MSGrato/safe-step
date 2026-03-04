const KEYS = {
  onboardingComplete: 'safestep_onboarding_complete',
  decoySkin: 'safestep_decoy_skin',
  intakeAnswers: 'safestep_intake_answers',
  safetyChecklist: 'safestep_safety_checklist',
  chatHistory: 'safestep_chat_history',
  flaggedMessages: 'safestep_flagged_messages',
  zipCode: 'safestep_zip_code',
};

export type DecoySkin = 'recipe' | 'notes' | 'calculator';

export type IntakeAnswers = {
  children: string;
  finances: string;
  documents: string;
  trustedPerson: string;
  timeline: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  flagged?: boolean;
};

export const storage = {
  isOnboardingComplete: () => localStorage.getItem(KEYS.onboardingComplete) === 'true',
  setOnboardingComplete: () => localStorage.setItem(KEYS.onboardingComplete, 'true'),

  getDecoySkin: (): DecoySkin => (localStorage.getItem(KEYS.decoySkin) as DecoySkin) || 'recipe',
  setDecoySkin: (skin: DecoySkin) => localStorage.setItem(KEYS.decoySkin, skin),

  getIntakeAnswers: (): IntakeAnswers | null => {
    const data = localStorage.getItem(KEYS.intakeAnswers);
    return data ? JSON.parse(data) : null;
  },
  setIntakeAnswers: (answers: IntakeAnswers) => localStorage.setItem(KEYS.intakeAnswers, JSON.stringify(answers)),
  clearIntakeAnswers: () => { localStorage.removeItem(KEYS.intakeAnswers); localStorage.removeItem(KEYS.safetyChecklist); },

  getSafetyChecklist: (): string | null => localStorage.getItem(KEYS.safetyChecklist),
  setSafetyChecklist: (checklist: string) => localStorage.setItem(KEYS.safetyChecklist, checklist),

  getChatHistory: (): ChatMessage[] => {
    const data = localStorage.getItem(KEYS.chatHistory);
    return data ? JSON.parse(data) : [];
  },
  setChatHistory: (messages: ChatMessage[]) => localStorage.setItem(KEYS.chatHistory, JSON.stringify(messages)),

  flagMessage: (messageId: string) => {
    const flagged = JSON.parse(localStorage.getItem(KEYS.flaggedMessages) || '[]');
    flagged.push({ messageId, timestamp: Date.now() });
    localStorage.setItem(KEYS.flaggedMessages, JSON.stringify(flagged));
  },

  getZipCode: (): string => localStorage.getItem(KEYS.zipCode) || '',
  setZipCode: (zip: string) => localStorage.setItem(KEYS.zipCode, zip),
};
