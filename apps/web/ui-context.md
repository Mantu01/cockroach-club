# UI Context — Cockroach Club (`apps/web`)

Use this document whenever building or changing UI. **Only describe functionality in your prompt** — follow everything here for layout, styling, components, data flow, and code style so the result stays consistent with the rest of the app.

**Visual reference (do not modify):** `src/app/page.tsx` (marketing home).

---

## 1. Code style (mandatory)

| Rule | Requirement |
|------|-------------|
| Semicolons | **Every** statement in `.ts` / `.tsx` files must end with `;` |
| Comments | **No** comments in source files |
| Positioning | **Never** use `position: absolute` or `position: relative` (or Tailwind `absolute` / `relative`) in app code. Use flexbox, grid, gap, padding, margin only. Exception: shadcn/ui primitives under `components/ui/` — do not edit those for positioning unless unavoidable |
| Navigation | Use `Link` from `next/link`, never `<a href>` for internal routes |
| Images | Use `next/image` `Image`, never raw `<img>` for app content |
| Client directive | Add `'use client';` at top of any file using hooks, browser APIs, or event handlers |

---

## 2. Brand & typography

### App identity
- **Name:** `Cockroach Club` — import from `@/lib/constants/app` → `APP_NAME`
- **Tagline:** `Cockroach Mode — Active` → `APP_TAGLINE`
- **Tone:** Premium, dark-survival, editorial; confident and slightly irreverent

### Fonts (loaded in `src/app/layout.tsx`)
| Role | CSS variable | Usage |
|------|--------------|--------|
| Headings / stats | `var(--font-syne)` or `style={{ fontFamily: "'Syne', sans-serif" }}` | Page titles, card values, CTAs, sidebar app name |
| Body / quotes | `var(--font-dm-serif)` or `'DM Serif Display', serif` | Marketing copy, italic emphasis (home only unless matching marketing) |
| UI default | `var(--font-geist-sans)` | Body text via `html` |
| Mono | `var(--font-geist-mono)` | Section labels, IDs, LaTeX |

Constants: `@/lib/constants/theme` → `FONT_FAMILIES`

### Accent palette (lifecycle / status — do not invent new hex values)
Import `ACCENT_COLORS` from `@/lib/constants/theme`:

| Key | Hex | Use |
|-----|-----|-----|
| `squash` | `#b5451b` | Primary accent, warnings, rejected |
| `stomp` | `#c4922a` | Secondary accent, saved status |
| `scuttle` | `#4a7c59` | Success, interview, positive trends |
| `survived` | `#1a6b8a` | Info, applied, links emphasis |

For status badges and feature cards, set `style={{ color, borderColor }}` from this map — **never** hardcode new accent hex in pages.

---

## 3. Design tokens & theme

### CSS variables (`src/app/globals.css`)
- Use semantic tokens: `background`, `foreground`, `muted`, `muted-foreground`, `border`, `primary`, `card`, `destructive`, `sidebar-*`, `chart-*`
- **Do not** add one-off colors in components; extend `globals.css` `:root` / `.dark` if a new token is truly needed
- Borders: prefer `border-border/30` or `border-border/40` for soft dividers
- Cards/surfaces: `bg-muted/5` with `hover:bg-muted/10` for interactive cards

### Dark mode
- `next-themes` via `@/providers/theme-provider` in root layout
- `attribute="class"`, `defaultTheme="system"`, `enableSystem`
- Theme control: `@/components/layout/theme-toggler` (`ThemeToggle`) — outline icon button, dropdown Light/Dark/System
- Settings page also exposes theme buttons; keep in sync with `UserSettings.theme`

### Compact content (fit more on screen)
All studio/app UI uses **small** type. Use `UI_SIZES` from `@/lib/constants/theme` — **do not** duplicate class strings:

| Constant | Classes | Use |
|----------|---------|-----|
| `pageTitle` | `text-lg font-black tracking-tight` | Page `<h1>` / `<h2>` |
| `pageSubtitle` | `text-xs text-muted-foreground leading-relaxed` | Descriptions under titles |
| `sectionLabel` | `text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground` | Card section headers |
| `cardTitle` | `text-sm font-semibold` | In-card titles |
| `cardValue` | `text-xl font-black tabular-nums` | Metrics / numbers |
| `badge` | `text-[10px] tracking-widest uppercase` | Badges |
| `tableText` | `text-xs` | Tables |

**Extra small patterns (use consistently):**
- Sidebar nav labels: `text-xs`
- Meta / secondary: `text-[10px] text-muted-foreground`
- Tiny badges: `text-[9px] px-1 py-0` or `px-1.5`
- Buttons in studio: `size="sm"`, `h-7`, `text-[10px]`, often `tracking-widest uppercase` for primary actions
- Inputs in studio: `h-8 text-xs`
- Icons in dense UI: `size-3` or `size-3.5`; in buttons `size-4` max

---

## 4. Component library (shadcn only)

**Strictly** use components from `@/components/ui/*`. Do not use raw HTML substitutes for buttons, inputs, cards, dialogs, etc.

### Commonly used
`Button`, `Card`, `CardHeader`, `CardContent`, `Badge`, `Input`, `Label`, `Textarea`, `Select`, `Separator`, `Table`, `Tabs`, `DropdownMenu`, `Avatar`, `Skeleton`, `Tooltip`, `Sheet`, `Sidebar*`, `Chart` (recharts wrapper)

### Button variants in this app
| Variant | When |
|---------|------|
| `default` | Primary actions, Quick Create |
| `outline` | Secondary, icon triggers, theme toggle |
| `ghost` | Inline links, “View listing”, back links |

### Card pattern (studio standard)
```tsx
<Card className="border border-border/40 bg-muted/5">
  <CardHeader className="px-4 py-3">...</CardHeader>
  <CardContent className="px-4 pb-4">...</CardContent>
</Card>
```

### Badge pattern
```tsx
<Badge variant="outline" className={UI_SIZES.badge}>...</Badge>
```

---

## 5. Layout systems

### A. Marketing / public pages (outside studio)
- Full-width sections, `px-6 lg:px-16`, `border-b border-border/30`
- Optional wrapper: `@/components/layout/page-shell` for centered card layouts (profile legacy, info pages)
- Footer: `@/components/layout/footer` (global in root layout)

### B. Studio shell (`src/app/(main)/studio/layout.tsx`)
Always nested inside:
1. `StoreProvider` → Redux
2. `StudioDataProvider` → API fetch helpers
3. `SidebarProvider` with CSS vars:
   - `--sidebar-width: calc(var(--spacing) * 60)`
   - `--header-height: calc(var(--spacing) * 11)`
4. `AppSidebar` + `SidebarInset` → `SiteHeader` + **page content**

**Studio page structure (repeat on every studio route):**
```tsx
<div className="flex flex-1 flex-col">
  <StudioPageHeader title="..." description="..." action={optional} />
  {/* content: px-4 lg:px-6, gap-3, pb-6 */}
</div>
```

### C. Standalone account pages (`/settings`, `/account`, `/billing`, `/notifications`)
- **Not** inside studio sidebar layout
- Wrap with `StoreProvider` + `StudioDataProvider`
- Container: `min-h-[calc(100vh-220px)] px-4 py-6 lg:px-8`
- Inner: `mx-auto max-w-2xl` or `max-w-3xl`
- Back link: ghost button `h-7 text-[10px]` → `ROUTES.settings` or `ROUTES.dashboard`

---

## 6. Shared studio components (reuse — do not reinvent)

| Component | Path | Purpose |
|-----------|------|---------|
| `StudioPageHeader` | `@/components/studio/studio-page-header` | Title + subtitle + optional action slot |
| `StatCard` | `@/components/studio/stat-card` | Dashboard metric cards |
| `FeatureCard` | `@/components/studio/feature-card` | Studio home feature grid |
| `StudioLoader` | `@/components/studio/studio-loader` | Skeleton list while loading |
| `ThemeToggle` | `@/components/layout/theme-toggler` | Header/settings theme |

---

## 7. Sidebar (`AppSidebar`)

| Zone | Content |
|------|---------|
| Header | `APP_NAME` + `Flame` icon (`text-[#b5451b]`) → `Link` to `ROUTES.dashboard` |
| Main | **Quick Create** (primary button) → `ROUTES.studio`; then `MAIN_NAV` from `@/lib/constants/navigation` |
| Middle | `NavUpcoming` — disabled items, “Soon” badge |
| Lower | `NavRecentSearches` — dynamic from Redux `studio.recentSearches` |
| Footer | `NavUser` — Clerk user, dropdown: Account, Billing, Notifications, Settings, Logout |

Nav items: `SidebarMenuButton` + `Link`, `isActive` from `usePathname()`, icons `size-4`.

---

## 8. Site header (studio)

`@/components/sidebar/site-header`:
- `SidebarTrigger` + vertical `Separator` + page title from `PAGE_TITLES[pathname]`
- Right: `ThemeToggle` + settings icon link → `ROUTES.settings`
- Title font: Syne, `text-sm font-black tracking-tight`

When adding a new studio route, **add** an entry to `PAGE_TITLES` in `@/lib/constants/navigation`.

---

## 9. Routes & constants (single source of truth)

**Always** import paths from `@/lib/constants/app` → `ROUTES`. Never hardcode `/studio/...` strings in components.

| Route constant | Path |
|----------------|------|
| `ROUTES.home` | `/` |
| `ROUTES.dashboard` | `/studio/dashboard` |
| `ROUTES.studio` | `/studio` |
| `ROUTES.jobs` | `/studio/jobs` |
| `ROUTES.applications` | `/studio/applications` |
| `ROUTES.profile` | `/studio/profile` |
| `ROUTES.resume` | `/studio/resume` |
| `ROUTES.preparations` | `/studio/preparations` |
| `ROUTES.settings` | `/settings` |
| `ROUTES.account` | `/account` |
| `ROUTES.billing` | `/billing` |
| `ROUTES.notifications` | `/notifications` |

`/dashboard` redirects to `ROUTES.dashboard`.

New features: extend `ROUTES`, `MAIN_NAV` or `STUDIO_FEATURES`, and `PAGE_TITLES` together.

---

## 10. Data & state (UI-related)

| Layer | Use |
|-------|-----|
| **Redux** (`@/store`) | Client state: `studio.*`, `ui.*` — read with `useAppSelector`, write via context actions → slice |
| **Context** (`useStudioData`) | All API calls; call `fetchX()` on page mount |
| **Axios** (`@/lib/api` → `studioApi`) | Never `fetch()` directly in pages for studio data |
| **Auth** | Clerk `useUser`, `useClerk`; token via `setAuthToken` inside `StudioDataProvider.ensureAuth()` |

### Page data-loading pattern
```tsx
const { fetchJobs } = useStudioData();
const jobs = useAppSelector((s) => s.studio.jobs);
const loading = useAppSelector((s) => s.studio.loading.jobs);
const fetched = useRef(false);

useEffect(() => {
  if (fetched.current) return;
  fetched.current = true;
  void fetchJobs();
}, [fetchJobs]);

if (loading && jobs.length === 0) return <StudioLoader rows={6} />;
```

Prefer **one** `useEffect` per page for initial fetch; avoid extra effects for derived state.

### Toasts
`import { toast } from 'sonner';` — success/error on mutations; `Toaster` in root layout `position="bottom-right"`.

---

## 11. Status & semantic colors (maps)

Use these consistently (import or duplicate exactly):

**Application status**
| Status | Color |
|--------|-------|
| `saved` | `#c4922a` |
| `applied` | `#1a6b8a` |
| `interview` | `#4a7c59` |
| `rejected` | `#b5451b` |
| `offer` | `#4a7c59` |

**Preparation difficulty**
| Level | Color |
|-------|-------|
| `easy` | `#4a7c59` |
| `medium` | `#c4922a` |
| `hard` | `#b5451b` |

**Notification type**
| Type | Color |
|------|-------|
| `job` | `#4a7c59` |
| `application` | `#1a6b8a` |
| `system` | `#c4922a` |
| `billing` | `#b5451b` |

---

## 12. Spacing & grids

| Context | Pattern |
|---------|---------|
| Studio page horizontal padding | `px-4 lg:px-6` |
| Section vertical gap | `gap-3` or `gap-4 py-4` |
| Stat grid | `grid grid-cols-2 lg:grid-cols-4 gap-3` |
| Feature grid | `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3` |
| Two-column forms | `grid grid-cols-1 lg:grid-cols-2 gap-3` |
| List of cards | `flex flex-col gap-2` |

---

## 13. Icons

- Library: **lucide-react** only
- Sizes: `size-3`, `size-3.5`, `size-4` in dense UI; never oversized icons in tables/lists
- Quick Create: `CirclePlusIcon`
- App logo mark: `Flame` with `text-[#b5451b]`

---

## 14. Charts (dashboard)

- Use `@/components/ui/chart` (`ChartContainer`, `ChartTooltip`, `ChartTooltipContent`)
- Recharts `AreaChart` / `Area` inside container
- Height: `h-[180px]` or `h-[250px]` with `aspect-auto w-full`
- Chart config colors: use `ACCENT_COLORS` or `var(--primary)` — register in `chartConfig` satisfies `ChartConfig`

---

## 15. Forms & settings UI

- `Label` with `className="text-[10px]"`
- `Input` / `Textarea`: `text-xs`, compact heights
- Toggle settings: row with label + description + `Button` On/Off (`SettingToggle` pattern in settings page)
- Save actions: top-right in `StudioPageHeader` `action` prop or bottom primary `Button` `size="sm"`

---

## 16. Empty & loading states

| State | UI |
|-------|-----|
| Loading (no data yet) | `<StudioLoader rows={N} />` |
| Empty list | Single sidebar row or card message, `text-muted-foreground text-xs` |
| Error | `toast.error(...)`; optional `text-destructive text-xs` inline |

---

## 17. External links

- `Link` from `next/link` with `target="_blank"` for job URLs (external)
- Pair with `ExternalLink` icon, `text-[10px]` ghost button

---

## 18. What NOT to do

- Do not change `src/app/page.tsx` (home reference)
- Do not add comments
- Do not use `absolute` / `relative` in `components/studio`, `components/sidebar`, `app/(main)/**`, `components/layout` (except existing shadcn ui)
- Do not create new color hex values outside `ACCENT_COLORS` / status maps
- Do not use `<a>`, `<img>`, or raw `fetch` for studio features
- Do not duplicate route strings — use `ROUTES`
- Do not duplicate typography classes — use `UI_SIZES`
- Do not use large text (`text-2xl+`) in studio; keep compact
- Do not skip `StudioPageHeader` on studio pages
- Do not mount studio API pages without `StoreProvider` + `StudioDataProvider` where data is needed

---

## 19. Checklist for new UI

When implementing a new screen, verify:

- [ ] `'use client';` if interactive
- [ ] Semicolons on every statement
- [ ] No comments
- [ ] No absolute/relative positioning in app code
- [ ] shadcn components only
- [ ] `ROUTES` / `UI_SIZES` / `ACCENT_COLORS` from constants
- [ ] `StudioPageHeader` (studio) or standalone layout pattern (account pages)
- [ ] Card/border/typography matches §4–§5
- [ ] Data via `useStudioData` + Redux (not ad-hoc fetch)
- [ ] `PAGE_TITLES` updated if new studio route
- [ ] `Link` / `Image` for Next.js navigation and media
- [ ] Loading state with `StudioLoader`
- [ ] Toasts on success/error mutations
- [ ] Syne font on headings via `UI_SIZES` + inline `fontFamily` where needed

---

## 20. Prompt template for future work

When asking for new UI, use:

> Build [functionality]. Follow `apps/web/ui-context.md`. Studio route under `(main)/studio/...`. Only describe behavior and fields; styling and structure come from ui-context.

Example:

> Add a “Saved Jobs” page listing bookmarked jobs with remove action. Follow ui-context.md. Route: `/studio/saved`.

---

## 21. File map (quick reference)

```
src/lib/constants/app.ts       → APP_NAME, ROUTES, API_BASE_URL
src/lib/constants/theme.ts     → ACCENT_COLORS, FONT_FAMILIES, UI_SIZES
src/lib/constants/navigation.ts → MAIN_NAV, UPCOMING_FEATURES, STUDIO_FEATURES, PAGE_TITLES
src/lib/api.ts                 → apiClient, studioApi, types
src/store/                     → Redux store & slices
src/context/studio-data-context.tsx → API fetch/mutations
src/app/(main)/studio/layout.tsx   → Studio shell
src/components/studio/         → Reusable studio UI
src/components/sidebar/      → Sidebar & header
src/components/layout/         → theme-toggler, footer, page-shell
src/app/globals.css            → Theme tokens
```
