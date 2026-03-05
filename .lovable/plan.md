

## Plan: Weather App Decoy (Replacing Calculator)

The weather app will use the same unified warm neutral color palette already applied to the Recipe and Notes decoys — warm off-whites (`bg-background`), `text-foreground`, `bg-card`, `border`, `text-muted-foreground`, etc. No custom colors outside the design system.

### Changes

1. **Create `src/components/decoys/WeatherApp.tsx`**
   - Uses shared Tailwind theme tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border`, etc.)
   - Reuses existing UI components (`Card`, `Input`, `Button`)
   - City search input → Open-Meteo geocoding API → weather forecast API
   - Displays: temperature, condition icon (lucide), high/low, humidity, wind
   - Maps weather codes to lucide icons (Sun, Cloud, CloudRain, CloudSnow, etc.)
   - Triple-tap on "Weather" title text
   - Loads saved location on mount, fetches fresh data

2. **Update `src/lib/storage.ts`**
   - `DecoySkin` type: `'recipe' | 'notes' | 'weather'`
   - Add `weatherLocation` key storing `{ lat, lon, city }`

3. **Update `src/components/onboarding/Onboarding.tsx`**
   - Replace calculator option with weather (icon: `CloudSun`, label: "Weather")
   - Update triple-tap instruction for weather skin

4. **Update `src/pages/Index.tsx`**
   - Swap `CalculatorApp` → `WeatherApp`, condition `'calculator'` → `'weather'`

5. **Delete `src/components/decoys/CalculatorApp.tsx`**

All styling will match the existing decoy aesthetic — no new CSS variables or colors introduced.

