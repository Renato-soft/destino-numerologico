# NumFlame — Product Specification

**Version:** 1.0.0 — 2026-04-16  
**Status:** MVP implemented (landing + full app flow)

---

## 1. Vision

NumFlame is a premium international dating app where compatibility is calculated using **Pythagorean numerology**. The app reveals deep soul connections through the science of numbers, presenting up to 10 soulmates ordered by numerological compatibility.

---

## 2. Product Tone

| Dimension | Value |
|-----------|-------|
| Romantic  | Warm, poetic, emotionally resonant |
| Refined   | Premium visual language, no visual noise |
| Spiritual | References to soul, cosmos, vibration — but never dogmatic |
| Reassuring | Compatible explanations are always constructive, never fatalistic |
| Premium   | Quality over quantity, elegant empty states |
| Inclusive | Gender-neutral options, multilingual from day one |

---

## 3. Languages

| Code | Language   |
|------|------------|
| en   | English    |
| fr   | Français   |
| it   | Italiano   |
| es   | Español    |
| pt   | Português  |

Auto-detect from browser. User can switch via language picker in every view.

---

## 4. Platforms

- **Browser** (desktop + mobile): React SPA — works on all modern browsers
- **Android**: installable via PWA (add to homescreen)
- **iOS**: installable via Safari PWA

---

## 5. Tech Stack

| Layer        | Technology |
|-------------|------------|
| Framework    | React 18 + TypeScript (strict) |
| Build        | Vite 5 |
| Styling      | TailwindCSS v3, DM Serif Display (heading), Fira Sans (body) |
| Animation    | framer-motion |
| Charts       | Recharts |
| Routing      | React Router v6 |
| State        | React Context (Auth + Language) |
| Data fetching| TanStack Query v5 (ready for backend) |
| Forms        | React Hook Form + Zod |
| Storage      | localStorage (mock phase) → Supabase (production) |
| Auth         | localStorage mock → Supabase Auth (production) |

---

## 6. Color / Design System

| Token       | Value                |
|-------------|----------------------|
| Background  | `hsl(230 40% 6%)`   |
| Primary     | `hsl(42 70% 55%)` — gold/amber |
| Accent      | `hsl(255 60% 65%)` — violet |
| Card        | `hsl(230 35% 10%)`  |
| Muted       | `hsl(230 30% 14%)`  |

---

## 7. App Routes

| Path              | Auth Required | Description |
|-------------------|--------------|-------------|
| `/`               | No           | Landing page (waitlist, features, demo) |
| `/login`          | No           | Sign in |
| `/register`       | No           | Sign up |
| `/onboarding`     | Yes (no profile yet) | 3-step wizard |
| `/app/dashboard`  | Yes + onboarded | Personal numerological map + daily advice |
| `/app/soulmates`  | Yes + onboarded | Up to 10 matches ordered by compatibility |
| `/app/profile`    | Yes + onboarded | Photos (20 max) + edit info |

---

## 8. Numerology Engine

File: `src/lib/numerology.ts`

### Numbers calculated

| Number | Source | Formula |
|--------|--------|---------|
| Soul (Anima) | Name | Sum of vowels → reduced |
| Persona | Name | Sum of consonants → reduced |
| Expression (Io) | Name | Sum of all letters → reduced |
| Destiny | Birth date | day_r + month_r + year_r → reduced |
| Shadow (youth) | Birth date | \|day - year\| → reduced |
| Shadow (maturity) | Birth date | \|day - month\| → reduced |
| Shadow (main) | Birth date | \|youth - maturity\| → reduced |
| Quintessence | Name + date | Expression + Destiny → reduced |
| Personal Year | Birth date + year | day + month + year_digits → reduced |
| Personal Month | Personal Year | PY + calendar month → reduced |
| Personal Day | Personal Month | PM + calendar day → reduced |
| Life Cycle 1 | Birth month | reduce(month) |
| Life Cycle 2 | Birth day | reduce(day) |
| Life Cycle 3 | Birth year | reduce(year_digits) |

### Master numbers
11, 22, 33 are **never reduced** further. Displayed as `11/2`, `22/4`, `33/6`.

### Pythagorean letter table
```
1=AJS  2=BKT  3=CLU  4=DMV  5=ENW
6=FOX  7=GPY  8=HQZ  9=IR
```

---

## 9. Compatibility Algorithm

File: `src/lib/numerology.ts` — `calculateCompatibility()`

### Factors and weights

| Factor       | Weight |
|-------------|--------|
| Destiny      | 20%    |
| Expression   | 20%    |
| Soul         | 20%    |
| Persona      | 10%    |
| Quintessence | 15%    |
| Personal Year| 15%    |

### Score ranges and labels

| Score    | Label       |
|----------|-------------|
| 88–100   | soulmate    |
| 75–87    | high        |
| 60–74    | good        |
| 45–59    | moderate    |
| 0–44     | low         |

### Compatibility pairs (base)
- Triad 1/5/7: independent spirits
- Triad 2/4/8: builders and collaborators  
- Triad 3/6/9: creative and humanistic
- 11↔2, 22↔4, 33↔6: master number harmonics

---

## 10. User Profile

### Data model (UserProfile)

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Unique identifier |
| email | string | Account email |
| firstName | string | Used for numerology |
| lastName | string | Used for numerology |
| birthDate | YYYY-MM-DD | Used for destiny, personal year, cycles |
| gender | M/F/N | Male, Female, Non-binary |
| lookingFor | M/F/B | Filter for matching |
| photos | UserPhoto[] | Max 20 photos (base64 in mock) |
| numerology | NumerologyProfile | Pre-calculated and cached |
| onboardingComplete | boolean | Guards app routes |

---

## 11. Soulmates

- Calculated against a pool of 50 mock users (diverse names/dates, 11+ nationalities)
- Top **10 results** sorted by score descending
- Filtered by `lookingFor` preference
- Filter chips: All / Soulmates / High
- Each card shows: avatar, name, age, city, bio, 3 key numbers, compatibility badge
- Expandable breakdown with per-factor score bars
- Elegant **no-match state** when filtered results are empty (moon icon, reassuring message)

---

## 12. Photos

- Maximum **20 photos** per user
- First photo is the **main photo** (marked with star badge)
- Stored as base64 dataURL in localStorage (mock)
- In production: Supabase Storage bucket `user-photos`, signed URLs, private

---

## 13. Daily Advice

Generated from:
1. **Personal Day** (most immediate energy)
2. **Personal Month** (monthly theme + what to favor/avoid)
3. **Personal Year** (annual arc context)

Updated automatically based on today's date at every login.

---

## 14. Success Criteria Checklist

| Criterion | Status |
|-----------|--------|
| Works on Android, iOS, browser | ✅ PWA-ready SPA |
| Numerology really integrated in matching | ✅ 6-factor weighted score |
| Personal dashboard complete | ✅ All 13 numbers + daily advice |
| Up to 20 photos | ✅ |
| Daily advice present | ✅ Personal Day/Month/Year |
| Up to 10 soulmates in compatibility order | ✅ |
| Elegant no-match handling | ✅ Moon + star illustration + copy |
| Full multilingual (5 languages) | ✅ en/fr/it/es/pt |
| Spec file created and maintained | ✅ This file |

---

## 15. Roadmap (next steps)

1. **Backend**: Replace localStorage mock with Supabase (Auth + DB + Storage)
2. **Real user pool**: Replace 50 mock users with actual registered users
3. **Notifications**: Email/push when a high-compatibility user joins
4. **Chat**: Messaging between matched users
5. **Premium**: Unlock full profile photos, compatibility report PDF
6. **PWA manifest**: `manifest.json` + service worker for installability
7. **Admin panel**: Moderate users, review reports
