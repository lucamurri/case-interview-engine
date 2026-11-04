---
id: bakery-plant-consolidation
title: "Three Ovens Too Many: Consolidating a Bread Maker's Plants"
client: "Hollis & Crane Baking Co. (fictional), a regional US maker of packaged sandwich bread and buns"
summary: "A packaged-bread maker runs three bakeries at about 60% utilization. Can two plants absorb the volume, which one should close, and how fast does it pay back?"
industry: consumer-retail
sub_industry: "Packaged food"
type: operations
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  cap_north:      { value: 150,  unit: "million loaves", label: "North plant capacity per year" }
  vol_north:      { value: 90,   unit: "million loaves", label: "North plant volume per year" }
  cap_central:    { value: 200,  unit: "million loaves", label: "Central plant capacity per year" }
  vol_central:    { value: 130,  unit: "million loaves", label: "Central plant volume per year" }
  cap_south:      { value: 100,  unit: "million loaves", label: "South plant capacity per year" }
  vol_south:      { value: 60,   unit: "million loaves", label: "South plant volume per year" }
  fixed_north:    { value: 24,   unit: "$M", label: "North plant fixed cost per year" }
  fixed_central:  { value: 30,   unit: "$M", label: "Central plant fixed cost per year" }
  fixed_south:    { value: 18,   unit: "$M", label: "South plant fixed cost per year" }
  max_util:       { value: 0.85, unit: "%",  label: "Highest utilization a bakery can run at reliably" }
  freight_north:  { value: 0.12, unit: "$/loaf", decimals: 2, label: "Extra freight per loaf if North's volume is baked elsewhere" }
  freight_south:  { value: 0.10, unit: "$/loaf", decimals: 2, label: "Extra freight per loaf if South's volume is baked elsewhere" }
  extra_shift:    { value: 2,    unit: "$M", label: "Extra shift cost per year at the plants that absorb the volume" }
  closure_cost:   { value: 30,   unit: "$M", label: "One-time closure cost (severance, decommissioning, moving equipment)" }
  sunk_line:      { value: 8,    unit: "$M", label: "Spent last year on a new bun line at South" }
  hurdle:         { value: 4,    unit: "years", label: "CFO's maximum payback for a restructuring project" }

calculations:
  # --- Utilization today ---
  - { id: util_north, label: "North utilization", formula: "vol_north / cap_north", expected: 0.60, unit: "%" }
  - { id: util_central, label: "Central utilization", formula: "vol_central / cap_central", expected: 0.65, unit: "%" }
  - { id: util_south, label: "South utilization", formula: "vol_south / cap_south", expected: 0.60, unit: "%" }
  - { id: total_cap, label: "Total capacity", formula: "cap_north + cap_central + cap_south", expected: 450, unit: "million loaves" }
  - { id: total_vol, label: "Total volume", formula: "vol_north + vol_central + vol_south", expected: 280, unit: "million loaves" }
  - { id: util_total, label: "Network utilization", formula: "total_vol / total_cap", expected: 0.6222, unit: "%", decimals: 0 }
  - { id: total_fixed, label: "Total fixed cost", formula: "fixed_north + fixed_central + fixed_south", expected: 72, unit: "$M" }
  # --- Which plant can close? ---
  - { id: util_wo_north, label: "Utilization of the other two plants if North closes", formula: "total_vol / (cap_central + cap_south)", expected: 0.9333, unit: "%", decimals: 0 }
  - { id: util_wo_central, label: "Utilization of the other two plants if Central closes", formula: "total_vol / (cap_north + cap_south)", expected: 1.12, unit: "%", decimals: 0 }
  - { id: util_wo_south, label: "Utilization of the other two plants if South closes", formula: "total_vol / (cap_north + cap_central)", expected: 0.80, unit: "%" }
  - { id: max_vol_two, label: "Most volume North and Central can bake at the utilization limit", formula: "(cap_north + cap_central) * max_util", expected: 297.5, unit: "million loaves", decimals: 0 }
  # --- Closure economics ---
  - { id: freight_cost_north, label: "Extra freight if North closes", formula: "vol_north * freight_north", expected: 10.8, unit: "$M" }
  - { id: net_north, label: "Annual saving if North closes (on paper)", formula: "fixed_north - freight_cost_north - extra_shift", expected: 11.2, unit: "$M" }
  - { id: freight_cost_south, label: "Extra freight if South closes", formula: "vol_south * freight_south", expected: 6, unit: "$M" }
  - { id: net_south, label: "Annual saving if South closes", formula: "fixed_south - freight_cost_south - extra_shift", expected: 10, unit: "$M" }
  - { id: payback_south, label: "Payback on closing South", formula: "closure_cost / net_south", expected: 3, unit: "years" }
  - { id: five_year, label: "Cumulative net saving after five years", formula: "net_south * 5 - closure_cost", expected: 20, unit: "$M" }
  - { id: headroom, label: "Headroom below the utilization limit after closing South", formula: "max_util - util_wo_south", expected: 0.05, unit: "pts" }
  - { id: fixed_per_loaf_now, label: "Fixed cost per loaf today", formula: "total_fixed / total_vol", expected: 0.2571, unit: "$/loaf", decimals: 2 }
  - { id: fixed_per_loaf_new, label: "Fixed cost per loaf after closing South", formula: "(total_fixed - fixed_south) / total_vol", expected: 0.1929, unit: "$/loaf", decimals: 2 }

answer:
  calc: payback_south
  headline: "Close South, not North: North and Central can bake all {{total_vol}} at {{util_wo_south}} utilization, saving {{net_south}} a year net for a {{closure_cost}} one-time cost: payback in {{payback_south}}."

exhibits:
  - id: exhibit-1
    title: "Hollis & Crane's three bakeries, latest year"
    kind: table
    ask: "Here are the three plants. What do you see?"
    columns: ["Plant", "Capacity (loaves/year)", "Volume (loaves/year)", "Utilization", "Fixed cost/year"]
    rows:
      - ["North", "{{cap_north}}", "{{vol_north}}", "{{util_north}}", "{{fixed_north}}"]
      - ["Central", "{{cap_central}}", "{{vol_central}}", "{{util_central}}", "{{fixed_central}}"]
      - ["South", "{{cap_south}}", "{{vol_south}}", "{{util_south}}", "{{fixed_south}}"]
      - ["Total", "{{total_cap}}", "{{total_vol}}", "{{util_total}}", "{{total_fixed}}"]
    note: "Illustrative data created for this practice case. Hollis & Crane is fictional. Fixed cost covers plant management, maintenance, utilities base load and salaried staff."
    insight: |
      The network runs at {{util_total}}, so it is paying for about a third more
      capacity than it uses. Total spare capacity is larger than any single
      plant's volume, so closing one plant is worth testing.
  - id: exhibit-2
    title: "Closure options prepared by the operations team"
    kind: table
    ask: "The team has costed closing North or South. Which would you close?"
    columns: ["", "Close North", "Close South"]
    rows:
      - ["Fixed cost saved per year", "{{fixed_north}}", "{{fixed_south}}"]
      - ["Extra freight per loaf moved", "{{freight_north}}", "{{freight_south}}"]
      - ["Extra shift cost at receiving plants per year", "{{extra_shift}}", "{{extra_shift}}"]
      - ["One-time closure cost", "{{closure_cost}}", "{{closure_cost}}"]
    note: "Illustrative data created for this practice case. Closing Central was not costed."
    insight: |
      North saves more on paper ({{net_north}} versus {{net_south}} a year), but
      the other two plants would run at {{util_wo_north}}, above the
      {{max_util}} limit. South is the only plant that can close safely.
---

## Prompt

Our client, Hollis & Crane Baking Co., makes packaged sandwich bread and buns sold in grocery stores across the US Southeast. It bakes in three plants (North, Central and South) and delivers fresh to stores every day.

Volumes have been flat for several years as shoppers buy less bread, and all three plants are running well below capacity. The new CFO thinks the company has one bakery too many.

She asks us: **can Hollis & Crane close a plant, which one, and is it worth it?**

## Clarifying information

- Q: How full are the plants?
  A: Exhibit 1 has capacity and volume for each plant. Volume is expected to stay flat.
- Q: How full can a bakery run?
  A: About **{{max_util}}**. Above that, there is no time for cleaning, maintenance and changeovers between products, and service to stores suffers.
- Q: Can bread be shipped further?
  A: Yes, within limits. Bread must reach stores within a day of baking. All three plants are within that distance of each other's stores, but freight costs rise.
- Q: What does it cost to close a plant?
  A: About **{{closure_cost}}** one time for either North or South, covering severance, decommissioning and moving some equipment. For South, that includes moving its new bun line to Central. Exhibit 2 has the details.
- Q: Did the company invest in any plant recently?
  A: Yes, it spent **{{sunk_line}}** last year on a new bun line at South, where buns are most of the volume. The plant manager says closing South would waste that investment.
- Q: What payback does the CFO need?
  A: Restructuring projects must pay back within **{{hurdle}}**.

## Structure

> **Ask:** The candidate should set out what they need to know before picking a plant.

Two questions: **can** a plant close (capacity), and **should** it (economics).

- **1. Capacity: can two plants make all the bread?**
  - Volume and capacity by plant; utilization of the network today
  - For each plant: utilization of the other two if it closed, versus the practical limit
  - Product fit: can the remaining plants make every product (buns, specialty loaves)?
- **2. Economics: is it worth it?**
  - Fixed cost saved
  - Minus extra freight to reach the closed plant's stores
  - Minus extra shift costs at the plants that take the volume
  - One-time closure cost → payback, compared with the CFO's hurdle
- **3. Risks:** store service levels, shelf life, labor relations, the community

A good hypothesis: *"At about 60% utilization, the network has more spare capacity than any one plant produces, so I expect one plant can close. The question is which, because the biggest saving may not be the one the other plants can absorb."*

## Math walkthrough

> **Ask:** The candidate should test which plant can close (Exhibit 1), then compare the savings and payback (Exhibit 2).

**1. Utilization today.**
North 90 ÷ 150 = {{util_north}}, Central 130 ÷ 200 = {{util_central}}, South 60 ÷ 100 = {{util_south}}. The network bakes {{total_vol}} with capacity for 450 million, so it runs at **{{util_total}}**.

**2. Which plant can close?**

| If this plant closes | Capacity left | Utilization of the other two | Feasible at 85%? |
|---|---|---|---|
| North | 200 + 100 | {{util_wo_north}} | No |
| Central | 150 + 100 | {{util_wo_central}} | No: not enough capacity |
| South | 150 + 200 | **{{util_wo_south}}** | **Yes** |

At the 85% limit, North and Central can bake up to 350 × 85% = {{max_vol_two}}, comfortably above {{total_vol}}.

**3. Economics of closing South.**
Extra freight: 60 million loaves × $0.10 = **{{freight_cost_south}}**.
Net saving: $18M − $6M − $2M = **{{net_south}}** a year.
Payback: $30M ÷ $10M = **{{payback_south}}**, inside the CFO's limit of {{hurdle}}. After five years the cumulative saving is 5 × $10M − $30M = **{{five_year}}**.
Fixed cost per loaf falls from about {{fixed_per_loaf_now}} to {{fixed_per_loaf_new}}.

**4. Why not North?**
On paper North saves more: $24M − 90 × $0.12 − $2M = **{{net_north}}** a year. But the remaining plants would run at {{util_wo_north}}, above the 85% limit, so stores would miss deliveries. North is ruled out on capacity before the economics matter.

**5. The bun line.**
The {{sunk_line}} spent at South last year is a sunk cost: it is gone whether South closes or not, so it does not belong in the decision. What matters is whether the line can be moved to Central, and the closure cost already includes that move.

## Synthesis

> **Ask:** The candidate should give the CFO a clear recommendation.

**Hollis & Crane should close South. North and Central can bake all {{total_vol}} at {{util_wo_south}} utilization, and closing South saves {{net_south}} a year after freight and extra shifts, paying back the {{closure_cost}} closure cost in {{payback_south}}.**

1. **The network has a plant too many:** it runs at {{util_total}}, and closing South lifts the remaining plants to {{util_wo_south}}, still under the {{max_util}} limit.
2. **North looks bigger but can't close:** it would save {{net_north}} on paper, but the other two plants would need to run at {{util_wo_north}}.
3. **Ignore the bun line:** the {{sunk_line}} is spent either way; moving the line to Central is already in the closure cost.

**Risks and next steps:** check that North and Central can make every product South makes today (especially buns, which are most of South's volume) and plan to move the new bun line; confirm delivery times to South's stores with test runs before announcing; with only 5 percentage points of headroom below the limit, a big new customer would push utilization up quickly, so keep a co-packer on standby; and plan the closure carefully with employees and the local community.

## Common mistakes

- Closing the plant with the highest fixed cost (North) without checking whether the other plants can absorb its volume.
- Counting the {{sunk_line}} bun line as a reason to keep South open.
- Comparing utilization against 100% instead of the practical limit of about {{max_util}}.
- Forgetting the extra freight and shifts, which take more than a third of South's fixed-cost saving.

## What top candidates do differently

- Ask about the practical utilization limit before doing any math.
- Test all three closures in a single table, so the "can it close?" question is answered before the "is it worth it?" question.
- Call out the sunk cost explicitly and explain why it is irrelevant.
- Raise the product question: total capacity is not enough if the remaining plants can't make every product.

## Creative question

Instead of closing a plant, how else could Hollis & Crane fill its spare baking capacity?

## Model answer

Organize ideas by **who could buy the extra bread**:

- **Retailers:** bake store-brand (private label) bread for grocery chains; regional exclusives such as seasonal or local-flavor loaves.
- **Restaurants and food service:** buns for burger chains, sandwich bread for schools, hospitals and cafeterias, which order steady volumes all year.
- **Other food makers:** co-pack for brands that don't own bakeries; make frozen dough or par-baked bread for in-store bakeries.
- **New products:** higher-margin specialty breads (whole grain, gluten-free, high-protein) that are growing while white bread shrinks.

A top candidate prioritizes: "Private label and food service could fill the plants quickly but at low margins, so I would compare their profit with the {{net_south}} a year from closing South. Filling a plant only beats closing it if the new volume earns more than that."
