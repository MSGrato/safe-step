

## Plan: Unified Warm Neutral Color Scheme

### Goal
Replace pure whites with warm, muted neutrals across both the real UI and all three decoy apps so they share a cohesive palette. The real UI stays discreet; quick-exiting to a decoy won't show an obvious color shift.

### Color Direction
- **Shared background**: Warm off-white like `hsl(40, 10%, 95%)` (~#F4F2EE) instead of pure white
- **Cards**: Slightly lighter warm tone `hsl(40, 10%, 98%)` (~#FAF9F7)
- **Borders/muted**: Warm grays instead of cool neutrals
- **Primary**: Keep the existing teal-ish tone for the real UI
- **Decoy accent** (recipe): stays warm orange, but backgrounds align with shared palette

### File Changes

**`src/index.css`** — Update CSS custom properties:
- Light mode `--background`: warm off-white instead of `0 0% 100%`
- `--card`: warm near-white instead of pure white
- `--muted`, `--secondary`, `--border`, `--input`: shift to warm gray tones
- `--decoy-bg`, `--decoy-card`: align with the new shared warm palette
- Dark mode: slightly warmer dark tones

**`src/components/decoys/NotesApp.tsx`** — Replace hardcoded Tailwind neutrals:
- `bg-neutral-50` → `bg-[hsl(var(--background))]` or the shared warm tone
- `text-neutral-900/700/500/400/300` → use shared CSS variable colors
- `bg-neutral-200/60` → use muted variable
- FAB `bg-neutral-900` → use foreground variable

**`src/components/decoys/CalculatorApp.tsx`** — Soften the stark black:
- `bg-neutral-950` → dark warm gray like `bg-[#1C1B1A]`
- `bg-neutral-800/700` → warmer dark grays
- Keep functional contrast for readability

**`src/components/decoys/RecipeApp.tsx`** — Already uses `decoy-*` tokens, so updating the CSS variables will cascade automatically. No component changes needed.

### What stays the same
- All text contrast ratios remain accessible
- Real UI layout, icons, and structure unchanged
- Calculator keeps its dark look (just warmer)
- Decoy recipe accent color (orange) stays

