---
id: ai-analytics-addon-pricing
title: "Smart Add-On: Pricing an AI Analytics Module for B2B Software"
client: "Tallyforge (fictional), an order- and inventory-management software company for mid-size distributors"
summary: "A B2B software company is launching an AI forecasting add-on. One price leaves money on the table; three tiers capture more — but only if customers can't trade down."
industry: tech-ai
sub_industry: "B2B SaaS / AI features"
type: pricing
difficulty: intermediate
format: interviewer-led
time_minutes: 25

# All numbers are illustrative — realistic in shape, not real survey or cost data.
inputs:
  small_accts:  { value: 2000, unit: "accounts", label: "Small customer accounts" }
  mid_accts:    { value: 1500, unit: "accounts", label: "Mid-size customer accounts" }
  large_accts:  { value: 500,  unit: "accounts", label: "Large customer accounts" }
  small_basic:  { value: 100,  unit: "$/month",  label: "Small accounts: willingness to pay for Basic" }
  small_pro:    { value: 150,  unit: "$/month",  label: "Small accounts: willingness to pay for Pro" }
  small_ent:    { value: 200,  unit: "$/month",  label: "Small accounts: willingness to pay for Enterprise" }
  mid_basic:    { value: 150,  unit: "$/month",  label: "Mid-size accounts: willingness to pay for Basic" }
  mid_pro:      { value: 300,  unit: "$/month",  label: "Mid-size accounts: willingness to pay for Pro" }
  mid_ent:      { value: 400,  unit: "$/month",  label: "Mid-size accounts: willingness to pay for Enterprise" }
  large_basic:  { value: 200,  unit: "$/month",  label: "Large accounts: willingness to pay for Basic" }
  large_pro:    { value: 400,  unit: "$/month",  label: "Large accounts: willingness to pay for Pro" }
  large_ent:    { value: 800,  unit: "$/month",  label: "Large accounts: willingness to pay for Enterprise" }
  cost_basic:   { value: 20,   unit: "$/month",  label: "AI computing and support cost per account, Basic" }
  cost_pro:     { value: 50,   unit: "$/month",  label: "AI computing and support cost per account, Pro" }
  cost_ent:     { value: 150,  unit: "$/month",  label: "AI computing and support cost per account, Enterprise" }
  basic_price:  { value: 100,  unit: "$/month",  label: "Basic tier price (set at small accounts' willingness to pay)" }

calculations:
  # --- One price for one product (the Pro feature set) ---
  - { id: single_150, label: "Monthly gross profit at a single price of $150", formula: "(small_accts + mid_accts + large_accts) * (small_pro - cost_pro) / 1000", expected: 400, unit: "$K" }
  - { id: single_300, label: "Monthly gross profit at a single price of $300", formula: "(mid_accts + large_accts) * (mid_pro - cost_pro) / 1000", expected: 500, unit: "$K" }
  - { id: single_400, label: "Monthly gross profit at a single price of $400", formula: "large_accts * (large_pro - cost_pro) / 1000", expected: 175, unit: "$K" }
  - { id: single_annual, label: "Annual gross profit, best single price", formula: "single_300 * 12 / 1000", expected: 6.0, unit: "$M", decimals: 1 }
  # --- Naive tiers: each tier priced at its target segment's willingness to pay ---
  - { id: naive_monthly, label: "Monthly gross profit on paper, tiers at full willingness to pay", formula: "(small_accts * (small_basic - cost_basic) + mid_accts * (mid_pro - cost_pro) + large_accts * (large_ent - cost_ent)) / 1000", expected: 860, unit: "$K" }
  - { id: naive_large_pro_surplus, label: "Large accounts' surplus on Pro at a $300 Pro price", formula: "large_pro - mid_pro", expected: 100, unit: "$/month" }
  # --- Tiers priced so no one trades down ---
  - { id: mid_basic_surplus, label: "Mid-size accounts' surplus on Basic", formula: "mid_basic - basic_price", expected: 50, unit: "$/month" }
  - { id: pro_price, label: "Highest Pro price that keeps mid-size accounts on Pro", formula: "mid_pro - mid_basic_surplus", expected: 250, unit: "$/month" }
  - { id: large_basic_surplus, label: "Large accounts' surplus on Basic", formula: "large_basic - basic_price", expected: 100, unit: "$/month" }
  - { id: large_pro_surplus, label: "Large accounts' surplus on Pro", formula: "large_pro - pro_price", expected: 150, unit: "$/month" }
  - { id: ent_price, label: "Highest Enterprise price that keeps large accounts on Enterprise", formula: "large_ent - max(large_pro_surplus, large_basic_surplus)", expected: 650, unit: "$/month" }
  - { id: tier_small, label: "Monthly gross profit, small accounts on Basic", formula: "small_accts * (basic_price - cost_basic) / 1000", expected: 160, unit: "$K" }
  - { id: tier_mid, label: "Monthly gross profit, mid-size accounts on Pro", formula: "mid_accts * (pro_price - cost_pro) / 1000", expected: 300, unit: "$K" }
  - { id: tier_large, label: "Monthly gross profit, large accounts on Enterprise", formula: "large_accts * (ent_price - cost_ent) / 1000", expected: 250, unit: "$K" }
  - { id: tier_monthly, label: "Monthly gross profit, three tiers", formula: "tier_small + tier_mid + tier_large", expected: 710, unit: "$K" }
  - { id: tier_annual, label: "Annual gross profit, three tiers", formula: "tier_monthly * 12 / 1000", expected: 8.52, unit: "$M", decimals: 2 }
  - { id: uplift, label: "Annual gain from tiering versus the best single price", formula: "tier_annual - single_annual", expected: 2.52, unit: "$M", decimals: 2 }
  - { id: uplift_pct, label: "Gain from tiering (%)", formula: "uplift / single_annual", expected: 0.42, unit: "%", decimals: 0 }
  - { id: fence_cost, label: "Monthly profit given up to stop customers trading down", formula: "naive_monthly - tier_monthly", expected: 150, unit: "$K" }
  - { id: tier_revenue, label: "Monthly revenue, three tiers", formula: "(small_accts * basic_price + mid_accts * pro_price + large_accts * ent_price) / 1000", expected: 900, unit: "$K" }
  - { id: tier_margin, label: "Gross margin, three tiers", formula: "tier_monthly / tier_revenue", expected: 0.789, unit: "%", decimals: 0 }

answer:
  calc: tier_annual
  headline: "Launch three tiers at {{basic_price}}, {{pro_price}} and {{ent_price}}: about {{tier_annual}} of annual gross profit, {{uplift_pct}} more than the best single price."

exhibits:
  - id: exhibit-1
    title: "Monthly willingness to pay for the AI module, by customer segment and tier"
    kind: table
    ask: "Here are the results of a willingness-to-pay survey with Tallyforge's customers. What would you do with them?"
    columns: ["Segment", "Accounts", "Basic (dashboards and alerts)", "Pro (+ demand forecasting)", "Enterprise (+ AI assistant and custom models)"]
    rows:
      - ["Small", "{{small_accts}}", "{{small_basic}}", "{{small_pro}}", "{{small_ent}}"]
      - ["Mid-size", "{{mid_accts}}", "{{mid_basic}}", "{{mid_pro}}", "{{mid_ent}}"]
      - ["Large", "{{large_accts}}", "{{large_basic}}", "{{large_pro}}", "{{large_ent}}"]
    note: "Illustrative data created for this practice case; willingness to pay is the most each account says it would pay per month."
    insight: |
      Willingness to pay differs a lot by segment, and large accounts value
      the Enterprise features far more than anyone else. That is the
      classic setup for good-better-best tiers.
  - id: exhibit-2
    title: "AI computing and support cost per account per month, by tier"
    kind: bar
    unit: "$/month"
    decimals: 0
    ask: "Unlike most software features, AI has a real running cost. Here it is by tier."
    data:
      - { label: "Basic", value: cost_basic }
      - { label: "Pro", value: cost_pro }
      - { label: "Enterprise", value: cost_ent }
    note: "Illustrative data created for this practice case."
    insight: |
      Heavy AI use makes Enterprise expensive to serve, so the decision must
      be made on gross profit, not revenue.
---

## Prompt

Our client, Tallyforge, sells cloud software that helps mid-size distributors manage orders and inventory. It has about 4,000 customer accounts, each paying a monthly subscription.

Tallyforge has built an **AI analytics module**: dashboards and alerts, demand forecasting that tells customers what to reorder and when, and — for the most advanced customers — an AI assistant that answers questions about the business in plain English. It will be sold as an add-on to existing customers. The head of product asks: **how should we price it?**

## Clarifying information

- Q: What is the objective?
  A: Maximize gross profit from the module over the next year, while keeping customers happy — Tallyforge does not want the add-on to cause customers to leave.
- Q: Who are the customers?
  A: Three segments: {{small_accts}} small, {{mid_accts}} mid-size and {{large_accts}} large accounts.
- Q: Do we know what customers would pay?
  A: Yes — a survey asked customers the most they would pay for each feature package (Exhibit 1).
- Q: Does the module cost anything to run?
  A: Yes. Every forecast and question uses paid AI computing, plus customer support. Costs differ by package (Exhibit 2).
- Q: Can we charge different customers different prices for the same product?
  A: No — prices are published and the same for everyone. Customers choose the package they want.

## Structure

> **Ask:** How would you approach pricing the module?

- **1. Value to the customer (ceiling)**
  - What the module is worth: fewer stock-outs, less excess inventory, analyst time saved
  - Willingness to pay by segment (Exhibit 1)
- **2. Cost to serve (floor)**
  - AI computing and support cost per account (Exhibit 2)
- **3. Competitive reference points**
  - Standalone forecasting tools, AI features bundled by competitors
- **4. Price structure**
  - One price for one package versus good-better-best tiers
  - Each tier designed for one segment, priced so customers choose the tier meant for them
  - Gross profit under each option

A strong candidate says up front that with three segments and very different willingness to pay, **tiering is likely to beat a single price — if the tiers are priced so customers don't trade down.**

## Math walkthrough

> **Ask:** First, suppose Tallyforge sells only one package (the Pro features) at one price. Which price maximizes monthly gross profit?

Try each segment's willingness to pay for Pro; everyone whose willingness is at or above the price buys. Pro costs {{cost_pro}} per account.

| Price | Who buys | Monthly gross profit |
|---|---|---|
| $150 | All 4,000 accounts | 4,000 × ($150 − $50) = **{{single_150}}** |
| $300 | Mid-size + large (2,000) | 2,000 × ($300 − $50) = **{{single_300}}** |
| $400 | Large only (500) | 500 × ($400 − $50) = **{{single_400}}** |

The best single price is $300: {{single_300}} a month, or **{{single_annual}}** a year.

> **Ask:** Now design three tiers — Basic, Pro and Enterprise — each aimed at one segment. If you simply priced each tier at its target segment's willingness to pay ($100 / $300 / $800), what would happen?

**On paper**, that earns 2,000 × ($100 − $20) + 1,500 × ($300 − $50) + 500 × ($800 − $150) = **{{naive_monthly}}** a month. But customers choose the package that leaves them the most value (willingness to pay minus price — their "surplus"):
- A mid-size account gets $150 − $100 = **{{mid_basic_surplus}}** of surplus on Basic, but nothing on Pro at $300 — so it **trades down** to Basic.
- A large account gets {{large_basic_surplus}} on Basic and $400 − $300 = {{naive_large_pro_surplus}} on Pro, but nothing on Enterprise at $800 — it trades down too.

> **Ask:** So what prices would actually keep each segment in its tier, and how much gross profit would the tiers earn?

**1. Pro price.** Mid-size accounts must get at least {{mid_basic_surplus}} of surplus on Pro: $300 − $50 = **{{pro_price}}**.

**2. Enterprise price.** At a Pro price of $250, a large account gets $400 − $250 = **{{large_pro_surplus}}** on Pro (more than the {{large_basic_surplus}} it gets on Basic). So Enterprise must leave it at least that: $800 − $150 = **{{ent_price}}**.

(Check: small accounts get no surplus from Pro or Enterprise at these prices, so they stay on Basic.)

**3. Gross profit.**
- Small on Basic: 2,000 × ($100 − $20) = **{{tier_small}}**
- Mid-size on Pro: 1,500 × ($250 − $50) = **{{tier_mid}}**
- Large on Enterprise: 500 × ($650 − $150) = **{{tier_large}}**
- Total **{{tier_monthly}}** a month, or **{{tier_annual}}** a year — **{{uplift}}** ({{uplift_pct}}) more than the best single price.

Keeping customers in the right tier costs {{fence_cost}} a month against the paper number — the price of a tier structure that actually works. Revenue would be {{tier_revenue}} a month at a gross margin of about {{tier_margin}}.

## Synthesis

> **Ask:** The head of product needs a recommendation for the launch. What do you say?

**Launch the AI module in three tiers — Basic at {{basic_price}}, Pro at {{pro_price}} and Enterprise at {{ent_price}} — which earns about {{tier_annual}} of gross profit a year, {{uplift_pct}} more than the best single price of {{mid_pro}}.**

1. **Tiers capture different willingness to pay:** a single price either leaves small accounts out or leaves money on the table with large ones; tiers serve all three segments.
2. **Prices are set so customers choose the right tier:** Pro and Enterprise are priced below their segments' full willingness to pay so mid-size and large accounts don't trade down — that gives up {{fence_cost}} a month on paper, but the paper number would never happen.
3. **Profit, not revenue, drives the design:** Enterprise costs {{cost_ent}} per account to run, so the tiers were compared on gross profit; overall gross margin is about {{tier_margin}}.

**Risks and next steps:** survey answers often overstate willingness to pay — test prices with a pilot group; watch AI computing costs, especially heavy Enterprise users (consider usage limits or a usage-based fee above a threshold); strengthen the fences between tiers with features that matter only to larger customers (user seats, integrations, custom models), which would let Tallyforge raise the Pro and Enterprise prices later.

## Common mistakes

- Pricing each tier at its segment's full willingness to pay and assuming everyone picks "their" tier — ignoring that customers choose the package that gives them the most surplus.
- Maximizing revenue instead of gross profit: AI features have real running costs, unlike most software.
- Picking the single price with the most buyers ($150) rather than checking profit at each price point.
- Forgetting the small-account check — a tier structure must work for every segment at once.

## What top candidates do differently

- Explain willingness to pay and surplus in plain words before doing the math, so the trade-down logic is easy to follow.
- Solve the prices in order — Basic, then Pro, then Enterprise — because each tier's price limits the next one up.
- Suggest ways to make the fences stronger (features only large customers need), which is how Tallyforge could raise Pro and Enterprise prices over time.
- Question the survey data and propose a live price test.

## Creative question

How could Tallyforge make customers value the AI module more over time, so it can raise prices?

## Model answer

A strong answer focuses on proving and growing the value:

- **Show the savings:** an in-product report of stock-outs avoided and inventory reduced, in dollars, so the customer sees the module paying for itself.
- **Get better with use:** forecasts that improve as they learn each customer's data, making the module harder to replace.
- **Build in the workflow:** let forecasts create purchase orders automatically, so the module saves time, not just gives advice.
- **Price on outcomes for large customers:** an option to pay a share of measured inventory savings.

A top candidate prioritizes: "The savings report comes first — customers pay more for value they can see."
