---
id: saas-net-revenue-growth
title: "Leaky Bucket: Reviving a Slowing Software Company"
client: "Cobalt Ledger (fictional), a US B2B software company selling workflow software to finance teams"
summary: "Annual recurring revenue growth has halved in a year. Break the change into new customers, expansion, churn and price, find what a price rise is hiding, and choose where the next dollars go."
industry: tech-ai
sub_industry: "Enterprise software (SaaS)"
type: growth
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative: realistic in shape, not real company data.
inputs:
  beg_p:          { value: 320,   unit: "$M", label: "Annual recurring revenue (ARR) at the start of last year" }
  new_p:          { value: 66,    unit: "$M", label: "Last year: ARR from new customers" }
  exp_p:          { value: 48,    unit: "$M", label: "Last year: expansion ARR from existing customers" }
  churn_p:        { value: 24,    unit: "$M", label: "Last year: ARR lost to customers who left" }
  contr_p:        { value: 10,    unit: "$M", label: "Last year: ARR lost to customers who downgraded" }
  beg_c:          { value: 400,   unit: "$M", label: "ARR at the start of this year" }
  new_c:          { value: 56,    unit: "$M", label: "This year: ARR from new customers" }
  exp_c:          { value: 40,    unit: "$M", label: "This year: expansion ARR from existing customers" }
  churn_c:        { value: 36,    unit: "$M", label: "This year: ARR lost to customers who left" }
  contr_c:        { value: 12,    unit: "$M", label: "This year: ARR lost to customers who downgraded" }
  price_rate_p:   { value: 0.025, unit: "%", decimals: 1, label: "Last year's list-price increase" }
  price_rate_c:   { value: 0.06,  unit: "%", decimals: 1, label: "This year's list-price increase" }
  price_churn:    { value: 0.40,  unit: "%", label: "Share of lost ARR where customers named price as a main reason (exit survey)" }
  smb_beg:        { value: 100,   unit: "$M", label: "Small-business segment: ARR at start of year" }
  smb_new:        { value: 24,    unit: "$M", label: "Small business: new-customer ARR" }
  smb_exp:        { value: 4,     unit: "$M", label: "Small business: expansion ARR" }
  smb_lost:       { value: 24,    unit: "$M", label: "Small business: churn and downgrades" }
  mm_beg:         { value: 160,   unit: "$M", label: "Mid-market segment: ARR at start of year" }
  mm_new:         { value: 20,    unit: "$M", label: "Mid-market: new-customer ARR" }
  mm_exp:         { value: 14,    unit: "$M", label: "Mid-market: expansion ARR" }
  mm_lost:        { value: 16,    unit: "$M", label: "Mid-market: churn and downgrades" }
  ent_beg:        { value: 140,   unit: "$M", label: "Enterprise segment: ARR at start of year" }
  ent_new:        { value: 12,    unit: "$M", label: "Enterprise: new-customer ARR" }
  ent_exp:        { value: 22,    unit: "$M", label: "Enterprise: expansion ARR" }
  ent_lost:       { value: 8,     unit: "$M", label: "Enterprise: churn and downgrades" }
  a_spend:        { value: 10,    unit: "$M", label: "Option A: spend on more sales hires" }
  a_arr:          { value: 14,    unit: "$M", label: "Option A: new-customer ARR it adds in a year" }
  a_grr:          { value: 0.82,  unit: "%", label: "Option A: share of that ARR kept each year (blend of small business and mid-market)" }
  b_spend:        { value: 5,     unit: "$M", label: "Option B: spend on mid-market customer success" }
  b_arr:          { value: 6.4,   unit: "$M", label: "Option B: ARR saved in a year (mid-market loss rate falls from 10% to 6%)" }
  b_grr:          { value: 0.94,  unit: "%", label: "Option B: share of mid-market ARR kept each year after the program" }
  c_spend:        { value: 8,     unit: "$M", label: "Option C: spend on a new enterprise module" }
  c_arr:          { value: 12,    unit: "$M", label: "Option C: expansion ARR it adds in a year" }

calculations:
  # --- Headline growth ---
  - { id: end_p, label: "ARR at the end of last year", formula: "beg_p + new_p + exp_p - churn_p - contr_p", expected: 400, unit: "$M" }
  - { id: growth_p, label: "Growth last year", formula: "end_p / beg_p - 1", expected: 0.25, unit: "%", decimals: 0 }
  - { id: end_c, label: "ARR at the end of this year", formula: "beg_c + new_c + exp_c - churn_c - contr_c", expected: 448, unit: "$M" }
  - { id: growth_c, label: "Growth this year", formula: "end_c / beg_c - 1", expected: 0.12, unit: "%", decimals: 0 }
  - { id: net_add_p, label: "Net ARR added last year", formula: "end_p - beg_p", expected: 80, unit: "$M" }
  - { id: net_add_c, label: "Net ARR added this year", formula: "end_c - beg_c", expected: 48, unit: "$M" }
  - { id: d_total, label: "Fall in net ARR added", formula: "net_add_p - net_add_c", expected: 32, unit: "$M" }
  - { id: d_new, label: "Fall in new-customer ARR", formula: "new_p - new_c", expected: 10, unit: "$M" }
  - { id: d_exp, label: "Fall in expansion ARR", formula: "exp_p - exp_c", expected: 8, unit: "$M" }
  - { id: d_loss, label: "Rise in lost ARR (churn and downgrades)", formula: "(churn_c + contr_c) - (churn_p + contr_p)", expected: 14, unit: "$M" }
  - { id: d_check, label: "Sum of the three drivers", formula: "d_new + d_exp + d_loss", expected: 32, unit: "$M" }
  # --- Retention ---
  - { id: lost_p, label: "Lost ARR last year", formula: "churn_p + contr_p", expected: 34, unit: "$M" }
  - { id: lost_c, label: "Lost ARR this year", formula: "churn_c + contr_c", expected: 48, unit: "$M" }
  - { id: grr_p, label: "Gross revenue retention last year", formula: "1 - lost_p / beg_p", expected: 0.89375, unit: "%", decimals: 1 }
  - { id: grr_c, label: "Gross revenue retention this year", formula: "1 - lost_c / beg_c", expected: 0.88, unit: "%", decimals: 1 }
  - { id: nrr_p, label: "Net revenue retention last year", formula: "(beg_p - lost_p + exp_p) / beg_p", expected: 1.04375, unit: "%", decimals: 1 }
  - { id: nrr_c, label: "Net revenue retention this year", formula: "(beg_c - lost_c + exp_c) / beg_c", expected: 0.98, unit: "%", decimals: 1 }
  # --- Price versus volume ---
  - { id: price_p, label: "Expansion from price last year", formula: "beg_p * price_rate_p", expected: 8, unit: "$M" }
  - { id: seats_p, label: "Expansion from more seats and modules last year", formula: "exp_p - price_p", expected: 40, unit: "$M" }
  - { id: price_c, label: "Expansion from price this year", formula: "beg_c * price_rate_c", expected: 24, unit: "$M" }
  - { id: seats_c, label: "Expansion from more seats and modules this year", formula: "exp_c - price_c", expected: 16, unit: "$M" }
  - { id: seat_g_p, label: "Seat-driven growth rate last year", formula: "seats_p / beg_p", expected: 0.125, unit: "%", decimals: 1 }
  - { id: seat_g_c, label: "Seat-driven growth rate this year", formula: "seats_c / beg_c", expected: 0.04, unit: "%", decimals: 1 }
  - { id: price_lost, label: "Lost ARR where price was a main reason", formula: "lost_c * price_churn", expected: 19.2, unit: "$M", decimals: 1 }
  - { id: price_net, label: "Price increase after price-related losses", formula: "price_c - price_lost", expected: 4.8, unit: "$M", decimals: 1 }
  # --- Segments ---
  - { id: smb_grr, label: "Small business gross retention", formula: "1 - smb_lost / smb_beg", expected: 0.76, unit: "%", decimals: 0 }
  - { id: smb_nrr, label: "Small business net retention", formula: "(smb_beg - smb_lost + smb_exp) / smb_beg", expected: 0.80, unit: "%", decimals: 0 }
  - { id: mm_grr, label: "Mid-market gross retention", formula: "1 - mm_lost / mm_beg", expected: 0.90, unit: "%", decimals: 0 }
  - { id: mm_nrr, label: "Mid-market net retention", formula: "(mm_beg - mm_lost + mm_exp) / mm_beg", expected: 0.9875, unit: "%", decimals: 0 }
  - { id: ent_grr, label: "Enterprise gross retention", formula: "1 - ent_lost / ent_beg", expected: 0.942857, unit: "%", decimals: 0 }
  - { id: ent_nrr, label: "Enterprise net retention", formula: "(ent_beg - ent_lost + ent_exp) / ent_beg", expected: 1.10, unit: "%", decimals: 0 }
  - { id: seg_beg, label: "Total ARR at start of year", formula: "smb_beg + mm_beg + ent_beg", expected: 400, unit: "$M" }
  - { id: seg_new, label: "Total new-customer ARR", formula: "smb_new + mm_new + ent_new", expected: 56, unit: "$M" }
  - { id: seg_exp, label: "Total expansion ARR", formula: "smb_exp + mm_exp + ent_exp", expected: 40, unit: "$M" }
  - { id: seg_lost, label: "Total lost ARR", formula: "smb_lost + mm_lost + ent_lost", expected: 48, unit: "$M" }
  # --- Investment options ---
  - { id: a_kept, label: "Option A: ARR still there after three years", formula: "a_arr * a_grr ^ 2", expected: 9.4136, unit: "$M", decimals: 1 }
  - { id: a_eff, label: "Option A: three-year ARR per dollar spent", formula: "a_kept / a_spend", expected: 0.94136, unit: "x", decimals: 2 }
  - { id: b_kept, label: "Option B: ARR still there after three years", formula: "b_arr * b_grr ^ 2", expected: 5.65504, unit: "$M", decimals: 1 }
  - { id: b_eff, label: "Option B: three-year ARR per dollar spent", formula: "b_kept / b_spend", expected: 1.131008, unit: "x", decimals: 2 }
  - { id: c_kept, label: "Option C: ARR still there after three years", formula: "c_arr * ent_grr ^ 2", expected: 10.6678, unit: "$M", decimals: 1 }
  - { id: c_eff, label: "Option C: three-year ARR per dollar spent", formula: "c_kept / c_spend", expected: 1.33347, unit: "x", decimals: 2 }
  - { id: bc_spend, label: "Spend on options B and C together", formula: "b_spend + c_spend", expected: 13, unit: "$M" }
  - { id: bc_arr, label: "Year-one ARR from options B and C together", formula: "b_arr + c_arr", expected: 18.4, unit: "$M", decimals: 1 }
  - { id: growth_new, label: "Growth rate if B and C had been in place this year", formula: "(end_c + bc_arr) / beg_c - 1", expected: 0.166, unit: "%", decimals: 1 }

answer:
  calc: growth_c
  headline: "ARR growth halved from {{growth_p}} to {{growth_c}}: churn is the biggest drag ({{d_loss}}) and a {{price_c}} price rise hides seat growth that fell from {{seats_p}} to {{seats_c}}. Fix mid-market retention and sell more to enterprise first."

exhibits:
  - id: exhibit-1
    title: "Cobalt Ledger ARR bridge, last year and this year"
    kind: table
    ask: "Here is the ARR bridge for the last two years. What changed?"
    columns: ["Item", "Last year", "This year"]
    rows:
      - ["ARR at start of year", "{{beg_p}}", "{{beg_c}}"]
      - ["New customers", "{{new_p}}", "{{new_c}}"]
      - ["Expansion", "{{exp_p}}", "{{exp_c}}"]
      - ["   of which price increases", "{{price_p}}", "{{price_c}}"]
      - ["   of which more seats and modules", "{{seats_p}}", "{{seats_c}}"]
      - ["Churn (customers who left)", "{{churn_p}}", "{{churn_c}}"]
      - ["Contraction (downgrades)", "{{contr_p}}", "{{contr_c}}"]
      - ["**ARR at end of year**", "**{{end_p}}**", "**{{end_c}}**"]
      - ["Growth", "{{growth_p}}", "{{growth_c}}"]
      - ["Net revenue retention", "{{nrr_p}}", "{{nrr_c}}"]
    note: "Illustrative data created for this practice case. Cobalt Ledger is fictional. Churn and contraction are shown as amounts lost and are subtracted in the end-of-year total."
    insight: |
      Net ARR added fell by {{d_total}}: new customers {{d_new}}, expansion {{d_exp}}, and
      losses up {{d_loss}}. Within expansion, price rose to {{price_c}} while seat growth fell from
      {{seats_p}} to {{seats_c}}. Net retention is now below 100%.
  - id: exhibit-2
    title: "This year by customer segment"
    kind: table
    ask: "The team cut this year by segment. Where is the problem?"
    columns: ["Segment", "ARR at start", "New customers", "Expansion", "Lost (churn and downgrades)", "Gross retention", "Net retention"]
    rows:
      - ["Small business", "{{smb_beg}}", "{{smb_new}}", "{{smb_exp}}", "{{smb_lost}}", "{{smb_grr}}", "{{smb_nrr}}"]
      - ["Mid-market", "{{mm_beg}}", "{{mm_new}}", "{{mm_exp}}", "{{mm_lost}}", "{{mm_grr}}", "{{mm_nrr}}"]
      - ["Enterprise", "{{ent_beg}}", "{{ent_new}}", "{{ent_exp}}", "{{ent_lost}}", "{{ent_grr}}", "{{ent_nrr}}"]
      - ["Total", "{{seg_beg}}", "{{seg_new}}", "{{seg_exp}}", "{{seg_lost}}", "{{grr_c}}", "{{nrr_c}}"]
    note: "Illustrative data created for this practice case. Lost ARR combines churn and downgrades. Segments add up to the totals in Exhibit 1."
    insight: |
      Small business loses {{smb_lost}} on {{smb_beg}} (net retention {{smb_nrr}}) but is the biggest source
      of new customers. Enterprise keeps {{ent_grr}} and expands to {{ent_nrr}} net retention.
      Mid-market sits at {{mm_nrr}}.
  - id: exhibit-3
    title: "Investment options for the next year"
    kind: table
    ask: "Management has three ways to use the next dollars. Which would you fund?"
    columns: ["Option", "Spend", "ARR added in year one", "Share of ARR kept each year", "ARR left after three years", "Three-year ARR per dollar"]
    rows:
      - ["A: more sales hires (new customers)", "{{a_spend}}", "{{a_arr}}", "{{a_grr}}", "{{a_kept}}", "{{a_eff}}"]
      - ["B: mid-market customer success (fewer losses)", "{{b_spend}}", "{{b_arr}}", "{{b_grr}}", "{{b_kept}}", "{{b_eff}}"]
      - ["C: new enterprise module (expansion)", "{{c_spend}}", "{{c_arr}}", "{{ent_grr}}", "{{c_kept}}", "{{c_eff}}"]
    note: "Illustrative data created for this practice case. ARR left after three years is year-one ARR multiplied by the share kept each year, applied twice."
    insight: |
      Option A adds the most ARR in year one but little of it lasts. Options B and C return
      {{b_eff}} and {{c_eff}} of three-year ARR per dollar, against {{a_eff}} for A.
---

## Prompt

Our client is Cobalt Ledger, a US software company that sells workflow software to finance teams on annual subscriptions. Its annual recurring revenue (ARR) reached {{end_p}} at the end of last year, a {{growth_p}} increase. This year it will end at {{end_c}}, only {{growth_c}} higher.

The chief executive is worried and the board wants a plan. She asks us: **why has growth slowed so much, and where should Cobalt invest to speed it up again?**

## Clarifying information

- Q: How does Cobalt make money?
  A: Annual subscriptions priced per seat, with optional modules. ARR is the annualized value of active subscriptions.
- Q: Has anything big changed in the market?
  A: Competition has grown, and software budgets are under pressure. Cobalt also raised list prices by {{price_rate_c}} this year, up from {{price_rate_p}} last year.
- Q: What are the customer segments?
  A: Small business, mid-market and enterprise. Segment data is in Exhibit 2; ask for it when you are ready.
- Q: Do we know why customers leave?
  A: An exit survey shows price was a main reason in about {{price_churn}} of lost ARR, followed by missing features and poor onboarding.
- Q: How much can Cobalt invest?
  A: About {{bc_spend}} of extra annual spending is available. Anything bigger needs board approval.
- Q: What is the goal?
  A: Return to growth of at least 20% within two years, without burning cash.

## Structure

> **Ask:** How would you approach this question?

Growth is the **ARR bridge**: start + new customers + expansion − churn − downgrades.

- **1. Diagnose: which part of the bridge changed**
  - New customers: volume and price per new customer, by segment and channel
  - Expansion: price increases against more seats and modules
  - Losses: churn and downgrades, by segment, by cohort, by reason
- **2. Look under the averages**
  - Net and gross retention by segment
  - Price against volume: how much of expansion is price, and what price costs in lost customers
- **3. Options and where to invest**
  - More new customers, fewer losses, more expansion
  - Value of a dollar of ARR depends on how long it stays
- **4. Risks and sequencing:** capacity, product readiness, cash, competitive response

A good hypothesis: *"With growth halving, I expect churn and slower expansion matter as much as new customers. A price rise could be hiding weakness in seat growth."*

## Math walkthrough

> **Ask:** Quantify what changed between last year and this year. Then compare the three investment options.

**1. What changed.**
Last year ARR rose from {{beg_p}} to {{end_p}}: **{{growth_p}}**. This year it rises from {{beg_c}} to {{end_c}}: **{{growth_c}}**. Net ARR added fell from {{net_add_p}} to {{net_add_c}}, a fall of **{{d_total}}**:
- New customers: {{d_new}} less
- Expansion: {{d_exp}} less
- Losses: {{d_loss}} more ({{lost_p}} to {{lost_c}})

That adds to {{d_check}}. Losses are the biggest single driver.

**2. Retention.**
Gross retention fell from {{grr_p}} to **{{grr_c}}**. Net retention fell from {{nrr_p}} to **{{nrr_c}}**: Cobalt now shrinks its base each year before counting new customers.

**3. Price is hiding something.**
Expansion barely changed, but its mix did. Price brought {{price_p}} last year and **{{price_c}}** this year. Seats and modules brought {{seats_p}} last year and only **{{seats_c}}** this year, which is seat-driven growth falling from {{seat_g_p}} to {{seat_g_c}}.
The price rise also costs customers: about {{price_churn}} of the {{lost_c}} lost, or {{price_lost}}, named price as a main reason. After that cost, the price increase delivers only about **{{price_net}}**.

**4. Segments.**
Small business keeps {{smb_grr}} of ARR each year; its net retention is {{smb_nrr}}. Mid-market gross retention is {{mm_grr}} and net retention {{mm_nrr}}. Enterprise keeps {{ent_grr}} and expands to {{ent_nrr}}.

**5. Investment options.**
Each dollar of ARR is worth more if it stays. Applying each option's retention for two further years:
- **A, sales hires:** {{a_arr}} × {{a_grr}}² = {{a_kept}} of ARR after three years; {{a_eff}} per dollar spent.
- **B, mid-market customer success:** {{b_arr}} × {{b_grr}}² = {{b_kept}}; **{{b_eff}}** per dollar.
- **C, enterprise module:** {{c_arr}} × {{ent_grr}}² = {{c_kept}}; **{{c_eff}}** per dollar.
Options B and C together cost {{bc_spend}} and add {{bc_arr}} in year one. Had they been in place this year, growth would have been about {{growth_new}} instead of {{growth_c}}.

## Synthesis

> **Ask:** What would you recommend?

**Cobalt's growth halved because it is losing more customers and selling fewer seats, with a {{price_c}} price rise covering up the weakness. It should invest in mid-market customer success (B) and an enterprise module (C) first, for {{bc_spend}} combined, rather than hiring more sales staff.**

1. **Diagnosis:** growth fell from {{growth_p}} to {{growth_c}}; losses rose by {{d_loss}}, new customers fell {{d_new}} and expansion fell {{d_exp}}. Net retention is {{nrr_c}}, so the base now shrinks.
2. **Price masks volume:** price drove {{price_c}} of expansion, but seat-driven growth fell from {{seat_g_p}} to {{seat_g_c}}, and price-related losses ({{price_lost}}) cut the net gain to {{price_net}}.
3. **Where to invest:** enterprise returns {{c_eff}} and mid-market success {{b_eff}} of three-year ARR per dollar, against {{a_eff}} for sales hires, because new small-business customers leave quickly.

**Risks and next steps:** check the customer-success estimate with a pilot on the highest-risk mid-market accounts; confirm enterprise demand for the new module with design partners before building; pause further list-price rises until seat trends recover; fix the small-business onboarding experience (the segment with the highest losses and the most new customers); and track gross retention monthly as the lead indicator. Growth to 20% will take both better retention and stronger expansion.

## Common mistakes

- Looking only at new-customer growth and missing the rise in losses.
- Treating expansion as one number when most of it this year came from price, not seats.
- Comparing investment options by year-one ARR without asking how long each dollar of ARR stays.
- Blending segments, so enterprise strength hides small-business weakness.

## What top candidates do differently

- Start from the ARR bridge and split the change into pieces that add up.
- Separate price from volume and ask what the price rise costs in lost customers.
- Use retention by segment and cohort to decide where a dollar of growth lasts.
- Close with a sequenced plan and a small number of metrics to track.

## Creative question

Beyond the three options, how could Cobalt improve retention of small-business customers without a large spend?

## Model answer

Group ideas by **onboarding, pricing and product**:

- **Onboarding:** a guided setup in the first 30 days; a template library for common finance workflows; automated emails that flag customers who have not used key features.
- **Pricing:** a monthly plan and an annual plan with a discount so small customers can start small; a lower entry tier, with a path to modules; no price increase for customers in their first year.
- **Product:** integrations with popular accounting tools that make the software harder to leave; self-service help and community forums that lower support cost.

A top candidate prioritizes: "Small business loses {{smb_lost}} a year, so onboarding that raises gross retention from {{smb_grr}} would be worth more than a similar spend on new customers. I would test a guided setup with one cohort and compare its retention."
