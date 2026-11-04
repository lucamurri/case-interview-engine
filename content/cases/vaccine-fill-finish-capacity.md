---
id: vaccine-fill-finish-capacity
title: "Fill-Finish Bottleneck: Capacity at a Vaccine Plant"
client: "Wendmoor Biologics (fictional), a mid-size vaccine manufacturer"
summary: "A vaccine plant must ship 1 million doses a week but produces only about 800,000. Find the bottleneck, diagnose its equipment effectiveness, and rank the fixes."
industry: pharma-healthcare
sub_industry: "Biopharma manufacturing"
type: operations
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real plant data.
inputs:
  demand:           { value: 1.0,   unit: "million doses/week", label: "Doses required by the supply contract", decimals: 2 }
  weeks:            { value: 50,    unit: "weeks", label: "Contract weeks per year" }
  price:            { value: 8,     unit: "$/dose", label: "Contract price per dose" }
  formulation_cap:  { value: 1.6,   unit: "million doses/week", label: "Formulation capacity", decimals: 2 }
  inspection_cap:   { value: 1.1,   unit: "million doses/week", label: "Visual inspection capacity", decimals: 2 }
  packaging_cap:    { value: 1.4,   unit: "million doses/week", label: "Labeling and packaging capacity", decimals: 2 }
  rated_speed:      { value: 13000, unit: "doses/hour", label: "Filling line rated speed" }
  sched_hours:      { value: 120,   unit: "hours", label: "Filling line scheduled hours per week" }
  changeover_hours: { value: 36,    unit: "hours", label: "Hours per week lost to changeovers and sterile cleaning" }
  stop_hours:       { value: 12,    unit: "hours", label: "Hours per week lost to unplanned stops" }
  actual_speed:     { value: 11700, unit: "doses/hour", label: "Average actual speed while running" }
  quality_yield:    { value: 0.95,  unit: "%", label: "Share of filled doses that pass quality checks" }
  line_cost:        { value: 400,   unit: "$K", label: "Fixed cost of running the filling line per week" }
  changeover_cut:   { value: 18,    unit: "hours", label: "Changeover hours saved per week (campaign scheduling + faster cleaning)" }
  stop_cut:         { value: 6,     unit: "hours", label: "Unplanned-stop hours saved per week (preventive maintenance)" }
  yield_new:        { value: 0.98,  unit: "%", label: "Quality yield after fixing the stopper feeder" }

calculations:
  # --- Find the bottleneck ---
  - { id: theoretical, label: "Filling line output at rated speed for all scheduled hours", formula: "rated_speed * sched_hours / 1e6", expected: 1.56, unit: "million doses/week", decimals: 2 }
  - { id: run_hours, label: "Hours the filling line actually runs per week", formula: "sched_hours - changeover_hours - stop_hours", expected: 72, unit: "hours" }
  - { id: availability, label: "Availability (run time / scheduled time)", formula: "run_hours / sched_hours", expected: 0.60, unit: "%" }
  - { id: performance, label: "Performance (actual speed / rated speed)", formula: "actual_speed / rated_speed", expected: 0.90, unit: "%" }
  - { id: oee, label: "Overall equipment effectiveness (OEE)", formula: "availability * performance * quality_yield", expected: 0.513, unit: "%", decimals: 1 }
  - { id: fill_output, label: "Filling line good output per week", formula: "theoretical * oee", expected: 0.80028, unit: "million doses/week", decimals: 2 }
  - { id: fill_load, label: "Contract demand as a share of filling capacity", formula: "demand / fill_output", expected: 1.2496, unit: "%", decimals: 0 }
  - { id: gap, label: "Weekly shortfall", formula: "demand - fill_output", expected: 0.19972, unit: "million doses/week", decimals: 2 }
  - { id: shortfall_annual, label: "Annual shortfall", formula: "gap * weeks", expected: 9.986, unit: "million doses", decimals: 0 }
  - { id: revenue_at_risk, label: "Contract revenue at risk per year", formula: "shortfall_annual * price", expected: 79.89, unit: "$M", decimals: 0 }
  # --- Value of each fix ---
  - { id: good_per_hour, label: "Good doses per hour of run time", formula: "actual_speed * quality_yield", expected: 11115, unit: "doses/hour" }
  - { id: gain_changeover, label: "Extra output from shorter changeovers", formula: "changeover_cut * good_per_hour / 1e6", expected: 0.20007, unit: "million doses/week", decimals: 2 }
  - { id: output_changeover_only, label: "Filling output with shorter changeovers alone", formula: "fill_output + gain_changeover", expected: 1.00035, unit: "million doses/week", decimals: 2 }
  - { id: gain_stops, label: "Extra output from fewer unplanned stops", formula: "stop_cut * good_per_hour / 1e6", expected: 0.06669, unit: "million doses/week", decimals: 2 }
  - { id: gain_yield, label: "Extra output from higher quality yield", formula: "run_hours * actual_speed * (yield_new - quality_yield) / 1e6", expected: 0.025272, unit: "million doses/week", decimals: 2 }
  # --- All fixes together ---
  - { id: new_run_hours, label: "Run hours per week after the fixes", formula: "run_hours + changeover_cut + stop_cut", expected: 96, unit: "hours" }
  - { id: new_availability, label: "Availability after the fixes", formula: "new_run_hours / sched_hours", expected: 0.80, unit: "%" }
  - { id: new_oee, label: "OEE after all fixes", formula: "new_availability * performance * yield_new", expected: 0.7056, unit: "%", decimals: 1 }
  - { id: new_fill_output, label: "Filling output after all fixes", formula: "theoretical * new_oee", expected: 1.100736, unit: "million doses/week", decimals: 2 }
  - { id: system_output, label: "Plant output after all fixes (slowest step)", formula: "min(formulation_cap, new_fill_output, inspection_cap, packaging_cap)", expected: 1.1, unit: "million doses/week", decimals: 2 }
  - { id: headroom, label: "Buffer above contract demand", formula: "system_output / demand - 1", expected: 0.10, unit: "%" }
  # --- Cost per dose ---
  - { id: cost_now, label: "Filling cost per dose today", formula: "line_cost * 1000 / (fill_output * 1e6)", expected: 0.4998, unit: "$/dose", decimals: 2 }
  - { id: cost_new, label: "Filling cost per dose after the fixes", formula: "line_cost * 1000 / (system_output * 1e6)", expected: 0.3636, unit: "$/dose", decimals: 2 }

answer:
  calc: system_output
  headline: "Filling is the bottleneck at {{fill_output}} with an OEE of only {{oee}}; cutting changeovers alone closes the gap, and three low-capex fixes lift plant output to {{system_output}}."

exhibits:
  - id: exhibit-1
    title: "Effective weekly capacity by process step (million doses per week)"
    kind: bar
    unit: "million doses/week"
    decimals: 2
    ask: "Here is the capacity of each step in the fill-finish process. Where is the problem?"
    data:
      - { label: "1. Formulation", value: formulation_cap }
      - { label: "2. Sterile filling", value: fill_output }
      - { label: "3. Visual inspection", value: inspection_cap }
      - { label: "4. Labeling and packaging", value: packaging_cap }
    reference: { value: demand, label: "Contract demand" }
    note: "Illustrative data created for this practice case. Wendmoor Biologics is fictional."
    insight: |
      Filling is the only step below demand — it is the bottleneck and sets the
      plant's output. Visual inspection is next-tightest, so it will become the
      constraint once filling improves.
  - id: exhibit-2
    title: "Sterile filling line: a typical week, and proposed fixes"
    kind: table
    ask: "Here is how the filling line spends its week, and the engineering team's ideas. How much can each fix add?"
    columns: ["Item", "Today", "Proposed fix"]
    rows:
      - ["Scheduled time", "{{sched_hours}} (5 days × 24 h)", "No change (no weekend staff available)"]
      - ["Changeovers and sterile cleaning", "{{changeover_hours}}", "Campaign scheduling (fewer product switches) and faster cleaning: save {{changeover_cut}}"]
      - ["Unplanned stops", "{{stop_hours}}", "Preventive maintenance on the capper and filling pumps: save {{stop_cut}}"]
      - ["Speed while running", "{{actual_speed}} versus {{rated_speed}} rated", "No change"]
      - ["Doses passing quality checks", "{{quality_yield}}", "Fix the stopper feeder: raise to {{yield_new}}"]
      - ["Second filling line (for reference)", "—", "Large capital project, about two years to build and validate"]
    note: "Illustrative data created for this practice case. Running the filling line costs about {{line_cost}} a week, whatever its output."
    insight: |
      The biggest loss is availability: the line is only running {{availability}}
      of its scheduled time. Speed and quality losses are much smaller.
---

## Prompt

Our client, Wendmoor Biologics, makes vaccines. Its main plant has just started supplying a new respiratory vaccine in prefilled syringes under a government contract that requires **{{demand}}**, for {{weeks}} a year.

Three months in, the plant is shipping only about {{fill_output}}. The government can cancel the contract if Wendmoor keeps missing volumes, and the plant manager has asked for budget for a second filling line.

The COO asks us: **why is the plant short, and what is the fastest way to reach the contract volume?**

## Clarifying information

- Q: What are the steps in the process?
  A: Four "fill-finish" steps after the vaccine itself is made: formulation (mixing the vaccine into its final form), sterile filling into syringes, visual inspection for particles and defects, and labeling and packaging.
- Q: Is the bulk vaccine (the drug substance) a constraint?
  A: No — there is enough bulk vaccine in storage and production for well over the contract volume.
- Q: Does the filling line make only this vaccine?
  A: No. It also fills two older vaccines in small batches, which is why it has frequent product changeovers, each followed by sterile cleaning. Those batches are short, so treat the line's running time as running time for the new vaccine.
- Q: How fast do we need a fix?
  A: The government wants a credible recovery plan within a month and full volumes within six months.
- Q: What does the contract pay?
  A: {{price}}. Missed doses are not paid for.
- Q: Can the plant run on weekends?
  A: Not in the short term — the qualified sterile-operator team is already fully used across five days.

## Structure

> **Ask:** How would you approach this problem?

An operations structure: **find the bottleneck, understand its losses, then size and rank the fixes.**

- **1. Where is the bottleneck?**
  - Capacity of each step (formulation, filling, inspection, packaging) versus demand
  - Upstream supply of bulk vaccine (ruled out)
- **2. Why is the bottleneck slow?** Overall equipment effectiveness (OEE) = availability × performance × quality
  - Availability: time lost to changeovers, cleaning and breakdowns
  - Performance: running slower than rated speed
  - Quality: doses rejected
- **3. What are the fixes, and what is each worth?**
  - Doses per week gained, cost, time to implement, regulatory impact (changes to a validated sterile process may need approval)
  - What becomes the next bottleneck?
- **4. Recommendation and risks**
  - Quick operational fixes versus a second line

A strong candidate says up front: *"Adding capacity anywhere except the bottleneck won't increase output, so I'd like to see capacity by step first."*

## Math walkthrough

> **Ask:** Using Exhibit 1, where is the bottleneck and how big is the gap? Then use Exhibit 2: what is the filling line's OEE, and how much output would each proposed fix add? What would the plant produce with all three?

**1. Bottleneck and gap.**
Filling, at {{fill_output}}, is the only step below demand. Demand is {{fill_load}} of filling capacity.
Gap = 1.0 − 0.80 ≈ {{gap}}, or about **{{shortfall_annual}}** a year — roughly **{{revenue_at_risk}}** of contract revenue at {{price}}.

**2. Filling line OEE.**
- Run time = 120 − 36 − 12 = **{{run_hours}}**, so availability = 72 ÷ 120 = **{{availability}}**.
- Performance = 11,700 ÷ 13,000 = **{{performance}}**.
- Quality = **{{quality_yield}}**.
- OEE = 60% × 90% × 95% = **{{oee}}**.

Check: at rated speed for all 120 hours the line would make {{theoretical}}; × 51.3% ≈ **{{fill_output}}**, matching Exhibit 1.

**3. Value of each fix.**
Good output per hour of run time = 11,700 × 95% = {{good_per_hour}}.
- Shorter changeovers: 18 h × 11,115 ≈ **+{{gain_changeover}}** — on its own this takes filling to {{output_changeover_only}}, just enough to meet demand.
- Fewer unplanned stops: 6 h × 11,115 ≈ **+{{gain_stops}}**.
- Higher yield: 72 h × 11,700 × 3 pts ≈ **+{{gain_yield}}**.

**4. All three together.**
Run time = 72 + 18 + 6 = {{new_run_hours}}, so availability = **{{new_availability}}**.
OEE = 80% × 90% × 98% ≈ **{{new_oee}}**, and filling output = 1.56 × 70.6% ≈ **{{new_fill_output}}**.
That is right at visual inspection's capacity of {{inspection_cap}}, so plant output ≈ **{{system_output}}** — a buffer of **{{headroom}}** above the contract. Inspection is now the bottleneck.

**5. Cost per dose.**
The filling line costs {{line_cost}} a week to run regardless of output: {{cost_now}} today versus **{{cost_new}}** after the fixes.

## Synthesis

> **Ask:** What do you tell the COO?

**Wendmoor can reach the contract volume within months without a second filling line: the filling line is the bottleneck because it only runs {{availability}} of its scheduled time, and cutting changeover time alone lifts output from {{fill_output}} to {{output_changeover_only}}.**

1. **First, cut changeovers (+{{gain_changeover}}):** schedule the two older vaccines in longer campaigns and speed up sterile cleaning. This closes the gap on its own and needs little capital.
2. **Then, preventive maintenance (+{{gain_stops}}) and the stopper-feeder fix (+{{gain_yield}}):** these build a buffer; together the three fixes raise OEE from {{oee}} to {{new_oee}}.
3. **Debottleneck inspection next:** with filling fixed, visual inspection caps the plant at {{system_output}}, a buffer of only {{headroom}}. Add inspection capacity (for example, a semi-automated inspection machine) before the next demand increase.

**Why not the second line now:** it takes about two years, while {{revenue_at_risk}} of revenue a year is at risk today. Revisit it if demand grows. **Risks:** campaign scheduling may delay the older vaccines — check their stock levels and customer commitments; confirm with quality and regulatory teams which changes need re-validation; track OEE weekly so the gains stick. Filling cost per dose also falls from {{cost_now}} to {{cost_new}}.

## Common mistakes

- Supporting the second filling line without first asking why the existing line is so far below its rated output.
- Adding up the capacity of all steps, or averaging them, instead of taking the slowest step.
- Treating OEE losses as additive (40% + 10% + 5%) instead of multiplying the three factors.
- Stopping after fixing filling and missing that inspection becomes the next bottleneck.
- Ignoring the regulatory reality of sterile manufacturing: some process changes need validation before they can be used.

## What top candidates do differently

- Start with capacity by step and say "the bottleneck sets the output of the whole plant" before calculating anything.
- Reconcile the OEE calculation with Exhibit 1 (1.56 × 51.3%) to show the numbers hang together.
- Rank fixes by impact, speed and cost — and show that the cheapest fix is also the biggest.
- Spot the trade-off in campaign scheduling: longer runs of the new vaccine mean the older vaccines wait longer, so inventory of those products must be checked.

## Creative question

Changeovers are the biggest loss on the filling line. Brainstorm ways to cut changeover time on a sterile line.

## Model answer

Group ideas by **fewer changeovers, faster changeovers, and doing work outside the changeover**:

- **Fewer changeovers:** campaign scheduling (one long run of each product instead of many short ones); dedicate the line to the new vaccine and move the older vaccines to a contract manufacturer.
- **Faster changeovers:** single-use product-contact parts (tubing, filling needles) so less needs cleaning; automated clean-in-place and sterilize-in-place systems; standard work instructions and changeover kits prepared in advance.
- **Shift work outside the changeover:** prepare and pre-sterilize parts for the next product while the current run is still going; run line-clearance paperwork in parallel with cleaning rather than after it. (Lean teams call this moving "internal" steps to "external" ones.)

A top candidate prioritizes: "Campaign scheduling first — it needs no capital and no re-validation, only a planning change and a check on the older vaccines' stock."
