---
id: insurer-claims-backlog
title: "Claims Backlog: Speeding Up an Insurer's Claims Processing"
client: "Wexcombe Mutual (fictional), a regional US auto and home insurer"
summary: "Open claims have piled up to 26,000 and customers wait over seven weeks for a settlement. Find the bottleneck, size a burn-down plan and rank three fixes."
industry: financial-services
sub_industry: "Financial services"
type: operations
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  inflow:              { value: 4000,  unit: "claims/week", label: "New claims reported per week" }
  open_claims:         { value: 26000, unit: "claims", label: "Open claims today" }
  target_cycle:        { value: 2,     unit: "weeks", label: "Target average time to settle a claim" }
  intake_cap:          { value: 6000,  unit: "claims/week", label: "Intake (first notice of loss) capacity" }
  triage_cap:          { value: 5000,  unit: "claims/week", label: "Triage capacity" }
  approval_cap:        { value: 6000,  unit: "claims/week", label: "Approval and payment capacity" }
  adjusters:           { value: 150,   unit: "adjusters", label: "Staff adjusters" }
  claims_per_adj:      { value: 24,    unit: "claims/week", label: "Claims settled per adjuster per week today" }
  claims_per_adj_new:  { value: 28,    unit: "claims/week", label: "Claims settled per adjuster per week without duplicate data entry" }
  stp_share:           { value: 0.25,  unit: "%", label: "Share of new claims that can be settled from customer photos, with no adjuster" }
  contractors:         { value: 25,    unit: "adjusters", label: "Contract adjusters available for three months" }
  contractor_cost:     { value: 3000,  unit: "$/week", label: "Cost per contract adjuster per week" }
  adjuster_cost:       { value: 2400,  unit: "$/week", label: "Fully loaded cost per staff adjuster per week" }
  rental_share:        { value: 0.20,  unit: "%", label: "Share of open claims with a rental car paid by Wexcombe" }
  rental_cost:         { value: 250,   unit: "$/week", label: "Rental car cost per claim per week" }
  a_live:              { value: 4,     unit: "weeks", label: "Weeks until photo settlement goes live" }
  c_live:              { value: 6,     unit: "weeks", label: "Weeks until the data-entry IT fix goes live" }

calculations:
  # --- Diagnose ---
  - { id: adjuster_cap, label: "Adjuster capacity today", formula: "adjusters * claims_per_adj", expected: 3600, unit: "claims/week" }
  - { id: backlog_growth, label: "Weekly growth in open claims", formula: "inflow - adjuster_cap", expected: 400, unit: "claims/week" }
  - { id: cycle_time, label: "Average time to settle (open claims / throughput)", formula: "open_claims / adjuster_cap", expected: 7.22, unit: "weeks", decimals: 1 }
  - { id: target_wip, label: "Open claims consistent with the target cycle time", formula: "inflow * target_cycle", expected: 8000, unit: "claims" }
  - { id: excess, label: "Excess backlog to clear", formula: "open_claims - target_wip", expected: 18000, unit: "claims" }
  - { id: rental_week, label: "Weekly rental cost of the excess backlog", formula: "excess * rental_share * rental_cost / 1000", expected: 900, unit: "$K" }
  # --- Lever A: straight-through processing ---
  - { id: stp_claims, label: "New claims settled from photos each week", formula: "inflow * stp_share", expected: 1000, unit: "claims/week" }
  - { id: adjuster_demand, label: "New claims still needing an adjuster", formula: "inflow - stp_claims", expected: 3000, unit: "claims/week" }
  - { id: burn_a, label: "Backlog cleared per week, lever A only", formula: "adjuster_cap - adjuster_demand", expected: 600, unit: "claims/week" }
  - { id: weeks_a, label: "Weeks to clear the excess, lever A only", formula: "excess / burn_a", expected: 30, unit: "weeks" }
  # --- Lever C: remove duplicate data entry ---
  - { id: cap_c, label: "Adjuster capacity without duplicate data entry", formula: "adjusters * claims_per_adj_new", expected: 4200, unit: "claims/week" }
  - { id: gain_c, label: "Extra capacity from lever C", formula: "cap_c - adjuster_cap", expected: 600, unit: "claims/week" }
  - { id: burn_ac, label: "Backlog cleared per week, levers A + C", formula: "cap_c - adjuster_demand", expected: 1200, unit: "claims/week" }
  - { id: weeks_ac, label: "Weeks to clear the excess, levers A + C", formula: "excess / burn_ac", expected: 15, unit: "weeks" }
  # --- Lever B: contract adjusters ---
  - { id: contractor_cap, label: "Extra capacity from contract adjusters", formula: "contractors * claims_per_adj", expected: 600, unit: "claims/week" }
  - { id: cap_all, label: "Adjuster capacity with all three levers", formula: "cap_c + contractor_cap", expected: 4800, unit: "claims/week" }
  - { id: burn_all, label: "Backlog cleared per week, all levers", formula: "cap_all - adjuster_demand", expected: 1800, unit: "claims/week" }
  - { id: weeks_all, label: "Weeks to clear the excess, all levers", formula: "excess / burn_all", expected: 10, unit: "weeks" }
  - { id: weeks_saved, label: "Weeks saved by adding contractors", formula: "weeks_ac - weeks_all", expected: 5, unit: "weeks" }
  - { id: contractor_week, label: "Contractor cost per week", formula: "contractors * contractor_cost / 1000", expected: 75, unit: "$K" }
  - { id: contractor_total, label: "Contractor cost over the burn-down", formula: "contractors * contractor_cost * weeks_all / 1e6", expected: 0.75, unit: "$M", decimals: 2 }
  - { id: rental_saved, label: "Rental cost avoided by clearing the backlog sooner", formula: "excess / 2 * weeks_saved * rental_share * rental_cost / 1e6", expected: 2.25, unit: "$M", decimals: 2 }
  # --- Timing from today (levers go live at different times) ---
  - { id: burn_b_only, label: "Backlog cleared per week with contractors only (weeks 0-4)", formula: "adjuster_cap + contractor_cap - inflow", expected: 200, unit: "claims/week" }
  - { id: cleared_p1, label: "Excess cleared before photo settlement goes live", formula: "burn_b_only * a_live", expected: 800, unit: "claims" }
  - { id: burn_ab, label: "Backlog cleared per week with contractors and photo settlement (weeks 4-6)", formula: "adjuster_cap + contractor_cap - adjuster_demand", expected: 1200, unit: "claims/week" }
  - { id: cleared_p2, label: "Excess cleared between photo settlement and the IT fix", formula: "burn_ab * (c_live - a_live)", expected: 2400, unit: "claims" }
  - { id: remaining_c, label: "Excess left when all three levers are running", formula: "excess - cleared_p1 - cleared_p2", expected: 14800, unit: "claims" }
  - { id: weeks_after_c, label: "Weeks to clear the rest once all three levers run", formula: "remaining_c / burn_all", expected: 8.22, unit: "weeks", decimals: 0 }
  - { id: weeks_today, label: "Weeks from today to the two-week target", formula: "c_live + weeks_after_c", expected: 14.22, unit: "weeks", decimals: 0 }
  # --- Check the next step and unit cost ---
  - { id: rental_ratio, label: "Rental cost avoided per dollar spent on contractors", formula: "rental_saved / contractor_total", expected: 3, unit: "x" }
  - { id: approval_load, label: "Claims reaching approval per week during burn-down", formula: "cap_all + stp_claims", expected: 5800, unit: "claims/week" }
  - { id: approval_util, label: "Approval utilization during burn-down", formula: "approval_load / approval_cap", expected: 0.9667, unit: "%", decimals: 0 }
  - { id: cost_claim_now, label: "Staff adjuster cost per claim today", formula: "adjuster_cost / claims_per_adj", expected: 100, unit: "$/claim" }
  - { id: cost_claim_new, label: "Staff adjuster cost per claim without duplicate data entry", formula: "adjuster_cost / claims_per_adj_new", expected: 85.71, unit: "$/claim", decimals: 0 }
  - { id: cost_claim_contractor, label: "Contract adjuster cost per claim", formula: "contractor_cost / claims_per_adj", expected: 125, unit: "$/claim" }

answer:
  calc: weeks_all
  headline: "Adjusters are the bottleneck; photo settlement, less data entry and 25 temporary contractors clear the excess backlog in {{weeks_all}} once all three are running (about {{weeks_today}} from today) — and the contractors more than pay for themselves."

exhibits:
  - id: exhibit-1
    title: "Weekly capacity of each step in claims handling (claims per week)"
    kind: bar
    unit: "claims/week"
    decimals: 0
    ask: "Here is the capacity of each step. What is going on?"
    data:
      - { label: "1. Intake (claim reported)", value: intake_cap }
      - { label: "2. Triage", value: triage_cap }
      - { label: "3. Adjuster assessment", value: adjuster_cap }
      - { label: "4. Approval and payment", value: approval_cap }
    reference: { value: inflow, label: "New claims per week" }
    note: "Illustrative data created for this practice case. Wexcombe Mutual is fictional."
    insight: |
      Adjuster assessment is the only step below the weekly inflow, so open
      claims grow by {{backlog_growth}}. Hiring at intake or approval
      would not help.
  - id: exhibit-2
    title: "Improvement levers proposed by the claims team"
    kind: table
    ask: "The claims team has three ideas. How fast would they clear the backlog, and in what order would you do them?"
    columns: ["Lever", "What it does", "Cost and timing"]
    rows:
      - ["A. Photo-based settlement", "{{stp_share}} of new claims (small, simple damage) settled from customer photos, with no adjuster", "App already piloted; can go live in a month"]
      - ["B. Contract adjusters", "{{contractors}} for three months, each settling {{claims_per_adj}}", "{{contractor_cost}} each"]
      - ["C. Remove duplicate data entry", "Adjusters stop re-typing data between two systems: {{claims_per_adj}} → {{claims_per_adj_new}} each", "Small IT fix; about six weeks"]
    note: "Illustrative data created for this practice case."
    insight: |
      A and C are permanent and cheap; B is temporary and expensive per claim.
      The question is whether speed is worth paying for.
---

## Prompt

Our client, Wexcombe Mutual, is a regional US insurer that sells auto and home policies. A busy storm season has pushed its open claims to **{{open_claims}}**, and the number keeps rising.

Customers now wait about {{cycle_time}} for a settlement, complaints to the state insurance regulator have tripled, and Wexcombe is paying for thousands of rental cars while customers' vehicles wait for an assessment.

The Chief Claims Officer asks us: **what is slowing claims down, and how quickly can Wexcombe get back to a two-week settlement time?**

## Clarifying information

- Q: How many new claims come in?
  A: About **{{inflow}}**, and the claims team expects that rate to continue.
- Q: What are the steps in handling a claim?
  A: Intake (the customer reports the claim), triage (sorting by type and complexity), assessment by an adjuster (inspecting the damage and agreeing on the amount), and approval and payment.
- Q: What is the target?
  A: An average of **{{target_cycle}}** from report to payment, which is what Wexcombe achieved before the storms.
- Q: Why does speed matter, apart from customer satisfaction?
  A: About **{{rental_share}}** of open claims have a rental car that Wexcombe pays for, at around {{rental_cost}} per claim. Slow claims also raise the risk of regulatory penalties and customers leaving at renewal.
- Q: How many adjusters does Wexcombe have?
  A: **{{adjusters}}** on staff, each settling about **{{claims_per_adj}}**. Each costs about **{{adjuster_cost}}** fully loaded (salary, benefits, vehicle).
- Q: Can Wexcombe hire permanent adjusters?
  A: Yes, but it takes about six months to recruit and train them, so it won't help with this backlog.

## Structure

> **Ask:** How would you structure your approach?

Treat claims handling as a **queue**: open claims grow when claims arrive faster than they are settled.

- **1. Where is the bottleneck?**
  - Capacity of each step (intake, triage, adjusters, approval) versus inflow
- **2. How big is the problem?**
  - Average settlement time today (open claims ÷ weekly throughput)
  - Excess backlog versus the level consistent with a two-week target
  - Cost of the backlog (rental cars, complaints, churn)
- **3. How do we clear it?**
  - Reduce demand on the bottleneck (settle simple claims without an adjuster)
  - Raise productivity (remove non-value-adding work)
  - Add temporary capacity (contract adjusters)
  - For each: capacity gained, cost, speed, and what becomes the next bottleneck
- **4. Prioritized plan and risks**

A strong candidate links queue size and waiting time explicitly: *"Average waiting time equals the number of open claims divided by how many we settle each week, so to get to two weeks we need to shrink the pile, not just stop it growing."*

## Math walkthrough

> **Ask:** Using Exhibit 1, what is the bottleneck and how far are we from the target? Then, using Exhibit 2, how long would it take to clear the excess backlog with lever A alone, with A and C, and with all three? Is lever B worth the money?

**1. Diagnose.**
Adjuster capacity = 150 × 24 = **{{adjuster_cap}}**, below the {{inflow}} arriving, so open claims grow by **{{backlog_growth}}**.
Settlement time = 26,000 ÷ 3,600 ≈ **{{cycle_time}}**.
For a two-week average, open claims must fall to 4,000 × 2 = {{target_wip}}, so the excess backlog = 26,000 − 8,000 = **{{excess}}**.
The excess alone carries about 18,000 × 20% × $250 = **{{rental_week}}** of rental cars a week.

**2. Lever A: photo-based settlement.**
Photo settlement takes {{stp_claims}} off adjusters' desks, leaving {{adjuster_demand}} for them. Net burn = 3,600 − 3,000 = {{burn_a}}, so clearing the excess takes 18,000 ÷ 600 = **{{weeks_a}}**.

**3. Levers A + C: less data entry.**
Capacity = 150 × 28 = {{cap_c}} (+{{gain_c}}). Net burn = 4,200 − 3,000 = {{burn_ac}}, so 18,000 ÷ 1,200 = **{{weeks_ac}}**.

**4. All three levers.**
Contractors add 25 × 24 = {{contractor_cap}}, so capacity = {{cap_all}}. Net burn = {{burn_all}}, so 18,000 ÷ 1,800 = **{{weeks_all}}**.

**5. Is lever B worth it?**
Contractors cost 25 × $3,000 = {{contractor_week}} a week, or **{{contractor_total}}** over the burn-down. They get Wexcombe to target {{weeks_saved}} sooner.
Because the excess shrinks steadily to zero, the *average* excess during the burn-down is half of 18,000. Rental cost avoided ≈ 9,000 × 5 weeks × 20% × $250 ≈ **{{rental_saved}}** — {{rental_ratio}} the contractor cost, before counting fewer complaints and lost customers.

**6. Check the next step.**
During the burn-down, approval receives {{cap_all}} from adjusters plus {{stp_claims}} of photo settlements = {{approval_load}}, or **{{approval_util}}** of its capacity. It holds, but with almost no slack.

**7. Timing from today.**
The burn-down times above count from when the levers are running. Photo settlement takes about a month and the IT fix about six weeks, but contractors can start now:
- Weeks 0–4, contractors only: 3,600 + 600 − 4,000 = {{burn_b_only}} cleared → {{cleared_p1}}.
- Weeks 4–6, contractors + photo settlement: 4,200 − 3,000 = {{burn_ab}} cleared → {{cleared_p2}}.
- From week 6, all three levers: the remaining {{remaining_c}} at 1,800 claims/week takes another {{weeks_after_c}} or so.

So Wexcombe reaches the two-week target about **{{weeks_today}}** from today, roughly the length of the contractors' three-month term.

*Cost per claim:* a staff adjuster costs $2,400 ÷ 24 = {{cost_claim_now}} today and $2,400 ÷ 28 ≈ {{cost_claim_new}} after lever C; a contractor costs {{cost_claim_contractor}} — expensive, which is why contractors should be temporary.

## Synthesis

> **Ask:** What would you recommend to the Chief Claims Officer?

**Wexcombe can get back to a two-week settlement time in about {{weeks_today}} from today ({{weeks_all}} once all three levers are running): adjusters are the bottleneck, so it should take simple claims off their desks with photo settlement, remove duplicate data entry, and bring in {{contractors}} on contract until the backlog is cleared.**

1. **Photo settlement first (lever A):** it removes {{stp_claims}} from the bottleneck permanently and stops the backlog growing; on its own it would still take {{weeks_a}}.
2. **Remove duplicate data entry (lever C):** adds {{gain_c}} of capacity for a small IT fix and cuts adjuster cost per claim from {{cost_claim_now}} to {{cost_claim_new}}; with A, the backlog clears in {{weeks_ac}}.
3. **Contractors as a temporary bridge (lever B):** start them now, while A and C are being built; {{contractor_total}} of cost buys {{weeks_saved}} of speed and avoids about {{rental_saved}} of rental costs.

**Risks and next steps:** approval runs at {{approval_util}} during the burn-down — add temporary approvers or raise automatic-approval limits for small claims; audit a sample of photo settlements for fraud and overpayment; prioritize claims with rental cars in the queue; and recruit permanent adjusters so the next storm season does not repeat this.

## Common mistakes

- Dividing the whole backlog by total capacity and forgetting that {{inflow}} new claims keep arriving every week — the backlog only shrinks by capacity *minus* inflow.
- Trying to clear the backlog to zero. A healthy claims operation always has work in progress; the target is about {{target_wip}} open.
- Adding resources at intake or approval, which are not the bottleneck.
- Rejecting contractors because they cost more per claim, without comparing their cost with the cost of the backlog.
- Not checking whether approval becomes the next bottleneck once adjusters speed up.

## What top candidates do differently

- Use the queue relationship (open claims ÷ throughput = waiting time) to turn the two-week target into a target backlog of {{target_wip}}.
- Sequence the levers: reduce demand first, then raise productivity, then add temporary capacity.
- Notice that the average excess during a steady burn-down is half the starting excess when sizing the rental savings.
- Raise the customer and regulatory angle: which claims should jump the queue (rental cars, uninhabitable homes)?

## Creative question

Once the backlog is cleared, how could Wexcombe make sure the next storm season doesn't create another one?

## Model answer

Organize around **demand, capacity and flexibility**:

- **Manage demand on adjusters:** expand photo and video settlement to more claim types; use data to route claims to the right adjuster skill level at triage; let customers track their claim online to cut status-update calls.
- **Build capacity:** recruit and train permanent adjusters ahead of storm season; cross-train desk staff so they can handle simple assessments.
- **Add flexible capacity:** keep pre-negotiated contracts with independent adjusting firms that can be activated within days; agree "catastrophe mode" rules in advance (higher automatic-approval limits, extended hours).
- **Measure early:** track open claims and inflow daily during storms, with a trigger to activate extra capacity when the backlog starts growing — not when complaints arrive.

A top candidate prioritizes: "Pre-negotiated surge contracts are the most important — storms are predictable in season even if not in timing, and paying a small retainer is far cheaper than another backlog."
