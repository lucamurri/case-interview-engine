---
id: functional-soda-launch
title: "Fizz With a Job: Launching a Functional Energy Line"
client: "Brightwell Sparkling Co. (fictional), a US sparkling-water brand sold in grocery and convenience stores"
summary: "A sparkling-water brand wants to launch a caffeine-and-vitamins energy line. After slotting fees, launch marketing and sales it takes from its own core cans, how much volume does it need and when does it pay back?"
industry: consumer-retail
sub_industry: "Beverages"
type: product-launch
difficulty: advanced
format: candidate-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  core_volume:   { value: 24,    unit: "million cases", label: "Core line volume per year (today)" }
  core_rev:      { value: 14,    unit: "$",        label: "Core line net revenue per case" }
  core_var:      { value: 8.5,   unit: "$", decimals: 1, label: "Core line variable cost per case (ingredients, packaging, freight)" }
  new_rev:       { value: 22,    unit: "$",        label: "New energy line net revenue per case" }
  new_var:       { value: 13,    unit: "$",        label: "New energy line variable cost per case" }
  cann_share:    { value: 0.30,  unit: "%",             label: "Share of new-line cases bought by customers who would otherwise buy the core line (expected)" }
  cann_high:     { value: 0.50,  unit: "%",             label: "Cannibalization in the downside case" }
  flavors:       { value: 3,     unit: "flavors",       label: "Flavors at launch" }
  stores:        { value: 12000, unit: "stores",        label: "Stores in the launch distribution" }
  slot_fee:      { value: 250,   unit: "$",             label: "Slotting fee per flavor per store (one time)" }
  launch_mkt:    { value: 18,    unit: "$M",            label: "Launch marketing, year 1" }
  line_cost:     { value: 6,     unit: "$M",            label: "Production line changeover and equipment, year 1" }
  ongoing_mkt:   { value: 6,     unit: "$M",            label: "Marketing per year from year 2" }
  rd_spent:      { value: 2,     unit: "$M",            label: "Flavor development already spent" }
  vol_y1:        { value: 3.6,   unit: "million cases", label: "Forecast new-line volume, year 1" }
  vol_y2:        { value: 5.5,   unit: "million cases", label: "Forecast new-line volume, year 2" }
  vol_y3:        { value: 6.5,   unit: "million cases", label: "Forecast new-line volume, year 3" }
  hurdle:        { value: 24,    unit: "months",        label: "Management's maximum payback" }

calculations:
  # --- Unit economics ---
  - { id: core_cm, label: "Core line contribution per case", formula: "core_rev - core_var", expected: 5.5, unit: "$", decimals: 2 }
  - { id: new_cm, label: "New line contribution per case (before cannibalization)", formula: "new_rev - new_var", expected: 9, unit: "$", decimals: 2 }
  - { id: cann_loss, label: "Core contribution lost per new-line case", formula: "cann_share * core_cm", expected: 1.65, unit: "$", decimals: 2 }
  - { id: eff_cm, label: "Net contribution per new-line case", formula: "new_cm - cann_loss", expected: 7.35, unit: "$", decimals: 2 }
  - { id: eff_high, label: "Net contribution per case in the downside case", formula: "new_cm - cann_high * core_cm", expected: 6.25, unit: "$", decimals: 2 }
  # --- Launch costs and break-even ---
  - { id: slotting, label: "Slotting fees", formula: "flavors * stores * slot_fee / 1000000", expected: 9, unit: "$M" }
  - { id: y1_fixed, label: "Total year 1 launch cost", formula: "slotting + launch_mkt + line_cost", expected: 33, unit: "$M" }
  - { id: be_naive, label: "Break-even volume if cannibalization is ignored", formula: "y1_fixed / new_cm", expected: 3.6667, unit: "million cases", decimals: 1 }
  - { id: be_y1, label: "Year 1 break-even volume", formula: "y1_fixed / eff_cm", expected: 4.4898, unit: "million cases", decimals: 1 }
  - { id: be_gap, label: "Shortfall of the year 1 forecast against break-even", formula: "be_y1 - vol_y1", expected: 0.8898, unit: "million cases", decimals: 1 }
  - { id: be_high, label: "Year 1 break-even volume in the downside case", formula: "y1_fixed / eff_high", expected: 5.28, unit: "million cases", decimals: 1 }
  - { id: be_ongoing, label: "Break-even volume from year 2", formula: "ongoing_mkt / eff_cm", expected: 0.8163, unit: "million cases", decimals: 1 }
  # --- Profit by year ---
  - { id: naive_y1, label: "Year 1 profit if cannibalization is ignored", formula: "vol_y1 * new_cm - y1_fixed", expected: -0.6, unit: "$M", decimals: 1 }
  - { id: y1_profit, label: "Year 1 profit", formula: "vol_y1 * eff_cm - y1_fixed", expected: -6.54, unit: "$M", decimals: 1 }
  - { id: y1_loss, label: "Year 1 loss", formula: "0 - y1_profit", expected: 6.54, unit: "$M", decimals: 1 }
  - { id: y2_profit, label: "Year 2 profit", formula: "vol_y2 * eff_cm - ongoing_mkt", expected: 34.425, unit: "$M", decimals: 1 }
  - { id: y3_profit, label: "Year 3 profit", formula: "vol_y3 * eff_cm - ongoing_mkt", expected: 41.775, unit: "$M", decimals: 1 }
  - { id: cum2, label: "Cumulative profit after two years", formula: "y1_profit + y2_profit", expected: 27.885, unit: "$M", decimals: 1 }
  - { id: cum3, label: "Cumulative profit after three years", formula: "cum2 + y3_profit", expected: 69.66, unit: "$M", decimals: 1 }
  - { id: payback_months, label: "Payback in months from launch", formula: "12 + (0 - y1_profit) / (y2_profit / 12)", expected: 14.2797, unit: "months", decimals: 0 }
  - { id: cann_vol, label: "Core cases lost in year 1", formula: "vol_y1 * cann_share", expected: 1.08, unit: "million cases", decimals: 1 }
  - { id: cann_pct, label: "Core volume lost in year 1", formula: "cann_vol / core_volume", expected: 0.045, unit: "%", decimals: 1 }
  # --- Downside ---
  - { id: y1_high, label: "Year 1 profit in the downside case", formula: "vol_y1 * eff_high - y1_fixed", expected: -10.5, unit: "$M", decimals: 1 }
  - { id: y1_loss_high, label: "Year 1 loss in the downside case", formula: "0 - y1_high", expected: 10.5, unit: "$M", decimals: 1 }
  - { id: y2_high, label: "Year 2 profit in the downside case", formula: "vol_y2 * eff_high - ongoing_mkt", expected: 28.375, unit: "$M", decimals: 1 }
  - { id: cum2_high, label: "Cumulative profit after two years in the downside case", formula: "y1_high + y2_high", expected: 17.875, unit: "$M", decimals: 1 }

answer:
  calc: be_y1
  headline: "Year 1 needs {{be_y1}} to break even, not the {{be_naive}} a naive view suggests, because each new case costs {{cann_loss}} of core contribution; the launch loses {{y1_loss}} in year 1 but pays back in about {{payback_months}}."

exhibits:
  - id: exhibit-1
    title: "Unit economics per case"
    kind: table
    ask: "Here is how the two lines compare per case. What do you notice?"
    columns: ["Per case", "Core sparkling water", "New energy line"]
    rows:
      - ["Net revenue", "{{core_rev}}", "{{new_rev}}"]
      - ["Variable cost", "{{core_var}}", "{{new_var}}"]
      - ["**Contribution**", "**{{core_cm}}**", "**{{new_cm}}**"]
    note: "Illustrative data created for this practice case. Brightwell is fictional."
    insight: |
      The new line earns {{new_cm}} a case against {{core_cm}} for the core, which
      makes it look very attractive. But a customer who switches from core to energy
      takes {{core_cm}} of existing profit with them.
  - id: exhibit-2
    title: "Launch costs and assumptions"
    kind: table
    ask: "The team has put together launch costs. What would you include in the break-even?"
    columns: ["Item", "Assumption", "Cost"]
    rows:
      - ["Slotting fees", "{{flavors}} x {{stores}} x {{slot_fee}} each", "{{slotting}}"]
      - ["Launch marketing", "Year 1 only", "{{launch_mkt}}"]
      - ["Line changeover and equipment", "Year 1 only", "{{line_cost}}"]
      - ["Flavor development", "Already spent", "{{rd_spent}}"]
      - ["Marketing from year 2", "Per year", "{{ongoing_mkt}}"]
    note: "Illustrative data created for this practice case. Slotting is a one-time payment to retailers for shelf space."
    insight: |
      Year 1 launch cost is {{y1_fixed}}. Flavor development is sunk and does not belong
      in the decision. From year 2 the fixed cost drops to {{ongoing_mkt}} a year.
  - id: exhibit-3
    title: "Forecast new-line volume (million cases)"
    kind: bar
    unit: "million cases"
    decimals: 1
    ask: "Here is the volume forecast. Does the launch clear break-even?"
    data:
      - { label: "Year 1", value: vol_y1 }
      - { label: "Year 2", value: vol_y2 }
      - { label: "Year 3", value: vol_y3 }
    reference: { value: be_y1, label: "Year 1 break-even volume" }
    note: "Illustrative data created for this practice case."
    insight: |
      The year 1 forecast of {{vol_y1}} is below the {{be_y1}} needed, so year 1
      loses money. Year 2 volume clears the year 1 bar by a wide margin because the
      fixed cost drops.
---

## Prompt

Our client, Brightwell Sparkling Co., sells flavored sparkling water in grocery and convenience stores across the US. The core line sells {{core_volume}} a year. Sales growth is slowing as shoppers move to energy and functional drinks.

Brightwell wants to launch **Lift**, a sparkling energy line with caffeine and B vitamins, in three flavors. The CFO wants a recommendation: **should Brightwell launch, how much volume does it need, and when does it pay back?**

This is a case you lead. Take a moment to structure it, then tell me what you want to look at first.

## Clarifying information

- Q: How is Lift priced and what does it cost to make?
  A: Exhibit 1 gives net revenue and variable cost per case for Lift and the core line. Lift sells at a clear premium.
- Q: Who will buy Lift?
  A: Some buyers are new to Brightwell. Research says about **{{cann_share}}** of Lift cases will be bought by customers who would otherwise buy a case of the core line.
- Q: What does it cost to get on shelves?
  A: Retailers charge a one-time slotting fee per flavor per store. See Exhibit 2.
- Q: What are the launch costs?
  A: Marketing, a production line changeover and slotting. Exhibit 2 has the details.
- Q: What is the volume forecast?
  A: Exhibit 3 shows three years, from a retailer pilot and a comparable launch.
- Q: Has anything been spent already?
  A: Yes, **{{rd_spent}}** on flavor development.
- Q: What payback does management need?
  A: Within **{{hurdle}}**.
- Q: Can the plants make it?
  A: Yes, after the changeover. Capacity is not a limit.

## Structure

> **Ask:** The candidate should set out how they will judge the launch before asking for data.

Three questions: **Is each Lift case worth making? How many do we need? Does the forecast clear it, and how fast?**

- **1. Unit economics**
  - Contribution per Lift case (revenue minus variable cost)
  - Minus contribution lost on core cases that customers swap for Lift (cannibalization)
- **2. Fixed costs**
  - Slotting, launch marketing, line changeover (one time)
  - Ongoing marketing from year 2
  - Sunk costs excluded
- **3. Break-even and payback**
  - Year 1 break-even volume, then year 2 onward
  - Forecast versus break-even, timing of payback against the hurdle
  - Sensitivity to the cannibalization rate
- **4. Market and risks:** shopper demand for functional drinks, competitor reaction, retailer shelf decisions after year 1, regulation of caffeine claims

Hypothesis: *"Lift has a better margin than the core, so I expect it to pay back, but cannibalization and the heavy year 1 costs will push break-even higher than a simple view suggests."*

## Math walkthrough

> **Ask:** The candidate should work out net contribution per case, year 1 break-even, then profit by year.

**1. Contribution per case.**
Core: $14.00 − $8.50 = **{{core_cm}}**. Lift: $22 − $13 = **{{new_cm}}**.

**2. Cannibalization.**
{{cann_share}} of Lift cases replace a core case, each losing {{core_cm}}: {{cann_share}} × {{core_cm}} = **{{cann_loss}}** for each Lift case.
Net contribution = {{new_cm}} − {{cann_loss}} = **{{eff_cm}}** per case.

**3. Year 1 fixed cost.**
Slotting: 3 flavors × 12,000 stores × $250 = **{{slotting}}**. Add {{launch_mkt}} of marketing and {{line_cost}} of changeover: **{{y1_fixed}}**. The {{rd_spent}} already spent is sunk.

**4. Year 1 break-even.**
{{y1_fixed}} ÷ {{eff_cm}} = **{{be_y1}}**. Ignoring cannibalization gives {{y1_fixed}} ÷ {{new_cm}} = {{be_naive}}, which is just above the forecast of {{vol_y1}} and makes the launch look close to break-even. The forecast is {{be_gap}} short of the true bar.

**5. Profit by year.**

| Year | Volume | Calculation | Profit |
|---|---|---|---|
| 1 | {{vol_y1}} | {{vol_y1}} × {{eff_cm}} − {{y1_fixed}} | **{{y1_profit}}** |
| 2 | {{vol_y2}} | {{vol_y2}} × {{eff_cm}} − {{ongoing_mkt}} | **{{y2_profit}}** |
| 3 | {{vol_y3}} | {{vol_y3}} × {{eff_cm}} − {{ongoing_mkt}} | **{{y3_profit}}** |

Cumulative profit is **{{cum2}}** after two years and **{{cum3}}** after three. Year 1 loses {{y1_loss}}, and Lift recovers that in about **{{payback_months}}** from launch, inside the {{hurdle}} hurdle. From year 2 the break-even falls to just {{be_ongoing}}.

**6. Core volume lost.**
Year 1 cannibalization is {{vol_y1}} × {{cann_share}} = {{cann_vol}}, or {{cann_pct}} of core volume.

**7. Downside.**
If cannibalization is {{cann_high}}, net contribution falls to {{eff_high}} a case and year 1 break-even rises to {{be_high}}. Year 1 loses {{y1_loss_high}}, and cumulative profit after two years is still **{{cum2_high}}**.

## Synthesis

> **Ask:** The candidate should give the CFO a recommendation.

**Brightwell should launch Lift. Year 1 loses {{y1_loss}} because the forecast of {{vol_y1}} is below the {{be_y1}} break-even, but the line pays back in about {{payback_months}} and earns {{cum3}} over three years, even after the core cans it takes.**

1. **Cannibalization matters:** every Lift case takes {{cann_loss}} of core contribution, so net contribution is {{eff_cm}} rather than {{new_cm}}, and year 1 break-even rises from {{be_naive}} to {{be_y1}}.
2. **Year 1 is an investment, later years are profit:** most of the {{y1_fixed}} is one time. From year 2, break-even volume is only {{be_ongoing}}.
3. **It survives the downside:** with {{cann_high}} cannibalization, cumulative profit after two years is still {{cum2_high}}.

**Risks and next steps:** the main risk is that the forecast is too high, so ask retailers about reorder terms before paying slotting in every store; consider launching in half of the stores first to cut the up-front fee; test the cannibalization rate with panel data in the first three months; watch for retailers dropping weak flavors after year 1, since slotting is lost if they do; and check caffeine claims with legal before the launch campaign.

## Common mistakes

- Using {{new_cm}} per case without subtracting the core cases the line takes.
- Including the {{rd_spent}} of flavor development in break-even, a sunk cost.
- Treating slotting and launch marketing as annual costs, or ignoring them in year 1.
- Judging the launch on year 1 alone, when {{y1_fixed}} of the cost is one time.
- Forgetting to test what happens if cannibalization is higher than research says.

## What top candidates do differently

- Separate one-time launch cost from ongoing cost before computing break-even.
- State the cannibalization effect as dollars per case, not just a percentage.
- Show break-even for year 1 and for later years, so the CFO sees why a loss in year 1 is not a rejection.
- Give a downside case and suggest ways to limit the up-front exposure, such as a partial rollout.

## Creative question

How could Brightwell reduce cannibalization of its core line when it launches Lift?

## Model answer

Organize ideas by **who is buying and where**:

- **Position Lift for a different occasion:** morning or pre-workout, not the dinner-table drink the core line is, so buyers add a can rather than swap one.
- **Place it differently:** sell it in convenience stores, gyms and campus stores where the core line is weak, not only next to the core line in grocery.
- **Price and pack it differently:** smaller packs and single cans that do not fit a household stock-up.
- **Target new buyers:** advertise to energy-drink buyers, not existing sparkling-water fans.

A top candidate prioritizes: "Occasion and channel give the biggest reduction in cannibalization at the lowest cost. If cannibalization fell from {{cann_share}} to 15%, net contribution would rise toward {{new_cm}} and year 1 break-even would fall."
