---
id: gene-therapy-pricing
title: "One and Done: Pricing a Rare-Disease Gene Therapy"
client: "Marrowgate Bio (fictional), a US biotech company launching its first gene therapy"
summary: "A one-time gene therapy could replace a lifetime of costly infusions. Its value supports a multimillion-dollar price, but payers balk at the upfront bill. Find the price — and the payment structure that gets it paid."
industry: pharma-healthcare
sub_industry: "Biotech / rare disease market access"
type: pricing
difficulty: advanced
format: candidate-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real drug, price or trial data.
inputs:
  factor_cost:        { value: 0.45, unit: "$M",       label: "Today's preventive infusions per patient per year", decimals: 2 }
  hosp_cost:          { value: 0.05, unit: "$M",       label: "Bleed-related hospital and emergency costs per patient per year", decimals: 2 }
  response_rate:      { value: 0.80, unit: "%",        label: "Treated patients who no longer need infusions" }
  horizon:            { value: 10,   unit: "years",    label: "Time horizon payers will credit" }
  qaly_gain:          { value: 2.5,  unit: "QALYs",    label: "Quality-adjusted life years gained per responder over 10 years", decimals: 1 }
  wtp_qaly:           { value: 100,  unit: "$K",       label: "Value payers place on one QALY" }
  list_price:         { value: 3.5,  unit: "$M",       label: "Price the commercial team proposes (one upfront payment)", decimals: 1 }
  payer_max_upfront:  { value: 2.5,  unit: "$M",       label: "Highest single upfront price payers say they would accept", decimals: 1 }
  patients_y1:        { value: 400,  unit: "patients", label: "Patients expected to be treated in the first year" }
  upfront_fee:        { value: 1.0,  unit: "$M",       label: "Outcomes-based option: payment at treatment", decimals: 1 }
  annual_fee:         { value: 0.5,  unit: "$M",       label: "Outcomes-based option: payment per year while the patient stays off infusions", decimals: 1 }
  annuity_years:      { value: 5,    unit: "years",    label: "Outcomes-based option: number of annual payments" }
  cogs:               { value: 0.4,  unit: "$M",       label: "Cost to manufacture one treatment", decimals: 1 }

calculations:
  # --- Value to the health system ---
  - { id: annual_offset, label: "Cost avoided per responder per year", formula: "factor_cost + hosp_cost", expected: 0.5, unit: "$M", decimals: 1 }
  - { id: expected_offset_yr, label: "Expected cost avoided per treated patient per year", formula: "response_rate * annual_offset", expected: 0.4, unit: "$M", decimals: 1 }
  - { id: offset_10y, label: "Expected cost avoided per treated patient over 10 years", formula: "response_rate * annual_offset * horizon", expected: 4.0, unit: "$M", decimals: 1 }
  - { id: qaly_value, label: "Value of health gains per treated patient", formula: "response_rate * qaly_gain * wtp_qaly / 1000", expected: 0.2, unit: "$M", decimals: 1 }
  - { id: value_ceiling, label: "Total value per treated patient (10-year view)", formula: "offset_10y + qaly_value", expected: 4.2, unit: "$M", decimals: 1 }
  - { id: value_capture, label: "Share of value captured by the proposed price", formula: "list_price / value_ceiling", expected: 0.8333, unit: "%", decimals: 0 }
  - { id: value_multiple_cogs, label: "Proposed price versus cost to manufacture", formula: "list_price / cogs", expected: 8.75, unit: "x", decimals: 1 }
  # --- The payer's problem with one upfront price ---
  - { id: payer_net_upfront, label: "Payer's 10-year net saving at the proposed upfront price", formula: "offset_10y - list_price", expected: 0.5, unit: "$M", decimals: 1 }
  - { id: payer_be_years, label: "Years before the payer's savings cover the upfront price", formula: "list_price / expected_offset_yr", expected: 8.75, unit: "years", decimals: 2 }
  - { id: budget_y1, label: "Year-1 spend on the first-year cohort at the proposed price", formula: "patients_y1 * list_price", expected: 1400, unit: "$M" }
  - { id: budget_today, label: "Today's annual spend on the same patients", formula: "patients_y1 * annual_offset", expected: 200, unit: "$M" }
  - { id: budget_multiple, label: "Year-1 spend versus today's annual spend", formula: "budget_y1 / budget_today", expected: 7, unit: "x", decimals: 0 }
  # --- Outcomes-based annuity ---
  - { id: annuity_max, label: "Most Marrowgate can earn per patient under the outcomes-based option", formula: "upfront_fee + annual_fee * annuity_years", expected: 3.5, unit: "$M", decimals: 1 }
  - { id: annuity_expected, label: "Expected revenue per treated patient, outcomes-based (effect lasts 5+ years)", formula: "upfront_fee + response_rate * annual_fee * annuity_years", expected: 3.0, unit: "$M", decimals: 1 }
  - { id: annuity_premium, label: "Expected gain per patient versus the payers' upfront ceiling", formula: "annuity_expected - payer_max_upfront", expected: 0.5, unit: "$M", decimals: 1 }
  - { id: be_durability, label: "Years the effect must last for the annuity to beat the upfront ceiling", formula: "(payer_max_upfront - upfront_fee) / (response_rate * annual_fee)", expected: 3.75, unit: "years", decimals: 2 }
  - { id: payer_net_annuity, label: "Payer's 10-year net saving, outcomes-based", formula: "offset_10y - annuity_expected", expected: 1.0, unit: "$M", decimals: 1 }
  # --- Cohort view ---
  - { id: cohort_upfront, label: "Revenue from the first-year cohort at the payers' upfront ceiling", formula: "patients_y1 * payer_max_upfront", expected: 1000, unit: "$M" }
  - { id: cohort_annuity, label: "Expected revenue from the first-year cohort, outcomes-based", formula: "patients_y1 * annuity_expected", expected: 1200, unit: "$M" }
  - { id: cash_y1_annuity, label: "Cash received in year 1 from that cohort, outcomes-based", formula: "patients_y1 * (upfront_fee + response_rate * annual_fee)", expected: 560, unit: "$M" }

answer:
  calc: annuity_expected
  headline: "Set the price at {{annuity_max}} — about {{value_capture}} of the therapy's value — paid as {{upfront_fee}} upfront plus {{annual_fee}} a year while it works: expected {{annuity_expected}} per patient versus {{payer_max_upfront}} upfront."

exhibits:
  - id: exhibit-1
    title: "Today's treatment costs and the gene therapy's clinical results"
    kind: table
    ask: "Here is what the team knows about the current standard of care and the trial results. What is the therapy worth?"
    columns: ["Item", "Value"]
    rows:
      - ["Preventive infusions (today's standard of care)", "{{factor_cost}} per patient per year, for life"]
      - ["Bleed-related hospital and emergency costs", "{{hosp_cost}} per patient per year"]
      - ["Patients who no longer need infusions after one treatment", "{{response_rate}}"]
      - ["Health gain per responder over 10 years", "{{qaly_gain}}"]
      - ["Value payers typically place on one QALY", "{{wtp_qaly}}"]
      - ["Time horizon payers will credit", "{{horizon}}"]
    note: "Illustrative data created for this practice case; not real trial or cost data."
    insight: |
      Most of the value is avoided infusion costs; the health gain adds a
      smaller amount on top. Non-responders still cost the payer the full
      price, so value must be calculated per *treated* patient, not per
      responder.
  - id: exhibit-2
    title: "Share of treated patients still off infusions, by years since treatment"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "How long does the effect last?"
    data:
      - { label: "Year 1", value: response_rate }
      - { label: "Year 2", value: 0.80 }
      - { label: "Year 3", value: 0.79 }
      - { label: "Year 4", value: 0.78 }
    note: "Illustrative data created for this practice case; trial follow-up ends at year 4."
    insight: |
      The effect looks stable at about {{response_rate}} — but there is no
      data beyond year 4. Payers are being asked to pay for ten years of
      savings on four years of evidence.
  - id: exhibit-3
    title: "Payer research and an outcomes-based payment option"
    kind: table
    ask: "Payers have reacted to the proposed price. Here is what they said, and an alternative structure the team has drafted. What would you recommend?"
    columns: ["Topic", "Detail"]
    rows:
      - ["Highest single upfront price payers would accept", "~{{payer_max_upfront}}, citing uncertainty about how long the effect lasts"]
      - ["Main payer concerns", "Size of the upfront bill; paying full price for patients who do not respond"]
      - ["Patients expected to be treated in year 1", "{{patients_y1}}"]
      - ["Outcomes-based option", "{{upfront_fee}} at treatment, then {{annual_fee}} a year for up to {{annuity_years}}, paid only while the patient stays off infusions"]
    note: "Illustrative data created for this practice case."
    insight: |
      The annual payment equals the cost each responder avoids every year,
      so after the first payment the payer is roughly budget-neutral on
      patients who respond — and pays nothing more for those who do not.
---

## Prompt

Our client, Marrowgate Bio, is about to launch its first product: **Veridane**, a one-time gene therapy for a severe inherited bleeding disorder. Today, patients prevent dangerous bleeds by infusing a clotting-factor medicine several times a week, for life — one of the most expensive chronic treatments in medicine.

In trials, most patients treated with a single dose of Veridane stopped needing infusions. The commercial team has proposed a US price of **{{list_price}}** per patient. The CEO has asked us: **what price should Marrowgate set, and how should payers pay it?**

## Clarifying information

- Q: What is Marrowgate's objective?
  A: Maximize the value it earns from the therapy while getting broad, fast access — a high price that payers block is worth little. Veridane is the company's only product, so cash flow also matters.
- Q: Who pays?
  A: Mainly US health insurers and employer plans (together "payers"). Each patient's treatment is a single, very large claim.
- Q: Are there competing gene therapies?
  A: One competitor has a similar therapy in late-stage trials, likely 2–3 years behind. For now, the alternative is lifelong infusions.
- Q: How many patients are there?
  A: A few thousand in the US. About **{{patients_y1}}** are expected to be treated in the first year, as specialist centers ramp up.
- Q: What does it cost to make?
  A: About **{{cogs}}** per treatment — complex, but small relative to the value. Cost is a floor, not a guide to price.
- Q: Do patients stay with the same insurer?
  A: Not always — many switch plans every few years, so the payer who pays for the treatment may not be the one who enjoys all of the later savings. This is one reason payers dislike large upfront prices.

## Structure

> **Ask:** How would you approach pricing this therapy?

A value-based pricing structure, followed by "how will this actually get paid":

- **1. What is the therapy worth? (value ceiling)**
  - Costs avoided: infusions, bleed-related hospital care
  - Health gains (quality-adjusted life years, or QALYs — a measure combining length and quality of life) at the value payers place on them
  - Adjusted for patients who do not respond, over the horizon payers credit
- **2. What will payers accept? (willingness and ability to pay)**
  - Net savings and how long until they appear
  - Budget impact in the launch year
  - Confidence in durability (Exhibit 2)
- **3. What are the floors and reference points?**
  - Cost to manufacture
  - Competitor timing and expected price
- **4. Payment structure**
  - Single upfront price versus outcomes-based payments over time (an "annuity")
  - Expected revenue, risk and cash-flow timing for Marrowgate
- **5. Recommendation and risks**

Top candidates say early that **the price and the payment structure are linked**: a high price can be acceptable if payers only pay while the therapy works.

## Math walkthrough

> **Ask:** What is Veridane worth per treated patient, can payers accept it as a single upfront price, and how does the outcomes-based option compare?

**1. Value per treated patient (Exhibit 1).**
- Cost avoided per responder = $0.45M + $0.05M = **{{annual_offset}}** a year.
- Per treated patient (only 80% respond): 80% × $0.5M × 10 years = **{{offset_10y}}**.
- Health gains: 80% × 2.5 QALYs × $100K = **{{qaly_value}}**.
- **Value ceiling = $4.0M + $0.2M = {{value_ceiling}}.** The proposed {{list_price}} captures **{{value_capture}}** of that value — in line with value-based pricing, which leaves some value to the health system. It is also {{value_multiple_cogs}} the manufacturing cost, so cost is not the constraint.

**2. The payer's view of a single upfront price.**
- Expected savings per treated patient = 80% × $0.5M = {{expected_offset_yr}} a year, so the payer needs $3.5M ÷ $0.4M ≈ **{{payer_be_years}}** to break even — and many patients will have switched insurer by then.
- Ten-year net saving = $4.0M − $3.5M = **{{payer_net_upfront}}** per patient, on four years of durability data (Exhibit 2).
- Budget impact: 400 × $3.5M = **{{budget_y1}}** in year 1, against {{budget_today}} spent on those patients today — **{{budget_multiple}}** today's annual spend, all at once.

This explains Exhibit 3: payers will only accept about {{payer_max_upfront}} upfront.

**3. The outcomes-based option (Exhibit 3).**
- Maximum = $1.0M + 5 × $0.5M = **{{annuity_max}}** — the same headline price.
- Expected (only responders trigger annual payments): $1.0M + 80% × $0.5M × 5 = **{{annuity_expected}}** per treated patient.
- That is **{{annuity_premium}}** more per patient than the {{payer_max_upfront}} upfront ceiling, and the payer still saves {{payer_net_annuity}} over ten years (versus {{payer_net_upfront}} at the proposed upfront price).

**4. How much durability does Marrowgate need?** The annuity beats the upfront ceiling if ($2.5M − $1.0M) ÷ (80% × $0.5M) ≈ **{{be_durability}}** of annual payments are earned. Exhibit 2 shows it holding through year 4, and Marrowgate knows its data better than payers do, so it is well placed to take this risk.

**5. Cohort and cash timing.** For the first-year cohort: {{cohort_annuity}} expected under the annuity versus {{cohort_upfront}} upfront — but only **{{cash_y1_annuity}}** arrives in year 1. Marrowgate must be able to fund that gap.

## Synthesis

> **Ask:** What price and payment structure do you recommend to the CEO?

**Marrowgate should keep a headline price of {{annuity_max}} — about {{value_capture}} of the therapy's {{value_ceiling}} value — but offer it as an outcomes-based payment of {{upfront_fee}} at treatment plus {{annual_fee}} a year for up to five years while the patient stays off infusions; this is worth an expected {{annuity_expected}} per patient, versus the {{payer_max_upfront}} payers would pay upfront.**

1. **The value supports the price:** avoided infusions alone are worth {{offset_10y}} per treated patient over ten years, before counting health gains.
2. **A single upfront payment does not work for payers:** it takes {{payer_be_years}} to break even and makes year-1 spend {{budget_multiple}} today's, which is why they cap it at {{payer_max_upfront}}.
3. **The annuity shares the risk sensibly:** payers pay nothing more for non-responders and are roughly budget-neutral on responders; Marrowgate wins as long as the effect lasts beyond {{be_durability}}, which its data support.

**Risks and next steps:** cash flow — only {{cash_y1_annuity}} of the first cohort's revenue arrives in year 1, so secure financing or sell the receivables; tracking outcomes when patients switch insurers (the contract must follow the patient); government price-reporting rules for outcomes-based contracts; the competitor's launch price. Next: pilot the contract with two or three large payers and build the outcome-tracking registry.

## Common mistakes

- Pricing on manufacturing cost: at {{cogs}} per treatment, cost-plus pricing would leave billions of dollars of value on the table.
- Calculating value per **responder** instead of per **treated** patient — the payer pays for non-responders too.
- Stopping at "the value is {{value_ceiling}}, so charge {{list_price}}" without asking whether payers can afford and believe it.
- Treating the annuity as a discount. Its expected value ({{annuity_expected}}) is higher than the upfront price payers would accept.

## What top candidates do differently

- Separate the **price** (what the therapy is worth) from the **payment structure** (how and when it is paid) — then show the structure unlocks the price.
- Calculate the durability break-even ({{be_durability}}) and use Exhibit 2 to argue Marrowgate should take that risk.
- Raise payer churn: savings in years 5–10 may go to a different insurer, which is why the payer's break-even of {{payer_be_years}} is so unattractive.
- Flag cash timing and discounting: money received in years 2–5 is worth less today, so the expected advantage of the annuity shrinks a little on a present-value basis.

## Creative question

Beyond pricing, what could Marrowgate do to make it easier for payers and treatment centers to say yes to Veridane?

## Model answer

A strong answer works across the stakeholders:

- **Payers:** a warranty that refunds part of the price if the effect is lost; an outcomes registry run by an independent third party; contracts that can transfer when a patient changes insurer.
- **Treatment centers:** help with the complex logistics of gene therapy (patient testing, scheduling, reimbursement paperwork), and fair payment so centers are not out of pocket.
- **Patients:** support programs that cover travel to specialist centers and help with insurance approvals.
- **Evidence:** keep following trial patients beyond year 4 and publish results, which directly reduces the uncertainty payers are pricing in.

A top candidate prioritizes: "Long-term data is the single biggest lever — every extra year of proven durability raises the price payers will accept."
