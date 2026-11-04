---
id: pet-food-subscription-pricing
title: "Bowl Subscription: Pricing a Premium Pet-Food Plan"
client: "Tuckerbrook Pet Co. (fictional), a direct-to-consumer maker of fresh, refrigerated dog food"
summary: "A fresh dog-food startup is launching a monthly subscription. Cost-plus pricing says one number, competitors say another — find the price, and the cost fix that makes it work."
industry: consumer-retail
sub_industry: "Pet food / direct-to-consumer subscriptions"
type: pricing
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  ingredients_day:  { value: 2.00, unit: "$",       label: "Ingredients and cooking per dog per day", decimals: 2 }
  ship_day:         { value: 1.00, unit: "$",       label: "Cold packaging and shipping per dog per day (weekly delivery)", decimals: 2 }
  ship_day_bw:      { value: 0.70, unit: "$",       label: "Cold packaging and shipping per dog per day (every-two-weeks delivery)", decimals: 2 }
  days:             { value: 30,   unit: "days",    label: "Days of food per monthly plan" }
  target_margin:    { value: 0.40, unit: "%",       label: "Tuckerbrook's target gross margin" }
  comp_x:           { value: 120,  unit: "$/month", label: "Fresh competitor X, monthly plan for a 30 lb dog" }
  comp_y:           { value: 130,  unit: "$/month", label: "Fresh competitor Y, monthly plan for a 30 lb dog" }
  kibble:           { value: 60,   unit: "$/month", label: "Premium dry food (kibble), monthly cost for a 30 lb dog" }
  premium_wtp:      { value: 0.08, unit: "%",       label: "Premium over fresh competitors that customers say they would pay" }

calculations:
  # --- Cost-plus ---
  - { id: cost_day, label: "Cost per dog per day, weekly delivery", formula: "ingredients_day + ship_day", expected: 3.0, unit: "$", decimals: 2 }
  - { id: cost_month, label: "Cost per monthly plan, weekly delivery", formula: "cost_day * days", expected: 90, unit: "$/month" }
  - { id: costplus_price, label: "Cost-plus price for a 40% gross margin", formula: "cost_month / (1 - target_margin)", expected: 150, unit: "$/month" }
  - { id: markup_wrong, label: "Common mistake: 40% markup on cost", formula: "cost_month * (1 + target_margin)", expected: 126, unit: "$/month" }
  - { id: markup_margin, label: "Gross margin actually earned with a 40% markup", formula: "(markup_wrong - cost_month) / markup_wrong", expected: 0.2857, unit: "%", decimals: 0 }
  # --- Competitor-based ---
  - { id: comp_avg, label: "Average fresh competitor price", formula: "(comp_x + comp_y) / 2", expected: 125, unit: "$/month" }
  - { id: costplus_gap, label: "Cost-plus price above the fresh competitor average", formula: "costplus_price / comp_avg - 1", expected: 0.20, unit: "%" }
  - { id: value_price, label: "Price at the premium customers would pay", formula: "comp_avg * (1 + premium_wtp)", expected: 135, unit: "$/month" }
  - { id: margin_value, label: "Gross margin at that price, weekly delivery", formula: "(value_price - cost_month) / value_price", expected: 0.3333, unit: "%", decimals: 0 }
  # --- Fixing the cost ---
  - { id: cost_month_bw, label: "Cost per monthly plan, every-two-weeks delivery", formula: "(ingredients_day + ship_day_bw) * days", expected: 81, unit: "$/month" }
  - { id: margin_bw, label: "Gross margin at that price, every-two-weeks delivery", formula: "(value_price - cost_month_bw) / value_price", expected: 0.40, unit: "%" }
  - { id: profit_sub_year, label: "Gross profit per subscriber per year", formula: "(value_price - cost_month_bw) * 12", expected: 648, unit: "$" }

answer:
  calc: value_price
  headline: "Price the plan at {{value_price}} — just above fresh competitors — and switch to every-two-weeks delivery to hit the {{target_margin}} margin target."

exhibits:
  - id: exhibit-1
    title: "Monthly cost of feeding a 30 lb dog, by option"
    kind: bar
    unit: "$/month"
    decimals: 0
    ask: "Here is what dog owners pay today. How does it affect your pricing?"
    data:
      - { label: "Premium dry food (kibble)", value: kibble }
      - { label: "Fresh competitor X", value: comp_x }
      - { label: "Fresh competitor Y", value: comp_y }
    note: "Illustrative data created for this practice case; not real brand prices."
    insight: |
      Fresh food already costs far more than premium kibble, and
      the two fresh competitors sit close together around {{comp_avg}}. A
      new brand priced well above that band will need a very strong reason.
  - id: exhibit-2
    title: "Tuckerbrook's cost per dog per day"
    kind: table
    ask: "And here are Tuckerbrook's costs. What do you notice?"
    columns: ["Cost item", "Weekly delivery", "Every two weeks"]
    rows:
      - ["Ingredients and cooking", "{{ingredients_day}}", "{{ingredients_day}}"]
      - ["Cold packaging and shipping", "{{ship_day}}", "{{ship_day_bw}}"]
    note: "Illustrative data created for this practice case. Every-two-weeks delivery needs a larger freezer-safe box; most customers in a test said it was fine."
    insight: |
      Shipping cold food is a big part of the cost. Delivering less often
      spreads each shipment's cost over more days of food.
---

## Prompt

Our client, Tuckerbrook Pet Co., makes fresh, refrigerated dog food from human-grade ingredients and sells it online. It is launching a **monthly subscription plan**: food is cooked, portioned for the customer's dog and delivered in insulated boxes.

The founder's finance lead has proposed pricing the plan using cost plus a target margin. The founder isn't sure. She asks us: **what should Tuckerbrook charge per month for a typical 30 lb dog?**

## Clarifying information

- Q: What is Tuckerbrook's goal?
  A: Grow subscribers quickly while reaching a **{{target_margin}}** gross margin, which the company needs to fund marketing.
- Q: Who are the customers?
  A: Dog owners who already think of their pet as family, many of whom currently buy premium kibble or a fresh competitor's plan.
- Q: How is Tuckerbrook different from competitors?
  A: Its recipes are designed with veterinary nutritionists and it sources ingredients from local farms. In a survey, customers said they would pay about {{premium_wtp}} more than they pay fresh competitors.
- Q: Is the price the same for every dog?
  A: No — it scales with the dog's size. We'll focus on a typical 30 lb dog; other sizes follow the same logic.
- Q: How often is food delivered?
  A: The plan assumes weekly delivery, but every-two-weeks delivery is possible (Exhibit 2).

## Structure

> **Ask:** How would you approach setting the price?

Look at the price from three angles and then reconcile them:

- **1. Cost (the floor)**
  - Cost per dog per month: ingredients, packaging, cold shipping
  - Price needed for the {{target_margin}} margin target
- **2. Competitors (the reference point)**
  - Fresh competitors' prices; premium kibble as the cheaper alternative
- **3. Customer value (the ceiling)**
  - What Tuckerbrook's differences are worth to customers
- **4. Reconcile**
  - If the price customers accept is below the cost-plus price, can we lower cost?

A strong candidate says up front that **cost tells you the lowest price you can live with, not the price customers will pay.**

## Math walkthrough

> **Ask:** First, what price does the finance lead's cost-plus approach give? Then, using Exhibit 1 and the survey, where should the price be — and does it meet the margin target?

**1. Cost-plus (Exhibit 2).**
Cost per day = $2.00 + $1.00 = **{{cost_day}}**; per month = $3.00 × 30 = **{{cost_month}}**.
For a 40% gross margin, cost can only be the remaining share of the price: price = $90 ÷ (1 − 40%) = **{{costplus_price}}**.
*(A 40% markup — $90 × 1.4 = {{markup_wrong}} — only gives a margin of {{markup_margin}}. Margin and markup are not the same thing.)*

**2. Competitors (Exhibit 1).** Fresh competitors average ($120 + $130) ÷ 2 = **{{comp_avg}}**. The cost-plus price is **{{costplus_gap}}** above that — hard to justify for a new brand.

**3. Customer value.** Customers would pay about {{premium_wtp}} more than competitors: $125 × 1.08 = **{{value_price}}**.
At that price, the margin with weekly delivery is ($135 − $90) ÷ $135 ≈ **{{margin_value}}** — below the {{target_margin}} target.

> **Ask:** The founder doesn't want to go above {{value_price}}. How could Tuckerbrook still reach a {{target_margin}} margin?

**4. Fix the cost, not the price.** With delivery every two weeks, cost per month = ($2.00 + $0.70) × 30 = **{{cost_month_bw}}**.
Margin = ($135 − $81) ÷ $135 = **{{margin_bw}}** — on target. Each subscriber then earns ($135 − $81) × 12 = **{{profit_sub_year}}** of gross profit a year.

## Synthesis

> **Ask:** What do you tell the founder?

**Tuckerbrook should price the plan at {{value_price}} for a 30 lb dog — a small premium over fresh competitors, in line with what customers say they would pay — and move to every-two-weeks delivery to reach its {{target_margin}} margin.**

1. **Cost-plus pricing would overshoot:** {{costplus_price}} is {{costplus_gap}} above the fresh competitor average of {{comp_avg}}.
2. **Tuckerbrook's differences justify a modest premium:** at {{value_price}} it is priced as a premium fresh brand, not an outlier.
3. **The margin gap is a cost problem:** every-two-weeks delivery lowers monthly cost to {{cost_month_bw}}, which delivers exactly the {{target_margin}} target and {{profit_sub_year}} of gross profit per subscriber a year.

**Risks and next steps:** survey answers often overstate what people will really pay — test {{value_price}} against a slightly lower price with real sign-ups; check that larger delivery boxes don't increase cancellations; consider a discounted first box to win customers from competitors without lowering the ongoing price.

## Common mistakes

- Confusing markup with margin: a 40% markup gives {{markup_wrong}}, which is only a {{markup_margin}} margin.
- Stopping at the cost-plus price without checking what competitors charge.
- Lowering the price below {{value_price}} to "win share" when customers already value Tuckerbrook more than competitors.
- Assuming only the price can close the margin gap — the cost side is often the easier lever.

## What top candidates do differently

- Use cost as a floor, competitors as a reference and customer value as the ceiling — then reconcile.
- Spot that shipping is a large share of cost and look for a fix there before changing the price.
- Turn the answer into gross profit per subscriber ({{profit_sub_year}} a year), which links pricing to how much Tuckerbrook can spend to win a customer.

## Creative question

How could Tuckerbrook reduce the number of subscribers who cancel in the first three months?

## Model answer

A strong answer follows the customer's early experience:

- **First impressions:** a smooth first delivery, a simple guide to switching a dog's food gradually, and a check-in from a nutrition advisor after week one.
- **Flexibility:** easy options to pause, skip a delivery or change portion sizes instead of cancelling.
- **Showing the benefit:** photo and weight tracking, and reminders of changes owners notice (coat, energy, digestion).
- **Rewarding loyalty:** small perks after three and six months, such as free treats or a toy.

A top candidate prioritizes: "Make pausing as easy as cancelling — many owners cancel only because they have too much food in the freezer."
