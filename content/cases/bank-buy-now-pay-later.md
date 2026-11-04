---
id: bank-buy-now-pay-later
title: "Pay in Four: Should a Bank Launch Buy Now, Pay Later?"
client: "Meridian Trust Bank (fictional), a large US consumer bank"
summary: "A bank wants to offer buy-now-pay-later at online retailers. Work out what it earns on each dollar of sales, the volume it needs to cover its platform cost, and whether the retailers it has lined up get it there."
industry: other
sub_industry: "Consumer lending"
type: market-entry
difficulty: beginner
format: candidate-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real bank or market data.
inputs:
  merchant_fee:  { value: 0.04,  unit: "%",  label: "Fee the retailer pays, share of the purchase" }
  funding:       { value: 0.0025, unit: "%", label: "Funding cost, share of the purchase", decimals: 2 }
  loss:          { value: 0.015, unit: "%",  label: "Credit losses, share of the purchase", decimals: 1 }
  processing:    { value: 0.0075, unit: "%", label: "Processing and customer service, share of the purchase", decimals: 2 }
  fixed:         { value: 15,    unit: "$M", label: "Platform cost per year (technology, risk models, team)" }
  sales_e:       { value: 10,    unit: "$B", label: "Online sales of interested electronics retailers" }
  sales_h:       { value: 10,    unit: "$B", label: "Online sales of interested home-goods retailers" }
  sales_f:       { value: 5,     unit: "$B", label: "Online sales of interested fashion retailers" }
  share_e:       { value: 0.04,  unit: "%",  label: "Share of electronics checkouts expected to use the bank's option" }
  share_h:       { value: 0.06,  unit: "%",  label: "Share of home-goods checkouts expected to use it" }
  share_f:       { value: 0.10,  unit: "%",  label: "Share of fashion checkouts expected to use it" }

calculations:
  - { id: contrib, label: "Contribution per dollar of sales", formula: "merchant_fee - funding - loss - processing", expected: 0.015, unit: "%", decimals: 1 }
  - { id: breakeven, label: "Sales volume needed to cover the platform cost", formula: "fixed / contrib / 1000", expected: 1.0, unit: "$B", decimals: 1 }
  - { id: volume, label: "Expected sales volume through the bank's option", formula: "sales_e * share_e + sales_h * share_h + sales_f * share_f", expected: 1.5, unit: "$B", decimals: 1 }
  - { id: profit, label: "Profit per year at the expected volume", formula: "volume * 1000 * contrib - fixed", expected: 7.5, unit: "$M", decimals: 1 }
  - { id: cushion, label: "Expected volume as a multiple of break-even", formula: "volume / breakeven", expected: 1.5, unit: "x", decimals: 1 }
  - { id: vol_drop, label: "Fall in volume the product can absorb before it stops covering its platform", formula: "1 - breakeven / volume", expected: 0.333, unit: "%", decimals: 0 }
  - { id: fixed_share, label: "Platform cost as a share of expected sales", formula: "fixed / (volume * 1000)", expected: 0.01, unit: "%" }
  - { id: max_loss, label: "Credit loss rate at which the product only breaks even", formula: "loss + contrib - fixed / (volume * 1000)", expected: 0.02, unit: "%", decimals: 1 }

answer:
  calc: profit
  headline: "Launch: each dollar of sales earns {{contrib}}, so the bank needs {{breakeven}} of sales a year to cover its platform; the retailers lined up should bring about {{volume}}, for a profit of about {{profit}}."

exhibits:
  - id: exhibit-1
    title: "What the bank earns and pays on a buy-now-pay-later purchase"
    kind: table
    ask: "Here are the economics of one purchase. What does the bank make on each dollar?"
    columns: ["Item", "Share of the purchase", "Comment"]
    rows:
      - ["Fee paid by the retailer", "{{merchant_fee}}", "Retailers pay because the option raises conversion and basket size"]
      - ["Funding cost", "{{funding}}", "The bank pays the retailer at once; the shopper pays a quarter at checkout and the rest over six weeks, so about half the price is outstanding on average"]
      - ["Credit losses", "{{loss}}", "Shoppers who never finish paying"]
      - ["Processing and customer service", "{{processing}}", "Collecting four payments, reminders, disputes, returns and shopper sign-up"]
    note: "Illustrative data created for this practice case. Shoppers pay no interest if they pay on time; ignore late fees."
    insight: |
      After funding, losses and processing, the bank keeps {{contrib}} of each
      purchase. Credit losses are the biggest cost and the one most likely to
      surprise.
  - id: exhibit-2
    title: "Online retailers that want to offer Meridian's option"
    kind: table
    ask: "These retailers have said they would offer Meridian's option at checkout. Is it enough?"
    columns: ["Retailer group", "Online sales per year", "Share of checkouts expected to use the option"]
    rows:
      - ["Electronics", "{{sales_e}}", "{{share_e}}"]
      - ["Home goods", "{{sales_h}}", "{{share_h}}"]
      - ["Fashion", "{{sales_f}}", "{{share_f}}"]
    note: "Illustrative data created for this practice case; usage shares are the retailers' estimates for Meridian's option in its second year, offered next to their current providers, based on what those providers achieve."
    insight: |
      The three groups would put about {{volume}} of sales through Meridian,
      {{cushion}} the volume it needs to break even.
---

## Prompt

Our client, Meridian Trust Bank, is a large US consumer bank with millions of checking-account and credit-card customers. Online shoppers increasingly split purchases into a few interest-free installments using **buy now, pay later** (BNPL), and the market is led by fintech companies.

Meridian is considering launching its own BNPL option at the checkout of online retailers: the shopper pays a quarter of the price at purchase and the rest in three payments over six weeks. The head of consumer lending asks us: **should Meridian enter this market?**

## Clarifying information

- Q: How does the bank make money if shoppers pay no interest?
  A: The **retailer** pays a fee on each purchase, because offering BNPL raises the share of shoppers who complete a purchase and the amount they spend.
- Q: What does it cost to run the product?
  A: Per purchase: funding the purchase until the shopper repays, credit losses and processing. On top of that, the platform (technology, risk models and a dedicated team) costs about **{{fixed}}** a year whatever the volume.
- Q: What is the objective?
  A: The product must at least cover its platform cost at the volume the bank can realistically win in its second year.
- Q: Does Meridian have any advantage over the fintechs?
  A: It funds itself with customer deposits, which are cheaper than the money fintechs borrow, and it already knows the credit history of many shoppers.
- Q: Are there regulatory issues?
  A: BNPL is consumer lending, so expect affordability checks, clear disclosures and dispute rights. Assume Meridian's existing compliance teams can handle them.

## Structure

> **Ask:** How would you structure the decision?

- **1. Unit economics:** what Meridian keeps on each dollar of sales
  - Retailer fee − funding cost − credit losses − processing
- **2. Break-even:** sales volume needed to cover the fixed platform cost
- **3. Can Meridian win that volume?**
  - Retailers willing to offer the option and their online sales
  - Share of checkouts that will choose it
- **4. Risks and fit:** credit quality, competition from established BNPL providers, cannibalization of Meridian's credit cards, brand

## Math walkthrough

> **Ask:** What does Meridian earn on each dollar of sales, how much volume does it need, and do the retailers in Exhibit 2 get it there?

**1. Unit economics (Exhibit 1).**
Contribution = 4% − 0.25% − 1.5% − 0.75% = **{{contrib}}** of each purchase, or $1.50 on a $100 purchase.

**2. Break-even.**
$15M ÷ 1.5% = **{{breakeven}}** of sales a year.

**3. Expected volume (Exhibit 2).**
$10B × 4% + $10B × 6% + $5B × 10% = $0.4B + $0.6B + $0.5B = **{{volume}}**, which is {{cushion}} break-even.

**4. Profit.**
$1.5B × 1.5% − $15M = **{{profit}}** a year.

**5. How much room is there on credit losses?**
At {{volume}}, the platform cost is {{fixed_share}} of sales, so the product breaks even if credit losses rise from {{loss}} to **{{max_loss}}**. That is the number to watch.

## Synthesis

> **Ask:** What is your recommendation?

**Meridian should launch its BNPL option. It keeps {{contrib}} of every purchase, needs {{breakeven}} of sales a year to cover the platform, and the retailers lined up should bring about {{volume}}, for a profit of about {{profit}} a year.**

1. **The unit economics work:** the retailer fee of {{merchant_fee}} more than covers funding, credit losses and processing, but cheap deposit funding is a smaller edge than it sounds: on a six-week loan, funding costs only {{funding}}. Meridian's bigger edge is knowing many shoppers' credit history, which goes straight at the largest cost, credit losses.
2. **The volume is there, with some cushion:** expected sales are {{cushion}} break-even, so volume can fall by {{vol_drop}} before the product stops covering its platform.
3. **Credit losses are the main risk:** if they rise from {{loss}} to {{max_loss}}, the profit disappears.

**Risks and next steps:** the profit is modest, so the case also rests on strategy, since BNPL brings in younger customers who may later open accounts or cards. Check how much BNPL volume would come from Meridian's own credit-card customers, which could replace card spend that already earns Meridian interchange and interest. Launch with the retailers already lined up, use Meridian's own customer data to approve shoppers, and set a credit-loss limit that triggers a review well before {{max_loss}}.

## Common mistakes

- Treating the {{merchant_fee}} retailer fee as profit and forgetting funding, losses and processing.
- Dividing the platform cost by the retailer fee instead of the contribution, which understates the break-even volume.
- Adding up retailers' total online sales instead of the share of checkouts that will use the option.
- Ignoring that credit losses can move quickly, especially with new customers.

## What top candidates do differently

- Express everything per dollar of sales first, which makes the break-even one division.
- Turn the main risk into a number: the loss rate at which the product breaks even.
- Ask about cannibalization of Meridian's own credit cards.
- Size the funding advantage before leaning on it: on a six-week loan it is worth little, while better credit data cuts the largest cost.
- Link the decision to the bank's wider strategy of reaching younger customers.

## Creative question

How could Meridian win retailers away from the established BNPL providers?

## Model answer

Organize the ideas around **price, sales lift and simplicity** for the retailer:

- **Price:** a lower fee than fintechs, which lower credit losses on shoppers Meridian already knows can support; volume discounts for large retailers.
- **Sales lift:** pre-approved spending limits shown to Meridian's millions of customers before they shop; marketing to those customers on the retailer's behalf.
- **Simplicity:** one contract covering card acceptance and BNPL; fast payout to the retailer; easy handling of returns.

A top candidate prioritizes: "Pre-approved limits for Meridian's own customers are the strongest offer, because no fintech can bring a retailer millions of shoppers who are already approved before they reach the checkout."
