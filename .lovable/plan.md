

## SafeStep — Safety Planning PWA

A mobile-first Progressive Web App with a decoy layer and a hidden safety planning interface for domestic violence survivors.

### 1. PWA Setup & App Shell
- Configure as installable PWA with food-themed icon (fork & knife) and "My Recipes" as the app name
- Mobile-optimized viewport

### 2. Decoy Layer — Recipe App (Default)
- Warm-toned recipe app with categories (Breakfast, Dinner, Desserts), search bar, and placeholder recipe cards
- Fully browsable and convincing — no SafeStep branding anywhere
- **Triple-tap gesture** (500ms window) anywhere on screen toggles to the real interface

### 3. Onboarding Flow (shown once)
- **Screen 1**: Welcome — "You are safe here" with privacy assurance
- **Screen 2**: Choose decoy skin — **Recipe App**, **Notes App**, or **Calculator** (each with preview thumbnail). Selection persists via localStorage
- **Screen 3**: Safety notice about monitoring software — "I understand" button

### 4. Real Interface — Three Tabs + Quick Exit
- **Quick Exit button** (red, top-right) on every screen — instantly returns to decoy in <300ms
- Bottom tabs: Plan, Resources, Chat
- Visual design: off-white (#F8F8F6), charcoal text (#1A1A1A), soft teal (#3D8B8B), Inter font, generous spacing

### 5. Tab 1 — Plan (Intake + AI Safety Checklist)
- 5-question intake, one per screen with progress indicator (children, finances, ID docs, trusted contacts, timeline)
- AI-generated 6-8 item personalized safety checklist via Lovable AI gateway
- Numbered checklist display with disclaimer, "Retake Intake" button
- All data stored in localStorage only

### 6. Tab 2 — Resources (Static for now)
- ZIP code input with optional geolocation pre-fill
- Placeholder sections for Shelters, Legal Aid, Counseling — note that location lookup coming later
- Persistent hotline card: 1-800-799-7233 with tap-to-call

### 7. Tab 3 — Chat (AI-Powered)
- Conversational chat via Lovable AI gateway with trauma-informed system prompt
- Crisis detection with immediate 911/hotline response
- Banner: "This chat is powered by AI. For immediate danger, call 911."
- Flag icon on AI messages for reporting; chat history stored locally

### 8. Data & Privacy
- No accounts, no login, no server storage
- All data in localStorage; only external calls are AI gateway (no PII)

### 9. Three Decoy Skins
- **Recipe App**: warm food tones, recipe cards, categories
- **Notes App**: minimal notepad UI with sample notes
- **Calculator**: functional calculator UI with standard buttons and display
- Selected skin persists and shows on app open

