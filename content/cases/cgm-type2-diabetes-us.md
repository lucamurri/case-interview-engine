---
id: cgm-type2-diabetes-us
title: "Always On: Continuous Glucose Monitors for Type 2 Diabetes in the US"
client: "Ottervale Biosensors (fictional), a medtech company launching its first glucose sensor"
summary: "A medtech challenger needs to pick a launch segment for its new glucose sensor. Size the US Type 2 CGM market by treatment segment and find where the headroom is."
industry: pharma-healthcare
sub_industry: "Medtech / diabetes devices"
type: market-sizing
difficulty: intermediate
format: candidate-led
time_minutes: 25

# All numbers are illustrative — realistic in shape, not real prevalence,
# adoption or pricing data.
inputs:
  t2d_m:                   { value: 30,   unit: "million",      label: "US adults diagnosed with Type 2 diabetes" }
  intensive_mix:           { value: 0.10, unit: "%",            label: "Patients on intensive insulin (several injections a day)" }
  basal_mix:               { value: 0.15, unit: "%",            label: "Patients on basal insulin only (one long-acting shot a day)" }
  noninsulin_mix:          { value: 0.75, unit: "%",            label: "Patients not on insulin (pills or GLP-1s)" }
  intensive_adopt:         { value: 0.60, unit: "%",            label: "CGM use today, intensive insulin" }
  basal_adopt:             { value: 0.30, unit: "%",            label: "CGM use today, basal insulin" }
  noninsulin_adopt:        { value: 0.04, unit: "%",            label: "CGM use today, not on insulin" }
  sensors_rx:              { value: 24,   unit: "sensors/year", label: "Sensors per year, continuous wear (insulin users)" }
  price_rx:                { value: 75,   unit: "$/sensor",     label: "Net price per prescription sensor" }
  sensors_otc:             { value: 12,   unit: "sensors/year", label: "Sensors per year, on-and-off wear (non-insulin users)" }
  price_otc:               { value: 50,   unit: "$/sensor",     label: "Price per over-the-counter sensor (paid by the patient)" }
  noninsulin_future_adopt: { value: 0.20, unit: "%",            label: "Plausible five-year CGM use, not on insulin" }
  ottervale_share:         { value: 0.10, unit: "%",            label: "Share Ottervale could win in its launch segment" }
  revenue_goal:            { value: 500,  unit: "$M",           label: "Ottervale's five-year annual revenue goal" }

calculations:
  # --- Patients and users by segment ---
  - { id: intensive_pts_m, label: "Patients on intensive insulin", formula: "t2d_m * intensive_mix", expected: 3, unit: "million" }
  - { id: basal_pts_m, label: "Patients on basal insulin", formula: "t2d_m * basal_mix", expected: 4.5, unit: "million" }
  - { id: noninsulin_pts_m, label: "Patients not on insulin", formula: "t2d_m * noninsulin_mix", expected: 22.5, unit: "million" }
  - { id: intensive_users_m, label: "CGM users, intensive insulin", formula: "intensive_pts_m * intensive_adopt", expected: 1.8, unit: "million" }
  - { id: basal_users_m, label: "CGM users, basal insulin", formula: "basal_pts_m * basal_adopt", expected: 1.35, unit: "million" }
  - { id: noninsulin_users_m, label: "CGM users, not on insulin", formula: "noninsulin_pts_m * noninsulin_adopt", expected: 0.9, unit: "million" }
  - { id: total_users_m, label: "Total Type 2 CGM users", formula: "intensive_users_m + basal_users_m + noninsulin_users_m", expected: 4.05, unit: "million" }
  - { id: overall_adopt, label: "CGM use across all Type 2 patients", formula: "total_users_m / t2d_m", expected: 0.135, unit: "%", decimals: 1 }
  # --- Spend per user and revenue ---
  - { id: rx_cost_per_user, label: "Annual sensor spend per insulin user", formula: "sensors_rx * price_rx", expected: 1800, unit: "$/year" }
  - { id: otc_cost_per_user, label: "Annual sensor spend per non-insulin user", formula: "sensors_otc * price_otc", expected: 600, unit: "$/year" }
  - { id: intensive_rev_b, label: "Revenue, intensive insulin", formula: "intensive_users_m * rx_cost_per_user / 1000", expected: 3.24, unit: "$B" }
  - { id: basal_rev_b, label: "Revenue, basal insulin", formula: "basal_users_m * rx_cost_per_user / 1000", expected: 2.43, unit: "$B" }
  - { id: noninsulin_rev_b, label: "Revenue, not on insulin", formula: "noninsulin_users_m * otc_cost_per_user / 1000", expected: 0.54, unit: "$B" }
  - { id: total_rev_b, label: "Total US Type 2 CGM market", formula: "intensive_rev_b + basal_rev_b + noninsulin_rev_b", expected: 6.21, unit: "$B" }
  - { id: noninsulin_rev_share, label: "Non-insulin share of market revenue", formula: "noninsulin_rev_b / total_rev_b", expected: 0.087, unit: "%", decimals: 0 }
  # --- Headroom ---
  - { id: basal_upside_b, label: "Added revenue if basal use reached the intensive level", formula: "basal_pts_m * (intensive_adopt - basal_adopt) * rx_cost_per_user / 1000", expected: 2.43, unit: "$B" }
  - { id: basal_future_b, label: "Basal segment at intensive-level use", formula: "basal_rev_b + basal_upside_b", expected: 4.86, unit: "$B" }
  - { id: noninsulin_future_b, label: "Non-insulin segment at plausible five-year use", formula: "noninsulin_pts_m * noninsulin_future_adopt * otc_cost_per_user / 1000", expected: 2.7, unit: "$B" }
  - { id: noninsulin_upside_b, label: "Added revenue, non-insulin segment", formula: "noninsulin_future_b - noninsulin_rev_b", expected: 2.16, unit: "$B" }
  - { id: ottervale_basal_m, label: "Ottervale revenue at target share, basal segment (future)", formula: "basal_future_b * ottervale_share * 1000", expected: 486, unit: "$M" }
  - { id: ottervale_noninsulin_m, label: "Ottervale revenue at target share, non-insulin segment (future)", formula: "noninsulin_future_b * ottervale_share * 1000", expected: 270, unit: "$M" }
  - { id: basal_goal_share, label: "Basal prize as a share of Ottervale's goal", formula: "ottervale_basal_m / revenue_goal", expected: 0.972, unit: "%", decimals: 0 }
  - { id: noninsulin_goal_share, label: "Non-insulin prize as a share of Ottervale's goal", formula: "ottervale_noninsulin_m / revenue_goal", expected: 0.54, unit: "%", decimals: 0 }
  - { id: naive_rev_b, label: "Market if every user paid the prescription rate (the wrong way)", formula: "total_users_m * rx_cost_per_user / 1000", expected: 7.29, unit: "$B" }

answer:
  calc: total_rev_b
  headline: "About {{total_rev_b}} a year today; Ottervale should launch with basal-insulin patients, where a {{ottervale_share}} share could reach ~{{ottervale_basal_m}}."

exhibits:
  - id: exhibit-1
    title: "US adults with Type 2 diabetes, by treatment, and CGM use today"
    kind: table
    ask: "Here is the client's segment data. How many Type 2 patients use a CGM today?"
    columns: ["Treatment segment", "Share of Type 2 patients", "Using a CGM today"]
    rows:
      - ["Intensive insulin (several injections a day)", "{{intensive_mix}}", "{{intensive_adopt}}"]
      - ["Basal insulin only (one long-acting shot a day)", "{{basal_mix}}", "{{basal_adopt}}"]
      - ["Not on insulin (pills or GLP-1s)", "{{noninsulin_mix}}", "{{noninsulin_adopt}}"]
      - ["All Type 2 patients ({{t2d_m}})", "100%", "?"]
    note: "Illustrative data created for this practice case; not real prevalence or adoption figures."
    insight: |
      Use falls sharply as treatment gets lighter. Overall only {{overall_adopt}}
      of patients use a CGM. Basal patients sit at {{basal_adopt}} versus
      {{intensive_adopt}} for intensive users, even though both dose insulin.
  - id: exhibit-2
    title: "How sensors are worn and paid for"
    kind: table
    ask: "And here is how each group uses and pays for sensors. What is the market worth?"
    columns: ["Segment", "Sensors per user per year", "Price per sensor", "Who pays"]
    rows:
      - ["Intensive insulin", "{{sensors_rx}}", "{{price_rx}}", "Insurer (prescription)"]
      - ["Basal insulin", "{{sensors_rx}}", "{{price_rx}}", "Insurer (prescription)"]
      - ["Not on insulin", "{{sensors_otc}}", "{{price_otc}}", "Mostly the patient (over the counter)"]
    note: "Illustrative data created for this practice case; sensors last about 15 days."
    insight: |
      An insulin user is worth {{rx_cost_per_user}} in sensors; a non-insulin
      user only {{otc_cost_per_user}}. Patient counts and revenue point to
      different segments.
---

## Prompt

Our client, Ottervale Biosensors, has developed a **continuous glucose monitor (CGM)** — a small sensor worn on the arm that reads blood sugar every few minutes and sends it to a phone, replacing finger-prick tests. Each sensor lasts about 15 days and is then replaced. Ottervale's sensor is accurate, comfortable and cheaper to make than incumbents' products.

The US market is dominated by two large players, and most of their users have Type 1 diabetes or use insulin. Ottervale wants to focus on **Type 2 diabetes**, which is far more common. The CEO asks: **how big is the US market for CGM sensors among Type 2 patients, and which group of patients should we launch with?**

## Clarifying information

- Q: How many Americans have Type 2 diabetes?
  A: About **{{t2d_m}}** diagnosed adults. Ignore undiagnosed patients and Type 1.
- Q: Do all Type 2 patients need a CGM?
  A: Need varies with treatment. Patients on insulin must dose carefully and benefit most; patients on pills or GLP-1s use a CGM mainly to learn how food and exercise affect them. The client has segment data.
- Q: Who pays for the sensors?
  A: For insulin users, insurers usually cover them on prescription. Non-insulin users mostly buy over-the-counter sensors themselves, at a lower price, and wear them on and off.
- Q: Are we sizing sensors or the reader devices too?
  A: Sensors only — phones have replaced most reader devices, and sensors are where the recurring revenue is.
- Q: What does Ottervale want to achieve?
  A: **{{revenue_goal}}** of annual revenue within five years. It thinks it can win about **{{ottervale_share}}** of whichever segment it targets.
- Q: Will CGM use grow?
  A: The client thinks basal-insulin use could catch up with intensive-insulin use within five years, as insurers widen coverage. For non-insulin patients, **{{noninsulin_future_adopt}}** use in five years is a plausible upside.

## Structure

> **Ask:** Set up the sizing. Drive toward revenue by treatment segment, because the segments differ in need, use and price.

A **segmented, patient-based (top-down) build**:

- **For each treatment segment** (intensive insulin, basal insulin, not on insulin)
  - Patients = Type 2 patients × segment share
  - CGM users = patients × CGM use rate
  - Sensor spend per user = sensors per year × price per sensor
  - Revenue = users × spend per user
- **Market today** = sum of the three segments
- **Headroom by segment** = revenue if use rose to a plausible future level, minus today's revenue
- **Launch choice** = which segment gives Ottervale the most reachable revenue, given who pays and how crowded it is

A strong candidate explains why a single average won't work: use rates range from {{noninsulin_adopt}} to {{intensive_adopt}}, and the segments pay different prices.

## Math walkthrough

> **Ask:** What is the market today, and where is the growth?

**1. Patients and users (Exhibit 1).**

| Segment | Patients | × CGM use | Users |
|---|---|---|---|
| Intensive insulin | {{t2d_m}} × 10% = {{intensive_pts_m}} | {{intensive_adopt}} | {{intensive_users_m}} |
| Basal insulin | {{t2d_m}} × 15% = {{basal_pts_m}} | {{basal_adopt}} | {{basal_users_m}} |
| Not on insulin | {{t2d_m}} × 75% = {{noninsulin_pts_m}} | {{noninsulin_adopt}} | {{noninsulin_users_m}} |

Total users = 1.8m + 1.35m + 0.9m = **{{total_users_m}}**, about {{overall_adopt}} of patients.

**2. Spend per user (Exhibit 2).**
Insulin users: 24 × $75 = **{{rx_cost_per_user}}**. Non-insulin users: 12 × $50 = **{{otc_cost_per_user}}**.

**3. Revenue today.**
- Intensive: 1.8m × $1,800 = **{{intensive_rev_b}}**
- Basal: 1.35m × $1,800 = **{{basal_rev_b}}**
- Not on insulin: 0.9m × $600 = **{{noninsulin_rev_b}}**
- Total = **{{total_rev_b}}** a year

Non-insulin patients are {{noninsulin_mix}} of patients but only {{noninsulin_rev_share}} of revenue.

**4. Headroom.**
- Basal, if use rose from 30% to 60%: 4.5m × (60% − 30%) × $1,800 = **{{basal_upside_b}}** more, taking the segment to {{basal_future_b}}.
- Not on insulin, at {{noninsulin_future_adopt}} use: 22.5m × 20% × $600 = **{{noninsulin_future_b}}**, i.e. **{{noninsulin_upside_b}}** more than today.

**5. Ottervale's prize at a {{ottervale_share}} share.**
- Basal: {{basal_future_b}} × 10% = **{{ottervale_basal_m}}** — {{basal_goal_share}} of the {{revenue_goal}} goal.
- Not on insulin: {{noninsulin_future_b}} × 10% = **{{ottervale_noninsulin_m}}** — only {{noninsulin_goal_share}} of the goal.

*Mental-math tip:* for basal, 1.35m × $1,800 is the same as 1.35 × 1.8 in billions = {{basal_rev_b}}.

## Synthesis

> **Ask:** What do you recommend to the CEO?

**The US Type 2 CGM sensor market is about {{total_rev_b}} a year, and Ottervale should launch with basal-insulin patients: a fast-growing, insurer-paid segment where a {{ottervale_share}} share could bring ~{{ottervale_basal_m}} a year, close to its {{revenue_goal}} goal.**

- The money is in insulin users, who wear sensors continuously and are reimbursed at {{rx_cost_per_user}} per patient; non-insulin patients are {{noninsulin_mix}} of patients but only {{noninsulin_rev_share}} of revenue.
- Basal use is only {{basal_adopt}}, versus {{intensive_adopt}} for intensive users; closing that gap adds {{basal_upside_b}}, and these patients are less locked in to incumbents than intensive users with insulin pumps.
- The non-insulin segment is a strong second act (+{{noninsulin_upside_b}} of headroom), but it pays out of pocket at a lower price, so it needs consumer marketing Ottervale doesn't yet have.

**Risks / next steps:** the basal case depends on insurers widening coverage — test this with the largest payers; incumbents may cut prices to defend share; verify that Ottervale's accuracy data supports insulin dosing claims. Next, model a five-year ramp and the sales force needed to reach primary-care doctors, who treat most basal patients.

## Common mistakes

- Applying one price to all users, which gives {{naive_rev_b}} and overstates the market — non-insulin users wear fewer sensors and pay less.
- Picking the non-insulin segment because it has the most patients ({{noninsulin_pts_m}}), without checking what each patient is worth.
- Sizing only today's market. The launch decision depends on headroom, not on where incumbents already are.
- Forgetting that sensors are replaced every 15 days, so a user buys {{sensors_rx}}, not one.

## What top candidates do differently

- Segment by treatment before seeing any data, and explain why need and payment differ.
- Point out the mismatch between patients and revenue in one sentence: "{{noninsulin_mix}} of patients, {{noninsulin_rev_share}} of revenue."
- Compare segments on reachable revenue for Ottervale, not total market size, and tie it back to the {{revenue_goal}} goal.
- Raise competitive intensity: intensive-insulin users are the incumbents' core customers and the hardest to win.

## Creative question

How could Ottervale persuade primary-care doctors — who are busy and see many conditions — to prescribe its CGM to their basal-insulin patients?

## Model answer

A strong answer covers evidence, workflow and economics:

- **Evidence:** a study showing better blood-sugar control and fewer emergency visits for basal patients using a CGM; share it through medical-education events and specialist opinion leaders.
- **Workflow:** make the data easy to use — a one-page report sent straight into the doctor's electronic health record, and simple onboarding handled by Ottervale's support team, not clinic staff.
- **Economics:** help clinics get paid for remote monitoring, and handle insurance paperwork (prior authorization) for them.
- **Patient pull:** a free trial sensor so patients ask their doctor for it.

Top candidates prioritize workflow: "Doctors don't resist the idea of a CGM; they resist the extra work. Remove the work and prescribing follows."
