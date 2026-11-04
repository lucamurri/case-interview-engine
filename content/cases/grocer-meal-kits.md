---
id: grocer-meal-kits
title: "Dinner in a Box: A Grocer's Meal-Kit Line"
client: "Hollinsworth Grocers (fictional), a 120-store regional supermarket chain"
summary: "A supermarket's in-store meal kits sell well but lose money. Find the leak and decide whether to keep the line."
industry: consumer-retail
sub_industry: "Grocery / fresh prepared food"
type: profitability
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  stores:        { value: 120,  unit: "stores",     label: "Stores selling meal kits" }
  weeks:         { value: 52,   unit: "weeks",      label: "Weeks per year" }
  produced:      { value: 200,  unit: "kits/week",  label: "Kits prepared per store per week" }
  price:         { value: 20,   unit: "$/kit",      label: "Price per kit" }
  ingredients:   { value: 8,    unit: "$/kit",      label: "Ingredient cost per kit" }
  prep:          { value: 4,    unit: "$/kit",      label: "Prep labor and packaging per kit" }
  fixed_week:    { value: 600,  unit: "$/week",     label: "Fixed cost per store per week (cooler display, chef supervision)" }
  day1:          { value: 60,   unit: "kits",       label: "Kits sold on day 1 after prep" }
  day2:          { value: 45,   unit: "kits",       label: "Kits sold on day 2" }
  day3:          { value: 25,   unit: "kits",       label: "Kits sold on day 3" }
  day4:          { value: 10,   unit: "kits",       label: "Kits sold on day 4 (last day before the use-by date)" }
  new_produced:  { value: 150,  unit: "kits/week",  label: "Proposed kits prepared per store per week" }
  new_sold:      { value: 135,  unit: "kits/week",  label: "Expected kits sold with smaller batches" }

calculations:
  - { id: sold, label: "Kits sold per store per week (sum of days 1–4)", formula: "day1 + day2 + day3 + day4", expected: 140, unit: "kits/week" }
  - { id: cost_per_kit, label: "Cost to make one kit", formula: "ingredients + prep", expected: 12, unit: "$/kit" }
  - { id: margin_sold, label: "Margin on a kit that sells", formula: "price - cost_per_kit", expected: 8, unit: "$/kit" }
  - { id: sell_through, label: "Sell-through (share of kits sold)", formula: "sold / produced", expected: 0.70, unit: "%" }
  - { id: wasted, label: "Kits thrown away per store per week", formula: "produced - sold", expected: 60, unit: "kits" }
  - { id: revenue_wk, label: "Revenue per store per week", formula: "sold * price", expected: 2800, unit: "$/week" }
  - { id: cost_wk, label: "Cost of kits made per store per week", formula: "produced * cost_per_kit", expected: 2400, unit: "$/week" }
  - { id: profit_wk, label: "Profit per store per week", formula: "revenue_wk - cost_wk - fixed_week", expected: -200, unit: "$/week" }
  - { id: annual_profit, label: "Annual profit across the chain", formula: "profit_wk * stores * weeks / 1e6", expected: -1.248, unit: "$M", decimals: 2 }
  - { id: annual_loss, label: "Annual loss across the chain", formula: "-annual_profit", expected: 1.248, unit: "$M", decimals: 2 }
  - { id: waste_cost, label: "Cost of thrown-away kits per store per week", formula: "wasted * cost_per_kit", expected: 720, unit: "$/week" }
  - { id: waste_ratio, label: "Sold kits needed to pay for one wasted kit", formula: "cost_per_kit / margin_sold", expected: 1.5, unit: "sold kits", decimals: 1 }
  - { id: profit_no_waste, label: "Profit per store per week if nothing were wasted", formula: "sold * margin_sold - fixed_week", expected: 520, unit: "$/week" }
  - { id: breakeven_sold, label: "Kits a store must sell to break even (making 200)", formula: "(produced * cost_per_kit + fixed_week) / price", expected: 150, unit: "kits/week" }
  - { id: breakeven_st, label: "Break-even sell-through", formula: "breakeven_sold / produced", expected: 0.75, unit: "%" }
  - { id: early_share, label: "Share of sales on days 1–2", formula: "(day1 + day2) / sold", expected: 0.75, unit: "%" }
  - { id: new_revenue, label: "Revenue per store per week, new plan", formula: "new_sold * price", expected: 2700, unit: "$/week" }
  - { id: new_cost, label: "Cost of kits made per store per week, new plan", formula: "new_produced * cost_per_kit", expected: 1800, unit: "$/week" }
  - { id: new_profit_wk, label: "Profit per store per week, new plan", formula: "new_revenue - new_cost - fixed_week", expected: 300, unit: "$/week" }
  - { id: new_st, label: "Sell-through, new plan", formula: "new_sold / new_produced", expected: 0.90, unit: "%" }
  - { id: lost_sales, label: "Kits a week no longer sold under the new plan", formula: "sold - new_sold", expected: 5, unit: "kits" }
  - { id: new_annual, label: "Annual profit across the chain, new plan", formula: "new_profit_wk * stores * weeks / 1e6", expected: 1.872, unit: "$M", decimals: 2 }
  - { id: annual_swing, label: "Annual improvement from the new plan", formula: "new_annual - annual_profit", expected: 3.12, unit: "$M", decimals: 2 }

answer:
  calc: annual_swing
  headline: "The kits lose money because {{wasted}} out of every 200 a store makes are thrown away; making {{new_produced}} in two smaller batches turns a {{annual_loss}} loss into a {{new_annual}} profit."

exhibits:
  - id: exhibit-1
    title: "Meal-kit economics for an average store, per week"
    kind: table
    ask: "Here is the weekly picture for a typical store. Is the line profitable?"
    columns: ["Item", "Value"]
    rows:
      - ["Kits prepared", "{{produced}}"]
      - ["Kits sold", "{{sold}}"]
      - ["Price per kit", "{{price}}"]
      - ["Ingredients per kit", "{{ingredients}}"]
      - ["Prep labor and packaging per kit", "{{prep}}"]
      - ["Fixed cost (cooler display, chef supervision)", "{{fixed_week}}"]
    note: "Illustrative data created for this practice case. Hollinsworth Grocers is fictional. Unsold kits are thrown away after four days."
    insight: |
      Each kit sold makes a healthy {{margin_sold}}, but {{wasted}} a week
      go in the bin. The problem is not price; it is how many kits are made.
  - id: exhibit-2
    title: "Kits sold per store by day after preparation (weekly average)"
    kind: bar
    unit: "kits"
    decimals: 0
    ask: "Here is when kits sell. What does it suggest?"
    data:
      - { label: "Day 1", value: day1 }
      - { label: "Day 2", value: day2 }
      - { label: "Day 3", value: day3 }
      - { label: "Day 4", value: day4 }
    note: "Illustrative data created for this practice case. Today each store prepares one large batch per week."
    insight: |
      Shoppers want the freshest kits: {{early_share}} of sales happen in the
      first two days. Smaller, more frequent batches would sell almost as much
      and waste far less.
---

## Prompt

Our client, Hollinsworth Grocers, runs 120 supermarkets in the Southeast. Two years ago it launched **in-store meal kits**: boxes with fresh, pre-measured ingredients and a recipe for a family dinner, made in each store's kitchen.

Customers like the kits and sales have grown, but the finance team says the line is losing money. The head of fresh foods has asked us: **why are the meal kits unprofitable, and should Hollinsworth keep them?**

## Clarifying information

- Q: What is the objective?
  A: Make the line profitable within a year. If that isn't possible, the chain will drop it.
- Q: How are kits made and sold?
  A: Each store prepares one batch of kits early in the week. Kits are good for four days; anything unsold after that is thrown away.
- Q: What does a kit cost and sell for?
  A: It sells for {{price}}. Ingredients cost {{ingredients}} and prep labor and packaging {{prep}}.
- Q: Do the kits bring other benefits, like more store visits?
  A: Possibly, but the chain has no data on it. Focus on the kits' own profit.
- Q: Are kits discounted before they expire?
  A: No. Today unsold kits are simply thrown away.

## Structure

> **Ask:** How would you figure out why the meal kits are losing money?

Use a simple profit tree, but keep **kits made** and **kits sold** separate, because with fresh food you pay for everything you make and only get paid for what you sell:

- **Profit = Revenue − Costs**
  - **Revenue = Kits sold × Price**
    - Demand: how many shoppers buy, and when
    - Price and any discounts
  - **Costs**
    - Kits *made* × cost per kit (ingredients, prep, packaging)
    - Fixed costs: cooler space, supervision
- **Waste = Kits made − Kits sold**: the link between the two sides

Hypothesis: *"Shoppers clearly like the kits, so demand is probably fine. I suspect the store makes too many and throws a lot away."*

## Math walkthrough

> **Ask:** Using Exhibit 1, what is the profit per store per week, and what drives it? Then: the team proposes making 150 kits a week in two smaller batches, which they expect to sell 135. What would that do to profit?

**1. Unit economics.**
Cost per kit = $8 + $4 = **{{cost_per_kit}}**, so a sold kit earns $20 − $12 = **{{margin_sold}}**.

**2. Weekly store profit.**
Revenue = 140 × $20 = **{{revenue_wk}}**.
Cost of kits made = 200 × $12 = **{{cost_wk}}**.
Profit = $2,800 − $2,400 − $600 = **{{profit_wk}}** per store.
Across the chain: −$200 × 120 stores × 52 weeks ≈ **{{annual_profit}}** a year.

**3. Find the leak.**
Sell-through = 140 ÷ 200 = **{{sell_through}}**, so **{{wasted}}** are thrown away each week, costing 60 × $12 = **{{waste_cost}}**.
Each wasted kit costs $12 but each sold kit only earns $8, so one wasted kit wipes out the margin on **{{waste_ratio}}**.
Without waste the store would make 140 × $8 − $600 = **{{profit_no_waste}}**.
Break-even: making 200 kits, a store must sell (200 × $12 + $600) ÷ $20 = **{{breakeven_sold}}**, a sell-through of **{{breakeven_st}}**.

**4. When do kits sell? (Exhibit 2)**
Days 1 and 2 account for (60 + 45) ÷ 140 = **{{early_share}}** of sales. Two smaller batches a week would keep kits fresh.

**5. The new plan.**
Revenue = 135 × $20 = {{new_revenue}}; cost = 150 × $12 = {{new_cost}}.
Profit = $2,700 − $1,800 − $600 = **{{new_profit_wk}}** per store per week, with sell-through of {{new_st}}.
Across the chain that is **{{new_annual}}** a year, an improvement of **{{annual_swing}}**, even though weekly sales per store drop by {{lost_sales}}.

## Synthesis

> **Ask:** What would you tell the head of fresh foods?

**Keep the meal kits, but make fewer of them more often: the line loses money because {{wasted}} out of every 200 are thrown away, and switching to two smaller batches totaling {{new_produced}} turns a {{annual_loss}} loss into a {{new_annual}} profit.**

1. **The product works:** each kit sold earns {{margin_sold}}, and without waste a store would earn {{profit_no_waste}}.
2. **Waste is the problem:** sell-through is only {{sell_through}}, below the {{breakeven_st}} needed to break even, and each wasted kit cancels the margin on {{waste_ratio}}.
3. **The fix fits how shoppers buy:** {{early_share}} of sales come in the first two days, so smaller, fresher batches lose very few sales.

**Risks and next steps:** pilot in 10 stores to confirm sales hold up; check that two prep runs don't add labor cost; set batch sizes store by store from sales data rather than one number for all; consider a markdown on day 3 kits to sell more before they expire.

## Common mistakes

- Multiplying the cost by kits *sold* instead of kits *made*, which makes the line look profitable.
- Recommending a price increase. The margin on a sold kit is already healthy; the loss comes from waste.
- Recommending dropping the line without checking whether a simple operational fix works.
- Forgetting the fixed cost per store when computing break-even.

## What top candidates do differently

- Separate kits made from kits sold in the structure, before seeing any data.
- Express the waste problem in one striking number: one wasted kit cancels {{waste_ratio}}.
- Read Exhibit 2 as an operations insight (freshness drives sales), not just a sales chart.
- Suggest setting batch sizes per store, since demand differs by neighborhood.

## Creative question

Beyond making fewer kits, what else could Hollinsworth do to cut waste or sell more kits?

## Model answer

Group ideas by **before, during and after the shelf life**:

- **Before (better forecasting):** use each store's sales history, weather and local events to set batch sizes; offer online pre-orders for pickup so part of the demand is known in advance.
- **During (sell more):** place kits near the store entrance and the checkout; rotate recipes weekly to bring shoppers back; bundle a kit with a bottle of wine or a dessert.
- **After (recover value):** mark down kits on day 3; reuse unsold fresh ingredients in the store's hot-food counter where food-safety rules allow; donate the rest to food banks.

A top candidate prioritizes: "Pre-orders are the most powerful idea, because every pre-ordered kit is a kit we know will sell, which attacks waste at its root."
