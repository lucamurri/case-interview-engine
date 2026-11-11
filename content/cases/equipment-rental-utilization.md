---
id: equipment-rental-utilization
title: "Idle Iron: Why a Rental Fleet Earns Less on More Revenue"
client: "Summit Equipment Rental (fictional), a US rental company for construction equipment such as lifts, loaders and compactors"
summary: "Revenue is up but profit has slipped. Break the decline into rate, utilization, maintenance, fleet age and overhead, then test whether retiring the oldest machines would help."
industry: industrials
sub_industry: "Equipment rental"
type: profitability
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  fleet_23:       { value: 4000,  unit: "machines", label: "Fleet size, FY2023" }
  fleet_25:       { value: 4200,  unit: "machines", label: "Fleet size, FY2025" }
  util_23:        { value: 0.72,  unit: "%",   label: "Time utilization, FY2023 (share of days on rent)" }
  util_25:        { value: 0.64,  unit: "%",   label: "Time utilization, FY2025" }
  rate_23:        { value: 210,   unit: "$/day", label: "Average rental rate per day, FY2023" }
  rate_25:        { value: 235,   unit: "$/day", label: "Average rental rate per day, FY2025" }
  dep_unit:       { value: 7000,  unit: "$",   label: "Depreciation per machine per year (both years)" }
  maint_23:       { value: 6500,  unit: "$",   label: "Maintenance and repair per machine per year, FY2023" }
  maint_25:       { value: 8200,  unit: "$",   label: "Maintenance and repair per machine per year, FY2025" }
  var_day:        { value: 22,    unit: "$/day", label: "Delivery, cleaning and fuel cost per day on rent" }
  oh_23:          { value: 95,    unit: "$M",  label: "Branch and overhead cost, FY2023" }
  oh_25:          { value: 103,   unit: "$M",  label: "Branch and overhead cost, FY2025" }
  age_23:         { value: 3.5,   unit: "years", label: "Average fleet age, FY2023" }
  age_25:         { value: 4.8,   unit: "years", label: "Average fleet age, FY2025" }
  retire_units:   { value: 500,   unit: "machines", label: "Oldest machines proposed for sale" }
  old_age:        { value: 9,     unit: "years", label: "Average age of those machines" }
  old_util:       { value: 0.45,  unit: "%",   label: "Utilization of the oldest machines" }
  old_rate:       { value: 200,   unit: "$/day", label: "Average rental rate of the oldest machines" }
  old_maint:      { value: 12000, unit: "$",   label: "Maintenance and repair per oldest machine per year" }
  recapture:      { value: 0.8,   unit: "%",   label: "Share of the oldest machines' rental days the rest of the fleet would capture" }
  sale_price:     { value: 9000,  unit: "$",   label: "Sale price per oldest machine" }
  max_util:       { value: 0.75,  unit: "%",   label: "Highest practical utilization (customers need machines in peak weeks)" }

calculations:
  # --- Revenue ---
  - { id: days_23, label: "Days on rent, FY2023", formula: "fleet_23 * util_23 * 365 / 1000000", expected: 1.0512, unit: "million days", decimals: 2 }
  - { id: days_25, label: "Days on rent, FY2025", formula: "fleet_25 * util_25 * 365 / 1000000", expected: 0.98112, unit: "million days", decimals: 2 }
  - { id: rev_23, label: "Revenue, FY2023", formula: "days_23 * rate_23", expected: 220.752, unit: "$M", decimals: 1 }
  - { id: rev_25, label: "Revenue, FY2025", formula: "days_25 * rate_25", expected: 230.5632, unit: "$M", decimals: 1 }
  - { id: rev_growth, label: "Revenue growth", formula: "rev_25 / rev_23 - 1", expected: 0.04444, unit: "%", decimals: 1 }
  - { id: util_change, label: "Change in utilization", formula: "util_23 - util_25", expected: 0.08, unit: "pts", decimals: 0 }
  # --- Costs and profit ---
  - { id: dep_23, label: "Depreciation, FY2023", formula: "fleet_23 * dep_unit / 1000000", expected: 28, unit: "$M" }
  - { id: dep_25, label: "Depreciation, FY2025", formula: "fleet_25 * dep_unit / 1000000", expected: 29.4, unit: "$M", decimals: 1 }
  - { id: maint_cost_23, label: "Maintenance, FY2023", formula: "fleet_23 * maint_23 / 1000000", expected: 26, unit: "$M" }
  - { id: maint_cost_25, label: "Maintenance, FY2025", formula: "fleet_25 * maint_25 / 1000000", expected: 34.44, unit: "$M", decimals: 1 }
  - { id: var_23, label: "Delivery, cleaning and fuel, FY2023", formula: "days_23 * var_day", expected: 23.1264, unit: "$M", decimals: 1 }
  - { id: var_25, label: "Delivery, cleaning and fuel, FY2025", formula: "days_25 * var_day", expected: 21.58464, unit: "$M", decimals: 1 }
  - { id: cost_23, label: "Total cost, FY2023", formula: "dep_23 + maint_cost_23 + var_23 + oh_23", expected: 172.1264, unit: "$M", decimals: 1 }
  - { id: cost_25, label: "Total cost, FY2025", formula: "dep_25 + maint_cost_25 + var_25 + oh_25", expected: 188.42464, unit: "$M", decimals: 1 }
  - { id: profit_23, label: "Operating profit, FY2023", formula: "rev_23 - cost_23", expected: 48.6256, unit: "$M", decimals: 1 }
  - { id: profit_25, label: "Operating profit, FY2025", formula: "rev_25 - cost_25", expected: 42.13856, unit: "$M", decimals: 1 }
  - { id: profit_drop, label: "Fall in operating profit", formula: "profit_23 - profit_25", expected: 6.48704, unit: "$M", decimals: 1 }
  - { id: profit_drop_pct, label: "Fall in operating profit (%)", formula: "profit_drop / profit_23", expected: 0.1334, unit: "%", decimals: 0 }
  - { id: margin_23, label: "Operating margin, FY2023", formula: "profit_23 / rev_23", expected: 0.2203, unit: "%", decimals: 1 }
  - { id: margin_25, label: "Operating margin, FY2025", formula: "profit_25 / rev_25", expected: 0.1828, unit: "%", decimals: 1 }
  # --- Bridge ---
  - { id: rate_effect, label: "Rate effect (FY2025 days times the rate rise)", formula: "days_25 * (rate_25 - rate_23)", expected: 24.528, unit: "$M", decimals: 1 }
  - { id: volume_effect, label: "Utilization effect (fewer days at the old rate)", formula: "(days_25 - days_23) * rate_23", expected: -14.7168, unit: "$M", decimals: 1 }
  - { id: var_effect, label: "Variable cost effect", formula: "var_23 - var_25", expected: 1.54176, unit: "$M", decimals: 1 }
  - { id: dep_effect, label: "Depreciation effect (bigger fleet)", formula: "dep_23 - dep_25", expected: -1.4, unit: "$M", decimals: 1 }
  - { id: maint_effect, label: "Maintenance effect (older fleet)", formula: "maint_cost_23 - maint_cost_25", expected: -8.44, unit: "$M", decimals: 1 }
  - { id: oh_effect, label: "Overhead effect", formula: "oh_23 - oh_25", expected: -8, unit: "$M" }
  - { id: bridge_total, label: "Bridge total (must equal the profit change)", formula: "rate_effect + volume_effect + var_effect + dep_effect + maint_effect + oh_effect", expected: -6.48704, unit: "$M", decimals: 1 }
  - { id: maint_rise, label: "Rise in maintenance per machine", formula: "maint_25 / maint_23 - 1", expected: 0.2615, unit: "%", decimals: 0 }
  - { id: fixed_25, label: "Costs that do not vary with days on rent, FY2025", formula: "dep_25 + maint_cost_25 + oh_25", expected: 166.84, unit: "$M", decimals: 1 }
  - { id: day_contrib, label: "Contribution per rented day, FY2025", formula: "rate_25 - var_day", expected: 213, unit: "$/day" }
  - { id: breakeven_util, label: "Break-even utilization, FY2025", formula: "(dep_25 + maint_cost_25 + oh_25) / (rate_25 - var_day) / (fleet_25 * 365 / 1000000)", expected: 0.511, unit: "%", decimals: 0 }
  # --- Retiring the oldest machines ---
  - { id: old_days, label: "Days on rent of the oldest machines", formula: "retire_units * old_util * 365 / 1000000", expected: 0.082125, unit: "million days", decimals: 2 }
  - { id: lost_rev, label: "Revenue of the oldest machines", formula: "old_days * old_rate", expected: 16.425, unit: "$M", decimals: 1 }
  - { id: recap_days, label: "Days the rest of the fleet captures", formula: "old_days * recapture", expected: 0.0657, unit: "million days", decimals: 2 }
  - { id: recap_rev, label: "Revenue recaptured by the rest of the fleet", formula: "recap_days * rate_25", expected: 15.4395, unit: "$M", decimals: 1 }
  - { id: net_rev, label: "Net revenue change", formula: "recap_rev - lost_rev", expected: -0.9855, unit: "$M", decimals: 1 }
  - { id: var_saved, label: "Delivery, cleaning and fuel saved on days not rented", formula: "(old_days - recap_days) * var_day", expected: 0.36135, unit: "$M", decimals: 1 }
  - { id: maint_saved, label: "Maintenance saved", formula: "retire_units * old_maint / 1000000", expected: 6, unit: "$M", decimals: 1 }
  - { id: profit_gain, label: "Annual profit gain from retiring the oldest machines", formula: "net_rev + var_saved + maint_saved", expected: 5.37585, unit: "$M", decimals: 1 }
  - { id: proceeds, label: "One-time sale proceeds", formula: "retire_units * sale_price / 1000000", expected: 4.5, unit: "$M", decimals: 1 }
  - { id: no_recap, label: "Annual profit change if no rental days are recaptured", formula: "old_days * (var_day - old_rate) + maint_saved", expected: -8.61825, unit: "$M", decimals: 1 }
  - { id: min_recapture, label: "Recapture needed to break even", formula: "(old_days * (old_rate - var_day) - maint_saved) / (old_days * (rate_25 - var_day))", expected: 0.4927, unit: "%", decimals: 0 }
  - { id: new_util, label: "Fleet utilization after the sale", formula: "(days_25 - (old_days - recap_days)) * 1000000 / ((fleet_25 - retire_units) * 365)", expected: 0.7143, unit: "%", decimals: 0 }
  - { id: util_room, label: "Room left below the practical limit", formula: "max_util - new_util", expected: 0.0357, unit: "pts", decimals: 0 }
  - { id: new_profit, label: "Operating profit after the sale", formula: "profit_25 + profit_gain", expected: 47.51441, unit: "$M", decimals: 1 }

answer:
  calc: profit_drop
  headline: "Profit fell {{profit_drop}} ({{profit_drop_pct}}) even though revenue rose {{rev_growth}}: utilization fell {{util_change}} on a bigger, older fleet, and maintenance and overhead rose. Selling the oldest machines adds about {{profit_gain}} a year only if customers shift to the rest of the fleet."

exhibits:
  - id: exhibit-1
    title: "Summit's fleet and financials"
    kind: table
    ask: "Here are Summit's key numbers. Why has profit slipped when revenue is up?"
    columns: ["Measure", "FY2023", "FY2025"]
    rows:
      - ["Fleet size", "{{fleet_23}}", "{{fleet_25}}"]
      - ["Time utilization", "{{util_23}}", "{{util_25}}"]
      - ["Average rental rate per day", "{{rate_23}}", "{{rate_25}}"]
      - ["Average fleet age", "{{age_23}}", "{{age_25}}"]
      - ["Revenue", "{{rev_23}}", "{{rev_25}}"]
      - ["**Operating profit**", "**{{profit_23}}**", "**{{profit_25}}**"]
    note: "Illustrative data created for this practice case. Summit is fictional. Time utilization is the share of days a machine is on rent."
    insight: |
      Revenue grew {{rev_growth}}, but all of it came from price. Machines
      were rented fewer days, and the fleet is bigger and older. Profit
      fell {{profit_drop}} anyway.
  - id: exhibit-2
    title: "Cost lines, FY2023 and FY2025 ($M)"
    kind: table
    ask: "Here is the cost side. Which lines moved, and why?"
    columns: ["Cost line", "FY2023", "FY2025", "What it depends on"]
    rows:
      - ["Depreciation", "{{dep_23}}", "{{dep_25}}", "Number of machines"]
      - ["Maintenance and repair", "{{maint_cost_23}}", "{{maint_cost_25}}", "Number and age of machines"]
      - ["Delivery, cleaning and fuel", "{{var_23}}", "{{var_25}}", "Days on rent"]
      - ["Branch and overhead", "{{oh_23}}", "{{oh_25}}", "Branches and staff"]
      - ["**Total cost**", "**{{cost_23}}**", "**{{cost_25}}**", ""]
    note: "Illustrative data created for this practice case. Depreciation per machine is unchanged."
    insight: |
      Costs that follow the size and age of the fleet rose ({{maint_effect}}
      for maintenance, {{dep_effect}} for depreciation), plus {{oh_effect}} of
      overhead. The only cost that fell is the one tied to days on rent, and
      that is a sign of lower activity.
  - id: exhibit-3
    title: "The oldest machines compared with the whole fleet"
    kind: table
    ask: "Management wants to sell the oldest 500 machines. What do you make of these numbers?"
    columns: ["Measure", "Oldest machines", "Whole fleet"]
    rows:
      - ["Machines", "{{retire_units}}", "{{fleet_25}}"]
      - ["Average age", "{{old_age}}", "{{age_25}}"]
      - ["Time utilization", "{{old_util}}", "{{util_25}}"]
      - ["Rate per day", "{{old_rate}}", "{{rate_25}}"]
      - ["Maintenance per machine per year", "{{old_maint}}", "{{maint_25}}"]
      - ["Sale price per machine", "{{sale_price}}", "Not applicable"]
    note: "Illustrative data created for this practice case. The oldest machines are fully depreciated, so selling them does not reduce depreciation."
    insight: |
      The oldest machines have the lowest utilization and the highest
      maintenance, but they still earn rent. Whether selling them helps
      depends on how many of their rental days other machines can take.
---

## Prompt

Our client is Summit Equipment Rental, a US company that rents lifts, loaders, compactors and other construction equipment to contractors from branches across the Southwest. Revenue rose in each of the last two years, but **operating profit has slipped**.

The CEO asks us: **why has profit fallen despite higher revenue, and what should Summit do about it?**

## Clarifying information

- Q: How does Summit make money?
  A: It rents machines by the day, week or month. Revenue is machines × share of days on rent × rate per day. Costs are mostly depreciation, maintenance, delivery and branches.
- Q: What is the time frame?
  A: Compare FY2023 with FY2025. Exhibit 1 has the numbers.
- Q: Did the market change?
  A: Local construction activity is flat. Two competitors expanded fleets, which put pressure on utilization but not on rates.
- Q: Why did the fleet grow?
  A: The fleet grew from {{fleet_23}} to {{fleet_25}}, mostly with used machines bought at auction, and **delayed buying new machines** to save cash.
- Q: Did rates rise broadly?
  A: Summit raised the average rate per day from **{{rate_23}}** to **{{rate_25}}**, largely through a price list change and a shift toward larger machines.
- Q: What is a good level of utilization?
  A: The practical limit is about **{{max_util}}**. Above that, customers cannot find machines in peak weeks and go to competitors.
- Q: Is there any recent investment to know about?
  A: No major one. Depreciation per machine is unchanged.

## Structure

> **Ask:** How would you diagnose the profit decline?

Use the rental equation. In a fleet business, **utilization** is the main driver, and costs depend on how many machines Summit owns and how old they are.

- **Profit = Revenue − Costs**
  - **Revenue = Machines × Utilization × 365 × Rate per day**
    - Fleet size and mix
    - Utilization: demand, competition, downtime from breakdowns
    - Rate: list price, discounts, mix of machine types
  - **Costs**
    - Depreciation: tied to the number of machines
    - Maintenance: tied to number and age of machines
    - Delivery, cleaning, fuel: tied to days on rent
    - Branches and overhead: mostly fixed
- **Then:** which drivers does Summit control, and what could it do about each?

A good hypothesis: *"Revenue is up, so rate must have risen faster than utilization fell. A bigger, older fleet with lower utilization raises costs, so I expect depreciation, maintenance and overhead drove the profit decline."*

## Math walkthrough

> **Ask:** Quantify what drove the decline. Then: management wants to sell the oldest machines. Would that help?

**1. Revenue.**
Days on rent: FY2023 4,000 × 72% × 365 = **{{days_23}}**; FY2025 4,200 × 64% × 365 = **{{days_25}}**.
Revenue: 1.05m × $210 = **{{rev_23}}**; 0.98m × $235 = **{{rev_25}}**, up **{{rev_growth}}**.

**2. Profit.**
Cost was {{cost_23}} in FY2023 and {{cost_25}} in FY2025. Operating profit fell from **{{profit_23}}** to **{{profit_25}}**, a drop of **{{profit_drop}}** ({{profit_drop_pct}}). Margin fell from {{margin_23}} to {{margin_25}}.

**3. Bridge.**

| Driver | Calculation | Impact |
|---|---|---|
| Rate | 0.98m days × $25 | +{{rate_effect}} |
| Utilization (fewer days) | (0.98m − 1.05m) × $210 | {{volume_effect}} |
| Delivery, cleaning, fuel | fewer days on rent | +{{var_effect}} |
| Depreciation | 200 more machines | {{dep_effect}} |
| Maintenance | older fleet, {{maint_rise}} more per machine | {{maint_effect}} |
| Overhead | | {{oh_effect}} |
| **Total** | | **{{bridge_total}}** |

Price did a lot of work: the rate rise added {{rate_effect}}, but the utilization drop took away {{volume_effect}}. Costs tied to fleet size and age added about {{maint_effect}} and {{oh_effect}} and {{dep_effect}}.

**4. How fragile is the profit?**
Fixed costs (depreciation, maintenance, overhead) are {{fixed_25}}. Each rented day contributes $235 − $22 = {{day_contrib}}. Break-even utilization is about **{{breakeven_util}}**, so Summit is only 13 points above it.

**5. Selling the oldest machines.**
The oldest machines rent {{retire_units}} × {{old_util}} × 365 = {{old_days}}, worth **{{lost_rev}}** at $200 a day.
If the rest of the fleet captures {{recapture}} of those days, Summit recaptures **{{recap_rev}}** at today's rate, so net revenue changes by {{net_rev}}.
Savings: maintenance **{{maint_saved}}** plus {{var_saved}} of delivery and cleaning on days no longer rented.
Annual profit gain: {{net_rev}} + {{var_saved}} + {{maint_saved}} = **{{profit_gain}}**, plus **{{proceeds}}** of one-time proceeds. Utilization rises to **{{new_util}}**, still under the {{max_util}} limit.

**6. The trap.**
If customers do not move to other machines, the sale loses money: **{{no_recap}}** a year. The sale breaks even only if the rest of the fleet captures at least **{{min_recapture}}** of the rental days. The oldest machines look poor on utilization and maintenance, but each still earns more than it costs to keep.

## Synthesis

> **Ask:** What would you tell the CEO?

**Profit fell {{profit_drop}} because Summit paid for a bigger, older fleet that rents less often: price rises added {{rate_effect}}, but lower utilization took away {{volume_effect}} and maintenance and overhead added another {{maint_effect}} and {{oh_effect}} of cost. Summit should shrink and renew the fleet, starting with the oldest machines, and fix utilization before pushing price again.**

1. **Utilization is the root cause:** it fell from {{util_23}} to {{util_25}}, and break-even is about {{breakeven_util}}.
2. **Fleet age raises costs:** maintenance per machine is up {{maint_rise}}, and breakdowns also take machines off rent.
3. **Selling the oldest 500 machines adds about {{profit_gain}} a year** and {{proceeds}} of cash, if at least {{min_recapture}} of their rental days shift to other machines.

**Risks and next steps:** test the recapture assumption branch by branch, and sell only machine types where nearby branches have spare units; stay below the {{max_util}} limit so customers can find machines in peak weeks; use sale proceeds to buy newer machines in the highest-demand categories rather than more used ones; raise rates carefully, because competitors have added fleet; and review overhead, which grew {{oh_effect}} while activity fell.

## Common mistakes

- Looking only at revenue growth and missing that it came from price, not volume.
- Treating utilization as a minor detail instead of the main driver of a rental fleet's profit.
- Building a bridge that does not add to the {{profit_drop}} profit change.
- Recommending the sale of the oldest machines because they look poor, without asking whether their customers would shift to other machines.
- Forgetting the practical utilization limit of {{max_util}}, which caps how far the fleet can shrink.

## What top candidates do differently

- Start from the rental equation and say that utilization and rate are the two big drivers.
- Compute break-even utilization to show how little cushion Summit has.
- Turn the sale question into a break-even: "at least {{min_recapture}} of rental days must move".
- Raise the link between fleet age, breakdowns and utilization, instead of treating them as separate problems.

## Creative question

Besides selling machines, how could Summit raise utilization of the fleet it already has?

## Model answer

Group ideas by **where demand can come from**:

- **Contractors:** long-term rental contracts and fleet programs with large builders, so machines are committed in advance.
- **Off-peak demand:** cheaper weekend and winter rates, and machines for landscaping, events and disaster recovery when construction is slow.
- **Inside the network:** a better system to move idle machines between branches, so that a machine idle in one city serves demand in another.
- **Availability:** preventive maintenance so fewer machines sit in the shop, and faster turnaround between rentals.
- **Online:** a booking site with real-time availability, to win small customers who now go to competitors.

A top candidate prioritizes: "Moving idle machines between branches and cutting time in the shop need no capital and raise utilization at once. I would size them against the {{profit_gain}} from selling the oldest machines, because they could be worth more and carry less risk."
