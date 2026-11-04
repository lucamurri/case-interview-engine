---
id: hospital-ed-losses
title: "Code Red: Emergency-Department Losses at a Regional Hospital System"
client: "Ridgeholm Health (fictional), a nonprofit four-hospital system in the Midwest"
summary: "The emergency department swung from a small profit to a $26M loss in two years. Find the cause, then decide whether the CFO's staffing cut is the right fix."
industry: pharma-healthcare
sub_industry: "Hospitals / provider economics"
type: profitability
difficulty: advanced
format: candidate-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real hospital data.
inputs:
  visits_23:      { value: 200,  unit: "thousand", label: "ED visits, FY2023" }
  visits_25:      { value: 180,  unit: "thousand", label: "ED visits, FY2025" }
  price_comm:     { value: 900,  unit: "$/visit", label: "Net revenue per visit, commercial insurance" }
  price_mcr:      { value: 500,  unit: "$/visit", label: "Net revenue per visit, Medicare" }
  price_mcd:      { value: 300,  unit: "$/visit", label: "Net revenue per visit, Medicaid" }
  price_sp:       { value: 100,  unit: "$/visit", label: "Net revenue per visit, self-pay (uninsured)" }
  mix_comm_23:    { value: 0.40, unit: "%", label: "Commercial share of visits, FY2023" }
  mix_mcr_23:     { value: 0.20, unit: "%", label: "Medicare share of visits, FY2023" }
  mix_mcd_23:     { value: 0.30, unit: "%", label: "Medicaid share of visits, FY2023" }
  mix_sp_23:      { value: 0.10, unit: "%", label: "Self-pay share of visits, FY2023" }
  mix_comm_25:    { value: 0.25, unit: "%", label: "Commercial share of visits, FY2025" }
  mix_mcr_25:     { value: 0.20, unit: "%", label: "Medicare share of visits, FY2025" }
  mix_mcd_25:     { value: 0.40, unit: "%", label: "Medicaid share of visits, FY2025" }
  mix_sp_25:      { value: 0.15, unit: "%", label: "Self-pay share of visits, FY2025" }
  var_cost:       { value: 160,  unit: "$/visit", label: "Variable cost per visit (supplies, labs, imaging)" }
  fixed_23:       { value: 76,   unit: "$M", label: "Fixed ED cost (24/7 staffing, facility), FY2023" }
  fixed_25:       { value: 80,   unit: "$M", label: "Fixed ED cost, FY2025" }
  admit_rate:     { value: 0.20, unit: "%", label: "Share of ED visits admitted to the hospital" }
  admit_contrib:  { value: 3500, unit: "$/admission", label: "Inpatient contribution per admission (after variable cost)" }
  staff_cut:      { value: 6,    unit: "$M", label: "Savings from the CFO's proposed ED staffing cut" }
  visit_loss:     { value: 0.05, unit: "%", label: "Visits expected to be lost from the staffing cut" }
  enroll_share:   { value: 0.50, unit: "%", label: "Share of self-pay visits that could be enrolled in Medicaid" }
  recapture:      { value: 15,   unit: "thousand", label: "Low-acuity commercial visits a fast-track lane could win back" }
  fast_track_rev: { value: 600,  unit: "$/visit", label: "Net revenue per fast-track commercial visit" }

calculations:
  # --- Revenue per visit and the ED P&L ---
  - { id: rev_visit_23, label: "Average net revenue per visit, FY2023", formula: "mix_comm_23 * price_comm + mix_mcr_23 * price_mcr + mix_mcd_23 * price_mcd + mix_sp_23 * price_sp", expected: 560, unit: "$/visit" }
  - { id: rev_visit_25, label: "Average net revenue per visit, FY2025", formula: "mix_comm_25 * price_comm + mix_mcr_25 * price_mcr + mix_mcd_25 * price_mcd + mix_sp_25 * price_sp", expected: 460, unit: "$/visit" }
  - { id: rev_23, label: "ED net revenue, FY2023", formula: "visits_23 * rev_visit_23 / 1000", expected: 112, unit: "$M" }
  - { id: rev_25, label: "ED net revenue, FY2025", formula: "visits_25 * rev_visit_25 / 1000", expected: 82.8, unit: "$M", decimals: 1 }
  - { id: var_23, label: "Variable cost, FY2023", formula: "visits_23 * var_cost / 1000", expected: 32, unit: "$M" }
  - { id: var_25, label: "Variable cost, FY2025", formula: "visits_25 * var_cost / 1000", expected: 28.8, unit: "$M", decimals: 1 }
  - { id: op_23, label: "ED operating result, FY2023", formula: "rev_23 - var_23 - fixed_23", expected: 4, unit: "$M" }
  - { id: op_25, label: "ED operating result, FY2025", formula: "rev_25 - var_25 - fixed_25", expected: -26, unit: "$M" }
  - { id: visit_drop, label: "Fall in visits (%)", formula: "1 - visits_25 / visits_23", expected: 0.10, unit: "%" }
  - { id: rev_drop, label: "Fall in net revenue (%)", formula: "1 - rev_25 / rev_23", expected: 0.261, unit: "%", decimals: 0 }
  - { id: op_swing, label: "Deterioration in the ED result", formula: "op_23 - op_25", expected: 30, unit: "$M" }
  # --- Profit bridge ---
  - { id: contrib_visit_23, label: "Contribution per visit, FY2023", formula: "rev_visit_23 - var_cost", expected: 400, unit: "$/visit" }
  - { id: contrib_visit_25, label: "Contribution per visit, FY2025", formula: "rev_visit_25 - var_cost", expected: 300, unit: "$/visit" }
  - { id: volume_effect, label: "Volume effect (fewer visits at the old contribution)", formula: "(visits_25 - visits_23) * contrib_visit_23 / 1000", expected: -8, unit: "$M" }
  - { id: mix_effect, label: "Payer-mix effect (new visits × change in revenue per visit)", formula: "visits_25 * (rev_visit_25 - rev_visit_23) / 1000", expected: -18, unit: "$M" }
  - { id: fixed_effect, label: "Fixed-cost effect", formula: "fixed_23 - fixed_25", expected: -4, unit: "$M" }
  - { id: bridge_total, label: "Bridge total (must equal the change in result)", formula: "volume_effect + mix_effect + fixed_effect", expected: -30, unit: "$M" }
  - { id: mix_share, label: "Share of the deterioration explained by payer mix", formula: "mix_effect / bridge_total", expected: 0.60, unit: "%" }
  # --- Visits by payer ---
  - { id: comm_23, label: "Commercial visits, FY2023", formula: "visits_23 * mix_comm_23", expected: 80, unit: "thousand" }
  - { id: comm_25, label: "Commercial visits, FY2025", formula: "visits_25 * mix_comm_25", expected: 45, unit: "thousand" }
  - { id: comm_lost, label: "Commercial visits lost", formula: "comm_23 - comm_25", expected: 35, unit: "thousand" }
  - { id: mcd_23, label: "Medicaid visits, FY2023", formula: "visits_23 * mix_mcd_23", expected: 60, unit: "thousand" }
  - { id: mcd_25, label: "Medicaid visits, FY2025", formula: "visits_25 * mix_mcd_25", expected: 72, unit: "thousand" }
  - { id: sp_23, label: "Self-pay visits, FY2023", formula: "visits_23 * mix_sp_23", expected: 20, unit: "thousand" }
  - { id: sp_25, label: "Self-pay visits, FY2025", formula: "visits_25 * mix_sp_25", expected: 27, unit: "thousand" }
  - { id: comm_lost_contrib, label: "Contribution lost with the commercial visits", formula: "comm_lost * (price_comm - var_cost) / 1000", expected: 25.9, unit: "$M", decimals: 1 }
  # --- The ED as the hospital's front door ---
  - { id: admits_25, label: "Admissions coming through the ED, FY2025", formula: "visits_25 * admit_rate", expected: 36, unit: "thousand admissions" }
  - { id: admit_value, label: "Inpatient contribution from ED admissions", formula: "admits_25 * admit_contrib / 1000", expected: 126, unit: "$M" }
  - { id: ed_system_value, label: "System contribution of the ED (ED result + admissions)", formula: "admit_value + op_25", expected: 100, unit: "$M" }
  # --- The CFO's staffing cut ---
  - { id: lost_visits, label: "Visits lost from the staffing cut", formula: "visits_25 * visit_loss", expected: 9, unit: "thousand" }
  - { id: ed_only_net, label: "Net gain on an ED-only view", formula: "staff_cut - lost_visits * contrib_visit_25 / 1000", expected: 3.3, unit: "$M", decimals: 1 }
  - { id: value_per_visit, label: "System value of one ED visit (ED contribution + expected admission)", formula: "contrib_visit_25 + admit_rate * admit_contrib", expected: 1000, unit: "$/visit" }
  - { id: cut_cost, label: "System contribution lost from the cut", formula: "lost_visits * value_per_visit / 1000", expected: 9, unit: "$M" }
  - { id: cut_net, label: "Net effect of the cut on the system", formula: "staff_cut - cut_cost", expected: -3, unit: "$M" }
  - { id: cut_loss, label: "System value destroyed by the cut", formula: "cut_cost - staff_cut", expected: 3, unit: "$M" }
  - { id: breakeven_visits, label: "Visits the cut can lose before it destroys value", formula: "staff_cut * 1000 / value_per_visit", expected: 6, unit: "thousand" }
  - { id: breakeven_loss, label: "Break-even visit loss (% of visits)", formula: "breakeven_visits / visits_25", expected: 0.0333, unit: "%", decimals: 1 }
  # --- Better levers ---
  - { id: enroll_gain, label: "Gain from enrolling self-pay patients in Medicaid", formula: "sp_25 * enroll_share * (price_mcd - price_sp) / 1000", expected: 2.7, unit: "$M", decimals: 1 }
  - { id: recapture_gain, label: "Gain from a fast-track lane for low-acuity commercial patients", formula: "recapture * (fast_track_rev - var_cost) / 1000", expected: 6.6, unit: "$M", decimals: 1 }
  - { id: levers_total, label: "Total from the two levers", formula: "enroll_gain + recapture_gain", expected: 9.3, unit: "$M", decimals: 1 }
  - { id: op_after, label: "ED result after the two levers", formula: "op_25 + levers_total", expected: -16.7, unit: "$M", decimals: 1 }

answer:
  calc: op_swing
  headline: "The ED's result fell {{op_swing}}, mostly from losing commercial patients ({{mix_share}} is payer mix) — but the ED feeds {{admit_value}} of inpatient contribution, so the staffing cut would destroy {{cut_loss}} of value."

exhibits:
  - id: exhibit-1
    title: "Ridgeholm emergency departments: summary P&L"
    kind: table
    ask: "Here is the ED P&L for the whole system. What jumps out?"
    columns: ["", "FY2023", "FY2025"]
    rows:
      - ["ED visits", "{{visits_23}}", "{{visits_25}}"]
      - ["Net revenue", "{{rev_23}}", "{{rev_25}}"]
      - ["Variable cost (at {{var_cost}})", "{{var_23}}", "{{var_25}}"]
      - ["Fixed cost (staffing, facility)", "{{fixed_23}}", "{{fixed_25}}"]
      - ["**Operating result**", "**{{op_23}}**", "**{{op_25}}**"]
    note: "Illustrative data created for this practice case. Ridgeholm Health is fictional."
    insight: |
      Visits fell only {{visit_drop}}, but revenue fell {{rev_drop}}. Revenue per visit
      must have dropped, so the next question is *who* the patients are.
  - id: exhibit-2
    title: "ED visit mix by payer and net revenue per visit"
    kind: table
    ask: "Here is the payer mix. How much of the decline does it explain?"
    columns: ["Payer", "Net revenue per visit", "Share of visits, FY2023", "Share of visits, FY2025"]
    rows:
      - ["Commercial insurance", "{{price_comm}}", "{{mix_comm_23}}", "{{mix_comm_25}}"]
      - ["Medicare", "{{price_mcr}}", "{{mix_mcr_23}}", "{{mix_mcr_25}}"]
      - ["Medicaid", "{{price_mcd}}", "{{mix_mcd_23}}", "{{mix_mcd_25}}"]
      - ["Self-pay (uninsured)", "{{price_sp}}", "{{mix_sp_23}}", "{{mix_sp_25}}"]
    note: "Illustrative data created for this practice case. A competitor opened six urgent-care clinics in Ridgeholm's area in 2024."
    insight: |
      Commercial patients, who pay by far the most per visit,
      fell from {{comm_23}} to {{comm_25}}. Low-acuity insured patients went to
      the new urgent-care clinics; sicker and less well-insured patients stayed.
  - id: exhibit-3
    title: "The CFO's proposal and the ED's link to inpatient care"
    kind: table
    ask: "The CFO wants to cut ED staffing. Should Ridgeholm do it?"
    columns: ["Item", "Value"]
    rows:
      - ["Annual savings from reducing staffed physician and nurse hours", "{{staff_cut}}"]
      - ["Expected visits lost (longer waits, patients leaving, ambulance diversion)", "{{visit_loss}} of visits"]
      - ["Share of ED visits admitted to a Ridgeholm hospital bed", "{{admit_rate}}"]
      - ["Contribution per inpatient admission", "{{admit_contrib}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      The ED is the front door to the hospital. Any decision about it has to
      count the admissions it generates, not just its own P&L.
---

## Prompt

Our client is Ridgeholm Health, a nonprofit system of four hospitals in the Midwest. Each hospital runs a 24/7 emergency department (ED).

Two years ago the EDs together made a small profit. This year they are on track to lose about $26 million, and the board is alarmed. The CFO has proposed cutting ED staffing to save money.

The CEO has asked us: **why have the emergency departments gone from profit to loss, and what should Ridgeholm do about it?**

## Clarifying information

- Q: What is the objective — break even in the ED, or improve the whole system's finances?
  A: The whole system. The board wants the system to stay financially healthy while keeping its emergency care mission.
- Q: Has the number of patients changed?
  A: Yes, visits fell from {{visits_23}} to {{visits_25}}. A competitor opened six urgent-care clinics in the area in 2024.
- Q: How does an ED get paid?
  A: Per visit, by whoever insures the patient. Commercial insurers pay the most, Medicare and Medicaid less, and uninsured (self-pay) patients often pay little. EDs must treat everyone regardless of ability to pay.
- Q: What does the cost base look like?
  A: Mostly fixed: an ED has to be staffed around the clock whatever the volume. Variable cost (supplies, lab tests, imaging) is about {{var_cost}}. Fixed cost rose because of nurse wage increases.
- Q: Does the ED affect the rest of the hospital?
  A: Yes, about {{admit_rate}} of ED visits end in a hospital admission. Data on this is available if the candidate asks.
- Q: Have insurance rates changed?
  A: No, rates per visit for each payer are flat. Assume the same rates in both years.

## Structure

> **Ask:** The candidate should lay out a structure that splits revenue per visit by payer and keeps the ED's link to the rest of the hospital in view.

A profit tree adapted to a hospital service line:

- **ED result = Visits × (Revenue per visit − Variable cost per visit) − Fixed cost**
  - **Visits**
    - Total demand in the area (population, seasonality)
    - Share lost to substitutes: urgent care, telehealth, competitor EDs
  - **Revenue per visit**
    - Payer mix: commercial, Medicare, Medicaid, self-pay
    - Rates per payer (contracts, denials, collections)
    - Acuity (sicker patients are billed at higher levels)
  - **Costs**
    - Variable: supplies, labs, imaging
    - Fixed: 24/7 physician and nurse staffing, facility
- **System view: what the ED generates downstream**
  - Admissions to inpatient beds, surgery, imaging and follow-up care

Hypothesis to state early: *"Visits only fell a little, so I suspect the problem is who is still coming. If insured low-acuity patients moved to urgent care, revenue per visit fell while the fixed cost stayed."*

## Math walkthrough

> **Ask:** The candidate should explain the {{op_swing}} deterioration with a profit bridge, then test the CFO's staffing cut on a system-wide basis.

**1. Revenue per visit (Exhibit 2).**
FY2023: 40% × $900 + 20% × $500 + 30% × $300 + 10% × $100 = $360 + $100 + $90 + $10 = **{{rev_visit_23}}**.
FY2025: 25% × $900 + 20% × $500 + 40% × $300 + 15% × $100 = $225 + $100 + $120 + $15 = **{{rev_visit_25}}**.

**2. ED result (Exhibit 1).**
FY2023: 200k × $560 = {{rev_23}} − {{var_23}} variable − {{fixed_23}} fixed = **{{op_23}}**.
FY2025: 180k × $460 = {{rev_25}} − {{var_25}} − {{fixed_25}} = **{{op_25}}**.
The result got worse by **{{op_swing}}**.

**3. Bridge the change.**
Contribution per visit fell from {{contrib_visit_23}} to {{contrib_visit_25}}.

| Driver | Calculation | Impact |
|---|---|---|
| Volume | (180k − 200k) × $400 | {{volume_effect}} |
| Payer mix | 180k × ($460 − $560) | {{mix_effect}} |
| Fixed cost | $76M − $80M | {{fixed_effect}} |
| **Total** | | **{{bridge_total}}** |

Payer mix explains **{{mix_share}}** of the problem. Commercial visits fell from {{comm_23}} to {{comm_25}}, a loss of {{comm_lost}} visits, worth about {{comm_lost_contrib}} of contribution on its own. Meanwhile Medicaid visits rose from {{mcd_23}} to {{mcd_25}} and self-pay from {{sp_23}} to {{sp_25}}.

**4. The ED as the front door (Exhibit 3).**
Admissions through the ED = 180k × 20% = **{{admits_25}}**, each worth $3,500 → **{{admit_value}}** of inpatient contribution.
So the ED's {{op_25}} result sits next to {{admit_value}} it generates: on a system view the ED contributes about **{{ed_system_value}}**.

**5. Test the staffing cut.**
Lost visits = 180k × 5% = **{{lost_visits}}**.
- ED-only view: $6M savings − 9k × $300 = **{{ed_only_net}}**. It looks attractive. *This is the trap.*
- System view: each visit is worth $300 + 20% × $3,500 = **{{value_per_visit}}**. Lost value = 9k × $1,000 = {{cut_cost}}, so the cut's net effect is **{{cut_net}}**.
- Break-even: $6M ÷ $1,000 per visit = **{{breakeven_visits}} visits**, or only **~{{breakeven_loss}}** of visits. The clinical team expects {{visit_loss}}.

**6. Better levers.**
- Enroll eligible self-pay patients in Medicaid (a financial counselor in the ED): 27k × 50% × ($300 − $100) = **{{enroll_gain}}**.
- A fast-track lane with online check-in to win back low-acuity commercial patients: 15k × ($600 − $160) = **{{recapture_gain}}**.
- Together **{{levers_total}}**, improving the ED result to about **{{op_after}}**.

## Synthesis

> **Ask:** The candidate should close with a recommendation to the CEO.

**The ED's result fell {{op_swing}} mainly because insured, low-acuity patients moved to new urgent-care clinics, which explains {{mix_share}} of the decline. Ridgeholm should reject the staffing cut, which would cost the system about {{cut_loss}} a year once lost admissions are counted, and instead compete for those patients and improve collections.**

1. **Cause:** visits fell only {{visit_drop}}, but commercial visits fell by {{comm_lost}} and revenue per visit dropped from {{rev_visit_23}} to {{rev_visit_25}} against a cost base that is mostly fixed.
2. **The ED is the front door:** it generates {{admit_value}} of inpatient contribution a year. The staffing cut only works if it loses fewer than ~{{breakeven_loss}} of visits, and the clinical team expects {{visit_loss}}.
3. **What to do instead:** a fast-track lane for low-acuity patients ({{recapture_gain}}) and Medicaid enrollment for uninsured patients ({{enroll_gain}}) are worth about {{levers_total}} a year.

**Risks and next steps:** the ED will still show a loss (about {{op_after}}), so the board should judge it on system contribution, not as a standalone P&L. Next, test whether Ridgeholm should open its own urgent-care clinics, renegotiate commercial contracts using quality data, and check staffing levels hour by hour (cutting quiet overnight hours may be safe where cutting peak hours is not).

## Common mistakes

- Treating the ED as a standalone business and accepting the staffing cut because it looks positive ({{ed_only_net}}) on the ED P&L.
- Calculating the volume effect but missing the payer mix: visits only fell {{visit_drop}}, but revenue fell {{rev_drop}}.
- Using one average revenue per visit for both years instead of recomputing it from the mix.
- Recommending that the ED turn away or discourage uninsured patients. US hospitals must screen and stabilize everyone who comes to the ED, and it is contrary to the mission.

## What top candidates do differently

- Spot the gap between the volume fall and the revenue fall in Exhibit 1 and go straight to payer mix.
- Ask unprompted what the ED generates downstream before judging any cost cut.
- Turn the staffing question into a break-even ("the cut only works if we lose fewer than {{breakeven_visits}} visits") rather than a yes/no.
- Separate what Ridgeholm controls (access, collections, staffing patterns) from what it does not (local insurance coverage, competitor clinics).

## Creative question

Low-acuity insured patients are choosing urgent care over Ridgeholm's ED. What could Ridgeholm do to win them back, or to keep them inside the system even if they never visit the ED?

## Model answer

Organize ideas by **where the patient enters**:

- **Before they arrive:** online check-in with posted wait times; a nurse advice line and telehealth visits that send patients to the right setting.
- **At the ED:** a separate fast-track area with its own staff for minor injuries and illnesses, aiming for a visit under an hour.
- **Outside the ED:** open Ridgeholm-branded urgent-care clinics (or partner with the competitor) so the patients and their referrals stay in the system; link the clinics to Ridgeholm's primary care doctors and specialists.
- **With payers and employers:** offer employers a care-navigation program that steers employees to the right Ridgeholm setting at a lower total cost.

A top candidate prioritizes: "The patients didn't leave because of the ED's quality; they left for convenience. The highest-value move is to own the convenient option ourselves, because what matters is keeping patients and their admissions in the system."
