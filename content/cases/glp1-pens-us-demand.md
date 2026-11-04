---
id: glp1-pens-us-demand
title: "Weekly Shots: US Demand for GLP-1 Weight-Management Pens"
client: "Quillmark Fill-Finish (fictional), a US contract manufacturer of injectable pens"
summary: "A contract manufacturer is deciding whether to build a new filling line for GLP-1 weight-loss pens. Size annual US pen demand, then compare it with the industry's capacity."
industry: pharma-healthcare
sub_industry: "Contract manufacturing / obesity drugs"
type: market-sizing
difficulty: intermediate
format: interviewer-led
time_minutes: 25

# All numbers are illustrative — realistic in shape, not real epidemiology,
# prescription or capacity data.
inputs:
  adults_m:        { value: 250,  unit: "million",      label: "US adults" }
  eligible_share:  { value: 0.48, unit: "%",            label: "Adults who meet the label criteria for a weight-management GLP-1" }
  treated_share:   { value: 0.10, unit: "%",            label: "Eligible adults on a GLP-1 for weight management today" }
  pen_share:       { value: 0.75, unit: "%",            label: "Treated patients using a weekly pen (vs. a daily pill)" }
  persist_share:   { value: 0.50, unit: "%",            label: "Pen patients who stay on therapy all year" }
  weeks_year:      { value: 52,   unit: "weeks",        label: "Weeks in a year (one pen per week)" }
  stop_weeks:      { value: 12,   unit: "weeks",        label: "Average weeks on therapy for patients who stop during the year" }
  own_cap_m:       { value: 160,  unit: "million pens", label: "Capacity at brand owners' own plants" }
  large_cap_m:     { value: 60,   unit: "million pens", label: "Capacity at large contract fillers" }
  small_cap_m:     { value: 20,   unit: "million pens", label: "Capacity at smaller contract fillers" }
  line_cap_m:      { value: 40,   unit: "million pens", label: "Annual capacity of one new Quillmark filling line" }
  fill_fee:        { value: 1.5,  unit: "$/pen",        label: "Fee Quillmark earns per pen filled", decimals: 2 }
  future_treated:  { value: 0.15, unit: "%",            label: "Treated share of eligible adults in three years (client forecast)" }

calculations:
  - { id: capacity_m, label: "Installed US filling capacity for GLP-1 pens", formula: "own_cap_m + large_cap_m + small_cap_m", expected: 240, unit: "million pens" }
  - { id: eligible_m, label: "Eligible adults", formula: "adults_m * eligible_share", expected: 120, unit: "million" }
  - { id: treated_m, label: "Adults on a weight-management GLP-1", formula: "eligible_m * treated_share", expected: 12, unit: "million" }
  - { id: pen_patients_m, label: "Patients on a weekly pen", formula: "treated_m * pen_share", expected: 9, unit: "million" }
  - { id: pens_per_patient, label: "Average pens per pen patient per year", formula: "persist_share * weeks_year + (1 - persist_share) * stop_weeks", expected: 32, unit: "pens/year" }
  - { id: pen_demand_m, label: "Annual US pen demand", formula: "pen_patients_m * pens_per_patient", expected: 288, unit: "million pens" }
  - { id: naive_demand_m, label: "Pen demand if every patient used 52 pens (the wrong way)", formula: "pen_patients_m * weeks_year", expected: 468, unit: "million pens" }
  - { id: naive_over_m, label: "Overstatement from ignoring patients who stop", formula: "naive_demand_m - pen_demand_m", expected: 180, unit: "million pens" }
  - { id: supply_gap_m, label: "Demand not covered by installed capacity", formula: "pen_demand_m - capacity_m", expected: 48, unit: "million pens" }
  - { id: lines_supported, label: "New lines the gap could fill", formula: "supply_gap_m / line_cap_m", expected: 1.2, unit: "lines", decimals: 1 }
  - { id: line_rev, label: "Annual revenue from one fully used line", formula: "line_cap_m * fill_fee", expected: 60, unit: "$M" }
  - { id: future_treated_m, label: "Treated adults in three years", formula: "eligible_m * future_treated", expected: 18, unit: "million" }
  - { id: future_pen_patients_m, label: "Pen patients in three years", formula: "future_treated_m * pen_share", expected: 13.5, unit: "million" }
  - { id: future_demand_m, label: "Pen demand in three years at the forecast treatment rate", formula: "future_pen_patients_m * pens_per_patient", expected: 432, unit: "million pens" }
  - { id: future_gap_m, label: "Gap vs. today's capacity in three years", formula: "future_demand_m - capacity_m", expected: 192, unit: "million pens" }

answer:
  calc: pen_demand_m
  headline: "About {{pen_demand_m}} a year, leaving a gap of roughly {{supply_gap_m}} over installed capacity — enough for one new line, not two."

exhibits:
  - id: exhibit-1
    title: "Patient funnel for weight-management GLP-1s in the US"
    kind: table
    ask: "Here is the client's patient funnel. Use it to estimate how many pens are needed each year."
    columns: ["Step", "Value"]
    rows:
      - ["US adults", "{{adults_m}}"]
      - ["Meet the label criteria (obesity, or overweight with a related condition)", "{{eligible_share}}"]
      - ["Of eligible adults, on a weight-management GLP-1 today", "{{treated_share}}"]
      - ["Of treated patients, using a weekly pen (rest take a daily pill)", "{{pen_share}}"]
      - ["Of pen patients, stay on therapy all year", "{{persist_share}}"]
      - ["Patients who stop: average time on therapy", "{{stop_weeks}}"]
    note: "Illustrative data created for this practice case; not real epidemiology or prescription data."
    insight: |
      The funnel narrows fast: from {{adults_m}} adults to {{pen_patients_m}}
      pen patients. The trap is the last two rows — half of patients stop, so the
      average patient uses {{pens_per_patient}}, not 52.
  - id: exhibit-2
    title: "Installed US filling capacity for GLP-1 pens, by supplier group"
    kind: bar
    unit: "million pens"
    decimals: 0
    ask: "This shows who can fill these pens today. What does it mean for Quillmark's new line?"
    data:
      - { label: "Brand owners' own plants", value: own_cap_m }
      - { label: "Large contract fillers", value: large_cap_m }
      - { label: "Smaller contract fillers", value: small_cap_m }
    note: "Illustrative data created for this practice case; not real capacity figures."
    insight: |
      Total capacity is {{capacity_m}}, about {{supply_gap_m}} short of today's
      demand. That gap can absorb one new line of {{line_cap_m}}, but not two.
---

## Prompt

Our client, Quillmark Fill-Finish, is a US contract manufacturer. Drug companies hire it to fill their medicines into prefilled injection devices. Demand for GLP-1 drugs for weight management — once-weekly injections that reduce appetite — has grown so fast that the brand owners have struggled to make enough pens.

Quillmark is considering building a **new dedicated filling line for GLP-1 pens**. Before the board approves it, the CEO wants to know: **how many GLP-1 weight-management pens does the US need each year, and is there room for a new line?**

## Clarifying information

- Q: What exactly is a "pen"?
  A: A single-use, prefilled autoinjector holding one weekly dose. One patient uses one pen per week while on therapy.
- Q: Are we sizing GLP-1s for diabetes too?
  A: No — weight management only. Diabetes pens run on separate lines and contracts.
- Q: Are all patients on pens?
  A: No. Some take a newer daily pill version. The client's data is in the patient funnel, shared as an exhibit.
- Q: Do patients stay on therapy?
  A: Many don't. Side effects, cost and insurance changes lead a large share to stop within a few months.
- Q: What capacity does one new line add?
  A: About **{{line_cap_m}}** a year once ramped up. Quillmark earns a filling fee of about **{{fill_fee}}**.
- Q: Are we sizing today or the future?
  A: Today first. The client also has a three-year forecast for the treated share, if you want to stress-test the decision.

## Structure

> **Ask:** How would you estimate annual pen demand?

A **patient-based (demand-side) funnel**, because pens are consumed one per patient per week:

- **Pen patients**
  - US adults
  - × share who are eligible (meet the label criteria)
  - × share of eligible adults actually treated
  - × share of treated patients on a pen rather than a pill
- **Pens per patient per year**
  - Patients who stay on all year: 52 pens
  - Patients who stop: weeks on therapy before stopping
  - Weighted by the share in each group
- **Annual pen demand = pen patients × pens per patient**

Then **compare demand with supply**: installed filling capacity, the gap, and how many new lines the gap supports — both today and in three years.

Strong candidates say up front that **persistence** (how long patients stay on therapy) is likely the swing factor, because a weekly product multiplies any error by up to 52.

## Math walkthrough

> **Ask:** Using Exhibit 1, how many pens does the US need a year? Then, using Exhibit 2, is there room for Quillmark's line? Finally, what happens if the treated share rises to {{future_treated}}?

**1. Pen patients.**
Eligible adults = {{adults_m}} × {{eligible_share}} = **{{eligible_m}}**.
Treated = {{eligible_m}} × {{treated_share}} = **{{treated_m}}**.
On a pen = {{treated_m}} × {{pen_share}} = **{{pen_patients_m}}**.

**2. Pens per patient.**
Half stay all year (52 pens) and half stop after about 12 weeks:
(50% × 52) + (50% × 12) = 26 + 6 = **{{pens_per_patient}}**.

**3. Annual demand.**
{{pen_patients_m}} × 32 pens = **{{pen_demand_m}}** a year.

**4. Room for a new line? (Exhibit 2)**
Installed capacity = 160 + 60 + 20 = **{{capacity_m}}**.
Gap = {{pen_demand_m}} − {{capacity_m}} = **{{supply_gap_m}}**.
Lines the gap could fill = 48 ÷ 40 = **{{lines_supported}}** — one line can run full; a second would not.
A full line earns 40m × $1.50 = **{{line_rev}}** a year in fees.

**5. Three-year stress test.**
If the treated share rises to {{future_treated}}: 120m × 15% × 75% × 32 = **{{future_demand_m}}**, a gap of **{{future_gap_m}}** against today's capacity. Some of that will be filled by brand owners' own expansions, but it suggests the line is unlikely to sit idle.

*Mental-math tip:* break it into steps — {{future_treated_m}} treated × 75% = {{future_pen_patients_m}} pen patients, then 13.5m × 32 = {{future_demand_m}}.

## Synthesis

> **Ask:** The CEO asks for your bottom line. What do you say?

**The US needs about {{pen_demand_m}} a year for GLP-1 weight management, roughly {{supply_gap_m}} more than installed capacity, so Quillmark should build one new line now and hold off on a second.**

- Demand comes from about {{pen_patients_m}} pen patients using an average of {{pens_per_patient}} — half of patients stop within a few months.
- The gap of {{supply_gap_m}} supports {{lines_supported}}: one line runs full and earns about {{line_rev}} a year in fees.
- Growth gives a cushion: at a treated share of {{future_treated}}, demand reaches ~{{future_demand_m}}.

**Risks / next steps:** brand owners are expanding their own plants, which could close the gap; a shift to daily pills would cut pen demand; persistence could improve (more pens) or worsen. Next, secure a multi-year supply contract with a brand owner before committing capital, and get each brand owner's expansion plans.

## Common mistakes

- Assuming every patient uses 52 pens a year. That gives {{naive_demand_m}}, overstating demand by {{naive_over_m}} and making two or three lines look justified.
- Forgetting the pill share and counting all {{treated_m}} treated patients as pen users.
- Applying the treated share to all adults instead of to eligible adults.
- Stopping at a demand number without comparing it with capacity — the client's decision is about the **gap**, not the market.

## What top candidates do differently

- Name persistence as the key driver before seeing the data, and ask for it.
- Turn the gap into a number of lines ({{lines_supported}}), which answers the board's question directly.
- Separate today's gap from the future gap, and note that competitors' capacity will grow too.
- Suggest de-risking the investment with a take-or-pay contract (the customer pays for agreed volume whether or not it uses it).

## Creative question

Suppose Quillmark builds the line and, two years later, daily GLP-1 pills take a much larger share than expected. How could Quillmark protect the investment?

## Model answer

A strong answer looks at the contract, the asset and the portfolio:

- **Contract:** sign take-or-pay volumes or minimum fees with the brand owner up front, so a shift to pills is the customer's risk, not Quillmark's.
- **Flexible asset:** design the line so it can fill other weekly injectables (diabetes GLP-1s, newer obesity drugs, other biologics) with a short changeover.
- **Portfolio:** serve several brand owners rather than one, and offer related services (device assembly, packaging, cold-chain logistics).
- **Watch the signals:** track pill approvals, insurance coverage and patient persistence each quarter, and stage any second-line decision on them.

Top candidates prioritize the contract: "The cheapest protection is to make sure the customer shares the demand risk before we pour concrete."
