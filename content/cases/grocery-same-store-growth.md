---
id: grocery-same-store-growth
title: "Flat Aisles: Restarting Growth at a Regional Grocery Chain"
client: "Maple & Main Markets (fictional), a regional US supermarket chain with 112 stores"
summary: "Sales grew 8% in two years, but every dollar of that came from new stores. Break growth into traffic, basket and new stores, then choose between private label, delivery and more stores."
industry: consumer-retail
sub_industry: "Grocery retail"
type: growth
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  mature_stores:  { value: 100,   unit: "stores",       label: "Mature stores (open at least three years)" }
  new_stores:     { value: 12,    unit: "stores",       label: "Stores opened in the last two years" }
  tx_y1:          { value: 9000,  unit: "transactions", label: "Transactions per mature store per week, Year 1" }
  tx_y3:          { value: 8550,  unit: "transactions", label: "Transactions per mature store per week, Year 3" }
  basket_y1:      { value: 40,    unit: "$",            label: "Average basket, Year 1" }
  basket_y3:      { value: 42,    unit: "$",            label: "Average basket, Year 3" }
  weeks:          { value: 52,    unit: "weeks",        label: "Weeks per year" }
  inflation:      { value: 0.06,  unit: "%",            label: "Grocery price inflation over the two years" }
  new_store_sales: { value: 13,   unit: "$M",           label: "Year 3 sales per new store" }
  pl_now:         { value: 0.18,  unit: "%",            label: "Private-label share of sales today" }
  pl_target:      { value: 0.24,  unit: "%",            label: "Private-label share of sales after the program" }
  pl_margin:      { value: 0.34,  unit: "%",            label: "Gross margin on private label" }
  nb_margin:      { value: 0.25,  unit: "%",            label: "Gross margin on national brands" }
  pl_invest:      { value: 8,     unit: "$M",           label: "One-time cost of the private-label program (development, packaging, launch)" }
  deliv_orders:   { value: 1.2,   unit: "million",      label: "Delivery orders per year at scale" }
  deliv_basket:   { value: 90,    unit: "$",            label: "Average delivery basket" }
  cann_share:     { value: 0.40,  unit: "%",            label: "Share of delivery sales that would otherwise be bought in a store" }
  deliv_gm:       { value: 0.27,  unit: "%",            label: "Gross margin on delivery sales" }
  fulfil_cost:    { value: 9,     unit: "$",            label: "Picking and delivery cost per order" }
  deliv_invest:   { value: 15,    unit: "$M",           label: "One-time cost of the delivery platform" }
  more_stores:    { value: 8,     unit: "stores",       label: "New stores in the expansion plan" }
  store_capex:    { value: 12,    unit: "$M",           label: "Capital cost per new store" }
  ramp_margin:    { value: 0.045, unit: "%",            label: "Store profit margin at Year 3 sales" }
  mature_margin:  { value: 0.06,  unit: "%",            label: "Store profit margin at mature sales" }

calculations:
  # --- Where did growth come from? ---
  - { id: ss_y1, label: "Mature-store sales, Year 1", formula: "mature_stores * tx_y1 * weeks * basket_y1 / 1000000", expected: 1872, unit: "$M" }
  - { id: ss_y3, label: "Mature-store sales, Year 3", formula: "mature_stores * tx_y3 * weeks * basket_y3 / 1000000", expected: 1867.32, unit: "$M", decimals: 0 }
  - { id: ss_growth, label: "Same-store sales growth over two years", formula: "ss_y3 / ss_y1 - 1", expected: -0.0025, unit: "%", decimals: 1 }
  - { id: traffic_chg, label: "Change in transactions per store", formula: "tx_y3 / tx_y1 - 1", expected: -0.05, unit: "%" }
  - { id: basket_chg, label: "Change in average basket", formula: "basket_y3 / basket_y1 - 1", expected: 0.05, unit: "%" }
  - { id: units_chg, label: "Change in items bought per store (after inflation)", formula: "(1 + traffic_chg) * (1 + basket_chg) / (1 + inflation) - 1", expected: -0.058962, unit: "%", decimals: 1 }
  - { id: traffic_effect, label: "Sales effect of fewer transactions", formula: "ss_y1 * traffic_chg", expected: -93.6, unit: "$M", decimals: 1 }
  - { id: basket_effect, label: "Sales effect of a bigger basket", formula: "ss_y1 * (1 + traffic_chg) * basket_chg", expected: 88.92, unit: "$M", decimals: 1 }
  - { id: new_total, label: "Sales from new stores, Year 3", formula: "new_stores * new_store_sales", expected: 156, unit: "$M" }
  - { id: total_y3, label: "Total sales, Year 3", formula: "ss_y3 + new_total", expected: 2023.32, unit: "$M", decimals: 0 }
  - { id: total_growth, label: "Total sales growth over two years", formula: "total_y3 / ss_y1 - 1", expected: 0.080833, unit: "%", decimals: 1 }
  - { id: growth_dollars, label: "Total sales growth in dollars", formula: "total_y3 - ss_y1", expected: 151.32, unit: "$M", decimals: 0 }
  - { id: new_share, label: "New stores as a share of the growth", formula: "new_total / growth_dollars", expected: 1.0309, unit: "%", decimals: 0 }
  - { id: mature_per_store, label: "Sales per mature store, Year 3", formula: "ss_y3 / mature_stores", expected: 18.6732, unit: "$M", decimals: 1 }
  - { id: new_vs_mature, label: "New-store sales as a share of mature-store sales", formula: "new_store_sales / mature_per_store", expected: 0.6962, unit: "%", decimals: 0 }
  # --- Option 1: private label ---
  - { id: pl_gain, label: "Annual profit gain from private label", formula: "total_y3 * (pl_target - pl_now) * (pl_margin - nb_margin)", expected: 10.9259, unit: "$M", decimals: 1 }
  - { id: pl_payback, label: "Payback on private label", formula: "pl_invest / pl_gain", expected: 0.7322, unit: "years", decimals: 1 }
  # --- Option 2: delivery ---
  - { id: deliv_sales, label: "Delivery sales at scale", formula: "deliv_orders * deliv_basket", expected: 108, unit: "$M" }
  - { id: fulfil_total, label: "Fulfillment cost at scale", formula: "deliv_orders * fulfil_cost", expected: 10.8, unit: "$M" }
  - { id: naive_deliv, label: "Delivery profit if every order were new", formula: "deliv_sales * deliv_gm - fulfil_total", expected: 18.36, unit: "$M", decimals: 1 }
  - { id: cann_sales, label: "Delivery sales taken from the stores", formula: "deliv_sales * cann_share", expected: 43.2, unit: "$M", decimals: 1 }
  - { id: incr_sales, label: "Truly incremental delivery sales", formula: "deliv_sales * (1 - cann_share)", expected: 64.8, unit: "$M", decimals: 1 }
  - { id: deliv_net, label: "Annual profit gain from delivery", formula: "incr_sales * deliv_gm - fulfil_total", expected: 6.696, unit: "$M", decimals: 1 }
  - { id: deliv_payback, label: "Payback on delivery", formula: "deliv_invest / deliv_net", expected: 2.2401, unit: "years", decimals: 1 }
  - { id: deliv_growth, label: "Sales growth added by delivery", formula: "incr_sales / total_y3", expected: 0.032027, unit: "%", decimals: 1 }
  # --- Option 3: new stores ---
  - { id: stores_sales, label: "Sales added by the new stores at Year 3 levels", formula: "more_stores * new_store_sales", expected: 104, unit: "$M" }
  - { id: stores_growth, label: "Sales growth added by the new stores", formula: "stores_sales / total_y3", expected: 0.051400, unit: "%", decimals: 1 }
  - { id: stores_profit, label: "Annual profit from the new stores at Year 3 levels", formula: "stores_sales * ramp_margin", expected: 4.68, unit: "$M", decimals: 1 }
  - { id: stores_invest, label: "Capital for the new stores", formula: "more_stores * store_capex", expected: 96, unit: "$M" }
  - { id: stores_payback, label: "Payback at Year 3 sales", formula: "stores_invest / stores_profit", expected: 20.5128, unit: "years", decimals: 0 }
  - { id: mature_profit, label: "Profit per store at mature sales", formula: "mature_per_store * mature_margin", expected: 1.120392, unit: "$M", decimals: 1 }
  - { id: mature_payback, label: "Payback per store at mature sales", formula: "store_capex / mature_profit", expected: 10.7106, unit: "years", decimals: 0 }

answer:
  calc: pl_gain
  headline: "Growth of {{total_growth}} is all new stores; same-store sales are {{ss_growth}} as transactions per store changed {{traffic_chg}}. Start with private label ({{pl_gain}} a year, payback {{pl_payback}}), size delivery on its net {{deliv_net}}, and hold new stores."

exhibits:
  - id: exhibit-1
    title: "Maple & Main sales, Year 1 versus Year 3"
    kind: table
    ask: "Sales are up. Here are the numbers behind it. What do you see?"
    columns: ["Metric", "Year 1", "Year 3", "Change"]
    rows:
      - ["Transactions per mature store per week", "{{tx_y1}}", "{{tx_y3}}", "{{traffic_chg}}"]
      - ["Average basket", "{{basket_y1}}", "{{basket_y3}}", "{{basket_chg}}"]
      - ["Mature-store sales", "{{ss_y1}}", "{{ss_y3}}", "{{ss_growth}}"]
      - ["Sales from stores opened in the last two years", "0", "{{new_total}}", "n/a"]
      - ["**Total sales**", "**{{ss_y1}}**", "**{{total_y3}}**", "**{{total_growth}}**"]
    note: "Illustrative data created for this practice case. Maple & Main is fictional. Grocery price inflation over the two years was {{inflation}}."
    insight: |
      Total sales grew {{total_growth}}, but mature stores are down {{ss_growth}}.
      A basket that is 5% bigger sounds good, yet inflation was {{inflation}}, so
      items bought per store fell {{units_chg}} after inflation.
  - id: exhibit-2
    title: "Where the Year 3 sales change came from"
    kind: table
    ask: "Can you split the growth into its sources?"
    columns: ["Source", "Calculation", "Sales change"]
    rows:
      - ["Fewer transactions in mature stores", "Year 1 sales x change in transactions", "{{traffic_effect}}"]
      - ["Bigger basket in mature stores", "Year 1 sales x remaining transactions x change in basket", "{{basket_effect}}"]
      - ["New stores", "12 stores x Year 3 sales per store", "{{new_total}}"]
      - ["**Total**", "", "**{{growth_dollars}}**"]
    note: "Illustrative data created for this practice case."
    insight: |
      New stores are {{new_share}} of the growth. Take them away and the chain
      shrinks. A new store sells only {{new_vs_mature}} of what a mature one does.
  - id: exhibit-3
    title: "Three investment options, as the strategy team sized them"
    kind: table
    ask: "Management has three ideas. Which should get the money?"
    columns: ["Option", "Key assumptions", "One-time cost"]
    rows:
      - ["Private label", "Share of sales from {{pl_now}} to {{pl_target}}; margin {{pl_margin}} versus {{nb_margin}} on national brands", "{{pl_invest}}"]
      - ["Home delivery", "{{deliv_orders}} orders a year at {{deliv_basket}}; {{deliv_gm}} margin; {{fulfil_cost}} fulfillment per order; {{cann_share}} of sales come from customers who now shop in store", "{{deliv_invest}}"]
      - ["More stores", "{{more_stores}} planned; {{store_capex}} each; {{ramp_margin}} profit margin at Year 3 sales, {{mature_margin}} at mature sales", "{{stores_invest}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Each option needs its own math. Delivery looks like {{naive_deliv}} a year
      until you remove the {{cann_sales}} of sales taken from the stores. Private label
      adds profit but no sales growth.
---

## Prompt

Our client, Maple & Main Markets, is a regional supermarket chain with 112 stores. Management is proud that sales are up about 8% over two years. The new CFO is not: she thinks the chain has stopped growing and is hiding it.

She asks us: **where is the growth really coming from, and where should Maple & Main invest to restart it?**

## Clarifying information

- Q: What is the goal: sales growth or profit growth?
  A: Both, but the board cares most about profit growth that lasts. Sales growth that destroys margin does not count.
- Q: How many stores are there, and how old?
  A: {{mature_stores}} are mature and {{new_stores}} opened in the last two years.
- Q: Is there an investment budget?
  A: About {{stores_invest}} over the next three years for any mix of options. Management has three ideas, shown in Exhibit 3.
- Q: What has inflation been?
  A: About {{inflation}} over the two years, in line with the sector.
- Q: Have competitors changed anything?
  A: A hard discounter opened near several stores, and two national chains now offer delivery in the region.

## Structure

> **Ask:** How would you approach this?

Split the question: **diagnose** where growth comes from, then **choose** investments.

- **1. Diagnose growth**
  - Sales = stores × transactions per store × average basket
  - Mature versus new stores
  - Basket: price inflation versus items per basket versus mix (private label, fresh)
  - Traffic: competitors, store condition, shopper trips lost to delivery or discounters
- **2. Evaluate options**
  - Private label: margin gain, shopper reaction, speed
  - Delivery: new sales versus sales taken from the stores, fulfillment cost
  - New stores: productivity versus mature stores, capital, payback
- **3. Risks and fit:** brand perception, operations, cash

Hypothesis: *"The headline growth probably comes from new stores and inflation. If transactions in mature stores are falling, that is the real problem."*

## Math walkthrough

> **Ask:** Decompose the growth, then compare the three options.

**1. Decompose growth.**
Mature-store sales: Year 1 = {{mature_stores}} × {{tx_y1}} × {{weeks}} × {{basket_y1}} = **{{ss_y1}}**; Year 3 = {{ss_y3}}, so same-store sales are **{{ss_growth}}**.
Transactions changed {{traffic_chg}}; the basket changed +{{basket_chg}}. After {{inflation}} inflation, items bought per store changed by {{units_chg}}.

| Source | Sales change |
|---|---|
| Fewer transactions | {{traffic_effect}} |
| Bigger basket | +{{basket_effect}} |
| New stores | +{{new_total}} |
| **Total** | **+{{growth_dollars}}** |

New stores are **{{new_share}}** of growth. Each sells {{new_vs_mature}} of a mature store's sales.

**2. Private label.**
Mix shift of 6 points of {{total_y3}} sales at a 9-point margin advantage: {{total_y3}} × ({{pl_target}} − {{pl_now}}) × ({{pl_margin}} − {{nb_margin}}) = **{{pl_gain}}** a year. Payback: {{pl_invest}} ÷ {{pl_gain}} = **{{pl_payback}}**. It adds profit but not sales.

**3. Delivery.**
Sales at scale: {{deliv_orders}} × {{deliv_basket}} = {{deliv_sales}}. A naive view gives {{deliv_sales}} × {{deliv_gm}} − {{fulfil_total}} = {{naive_deliv}}.
But {{cann_share}} of the sales ({{cann_sales}}) would have been bought in store anyway. Only {{incr_sales}} is new. Net profit: {{incr_sales}} × {{deliv_gm}} − {{fulfil_total}} = **{{deliv_net}}**, payback **{{deliv_payback}}**. Delivery adds {{deliv_growth}} to sales growth.

**4. New stores.**
Sales added: {{more_stores}} × {{new_store_sales}} = {{stores_sales}} ({{stores_growth}} growth). Profit at Year 3 levels: {{stores_sales}} × {{ramp_margin}} = {{stores_profit}} on {{stores_invest}} of capital, a payback of about **{{stores_payback}}**. Even at mature sales a store earns {{mature_profit}} on {{store_capex}}, a payback of {{mature_payback}}.

## Synthesis

> **Ask:** What would you tell the CFO?

**Maple & Main's {{total_growth}} growth is entirely from new stores. Mature stores are shrinking ({{ss_growth}}) because transactions per store are down {{traffic_chg}}. Invest first in private label, then in delivery sized on its net {{deliv_net}}, and pause new stores until existing ones win back traffic.**

1. **Diagnosis:** shoppers are making fewer trips and buying fewer items; inflation hides it in the basket.
2. **Private label first:** {{pl_gain}} a year for {{pl_invest}}, paid back in {{pl_payback}}, and it gives shoppers a reason to stay when a discounter opens nearby.
3. **Delivery second, but sized honestly:** {{deliv_net}} a year after cannibalization, payback {{deliv_payback}}; it defends against rivals already offering delivery.
4. **Hold new stores:** a payback of {{stores_payback}} at current ramp is too slow.

**Risks and next steps:** private label can hurt national-brand relationships and perceived quality, so test it in 15 stores; delivery adds operational complexity, so pilot in two regions; investigate why traffic is falling (store visits by cohort, discounter overlap) before committing to anything that adds sales rather than margin.

## Common mistakes

- Celebrating {{total_growth}} growth without splitting same-store from new-store sales.
- Reading the {{basket_chg}} larger basket as a win when inflation was {{inflation}}.
- Valuing delivery at {{naive_deliv}} a year and ignoring the {{cann_sales}} of sales taken from stores.
- Treating private label as a growth lever when it is a margin lever.
- Judging new stores by Year 3 sales without checking how long they take to catch up.

## What top candidates do differently

- Write the sales formula first (stores × transactions × basket) and ask which term changed.
- Ask for inflation before praising basket growth.
- Net out cannibalization on delivery without being prompted.
- End with sequencing: what to do now, what to pilot, and what to hold.

## Creative question

Mature-store transactions per store are down {{traffic_chg}}. Beyond the three options, how could Maple & Main win shoppers back into its stores?

## Model answer

Organize ideas by **why shoppers left**:

- **Price perception:** sharper prices on 200 items shoppers check most, a loyalty app with personalized offers, a discount banner for stores near hard discounters.
- **Experience:** cleaner and faster stores, more self-checkout, better fresh produce and bakery.
- **Reasons to visit:** prepared meals and a meal-kit section, local products, in-store pharmacy or coffee.
- **Convenience:** click-and-collect from existing stores, which keeps the trip in the building at lower cost than delivery.

A top candidate prioritizes: "Price perception and click-and-collect are fastest and cheapest, and they protect the mature stores that still produce {{ss_y3}} of sales."
