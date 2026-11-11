---
id: coffee-subscription-pricing
title: "Bottomless Cup: Pricing an All-You-Can-Drink Coffee Subscription"
client: "Daybreak Coffee Co. (fictional), a US coffee chain with about 400 cafes"
summary: "Daybreak is testing a monthly subscription for unlimited drip and cold brew. Use the usage distribution, margin per drink and new-customer traffic to find the price that makes money."
industry: consumer-retail
sub_industry: "Restaurants and cafes"
type: pricing
difficulty: intermediate
format: interviewer-led
time_minutes: 25

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  price_drink:    { value: 4.5,   unit: "$",       decimals: 2, label: "Average price per drink today" }
  var_cost:       { value: 1.1,   unit: "$",       decimals: 2, label: "Variable cost per drink (coffee, cup, milk, extra labor)" }
  food_margin:    { value: 0.6,   unit: "$",       decimals: 2, label: "Food margin attached to each drink visit" }
  pre_drinks:     { value: 15,    unit: "drinks",  label: "Monthly drinks of a typical existing customer who subscribes (before)" }
  existing_share: { value: 0.60,  unit: "%",       label: "Share of subscribers who are existing customers (the rest are new to Daybreak)" }
  existing_high:  { value: 0.80,  unit: "%",       label: "Share of existing customers among subscribers in the downside case" }
  customers:      { value: 2.0,   unit: "million", label: "Active customers per month" }
  share_1:        { value: 0.20,  unit: "%",       label: "Subscribers in the lightest usage group" }
  drinks_1:       { value: 8,     unit: "drinks",  label: "Monthly drinks, lightest group" }
  share_2:        { value: 0.30,  unit: "%",       label: "Subscribers in the second usage group" }
  drinks_2:       { value: 16,    unit: "drinks",  label: "Monthly drinks, second group" }
  share_3:        { value: 0.30,  unit: "%",       label: "Subscribers in the third usage group" }
  drinks_3:       { value: 26,    unit: "drinks",  label: "Monthly drinks, third group" }
  share_4:        { value: 0.20,  unit: "%",       label: "Subscribers in the heaviest usage group" }
  drinks_4:       { value: 40,    unit: "drinks",  label: "Monthly drinks, heaviest group" }
  price_1:        { value: 39,    unit: "$",       label: "Test price A per month" }
  price_2:        { value: 49,    unit: "$",       label: "Test price B per month" }
  price_3:        { value: 59,    unit: "$",       label: "Test price C per month" }
  price_4:        { value: 69,    unit: "$",       label: "Test price D per month" }
  price_5:        { value: 79,    unit: "$",       label: "Test price E per month" }
  takeup_1:       { value: 0.12,  unit: "%",       label: "Share of customers who subscribe at price A" }
  takeup_2:       { value: 0.09,  unit: "%",       label: "Share of customers who subscribe at price B" }
  takeup_3:       { value: 0.06,  unit: "%",       label: "Share of customers who subscribe at price C" }
  takeup_4:       { value: 0.032, unit: "%",       decimals: 1, label: "Share of customers who subscribe at price D" }
  takeup_5:       { value: 0.016, unit: "%",       decimals: 1, label: "Share of customers who subscribe at price E" }

calculations:
  # --- Unit economics and usage ---
  - { id: margin_drink, label: "Margin per drink, including food", formula: "price_drink - var_cost + food_margin", expected: 4.0, unit: "$", decimals: 2 }
  - { id: avg_drinks, label: "Average monthly drinks per subscriber", formula: "share_1 * drinks_1 + share_2 * drinks_2 + share_3 * drinks_3 + share_4 * drinks_4", expected: 22.2, unit: "drinks", decimals: 1 }
  - { id: uplift, label: "Usage of subscribers compared with an existing customer today", formula: "avg_drinks / pre_drinks - 1", expected: 0.48, unit: "%", decimals: 0 }
  - { id: net_cost, label: "Net cost per extra drink (variable cost less food margin)", formula: "var_cost - food_margin", expected: 0.5, unit: "$", decimals: 2 }
  - { id: sub_cost, label: "Monthly cost of serving a subscriber", formula: "avg_drinks * net_cost", expected: 11.1, unit: "$", decimals: 2 }
  - { id: pre_margin, label: "Monthly margin from an existing customer today", formula: "pre_drinks * margin_drink", expected: 60, unit: "$" }
  - { id: pre_rev, label: "Monthly spending of an existing customer today", formula: "pre_drinks * price_drink", expected: 67.5, unit: "$", decimals: 2 }
  # --- Break-even price ---
  - { id: be_price, label: "Break-even subscription price", formula: "sub_cost + existing_share * pre_margin", expected: 47.1, unit: "$", decimals: 2 }
  - { id: be_price_high, label: "Break-even price in the downside case", formula: "sub_cost + existing_high * pre_margin", expected: 59.1, unit: "$", decimals: 2 }
  - { id: cust_be_drinks, label: "Drinks a month at which price C equals paying per drink", formula: "price_3 / price_drink", expected: 13.1111, unit: "drinks", decimals: 1 }
  # --- By price point ---
  - { id: subs_1, label: "Subscribers at price A", formula: "customers * takeup_1", expected: 0.24, unit: "million", decimals: 3 }
  - { id: subs_2, label: "Subscribers at price B", formula: "customers * takeup_2", expected: 0.18, unit: "million", decimals: 3 }
  - { id: subs_3, label: "Subscribers at price C", formula: "customers * takeup_3", expected: 0.12, unit: "million", decimals: 3 }
  - { id: subs_4, label: "Subscribers at price D", formula: "customers * takeup_4", expected: 0.064, unit: "million", decimals: 3 }
  - { id: subs_5, label: "Subscribers at price E", formula: "customers * takeup_5", expected: 0.032, unit: "million", decimals: 3 }
  - { id: gain_1, label: "Gain per subscriber at price A", formula: "price_1 - be_price", expected: -8.1, unit: "$", decimals: 2 }
  - { id: gain_2, label: "Gain per subscriber at price B", formula: "price_2 - be_price", expected: 1.9, unit: "$", decimals: 2 }
  - { id: gain_3, label: "Gain per subscriber at price C", formula: "price_3 - be_price", expected: 11.9, unit: "$", decimals: 2 }
  - { id: gain_4, label: "Gain per subscriber at price D", formula: "price_4 - be_price", expected: 21.9, unit: "$", decimals: 2 }
  - { id: gain_5, label: "Gain per subscriber at price E", formula: "price_5 - be_price", expected: 31.9, unit: "$", decimals: 2 }
  - { id: loss_1, label: "Loss per subscriber at price A", formula: "be_price - price_1", expected: 8.1, unit: "$", decimals: 2 }
  - { id: profit_1, label: "Monthly profit gain at price A", formula: "subs_1 * gain_1", expected: -1.944, unit: "$M", decimals: 2 }
  - { id: profit_2, label: "Monthly profit gain at price B", formula: "subs_2 * gain_2", expected: 0.342, unit: "$M", decimals: 2 }
  - { id: profit_3, label: "Monthly profit gain at price C", formula: "subs_3 * gain_3", expected: 1.428, unit: "$M", decimals: 2 }
  - { id: profit_4, label: "Monthly profit gain at price D", formula: "subs_4 * gain_4", expected: 1.4016, unit: "$M", decimals: 2 }
  - { id: profit_5, label: "Monthly profit gain at price E", formula: "subs_5 * gain_5", expected: 1.0208, unit: "$M", decimals: 2 }
  - { id: loss_total_1, label: "Monthly profit loss at price A", formula: "0 - profit_1", expected: 1.944, unit: "$M", decimals: 2 }
  - { id: year_3, label: "Annual profit gain at price C", formula: "profit_3 * 12", expected: 17.136, unit: "$M", decimals: 1 }
  # --- The trap: ignoring cannibalization ---
  - { id: exist_chg, label: "Margin change per existing customer at price C", formula: "price_3 - sub_cost - pre_margin", expected: -12.1, unit: "$", decimals: 2 }
  - { id: exist_loss, label: "Margin lost per existing customer at price C", formula: "pre_margin + sub_cost - price_3", expected: 12.1, unit: "$", decimals: 2 }
  - { id: new_gain, label: "Margin gain per new customer at price C", formula: "price_3 - sub_cost", expected: 47.9, unit: "$", decimals: 2 }
  - { id: naive_profit, label: "Monthly profit at price C if every subscriber were new", formula: "subs_3 * new_gain", expected: 5.748, unit: "$M", decimals: 2 }
  - { id: overstate, label: "Overstatement from ignoring cannibalization", formula: "naive_profit - profit_3", expected: 4.32, unit: "$M", decimals: 2 }

answer:
  calc: be_price
  headline: "A subscription must cost more than {{be_price}} to make money; price C ({{price_3}}) maximizes profit at {{profit_3}} a month ({{year_3}} a year), because {{existing_share}} of subscribers are existing customers who were already paying more."

exhibits:
  - id: exhibit-1
    title: "Pilot usage distribution, drinks per subscriber per month"
    kind: table
    ask: "Here is how pilot subscribers use the offer. What do you see?"
    columns: ["Usage group", "Share of subscribers", "Drinks per month"]
    rows:
      - ["Light", "{{share_1}}", "{{drinks_1}}"]
      - ["Moderate", "{{share_2}}", "{{drinks_2}}"]
      - ["Frequent", "{{share_3}}", "{{drinks_3}}"]
      - ["Heavy", "{{share_4}}", "{{drinks_4}}"]
      - ["**Average**", "**100%**", "**{{avg_drinks}}**"]
    note: "Illustrative data created for this practice case. Daybreak is fictional."
    insight: |
      The average subscriber drinks {{avg_drinks}} a month, {{uplift}} more than a
      typical existing customer who subscribes today ({{pre_drinks}}). Subscribers are not a
      random sample: heavier drinkers choose it, and they drink more once it is
      unlimited.
  - id: exhibit-2
    title: "Economics of a drink and of a subscriber"
    kind: table
    ask: "Here is the margin picture. How would you use it to set a price?"
    columns: ["Item", "Value"]
    rows:
      - ["Price per drink", "{{price_drink}}"]
      - ["Variable cost per drink", "{{var_cost}}"]
      - ["Food margin attached per drink", "{{food_margin}}"]
      - ["Margin per drink, including food", "{{margin_drink}}"]
      - ["Existing customers among subscribers", "{{existing_share}}"]
      - ["Monthly drinks of an existing customer before subscribing", "{{pre_drinks}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      An existing customer earns Daybreak {{pre_margin}} a month today. Any subscription
      priced below that, taken by existing customers, gives margin away. New customers
      are the upside.
  - id: exhibit-3
    title: "Pilot take-up by price point"
    kind: table
    ask: "Take-up falls as price rises. Which price would you pick?"
    columns: ["Price per month", "Share of customers who subscribe", "Subscribers"]
    rows:
      - ["{{price_1}}", "{{takeup_1}}", "{{subs_1}}"]
      - ["{{price_2}}", "{{takeup_2}}", "{{subs_2}}"]
      - ["{{price_3}}", "{{takeup_3}}", "{{subs_3}}"]
      - ["{{price_4}}", "{{takeup_4}}", "{{subs_4}}"]
      - ["{{price_5}}", "{{takeup_5}}", "{{subs_5}}"]
    note: "Illustrative data created for this practice case. Based on {{customers}} active customers per month."
    insight: |
      The lowest price attracts the most subscribers and loses money on each. Profit
      peaks at price C because the margin per subscriber grows faster than take-up falls
      between prices B and C.
---

## Prompt

Our client, Daybreak Coffee Co., runs about 400 cafes across the US. The CEO read about a rival's coffee subscription and wants one: **a flat monthly fee for unlimited drip and cold brew**. A small pilot has run for three months.

The CEO asks us: **what should Daybreak charge, and will the subscription make money?**

## Clarifying information

- Q: What is the goal: profit, traffic or loyalty?
  A: Profit growth first. Extra traffic is welcome if it pays for itself.
- Q: What does a drink cost to make?
  A: About {{var_cost}} in variable cost; Exhibit 2 has the full picture. Fixed cafe costs do not change.
- Q: Does food matter?
  A: Yes. Each visit brings a food margin of about {{food_margin}} per drink.
- Q: Who joined the pilot?
  A: About {{existing_share}} were existing customers; the rest were new to Daybreak.
- Q: How many customers does Daybreak have?
  A: About {{customers}} active customers per month.
- Q: Can subscribers order anything?
  A: Only drip and cold brew, with one drink per visit and no more than two visits per day, so a heavy user costs more but not unlimited amounts.
- Q: How many prices did the pilot test?
  A: Five, shown in Exhibit 3.

## Structure

> **Ask:** How would you approach setting the price?

Think about the price from **three sides**:

- **1. Daybreak's economics**
  - Margin per drink and per visit (including food)
  - Cost of serving a subscriber who drinks more than average
  - Break-even price: what must a subscriber pay so that Daybreak is no worse off?
- **2. Customer behavior**
  - Who subscribes (heavier drinkers choose it, which is self-selection)
  - How much more they drink once it is unlimited
  - How many are existing customers (giving up margin) versus new (extra margin)
- **3. Demand**
  - Take-up at each price
  - Total profit = subscribers × gain per subscriber
- **4. Risks and alternatives:** competitor reaction, churn, capped plans, brand effect

Hypothesis: *"The break-even price will sit well above the cost of the drinks, because existing customers already pay full price today. Profit will peak at a price where each subscriber is clearly profitable but take-up has not collapsed."*

## Math walkthrough

> **Ask:** Find the break-even price, then the price that maximizes profit.

**1. Margin per drink.**
{{price_drink}} − {{var_cost}} + {{food_margin}} = **{{margin_drink}}** including food.

**2. What a subscriber drinks and costs.**
Average drinks: 20% × {{drinks_1}} + 30% × {{drinks_2}} + 30% × {{drinks_3}} + 20% × {{drinks_4}} = **{{avg_drinks}}**.
Each extra drink costs {{var_cost}} less the {{food_margin}} of food margin that comes with it, so {{net_cost}} net. Monthly cost to serve: {{avg_drinks}} × {{net_cost}} = **{{sub_cost}}**.

**3. Break-even price.**
An existing customer earns {{pre_margin}} a month today ({{pre_drinks}} × {{margin_drink}}). A new customer earns nothing without the subscription. So Daybreak breaks even when:
price = cost to serve + share of existing customers × margin given up = {{sub_cost}} + {{existing_share}} × {{pre_margin}} = **{{be_price}}**.

**4. Profit by price.**

| Price | Subscribers | Gain per subscriber (price − {{be_price}}) | Monthly profit gain |
|---|---|---|---|
| {{price_1}} | {{subs_1}} | −{{loss_1}} | −{{loss_total_1}} |
| {{price_2}} | {{subs_2}} | {{gain_2}} | {{profit_2}} |
| **{{price_3}}** | {{subs_3}} | {{gain_3}} | **{{profit_3}}** |
| {{price_4}} | {{subs_4}} | {{gain_4}} | {{profit_4}} |
| {{price_5}} | {{subs_5}} | {{gain_5}} | {{profit_5}} |

Price C maximizes profit at **{{profit_3}}** a month, or **{{year_3}}** a year. Price D is close, but loses subscribers faster than it gains margin.

**5. Why the naive view fails.**
At price C an existing customer loses {{exist_loss}} of margin a month (they pay {{price_3}} instead of {{pre_rev}} of drinks, and their drinks cost more), while a new customer adds {{new_gain}}. Ignoring the existing customers would show {{naive_profit}} a month, an overstatement of {{overstate}}.

**6. Customer's view.**
At {{price_3}} a customer breaks even against paying per drink at {{cust_be_drinks}} a month, so any frequent drinker saves money, which is why take-up is real.

**7. Downside.**
If {{existing_high}} of subscribers are existing customers, break-even rises to {{be_price_high}}, and price C would only just break even.

## Synthesis

> **Ask:** What price would you recommend to the CEO?

**Daybreak should price the subscription at {{price_3}} a month. It is the highest-profit price in the pilot at about {{year_3}} a year, and it sits comfortably above the {{be_price}} break-even. A cheaper plan loses money on every subscriber.**

1. **Break-even is about {{be_price}}**, not the cost of the coffee, because {{existing_share}} of subscribers already spend about {{pre_rev}} a month and Daybreak gives up {{pre_margin}} of margin on each.
2. **Price C wins:** {{subs_3}} subscribers each add {{gain_3}} a month. Price A attracts the most subscribers but loses {{loss_total_1}} a month.
3. **The upside is new customers**, who each add {{new_gain}} a month at price C.

**Risks and next steps:** the mix of existing and new subscribers decides everything, so track it weekly; if {{existing_high}} are existing customers, the break-even rises to {{be_price_high}}; consider a daily visit cap or a second tier to limit heavy users; test price C against price D in separate cities before a national rollout; and watch churn after the first three months, because subscribers who stop visiting are pure profit but subscribers who cancel and tell friends are not.

## Common mistakes

- Pricing from the cost of coffee alone, which ignores the {{pre_margin}} a month that existing customers already generate.
- Using the average customer's usage instead of the {{avg_drinks}} of a self-selected subscriber.
- Forgetting the food margin that comes with extra visits.
- Picking the price with the most subscribers instead of the most profit.
- Counting every subscriber as incremental, when {{existing_share}} already shop at Daybreak.

## What top candidates do differently

- Spot early that this is a break-even price problem, driven by cannibalization of existing customers.
- Treat existing and new customers separately in the math.
- Compute total profit at each price, not just margin per subscriber.
- Stress-test the mix of existing versus new customers and propose a cap or tiers as protection.

## Creative question

How could Daybreak redesign the subscription so that it attracts more new customers and fewer existing customers who would give margin away?

## Model answer

Organize ideas by **who the offer is for**:

- **Target new customers:** offer the first month at a discount to people who have not visited in 90 days, so existing regulars do not benefit.
- **Limit what existing customers can claim:** cap visits at one a day, or restrict the offer to off-peak hours when cafes have spare capacity.
- **Tier the plan:** a lower-priced plan with 15 drinks a month for light users and a higher-priced unlimited plan for heavy users.
- **Add value that costs little:** members-only menu items, free food add-ons and mobile ordering, which raise perceived value without cutting into drink margin.

A top candidate prioritizes: "A tiered plan with an off-peak option fills empty capacity and reduces the {{exist_loss}} of margin each existing customer would give away, so I would test it against the single plan."
