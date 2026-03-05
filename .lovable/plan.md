

## Plan: Privacy Policy Acceptance Screen in Onboarding

### What
Add a new step at the very beginning of the onboarding flow (before the "You are safe here" screen) that displays the full SafeStep Privacy Policy text and requires the user to check a checkbox confirming they've read it before proceeding.

### How

**1. Store the privacy policy content as a constant**
- Create `src/lib/privacyPolicy.ts` with the full privacy policy text broken into sections (title, sections 1-12, contact info)
- Each section as a string constant for clean rendering

**2. Update `src/lib/storage.ts`**
- Add a `privacyAccepted` key to `KEYS`
- Add `isPrivacyAccepted()` and `setPrivacyAccepted()` helpers

**3. Update `src/contexts/AppContext.tsx`**
- Add `hasAcceptedPrivacy` state (initialized from storage)
- Add `acceptPrivacy()` callback
- Include in context value
- Update `resetApp` to also clear privacy acceptance

**4. Update `src/components/onboarding/Onboarding.tsx`**
- Insert a new step 0 (shift existing steps to 1, 2, 3)
- New step 0: Privacy Policy screen with:
  - "Privacy Policy & Disclosures" heading
  - ScrollArea containing the full policy text rendered with proper headings and paragraphs
  - Checkbox at the bottom: "I have read and accept the Privacy Policy"
  - "Continue" button disabled until checkbox is checked
- The safety notice at top of the policy is already in the PDF content

**5. Update `src/pages/Index.tsx`**
- Check `hasAcceptedPrivacy` — if false and in real mode, show onboarding starting from the privacy step (this is already handled since onboarding resets with `resetApp`)

