---
id: bank-buys-payroll-fintech
title: "Banking on Payday: A Regional Bank Buying a Payroll Startup"
client: "Keystone Commonwealth Bank (fictional), a US regional bank"
summary: "A regional bank wants to buy a small-business payroll software startup for its payroll deposits and its customers. Value the startup with synergies, back-solve the most the bank can pay, then see how peer deals shrink the deposit synergy."
industry: tech-ai
sub_industry: "Fintech"
type: m-and-a
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company or deal data.
inputs:
  customers:     { value: 20000, unit: "business customers", label: "Tidewell's small-business customers" }
  price_per:     { value: 2000,  unit: "$",       label: "Average subscription revenue per customer per year" }
  cm:            { value: 0.50,  unit: "%",       label: "Contribution margin on subscription revenue" }
  fixed:         { value: 10,    unit: "$M",      label: "Tidewell's fixed costs per year (engineering, overhead)" }
  growth:        { value: 0.30,  unit: "%",       label: "Tidewell's revenue growth last year" }
  multiple_t:    { value: 15,    unit: "x",       label: "EV/EBITDA for comparable payroll software companies growing at a similar rate" }
  last_round:    { value: 300,   unit: "$M",      label: "Valuation at Tidewell's last funding round (2022)" }
  asking:        { value: 280,   unit: "$M",      label: "Price Tidewell's investors are asking" }
  float:         { value: 500,   unit: "$M",      label: "Average payroll balances Tidewell holds for customers" }
  margin_dt:     { value: 0.02,  unit: "%",       label: "Deal team: margin Keystone earns per year on a dollar of business deposits" }
  cross_per:     { value: 500,   unit: "$",       label: "Deal team: profit per Tidewell customer per year from bank loans and cards" }
  compliance:    { value: 2,     unit: "$M",      label: "Extra compliance cost per year once Tidewell is part of a bank" }
  integration:   { value: 20,    unit: "$M",      label: "One-time integration cost" }
  multiple_s:    { value: 10,    unit: "x",       label: "Multiple used to value the bank's synergy earnings" }
  p1_churn:      { value: 0.08,  unit: "%",       label: "Peer deal 1: customers lost in the two years after the deal, versus plan" }
  p2_churn:      { value: 0.10,  unit: "%",       label: "Peer deal 2: customers lost versus plan" }
  p3_churn:      { value: 0.12,  unit: "%",       label: "Peer deal 3: customers lost versus plan" }
  p1_margin:     { value: 0.009, unit: "%",       label: "Peer deal 1: margin earned on payroll balances", decimals: 1 }
  p2_margin:     { value: 0.010, unit: "%",       label: "Peer deal 2: margin earned on payroll balances", decimals: 1 }
  p3_margin:     { value: 0.011, unit: "%",       label: "Peer deal 3: margin earned on payroll balances", decimals: 1 }

calculations:
  # --- Standalone value (Exhibit 1) ---
  - { id: revenue, label: "Tidewell revenue", formula: "customers * price_per / 1e6", expected: 40, unit: "$M" }
  - { id: ebitda, label: "Tidewell EBITDA", formula: "revenue * cm - fixed", expected: 10, unit: "$M" }
  - { id: standalone, label: "Tidewell standalone value", formula: "ebitda * multiple_t", expected: 150, unit: "$M" }
  - { id: premium, label: "Premium in the asking price over standalone value", formula: "asking - standalone", expected: 130, unit: "$M" }
  - { id: ask_multiple, label: "Asking price as a multiple of EBITDA", formula: "asking / ebitda", expected: 28, unit: "x" }
  # --- Deal team's synergies (Exhibit 2) ---
  - { id: float_syn, label: "Deal team: profit per year on payroll balances", formula: "float * margin_dt", expected: 10, unit: "$M" }
  - { id: cross_syn, label: "Deal team: cross-selling profit per year", formula: "customers * cross_per / 1e6", expected: 10, unit: "$M" }
  - { id: syn_dt, label: "Deal team: net synergy per year", formula: "float_syn + cross_syn - compliance", expected: 18, unit: "$M" }
  - { id: syn_value_dt, label: "Deal team: value of synergies", formula: "syn_dt * multiple_s", expected: 180, unit: "$M" }
  - { id: syn_net_dt, label: "Deal team: synergy value net of integration", formula: "syn_value_dt - integration", expected: 160, unit: "$M" }
  - { id: walk_dt, label: "Deal team: maximum price", formula: "standalone + syn_net_dt", expected: 310, unit: "$M" }
  - { id: headroom_dt, label: "Deal team: maximum price above the asking price", formula: "walk_dt - asking", expected: 30, unit: "$M" }
  # --- Back-solve the margin the asking price needs ---
  - { id: syn_needed, label: "Synergy per year needed to justify the asking price", formula: "(premium + integration) / multiple_s", expected: 15, unit: "$M" }
  - { id: float_needed, label: "Profit per year needed from payroll balances", formula: "syn_needed - cross_syn + compliance", expected: 7, unit: "$M" }
  - { id: margin_needed, label: "Margin on payroll balances needed to justify the asking price", formula: "float_needed / float", expected: 0.014, unit: "%", decimals: 1 }
  # --- Peer evidence (Exhibit 3) ---
  - { id: churn_loss, label: "Average customers lost after peer deals", formula: "(p1_churn + p2_churn + p3_churn) / 3", expected: 0.10, unit: "%" }
  - { id: margin_rev, label: "Average margin peers earned on payroll balances", formula: "(p1_margin + p2_margin + p3_margin) / 3", expected: 0.01, unit: "%", decimals: 1 }
  - { id: cust_rev, label: "Revised: customers after the deal", formula: "customers * (1 - churn_loss)", expected: 18000, unit: "business customers" }
  - { id: ebitda_rev, label: "Revised: Tidewell EBITDA", formula: "cust_rev * price_per / 1e6 * cm - fixed", expected: 8, unit: "$M" }
  - { id: ebitda_drop, label: "Revised: fall in EBITDA", formula: "ebitda - ebitda_rev", expected: 2, unit: "$M" }
  - { id: standalone_rev, label: "Revised: Tidewell standalone value to Keystone", formula: "ebitda_rev * multiple_t", expected: 120, unit: "$M" }
  - { id: float_rev, label: "Revised: payroll balances", formula: "float * (1 - churn_loss)", expected: 450, unit: "$M" }
  - { id: float_syn_rev, label: "Revised: profit per year on payroll balances", formula: "float_rev * margin_rev", expected: 4.5, unit: "$M", decimals: 1 }
  - { id: cross_syn_rev, label: "Revised: cross-selling profit per year", formula: "cust_rev * cross_per / 1e6", expected: 9, unit: "$M" }
  - { id: syn_rev, label: "Revised: net synergy per year", formula: "float_syn_rev + cross_syn_rev - compliance", expected: 11.5, unit: "$M", decimals: 1 }
  - { id: syn_value_rev, label: "Revised: value of synergies", formula: "syn_rev * multiple_s", expected: 115, unit: "$M" }
  - { id: syn_net_rev, label: "Revised: synergy value net of integration", formula: "syn_value_rev - integration", expected: 95, unit: "$M" }
  - { id: walk_rev, label: "Revised: maximum price (walk-away)", formula: "standalone_rev + syn_net_rev", expected: 215, unit: "$M" }
  - { id: gap_rev, label: "Asking price above the revised maximum", formula: "asking - walk_rev", expected: 65, unit: "$M" }
  # --- Bridge from the deal team's maximum to the revised one ---
  - { id: br_standalone, label: "Bridge: lower standalone value", formula: "standalone_rev - standalone", expected: -30, unit: "$M" }
  - { id: br_float, label: "Bridge: smaller payroll-balance synergy", formula: "(float_syn_rev - float_syn) * multiple_s", expected: -55, unit: "$M" }
  - { id: br_cross, label: "Bridge: smaller cross-selling synergy", formula: "(cross_syn_rev - cross_syn) * multiple_s", expected: -10, unit: "$M" }
  - { id: br_total, label: "Bridge total", formula: "br_standalone + br_float + br_cross", expected: -95, unit: "$M" }
  - { id: br_check, label: "Revised maximum, from the bridge", formula: "walk_dt + br_total", expected: 215, unit: "$M" }
  - { id: float_share_drop, label: "Share of the fall in value from the payroll-balance synergy", formula: "br_float / br_total", expected: 0.579, unit: "%", decimals: 0 }
  # --- Negotiation ---
  - { id: open_bid, label: "Opening bid: about 10% above what a buyer without synergies can pay", formula: "standalone * 1.1", expected: 165, unit: "$M" }
  - { id: bid_room, label: "Room between opening bid and walk-away", formula: "walk_rev - open_bid", expected: 50, unit: "$M" }

answer:
  calc: walk_rev
  headline: "Tidewell is worth at most about {{walk_rev}} to Keystone, not the {{walk_dt}} the deal team estimated: open near {{open_bid}}, walk away above {{walk_rev}}, and do not pay the {{asking}} asked."

exhibits:
  - id: exhibit-1
    title: "Tidewell Payroll at a glance"
    kind: table
    ask: "Here is the target. What is it worth on its own, and how big is the premium in the asking price?"
    columns: ["Item", "Value"]
    rows:
      - ["Small-business customers", "{{customers}}, mostly 5–50 employees"]
      - ["Subscription revenue per customer per year", "{{price_per}}"]
      - ["Contribution margin", "{{cm}}"]
      - ["Fixed costs per year", "{{fixed}}"]
      - ["Revenue growth last year", "{{growth}}"]
      - ["Valuation at last funding round (2022)", "{{last_round}}"]
      - ["Typical value of payroll software companies growing 25–35% a year", "{{multiple_t}} EBITDA"]
      - ["Asking price", "{{asking}}"]
    note: "Illustrative data created for this practice case. Tidewell Payroll and Keystone are fictional."
    insight: |
      Tidewell earns {{ebitda}} of EBITDA and is worth about {{standalone}} on
      its own. The asking price is {{ask_multiple}} EBITDA, a {{premium}}
      premium. The 2022 funding round is an anchor for the seller, not a
      measure of value today.
  - id: exhibit-2
    title: "Keystone deal team's synergy estimates"
    kind: table
    ask: "Here are the deal team's synergies. What is the most Keystone could pay?"
    columns: ["Synergy", "Estimate", "Comment"]
    rows:
      - ["Payroll balances", "{{float}} held at Keystone, earning {{margin_dt}} a year", "Employers send payroll and tax money a day or two before payday; today it sits at a partner bank, which keeps the interest margin"]
      - ["Cross-selling", "{{cross_per}} profit per customer per year", "Business loans, credit cards and treasury services; averaged over all Tidewell customers (about a quarter buy something, earning $2,000 each)"]
      - ["Compliance", "{{compliance}} extra cost per year", "Bank-level rules on data, vendor and anti-money-laundering controls"]
      - ["Integration", "{{integration}} one-time", "Systems, accounts and staff retention bonuses"]
      - ["Valuation of synergies", "{{multiple_s}} annual profit", "Synergies are bank earnings, valued at a bank multiple"]
    note: "Illustrative data created for this practice case."
    insight: |
      Synergies of {{syn_dt}} a year are worth {{syn_net_dt}} net of
      integration, so on the deal team's numbers Keystone could pay up to
      {{walk_dt}}, above the asking price. The payroll-balance margin is
      the biggest single assumption.
  - id: exhibit-3
    title: "What happened after three peer banks bought payroll and payments startups"
    kind: table
    ask: "The deal team pulled results from three similar deals by other banks. What does this do to your answer?"
    columns: ["Peer deal", "Customers lost in two years after the deal, versus plan", "Margin earned on payroll balances"]
    rows:
      - ["Peer deal 1", "{{p1_churn}}", "{{p1_margin}}"]
      - ["Peer deal 2", "{{p2_churn}}", "{{p2_margin}}"]
      - ["Peer deal 3", "{{p3_churn}}", "{{p3_margin}}"]
    note: "Illustrative data created for this practice case; fictional peer deals. Customers who left cited slower product updates and worries about being tied to one bank. Payroll balances stay only a day or two, so banks can invest them only very short term, and larger employers ask for earnings credits or send payroll money later."
    insight: |
      Customers leave after a bank buys their software provider, and payroll
      balances earn about {{margin_rev}}, half the deal team's {{margin_dt}}
      and below the {{margin_needed}} the asking price needs.
---

## Prompt

Our client, Keystone Commonwealth Bank, is a US regional bank that wants to grow its business with small companies. Keystone is in talks to buy **Tidewell Payroll**, a fast-growing startup whose software runs payroll and payroll taxes for {{customers}}.

Tidewell's investors are asking **{{asking}}**. Keystone's CEO sees two prizes: the money Tidewell's customers send for payroll, which could sit at Keystone as deposits, and thousands of small businesses Keystone could lend to. She asks us: **what is Tidewell worth to Keystone, and what should we bid?**

## Clarifying information

- Q: What is Keystone's objective?
  A: Grow small-business deposits and loans. The board will not approve paying more than Tidewell is worth to Keystone.
- Q: How should we value Tidewell and the synergies?
  A: Value Tidewell's EBITDA at the multiple for payroll software companies and the synergies at Keystone's own multiple, both given in the exhibits. Ignore taxes and the time to reach full synergies.
- Q: Are there other bidders?
  A: A growth-equity fund that backs software companies has shown interest. It has no banking synergies.
- Q: Who owns the payroll money?
  A: The employers. Tidewell collects it a day or two before payday and pays it out to employees and tax authorities, so at any time it holds a large balance on their behalf.
- Q: Would Tidewell keep its brand and product?
  A: Yes. Keystone plans to run Tidewell as a separate brand and keep selling it to businesses that bank elsewhere.

## Structure

> **Ask:** How would you structure the valuation?

The most Keystone should pay is **standalone value + synergies − integration cost**, and the bid should start well below that:

- **1. Standalone value**
  - Revenue = customers × revenue per customer; EBITDA after variable and fixed costs
  - EBITDA × the multiple for comparable payroll software companies
- **2. Synergies (to Keystone only)**
  - Payroll balances held at Keystone × margin the bank earns on them
  - Cross-selling: loans, cards and treasury services to Tidewell customers
  - Less new running costs (bank-level compliance) and one-time integration
- **3. What could go wrong**
  - Customers leaving after a bank buys the software (dis-synergy)
  - How sticky and profitable payroll balances really are
- **4. Negotiation**
  - Walk-away price (the ceiling), the other bidder's likely maximum, the opening bid

Hypothesis: *"The deposit synergy probably carries the price. Payroll money moves in and out within days and large employers can move it, so I'd test what margin Keystone can really earn on it."*

## Math walkthrough

> **Ask:** Using Exhibit 1, what is Tidewell worth on its own? Using Exhibit 2, what is the most Keystone could pay, and what margin on payroll balances does the asking price need? Then use Exhibit 3: what is the walk-away price now, and what should Keystone bid?

**1. Standalone value (Exhibit 1).**
Revenue = 20,000 × $2,000 = **{{revenue}}**. EBITDA = $40M × 50% − $10M = **{{ebitda}}**.
Standalone value = $10M × 15 = **{{standalone}}**. The asking price is {{ask_multiple}} EBITDA, a premium of **{{premium}}**.

**2. Synergies (Exhibit 2).**
- Payroll balances: $500M × 2% = **{{float_syn}}** a year
- Cross-selling: 20,000 × $500 = **{{cross_syn}}** a year
- Less compliance of {{compliance}}: net **{{syn_dt}}** a year
- Value: $18M × 10 = {{syn_value_dt}}, less {{integration}} integration = **{{syn_net_dt}}**

Maximum price = $150M + $160M = **{{walk_dt}}**, {{headroom_dt}} above the ask.

**3. Back-solve the asking price.**
To justify {{asking}}, synergies must cover the $130M premium plus $20M integration: ($130M + $20M) ÷ 10 = **{{syn_needed}}** a year.
After {{cross_syn}} of cross-selling and {{compliance}} of compliance, payroll balances must earn **{{float_needed}}**, a margin of $7M ÷ $500M = **{{margin_needed}}**. The deal works only if Keystone earns at least that on payroll money.

**4. Peer evidence (Exhibit 3).**
Peers lost an average of **{{churn_loss}}** of customers and earned about **{{margin_rev}}** on payroll balances.
- Customers: 20,000 × 90% = {{cust_rev}}, so EBITDA = 18,000 × $2,000 × 50% − $10M = **{{ebitda_rev}}**, and standalone value to Keystone falls to **{{standalone_rev}}**.
- Payroll balances fall to $500M × 90% = {{float_rev}}, which earns $450M × 1.0% = **{{float_syn_rev}}** a year
- Cross-selling: 18,000 × $500 = **{{cross_syn_rev}}** a year
- Net synergy = $4.5M + $9M − $2M = **{{syn_rev}}** a year, worth $115M − $20M = **{{syn_net_rev}}**

| Step | Value |
|---|---|
| Deal team's maximum price | {{walk_dt}} |
| Lower standalone value (customers lost) | {{br_standalone}} |
| Smaller payroll-balance synergy | {{br_float}} |
| Smaller cross-selling synergy | {{br_cross}} |
| **Revised maximum (walk-away)** | **{{br_check}}** |
| Asking price | {{asking}} |

The walk-away price is **{{walk_rev}}**, {{gap_rev}} below the ask. The payroll-balance margin explains {{float_share_drop}} of the fall.

**5. The bid.**
The growth-equity fund has no synergies and none of the bank-specific customer losses, so it can justify about {{standalone}}. Keystone can open near **{{open_bid}}**, about 10% above that, and still has {{bid_room}} of room before its walk-away price.

## Synthesis

> **Ask:** What do you recommend to Keystone's CEO?

**Keystone should bid for Tidewell, but not at {{asking}}. After peer evidence on customer losses and payroll-balance margins, Tidewell is worth at most about {{walk_rev}} to Keystone. Open around {{open_bid}} and walk away above {{walk_rev}}.**

1. **The deal team's {{walk_dt}} rests on a deposit margin that peers do not earn:** the asking price needs at least {{margin_needed}} on payroll balances; peers earned about {{margin_rev}}.
2. **Buying the startup changes it:** peers lost about {{churn_loss}} of customers, which cuts both Tidewell's own value and every synergy built on its customer base.
3. **Keystone still has an edge over the other bidder:** even on revised numbers it can pay up to {{walk_rev}}, against roughly {{standalone}} for a buyer without synergies, so it can win without matching the ask.

**Risks and next steps:** {{walk_rev}} is the ceiling, not the offer; the seller's {{last_round}} funding round will anchor its expectations, so be ready to explain the gap. Bridge part of it with an earn-out tied to customer retention and payroll balances held at Keystone, which protects Keystone if peers' problems repeat. Before signing, interview Tidewell's largest customers about staying under bank ownership, plan retention bonuses for Tidewell's engineers, and check whether a partnership (holding Tidewell's payroll balances and referring loans) could capture much of the value without buying the company.

## Common mistakes

- Treating the deal team's {{walk_dt}} maximum as the offer, or bidding the asking price because it is "below the maximum".
- Valuing all of the payroll balances as if they earned a normal business-deposit margin, when they stay only a day or two and large employers can move them.
- Applying customer losses to the synergies but not to Tidewell's own EBITDA.
- Forgetting the {{compliance}} of new running cost, or valuing the one-time {{integration}} integration as if it recurred every year.
- Using the {{last_round}} funding round as a guide to value.

## What top candidates do differently

- Back-solve the payroll-balance margin the asking price needs ({{margin_needed}}), so the debate centers on one number the peers can test.
- Build a bridge from the deal team's maximum to the revised one, showing which assumption matters most.
- Separate the walk-away price from the opening bid and anchor the bid on the other bidder's likely maximum.
- Suggest deal structures (earn-out, partnership) that share the risk instead of a plain yes or no.

## Creative question

How could Keystone keep Tidewell's customers after the deal, and even grow the payroll business?

## Model answer

Organize the ideas around **reassuring current customers** and **giving them reasons to stay**:

- **Reassure:** keep the Tidewell brand, product team and roadmap; promise that customers can keep their bank accounts anywhere; no price increase for two years.
- **Reasons to stay:** same-day payroll funding for Keystone account holders; small working-capital loans that help a business meet payroll in a slow month; one login for payroll and banking.
- **Grow:** sell Tidewell to Keystone's existing small-business customers who run payroll on spreadsheets or a competitor; partner with accountants who recommend payroll software to their clients.

A top candidate prioritizes: "Payroll loans for a slow month are the strongest idea. Meeting payroll is a small business owner's biggest worry, and a lender that sees the payroll data can offer that loan faster and more safely than anyone else."
