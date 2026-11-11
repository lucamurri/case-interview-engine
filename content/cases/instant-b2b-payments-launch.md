---
id: instant-b2b-payments-launch
title: "Money in Seconds: Launching Instant Business Payments"
client: "Tessera Payments (fictional), a US business-payments company with ACH and virtual card products"
summary: "A payments company plans to launch instant, around-the-clock business payments. Set the price against card and ACH, handle irrevocable-payment fraud, and find the volume needed to break even once the product takes volume from its own card business."
industry: financial-services
sub_industry: "Payments / fintech"
type: product-launch
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative: realistic in shape, not real company data.
inputs:
  avg_txn:        { value: 8000,  unit: "$", label: "Average B2B payment" }
  card_fee:       { value: 260,   unit: "bps", label: "Typical supplier fee for accepting a business card payment" }
  ach_fee:        { value: 0.30,  unit: "$", decimals: 2, label: "Typical fee per ACH payment" }
  take_bps:       { value: 45,    unit: "bps", label: "Proposed Tessera take rate on instant payments" }
  var_txn:        { value: 0.90,  unit: "$", decimals: 2, label: "Processing cost per instant payment" }
  fraud_bps:      { value: 8,     unit: "bps", label: "Expected fraud loss on instant volume (base case)" }
  fraud_hi_bps:   { value: 14,    unit: "bps", label: "Fraud loss if controls are weak (stress case)" }
  fixed:          { value: 30,    unit: "$M", label: "Annual fixed cost of the product (platform, compliance, team)" }
  volume:         { value: 12000, unit: "$M", label: "Instant payment volume in year three (forecast)" }
  migr_share:     { value: 0.10,  unit: "%", label: "Share of that volume that moves over from Tessera's virtual card product" }
  card_take_bps:  { value: 150,   unit: "bps", label: "Net revenue Tessera earns on virtual card volume" }
  card_cost_bps:  { value: 30,    unit: "bps", label: "Tessera's cost and fraud loss on virtual card volume" }
  take_hi_bps:    { value: 50,    unit: "bps", label: "Alternative take rate under test" }
  volume_hi:      { value: 11000, unit: "$M", label: "Year-three volume if the take rate is the alternative one" }

calculations:
  # --- Price against card and ACH, per payment ---
  - { id: card_fee_txn, label: "Supplier cost of a card payment", formula: "avg_txn * card_fee / 10000", expected: 208, unit: "$" }
  - { id: instant_fee_txn, label: "Supplier cost of an instant payment", formula: "avg_txn * take_bps / 10000", expected: 36, unit: "$" }
  - { id: ach_bps, label: "ACH fee as a rate of the payment", formula: "ach_fee / avg_txn * 10000", expected: 0.375, unit: "bps", decimals: 2 }
  - { id: instant_vs_card, label: "Supplier saving versus card, per payment", formula: "card_fee_txn - instant_fee_txn", expected: 172, unit: "$" }
  # --- Unit economics ---
  - { id: var_bps, label: "Processing cost as a rate", formula: "var_txn / avg_txn * 10000", expected: 1.125, unit: "bps", decimals: 1 }
  - { id: contrib_bps, label: "Contribution per dollar of volume", formula: "take_bps - fraud_bps - var_bps", expected: 35.875, unit: "bps", decimals: 1 }
  - { id: contrib_txn, label: "Contribution per payment", formula: "avg_txn * contrib_bps / 10000", expected: 28.7, unit: "$", decimals: 2 }
  - { id: fraud_loss, label: "Fraud losses in year three (base case)", formula: "volume * fraud_bps / 10000", expected: 9.6, unit: "$M", decimals: 1 }
  # --- Break-even ---
  - { id: be_volume, label: "Break-even volume (base case)", formula: "fixed / (contrib_bps / 10000)", expected: 8362.4, unit: "$M", decimals: 0 }
  - { id: be_txns, label: "Break-even payments (base case)", formula: "be_volume / avg_txn", expected: 1.0453, unit: "million", decimals: 2 }
  # --- Year three profit ---
  - { id: gross_contrib, label: "Contribution at forecast volume", formula: "volume * contrib_bps / 10000", expected: 43.05, unit: "$M", decimals: 1 }
  - { id: profit_before, label: "Profit before cannibalization", formula: "gross_contrib - fixed", expected: 13.05, unit: "$M", decimals: 1 }
  - { id: migr_vol, label: "Volume moving from the card product", formula: "volume * migr_share", expected: 1200, unit: "$M" }
  - { id: card_contrib_bps, label: "Card contribution per dollar", formula: "card_take_bps - card_cost_bps", expected: 120, unit: "bps" }
  - { id: lost_card, label: "Card profit lost to migration", formula: "migr_vol * card_contrib_bps / 10000", expected: 14.4, unit: "$M", decimals: 1 }
  - { id: profit_net, label: "Net profit after cannibalization", formula: "profit_before - lost_card", expected: -1.35, unit: "$M", decimals: 2 }
  # --- Stress and price tests ---
  - { id: contrib_hi_fraud, label: "Contribution per dollar with weak fraud controls", formula: "take_bps - fraud_hi_bps - var_bps", expected: 29.875, unit: "bps", decimals: 1 }
  - { id: profit_hi_fraud, label: "Net profit with weak fraud controls", formula: "volume * contrib_hi_fraud / 10000 - fixed - lost_card", expected: -8.55, unit: "$M", decimals: 2 }
  - { id: be_hi_fraud, label: "Break-even volume with weak fraud controls", formula: "fixed / (contrib_hi_fraud / 10000)", expected: 10041.8, unit: "$M", decimals: 0 }
  - { id: contrib_hi_take, label: "Contribution per dollar at the alternative take rate", formula: "take_hi_bps - fraud_bps - var_bps", expected: 40.875, unit: "bps", decimals: 1 }
  - { id: migr_vol_hi, label: "Volume moving from cards at the alternative take rate", formula: "volume_hi * migr_share", expected: 1100, unit: "$M" }
  - { id: profit_hi_take, label: "Net profit at the alternative take rate", formula: "volume_hi * contrib_hi_take / 10000 - fixed - migr_vol_hi * card_contrib_bps / 10000", expected: 1.7625, unit: "$M", decimals: 1 }
  - { id: need_take, label: "Take rate needed to break even after cannibalization", formula: "(fixed + lost_card) / volume * 10000 + fraud_bps + var_bps", expected: 46.125, unit: "bps", decimals: 1 }
  - { id: lost_card_half, label: "Card profit lost if only half as much volume migrates", formula: "lost_card / 2", expected: 7.2, unit: "$M", decimals: 1 }

answer:
  calc: profit_net
  headline: "At {{take_bps}} the launch breaks even only before cannibalization: after card volume moves over, year-three profit is {{profit_net}}. Fraud and the card migration decide the case."

exhibits:
  - id: exhibit-1
    title: "What a supplier pays on an average payment, by method"
    kind: bar
    unit: "$"
    decimals: 2
    ask: "Here is what a supplier pays on an average payment. How does the proposed price look?"
    data:
      - { label: "Business card", value: card_fee_txn }
      - { label: "Instant payment (proposed)", value: instant_fee_txn }
      - { label: "ACH (slow)", value: ach_fee }
    note: "Illustrative data created for this practice case. Card and ACH fees are typical illustrative figures, not quotes."
    insight: |
      At {{take_bps}} an instant payment costs the supplier {{instant_fee_txn}}, about
      {{instant_vs_card}} less than a card payment but far more than ACH at {{ach_fee}}.
      Instant must win on speed and certainty, not price, against ACH, and on price against cards.
  - id: exhibit-2
    title: "Unit economics of an instant payment, in basis points of volume"
    kind: table
    ask: "The finance team built the margin for each dollar of instant volume. What do you take from it?"
    columns: ["Item", "Base case", "Weak fraud controls"]
    rows:
      - ["Take rate", "{{take_bps}}", "{{take_bps}}"]
      - ["Fraud loss (payments cannot be reversed)", "{{fraud_bps}}", "{{fraud_hi_bps}}"]
      - ["Processing cost ({{var_txn}} per payment)", "{{var_bps}}", "{{var_bps}}"]
      - ["**Contribution**", "**{{contrib_bps}}**", "**{{contrib_hi_fraud}}**"]
      - ["Break-even volume (fixed cost {{fixed}})", "{{be_volume}}", "{{be_hi_fraud}}"]
    note: "Illustrative data created for this practice case. One basis point (bps) is 0.01% of payment value."
    insight: |
      Break-even volume is {{be_volume}} in the base case and {{be_hi_fraud}} with weak controls.
      Six extra basis points of fraud raise break-even volume by about a fifth.
  - id: exhibit-3
    title: "Year-three profit under three scenarios, after card cannibalization"
    kind: table
    ask: "Here is year three, counting the card volume that moves across. What would you do about it?"
    columns: ["Scenario", "Volume", "Contribution per dollar", "Card volume moving over", "Net profit"]
    rows:
      - ["Base: {{take_bps}} take rate", "{{volume}}", "{{contrib_bps}}", "{{migr_vol}}", "{{profit_net}}"]
      - ["Weak fraud controls", "{{volume}}", "{{contrib_hi_fraud}}", "{{migr_vol}}", "{{profit_hi_fraud}}"]
      - ["Alternative take rate of {{take_hi_bps}}", "{{volume_hi}}", "{{contrib_hi_take}}", "{{migr_vol_hi}}", "{{profit_hi_take}}"]
    note: "Illustrative data created for this practice case. Fixed cost is {{fixed}} in every scenario. Net profit is after fixed cost and lost card profit."
    insight: |
      Once card profit is counted, the base case earns {{profit_net}}, and weak fraud controls turn that into
      {{profit_hi_fraud}}. A higher take rate of {{take_hi_bps}} reaches {{profit_hi_take}} even with lower volume.
---

## Prompt

Our client is Tessera Payments, a US company that helps businesses pay their suppliers. It earns most of its money from ACH transfers and from virtual cards, a card number issued for each invoice that earns a share of the card fee.

Tessera plans to launch **instant business payments**: money reaches the supplier in seconds, any hour of any day, and it cannot be reversed. The CEO needs to decide on the price, and whether the product will make money given the launch costs.

She asks us: **how should Tessera price instant payments, and at what volume does the launch break even?**

## Clarifying information

- Q: How is the product paid for?
  A: Tessera charges a percentage take rate on each payment, proposed at {{take_bps}}. Suppliers or buyers can pay it; assume the customer who chooses instant pays.
- Q: What are the alternatives?
  A: Business cards cost a supplier about {{card_fee}} but give buyers rewards and extra time to pay. ACH costs about {{ach_fee}} per payment but takes one to three days.
- Q: What is a typical payment?
  A: About {{avg_txn}}.
- Q: What does it cost to run?
  A: Processing costs {{var_txn}} per payment. Fixed costs (platform, compliance, fraud team) are {{fixed}} a year.
- Q: What about fraud?
  A: Unlike ACH, an instant payment cannot be recalled. Tessera expects fraud losses of {{fraud_bps}} of volume with good controls, and the fraud team warns of up to {{fraud_hi_bps}} if controls lag.
- Q: Does Tessera already sell something that overlaps?
  A: Yes: its virtual card product, on which it earns {{card_take_bps}} net, less {{card_cost_bps}} of costs and fraud. Some card customers will switch to the cheaper instant option.
- Q: What is the volume forecast?
  A: {{volume}} in year three, with the product reaching steady state. Tessera expects about {{migr_share}} of that to come from its own card customers.

## Structure

> **Ask:** How would you approach the pricing and break-even question?

- **1. Customer value and price**
  - Who pays and what they gain: faster cash for suppliers, certainty, fewer reconciliation errors
  - Price anchors: card (high, with rewards), ACH (very low, slow) and willingness to pay for speed
  - Pricing structure: percentage or flat fee, caps for large payments, who is charged
- **2. Unit economics**
  - Take rate minus processing cost minus **fraud loss** (irrevocable payments)
  - Contribution per dollar and per payment
- **3. Break-even and the volume forecast**
  - Fixed cost divided by contribution per dollar
  - Is the forecast realistic; which customers adopt first
- **4. Cannibalization:** volume that moves from Tessera's own higher-margin card product
- **5. Risks:** fraud and liability, banks' participation, compliance, competitors

A good hypothesis: *"At {{take_bps}} instant is much cheaper than cards, so suppliers will like it, but the margin is thin once fraud is paid for. The cannibalized card revenue may decide whether we profit."*

## Math walkthrough

> **Ask:** Work out the unit economics and break-even volume. Then, what is year-three profit once card volume moves across, and what would you change?

**1. Price against alternatives.**
On an average payment of {{avg_txn}}, a supplier pays {{card_fee_txn}} with a card, **{{instant_fee_txn}}** with an instant payment and {{ach_fee}} with ACH. Instant saves {{instant_vs_card}} against a card, so the price is attractive to suppliers who now pay card fees. Against ACH ({{ach_bps}} of the payment) it is a premium product.

**2. Contribution per dollar.**
Processing costs {{var_txn}} on {{avg_txn}}, which is {{var_bps}}. Contribution is {{take_bps}} less {{fraud_bps}} less {{var_bps}}, or **{{contrib_bps}}**. That is **{{contrib_txn}}** per payment.

**3. Break-even volume.**
Fixed cost {{fixed}} divided by the contribution of {{contrib_bps}} per dollar gives **{{be_volume}}** of volume, or about **{{be_txns}}** payments. The year-three forecast of {{volume}} is {{gross_contrib}} of contribution and {{profit_before}} of profit before cannibalization.

**4. The cannibalization trap.**
{{migr_share}} of volume, or {{migr_vol}}, comes from Tessera's own virtual cards, which earned {{card_take_bps}} less {{card_cost_bps}}, or {{card_contrib_bps}}. That is **{{lost_card}}** of card profit lost.
Net year-three profit is {{profit_before}} less {{lost_card}}, or **{{profit_net}}**.

**5. Stress and pricing tests.**
With weak fraud controls, contribution falls to {{contrib_hi_fraud}}, break-even volume rises to **{{be_hi_fraud}}**, and year-three profit is **{{profit_hi_fraud}}**.
To break even after cannibalization, Tessera needs a take rate of about **{{need_take}}**, roughly the proposed price plus a point.
Testing {{take_hi_bps}}: volume falls to {{volume_hi}} but contribution per dollar rises to {{contrib_hi_take}} and card migration is {{migr_vol_hi}}, giving **{{profit_hi_take}}**. If only half as much volume migrated at the base price, the card loss would be {{lost_card_half}}.

## Synthesis

> **Ask:** What would you tell the CEO about price and the launch decision?

**Launch, but not at {{take_bps}} with open access. Price at about {{take_hi_bps}} with tiered caps, steer card customers to keep their cards unless they need speed, and build fraud controls first: the base case earns {{profit_net}} in year three once card profit is counted.**

1. **The price is attractive on its face:** a supplier saves {{instant_vs_card}} per payment against a card, so there is room to raise the rate and still win card users on cost.
2. **Fraud is the swing factor:** payments cannot be reversed, and weak controls would move break-even volume from {{be_volume}} to {{be_hi_fraud}} and year-three profit to {{profit_hi_fraud}}.
3. **Own-card cannibalization is the hidden cost:** {{lost_card}} of card profit offsets most of the {{profit_before}} before it, so offer instant first to customers who do not use virtual cards today.

**Risks and next steps:** pilot with a few hundred customers and measure fraud by payee type (new payees are riskiest) before scaling; set limits and delays for first-time payees and large payments; confirm volume at {{take_hi_bps}} with a price test; model how rivals and bank-run instant networks may price; and check liability, compliance and bank partner terms. Agree stop-loss triggers if fraud exceeds {{fraud_bps}} of volume.

## Common mistakes

- Comparing only to card price and forgetting ACH, which is almost free, so speed has to carry the value.
- Ignoring fraud, or treating it as with ACH and cards, when instant payments cannot be reversed.
- Computing break-even volume and stopping, without checking the volume taken from Tessera's own card product.
- Mixing units: take rate and costs in basis points of volume, but processing cost per payment in dollars.

## What top candidates do differently

- Put every item on the same footing (basis points of volume) so break-even is a single division.
- Build a small sensitivity grid on fraud and take rate instead of one point estimate.
- Spot the cannibalization early and suggest a way to limit it (customer targeting, caps).
- Link price to who pays and why: speed has most value to suppliers short on cash.

## Creative question

Besides a take rate, what other ways could Tessera earn money from instant business payments?

## Model answer

Group ideas by **who pays and for what**:

- **Suppliers:** a small fee for instant settlement of a specific invoice; early-payment discounts that Tessera helps buyers offer and earns a share of.
- **Buyers:** a subscription for a bundle of instant payments and reporting; fees for higher limits or for approval workflows.
- **Banks and platforms:** license the fraud-scoring tool; interest or float income on balances held between funding and payout; an application programming interface (API) fee for software firms that embed payments.

A top candidate prioritizes: "Early-payment discounts and a fraud-scoring product could earn more than the {{take_bps}} take rate without moving card customers, so I would test those with the first customers."
