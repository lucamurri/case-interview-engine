---
id: specialty-chemical-price-increase
title: "Passing It On: A Specialty Chemical Maker Facing Higher Input Costs"
client: "Kessler Polymer Additives (fictional), a US maker of additives for paints and coatings"
summary: "Raw-material costs jumped and margins shrank. A chemicals maker wants to raise its price but fears losing customers. How much volume can it lose and still come out ahead?"
industry: industrials
sub_industry: "Chemicals"
type: pricing
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  price:       { value: 10, unit: "$/kg",       label: "Current selling price" }
  vc_old:      { value: 6,  unit: "$/kg",       label: "Variable cost per kg last year (raw materials, energy, freight)" }
  vc_new:      { value: 7,  unit: "$/kg",       label: "Variable cost per kg today" }
  volume:      { value: 20, unit: "million kg", label: "Annual sales volume" }
  p_new:       { value: 11, unit: "$/kg",       label: "Proposed new price" }
  share_paint: { value: 0.50, unit: "%",        label: "Share of volume sold to large paint makers" }
  share_spec:  { value: 0.50, unit: "%",        label: "Share of volume sold to specialty coating makers" }
  loss_paint:  { value: 0.15, unit: "%",        label: "Expected volume loss at the new price, large paint makers" }
  loss_spec:   { value: 0.05, unit: "%",        label: "Expected volume loss at the new price, specialty coating makers" }

calculations:
  - { id: profit_old, label: "Contribution last year", formula: "(price - vc_old) * volume", expected: 80, unit: "$M" }
  - { id: cm_now, label: "Contribution per kg today, at the current price", formula: "price - vc_new", expected: 3, unit: "$/kg" }
  - { id: profit_now, label: "Contribution today, at the current price", formula: "(price - vc_new) * volume", expected: 60, unit: "$M" }
  - { id: profit_hit, label: "Contribution lost to higher input costs", formula: "profit_old - profit_now", expected: 20, unit: "$M" }
  - { id: cm_new, label: "Contribution per kg at the new price", formula: "p_new - vc_new", expected: 4, unit: "$/kg" }
  - { id: be_loss, label: "Volume Kessler can lose at the new price and keep contribution flat", formula: "(p_new - price) / (p_new - vc_new)", expected: 0.25, unit: "%" }
  - { id: be_volume, label: "Volume at which the new price breaks even", formula: "volume * (1 - be_loss)", expected: 15, unit: "million kg" }
  - { id: exp_loss, label: "Expected volume loss across all customers", formula: "share_paint * loss_paint + share_spec * loss_spec", expected: 0.10, unit: "%" }
  - { id: vol_after, label: "Expected volume at the new price", formula: "volume * (1 - exp_loss)", expected: 18, unit: "million kg" }
  - { id: profit_after, label: "Expected contribution at the new price", formula: "cm_new * vol_after", expected: 72, unit: "$M" }
  - { id: profit_gain, label: "Gain versus keeping today's price", formula: "profit_after - profit_now", expected: 12, unit: "$M" }

answer:
  calc: profit_gain
  headline: "Raise the price to {{p_new}}: Kessler could lose up to {{be_loss}} of its volume and still break even, it expects to lose about {{exp_loss}}, and contribution rises by about {{profit_gain}}."

exhibits:
  - id: exhibit-1
    title: "Kessler unit economics"
    kind: table
    ask: "Here are Kessler's numbers. What happened to profit?"
    columns: ["", "Last year", "Today"]
    rows:
      - ["Price", "{{price}}", "{{price}}"]
      - ["Variable cost", "{{vc_old}}", "{{vc_new}}"]
      - ["Annual volume", "{{volume}}", "{{volume}}"]
    note: "Illustrative data created for this practice case. Kessler is fictional. Fixed costs are unchanged and left out."
    insight: |
      A {{vc_new}} cost against a {{price}} price leaves only {{cm_now}}. Input
      costs alone took {{profit_hit}} of contribution, a quarter of last year's.
  - id: exhibit-2
    title: "Expected volume loss at a price of {{p_new}}, by customer group"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Sales asked customers how they would react to {{p_new}}. Should Kessler go ahead?"
    data:
      - { label: "Large paint makers", value: loss_paint }
      - { label: "Specialty coating makers", value: loss_spec }
    note: "Illustrative data created for this practice case. Each group buys {{share_paint}} of Kessler's volume. Estimates come from sales-team interviews."
    insight: |
      Both groups expect to cut far less than the {{be_loss}} break-even
      volume loss. Specialty coating makers barely react, because the additive is a small part of
      their cost and switching means re-testing their products.
---

## Prompt

Our client, Kessler Polymer Additives, makes a specialty additive that helps paints and coatings spread evenly and resist cracking. It sells about {{volume}} a year to paint and coating makers across North America.

Over the past year the cost of its main raw materials and energy has risen sharply, and Kessler's profit has fallen. The commercial director wants to raise the price from {{price}} to {{p_new}}, but the sales team fears that customers will move to competitors. The CEO asks us: **should Kessler raise its price, and how much volume can it afford to lose?**

## Clarifying information

- Q: What is the objective?
  A: Protect profit. The CEO would accept selling less if profit holds up.
- Q: Did competitors face the same cost increase?
  A: Mostly yes: they use similar raw materials. Two competitors have announced price increases of a similar size.
- Q: Are fixed costs changing?
  A: No. Plants and staff stay the same, so we can focus on contribution (price minus variable cost, times volume).
- Q: How easily can customers switch?
  A: Large paint makers qualify two or three suppliers and can move volume quickly. Specialty coating makers need months of testing to change an additive, and the additive is a small part of their product cost.

## Structure

> **Ask:** How would you approach the decision?

Treat it as a **break-even** question: how much volume can Kessler lose before the higher price stops paying off?

- **1. What happened to profit?**
  - Price, variable cost and volume, last year versus today
- **2. The break-even volume loss**
  - Extra money per kg kept ÷ contribution per kg at the new price
- **3. How will customers react?**
  - By customer group: how easily they can switch, how much the additive matters to their cost
  - What competitors are doing
- **4. Decide and plan the rollout**

## Math walkthrough

> **Ask:** First, how much profit did higher input costs take? Then, if Kessler raises its price to {{p_new}}, how much volume can it lose and still earn today's profit? Finally, use Exhibit 2 to decide.

**1. The cost hit (Exhibit 1).**
Last year: ($10 − $6) × 20M kg = **{{profit_old}}**. Today: ($10 − $7) × 20M kg = **{{profit_now}}**. Input costs took **{{profit_hit}}**.

**2. Break-even volume loss.**
At {{p_new}}, contribution rises to $11 − $7 = **{{cm_new}}**. The price rise adds $1 per kg, so:

Break-even volume loss = Price increase ÷ New contribution per kg = $1 ÷ $4 = **{{be_loss}}**.

Kessler could fall from 20M kg to **{{be_volume}}** and still earn {{profit_now}}.

**3. Expected reaction (Exhibit 2).**
Expected loss = 50% × 15% + 50% × 5% = **{{exp_loss}}**, well under {{be_loss}}.
Volume falls to {{vol_after}}, and contribution = $4 × 18M kg = **{{profit_after}}**, a gain of **{{profit_gain}}** over keeping the price at {{price}}.

## Synthesis

> **Ask:** What do you recommend to the CEO?

**Kessler should raise its price to {{p_new}}. It could lose up to {{be_loss}} of its volume and still break even; customers suggest it will lose about {{exp_loss}}, which raises contribution from {{profit_now}} to about {{profit_after}}.**

1. **Higher input costs took {{profit_hit}} of contribution,** a quarter of last year's level.
2. **The cushion is wide:** with {{cm_new}} of contribution, Kessler can lose a quarter of its volume before the increase backfires.
3. **Customers are less price-sensitive than sales fears:** even the large paint makers expect to cut only {{loss_paint}}, and competitors are raising prices too.

**Risks and next steps:** the increase does not fully restore last year's {{profit_old}}, so keep working on costs (energy contracts, freight) as well. Large paint makers are the risk: give them notice, consider a smaller or phased increase tied to an index of raw-material prices, and protect the most valuable accounts. Track lost volume by customer every month for the first quarter.

## Common mistakes

- Dividing the price increase by today's contribution ({{cm_now}}) or by the new price ({{p_new}}) instead of the new contribution ({{cm_new}}).
- Assuming any volume loss is bad. A price rise can lose customers and still make more money.
- Using one average reaction for all customers, without asking which customers can switch easily.
- Forgetting to check what competitors are doing, which drives how many customers actually leave.

## What top candidates do differently

- Turn the question into a single break-even number ({{be_loss}}) before looking at customer data.
- Ask who faces the same cost increase: if competitors do too, customers have nowhere cheaper to go.
- Suggest a price linked to raw-material costs, so future cost swings are passed on automatically.

## Creative question

Besides raising the list price, how could Kessler recover the higher input costs?

## Model answer

Group ideas into price, product and cost:

- **Price:** a temporary raw-material surcharge that falls when costs fall; contracts with prices linked to an index of input costs; smaller discounts for small orders.
- **Product:** a more concentrated version that customers use less of per gallon of paint, priced on value; charging extra for fast delivery or custom grades.
- **Cost:** longer-term raw-material contracts; reformulating with cheaper inputs; shipping full truckloads instead of partial loads.

A top candidate prioritizes: "Index-linked pricing is the most valuable, because it fixes the problem for next time, not just this time, and customers often accept it as fair."
