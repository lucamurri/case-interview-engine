---
id: credit-union-member-growth
title: "Growing the Co-op: Three Paths to a Bigger Credit Union"
client: "Riverbend Community Credit Union (fictional), a member-owned US credit union serving two counties"
summary: "A credit union's board wants 12% more member balances in three years. Compare winning younger members, selling more to current members and merging with a neighbor, using the economics of one member."
industry: financial-services
sub_industry: "Retail banking / credit unions"
type: growth
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative: realistic in shape, not real company data.
inputs:
  members:         { value: 100000, unit: "members", label: "Current members" }
  balances_now:    { value: 3500,   unit: "$M", label: "Total member balances today (loans plus deposits)" }
  goal_growth:     { value: 0.12,   unit: "%", label: "Board's three-year growth goal for balances" }
  young_new:       { value: 25000,  unit: "members", label: "Young members the campaign would sign up" }
  young_ret:       { value: 0.80,   unit: "%", label: "Share of young sign-ups still active after year one" }
  young_dep:       { value: 3000,   unit: "$", label: "Average deposits per young member" }
  young_loan:      { value: 3000,   unit: "$", label: "Average loans per young member" }
  dep_spread:      { value: 0.015,  unit: "%", decimals: 1, label: "Margin earned on each deposit dollar" }
  loan_spread:     { value: 0.03,   unit: "%", decimals: 1, label: "Margin earned on each loan dollar" }
  young_fees:      { value: 35,     unit: "$", label: "Fee income per young member per year" }
  young_service:   { value: 110,    unit: "$", label: "Cost to serve a young member per year" }
  young_cac:       { value: 210,    unit: "$", label: "Cost to sign up one young member (one time)" }
  single_share:    { value: 0.40,   unit: "%", label: "Share of current members who hold only a checking account" }
  deepen_conv:     { value: 0.25,   unit: "%", label: "Share of those members the campaign converts to a loan" }
  deepen_loan:     { value: 10000,  unit: "$", label: "Average new loan per converted member" }
  deepen_anyway:   { value: 0.30,   unit: "%", label: "Share of those loans members would have taken at Riverbend anyway" }
  deepen_service:  { value: 30,     unit: "$", label: "Extra cost to serve a converted member per year" }
  deepen_cac:      { value: 150,    unit: "$", label: "Campaign cost per converted member (one time)" }
  tgt_bal:         { value: 700,    unit: "$M", label: "Balances held at the merger target (Lakeside Credit Union)" }
  tgt_members:     { value: 30000,  unit: "members", label: "Members of the merger target" }
  tgt_attr:        { value: 0.15,   unit: "%", label: "Target members expected to leave after the merger (balances leave in proportion)" }
  tgt_profit_mem:  { value: 85,     unit: "$", label: "Profit per Lakeside member per year (before savings)" }
  tgt_synergy:     { value: 3,      unit: "$M", label: "Cost savings per year from merging back offices" }
  tgt_integration: { value: 18,     unit: "$M", label: "One-time cost to merge systems and branches" }

calculations:
  - { id: goal, label: "Balance growth needed in three years", formula: "balances_now * goal_growth", expected: 420, unit: "$M" }
  # --- Young members ---
  - { id: young_kept, label: "Young members still active after year one", formula: "young_new * young_ret", expected: 20000, unit: "members" }
  - { id: young_dep_inc, label: "Deposit margin per young member per year", formula: "young_dep * dep_spread", expected: 45, unit: "$" }
  - { id: young_loan_inc, label: "Loan margin per young member per year", formula: "young_loan * loan_spread", expected: 90, unit: "$" }
  - { id: young_pm, label: "Profit per young member per year", formula: "young_dep_inc + young_loan_inc + young_fees - young_service", expected: 60, unit: "$" }
  - { id: young_profit, label: "Annual profit from young members", formula: "young_kept * young_pm / 1000000", expected: 1.2, unit: "$M" }
  - { id: young_cost, label: "One-time cost of the young-member campaign", formula: "young_new * young_cac / 1000000", expected: 5.25, unit: "$M", decimals: 2 }
  - { id: young_payback, label: "Payback on the young-member campaign", formula: "young_cost / young_profit", expected: 4.375, unit: "years", decimals: 1 }
  - { id: young_bal, label: "Balances added by young members", formula: "young_kept * (young_dep + young_loan) / 1000000", expected: 120, unit: "$M" }
  - { id: young_naive_pm, label: "Profit per young member if nobody left, ignoring retention", formula: "young_pm", expected: 60, unit: "$" }
  - { id: young_naive_payback, label: "Payback if no young member left", formula: "young_cost / (young_new * young_pm / 1000000)", expected: 3.5, unit: "years", decimals: 1 }
  # --- Deepening ---
  - { id: deepen_target, label: "Checking-only members targeted", formula: "members * single_share", expected: 40000, unit: "members" }
  - { id: deepen_won, label: "Members converted to a loan", formula: "deepen_target * deepen_conv", expected: 10000, unit: "members" }
  - { id: deepen_naive_loans, label: "New loans if every one were extra", formula: "deepen_won * deepen_loan / 1000000", expected: 100, unit: "$M" }
  - { id: deepen_bal, label: "Extra balances after removing loans that would have happened anyway", formula: "deepen_naive_loans * (1 - deepen_anyway)", expected: 70, unit: "$M" }
  - { id: deepen_profit, label: "Annual profit from deepening", formula: "deepen_bal * loan_spread - deepen_won * deepen_service / 1000000", expected: 1.8, unit: "$M" }
  - { id: deepen_cost, label: "One-time cost of the deepening campaign", formula: "deepen_won * deepen_cac / 1000000", expected: 1.5, unit: "$M" }
  - { id: deepen_payback, label: "Payback on deepening", formula: "deepen_cost / deepen_profit", expected: 0.8333, unit: "years", decimals: 1 }
  - { id: deepen_pm, label: "Profit per converted member per year", formula: "deepen_profit * 1000000 / deepen_won", expected: 180, unit: "$" }
  - { id: deepen_naive_profit, label: "Annual profit if no loan were taken anyway", formula: "deepen_naive_loans * loan_spread - deepen_won * deepen_service / 1000000", expected: 2.7, unit: "$M" }
  # --- Merger ---
  - { id: tgt_kept, label: "Lakeside members who stay", formula: "tgt_members * (1 - tgt_attr)", expected: 25500, unit: "members" }
  - { id: tgt_bal_kept, label: "Balances that stay", formula: "tgt_bal * (1 - tgt_attr)", expected: 595, unit: "$M" }
  - { id: tgt_profit_base, label: "Profit from staying members before savings", formula: "tgt_kept * tgt_profit_mem / 1000000", expected: 2.1675, unit: "$M", decimals: 1 }
  - { id: tgt_profit, label: "Annual profit from the merger including savings", formula: "tgt_profit_base + tgt_synergy", expected: 5.1675, unit: "$M", decimals: 1 }
  - { id: tgt_payback, label: "Payback on the merger", formula: "tgt_integration / tgt_profit", expected: 3.4833, unit: "years", decimals: 1 }
  - { id: tgt_base_share, label: "Share of merger profit that comes from cost savings", formula: "tgt_synergy / tgt_profit", expected: 0.5805, unit: "%", decimals: 0 }
  # --- Putting it together ---
  - { id: organic, label: "Balances from young members and deepening together", formula: "young_bal + deepen_bal", expected: 190, unit: "$M" }
  - { id: gap, label: "Gap to the goal after organic growth", formula: "goal - organic", expected: 230, unit: "$M" }
  - { id: organic_pct, label: "Share of the goal that organic growth delivers", formula: "organic / goal", expected: 0.4524, unit: "%", decimals: 0 }
  - { id: with_merger, label: "Balances added with all three paths", formula: "organic + tgt_bal_kept", expected: 785, unit: "$M" }
  - { id: surplus, label: "Balances above the goal with all three paths", formula: "with_merger - goal", expected: 365, unit: "$M" }

answer:
  calc: gap
  headline: "Organic growth reaches only {{organic}} of the {{goal}} goal. Deepening pays back in {{deepen_payback}} and should go first; only a merger closes the {{gap}} gap, at a payback of {{tgt_payback}}."

exhibits:
  - id: exhibit-1
    title: "Annual profit per member, by growth path"
    kind: table
    ask: "Finance has put together the economics of one member for each path. What stands out?"
    columns: ["Per member", "Young member", "Converted member", "Lakeside member"]
    rows:
      - ["Deposits held", "{{young_dep}}", "Not changed", "Not given"]
      - ["Loans held", "{{young_loan}}", "{{deepen_loan}}", "Not given"]
      - ["Fee income", "{{young_fees}}", "Not given", "Not given"]
      - ["Cost to serve per year", "{{young_service}}", "{{deepen_service}}", "Not given"]
      - ["Profit per year (before any savings)", "{{young_pm}}", "{{deepen_pm}}", "{{tgt_profit_mem}}"]
      - ["One-time cost to win or convert", "{{young_cac}}", "{{deepen_cac}}", "Merger: {{tgt_integration}} in total"]
    note: "Illustrative data created for this practice case. Riverbend and Lakeside are fictional. Converted-member profit is the margin on new loans less service cost."
    insight: |
      A young member earns {{young_pm}} a year, a converted member {{deepen_pm}}.
      Young members also leave: only {{young_ret}} are still active after year one.
      The per-member view favors deepening, but it hides scale.
  - id: exhibit-2
    title: "Three paths compared, three-year view"
    kind: table
    ask: "Here is each path at the scale the team planned. How would you rank them?"
    columns: ["Path", "Balances added", "Annual profit", "One-time cost", "Payback"]
    rows:
      - ["Young members", "{{young_bal}}", "{{young_profit}}", "{{young_cost}}", "{{young_payback}}"]
      - ["Deepen current members", "{{deepen_bal}}", "{{deepen_profit}}", "{{deepen_cost}}", "{{deepen_payback}}"]
      - ["Merge with Lakeside", "{{tgt_bal_kept}}", "{{tgt_profit}}", "{{tgt_integration}}", "{{tgt_payback}}"]
    note: "Illustrative data created for this practice case. Balances are after expected member attrition and after removing loans that would have happened anyway."
    insight: |
      Deepening has the best payback ({{deepen_payback}}) but adds only {{deepen_bal}}.
      The merger adds {{tgt_bal_kept}}, more than the other two combined, but {{tgt_base_share}}
      of its profit depends on cost savings that may be late.
  - id: exhibit-3
    title: "Balances added by each path against the board's goal"
    kind: bar
    unit: "$M"
    ask: "The board wants the goal reached. What does this chart tell you?"
    data:
      - { label: "Young members", value: young_bal }
      - { label: "Deepen current members", value: deepen_bal }
      - { label: "Merge with Lakeside", value: tgt_bal_kept }
    reference: { value: goal, label: "Board goal" }
    note: "Illustrative data created for this practice case."
    insight: |
      The two organic paths together add {{organic}}, which is {{organic_pct}} of the {{goal}} goal.
      Only the merger closes the {{gap}} gap on its own.
---

## Prompt

Our client is Riverbend Community Credit Union, a member-owned financial cooperative with {{members}} and {{balances_now}} in member balances (loans plus deposits). Balances have been flat for three years as older members pay down loans and the branch network ages.

The board wants **{{goal_growth}} more balances in three years**. Management has three ideas: win younger members with a mobile-first account, sell loans to current members who only have checking, or merge with a smaller credit union nearby.

The CEO asks us: **which path, or which mix, should Riverbend choose to grow, and does it pay?**

## Clarifying information

- Q: How does the board measure growth?
  A: Total member balances (loans plus deposits). The goal is a gain of {{goal}} over three years.
- Q: Is profit also a goal?
  A: Yes. As a cooperative Riverbend returns profit to members through better rates, so it needs each path to earn its keep. The board accepts paybacks up to about four years.
- Q: What is the young-member plan?
  A: A mobile-first account for 18 to 25 year-olds with a sign-up bonus. The team expects {{young_new}} to sign up, of which {{young_ret}} stay active past year one.
- Q: What is the deepening plan?
  A: About {{single_share}} of members hold only a checking account. A targeted auto and personal loan offer should convert {{deepen_conv}} of them. Exhibit 1 has the economics.
- Q: Are some of those loans ones members would have taken anyway?
  A: Yes. Past campaigns suggest {{deepen_anyway}} of such loans would have been taken at Riverbend without the offer.
- Q: Who is the merger target?
  A: Lakeside Credit Union holds {{tgt_bal}} in balances and has {{tgt_members}}. Both boards are open to talks, and no purchase price is paid in a credit union merger.
- Q: What happens to members after a merger?
  A: In similar mergers about {{tgt_attr}} of the smaller credit union's members leave when branches and systems change, and balances leave in proportion.

## Structure

> **Ask:** How would you approach this question?

Growth is **members times balances per member**, and each path moves a different one.

- **1. What does growth have to deliver?**
  - The goal in dollars, the time frame and the profit expectation
  - Why balances are flat today (older members paying down loans, no young inflow)
- **2. Evaluate each path**
  - **Young members:** how many join, how many stay, balances and profit per member, cost to win, payback and long-term value as they age
  - **Deepen current members:** size of the target group, conversion, how much of the lending is truly extra, margin and cost to serve
  - **Merger:** balances and members acquired, attrition, profit per member, cost savings, integration cost and risk
- **3. Compare and combine**
  - Scale (balances added) against return (payback)
  - How far the organic paths go toward the goal and what is left over
- **4. Risks and enablers:** lending credit quality, capital ratios, culture and systems integration, regulatory approval

A good hypothesis: *"Selling more to current members is the cheapest growth, but it is small. I expect only a merger gets to the goal, so the question is whether to do one."*

## Math walkthrough

> **Ask:** Work out the economics of one member on each path, then compare the three paths against the goal.

**1. The goal.**
{{balances_now}} × {{goal_growth}} gives **{{goal}}** to add in three years.

**2. Young members.**
Of the {{young_new}} who sign up, {{young_kept}} stay active. Each earns {{young_dep_inc}} on deposits and {{young_loan_inc}} on loans, plus {{young_fees}} in fees, less {{young_service}} to serve: **{{young_pm}}** a year.
Annual profit is {{young_kept}} × {{young_pm}}, or **{{young_profit}}**. The one-time cost is {{young_new}} × {{young_cac}}, or **{{young_cost}}**, so payback is **{{young_payback}}**.
Balances added: {{young_bal}}.
If nobody left, payback would be {{young_naive_payback}}. The attrition assumption lengthens it by almost a year.

**3. Deepening.**
Target group: {{members}} × {{single_share}}, or {{deepen_target}}. At {{deepen_conv}} conversion that is {{deepen_won}}, each taking {{deepen_loan}}: {{deepen_naive_loans}} of new loans on paper.
But {{deepen_anyway}} of those loans would have happened anyway, so the extra balances are **{{deepen_bal}}**.
Annual profit is {{deepen_bal}} × {{loan_spread}} less the service cost of {{deepen_won}} × {{deepen_service}}, or **{{deepen_profit}}**. Ignoring the "would have happened anyway" correction would overstate profit at {{deepen_naive_profit}}.
Cost is {{deepen_cost}}, so payback is **{{deepen_payback}}**.

**4. Merger.**
After {{tgt_attr}} attrition, {{tgt_kept}} and **{{tgt_bal_kept}}** of balances remain.
Profit is {{tgt_kept}} × {{tgt_profit_mem}}, or {{tgt_profit_base}}, plus {{tgt_synergy}} of savings: **{{tgt_profit}}**. Against {{tgt_integration}} of integration cost, payback is **{{tgt_payback}}**.
More than half of that profit ({{tgt_base_share}}) is cost savings, which depend on execution.

**5. Compare with the goal.**
Young members and deepening add {{young_bal}} plus {{deepen_bal}}, or **{{organic}}**: only {{organic_pct}} of the {{goal}} goal. The gap is **{{gap}}**.
The merger alone adds {{tgt_bal_kept}}, enough to close the gap. All three together would reach {{with_merger}}, about {{surplus}} above the goal.

## Synthesis

> **Ask:** What would you tell the CEO and the board?

**Riverbend should start deepening now, because it pays back in under a year, and run a smaller young-member program as an investment in the future. But those two paths reach only {{organic}} of the {{goal}} goal, so the board has to decide whether to pursue a merger, the only path that closes the {{gap}} gap.**

1. **Deepening is the best return:** it pays back in {{deepen_payback}} and earns {{deepen_pm}} per converted member, but after removing loans members would have taken anyway it adds only {{deepen_bal}}.
2. **Young members are a long-term bet:** payback is {{young_payback}} because {{young_ret}} stay, and balances grow as members start careers and buy homes. Test and track retention before scaling.
3. **The merger is the only path to the goal:** it adds {{tgt_bal_kept}} and pays back in {{tgt_payback}}, but {{tgt_base_share}} of its profit comes from savings and it carries the most execution risk.

**Risks and next steps:** launch the deepening campaign with a holdout group to measure how many loans are truly extra; pilot the young-member account in one county and watch retention; open exploratory talks with Lakeside and plan member communication and branch coverage early to keep attrition at or below {{tgt_attr}}; check credit quality of new loans and capital ratios before committing; and ask the board whether {{goal_growth}} balance growth is the right goal, or whether profit and member value should count too.

## Common mistakes

- Treating all {{deepen_naive_loans}} of new loans as extra and ignoring loans members would have taken anyway.
- Assuming every young sign-up stays, which hides a payback near {{young_payback}}.
- Picking the merger because it is largest, without checking attrition, savings risk or integration cost.
- Stopping at "which path is best" instead of testing whether any one path, or a mix, actually reaches the goal.

## What top candidates do differently

- Build the economics of one member first (margin, fees, service cost, cost to win) and then scale it.
- Question every volume number: how many would come anyway, how many will leave.
- Show the gap to the goal after the cheap paths and let the merger decision follow from it.
- Note that the paths are not exclusive and suggest a sequence, with the fast payback first.

## Creative question

Besides the three paths, how else could Riverbend grow balances without spending much?

## Model answer

Group ideas by **member, partner and product**:

- **Member:** a referral reward for current members who bring a friend; workplace and employer programs that bring in many members at once; campaigns that win back members who moved their paycheck elsewhere.
- **Partner:** a shared-branch and ATM network with other credit unions to widen reach; lending partnerships with car dealers and local home builders.
- **Product:** a youth savings account for children of members, who grow into the young-member segment; small-business accounts for the owners already among the members.

A top candidate prioritizes: "Referrals and employer programs bring members at a lower cost than a sign-up bonus, so I would test those first and compare their cost to the {{young_cac}} per young member in the current plan."
