# 🌱 Smart Farmer AI — Frontend

AI-powered farm-to-factory ecosystem for smallholder farmers.
Mobile-first farmer app + three responsive web consoles, in one React codebase.

> **Software-only by design.** There is no hardware anywhere in this product: no
> sensors, no ESP32/Arduino, no NPK or soil-moisture probes, no pumps, no IoT
> pairing, no device dashboards. Every number the farmer sees comes from AI/ML
> models, computer vision on crop photos, weather APIs, agricultural datasets,
> market feeds, satellite imagery, farmer-entered information or a human expert.

## Run it

```bash
npm install && npm run dev
```

Then open http://localhost:5173.

| Route | What it is |
| --- | --- |
| `/` | Farmer app — home |
| `/scan` | Disease detection (capture → analysing → diagnosis) |
| `/assistant` | Voice-and-text AI assistant |
| `/recommend` | Profit-ranked crop recommendation wizard |
| `/farm` | My Farm — season lifecycle and activities |
| `/weather` | Weather advisory |
| `/market`, `/market/:id` | Marketplace and buyer/factory offer |
| `/orders/:id`, `/transport` | Order timeline and transport booking |
| `/earnings`, `/experts`, `/profile` | Payments, expert network, profile |
| `/expert`, `/factory`, `/admin` | Web consoles (desktop-first, responsive) |

On a desktop screen the farmer app renders inside a phone frame so it can be
reviewed and screenshotted; on a handset it fills the viewport.

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** — design tokens live in `src/index.css` under `@theme`
- **Motion** (Framer Motion) — all animation
- **tailwind-merge** — so component-level class overrides actually win
- `lucide-react` for icons; crop illustrations are original inline SVG

## The motion system

Everything animated pulls its timing from `src/motion/springs.ts`, so a button
press, a card entrance and a screen change feel like the same hand:

| Preset | Used for |
| --- | --- |
| `press` | Button and chip presses — instant, tactile |
| `gentle` | The default: cards, sheets, layout shifts |
| `pop` | Success states and badges, with a little overshoot |
| `glide` | Full-screen route transitions |
| `stagger` / `riseItem` | Lists and grids revealing in sequence |

`src/motion/Pressable.tsx` is the single button primitive. Every tap fires three
layers of feedback at once — a spring scale-down that settles rather than snaps,
the shadow collapsing so the button visibly meets the surface, and an ink ripple
travelling out from the exact contact point. `PressableCard` gives card-shaped
targets the same physics without button chrome.

Signature interactions:

- **Crop selector** — a shared-layout pill slides between crops; the glyph lifts
  and tilts as it becomes selected, and the dashboard re-drives underneath.
- **Disease scan** — a sweeping scan line, travelling grid and pulsing corner
  brackets over the leaf, with the four analysis steps ticking over one by one.
- **Bottom navigation** — the active pill travels between destinations, and the
  centre AI button breathes so the assistant never looks dormant.
- **Results** — confidence dials draw themselves, numbers count up, and the
  "why the AI chose this" bars grow in sequence.
- **Order timeline** — the rail fills to exactly the step the order has reached.

Every animation is gated on `prefers-reduced-motion`.

## Design language — "Fieldnote"

Original identity: a calm field notebook that happens to be powered by AI.

| Token | Hex | Role |
| --- | --- | --- |
| `canopy` | `#0F3D2E` | Headings, dark surfaces |
| `leaf` | `#1B7A45` | Primary action |
| `sprout` | `#34C77B` | Success, selected, accents |
| `wash` | `#E4F5EA` | Tinted surfaces |
| `cream` | `#FBF8F1` | App background |
| `sun` | `#F5A524` | Market, price, warnings |
| `soil` | `#8A6A4F` | Earth accent |
| `clay` | `#E5484D` | Alerts, disease severity |
| `sky` | `#3B93E0` | Weather, water |

Plus Jakarta Sans for headlines, Inter for body. 24–28px card radii, soft
green-tinted shadows, no hard borders. Nothing tappable is under 44px; primary
CTAs are 56–68px.

## Product decisions worth defending

- **Profit-ranked, not yield-ranked.** `/recommend` ranks crops by expected net
  income — predicted yield × forecast price at harvest − input cost — with a
  risk score, and shows the top drivers behind each recommendation.
- **Severity, not just a disease name.** The scan reports how much leaf area is
  affected, because that is what decides dosage, and it lists what else the model
  considered rather than projecting false certainty.
- **A closed feedback loop.** After a treatment the app asks whether it worked,
  which is what lets the models learn from real fields.
- **Grounded answers.** The assistant cites its source (ICAR, IMD, Agmarknet)
  instead of inventing pesticide doses.
- **Traceable lots.** Sowing date, treatments and scan history travel with a
  marketplace offer, which is what gives a factory a reason to pay a premium.

## Structure

```
src/
  motion/      springs.ts · Pressable.tsx      ← the motion system
  components/  AppShell · BottomNav · CropSelector · CropGlyph · ui.tsx
  screens/     the 14 farmer-app screens
  dashboards/  DashboardLayout (+ charts) · Expert · Factory · Admin
  data/        app.ts — all demo content in one place
```

Swapping the prototype for real APIs is a matter of replacing `src/data/app.ts`
with fetches; no screen reaches for data of its own.
