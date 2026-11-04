---
id: bank-small-business-lending-app
title: "Main Street Lending: A Regional Bank's Small-Business Loan App"
client: "Prairie Ledger Bank (fictional), a regional bank in the US Midwest"
summary: "Fintech lenders are winning small-business loans with fast online approvals. Should a regional bank launch its own lending app — and should it build the technology or rent it?"
industry: other
sub_industry: "Financial services"
type: market-entry
difficulty: beginner
format: candidate-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real market data.
inputs:
  small_biz:        { value: 400000, unit: "businesses", label: "Small businesses in Prairie's region" }
  borrow_rate:      { value: 0.10,   unit: "%",          label: "Share that take out a small loan (under $100,000) each year" }
  avg_loan:         { value: 50000,  unit: "$",          label: "Average loan size" }
  target_share:     { value: 0.05,   unit: "%",          label: "Prairie's target share of small loans by year 3" }
  deposit_share:    { value: 0.125,   unit: "%",          label: "Share of the region's small businesses that bank with Prairie today", decimals: 1 }
  net_spread:       { value: 0.06,   unit: "%",          label: "Interest earned per year above the bank's funding cost (share of loan)" }
  loss_rate:        { value: 0.02,   unit: "%",          label: "Expected credit losses per year (share of loan)" }
  build_upfront:    { value: 8,      unit: "$M",         label: "Build in-house: upfront technology cost" }
  build_run:        { value: 2,      unit: "$M",         label: "Build in-house: running cost per year" }
  partner_upfront:  { value: 1.25,   unit: "$M",         label: "Partner: setup and integration cost", decimals: 2 }
  partner_fee:      { value: 500,    unit: "$",          label: "Partner: platform fee per loan" }
  partner_fixed:    { value: 0.5,    unit: "$M",         label: "Partner: fixed cost per year (licence and small team)", decimals: 1 }
  hurdle_years:     { value: 3,      unit: "years",      label: "Bank's maximum payback for new products" }

calculations:
  # --- Market ---
  - { id: loans_market, label: "Small loans taken out in the region per year", formula: "small_biz * borrow_rate", expected: 40000, unit: "loans" }
  - { id: market_value, label: "Value of those loans per year", formula: "loans_market * avg_loan / 1e9", expected: 2.0, unit: "$B", decimals: 1 }
  - { id: target_loans, label: "Prairie's loans per year at its target share", formula: "loans_market * target_share", expected: 2000, unit: "loans" }
  - { id: target_volume, label: "Prairie's lending per year at its target share", formula: "target_loans * avg_loan / 1e6", expected: 100, unit: "$M" }
  # --- Is the target realistic? ---
  - { id: own_customers, label: "Small businesses that already bank with Prairie", formula: "small_biz * deposit_share", expected: 50000, unit: "businesses" }
  - { id: own_customer_loans, label: "Small loans taken out by Prairie's own customers per year", formula: "own_customers * borrow_rate", expected: 5000, unit: "loans" }
  - { id: target_of_own, label: "Target loans as a share of own customers' loans", formula: "target_loans / own_customer_loans", expected: 0.4, unit: "%" }
  # --- Profit per loan ---
  - { id: profit_per_loan, label: "Profit per loan per year, before technology cost", formula: "avg_loan * (net_spread - loss_rate)", expected: 2000, unit: "$" }
  - { id: lending_profit, label: "Profit from lending at target, before technology cost", formula: "target_loans * profit_per_loan / 1e6", expected: 4, unit: "$M", decimals: 1 }
  # --- Build ---
  - { id: build_profit, label: "Annual profit, build in-house", formula: "lending_profit - build_run", expected: 2, unit: "$M", decimals: 1 }
  - { id: build_payback, label: "Payback, build in-house", formula: "build_upfront / build_profit", expected: 4, unit: "years", decimals: 0 }
  - { id: build_be_loans, label: "Loans per year to cover running cost, build in-house", formula: "build_run * 1e6 / profit_per_loan", expected: 1000, unit: "loans" }
  # --- Partner ---
  - { id: partner_per_loan, label: "Profit per loan after the partner's fee", formula: "profit_per_loan - partner_fee", expected: 1500, unit: "$" }
  - { id: partner_profit, label: "Annual profit, partner", formula: "target_loans * partner_per_loan / 1e6 - partner_fixed", expected: 2.5, unit: "$M", decimals: 1 }
  - { id: partner_payback_m, label: "Payback, partner", formula: "partner_upfront * 12 / partner_profit", expected: 6, unit: "months", decimals: 0 }
  # --- When does building win? ---
  - { id: fixed_gap, label: "Extra fixed cost per year of building", formula: "build_run - partner_fixed", expected: 1.5, unit: "$M", decimals: 1 }
  - { id: crossover_loans, label: "Loans per year at which building beats partnering", formula: "(build_run - partner_fixed) * 1e6 / partner_fee", expected: 3000, unit: "loans" }
  - { id: crossover_share, label: "Market share at which building beats partnering", formula: "crossover_loans / loans_market", expected: 0.075, unit: "%", decimals: 1 }

answer:
  calc: partner_payback_m
  headline: "Launch the app, but on a fintech partner's platform: payback in about {{partner_payback_m}} versus {{build_payback}} if Prairie builds it."

exhibits:
  - id: exhibit-1
    title: "Share of small-business loans in Prairie's region made by online fintech lenders"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Here is how the lending market in Prairie's region has changed. What does it tell you?"
    data:
      - { label: "2021", value: 0.12 }
      - { label: "2022", value: 0.17 }
      - { label: "2023", value: 0.22 }
      - { label: "2024", value: 0.26 }
      - { label: "2025", value: 0.30 }
    note: "Illustrative data created for this practice case; not official lending statistics."
    insight: |
      Fintech lenders have taken a large and growing share of small loans,
      even though they usually charge higher interest rates. Small
      businesses are paying for speed and convenience — which a bank app
      could offer at a lower price.
  - id: exhibit-2
    title: "Two ways to launch the app"
    kind: table
    ask: "The team has costed two ways to launch. Which would you choose?"
    columns: ["", "Build in-house", "Partner (rent a fintech's lending platform)"]
    rows:
      - ["Upfront cost", "{{build_upfront}}", "{{partner_upfront}}"]
      - ["Running cost per year", "{{build_run}}", "{{partner_fixed}} + {{partner_fee}} per loan"]
      - ["Time to launch", "18 months", "6 months"]
      - ["Control of the technology", "Full", "Shared; can customize screens and credit rules"]
    note: "Illustrative data created for this practice case."
    insight: |
      Building has no per-loan fee, but its upfront and running costs are
      much higher. The answer depends on volume: at Prairie's target, the
      partner's fee is cheaper than owning the technology.
---

## Prompt

Our client, Prairie Ledger Bank, is a regional bank with about 150 branches across three Midwest states. Small businesses — restaurants, shops, contractors — are an important customer group, and many keep their checking accounts at Prairie.

When these businesses need a small loan, though, more and more of them go to online fintech lenders, which can approve a loan in a day rather than the bank's three weeks. Prairie is considering launching a **mobile app that offers small-business loans with same-day decisions**. The CEO asks: **should we do it, and how?**

## Clarifying information

- Q: What kind of loans are we talking about?
  A: Loans under $100,000, averaging **{{avg_loan}}**, mostly for working capital or equipment. Assume each loan is outstanding for about a year on average.
- Q: What does Prairie want to achieve?
  A: Win back small-business borrowers and reach **{{target_share}}** of small loans in its region by year 3. Any new product must pay back within **{{hurdle_years}}**.
- Q: How does the bank make money on a loan?
  A: It earns interest above its own funding cost (**{{net_spread}}** of the loan per year), minus expected losses on loans that are not repaid (**{{loss_rate}}** per year).
- Q: How big is the market?
  A: There are about {{small_biz}} in the region, and roughly {{borrow_rate}} of them take out a small loan each year.
- Q: Does Prairie already have relationships with these businesses?
  A: Yes — about {{deposit_share}} of the region's small businesses bank with Prairie, which gives it their account data to make faster credit decisions.

## Structure

> **Ask:** How would you structure the decision?

- **1. Is there a market worth chasing?**
  - Number and value of small loans in the region
  - Who is winning them today, and why (Exhibit 1)
- **2. Can Prairie win its target share?**
  - Advantages: existing customers, their account data, lower funding costs than fintechs
  - Gaps: speed, digital experience
- **3. Does it make money — and which way to launch?**
  - Profit per loan (interest spread minus credit losses)
  - Build in-house versus partner with a fintech platform: cost, payback, speed to market
- **4. Risks:** credit quality, cannibalizing existing branch loans, technology dependence

## Math walkthrough

> **Ask:** Is Prairie's target realistic, and does either launch option pay back within {{hurdle_years}}?

**1. Market.** 400,000 businesses × 10% = **{{loans_market}}** a year, worth 40,000 × $50,000 = **{{market_value}}**.
At a {{target_share}} share, Prairie makes 40,000 × 5% = **{{target_loans}}** a year, or **{{target_volume}}** of lending.

**2. Is the target realistic?** Prairie's own customers: 400,000 × 12.5% = {{own_customers}}, taking out {{own_customer_loans}} a year. Prairie would need to win **{{target_of_own}}** of its own customers' loans — ambitious, but plausible because it already holds their accounts and can pre-approve them.

**3. Profit per loan.** $50,000 × (6% − 2%) = **{{profit_per_loan}}** a year. At target: 2,000 × $2,000 = **{{lending_profit}}** before technology costs.

**4. Build in-house.** Profit = $4M − $2M = **{{build_profit}}** a year. Payback = $8M ÷ $2M = **{{build_payback}}** — it **fails** the hurdle of {{hurdle_years}}, and that assumes the target is reached from day one.

**5. Partner.** Each loan earns $2,000 − $500 = **{{partner_per_loan}}** after the platform fee. Profit = 2,000 × $1,500 − $0.5M = **{{partner_profit}}** a year. Payback = $1.25M ÷ $2.5M × 12 ≈ **{{partner_payback_m}}** — it **passes** easily.

**6. When would building win?** Building costs **{{fixed_gap}}** more per year in fixed cost but saves the $500 fee on every loan. It only wins above $1.5M ÷ $500 = **{{crossover_loans}}** a year — a share of **{{crossover_share}}**, well above the target.

## Synthesis

> **Ask:** What do you tell the CEO?

**Prairie should launch the small-business loan app, using a fintech partner's platform rather than building its own: the partner option pays back in about {{partner_payback_m}}, while building takes {{build_payback}} and fails the hurdle of {{hurdle_years}}.**

1. **The market is there:** about {{loans_market}} a year worth {{market_value}}, and fintech lenders' fast-growing share shows customers will switch for speed.
2. **Prairie has a right to win:** it needs {{target_of_own}} of its own customers' loans, and it already has their account data to make quick, safe credit decisions.
3. **Partnering is cheaper at this scale and faster to market:** building only beats partnering above {{crossover_loans}} a year ({{crossover_share}} share), so Prairie can revisit the decision once volumes prove out.

**Risks and next steps:** credit losses could run above {{loss_rate}} when approvals are automated — start with existing customers and conservative limits; avoid simply moving existing branch loans into the app; negotiate the right to take the data and customers in-house later. Next: pilot with a few thousand pre-approved customers.

## Common mistakes

- Ignoring credit losses and calculating profit on the full {{net_spread}} spread, which overstates profit badly.
- Comparing the two options only on upfront cost, without the per-loan fee — the fee is what makes building attractive at very high volumes.
- Saying "yes, launch" without saying how, or without checking whether the target share is realistic.

## What top candidates do differently

- Test the target share against Prairie's existing customer base, the most likely source of early loans.
- Calculate the crossover volume ({{crossover_loans}}), which turns build-versus-partner into a clear decision rule.
- Mention time to market: with fintechs gaining share every year, launching a year earlier is worth a lot.

## Creative question

Beyond loans, how else could Prairie use the app to deepen its relationship with small-business customers?

## Model answer

A strong answer groups ideas by the customer's needs:

- **Getting paid:** card payments and invoicing built into the app, with money arriving the same day in the Prairie account.
- **Managing cash:** cash-flow forecasts based on the business's own account data, with an alert and a pre-approved credit line when cash runs low.
- **Running the business:** payroll, bookkeeping links and tax-saving accounts through partners.
- **Rewarding loyalty:** better loan rates for businesses that run their payments and payroll through Prairie.

A top candidate prioritizes: "Start with the pre-approved credit line — it uses the data Prairie already has and leads straight into the loan product."
