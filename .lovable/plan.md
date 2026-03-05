

## Plan: Show Onboarding Before Decoy on First Launch

### Current Flow
1. App opens → Decoy UI immediately
2. Triple-tap → Real mode → Onboarding (Privacy → Welcome → Skin → Safety)

### New Flow
1. App opens → "You are Safe" screen → Privacy Policy → Skin selection → Safety notice
2. After onboarding completes → Decoy UI
3. Triple-tap → Real interface (no onboarding again)

### Changes

**`src/pages/Index.tsx`**
- Before showing decoy, check `hasCompletedOnboarding`. If false, show `<Onboarding />` regardless of mode.
- Remove the onboarding check from inside the `mode === 'real'` block — onboarding is now a top-level gate.

**`src/components/onboarding/Onboarding.tsx`**
- Reorder steps: Step 0 = "You are Safe" (currently step 1), Step 1 = Privacy Policy (currently step 0), Step 2 = Skin selection, Step 3 = Safety notice.
- Adjust initial step logic: always start at step 0 on first launch. If privacy already accepted, skip to step 2.

**`src/contexts/AppContext.tsx`**
- No changes needed — `hasCompletedOnboarding` already tracks this.

