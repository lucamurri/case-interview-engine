# Case Interview Engine — Phase 1 Plan

Status: **draft for Luca's review**. No code has been written yet.

---

## 1. Key technical decisions (in plain language)

| Decision | Choice | Why |
|---|---|---|
| Front end | Plain HTML, CSS and JavaScript. No framework (no React, Vue, etc.). | Fewer moving parts, nothing to keep updated, loads fast on phones, and easy for a non-engineer to read. |
| Static-site generator | **None.** Instead, one small build script (~150 lines of Node.js) that reads the case files and writes the finished site to a `dist/` folder. | A full generator (Jekyll, Eleventy, Hugo) brings its own conventions to learn. We only need one thing: turn case files into pages. A tiny script does that and is easy to follow. |
| Build-time libraries | Two small, widely used open-source packages: `js-yaml` (reads the case metadata) and `marked` (turns Markdown text into HTML). | Writing these ourselves would be error-prone. They are used **only while building**; visitors never download them. |
| What visitors download | Our own HTML, CSS, JS and one `cases.json` file. No third-party scripts, no fonts from Google, no analytics, no cookies. | Free, private, fast, and nothing can break if an outside service changes. |
| Math checking | Each calculation is stored as a formula (e.g. `households * ev_share`). A test script recomputes it and compares it to the answer written in the case. Formulas are evaluated by a small purpose-built calculator that only understands numbers, `+ - * / ( )` and a few helpers like `round()` — it never runs arbitrary code. | Guarantees the math is right, and a typo in a case can't do anything harmful. |
| One source of truth for numbers | Case text refers to numbers by name, e.g. `{{ev_households}}`, instead of typing them out. The build fills them in from the checked formulas. | If an input changes, the walkthrough, exhibits and answer all update together and can't drift out of sync. |
| Hosting | GitHub Pages, deployed by a GitHub Actions workflow on every push to `main`. | Free for public repos; the whole build + test run takes well under a minute, far inside the free tier. |
| Saved progress | Browser `localStorage` (stays on the user's device). Export as JSON (and CSV for spreadsheets); import the JSON back to move devices. | No accounts or database needed. |
| Local requirements | Node.js (already installed on your Mac: v24) and `npm`. | Only needed to build and test; the published site is pure static files. |

---

## 2. Content schema (how a case file looks)

One file per case in `content/cases/`, named after the case, e.g. `content/cases/ev-home-chargers-germany.md`.

Each file has two parts:
- **Front matter** (YAML, between the `---` lines): metadata, inputs, calculations and exhibits — the structured parts the tests check.
- **Body** (Markdown): the prose, split into required sections with fixed headings.

### Example (shortened; numbers are illustrative)

```markdown
---
id: ev-home-chargers-germany
title: "Plugged In: Home EV Chargers in Germany"
client: "Voltara (fictional), a German utility"
industry: energy            # pharma-healthcare | energy | consumer-retail | tech-ai | other
sub_industry: utilities     # free text, shown as a tag
type: market-sizing         # market-sizing | profitability | market-entry | pricing | m-and-a | operations
difficulty: beginner        # beginner | intermediate | advanced
format: candidate-led       # candidate-led | interviewer-led
time_minutes: 20
summary: "Size the annual market for home wall-box chargers in Germany."

# Every number a candidate uses. All illustrative.
inputs:
  households_m:   { value: 41,    unit: "million", label: "Households in Germany" }
  ev_share:       { value: 0.06,  unit: "%",       label: "Share of households with an EV" }
  home_parking:   { value: 0.55,  unit: "%",       label: "Share with private parking" }
  charger_price:  { value: 1200,  unit: "EUR",     label: "Installed price per charger" }

# Each step: a formula over inputs/earlier steps + the answer we expect.
calculations:
  - id: ev_households_m
    label: "Households with an EV"
    formula: "households_m * ev_share"
    expected: 2.46
    format: "{value:1} million"     # how it is displayed in text
  - id: addressable_m
    label: "EV households that can install at home"
    formula: "ev_households_m * home_parking"
    expected: 1.353
    tolerance: 0.001                # allowed relative difference (default 0.5%)

answer:
  calc: addressable_m               # the headline number
  headline: "Roughly €X billion installed base, ~€Y million per year"

exhibits:
  - id: exhibit-1
    title: "EV ownership by household type"
    reveal_at: math                 # which practice step shows it
    kind: table                     # table | bar
    columns: ["Segment", "Households (m)", "EV share"]
    rows:
      - ["All households", "{{households_m}}", "{{ev_share}}"]   # pulled from inputs above
    note: "Illustrative data, not real market figures."
---

## Prompt
(What the interviewer reads aloud.)

## Clarifying information
- **Q:** Do we include public chargers? — **A:** No, home charging only.

## Interviewer questions        <!-- interviewer-led cases only -->
1. How would you structure this?
2. (Show Exhibit 1) What does this tell you?

## Structure
(Issue tree as nested bullets — rendered as a diagram-style tree.)

## Math walkthrough
EV households = 41m × 6% = **{{ev_households_m}}** …

## Synthesis
(Answer-first recommendation, then 2–3 supporting points, risks, next steps.)

## Common mistakes

## What top candidates do differently

## Creative question

## Model answer
```

### What the automated checks enforce

**Math test (`npm run test:math`)** — fails the build if:
- any formula's result differs from `expected` beyond the tolerance;
- a formula uses a name that isn't an input or an earlier step;
- any `{{placeholder}}` in the text or exhibits doesn't resolve;
- the `answer.calc` doesn't exist.

**Content linter (`npm run lint:content`)** — fails the build if:
- a required metadata field is missing or has a value outside the allowed list;
- a required section heading is missing or empty;
- interviewer-led cases lack "Interviewer questions";
- there are 0 or more than 3 exhibits, or an exhibit has no "illustrative" note;
- two cases share an `id`.

Adding a new case = copy a template file, fill it in, run `npm test`. No code changes.

---

## 3. Site structure

### Pages

| Page | URL | What it does |
|---|---|---|
| Case library | `/` | Search box + filters (industry, type, difficulty, format). Case cards show tags, time and "completed / best score" from your saved progress. |
| Case | `/case.html?id=…` | **Practice mode** (default): step-by-step reveal Prompt → Clarifiers → Structure → Exhibits → Math → Synthesis, with a start/pause timer. **Partner mode** toggle: everything visible at once, laid out for the person playing interviewer. Self-score rubric at the end. |
| Mental math drills | `/drills.html` | Randomized percentages, growth rates, break-evens, big-number multiplication; timed rounds with scoring. |
| Frameworks | `/frameworks.html` | Original short guides to profitability, market entry, M&A, pricing and market sizing, each with "how to adapt it" advice. |
| My progress | `/progress.html` | History of attempts and scores, averages per rubric dimension, export (JSON/CSV), import, reset. |
| About | `/about.html` | Short bio, LinkedIn and GitHub links, "Suggest a case" link to a GitHub issue template. |

Pages use normal links with `?id=` (no fancy routing), which works reliably on GitHub Pages.

### Repository layout

```
content/
  cases/                 ← one Markdown file per case (the part you edit)
  frameworks/            ← cheat-sheet text
  _template.md           ← copy this to start a new case
src/
  *.html                 ← page shells
  css/styles.css         ← one stylesheet, light + dark themes
  js/                    ← small modules: library, practice, timer, rubric, storage, drills
scripts/
  build.js               ← content → dist/
  calc.js                ← the safe formula calculator (shared by build + tests)
  test-math.js
  lint-content.js
.github/
  workflows/deploy.yml   ← test, build, deploy on push to main
  ISSUE_TEMPLATE/suggest-a-case.yml
dist/                    ← generated site (not committed)
README.md, LICENSE (MIT), content/LICENSE (CC BY-NC 4.0)
```

### Design direction
- Clean, single-column reading layout (~70 characters per line), generous spacing.
- System fonts (fast, no external downloads), with tabular numbers for math.
- One accent color — proposal: **deep teal `#0F766E`** (passes WCAG AA contrast on white; a lighter tint is used in dark mode).
- Dark mode toggle that also respects the phone's system setting, remembered between visits.
- Mobile-first; large tap targets; sticky "Next step" button and timer on phones.
- Accessibility: WCAG AA contrast, full keyboard navigation with visible focus, labelled buttons, the timer announces start/stop and each minute to screen readers (not every second), charts also shown as data tables.

### Originality and number rules
- All clients are fictional (invented names); no real company is portrayed.
- Every case and exhibit carries an "Illustrative numbers" label.
- Cases are written from scratch around current themes (GLP-1s, biosimilars, AI compute, battery storage) — not adapted from any casebook.

---

## 4. The 30 cases

Totals: **Type** 8 sizing / 7 profitability / 5 entry / 4 pricing / 3 M&A / 3 operations ·
**Industry** 10 pharma & healthcare / 5 energy / 5 consumer & retail / 5 tech & AI / 5 other ·
**Difficulty** 8 beginner / 13 intermediate / 9 advanced · **Format** 15 interviewer-led / 15 candidate-led.

★ = proposed Phase 2 sample case.

### Market sizing (8)
| # | Working title | Industry | Difficulty | Format | Time |
|---|---|---|---|---|---|
| 1 | Weekly Shots: US demand for GLP-1 weight-management pens | Pharma & healthcare | Intermediate | Interviewer-led | 25 |
| 2 | Plugged In: home EV chargers in Germany | Energy | Beginner | Candidate-led | 20 |
| 3 ★ | Copilot Seats: AI coding-assistant licenses among US developers | Tech & AI | Beginner | Interviewer-led | 20 |
| 4 | Always On: continuous glucose monitors for type 2 diabetes in the US | Pharma & healthcare | Intermediate | Candidate-led | 25 |
| 5 | Milk Alternatives: plant-based milk used by US cafés | Consumer & retail | Beginner | Interviewer-led | 20 |
| 6 | Robots on the Line: industrial robot demand in Mexican auto plants | Other (industrials) | Advanced | Candidate-led | 30 |
| 7 | Boiler Swap: residential heat-pump installations in the UK | Energy | Intermediate | Interviewer-led | 25 |
| 8 | Power-Hungry Models: US electricity demand from AI data centers | Tech & AI | Advanced | Candidate-led | 30 |

### Profitability (7)
| # | Working title | Industry | Difficulty | Format | Time |
|---|---|---|---|---|---|
| 9 ★ | Patent Cliff: profit decline of a branded dermatology drug | Pharma & healthcare | Intermediate | Interviewer-led | 30 |
| 10 | Code Red: emergency-department losses at a regional hospital system | Pharma & healthcare | Advanced | Candidate-led | 35 |
| 11 | Sunset Margins: a residential solar installer under pressure | Energy | Intermediate | Candidate-led | 30 |
| 12 | Dinner in a Box: a grocer's meal-kit line | Consumer & retail | Beginner | Interviewer-led | 20 |
| 13 | Inference Bill: a SaaS company's AI features eating its margin | Tech & AI | Advanced | Candidate-led | 35 |
| 14 | After the Sale: an industrial pump maker's service business | Other (industrials) | Intermediate | Interviewer-led | 30 |
| 15 | Level Up, Profit Down: a mobile game studio | Tech & AI | Beginner | Candidate-led | 20 |

### Market entry (5)
| # | Working title | Industry | Difficulty | Format | Time |
|---|---|---|---|---|---|
| 16 | Biosimilar Bet: a generics maker entering the US biologics market | Pharma & healthcare | Advanced | Interviewer-led | 35 |
| 17 ★ | Storing the Sun: a battery-storage developer entering Texas | Energy | Advanced | Candidate-led | 35 |
| 18 | Running Start: a European sportswear brand entering India | Consumer & retail | Intermediate | Candidate-led | 30 |
| 19 | House Calls 2.0: a telehealth platform targeting Medicare Advantage | Pharma & healthcare | Intermediate | Interviewer-led | 30 |
| 20 | Main Street Lending: a regional bank's small-business loan app | Other (financial services) | Beginner | Candidate-led | 20 |

### Pricing (4)
| # | Working title | Industry | Difficulty | Format | Time |
|---|---|---|---|---|---|
| 21 | One and Done: pricing a rare-disease gene therapy | Pharma & healthcare | Advanced | Candidate-led | 35 |
| 22 | Smart Add-On: pricing an AI analytics module for B2B software | Tech & AI | Intermediate | Interviewer-led | 25 |
| 23 | Fare Play: redesigning a mid-sized city's transit fares | Other (public sector) | Intermediate | Candidate-led | 30 |
| 24 | Bowl Subscription: pricing a premium pet-food plan | Consumer & retail | Beginner | Interviewer-led | 20 |

### M&A / investment (3)
| # | Working title | Industry | Difficulty | Format | Time |
|---|---|---|---|---|---|
| 25 | Pipeline Premium: a pharma company acquiring an oncology biotech | Pharma & healthcare | Advanced | Interviewer-led | 35 |
| 26 | Roll-Up Rehab: private equity buying physical-therapy clinics | Pharma & healthcare | Intermediate | Candidate-led | 30 |
| 27 | Pump to Plug: an oil major acquiring an EV-charging network | Energy | Advanced | Interviewer-led | 35 |

### Operations (3)
| # | Working title | Industry | Difficulty | Format | Time |
|---|---|---|---|---|---|
| 28 | Fill-Finish Bottleneck: capacity at a vaccine plant | Pharma & healthcare | Intermediate | Interviewer-led | 30 |
| 29 | Return to Sender: an e-commerce returns warehouse | Consumer & retail | Beginner | Candidate-led | 20 |
| 30 | Claims Backlog: speeding up an insurer's claims processing | Other (financial services) | Intermediate | Interviewer-led | 30 |

### Phase 2 samples (one of each difficulty, both formats, three industries)
- **Easy — #3 Copilot Seats** (market sizing, tech, interviewer-led): tests the basic reveal flow and a simple funnel calculation.
- **Medium — #9 Patent Cliff** (profitability, pharma, interviewer-led): tests exhibits (revenue/cost table + bar chart) and a multi-step profit bridge.
- **Hard — #17 Storing the Sun** (market entry, energy, candidate-led): tests a candidate-led flow, 3 exhibits and a payback/NPV-style calculation.

---

## 4b. Adjustments made while building Phase 2

Small changes to the schema above, found while building the engine. `content/cases/_template.md` is now the authoritative format.

- **"Interviewer questions" section removed.** Instead, Structure, Math walkthrough and Synthesis can begin with `> **Ask:** …`. Practice mode shows that question first and hides the rest until the user reveals it. Interviewer-led cases must have all three Asks (the linter checks).
- **Clarifiers** are written as `- Q: …` / `A: …` pairs, so each answer can be revealed individually.
- **Exhibits** gained `ask` (what the interviewer says when handing it over) and `insight` (the takeaway, revealed on demand). `reveal_at` was dropped: exhibits appear in order in the Exhibits step.
- **Bar charts** take values as numbers or input names, plus an optional `reference` line.
- **Calculations** take `unit` and `decimals` for display; `{{name:2}}` forces 2 decimals in text.

---

## 5. Remaining phases (unchanged from your brief)

2. Engine + 3 sample cases → 3. Remaining 27 cases in ~4 batches of 7, `npm test` after each → 4. Drills, frameworks, partner mode, export → 5. Public repo + Pages + Actions → 6. README, screenshot/GIF, link and accessibility checks, LinkedIn draft.

---

## 6. Decisions I need from you

1. **GitHub account.** The `gh` CLI on this Mac is logged in as **`defking1`**. If the repo goes there, the live URL will be `https://defking1.github.io/case-interview-engine/`. Is that the account you want on your LinkedIn, or should we use a different one?
2. **Accent color.** Deep teal `#0F766E` OK, or would you prefer something else (e.g. a Booth-style maroon)?
3. **Case list.** Any titles to swap, or industries/topics you'd like more of (e.g. medtech, payers, oncology)?
4. **Sample cases.** Happy with #3, #9 and #17 for Phase 2?
