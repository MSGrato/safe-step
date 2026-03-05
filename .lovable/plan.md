## Plan: Revamp Onboarding Flow + Add Safety Check on Return

### New Onboarding Order (6 steps)

1. **Safety Notice** — monitoring software warning (currently step 3)
2. **Privacy Policy** — with acceptance checkbox (currently step 1)
3. **"You are Safe"** — reassurance screen (currently step 0)
4. **Skin Selection** — choose disguise (currently step 2)
5. **How to Access** — dynamic instruction based on chosen skin:
  - Recipe: "Triple-tap the 'My Recipes' title"
  - Notes: "Triple-tap the 'Notes' title"
  - Calculator: "Triple-tap the 'C' button"
6. **Real UI onboarding** — complete onboarding, enter real interface for first time

### Returning User: Safety Check Screen

After onboarding is complete, when the user triple-taps to enter real mode, show an intermediate "Are you safe?" screen with 3 options:

- **"Yes, I am safe"** → proceed to real UI
- **"No, I need DV Hotline"** → show National DV Hotline info (1-800-799-7233) (phone number is a link to make a call)
- **"No, I need 911"** → placeholder/non-functional for now

### File Changes

`**src/components/onboarding/Onboarding.tsx**`

- Reorder steps: Safety Notice (0) → Privacy (1) → You are Safe (2) → Skin Selection (3) → Access Instructions (4) → first real UI entry (5)
- Step 4 is new: shows dynamic text based on `selectedSkin` explaining which element to triple-tap
- Step 5: calls `completeOnboarding()` and sets mode to `real`

`**src/components/real/SafetyCheckScreen.tsx**` (new)

- Three-button screen: "Yes, I am safe", "No, I need DV Hotline", "No, I need 911"
- DV Hotline option shows contact info overlay
- 911 option shows "coming soon" or placeholder
- "Yes" proceeds to real interface

`**src/pages/Index.tsx**`

- Add a `showSafetyCheck` state. When `toggleMode` is triggered (triple-tap) and mode would become `real`, show `SafetyCheckScreen` first instead of going directly to `RealInterface`
- On "Yes, I am safe" → set mode to real
- On first launch after onboarding completes, go directly to real UI (skip safety check since they just onboarded)

`**src/contexts/AppContext.tsx**`

- Add `enterRealMode` function that sets mode to `real` (used by safety check)
- Modify `toggleMode` behavior or add a flag so Index can intercept the transition