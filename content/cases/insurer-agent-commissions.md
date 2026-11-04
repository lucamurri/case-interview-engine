---
id: insurer-agent-commissions
title: "Paid to Grow: Agent Commissions at a Home-and-Auto Insurer"
client: "Brightwater Mutual (fictional), a US home and auto insurer selling direct and through independent agents"
summary: "Premiums are up 20% but underwriting profit has halved. The losses sit with independent agents who are paid on volume, and the fix is a commission plan that pays for good business without driving the best agents away."
industry: financial-services
sub_industry: "Insurance"
type: profitability
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real insurer data.
inputs:
  direct_23:     { value: 500,  unit: "$M", label: "Premium written direct (online and phone), FY2023" }
  direct_25:     { value: 500,  unit: "$M", label: "Premium written direct, FY2025" }
  agent_23:      { value: 500,  unit: "$M", label: "Premium written through independent agents, FY2023" }
  agent_25:      { value: 700,  unit: "$M", label: "Premium written through independent agents, FY2025" }
  lr_direct:     { value: 0.65, unit: "%",  label: "Loss ratio, direct business (both years)" }
  lr_agent_23:   { value: 0.65, unit: "%",  label: "Loss ratio, agent business, FY2023" }
  lr_agent_25:   { value: 0.75, unit: "%",  label: "Loss ratio, agent business, FY2025" }
  exp_direct:    { value: 0.25, unit: "%",  label: "Expense ratio, direct business (advertising, operations)" }
  comm_old:      { value: 0.15, unit: "%",  label: "Agent commission today (share of premium, all agents)" }
  other_exp:     { value: 0.10, unit: "%",  label: "Other expenses on agent business (operations, claims handling)" }
  cat_lr:        { value: 0.08, unit: "%",  label: "Weather-catastrophe losses as a share of premium (both years, in line with the 10-year average)" }
  a_23:          { value: 400,  unit: "$M", label: "Tier A agents' premium, FY2023" }
  b_23:          { value: 80,   unit: "$M", label: "Tier B agents' premium, FY2023" }
  c_23:          { value: 20,   unit: "$M", label: "Tier C agents' premium, FY2023" }
  a_25:          { value: 400,  unit: "$M", label: "Tier A agents' premium, FY2025" }
  b_25:          { value: 200,  unit: "$M", label: "Tier B agents' premium, FY2025" }
  c_25:          { value: 100,  unit: "$M", label: "Tier C agents' premium, FY2025" }
  lr_a:          { value: 0.65, unit: "%",  label: "Loss ratio, Tier A agents, FY2025" }
  lr_b:          { value: 0.80, unit: "%",  label: "Loss ratio, Tier B agents, FY2025" }
  lr_c:          { value: 1.05, unit: "%",  label: "Loss ratio, Tier C agents, FY2025" }
  comm_flat:     { value: 0.12, unit: "%",  label: "CFO proposal: flat commission for all agents" }
  move_share:    { value: 0.25, unit: "%",  label: "Share of their Brightwater book Tier A agents say they would move to other insurers if their commission is cut" }
  base_new:      { value: 0.10, unit: "%",  label: "Redesign: base commission" }
  profit_share:  { value: 0.50, unit: "%",  label: "Redesign: bonus per point of loss ratio below the target" }
  target_lr:     { value: 0.75, unit: "%",  label: "Redesign: target loss ratio for the bonus" }

calculations:
  # --- Exhibit 1: results by channel ---
  - { id: prem_23, label: "Total premium, FY2023", formula: "direct_23 + agent_23", expected: 1000, unit: "$M" }
  - { id: prem_25, label: "Total premium, FY2025", formula: "direct_25 + agent_25", expected: 1200, unit: "$M" }
  - { id: prem_growth, label: "Premium growth", formula: "prem_25 / prem_23 - 1", expected: 0.20, unit: "%" }
  - { id: exp_agent, label: "Expense ratio, agent business (commission + other)", formula: "comm_old + other_exp", expected: 0.25, unit: "%" }
  - { id: direct_uw_23, label: "Underwriting profit, direct, FY2023", formula: "direct_23 * (1 - lr_direct - exp_direct)", expected: 50, unit: "$M" }
  - { id: agent_uw_23, label: "Underwriting profit, agents, FY2023", formula: "agent_23 * (1 - lr_agent_23 - exp_agent)", expected: 50, unit: "$M" }
  - { id: uw_23, label: "Underwriting profit, FY2023", formula: "direct_uw_23 + agent_uw_23", expected: 100, unit: "$M" }
  - { id: direct_uw_25, label: "Underwriting profit, direct, FY2025", formula: "direct_25 * (1 - lr_direct - exp_direct)", expected: 50, unit: "$M" }
  - { id: agent_uw_25, label: "Underwriting profit, agents, FY2025", formula: "agent_25 * (1 - lr_agent_25 - exp_agent)", expected: 0, unit: "$M" }
  - { id: uw_25, label: "Underwriting profit, FY2025", formula: "direct_uw_25 + agent_uw_25", expected: 50, unit: "$M" }
  - { id: uw_drop, label: "Fall in underwriting profit", formula: "uw_23 - uw_25", expected: 50, unit: "$M" }
  - { id: combined_agent_25, label: "Combined ratio, agent business, FY2025", formula: "lr_agent_25 + exp_agent", expected: 1.00, unit: "%" }
  - { id: lr_rise, label: "Rise in the agent loss ratio", formula: "lr_agent_25 - lr_agent_23", expected: 0.10, unit: "pts" }
  # --- Profit bridge ---
  - { id: volume_effect, label: "Agent volume effect (extra premium at the FY2023 margin)", formula: "(agent_25 - agent_23) * (1 - lr_agent_23 - exp_agent)", expected: 20, unit: "$M" }
  - { id: lr_effect, label: "Agent loss-ratio effect", formula: "agent_25 * (lr_agent_23 - lr_agent_25)", expected: -70, unit: "$M" }
  - { id: direct_effect, label: "Direct channel effect", formula: "direct_uw_25 - direct_uw_23", expected: 0, unit: "$M" }
  - { id: bridge_total, label: "Bridge total (must equal the change in profit)", formula: "volume_effect + lr_effect + direct_effect", expected: -50, unit: "$M" }
  # --- Exhibit 2: agent tiers ---
  - { id: lr_tier_check, label: "Premium-weighted tier loss ratio (must equal the agent loss ratio)", formula: "(a_25 * lr_a + b_25 * lr_b + c_25 * lr_c) / agent_25", expected: 0.75, unit: "%" }
  - { id: growth_b, label: "Tier B premium growth", formula: "b_25 / b_23 - 1", expected: 1.5, unit: "%" }
  - { id: growth_c, label: "Tier C premium growth", formula: "c_25 / c_23 - 1", expected: 4.0, unit: "%" }
  - { id: bc_growth_share, label: "Share of agent growth from Tiers B and C", formula: "(b_25 - b_23 + c_25 - c_23) / (agent_25 - agent_23)", expected: 1.0, unit: "%" }
  - { id: uw_a, label: "Underwriting profit, Tier A, FY2025", formula: "a_25 * (1 - lr_a - exp_agent)", expected: 40, unit: "$M" }
  - { id: uw_b, label: "Underwriting profit, Tier B, FY2025", formula: "b_25 * (1 - lr_b - exp_agent)", expected: -10, unit: "$M" }
  - { id: uw_c, label: "Underwriting profit, Tier C, FY2025", formula: "c_25 * (1 - lr_c - exp_agent)", expected: -30, unit: "$M" }
  - { id: comm_paid_c, label: "Commission paid to Tier C agents, FY2025", formula: "c_25 * comm_old", expected: 15, unit: "$M" }
  - { id: uw_c_loss, label: "Underwriting loss, Tier C, FY2025", formula: "-uw_c", expected: 30, unit: "$M" }
  # --- Exhibit 3, option 1: CFO's flat cut ---
  - { id: flat_saving_paper, label: "Commission saved on paper (same book, all agents)", formula: "agent_25 * (comm_old - comm_flat)", expected: 21, unit: "$M" }
  - { id: uw_flat_paper, label: "Underwriting profit with the flat cut, on paper", formula: "uw_25 + flat_saving_paper", expected: 71, unit: "$M" }
  - { id: flat_a, label: "Tier A profit with the flat cut, after agents move business", formula: "a_25 * (1 - move_share) * (1 - lr_a - other_exp - comm_flat)", expected: 39, unit: "$M" }
  - { id: flat_b, label: "Tier B profit with the flat cut", formula: "b_25 * (1 - lr_b - other_exp - comm_flat)", expected: -4, unit: "$M" }
  - { id: flat_c, label: "Tier C profit with the flat cut", formula: "c_25 * (1 - lr_c - other_exp - comm_flat)", expected: -27, unit: "$M" }
  - { id: uw_flat, label: "Underwriting profit with the flat cut, realistic", formula: "direct_uw_25 + flat_a + flat_b + flat_c", expected: 58, unit: "$M" }
  # --- Exhibit 3, option 2: profit-based commission ---
  - { id: comm_a, label: "Tier A commission under the redesign", formula: "base_new + profit_share * max(0, target_lr - lr_a)", expected: 0.15, unit: "%" }
  - { id: comm_b, label: "Tier B commission under the redesign", formula: "base_new + profit_share * max(0, target_lr - lr_b)", expected: 0.10, unit: "%" }
  - { id: comm_c, label: "Tier C commission under the redesign", formula: "base_new + profit_share * max(0, target_lr - lr_c)", expected: 0.10, unit: "%" }
  - { id: new_a, label: "Tier A profit under the redesign", formula: "a_25 * (1 - lr_a - other_exp - comm_a)", expected: 40, unit: "$M" }
  - { id: new_b, label: "Tier B profit under the redesign", formula: "b_25 * (1 - lr_b - other_exp - comm_b)", expected: 0, unit: "$M" }
  - { id: new_c, label: "Tier C profit under the redesign", formula: "c_25 * (1 - lr_c - other_exp - comm_c)", expected: -25, unit: "$M" }
  - { id: uw_new, label: "Underwriting profit under the redesign", formula: "direct_uw_25 + new_a + new_b + new_c", expected: 65, unit: "$M" }
  - { id: breakeven_lr_new, label: "Loss ratio at which an agent's business breaks even on base commission", formula: "1 - other_exp - base_new", expected: 0.80, unit: "%" }
  - { id: uw_exit_c, label: "Underwriting profit under the redesign with Tier C re-underwritten to break-even (or exited)", formula: "uw_new - new_c", expected: 90, unit: "$M" }
  - { id: gap_to_23, label: "Remaining gap to the FY2023 underwriting profit", formula: "uw_23 - uw_exit_c", expected: 10, unit: "$M" }
  - { id: redesign_vs_flat, label: "Redesign advantage over the realistic flat cut (Tier C kept)", formula: "uw_new - uw_flat", expected: 7, unit: "$M" }

answer:
  calc: uw_exit_c
  headline: "Underwriting profit halved to {{uw_25}} because volume-paid agents in Tiers B and C wrote loss-making business; a {{base_new}} base commission plus a profit bonus keeps Tier A whole and, with Tier C re-underwritten, lifts profit to ~{{uw_exit_c}}, about {{gap_to_23}} short of the FY2023 level."

exhibits:
  - id: exhibit-1
    title: "Brightwater results by sales channel"
    kind: table
    ask: "Here are results for the two channels. What's driving the profit decline?"
    columns: ["", "FY2023", "FY2025"]
    rows:
      - ["Premium written direct", "{{direct_23}}", "{{direct_25}}"]
      - ["Premium written through agents", "{{agent_23}}", "{{agent_25}}"]
      - ["Loss ratio, direct", "{{lr_direct}}", "{{lr_direct}}"]
      - ["Loss ratio, agents", "{{lr_agent_23}}", "{{lr_agent_25}}"]
      - ["Expense ratio, direct", "{{exp_direct}}", "{{exp_direct}}"]
      - ["Expense ratio, agents (incl. {{comm_old}} commission)", "{{exp_agent}}", "{{exp_agent}}"]
      - ["Weather-catastrophe losses (share of premium, included above)", "{{cat_lr}}", "{{cat_lr}}"]
    note: "Illustrative data created for this practice case. Brightwater Mutual is fictional. Loss ratio is claims paid and reserved divided by premium."
    insight: |
      All the growth came through agents, and the agent loss ratio rose
      {{lr_rise}}. Weather was normal in both years, so this is about which
      customers were written, not bad luck.
  - id: exhibit-2
    title: "Agent business by agent tier"
    kind: table
    ask: "We grouped agents by the loss ratio of the business they write. What do you see?"
    columns: ["Agent tier", "Premium FY2023", "Premium FY2025", "Loss ratio FY2025", "Commission rate"]
    rows:
      - ["Tier A (loss ratio below 70%)", "{{a_23}}", "{{a_25}}", "{{lr_a}}", "{{comm_old}}"]
      - ["Tier B (70–90%)", "{{b_23}}", "{{b_25}}", "{{lr_b}}", "{{comm_old}}"]
      - ["Tier C (above 90%)", "{{c_23}}", "{{c_25}}", "{{lr_c}}", "{{comm_old}}"]
    note: "Illustrative data created for this practice case. Commission is paid on premium written, whatever the claims that follow. Independent agents also sell for competing insurers and choose where to place each customer."
    insight: |
      Tier A, the largest group, writes business as profitable as the direct
      channel but did not grow. All the growth came from Tiers B and C, and
      Tier C pays out more in claims than it collects in premium.
  - id: exhibit-3
    title: "Two proposals for agent pay"
    kind: table
    ask: "The CFO and the head of distribution each have a proposal. Which would you choose?"
    columns: ["", "CFO: flat cut", "Head of distribution: profit-based"]
    rows:
      - ["Commission", "{{comm_flat}} of premium for every agent", "{{base_new}} base + bonus of {{profit_share}} of each point the agent's loss ratio is below {{target_lr}}"]
      - ["Measured on", "Premium written", "Agent's loss ratio over the last three years"]
      - ["Agent survey", "Tier A agents would move {{move_share}} of their Brightwater book to other insurers", "No change expected for Tier A agents"]
    note: "Illustrative data created for this practice case. Assume Tier B and C agents keep their books under either proposal, and loss ratios by tier stay at FY2025 levels."
    insight: |
      The flat cut saves the most on paper but cuts pay most where it hurts:
      the best agents. A profit-based plan pays the same for good business
      and much less for bad business.
---

## Prompt

Our client, Brightwater Mutual, insures homes and cars across twelve US states. It sells policies directly online and by phone, and through about a thousand independent agents who also sell for competing insurers.

Over the past two years Brightwater has grown premiums by 20%, its best growth in a decade. Yet underwriting profit (premiums minus claims and expenses) has halved. The CEO has asked us: **why is profit falling while the business grows, and what should Brightwater change?**

## Clarifying information

- Q: What is the objective?
  A: Restore underwriting profit toward the FY2023 level of {{uw_23}} within two years, without shrinking the agent channel more than necessary. Agents are Brightwater's main route to new customers.
- Q: Have prices changed?
  A: Rates rose in line with claims inflation in both channels. The CEO believes pricing is adequate for an average customer.
- Q: Was there unusual weather?
  A: No. Weather-catastrophe losses were {{cat_lr}} of premium in both years, in line with the 10-year average.
- Q: How are agents paid?
  A: A flat {{comm_old}} commission on all premium they write, new or renewed, with no link to the claims that follow.
- Q: Does Brightwater underwrite each policy itself?
  A: It sets rules, but agents enter the customer's details and the system approves most policies automatically.

## Structure

> **Ask:** How would you structure the problem?

Underwriting profit is premium times what is left after claims and expenses, so the tree runs through the ratios, by channel:

- **Underwriting profit = Premium × (1 − Loss ratio − Expense ratio)**
  - **Premium:** by channel (direct, agents), by product (home, auto), new versus renewal
  - **Loss ratio:** claims frequency and severity, customer quality, weather, pricing adequacy
  - **Expense ratio:** commission, advertising, operations
- **Incentives:** what each channel is paid for, and how that shapes which customers it brings in

Hypothesis: *"Growth that comes with a rising loss ratio usually means we are winning customers other insurers turned down. I'd look at where the growth came from and how the sellers are paid."*

## Math walkthrough

> **Ask:** First, using Exhibit 1, explain the change in underwriting profit. Then, using Exhibit 2, where exactly is the problem? Finally, compare the two proposals in Exhibit 3.

**1. Profit by channel (Exhibit 1).**
Agent expense ratio: 15% + 10% = {{exp_agent}}.

| Channel | FY2023 | FY2025 |
|---|---|---|
| Direct: $500M × (1 − 65% − 25%) | {{direct_uw_23}} | {{direct_uw_25}} |
| Agents: premium × (1 − loss ratio − 25%) | {{agent_uw_23}} | {{agent_uw_25}} |
| **Total** | **{{uw_23}}** | **{{uw_25}}** |

Premiums grew {{prem_growth}} but profit fell **{{uw_drop}}**. Agent business now runs at a combined ratio of {{combined_agent_25}}: it earns nothing.

**2. Bridge.**

| Driver | Calculation | Impact |
|---|---|---|
| More agent premium | ($700M − $500M) × 10% | +{{volume_effect}} |
| Higher agent loss ratio | $700M × (65% − 75%) | {{lr_effect}} |
| Direct channel | no change | {{direct_effect}} |
| **Total** | | **{{bridge_total}}** |

**3. By agent tier (Exhibit 2).**
The tiers reconcile: (400 × 65% + 200 × 80% + 100 × 105%) ÷ 700 = {{lr_tier_check}}.
Underwriting profit by tier: Tier A $400M × (1 − 65% − 25%) = **{{uw_a}}**; Tier B **{{uw_b}}**; Tier C **{{uw_c}}**.
Tier B grew {{growth_b}} and Tier C {{growth_c}}; together they account for {{bc_growth_share}} of agent growth. Brightwater paid Tier C agents {{comm_paid_c}} in commission to write a book that lost {{uw_c_loss}}.

*This changes the answer from Exhibit 1.* The obvious reading was "agent business is unprofitable, shift to direct." In fact Tier A, more than half the agent book, is as profitable as direct. The problem is a commission that pays for volume, not for profit.

**4. CFO's flat cut (Exhibit 3).**
On paper: $700M × (15% − 12%) = {{flat_saving_paper}} saved, lifting profit to {{uw_flat_paper}}.
But Tier A agents move a quarter of their book: $300M × (1 − 65% − 10% − 12%) = **{{flat_a}}**. Tier B becomes {{flat_b}} and Tier C {{flat_c}}. Realistic profit: **{{uw_flat}}**.

**5. Profit-based commission.**
Tier A: 10% + 50% × (75% − 65%) = **{{comm_a}}**, unchanged. Tiers B and C get the base **{{comm_b}}**.
Profit: Tier A {{new_a}}, Tier B {{new_b}}, Tier C {{new_c}}. Total **{{uw_new}}**, which beats the realistic flat cut by {{redesign_vs_flat}}.
On base commission an agent's business breaks even at an {{breakeven_lr_new}} loss ratio, so Tier B now breaks even and Tier C still loses money. If Brightwater re-underwrites Tier C policies at renewal (or ends those agents' appointments), and we assume this brings Tier C to break-even (zero underwriting profit), profit reaches **{{uw_exit_c}}**. That is still {{gap_to_23}} short of the FY2023 level of {{uw_23}}.

## Synthesis

> **Ask:** What should Brightwater's CEO do?

**Profit halved to {{uw_25}} because Brightwater pays agents for volume, and its fastest-growing agents wrote business with an {{lr_b}}–{{lr_c}} loss ratio. Brightwater should replace the flat {{comm_old}} commission with a {{base_new}} base plus a loss-ratio bonus, which keeps its best agents whole, and re-underwrite Tier C business. Together these lift underwriting profit to about {{uw_exit_c}}, about {{gap_to_23}} short of the FY2023 level of {{uw_23}}; closing the rest needs pricing or underwriting fixes in Tier B.**

| Option | Underwriting profit |
|---|---|
| Today | {{uw_25}} |
| CFO flat cut (on paper) | {{uw_flat_paper}} |
| CFO flat cut (after Tier A agents move business) | {{uw_flat}} |
| Profit-based commission | {{uw_new}} |
| Profit-based commission + Tier C re-underwritten to break-even | **{{uw_exit_c}}** |

1. **The problem is incentives, not the channel:** Tier A agents earn {{uw_a}} for Brightwater, as profitably as direct.
2. **Cutting everyone's pay backfires:** it hits the agents Brightwater most wants to keep and still rewards volume.
3. **Pay for profit, not premium:** good agents keep {{comm_a}}, and agents writing at a loss ratio above {{target_lr}} lose the bonus.

**Risks and next steps:** loss ratios for a single agent are noisy, so measure over three years and set a minimum book size for the bonus; Tier B and C agents may move business to competitors, which is mostly fine for Tier C but should be watched for Tier B; tighten underwriting rules in the auto-approval system now, since commission changes take a renewal cycle to work; review whether prices are adequate for the customer types Tiers B and C wrote, since Tier B pricing or underwriting fixes are what close the last {{gap_to_23}} to the FY2023 level.

## Common mistakes

- Celebrating the {{prem_growth}} premium growth, or treating the profit fall as bad weather without checking the catastrophe losses.
- Stopping at Exhibit 1 and recommending a shift from agents to direct, which would lose the profitable Tier A book.
- Taking the CFO's {{flat_saving_paper}} saving at face value without asking how agents respond.
- Proposing a profit-based plan that cuts Tier A's pay. The redesign should be neutral or better for the best agents.

## What top candidates do differently

- Use the loss ratio as the central metric and build the bridge so volume and loss-ratio effects are separate.
- Change their answer when Exhibit 2 arrives and say why.
- Treat agents as customers of Brightwater with a choice of insurer, and test every proposal for how they will react.
- Compute the breakeven loss ratio under the new commission, which shows at a glance which agents still lose money.

## Creative question

Apart from changing commissions, how could Brightwater stop agents from placing unprofitable customers with it?

## Model answer

Organize ideas around **what the agent can do, what the agent sees, and what the agent earns**:

- **What the agent can do:** tighter auto-approval rules (credit-based scores, prior claims, roof age for homes); manual review above a risk score; limits on new business in high-risk areas.
- **What the agent sees:** monthly scorecards showing each agent's loss ratio against peers; early warnings when an agent's new business looks riskier than their renewals.
- **What the agent earns:** a lower commission on new business than on renewals for the first year; clawback of commission on policies canceled for non-payment; preferred-agent status with faster service for Tier A.

A top candidate prioritizes: "Scorecards plus the new commission work together. Agents usually don't know their own loss ratio; once they see it and it affects their pay, most will change where they place their riskier customers."
