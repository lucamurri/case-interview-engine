---
id: pickleball-courts-us
title: "Dink and Drive: Sizing US Spending on New Pickleball Courts"
client: "Baseline Court Works (fictional), a US builder of tennis and basketball courts"
summary: "A sports-court builder wonders whether the pickleball boom is worth chasing. Size annual US spending on new pickleball courts, working from players to courts needed to new builds per year."
industry: other
sub_industry: "Sports & leisure"
type: market-sizing
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real participation or construction data.
inputs:
  players:            { value: 20,     unit: "million",     label: "Americans who played pickleball at least once last year" }
  regular_share:      { value: 0.25,   unit: "%",           label: "Share who play regularly (at least once a week)" }
  sessions_week:      { value: 2,      unit: "sessions",    label: "Sessions per week for a regular player" }
  hours_session:      { value: 2,      unit: "hours",       label: "Length of a session" }
  players_per_court:  { value: 4,      unit: "players",     label: "Players on a court at once (doubles)" }
  court_hours_week:   { value: 40,     unit: "hours",       label: "Hours per week a court is in demand (evenings, weekends, mornings)" }
  existing_courts:    { value: 75000,  unit: "courts",      label: "Pickleball courts in the US today (dedicated and shared)" }
  years_to_close:     { value: 5,      unit: "years",       label: "Years over which the shortage is expected to be closed" }
  cost_per_court:     { value: 50000,  unit: "$",           label: "Average cost to build one new outdoor court" }

calculations:
  - { id: regulars, label: "Regular players", formula: "players * regular_share", expected: 5, unit: "million" }
  - { id: player_hours, label: "Player-hours of court time wanted per week", formula: "regulars * sessions_week * hours_session", expected: 20, unit: "million" }
  - { id: court_hours, label: "Court-hours needed per week", formula: "player_hours / players_per_court", expected: 5, unit: "million" }
  - { id: courts_needed, label: "Courts needed", formula: "court_hours * 1000000 / court_hours_week", expected: 125000, unit: "courts" }
  - { id: regulars_per_court, label: "Regular players per court needed", formula: "regulars * 1000000 / courts_needed", expected: 40, unit: "regular players" }
  - { id: shortfall, label: "Shortage of courts", formula: "courts_needed - existing_courts", expected: 50000, unit: "courts" }
  - { id: new_courts, label: "New courts built per year", formula: "shortfall / years_to_close", expected: 10000, unit: "courts" }
  - { id: spend, label: "Annual US spending on new pickleball courts", formula: "new_courts * cost_per_court / 1000000", expected: 500, unit: "$M" }
  - { id: naive_spend, label: "Spending if every court needed were treated as a new build (the wrong way)", formula: "courts_needed * cost_per_court / 1000000000", expected: 6.25, unit: "$B", decimals: 2 }

answer:
  calc: spend
  headline: "About {{spend}} a year: the US needs about {{courts_needed}} for its regular players, has {{existing_courts}}, and closing the gap means building about {{new_courts}} a year."

exhibits:
  - id: exhibit-1
    title: "Pickleball players in the US"
    kind: table
    ask: "Here is what the client knows about players. How many courts does the US need?"
    columns: ["Measure", "Value"]
    rows:
      - ["Played at least once last year", "{{players}}"]
      - ["Share who play regularly (weekly or more)", "{{regular_share}}"]
      - ["Sessions per week, regular players", "{{sessions_week}}"]
      - ["Length of a session", "{{hours_session}}"]
      - ["Players per court (doubles)", "{{players_per_court}}"]
    note: "Illustrative data created for this practice case; not actual participation statistics."
    insight: |
      Occasional players barely use courts. Demand for courts comes from the
      {{regulars}} regular players, and they want {{court_hours}} court-hours a week.
  - id: exhibit-2
    title: "Courts today and the cost of building new ones"
    kind: table
    ask: "Here is data on existing courts and construction. How much is spent on new courts each year?"
    columns: ["Measure", "Value"]
    rows:
      - ["Hours per week a court is in demand", "{{court_hours_week}}"]
      - ["Courts in the US today (dedicated and shared with tennis)", "{{existing_courts}}"]
      - ["Years cities and clubs expect to take to close the shortage", "{{years_to_close}}"]
      - ["Cost to build one new outdoor court (surface, fencing, nets, lights)", "{{cost_per_court}}"]
    note: "Illustrative data created for this practice case; not actual industry figures."
    insight: |
      The US is about {{shortfall}} short. Spread over {{years_to_close}},
      that is {{new_courts}} to build and about {{spend}} of construction a year.
---

## Prompt

Our client, Baseline Court Works, builds tennis and basketball courts for cities, schools and private clubs across the US. Pickleball, a paddle sport played on a court about a third the size of a tennis court, has become hugely popular, and local governments say they get constant complaints about long waits for courts.

Baseline's CEO is thinking about setting up a team focused on pickleball courts and asks us: **how much is spent each year in the US on building new pickleball courts?**

## Clarifying information

- Q: What exactly are we sizing?
  A: Annual spending on **building new** pickleball courts in the US: public parks, schools, clubs and private developments. Resurfacing and repairs are out of scope.
- Q: Do we count indoor courts?
  A: Treat all courts as outdoor courts at the average cost in the data. Indoor facilities are a separate business.
- Q: Are courts shared with tennis counted as existing courts?
  A: Yes. Painting pickleball lines on a tennis court is common, and the client's data includes these.
- Q: Why not build all the missing courts in one year?
  A: City and club budgets are planned years ahead, so the shortage is expected to close over about **{{years_to_close}}**.

## Structure

> **Ask:** How would you approach this?

Work from **demand for court time** to **courts needed**, compare with **courts that exist**, and turn the gap into **construction spending**:

- **Demand for court time**
  - Players × share who play regularly = regular players
  - × sessions per week × hours per session = player-hours per week
  - ÷ players per court = court-hours needed per week
- **Courts needed**
  - Court-hours ÷ hours a court is in demand per week
- **New builds per year**
  - (Courts needed − courts today) ÷ years to close the gap
- **Spending**
  - New courts per year × cost per court

Top candidates explain why they use **regular players**: someone who played twice last year doesn't create a need for a court.

## Math walkthrough

> **Ask:** Using Exhibits 1 and 2, how much is spent each year on new pickleball courts?

**1. Regular players.**
20 million × 25% = **{{regulars}}**.

**2. Court time wanted.**
Player-hours = 5 million × 2 sessions × 2 hours = **{{player_hours}}** per week.
Court-hours = 20 million ÷ 4 players = **{{court_hours}}** per week.

**3. Courts needed.**
5 million ÷ 40 hours = **{{courts_needed}}**. Sanity check: that is about {{regulars_per_court}} per court, which sounds reasonable for a busy local park.

**4. New courts per year.**
Shortage = 125,000 − 75,000 = **{{shortfall}}**.
New courts = 50,000 ÷ 5 years = **{{new_courts}}** a year.

**5. Spending.**
10,000 × $50,000 = **{{spend}}** a year.

## Synthesis

> **Ask:** What would you tell Baseline's CEO?

**US spending on new pickleball courts is about {{spend}} a year. The country needs about {{courts_needed}} for its regular players and has {{existing_courts}}, so roughly {{new_courts}} a year must be built to close the gap.**

- **Demand comes from regular players:** {{regulars}} play weekly and need {{court_hours}} court-hours a week.
- **The market is a catch-up market:** most of the spending comes from closing a shortage of {{shortfall}}, so it will shrink once the gap closes unless the number of players keeps growing.
- **Baseline already has the right customers:** cities, schools and clubs are the same buyers it serves for tennis.

**Risks and next steps:** check whether the sport is still growing or leveling off, since that decides whether the market lasts beyond {{years_to_close}}; check what share of new courts are cheap conversions of tennis courts rather than new builds; and look at regional differences, since the shortage is likely worst in warm, fast-growing states.

## Common mistakes

- Using all {{players}} instead of regular players, which makes the number of courts needed four times too high.
- Forgetting that four people share a court in doubles.
- Treating every court needed as a new build, which gives {{naive_spend}}, as if every court were built from scratch in one year, instead of subtracting the {{existing_courts}} that already exist and spreading the gap over several years.
- Stopping at the number of courts and not converting to spending, which is what the CEO asked for.

## What top candidates do differently

- State the approach (players → courts needed → gap → spending) before calculating.
- Sanity-check the result: about {{regulars_per_court}} per court.
- Point out that this is a catch-up market, so the size today may not last.
- Link the answer back to the decision: is it big enough to justify a dedicated team at Baseline?

## Creative question

Besides building new courts, what other businesses could Baseline enter to make money from the pickleball boom?

## Model answer

Organize around **the court, the players and the venue**:

- **The court:** converting tennis courts by adding pickleball lines and nets; resurfacing; noise-reducing fences and walls, since noise complaints are a common problem near homes; lighting so courts can be used in the evening.
- **The players:** court booking systems for cities and clubs; coaching and league programs run with local partners.
- **The venue:** indoor pickleball centers with food and drink; adding courts to apartment complexes, hotels and retirement communities.

A top candidate prioritizes: "Conversions and noise control. They use Baseline's existing skills and customers, are cheaper for cities than new courts, and solve the two complaints cities hear most: waiting times and noise."
