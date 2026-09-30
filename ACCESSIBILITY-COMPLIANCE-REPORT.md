# Accessibility Compliance Report — MGM Financiers Website

**Standard:** BIS/IS 17802 (Part 1):2021 (adopts WCAG 2.1 Level A/AA) · WCAG 2.1 AA
**Date:** 2026-10-01
**Scope:** `app/` (public website, all 13 routes), `consent/` (credit-bureau consent portal, 5 screens). Admin console (internal tool) out of scope. API/analytics code not modified.
**Design constraint honored:** No redesign. All changes are semantic (ARIA, focus, markup), color-contrast tokens, or micro-class adjustments required for compliance. No typography, layout, imagery, or branding changes.

**Verdict:** **0 axe violations × 13 main pages × 0 × 5 consent screens; keyboard suite 23/23 PASS; both production builds clean.** No FAIL items. 4 PARTIAL items are manual/environment-dependent (see gate table).

---

## 1. Pre-Deployment Gate

| # | Gate item | Status | Evidence |
|---|---|---|---|
| 1 | Full build clean | **PASS** | `app`: `vite build` ✓ (267 modules); `consent`: `tsc -b && vite build` ✓. Only pre-existing >500 kB chunk warning (non-blocking) |
| 2 | Automated a11y tests | **PASS** | axe-core (wcag2a/2aa/21a/21aa): **0 violations on 13/13 app pages + 0 on 5/5 consent screens**, 120+ passes; artifacts `axe-results.json`, `axe-consent.json` |
| 3 | Keyboard-only tests | **PASS** | `kbd-tests.js`: **23/23** — skip link, focus ring (12 focusables), mega-menu, mobile drawer (trap/ESC/focus-return), Apply modal (trap/ESC/return), form errors, grievance tabs (arrow keys + roving tabindex), reflow 1440→320 px × 8 routes, prefers-reduced-motion |
| 4 | Screen-reader tests | **PARTIAL** | All SR-facing semantics verified programmatically (roles, names, live regions, focus order/traps — automated). Live VoiceOver/NVDA session not recorded |
| 5 | Forms | **PASS** | Explicit labels (`htmlFor`/`useId`), `aria-invalid` + `aria-describedby` + `role="alert"` on every error, required markers, 1.3.5 `autoComplete` tokens, OTP patterns (digits-only, paste, backspace-nav, one-time-code) |
| 6 | Indian languages | **PARTIAL** | Customer Advisory fully bilingual EN/हिन्दी with correct `lang` attribute on the dialog and toggle; rest of site English-only (full localization out of scope) |
| 7 | Mobile navigation | **PASS** | Drawer: `role="dialog"` + `aria-modal`, focus moved in on open (fixed: `transition-[opacity]` so visibility snaps), Tab-trapped, ESC closes, focus returns to hamburger; 320 px reflow clean (incl. grievance email wrap fix) |
| 8 | Payment / grievance / loan flows | **PARTIAL** | `/pay-emi`, `/grievance`, Apply-Loan modal: axe 0 + keyboard-tested incl. live-region status messages. Real-money transactional E2E not run (no backend changes were made) |
| 9 | No functional/API/analytics/admin regressions | **PASS** | Diff scope = classes/ARIA/markup only; no API, analytics, or admin files touched; dev HMR log clean |

**Deploy decision:** All Critical/High automated gates PASS. Items 4, 6, 8 are manual/environment scope — **deployment not yet executed; awaiting go-ahead.**

---

## 2. Requirement Compliance Table

| CATEGORY | REQUIREMENT | STATUS | EVIDENCE | FILE(S) | FIX |
|---|---|---|---|---|---|
| Perceivable | 1.1.1 Non-text content (A) | PASS | axe 0; decorative SVGs `aria-hidden`, logo `alt="MGM Financiers"`, icon links `aria-label` | Header, Footer, WhatsAppButton, Grievance.jsx:53 | aria-hidden on graphics; labels on icon-only controls |
| Perceivable | 1.3.1 Info & relationships (A) | PASS | Labels↔inputs, headings, lists, landmarks (`main#main-content`), tablist/tab/tabpanel, `aria-controls`/`aria-expanded`, scroll `role="region"` | all form components, Header, FAQ, Grievance, TeamHome | Semantic elements + ARIA wiring |
| Perceivable | 1.3.2 Meaningful sequence (A) | PASS | DOM order matches visual order (axe + review) | — | — |
| Perceivable | 1.3.4 Orientation (A) | PASS | No orientation locks; responsive at 6 widths | — | — |
| Perceivable | 1.3.5 Identify input purpose (AA) | PASS | `autoComplete="name/tel/email"` + `one-time-code` on all personal-data fields | Contact, ApplyNow, PayEMI, Grievance, consent OTPVerification | Added tokens (input purpose) |
| Perceivable | 1.4.1 Use of color (A) | PASS | Errors = text + `role="alert"` (+icons); links underlined | Contact, Grievance, PayEMI, ConsentReview | — |
| Perceivable | 1.4.3 Contrast minimum (AA) | PASS | axe color-contrast 0 violations; token math: `mgm-gold-text #8a6d00` (4.92:1 white), `text-mgm-dark/70` (6.31:1), placeholder `/65` (5.32:1), `white/60` on dark, `red-600` (4.83), `green-700` (5.03), `gray-500` (4.83) | 29 files swept (~500 token fixes) | Contrast-token sweep with dark-section exclusions |
| Perceivable | 1.4.4 Resize text (AA) | PASS | 320 px viewport test (=400 % of 1280) × 8 routes: no clipping, no scroll | all pages | Reflow fixes (Grievance email `break-all`) |
| Perceivable | 1.4.5 Images of text (AA) | PASS | No bitmaps of text; status infographic duplicates real text in tab panel; signature stamp is `aria-hidden` decoration | Grievance.jsx | — |
| Perceivable | 1.4.10 Reflow (AA) | PASS | kbd TEST7: no horizontal scroll @1440/1280/768/640/375/320 | all 8 tested routes | `break-all` on long email (Grievance.jsx:868) |
| Perceivable | 1.4.11 Non-text contrast (AA) | PASS | Input/button boundaries ≥3:1 (`gray-500`, `mgm-dark/50`, `red-600`, `gold-text`), focus `outline:2px`, slider thumb ring, checkbox borders, header pill `bg-white/85 border-black/5` (nav over dark sections) | Contact, Grievance, ApplyNow, PayEMI, EMICalculator, Header, ConsentReview, OTPVerification | ~60 border/focus fixes |
| Perceivable | 1.4.12 Text spacing (AA) | PASS | No fixed-height text containers clipping content | — | — |
| Operable | 2.1.1 Keyboard (A) | PASS | 23/23; native range sliders, mega menu, drawer, modal, tabs, OTP all keyboard-operable | Header, Grievance, ApplyNow, PdfPlaceholder | Arrow-key tabs; drawer focus management |
| Operable | 2.1.2 No keyboard trap (A) | PASS | All traps ESC-dismissable; scroll regions focusable not trapped | PdfPlaceholder, ApplyNow, Header | Focus trap + Escape + focus-return |
| Operable | 2.1.4 Character key shortcuts (A) | PASS | None defined | — | — |
| Operable | 2.2.1 Timing adjustable (A) | PASS | No auto-advancing timed content | — | — |
| Operable | 2.2.2 Pause, stop, hide (A) | PASS | No auto-scroll/marquee (team carousel = manual snap scroll); load animations finite + skipped under `prefers-reduced-motion` | TeamHome, global CSS | reduced-motion CSS |
| Operable | 2.3.1 Three flashes (A) | PASS | None | — | — |
| Operable | 2.4.1 Bypass blocks (A) | PASS | Skip link "Skip to main content" → `#main-content`, first Tab (kbd TEST1) | App.jsx | Skip link + `main` id |
| Operable | 2.4.2 Page titled (A) | PASS | Per-page `<title>` via SEO component | SEO.jsx, LegalPage | — |
| Operable | 2.4.3 Focus order (A) | PASS | Focus moves into dialogs on open and returns to trigger on close (drawer→hamburger, modal→Apply button, advisory→prior element) | Header, ApplyNow, PdfPlaceholder, CustomerAdvisory | previous-focus capture/restore |
| Operable | 2.4.4 Link purpose (A) | PASS | Text links descriptive; icon/social links labeled; axe link-in-text 0 | Footer, WhatsAppButton | `aria-label` on icon links |
| Operable | 2.4.5 Multiple ways (AA) | PASS | Nav menu, footer sitemap, service index, search-free but ≥2 routes to content | Header, Footer | — |
| Operable | 2.4.6 Headings and labels (AA) | PASS | Descriptive labels; axe heading/label rules 0 | all forms | Label cleanup (was placeholder-only) |
| Operable | 2.4.7 Focus visible (AA) | PASS | Global `*:focus-visible { outline: 2px solid #1a1a2e }` + gold flip on dark; kbd TEST1 outline on 12 focusables | index.css | Focus-indicator system |
| Operable | 2.5.1 Pointer gestures (A) | PASS | No multipoint/path-only gestures | — | — |
| Operable | 2.5.2 Pointer cancellation (A) | PASS | Standard click/press semantics | — | — |
| Operable | 2.5.3 Label in name (A) | PASS | axe `label-in-name` 0 violations | — | — |
| Operable | 2.5.4 Motion actuation (A) | PASS | None | — | — |
| Understandable | 3.1.1 Language of page (A) | PASS | `<html lang="en">`; advisory `lang={lang}` toggles en/hi | index.html, CustomerAdvisory | lang attribute |
| Understandable | 3.1.2 Language of parts (AA) | PASS | Hindi advisory content under `lang="hi"` | CustomerAdvisory | lang switch |
| Understandable | 3.2.1 On focus (A) | PASS | No context change on focus (kbd suite) | — | — |
| Understandable | 3.2.2 On input (A) | PASS | Selects/checkboxes/sliders update in place; no auto-navigation | EMICalculator, ApplyNow | — |
| Understandable | 3.2.3 Consistent navigation (AA) | PASS | Shared Header/Footer on every route | Header, Footer | — |
| Understandable | 3.2.4 Consistent identification (AA) | PASS | Shared components/icons reused | — | — |
| Understandable | 3.3.1 Error identification (A) | PASS | 19+ fields: `aria-invalid` + `aria-describedby` + `role="alert"` text | Grievance, PayEMI, ApplyNow, Contact | Error wiring sweep |
| Understandable | 3.3.2 Labels or instructions (A) | PASS | Visible labels for all inputs; required `*` + text; OTP instructions | all forms | Label restoration (placeholder was only label) |
| Understandable | 3.3.3 Error suggestion (AA) | PASS | Format hints (10-digit phone, valid email/PAN) + corrective messages | PayEMI, ApplyNow, Grievance | — |
| Understandable | 3.3.4 Error prevention (AA) | PARTIAL | Loan application = financial: multi-step with back/edit navigation before submit; **no dedicated review-and-confirm step** | ApplyNow.jsx | Recommended follow-up |
| Robust | 4.1.1 Parsing (A) | PASS | Invalid `<p><ul>` nesting fixed; builds warning-free | consent ConsentReview | `p`→`div` |
| Robust | 4.1.2 Name, Role, Value (A) | PASS | axe `aria-*`/`button-name`/`select-name` 0; all controls named + typed | all | roles/labels added |
| Robust | 4.1.3 Status messages (AA) | PASS | Payment status, OTP errors, contact submission, tab-panel updates announced via live regions/alerts | PayEMI, Contact, Grievance | `role="status"`/`alert` + `aria-live` |
| — | 1.4.2 Audio control (A) | NOT APPLICABLE | No autoplaying audio | — | — |
| — | Admin console | NOT APPLICABLE | Internal tool, out of declared scope | — | — |
| — | AAA criteria (1.4.6, 2.4.5+, etc.) | NOT APPLICABLE | Conformance target is Level AA | — | — |

---

## 3. Automation & Test Evidence

| Artifact | Command | Result |
|---|---|---|
| Main-site axe | `BASE_URL=http://localhost:5176 node run-axe.js` | 13/13 pages **0 violations** (`axe-results.json`) |
| Consent axe (mocked API) | `node run-axe-consent.js` | 5/5 screens **0 violations** (`axe-consent.json`) |
| Keyboard suite | `node kbd-tests.js` | **23/23 PASS** |
| App build | `npm run build` (app) | ✓ clean |
| Consent build | `npm run build` (consent) | ✓ clean (`tsc -b` + vite) |

Scripts: `/var/folders/5n/k4jr3lx55_zgsxnk5cy0jm500000gn/T/opencode/a11y-test/`

## 4. Fix Inventory (summary)

- **Global:** skip link + `main#main-content`, focus-visible outline (+ gold flip on dark), `prefers-reduced-motion`, `mgm-gold-text` contrast token, `::selection` contrast.
- **Contrast sweep:** ~500 token fixes across 29 files (`/70` 6.31:1, placeholder `/65`, `white/60` on dark, `red-600`, `green-700`, `gold-text` on light — dark-section exclusions preserved bright gold).
- **Forms:** labels, `aria-invalid`, `aria-describedby`, `role="alert"`, `autoComplete` (1.3.5), OTP semantics.
- **Widgets:** mobile drawer dialog+trap+focus-return (incl. `transition-[opacity]` visibility fix), mega-menu `aria-expanded`/`aria-controls`, Apply modal trap, PDF placeholder trap, FAQ accordions, grievance tabs (arrow keys), EMI slider labels/thumb ring.
- **Boundaries (1.4.11):** ~60 input/button border + focus fixes; header pill `bg-white/85` for contrast over dark sections.
- **Reflow:** grievance escalation email `break-all` (320 px), advisory layout, team carousel `role="region"`.
- **New:** `/accessibility` statement page (commitment, conformance, measures, compatibility, limitations, feedback) + footer link.

## 5. Known Limitations / Follow-ups

1. **Live screen-reader session** (VoiceOver/NVDA) not recorded — semantics verified by automation only (Gate #4 PARTIAL).
2. **Full-site Hindi localization** not in scope; advisory modal is bilingual (Gate #6 PARTIAL).
3. **3.3.4:** consider a review-and-confirm step before loan-application submission (PARTIAL).
4. **Transactional E2E** (real payment) not run — no backend code changed (Gate #8 PARTIAL).
5. Pre-existing, non-a11y: consent `ConsentGuard` navigates during render (React warning); Vite chunk-size warning.

## 6. Deployment Status

**NOT deployed.** Gate: 6/9 PASS, 3/9 PARTIAL (manual-scope: screen reader, Indian languages, live transactional E2E). Awaiting approval to deploy to Railway, followed by live smoke test on all four domains.
