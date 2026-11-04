---
id: fast-casual-delivery-margins
title: "Delivered, at a Cost: Why a Fast-Casual Chain Earns Less as It Sells More"
client: "Greenfold Kitchen (fictional), a US fast-casual chain selling salads and grain bowls"
summary: "A fast-casual chain's sales are up 20% thanks to delivery apps, but profit is down. Work out what each order really earns by channel, then fix the delivery economics."
industry: consumer-retail
sub_industry: "Restaurants"
type: profitability
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  ticket:        { value: 20,   unit: "$",             label: "Average order value (same menu prices in every channel)" }
  food_pct:      { value: 0.30, unit: "%",             label: "Food cost as a share of the order value" }
  pack_store:    { value: 1,    unit: "$",             label: "Packaging and variable labor per in-store order" }
  pack_deliv:    { value: 3,    unit: "$",             label: "Packaging and variable labor per delivery order (sealed containers, bags, handoff)" }
  commission:    { value: 0.25, unit: "%",             label: "Delivery-app commission on the order value" }
  orders_y1:     { value: 10,   unit: "million", label: "Orders, last year" }
  orders_y2:     { value: 12,   unit: "million", label: "Orders, this year" }
  deliv_share_y1: { value: 0.10, unit: "%",            label: "Delivery share of orders, last year" }
  deliv_share_y2: { value: 0.50, unit: "%",            label: "Delivery share of orders, this year" }
  fixed:         { value: 93,   unit: "$M",            label: "Fixed costs: rent, salaried staff, head office (both years)" }
  price_up:      { value: 2,    unit: "$",             label: "Proposed increase in delivery-app menu prices per order" }
  own_cost:      { value: 2,    unit: "$",             label: "Platform and card-payment cost per order through Greenfold's own app (the customer pays a delivery fee that covers the courier)" }
  app_cost:      { value: 2,    unit: "$M",            label: "Annual cost to run Greenfold's own ordering app" }
  app_shift:     { value: 2,    unit: "million", label: "Delivery orders expected to move to Greenfold's own app" }

calculations:
  # --- Contribution per order ---
  - { id: food, label: "Food cost per order", formula: "ticket * food_pct", expected: 6, unit: "$" }
  - { id: fee, label: "App commission per delivery order", formula: "ticket * commission", expected: 5, unit: "$" }
  - { id: cm_store, label: "Contribution per in-store order", formula: "ticket - food - pack_store", expected: 13, unit: "$" }
  - { id: cm_deliv, label: "Contribution per delivery order", formula: "ticket - food - pack_deliv - fee", expected: 6, unit: "$" }
  # --- Two years ---
  - { id: deliv_y1, label: "Delivery orders, last year", formula: "orders_y1 * deliv_share_y1", expected: 1, unit: "million" }
  - { id: store_y1, label: "In-store orders, last year", formula: "orders_y1 - deliv_y1", expected: 9, unit: "million" }
  - { id: deliv_y2, label: "Delivery orders, this year", formula: "orders_y2 * deliv_share_y2", expected: 6, unit: "million" }
  - { id: store_y2, label: "In-store orders, this year", formula: "orders_y2 - deliv_y2", expected: 6, unit: "million" }
  - { id: rev_y1, label: "Revenue, last year", formula: "orders_y1 * ticket", expected: 200, unit: "$M" }
  - { id: rev_y2, label: "Revenue, this year", formula: "orders_y2 * ticket", expected: 240, unit: "$M" }
  - { id: rev_growth, label: "Revenue growth", formula: "rev_y2 / rev_y1 - 1", expected: 0.20, unit: "%" }
  - { id: profit_y1, label: "Operating profit, last year", formula: "store_y1 * cm_store + deliv_y1 * cm_deliv - fixed", expected: 30, unit: "$M" }
  - { id: profit_y2, label: "Operating profit, this year", formula: "store_y2 * cm_store + deliv_y2 * cm_deliv - fixed", expected: 21, unit: "$M" }
  - { id: profit_drop, label: "Fall in operating profit", formula: "profit_y1 - profit_y2", expected: 9, unit: "$M" }
  # --- Bridge ---
  - { id: shifted, label: "In-store orders that moved to delivery", formula: "store_y1 - store_y2", expected: 3, unit: "million" }
  - { id: new_orders, label: "Truly new orders", formula: "orders_y2 - orders_y1", expected: 2, unit: "million" }
  - { id: new_effect, label: "Profit from new delivery orders", formula: "new_orders * cm_deliv", expected: 12, unit: "$M" }
  - { id: shift_effect, label: "Profit lost from orders moving from in-store to delivery", formula: "shifted * (cm_deliv - cm_store)", expected: -21, unit: "$M" }
  - { id: shift_loss, label: "Profit lost from the channel shift (as a positive number)", formula: "abs(shift_effect)", expected: 21, unit: "$M" }
  - { id: bridge_total, label: "Bridge total (must equal the profit change)", formula: "new_effect + shift_effect", expected: -9, unit: "$M" }
  # --- Fix 1: delivery menu prices ---
  - { id: gain_per_order, label: "Extra contribution per delivery order after the price increase", formula: "price_up * (1 - commission)", expected: 1.5, unit: "$", decimals: 2 }
  - { id: cm_deliv_new, label: "Contribution per delivery order at the higher price", formula: "cm_deliv + gain_per_order", expected: 7.5, unit: "$", decimals: 2 }
  - { id: price_gain, label: "Extra profit if delivery orders hold", formula: "deliv_y2 * gain_per_order", expected: 9, unit: "$M" }
  - { id: be_loss, label: "Delivery orders Greenfold can lose and still break even on the price increase", formula: "gain_per_order / cm_deliv_new", expected: 0.20, unit: "%" }
  - { id: profit_fix1, label: "Operating profit with higher delivery prices (orders hold)", formula: "profit_y2 + price_gain", expected: 30, unit: "$M" }
  # --- Fix 2: own app ---
  - { id: cm_own, label: "Contribution per order through Greenfold's own app", formula: "ticket - food - pack_deliv - own_cost", expected: 9, unit: "$" }
  - { id: app_gain, label: "Net profit from moving orders to the own app, at today's delivery-app prices", formula: "app_shift * (cm_own - cm_deliv) - app_cost", expected: 4, unit: "$M" }
  # --- Both fixes together ---
  - { id: deliv_left, label: "Orders left on the delivery apps after the own app launches", formula: "deliv_y2 - app_shift", expected: 4, unit: "million" }
  - { id: app_extra, label: "Extra profit from the own app on top of the price increase", formula: "app_shift * (cm_own - cm_deliv_new) - app_cost", expected: 1, unit: "$M" }
  - { id: combined_gain, label: "Extra profit from both fixes together", formula: "deliv_left * gain_per_order + app_shift * (cm_own - cm_deliv) - app_cost", expected: 10, unit: "$M" }
  - { id: profit_fix2, label: "Operating profit with both fixes (orders hold)", formula: "profit_y2 + combined_gain", expected: 31, unit: "$M" }

answer:
  calc: price_gain
  headline: "Profit fell {{profit_drop}} because a delivery order earns {{cm_deliv}} against {{cm_store}} in store; raising delivery-app prices by {{price_up}} adds about {{price_gain}}, and an own app adds only about {{app_extra}} on top, {{combined_gain}} for both together."

exhibits:
  - id: exhibit-1
    title: "Greenfold Kitchen results, last year and this year"
    kind: table
    ask: "Here are this year's results. What's going on?"
    columns: ["", "Last year", "This year"]
    rows:
      - ["Orders", "{{orders_y1}}", "{{orders_y2}}"]
      - ["Delivery share of orders", "{{deliv_share_y1}}", "{{deliv_share_y2}}"]
      - ["Average order value", "{{ticket}}", "{{ticket}}"]
      - ["Revenue", "{{rev_y1}}", "{{rev_y2}}"]
      - ["Fixed costs", "{{fixed}}", "{{fixed}}"]
      - ["Operating profit", "{{profit_y1}}", "{{profit_y2}}"]
    note: "Illustrative data created for this practice case. Greenfold Kitchen is fictional. Revenue is what the customer pays for the food; the app's commission is a cost."
    insight: |
      Revenue grew {{rev_growth}} but profit fell {{profit_drop}}. Prices
      and fixed costs did not change, so the cause must be the mix:
      delivery went from {{deliv_share_y1}} to {{deliv_share_y2}} of orders.
  - id: exhibit-2
    title: "Cost per order by channel"
    kind: table
    ask: "Here is what an order costs in each channel. How much does each one earn?"
    columns: ["", "In store", "Delivery app"]
    rows:
      - ["Order value", "{{ticket}}", "{{ticket}}"]
      - ["Food cost", "{{food}}", "{{food}}"]
      - ["Packaging and variable labor", "{{pack_store}}", "{{pack_deliv}}"]
      - ["App commission", "—", "{{fee}}"]
    note: "Illustrative data created for this practice case. Delivery-app commission: {{commission}} of the order value."
    insight: |
      A delivery order earns {{cm_deliv}}, less than half of the
      {{cm_store}} an in-store order earns. Every customer who switches from
      the counter to the app costs Greenfold money.
---

## Prompt

Our client, Greenfold Kitchen, runs about 150 fast-casual restaurants in the US selling salads and grain bowls. Two years ago it joined the big delivery apps, and delivery has taken off.

This year sales grew strongly and the board was pleased, until the year-end results showed that operating profit had fallen. The CEO asks us: **why is profit down when sales are up, and what should Greenfold do?**

## Clarifying information

- Q: Have menu prices changed?
  A: No. Prices are the same in store and on the apps, and have not changed in two years.
- Q: Have costs changed?
  A: Food costs are stable at {{food_pct}} of the order value, and fixed costs are flat at {{fixed}}.
- Q: How do the apps charge?
  A: A commission of {{commission}} of the order value, on every order.
- Q: Are delivery orders new customers?
  A: Some are. Restaurant traffic fell, so many delivery orders come from customers who used to walk in.
- Q: Does Greenfold have its own app?
  A: No, only a basic website for pickup orders.

## Structure

> **Ask:** How would you structure the problem?

Break profit down by **channel**, because an in-store order and a delivery order have very different costs:

- **Profit = Σ (Orders × Contribution per order) by channel − Fixed costs**
  - **In store:** order value − food − packaging and labor
  - **Delivery app:** order value − food − packaging and labor − app commission
- **Volume and mix**
  - New orders versus orders that moved from in store to delivery
- **Fixed costs:** rent, salaried staff, head office

Hypothesis: *"If revenue is up and profit is down with stable prices, the mix probably shifted to a lower-margin channel. Delivery apps take a large commission, so I'd check what a delivery order really earns."*

## Math walkthrough

> **Ask:** First, how much does an order earn in each channel? Then explain the fall in profit. Finally, how much would raising delivery-app menu prices by {{price_up}} per order help?

**1. Contribution per order (Exhibit 2).**
Food = 30% × $20 = {{food}}; app commission = 25% × $20 = {{fee}}.
- In store: $20 − $6 − $1 = **{{cm_store}}**
- Delivery: $20 − $6 − $3 − $5 = **{{cm_deliv}}**

**2. Profit by year (Exhibit 1).**
Last year: {{store_y1}} orders in store and {{deliv_y1}} delivery orders. Profit = 9M × $13 + 1M × $6 − $93M = **{{profit_y1}}**.
This year: {{store_y2}} orders in store and {{deliv_y2}} delivery orders. Profit = 6M × $13 + 6M × $6 − $93M = **{{profit_y2}}**.
Revenue grew {{rev_growth}}, from {{rev_y1}} to {{rev_y2}}, but profit fell **{{profit_drop}}**.

**3. Bridge.**

| Driver | Calculation | Impact |
|---|---|---|
| New orders (all delivery) | 2M × $6 | +{{new_effect}} |
| Orders moved from in store to delivery | 3M × ($6 − $13) | {{shift_effect}} |
| **Total** | | **{{bridge_total}}** |

Delivery brought {{new_orders}} new orders, but it also moved {{shifted}} orders from existing customers to a channel that earns {{cm_deliv}} instead of {{cm_store}}.

**4. Raise delivery-app prices by {{price_up}}.**
The app takes 25% of the extra $2 too, so Greenfold keeps $2 × 75% = **{{gain_per_order}}** per order, and a delivery order now earns {{cm_deliv_new}}.
If delivery orders hold: 6M × $1.50 = **{{price_gain}}**, bringing profit back to {{profit_fix1}}.
Break-even: Greenfold could lose $1.50 ÷ $7.50 = **{{be_loss}}** of delivery orders before the increase stops paying.

> **Ask:** The team is also considering its own ordering app. Customers would pay a delivery fee that covers the courier, so Greenfold's cost is {{own_cost}} per order for the platform and card payments, plus {{app_cost}} a year to run the app. If {{app_shift}} delivery orders move to it, is it worth it, on top of the price increase?

**5. Own app.** An own-app order earns $20 − $6 − $3 − $2 = **{{cm_own}}** (the courier is paid from the customer's delivery fee).
- Against today's delivery order: 2M × ($9 − $6) − $2M = {{app_gain}} a year.
- But after the price increase a delivery-app order already earns {{cm_deliv_new}}, so the app adds only 2M × ($9 − $7.50) − $2M = **{{app_extra}}** on top.
- Both fixes together: {{deliv_left}} orders stay on the apps and {{app_shift}} move to the own app, so 4M × $1.50 + 2M × ($9 − $6) − $2M = **{{combined_gain}}**, bringing profit to {{profit_fix2}}. Adding the two answers ({{price_gain}} + {{app_gain}}) would count the same 2M orders twice.

## Synthesis

> **Ask:** What do you tell the CEO?

**Greenfold's profit fell {{profit_drop}} because delivery grew to {{deliv_share_y2}} of orders and a delivery order earns only {{cm_deliv}}, against {{cm_store}} in store. Raising delivery-app menu prices by {{price_up}} would add about {{price_gain}} and restore last year's profit; an own ordering app adds only about {{app_extra}} on top ({{combined_gain}} for both), so its case rests on customer data and less dependence on the apps, not on profit.**

1. **Sales growth hid a costly mix shift:** {{shifted}} orders moved from the counter to the apps, costing {{shift_loss}}, more than the {{new_effect}} earned from new orders.
2. **Delivery prices are the fastest fix:** a {{price_up}} increase keeps {{gain_per_order}} per order and pays off unless delivery orders fall by more than {{be_loss}}.
3. **An own app is a strategic choice, not a profit fix:** after the price increase it adds only about {{app_extra}} a year, but it gives Greenfold its customers' data and makes it less exposed if the apps raise their commission.

**Risks and next steps:** app customers may be more price-sensitive than expected, so test the higher delivery prices in a few cities first; apps may penalize higher prices in their search rankings. Promote the own app with in-store offers and loyalty points, and check that the courier service is reliable before pushing customers to it.

## Common mistakes

- Treating revenue growth as good news without checking profit per order by channel.
- Forgetting that the app's commission also applies to any price increase, so Greenfold keeps only {{gain_per_order}} of a {{price_up}} increase.
- Assuming every delivery order is new. Many came from customers who used to eat in or pick up.
- Adding the two fixes ({{price_gain}} + {{app_gain}}) instead of {{combined_gain}}: the orders that move to the own app no longer get the price-increase gain.
- Recommending leaving the apps entirely, which would also lose the {{new_orders}} truly new orders.

## What top candidates do differently

- Ask for profit per order by channel as soon as they hear "revenue up, profit down, prices flat".
- Split the delivery growth into new orders and orders that switched channel.
- Express the price fix as a break-even loss of delivery orders ({{be_loss}}), which gives the CEO a clear test.
- Sequence the fixes: a quick price change now, and an own app over the next year for customer data and less dependence on the apps, not for profit.

## Creative question

How could Greenfold get more customers to order through its own app, or pick up in store, instead of using the delivery apps?

## Model answer

Group ideas around why customers use the apps today: habit, convenience and price.

- **Habit:** a loyalty program that only works through the Greenfold app; a free bowl after a customer's first own-app order.
- **Convenience:** fast reorder of a favorite bowl; pickup shelves near the door so customers skip the line; reliable delivery times on the own app.
- **Price:** own-app prices that are lower than on the delivery apps; free delivery above a minimum order on the own app.
- **In store:** QR codes on bags and receipts linking to the app; staff asking pickup customers to download it.

A top candidate prioritizes: "Loyalty points only in the own app are the strongest lever, because regular customers are the ones who order most often, and moving just them shifts most of the volume."
