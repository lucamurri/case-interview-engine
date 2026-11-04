---
id: telehealth-medicare-advantage
title: "House Calls 2.0: A Telehealth Platform Targeting Medicare Advantage"
client: "Hearthline Health (fictional), a US virtual-care company serving employer health plans"
summary: "A telehealth company that serves working-age patients wants to sell a chronic-care program to Medicare Advantage plans. How many plans does it need, who should pay, and how should the contract work?"
industry: pharma-healthcare
sub_industry: "Digital health / Medicare Advantage"
type: market-entry
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real market or program data.
inputs:
  ma_members_m:     { value: 30,     unit: "million", label: "Medicare Advantage members in the US" }
  high_need_share:  { value: 0.40,   unit: "%",       label: "Share of members with two or more chronic conditions" }
  fee_pmpm:         { value: 50,     unit: "$PMPM",   label: "Proposed fee per enrolled member per month" }
  cost_pmpm:        { value: 35,     unit: "$PMPM",   label: "Cost to serve per enrolled member per month (nurses, devices, support)" }
  fixed_cost:       { value: 9,      unit: "$M",      label: "Annual fixed cost of a Medicare business (compliance, senior-friendly product, plan sales team)" }
  plan_members:     { value: 250000, unit: "members", label: "Members in a typical target health plan" }
  enroll_rate:      { value: 0.20,   unit: "%",       label: "Share of eligible members who enroll in the program" }
  pipeline_plans:   { value: 6,      unit: "plans",   label: "Plans in active sales talks" }
  win_rate:         { value: 0.50,   unit: "%",       label: "Expected win rate on those talks" }
  enroll_target:    { value: 0.25,   unit: "%",       label: "Enrollment rate with better outreach (upside case)" }
  b2c_price:        { value: 30,     unit: "$PMPM",   label: "Price seniors say they would pay out of pocket per month" }
  baseline_cost:    { value: 1500,   unit: "$PMPM",   label: "Medical cost of a member with two or more chronic conditions per month" }
  savings_comm:     { value: 0.06,   unit: "%",       label: "Medical cost reduction, employer program (year 3)" }
  savings_senior:   { value: 0.05,   unit: "%",       label: "Medical cost reduction, senior pilot (9 months)" }
  savings_low:      { value: 0.03,   unit: "%",       label: "Downside case for medical cost reduction" }
  base_fee:         { value: 20,     unit: "$PMPM",   label: "Base fee in the shared-savings offer" }
  gain_share:       { value: 0.50,   unit: "%",       label: "Hearthline's share of medical savings in the shared-savings offer" }

calculations:
  # --- Market size ---
  - { id: high_need_m, label: "Members with two or more chronic conditions", formula: "ma_members_m * high_need_share", expected: 12, unit: "million" }
  - { id: tam, label: "Addressable market at the proposed fee (annual)", formula: "high_need_m * fee_pmpm * 12 / 1000", expected: 7.2, unit: "$B", decimals: 1 }
  # --- One plan ---
  - { id: plan_eligible, label: "Eligible members in a typical plan", formula: "plan_members * high_need_share", expected: 100000, unit: "members" }
  - { id: plan_enrolled, label: "Enrolled members in a typical plan", formula: "plan_eligible * enroll_rate", expected: 20000, unit: "members" }
  - { id: contrib_pmpm, label: "Contribution per enrolled member per month", formula: "fee_pmpm - cost_pmpm", expected: 15, unit: "$PMPM" }
  - { id: contrib_yr, label: "Contribution per enrolled member per year", formula: "contrib_pmpm * 12", expected: 180, unit: "$" }
  - { id: plan_rev, label: "Annual revenue from a typical plan", formula: "plan_enrolled * fee_pmpm * 12 / 1e6", expected: 12, unit: "$M" }
  - { id: plan_contrib, label: "Annual contribution from a typical plan", formula: "plan_enrolled * contrib_yr / 1e6", expected: 3.6, unit: "$M", decimals: 1 }
  # --- Break-even ---
  - { id: be_members, label: "Enrolled members needed to break even", formula: "fixed_cost * 1e6 / contrib_yr", expected: 50000, unit: "members" }
  - { id: be_plans, label: "Typical plans needed to break even", formula: "be_members / plan_enrolled", expected: 2.5, unit: "plans", decimals: 1 }
  - { id: expected_plans, label: "Plans expected from the pipeline", formula: "pipeline_plans * win_rate", expected: 3, unit: "plans", decimals: 0 }
  - { id: profit_expected, label: "Annual profit with the expected plans", formula: "expected_plans * plan_contrib - fixed_cost", expected: 1.8, unit: "$M", decimals: 1 }
  - { id: be_plans_target, label: "Plans needed to break even at the upside enrollment rate", formula: "be_members / (plan_eligible * enroll_target)", expected: 2, unit: "plans", decimals: 0 }
  # --- Direct-to-consumer alternative ---
  - { id: b2c_loss, label: "Loss per member per month if seniors pay directly", formula: "cost_pmpm - b2c_price", expected: 5, unit: "$PMPM" }
  # --- Is the fee worth it to the plan? ---
  - { id: plan_savings, label: "Plan's medical savings per enrolled member per month (senior pilot)", formula: "baseline_cost * savings_senior", expected: 75, unit: "$PMPM" }
  - { id: plan_roi, label: "Plan's return: savings per $1 of fee", formula: "plan_savings / fee_pmpm", expected: 1.5, unit: "x", decimals: 1 }
  # --- Shared-savings offer ---
  - { id: hybrid_rev, label: "Hearthline revenue per member per month, shared savings at pilot result", formula: "base_fee + gain_share * baseline_cost * savings_senior", expected: 57.5, unit: "$PMPM", decimals: 2 }
  - { id: hybrid_rev_low, label: "Hearthline revenue per member per month, shared savings in downside case", formula: "base_fee + gain_share * baseline_cost * savings_low", expected: 42.5, unit: "$PMPM", decimals: 2 }
  - { id: be_savings, label: "Savings rate at which shared savings equals the flat fee", formula: "(fee_pmpm - base_fee) / (gain_share * baseline_cost)", expected: 0.04, unit: "%" }

answer:
  calc: be_plans
  headline: "Enter Medicare Advantage by selling to health plans: Hearthline breaks even at {{be_plans}}, and its pipeline should deliver about {{expected_plans}}."

exhibits:
  - id: exhibit-1
    title: "Program economics for a typical Medicare Advantage plan"
    kind: table
    ask: "Here is what the team has gathered on a typical target plan. How many plans does Hearthline need to break even?"
    columns: ["Item", "Value"]
    rows:
      - ["Members in the plan", "{{plan_members}}"]
      - ["Share with two or more chronic conditions (eligible)", "{{high_need_share}}"]
      - ["Share of eligible members who enroll", "{{enroll_rate}}"]
      - ["Proposed fee", "{{fee_pmpm}}"]
      - ["Cost to serve", "{{cost_pmpm}}"]
      - ["Fixed cost of a Medicare business", "{{fixed_cost}} per year"]
      - ["Sales pipeline", "{{pipeline_plans}} in talks, expected win rate {{win_rate}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Only a fifth of eligible members enroll, so each plan brings
      {{plan_enrolled}} — the fixed cost has to be spread over a few plans.
  - id: exhibit-2
    title: "Reduction in total medical cost for enrolled members versus a matched comparison group"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "This is Hearthline's evidence that the program saves money. What does it mean for the contract?"
    data:
      - { label: "Employer program, year 1", value: 0.04 }
      - { label: "Employer program, year 2", value: 0.05 }
      - { label: "Employer program, year 3", value: savings_comm }
      - { label: "Senior pilot, 9 months (1,000 members)", value: savings_senior }
    note: "Illustrative data created for this practice case; not results from a real program."
    insight: |
      Savings build over time in the employer program, and the small senior
      pilot looks promising. But the senior evidence is short and small —
      a plan will want proof, and Hearthline should be careful about betting
      its revenue on it.
---

## Prompt

Our client, Hearthline Health, runs a virtual-care program for people with chronic conditions such as diabetes, heart failure and high blood pressure: remote monitoring devices at home, a dedicated nurse and on-demand video visits. Today it sells only to employers and their health plans, which cover people of working age.

Hearthline wants to grow by serving **Medicare Advantage** — private health plans that cover millions of Americans over 65 and are paid a fixed amount per member by the government, so they gain when their members stay healthy. The CEO has asked us: **should Hearthline enter Medicare Advantage, and how?**

## Clarifying information

- Q: What is Hearthline's goal?
  A: Break even on its Medicare business within the first full year of operation, then grow. It has funding for one major new market.
- Q: Who would pay for the program?
  A: That is part of the question. Options are the health plans (Hearthline is paid a fee per enrolled member per month, known as **PMPM**) or seniors themselves.
- Q: Why would a Medicare Advantage plan care?
  A: Plans receive a fixed payment per member, so every dollar of medical cost they avoid (hospital stays, emergency visits) is theirs to keep. They also earn quality bonuses for good member outcomes.
- Q: What is different about seniors?
  A: More chronic conditions and higher medical costs, but less comfort with technology. Hearthline would need simpler devices, phone support and in-home setup — part of the higher cost to serve.
- Q: Are there other entry routes?
  A: The team has also looked at acquiring a company that does in-home visits for seniors, but it would cost well over $100M. The CEO prefers to start organically.

## Structure

> **Ask:** How would you structure this decision?

- **1. Is the market attractive?**
  - Size: members with chronic conditions × what a plan would pay
  - Growth of Medicare Advantage and plans' appetite for cost-saving programs
  - Competition: other virtual-care companies, plans' own nurse programs
- **2. Who pays, and does the model make money?**
  - Health plans (PMPM fee) versus seniors paying out of pocket
  - Contribution per member, fixed cost, break-even number of plans
- **3. Is the program worth it to the buyer?**
  - Medical savings per member versus the fee (the plan's return)
  - Strength of the evidence for seniors
- **4. How should Hearthline enter?**
  - Contract type: flat fee versus shared savings
  - Build organically versus acquire a senior-care provider
  - Which plans to start with
- **5. Risks:** technology adoption by seniors, regulation, plan sales cycles

A strong candidate notes that this is a **B2B2C** decision: the plan is the buyer, but seniors must enroll and stay engaged for anyone to save money.

## Math walkthrough

> **Ask:** First, roughly how big is the opportunity? Then, using Exhibit 1, how many plans does Hearthline need to break even? Finally, would it work to sell directly to seniors instead?

**1. Market size.** 30M members × {{high_need_share}} with two or more chronic conditions ≈ **{{high_need_m}}** potential users. At the proposed fee: 12M × $50 × 12 ≈ **{{tam}}** a year. Large enough to matter — even a small share is a big business for Hearthline.

**2. One plan (Exhibit 1).**
Eligible members = 250,000 × 40% = **{{plan_eligible}}**. Enrolled = 100,000 × 20% = **{{plan_enrolled}}**.
Contribution = $50 − $35 = **{{contrib_pmpm}}**, or {{contrib_yr}} per member per year.
One plan brings revenue of 20,000 × $50 × 12 = **{{plan_rev}}** and contribution of 20,000 × $180 = **{{plan_contrib}}**.

**3. Break-even.** Members needed = $9M ÷ $180 = **{{be_members}}**, i.e. 50,000 ÷ 20,000 = **{{be_plans}}**.
The pipeline should deliver 6 × 50% = **{{expected_plans}}**, which gives annual profit of 3 × $3.6M − $9M = **{{profit_expected}}**. That clears break-even, but with little room to spare.

**4. Selling directly to seniors.** Seniors would pay about {{b2c_price}}, below the {{cost_pmpm}} cost to serve — a loss of **{{b2c_loss}}** on every member before any marketing cost. Direct-to-consumer does not work; the plan must be the payer.

> **Ask:** Now look at Exhibit 2. Is the {{fee_pmpm}} fee good value for a plan? And one plan has asked for a shared-savings contract instead: a base fee of {{base_fee}} plus {{gain_share}} of verified medical savings. Should Hearthline accept?

**5. The plan's return.** Using the senior pilot, savings = $1,500 × 5% = **{{plan_savings}}**, against a fee of {{fee_pmpm}}. The plan gets **{{plan_roi}}** back for every dollar — a sellable case, if the pilot result holds.

**6. Shared savings.**
- At the pilot result: $20 + 50% × $75 = **{{hybrid_rev}}**, more than the flat fee.
- In a downside case of {{savings_low}} savings: $20 + 50% × ($1,500 × 3%) = **{{hybrid_rev_low}}** — barely above the {{cost_pmpm}} cost to serve.
- Break-even savings rate = ($50 − $20) ÷ (50% × $1,500) = **{{be_savings}}**. The pilot ({{savings_senior}}) is above it, but only just, and on a small, short sample.

## Synthesis

> **Ask:** The CEO wants a recommendation in two minutes. What do you say?

**Hearthline should enter Medicare Advantage by selling its program to health plans on a flat {{fee_pmpm}} fee: it breaks even at {{be_plans}}, its pipeline should deliver about {{expected_plans}}, and plans earn {{plan_roi}} back on every dollar they spend.**

1. **The market is large:** about {{high_need_m}} seniors with multiple chronic conditions, worth roughly {{tam}} a year at the proposed fee.
2. **The plan must be the payer:** seniors would pay less than the cost to serve, while plans keep every dollar of medical cost avoided.
3. **Start with a flat fee and keep shared savings as an option:** shared savings only beats the flat fee if savings exceed {{be_savings}}, and the senior evidence is thin. Offer shared savings to one anchor plan as a sign of confidence, and widen it once a year of senior data is in.

**Risks and next steps:** with about {{profit_expected}} of profit on {{expected_plans}}, losing one deal pushes Hearthline below break-even, so it should work the pipeline hard and lift enrollment above {{enroll_rate}} (for example through in-home setup and outreach by the plan). Run a larger senior study with a plan partner, and design the product for low-tech users before launch.

## Common mistakes

- Sizing the market on all {{ma_members_m}} members instead of the {{high_need_share}} with chronic conditions, or forgetting that only {{enroll_rate}} of eligible members enroll.
- Mixing up monthly and annual figures — PMPM fees must be multiplied by 12.
- Recommending the shared-savings contract because it pays more at the pilot result, without asking how solid the evidence is.
- Ignoring the buyer's return: a fee that is profitable for Hearthline but costs a plan more than it saves will not be renewed.

## What top candidates do differently

- Identify the plan as the economic buyer early and test the deal from **both** sides: Hearthline's break-even and the plan's return.
- Turn the contract question into a single number — the {{be_savings}} break-even savings rate — and compare it with the evidence.
- Notice how thin the margin of safety is ({{expected_plans}} expected versus {{be_plans}} needed) and suggest how to widen it.
- Treat acquisition as a later option, once the organic entry has proven the model.

## Creative question

Seniors are often less comfortable with technology. How could Hearthline get more of the eligible members to enroll and stay engaged?

## Model answer

A strong answer works through the member journey:

- **Getting them in:** outreach through the member's own doctor and the health plan (trusted voices), rather than cold marketing; enrollment by phone, not only by app.
- **Getting set up:** devices that work out of the box over cellular networks, with no Wi-Fi or smartphone needed; in-home or phone setup support.
- **Staying engaged:** the same nurse every time, regular check-in calls, and involving family caregivers with their permission.
- **Making it feel worthwhile:** simple progress reports, fewer trips to the doctor, and small rewards that plans are allowed to offer.

A top candidate links this back to the math: "If enrollment rose from {{enroll_rate}} to {{enroll_target}}, Hearthline would break even at {{be_plans_target}} instead of {{be_plans}} — better engagement is as valuable as winning more deals."
