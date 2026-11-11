---
id: packaging-growth-beyond-core
title: "Beyond the Brown Box: Finding Growth for a Corrugated Packaging Maker"
client: "Ridgeline Packaging (fictional), a regional US maker of corrugated shipping boxes"
summary: "A corrugated-box maker's core market has stopped growing. Size three adjacent growth paths, apply capacity and capex limits, and rank them against a profit target."
industry: industrials
sub_industry: "Packaging"
type: growth
difficulty: advanced
format: interviewer-led
time_minutes: 40

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  core_rev:       { value: 600,  unit: "$M",  label: "Core corrugated revenue per year (flat)" }
  core_margin:    { value: 0.08, unit: "%",   label: "Core operating margin" }
  target:         { value: 20,   unit: "$M",  label: "Board target: added operating profit in year 5" }
  capex_budget:   { value: 100,  unit: "$M",  label: "Capital the board will commit over five years" }
  ecom_market:    { value: 400,  unit: "million boxes", label: "Custom e-commerce boxes bought per year in Ridgeline's region" }
  ecom_share:     { value: 0.15, unit: "%",   label: "Share Ridgeline can win by year 5" }
  ecom_price:     { value: 1.80, unit: "$/box", decimals: 2, label: "Average price per custom box" }
  ecom_margin:    { value: 0.12, unit: "%",   label: "Operating margin on custom boxes" }
  ecom_cap:       { value: 50,   unit: "million boxes", label: "Capacity of one digital-print line" }
  ecom_capex:     { value: 40,   unit: "$M",  label: "Capital for the digital-print line" }
  cannib_boxes:   { value: 12,   unit: "million boxes", label: "Custom boxes that existing customers would switch from standard boxes" }
  std_price:      { value: 1.20, unit: "$/box", decimals: 2, label: "Price of the standard box those customers buy today" }
  std_contrib:    { value: 0.25, unit: "%",   label: "Contribution margin on a standard box" }
  fiber_pool:     { value: 1600, unit: "thousand tons", label: "Used cardboard available per year within trucking range" }
  fiber_capture:  { value: 0.25, unit: "%",   label: "Share of that supply Ridgeline can collect" }
  fiber_cap:      { value: 320,  unit: "thousand tons", label: "Capacity of the fiber-processing plant" }
  fiber_spread:   { value: 35,   unit: "$/ton", label: "Operating profit per ton processed" }
  fiber_capex:    { value: 55,   unit: "$M",  label: "Capital for the fiber plant" }
  geo_rev:        { value: 120,  unit: "$M",  label: "Revenue of a new-region plant at maturity" }
  geo_margin:     { value: 0.06, unit: "%",   label: "Operating margin at maturity (new customers, lower prices)" }
  geo_capex:      { value: 90,   unit: "$M",  label: "Capital for a greenfield plant in the new region" }

calculations:
  - { id: core_ebit, label: "Core operating profit today", formula: "core_rev * core_margin", expected: 48, unit: "$M" }
  # --- E-commerce custom packaging ---
  - { id: ecom_demand, label: "Boxes Ridgeline could win", formula: "ecom_market * ecom_share", expected: 60, unit: "million boxes" }
  - { id: ecom_boxes, label: "Boxes Ridgeline can actually make (capacity limit)", formula: "min(ecom_demand, ecom_cap)", expected: 50, unit: "million boxes" }
  - { id: ecom_naive, label: "Profit if demand were the only limit", formula: "ecom_demand * ecom_price * ecom_margin", expected: 12.96, unit: "$M", decimals: 1 }
  - { id: ecom_gross, label: "Profit at the capacity limit", formula: "ecom_boxes * ecom_price * ecom_margin", expected: 10.8, unit: "$M", decimals: 1 }
  - { id: cannib, label: "Contribution lost on standard boxes that customers switch away from", formula: "cannib_boxes * std_price * std_contrib", expected: 3.6, unit: "$M", decimals: 1 }
  - { id: ecom_net, label: "Net added profit from e-commerce packaging", formula: "ecom_gross - cannib", expected: 7.2, unit: "$M", decimals: 1 }
  # --- Fiber recycling ---
  - { id: fiber_supply, label: "Used cardboard Ridgeline can collect", formula: "fiber_pool * fiber_capture", expected: 400, unit: "thousand tons" }
  - { id: fiber_tons, label: "Tons processed (plant limit)", formula: "min(fiber_supply, fiber_cap)", expected: 320, unit: "thousand tons" }
  - { id: fiber_ebit, label: "Added profit from fiber recycling", formula: "fiber_tons * fiber_spread / 1000", expected: 11.2, unit: "$M", decimals: 1 }
  # --- Geographic expansion ---
  - { id: geo_ebit, label: "Added profit from the new region at maturity", formula: "geo_rev * geo_margin", expected: 7.2, unit: "$M", decimals: 1 }
  # --- Ranking ---
  - { id: roi_ecom_naive, label: "Profit per capex dollar: e-commerce, naive", formula: "ecom_naive / ecom_capex", expected: 0.324, unit: "x", decimals: 2 }
  - { id: roi_ecom, label: "Profit per capex dollar: e-commerce, adjusted", formula: "ecom_net / ecom_capex", expected: 0.18, unit: "x", decimals: 2 }
  - { id: roi_fiber, label: "Profit per capex dollar: fiber recycling", formula: "fiber_ebit / fiber_capex", expected: 0.2036, unit: "x", decimals: 2 }
  - { id: roi_geo, label: "Profit per capex dollar: new region", formula: "geo_ebit / geo_capex", expected: 0.08, unit: "x", decimals: 2 }
  - { id: all_capex, label: "Capex for all three paths", formula: "ecom_capex + fiber_capex + geo_capex", expected: 185, unit: "$M" }
  - { id: over_budget, label: "Amount all three paths exceed the budget", formula: "all_capex - capex_budget", expected: 85, unit: "$M" }
  - { id: combo_capex, label: "Capex for e-commerce plus fiber", formula: "ecom_capex + fiber_capex", expected: 95, unit: "$M" }
  - { id: headroom, label: "Capital left in the budget", formula: "capex_budget - combo_capex", expected: 5, unit: "$M" }
  - { id: combo_ebit, label: "Added profit from e-commerce plus fiber", formula: "ecom_net + fiber_ebit", expected: 18.4, unit: "$M", decimals: 1 }
  - { id: gap, label: "Shortfall against the board target", formula: "target - combo_ebit", expected: 1.6, unit: "$M", decimals: 1 }
  - { id: combo_pct, label: "Added profit as a share of today's core profit", formula: "combo_ebit / core_ebit", expected: 0.3833, unit: "%", decimals: 0 }
  - { id: payback, label: "Years of added profit needed to repay the combined capex", formula: "combo_capex / combo_ebit", expected: 5.163, unit: "years", decimals: 1 }

answer:
  calc: combo_ebit
  headline: "Fund e-commerce packaging and fiber recycling: {{combo_capex}} of capex for {{combo_ebit}} of added profit, within the {{capex_budget}} budget and just short of the {{target}} target."

exhibits:
  - id: exhibit-1
    title: "Three growth paths under review"
    kind: table
    ask: "Management has sketched three options. Here is the first cut. How would you read it?"
    columns: ["Path", "Size of the opportunity", "Price or margin", "Capacity of the asset", "Capital needed"]
    rows:
      - ["E-commerce custom packaging", "{{ecom_market}} per year, share of {{ecom_share}}", "{{ecom_price}}, {{ecom_margin}} margin", "{{ecom_cap}} per line", "{{ecom_capex}}"]
      - ["Used-fiber recycling", "{{fiber_pool}} within range, {{fiber_capture}} collectible", "{{fiber_spread}}", "{{fiber_cap}} per plant", "{{fiber_capex}}"]
      - ["New-region plant", "{{geo_rev}} revenue at maturity", "{{geo_margin}} margin", "Sized to the revenue", "{{geo_capex}}"]
    note: "Illustrative data created for this practice case. Ridgeline is fictional. Profit figures are operating profit at maturity, in year 5."
    insight: |
      Each path has two limits, demand and capacity, and the first-cut numbers
      mix them. A strong candidate sizes demand, then checks the asset, then
      divides by capital. The board has {{capex_budget}} in total, so the three
      paths cannot all be funded.
  - id: exhibit-2
    title: "Added operating profit at maturity, before and after adjustments ($M)"
    kind: bar
    unit: "$M"
    decimals: 1
    ask: "Here are the profit figures management expects. What would you change before ranking?"
    data:
      - { label: "E-commerce, management view", value: ecom_naive }
      - { label: "E-commerce, after capacity limit and cannibalization", value: ecom_net }
      - { label: "Fiber recycling", value: fiber_ebit }
      - { label: "New-region plant", value: geo_ebit }
    reference: { value: target, label: "Board target for added profit" }
    note: "Illustrative data created for this practice case. Management's view assumes the line makes every box that customers would buy."
    insight: |
      E-commerce falls from {{ecom_naive}} to {{ecom_net}} once the line limit and
      the lost standard-box business are counted. No single path reaches the
      {{target}} target, so the answer is a combination.
  - id: exhibit-3
    title: "Which standard-box customers would move to custom boxes"
    kind: table
    ask: "Sales says some of the custom-box volume comes from customers we already serve. What does that do to the case?"
    columns: ["Item", "Value"]
    rows:
      - ["Custom boxes won at the line limit", "{{ecom_boxes}}"]
      - ["Of which switched from Ridgeline standard boxes", "{{cannib_boxes}}"]
      - ["Price of the standard box", "{{std_price}}"]
      - ["Contribution margin on a standard box", "{{std_contrib}}"]
      - ["Contribution lost per year", "{{cannib}}"]
    note: "Illustrative data created for this practice case. Contribution margin is price less variable cost."
    insight: |
      The standard-box profit that disappears is {{cannib}}, about a third of the
      custom line's own profit. Fixed costs stay in place, so the right measure
      is lost contribution, not lost operating profit.
---

## Prompt

Our client is Ridgeline Packaging, a regional maker of corrugated shipping boxes with about {{core_rev}} in annual revenue. Its customers are food, furniture and industrial manufacturers. Box volumes have been flat for five years and prices only follow inflation.

The board wants growth beyond the core. It has asked for **{{target}} of added operating profit within five years** and will commit up to **{{capex_budget}}** of capital. Management has proposed three paths: custom packaging for e-commerce brands, a business that collects and processes used cardboard into recycled fiber, and a new plant in a neighboring region.

The CEO asks us: **which of these should Ridgeline pursue, and will they reach the target?**

## Clarifying information

- Q: How profitable is the core business?
  A: Operating margin is **{{core_margin}}** on {{core_rev}} of revenue, or about {{core_ebit}} of operating profit. Volumes and prices are flat.
- Q: Does the target include the core?
  A: No. The {{target}} is added profit from new activities, measured at maturity in year 5.
- Q: Is capital really limited?
  A: Yes. The board will commit **{{capex_budget}}** over five years in total. Debt capacity is limited, and the board does not want to issue equity.
- Q: How big is the custom e-commerce market, and what share is realistic?
  A: About **{{ecom_market}}** a year of custom boxes in Ridgeline's region. Management thinks a **{{ecom_share}}** share is realistic by year 5. Exhibit 1 has price and margin.
- Q: How many boxes can one print line make?
  A: **{{ecom_cap}}** a year. A second line is possible but is not in the {{capex_budget}} plan.
- Q: Do e-commerce brands buy from Ridgeline today?
  A: Some do. Sales estimates that about **{{cannib_boxes}}** of the custom-box volume would replace standard boxes that these customers buy from Ridgeline now. Exhibit 3 has the details.
- Q: How does the fiber business work?
  A: Ridgeline would collect used cardboard from retailers and distributors, bale it, and sell the fiber to paper mills. Exhibit 1 has the supply and margin per ton.
- Q: Why a new region?
  A: Neighboring-region demand is growing and competitors there are weak. A new plant would take years to fill, so management assumes lower prices.

## Structure

> **Ask:** How would you evaluate the three paths?

Treat this as a **portfolio choice under a capital limit**: size each path, test it against its binding constraint, and rank by profit per capital dollar.

- **1. Target and constraints**
  - Added profit needed ({{target}}) versus the {{capex_budget}} budget and the five-year timeline
  - Core stays flat, so growth must come from new activities
- **2. Evaluate each path** (same template for all three)
  - **Size:** market or supply, realistic share
  - **Constraint:** line capacity, plant capacity, ramp-up time
  - **Economics:** margin, cannibalization of existing business, capital needed
  - **Fit:** customers, skills and assets Ridgeline already has
- **3. Rank and combine**
  - Profit per capital dollar, within the {{capex_budget}}
  - Which combination reaches the target?
- **4. Risks:** fiber price swings, brand-customer concentration, execution

A good hypothesis: *"With a limited budget, the best answer is probably a combination of the two paths that fit Ridgeline best, and the greenfield plant will rank last because it needs the most capital and fills slowly."*

## Math walkthrough

> **Ask:** Size each path and tell me which gives the best return on capital. Then: can Ridgeline reach the target?

**1. E-commerce custom packaging.**
Demand: {{ecom_market}} × {{ecom_share}} = **{{ecom_demand}}**. But one line makes only {{ecom_cap}}, so output is **{{ecom_boxes}}**.
Profit on those boxes: 50m × $1.80 × 12% = **{{ecom_gross}}**. Management's view (60m boxes, ignoring the line limit) gives {{ecom_naive}}.
Cannibalization: {{cannib_boxes}} × $1.20 × 25% = **{{cannib}}** of lost standard-box contribution.
Net added profit: {{ecom_gross}} − {{cannib}} = **{{ecom_net}}** on {{ecom_capex}} of capex, or {{roi_ecom}} per dollar (management's view said {{roi_ecom_naive}}).

**2. Fiber recycling.**
Supply: {{fiber_pool}} × {{fiber_capture}} = **{{fiber_supply}}**. The plant handles {{fiber_cap}}, so it runs at its limit of **{{fiber_tons}}**.
Profit: 320,000 tons × $35 = **{{fiber_ebit}}** on {{fiber_capex}}, or **{{roi_fiber}}** per dollar.

**3. New-region plant.**
{{geo_rev}} × {{geo_margin}} = **{{geo_ebit}}** at maturity on {{geo_capex}}, or only **{{roi_geo}}** per dollar, and it takes years to fill.

**4. Rank, then combine.**

| Path | Net profit | Capex | Profit per capex dollar |
|---|---|---|---|
| Fiber recycling | {{fiber_ebit}} | {{fiber_capex}} | {{roi_fiber}} |
| E-commerce packaging | {{ecom_net}} | {{ecom_capex}} | {{roi_ecom}} |
| New-region plant | {{geo_ebit}} | {{geo_capex}} | {{roi_geo}} |

All three would need {{all_capex}}, which is {{over_budget}} over budget. E-commerce plus fiber costs **{{combo_capex}}**, leaving {{headroom}} of the budget, and adds **{{combo_ebit}}**, about {{combo_pct}} of today's core profit. That is **{{gap}}** short of the {{target}} target. The new-region plant cannot be added within the budget.

## Synthesis

> **Ask:** What would you tell the CEO and the board?

**Ridgeline should fund e-commerce custom packaging and fiber recycling. Together they cost {{combo_capex}}, inside the {{capex_budget}} budget, and add about {{combo_ebit}} of profit by year 5. That is {{gap}} short of the target, which the core can close with modest productivity gains.**

1. **Fiber ranks first, e-commerce second:** management's e-commerce view of {{ecom_naive}} falls to {{ecom_net}} once the {{ecom_cap}} line limit and {{cannib}} of cannibalized standard-box contribution are counted.
2. **The new region ranks last:** {{geo_ebit}} on {{geo_capex}} is {{roi_geo}} per dollar, and it would use almost the whole budget.
3. **The target is within reach, not guaranteed:** the combination reaches {{combo_ebit}} versus {{target}}.

**Risks and next steps:** recycled-fiber prices swing with export demand, so test the plant at a low fiber price and look for sales contracts with mills; secure collection contracts before ordering equipment, because supply, not the plant, is the first constraint to prove; pilot the digital line with five or six brands and check how many are existing customers; look at a lease or toll-processing deal for a second print line only if the first fills; and revisit the new region as a partnership or small acquisition, which needs far less capital than a greenfield plant.

## Common mistakes

- Using management's {{ecom_naive}} for e-commerce without checking the {{ecom_cap}} line limit.
- Ignoring cannibalization, or measuring it as lost operating profit rather than lost contribution.
- Ranking by profit alone, so that the new-region plant seems attractive, instead of profit per capital dollar.
- Adding up all three paths without checking the {{capex_budget}} limit.
- Assuming the fiber plant fills automatically: collection supply must be won first.

## What top candidates do differently

- Use one template for all three paths (size, constraint, economics, fit), so the comparison is fair.
- Apply the binding constraint before ranking, and say which one binds for each path.
- State that the target is missed by {{gap}} and propose a way to close it, rather than forcing the answer to fit.
- Think about which path strengthens the core (fiber could also lower Ridgeline's own fiber cost) and which distracts from it.

## Creative question

How else could Ridgeline grow profit from its existing plants and customers without new capital?

## Model answer

Organize ideas by **where the extra profit comes from**:

- **Price and mix:** more value-added products (printed boxes, retail-ready displays, lighter-weight designs sold on cost savings), and discipline on small, unprofitable orders.
- **Cost:** reduce trim waste, use cheaper fiber blends, and run longer production runs to reduce changeovers.
- **New services:** warehousing and kitting for customers, packaging design advice, and sustainability reporting on recycled content.
- **New customers in the same plants:** food-delivery and subscription brands that need standard sizes in smaller lots.

A top candidate prioritizes: "Mix and waste are the fastest levers because they need no capital. A one-point gain in core margin on {{core_rev}} is worth about 6 million, which is about enough to close the {{gap}} gap on its own."
