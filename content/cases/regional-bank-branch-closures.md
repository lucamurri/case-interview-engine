---
id: regional-bank-branch-closures
title: "Closing the Doors: Which Branches Should a Regional Bank Shut?"
client: "Three Rivers Bank (fictional), a regional bank with 300 branches in Ohio and Pennsylvania"
summary: "A regional bank wants to close a third of its branches to save $100M a year. Weigh the cost saved against the deposits that walk out the door, and find out why the answer depends on how far customers must travel to the next branch."
industry: other
sub_industry: "Retail banking"
type: operations
difficulty: advanced
format: candidate-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real bank or market data.
inputs:
  branches:      { value: 300,  unit: "branches", label: "Three Rivers branches today" }
  n_close:       { value: 100,  unit: "branches", label: "Branches on the closure list" }
  cost_per:      { value: 1.5,  unit: "$M",       label: "Operating cost per branch per year (staff, rent, security, upkeep)", decimals: 1 }
  save_share:    { value: 0.80, unit: "%",        label: "Share of a closed branch's cost the bank actually saves" }
  deposits:      { value: 100,  unit: "$M",       label: "Average deposits per branch on the closure list" }
  dep_margin:    { value: 0.02, unit: "%",        label: "Deposit margin: what the bank earns on a dollar of deposits per year, after the interest it pays" }
  plan_attr:     { value: 0.10, unit: "%",        label: "Plan assumption: share of a closed branch's deposits that leave the bank" }
  closure_cost:  { value: 1.0,  unit: "$M",       label: "One-time cash cost to close a branch (lease exit, severance, signage)", decimals: 1 }
  book_value:    { value: 0.5,  unit: "$M",       label: "Book value of furniture and equipment written off at closure (not cash)", decimals: 1 }
  n_near:        { value: 60,   unit: "branches", label: "Closure-list branches within 2 miles of a branch that stays open" }
  n_mid:         { value: 20,   unit: "branches", label: "Closure-list branches 2–5 miles from the nearest remaining branch" }
  n_far:         { value: 20,   unit: "branches", label: "Closure-list branches more than 5 miles from the nearest remaining branch" }
  att_near:      { value: 0.10, unit: "%",        label: "Deposit attrition after closure, nearest branch within 2 miles" }
  att_mid:       { value: 0.30, unit: "%",        label: "Deposit attrition after closure, nearest branch 2–5 miles away" }
  att_far:       { value: 0.70, unit: "%",        label: "Deposit attrition after closure, nearest branch more than 5 miles away" }
  light_saving:  { value: 0.6,  unit: "$M",       label: "Light format: cost saved per branch per year", decimals: 1 }
  light_attr:    { value: 0.05, unit: "%",        label: "Light format: share of deposits that leave" }
  light_cost:    { value: 0.5,  unit: "$M",       label: "Light format: one-time conversion cost per branch", decimals: 1 }
  target:        { value: 100,  unit: "$M",       label: "Objective: pre-tax profit improvement per year" }

calculations:
  # --- The plan as proposed (Exhibit 1) ---
  - { id: close_share, label: "Share of the network on the closure list", formula: "n_close / branches", expected: 0.333, unit: "%", decimals: 0 }
  - { id: saving_per, label: "Cost saved per closed branch per year", formula: "cost_per * save_share", expected: 1.2, unit: "$M", decimals: 1 }
  - { id: margin_per, label: "Deposit margin earned per branch per year", formula: "deposits * dep_margin", expected: 2.0, unit: "$M", decimals: 1 }
  - { id: plan_lost_per, label: "Plan: deposit margin lost per closed branch", formula: "margin_per * plan_attr", expected: 0.2, unit: "$M", decimals: 1 }
  - { id: plan_net_per, label: "Plan: net saving per closed branch", formula: "saving_per - plan_lost_per", expected: 1.0, unit: "$M", decimals: 1 }
  - { id: plan_annual, label: "Plan: net saving per year", formula: "n_close * plan_net_per", expected: 100, unit: "$M" }
  - { id: plan_onetime, label: "Plan: one-time closure cost", formula: "n_close * closure_cost", expected: 100, unit: "$M" }
  - { id: plan_payback, label: "Plan: payback", formula: "plan_onetime / plan_annual", expected: 1.0, unit: "year", decimals: 1 }
  - { id: writeoff_total, label: "Plan: non-cash write-off (ignore for savings)", formula: "n_close * book_value", expected: 50, unit: "$M" }
  # --- Attrition by distance (Exhibit 2) ---
  - { id: lost_near, label: "Margin lost per closed branch, within 2 miles", formula: "margin_per * att_near", expected: 0.2, unit: "$M", decimals: 1 }
  - { id: lost_mid, label: "Margin lost per closed branch, 2–5 miles", formula: "margin_per * att_mid", expected: 0.6, unit: "$M", decimals: 1 }
  - { id: lost_far, label: "Margin lost per closed branch, more than 5 miles", formula: "margin_per * att_far", expected: 1.4, unit: "$M", decimals: 1 }
  - { id: net_near, label: "Net saving per closed branch, within 2 miles", formula: "saving_per - lost_near", expected: 1.0, unit: "$M", decimals: 1 }
  - { id: net_mid, label: "Net saving per closed branch, 2–5 miles", formula: "saving_per - lost_mid", expected: 0.6, unit: "$M", decimals: 1 }
  - { id: net_far, label: "Net saving per closed branch, more than 5 miles", formula: "saving_per - lost_far", expected: -0.2, unit: "$M", decimals: 1 }
  - { id: yr_near, label: "Net saving per year, branches within 2 miles", formula: "n_near * net_near", expected: 60, unit: "$M" }
  - { id: yr_mid, label: "Net saving per year, branches 2–5 miles away", formula: "n_mid * net_mid", expected: 12, unit: "$M" }
  - { id: yr_far, label: "Net saving per year, branches more than 5 miles away", formula: "n_far * net_far", expected: -4, unit: "$M" }
  - { id: far_cost, label: "Profit lost per year per isolated branch closed", formula: "-net_far", expected: 0.2, unit: "$M", decimals: 1 }
  - { id: avg_attr, label: "Average attrition across the closure list", formula: "(n_near * att_near + n_mid * att_mid + n_far * att_far) / n_close", expected: 0.26, unit: "%" }
  - { id: all_annual, label: "Net saving per year if all 100 close", formula: "n_near * net_near + n_mid * net_mid + n_far * net_far", expected: 68, unit: "$M" }
  - { id: plan_overstate, label: "Amount by which the plan overstates the saving", formula: "plan_annual - all_annual", expected: 32, unit: "$M" }
  - { id: mid_payback, label: "Payback on closing a 2–5 mile branch", formula: "closure_cost / net_mid", expected: 1.67, unit: "years", decimals: 1 }
  - { id: n_close_new, label: "Branches to close (within 5 miles of another)", formula: "n_near + n_mid", expected: 80, unit: "branches" }
  - { id: close80_annual, label: "Net saving per year, closing only those within 5 miles", formula: "n_near * net_near + n_mid * net_mid", expected: 72, unit: "$M" }
  - { id: close80_onetime, label: "One-time cost, closing only those within 5 miles", formula: "n_close_new * closure_cost", expected: 80, unit: "$M" }
  # --- Light format for isolated branches (Exhibit 3) ---
  - { id: light_lost, label: "Light format: margin lost per branch", formula: "margin_per * light_attr", expected: 0.1, unit: "$M", decimals: 1 }
  - { id: light_net, label: "Light format: net saving per branch", formula: "light_saving - light_lost", expected: 0.5, unit: "$M", decimals: 1 }
  - { id: light_annual, label: "Light format: net saving per year for the isolated branches", formula: "n_far * light_net", expected: 10, unit: "$M" }
  - { id: light_onetime, label: "Light format: one-time cost", formula: "n_far * light_cost", expected: 10, unit: "$M" }
  - { id: rec_annual, label: "Recommended plan: net saving per year", formula: "close80_annual + light_annual", expected: 82, unit: "$M" }
  - { id: rec_onetime, label: "Recommended plan: one-time cost", formula: "close80_onetime + light_onetime", expected: 90, unit: "$M" }
  - { id: rec_payback, label: "Recommended plan: payback", formula: "rec_onetime / rec_annual", expected: 1.1, unit: "years", decimals: 1, tolerance: 0.01 }
  - { id: target_gap, label: "Shortfall against the objective", formula: "target - rec_annual", expected: 18, unit: "$M" }
  - { id: gain_vs_all, label: "Recommended plan versus closing all 100", formula: "rec_annual - all_annual", expected: 14, unit: "$M" }
  - { id: dep_lost_all, label: "Deposits lost if all 100 close", formula: "(n_near * att_near + n_mid * att_mid + n_far * att_far) * deposits / 1000", expected: 2.6, unit: "$B", decimals: 1 }
  - { id: dep_lost_rec, label: "Deposits lost under the recommended plan", formula: "(n_near * att_near + n_mid * att_mid + n_far * light_attr) * deposits / 1000", expected: 1.3, unit: "$B", decimals: 1 }

answer:
  calc: rec_annual
  headline: "Close the {{n_close_new}} within 5 miles of another and convert the isolated {{n_far}} to a light format: about {{rec_annual}} a year, versus {{all_annual}} from closing all {{n_close}}, though still {{target_gap}} short of the {{target}} goal."

exhibits:
  - id: exhibit-1
    title: "The closure plan: economics per branch"
    kind: table
    ask: "Here is the plan the bank's operations team put together. Does it hit the goal?"
    columns: ["Item", "Value"]
    rows:
      - ["Branches today", "{{branches}}"]
      - ["Branches on the closure list", "{{n_close}}"]
      - ["Operating cost per branch per year", "{{cost_per}}"]
      - ["Share of that cost saved when a branch closes", "{{save_share}} (the rest moves to nearby branches that take on its customers)"]
      - ["Average deposits per closure-list branch", "{{deposits}}"]
      - ["Expected share of deposits that leave the bank", "{{plan_attr}} (the average from the 12 branches Three Rivers closed in 2022–2024)"]
      - ["One-time cash cost per closure", "{{closure_cost}}"]
      - ["Book value of furniture and equipment written off per closure", "{{book_value}}"]
    note: "Illustrative data created for this practice case. Three Rivers Bank is fictional."
    insight: |
      On the plan's numbers each closure saves {{saving_per}} of cost and loses
      {{plan_lost_per}} of deposit margin, a net {{plan_net_per}}, so 100 closures
      exactly hit the goal. The write-off is an accounting charge, not cash. The
      key question is whether the {{plan_attr}} attrition applies to every branch.
  - id: exhibit-2
    title: "Deposit attrition after a closure, by distance to the nearest remaining branch"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "The analytics team looked at closures across the industry. What does this tell you about the plan?"
    data:
      - { label: "Within 2 miles", value: att_near }
      - { label: "2–5 miles", value: att_mid }
      - { label: "More than 5 miles", value: att_far }
    note: "Illustrative data created for this practice case; not industry statistics. Of the {{n_close}} on the closure list, {{n_near}} are within 2 miles of a branch that stays open, {{n_mid}} are 2–5 miles away and {{n_far}} are more than 5 miles away. All 12 of Three Rivers' past closures were within 2 miles of another branch."
    insight: |
      The plan's {{plan_attr}} came only from branches with a neighbor nearby.
      Where the next branch is more than 5 miles away, {{att_far}} of deposits
      leave, and closing the branch loses more margin than it saves in cost.
  - id: exhibit-3
    title: "An alternative for isolated branches: the light format"
    kind: table
    ask: "For branches with no neighbor nearby, the team has costed a smaller format. Does it change your recommendation?"
    columns: ["Item", "Full branch today", "Light format"]
    rows:
      - ["Staff", "8–10, including tellers and a branch manager", "2 advisers plus video tellers"]
      - ["Opening hours", "Six days", "Five days, appointments on Saturday"]
      - ["Cost saved per year", "None", "{{light_saving}}"]
      - ["Share of deposits that leave", "None", "{{light_attr}}"]
      - ["One-time conversion cost", "None", "{{light_cost}}"]
    note: "Illustrative data created for this practice case; based on a fictional six-branch pilot."
    insight: |
      The light format saves half as much cost as a closure but keeps almost
      all the deposits, so it earns {{light_net}} per branch a year instead of
      the {{far_cost}} loss from closing.
---

## Prompt

Our client, Three Rivers Bank, is a regional bank with {{branches}} across Ohio and Pennsylvania. Like most US banks, it has seen branch visits fall steadily as customers move to the mobile app, while the cost of running each branch keeps rising.

The CEO has promised the board to improve pre-tax profit, and the operations team proposes **closing {{n_close}}, a third of the network**. The CEO asks us: **is this the right plan, and which branches should we close?**

## Clarifying information

- Q: What is the objective?
  A: Improve pre-tax profit by **{{target}}** a year once the changes are complete, with one-time costs paid back within about two years.
- Q: How does a branch make money for the bank?
  A: Mainly through the deposits it gathers. The bank lends or invests those deposits and, after the interest it pays depositors, earns a **deposit margin of about {{dep_margin}}** a year on each dollar.
- Q: What happens to customers when a branch closes?
  A: Their accounts move to the nearest remaining branch. Most keep banking with Three Rivers, but some move their money to a competitor with a branch closer by.
- Q: Do the branches also make loans?
  A: Yes, but most consumer and small-business loans are now originated online or by central teams. Assume loan volume is not affected by closures.
- Q: How quickly would the changes happen?
  A: All in the next 12 months. Compare the annual savings once complete with the one-time costs; ignore the timing within the year.
- Q: Are there regulatory constraints?
  A: Banks must give customers and regulators advance notice before closing a branch, and regulators look at the effect on low- and moderate-income neighborhoods. Assume the plan can meet these requirements, but note the risk.

## Structure

> **Ask:** How would you structure the decision?

The net value of closing a branch is the **cost saved minus the deposit margin that walks out the door**, compared with the one-time cost of closing:

- **1. What does a closure save?**
  - Operating cost per branch × share actually saved (some cost moves to nearby branches)
  - One-time cash costs: lease exit, severance, signage (write-offs are not cash)
- **2. What does a closure lose?**
  - Deposits per branch × share that leave × deposit margin
  - What drives attrition: distance to the next branch, competitor branches, customer age and digital use
- **3. Which branches?**
  - Rank branches by net saving; the answer may differ by group
  - Alternatives to closing: smaller formats, shorter hours, shared branches
- **4. Risks:** regulators and community reaction, small-business customers who need cash services, staff morale

Hypothesis: *"The plan probably assumes the same deposit attrition everywhere. Customers who have another branch a few blocks away will stay; customers who would have to drive 20 minutes may not, so I expect some closures to destroy value."*

## Math walkthrough

> **Ask:** Using Exhibit 1, what does the plan deliver? Then, using Exhibit 2, what does it really deliver, and which branches should close? Finally, does Exhibit 3 change the recommendation?

**1. The plan (Exhibit 1).**
Cost saved per closure: $1.5M × 80% = **{{saving_per}}**.
Deposit margin per branch: $100M × 2% = {{margin_per}}, so at {{plan_attr}} attrition each closure loses **{{plan_lost_per}}**.
Net saving per closure = $1.2M − $0.2M = **{{plan_net_per}}**, and 100 closures give **{{plan_annual}}** a year for **{{plan_onetime}}** of one-time cost, a payback of {{plan_payback}}.
The {{writeoff_total}} write-off is a non-cash accounting charge; it does not belong in the savings or the payback.

**2. Attrition depends on distance (Exhibit 2).**

| Distance to nearest remaining branch | Branches | Margin lost per closure | Net saving per closure | Net saving per year |
|---|---|---|---|---|
| Within 2 miles | {{n_near}} | $2.0M × 10% = {{lost_near}} | {{net_near}} | {{yr_near}} |
| 2–5 miles | {{n_mid}} | $2.0M × 30% = {{lost_mid}} | {{net_mid}} | {{yr_mid}} |
| More than 5 miles | {{n_far}} | $2.0M × 70% = {{lost_far}} | {{net_far}} | {{yr_far}} |
| **All 100** | | | | **{{all_annual}}** |

Average attrition across the list is really **{{avg_attr}}**, not {{plan_attr}}: the plan's figure came only from branches with a neighbor nearby. Closing all 100 saves {{all_annual}}, so the plan overstates the saving by **{{plan_overstate}}**.
Each isolated closure *reduces* profit by {{far_cost}} a year and still costs {{closure_cost}} to do. The 2–5 mile group still pays back, in about {{mid_payback}}.
So close the **{{n_close_new}}** within 5 miles of another branch: **{{close80_annual}}** a year for {{close80_onetime}} of one-time cost.

**3. The light format (Exhibit 3).**
For the isolated branches: $0.6M − $2.0M × 5% = **{{light_net}}** per branch a year, or **{{light_annual}}** for all {{n_far}}, for a one-time cost of {{light_onetime}}. The light format is not worth it for the 2–5 mile group: closing those branches earns {{net_mid}} a year against {{light_net}} for a conversion, so closing still wins once the one-time costs are paid.

| Plan | Net saving per year | One-time cost | Deposits lost |
|---|---|---|---|
| Close all 100 (as proposed, real attrition) | {{all_annual}} | {{plan_onetime}} | {{dep_lost_all}} |
| Close 80, convert 20 to light format | **{{rec_annual}}** | {{rec_onetime}} | {{dep_lost_rec}} |

The recommended plan saves {{gain_vs_all}} more a year than closing all 100, costs less upfront, loses half as many deposits, and pays back in about **{{rec_payback}}**. But it is **{{target_gap}}** short of the {{target}} goal.

## Synthesis

> **Ask:** What do you tell the CEO?

**Don't close all {{n_close}}. Close the {{n_close_new}} that are within 5 miles of another branch and convert the isolated {{n_far}} to a light format. That improves profit by about {{rec_annual}} a year, more than the {{all_annual}} the full plan would really deliver, but still {{target_gap}} short of the {{target}} goal.**

1. **The plan's attrition assumption is too optimistic:** {{plan_attr}} came from past closures that all had a branch nearby. Across the list, attrition would average {{avg_attr}}, and closing all 100 saves only {{all_annual}}.
2. **Isolated branches are worth keeping:** where the next branch is more than 5 miles away, {{att_far}} of deposits leave, and each closure loses {{far_cost}} a year on top of its one-time cost.
3. **A light format captures most of the saving without the deposit loss:** {{light_net}} per branch a year for the isolated ones.

**Risks and next steps:** tell the board now that branch changes alone deliver about {{rec_annual}}, and find the other {{target_gap}} elsewhere, for example by converting low-traffic branches among the 200 that stay to the light format, shortening hours across the remaining network, sharing back-office functions, or a second wave of closures where two remaining branches overlap. Rebuild the closure list branch by branch using distance to the nearest Three Rivers branch *and* to competitors' branches. Check the effect on low- and moderate-income neighborhoods before announcing, and contact large depositors at closing branches personally, since a few large accounts can drive much of the attrition.

## Common mistakes

- Applying one attrition rate to every branch and concluding the plan hits {{target}} exactly.
- Counting the {{writeoff_total}} write-off as a cash cost, or adding the full {{cost_per}} branch cost as the saving when some cost moves to nearby branches.
- Valuing lost deposits at their full amount instead of the margin the bank earns on them.
- Closing the isolated branches along with the rest because the plan as a whole still saves money, when each isolated closure reduces profit by {{far_cost}} a year and costs {{closure_cost}} to carry out.
- Presenting {{rec_annual}} as meeting the objective instead of saying clearly that it falls short.

## What top candidates do differently

- Ask what drives deposit attrition before seeing Exhibit 2, and question where the plan's {{plan_attr}} came from.
- Compute net saving per closure by group, so the decision becomes a simple ranking.
- Look for an option between "keep" and "close" for branches where closing destroys value.
- State the shortfall plainly and suggest where the rest of the saving could come from.

## Creative question

How could Three Rivers reduce the share of deposits that leave when it does close a branch?

## Model answer

Organize the ideas around **before, during and after** the closure:

- **Before:** call every large depositor and small-business owner personally; assign them a named banker at the receiving branch; offer a higher savings rate or fee waivers for a year to customers who move their accounts.
- **During:** keep an ATM (ideally one that takes deposits) at the old site or a nearby grocery store; run pop-up "help days" to set customers up on the mobile app and mobile check deposit.
- **After:** a dedicated phone line for customers of closed branches; track attrition month by month and follow up with customers whose balances fall.

A top candidate prioritizes: "The personal outreach to large depositors matters most. Deposits are concentrated, so the top tenth of customers at a branch often hold over half of its deposits, and keeping them is what decides whether a closure pays."
