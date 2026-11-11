---
id: steel-fabricator-cost-cut
title: "Cutting Steel Costs Without Cutting Corners: A Fabricator's Savings Plan"
client: "Tolliver Steel Works (fictional), a US fabricator of structural steel for commercial buildings"
summary: "A structural-steel fabricator must cut costs by a target run-rate. Size four levers (scrap, overtime, steel buying and a yard lease), net out one-time costs, and respect quality and safety limits."
industry: industrials
sub_industry: "Metal fabrication"
type: cost-cutting
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  revenue:        { value: 240,  unit: "$M",  label: "Annual revenue" }
  steel_spend:    { value: 90,   unit: "$M",  label: "Steel purchases per year" }
  labor_cost:     { value: 60,   unit: "$M",  label: "Direct labor per year, including overtime" }
  facility_cost:  { value: 18,   unit: "$M",  label: "Facilities, including both leases" }
  other_cost:     { value: 48,   unit: "$M",  label: "Equipment, freight, inspection, overhead and other" }
  target:         { value: 7.5,  unit: "$M",  label: "Board target: annual cost reduction within 18 months" }
  yield_now:      { value: 0.88, unit: "%",   label: "Steel yield today (share of purchased steel that ends up in product)" }
  yield_target:   { value: 0.91, unit: "%",   label: "Achievable yield with nesting software and cutting changes" }
  yield_onetime:  { value: 3.0,  unit: "$M",  label: "One-time cost of the yield program (software, saw upgrades, training)" }
  ot_hours:       { value: 150,  unit: "thousand hours", label: "Overtime hours per year" }
  base_wage:      { value: 32,   unit: "$/hour", label: "Base wage per hour, fully loaded" }
  ot_premium:     { value: 0.5,  unit: "%",   label: "Overtime premium over base wage" }
  ot_cut_share:   { value: 0.6,  unit: "%",   label: "Share of overtime hours that new hires could replace" }
  second_share:   { value: 0.4,  unit: "%",   label: "Share of steel volume that a second mill can supply to structural specification" }
  second_disc:    { value: 0.05, unit: "%",   label: "Price discount from the second mill" }
  test_cost:      { value: 0.3,  unit: "$M",  label: "Extra material testing per year for second-mill steel" }
  qual_onetime:   { value: 0.4,  unit: "$M",  label: "One-time cost to qualify the second mill" }
  yard_lease:     { value: 2.4,  unit: "$M",  label: "Annual lease on the second yard" }
  handling:       { value: 0.6,  unit: "$M",  label: "Extra handling cost per year if work moves into the main plant" }
  lease_exit:     { value: 3.0,  unit: "$M",  label: "One-time cost to exit the yard lease early and move equipment" }
  main_util:      { value: 0.70, unit: "%",   label: "Main plant utilization today" }
  yard_pts:       { value: 0.14, unit: "pts", label: "Yard workload, as a share of main-plant capacity" }
  max_util:       { value: 0.85, unit: "%",   label: "Highest safe utilization of the main plant (crane and floor traffic)" }
  crane_sunk:     { value: 1.5,  unit: "$M",  label: "Spent last year to refurbish a crane at the yard" }

calculations:
  # --- Cost base ---
  - { id: total_cost, label: "Total annual cost", formula: "steel_spend + labor_cost + facility_cost + other_cost", expected: 216, unit: "$M" }
  - { id: op_profit, label: "Operating profit", formula: "revenue - total_cost", expected: 24, unit: "$M" }
  - { id: target_pct_cost, label: "Target as a share of the cost base", formula: "target / total_cost", expected: 0.0347, unit: "%", decimals: 1 }
  - { id: target_pct_profit, label: "Target as a share of operating profit", formula: "target / op_profit", expected: 0.3125, unit: "%", decimals: 0 }
  # --- Yield ---
  - { id: steel_in_product, label: "Steel that ends up in product", formula: "steel_spend * yield_now", expected: 79.2, unit: "$M", decimals: 1 }
  - { id: steel_new, label: "Steel purchases needed at the new yield", formula: "steel_in_product / yield_target", expected: 87.033, unit: "$M", decimals: 1 }
  - { id: yield_save, label: "Annual saving from higher yield", formula: "steel_spend - steel_new", expected: 2.96703, unit: "$M", decimals: 1 }
  # --- Overtime ---
  - { id: ot_naive, label: "Overtime cost removed (full rate on cut hours)", formula: "ot_hours * ot_cut_share * base_wage * (1 + ot_premium) / 1000", expected: 4.32, unit: "$M", decimals: 2 }
  - { id: ot_replace, label: "Cost of the new hires working those hours at base wage", formula: "ot_hours * ot_cut_share * base_wage / 1000", expected: 2.88, unit: "$M", decimals: 2 }
  - { id: ot_save, label: "True saving from replacing overtime (premium only)", formula: "ot_naive - ot_replace", expected: 1.44, unit: "$M", decimals: 2 }
  # --- Procurement ---
  - { id: proc_gross, label: "Gross saving from the second mill", formula: "steel_spend * second_share * second_disc", expected: 1.8, unit: "$M" }
  - { id: proc_net, label: "Net saving after extra testing", formula: "proc_gross - test_cost", expected: 1.5, unit: "$M" }
  # --- Lease ---
  - { id: lease_net, label: "Net saving from closing the yard", formula: "yard_lease - handling", expected: 1.8, unit: "$M" }
  - { id: util_after, label: "Main plant utilization after absorbing the yard", formula: "main_util + yard_pts", expected: 0.84, unit: "%", decimals: 0 }
  - { id: headroom, label: "Headroom below the safe limit", formula: "max_util - util_after", expected: 0.01, unit: "pts", decimals: 0 }
  # --- Total ---
  - { id: naive_total, label: "Headline total if savings are counted gross", formula: "yield_save + ot_naive + proc_gross + yard_lease", expected: 11.48703, unit: "$M", decimals: 1 }
  - { id: total_run, label: "Net run-rate saving, all four levers", formula: "yield_save + ot_save + proc_net + lease_net", expected: 7.70703, unit: "$M", decimals: 1 }
  - { id: gap, label: "Margin above the target", formula: "total_run - target", expected: 0.20703, unit: "$M", decimals: 1 }
  - { id: onetime_total, label: "Total one-time cost", formula: "yield_onetime + qual_onetime + lease_exit", expected: 6.4, unit: "$M", decimals: 1 }
  - { id: payback, label: "Payback on one-time costs", formula: "onetime_total / total_run", expected: 0.8304, unit: "years", decimals: 1 }
  - { id: two_year, label: "Net saving over two years after one-time costs", formula: "total_run * 2 - onetime_total", expected: 9.01406, unit: "$M", decimals: 1 }
  - { id: no_lease, label: "Run-rate saving if the yard cannot close", formula: "total_run - lease_net", expected: 5.90703, unit: "$M", decimals: 1 }
  - { id: no_lease_gap, label: "Shortfall against target without the yard", formula: "target - no_lease", expected: 1.59297, unit: "$M", decimals: 1 }

answer:
  calc: total_run
  headline: "The four levers net {{total_run}} a year, just above the {{target}} target, for {{onetime_total}} of one-time cost. The headline of {{naive_total}} counts savings gross and overstates them."

exhibits:
  - id: exhibit-1
    title: "Tolliver's annual cost base"
    kind: table
    ask: "Here is where the money goes. How would you use it to find the cuts?"
    columns: ["Cost category", "Annual cost ($M)", "Notes"]
    rows:
      - ["Steel purchases", "{{steel_spend}}", "Yield today is {{yield_now}}"]
      - ["Direct labor", "{{labor_cost}}", "Includes {{ot_hours}} of overtime"]
      - ["Facilities", "{{facility_cost}}", "Includes the main plant and a second yard"]
      - ["Equipment, freight, inspection, overhead", "{{other_cost}}", "Weld inspection is required by code"]
      - ["**Total cost**", "**{{total_cost}}**", "Revenue {{revenue}}, operating profit {{op_profit}}"]
    note: "Illustrative data created for this practice case. Tolliver is fictional. Weld inspection and testing are required for structural work."
    insight: |
      Steel is the biggest line, so even small gains in yield or price matter.
      The {{target}} target is only {{target_pct_cost}} of cost, but it is
      {{target_pct_profit}} of today's operating profit, so it is a serious
      ask.
  - id: exhibit-2
    title: "Four savings ideas from the operations team"
    kind: table
    ask: "The team listed four ideas. Which would you pursue, and what would you check on each?"
    columns: ["Lever", "What changes", "Savings claimed ($M a year)", "One-time cost ($M)"]
    rows:
      - ["Scrap and yield", "Yield rises from {{yield_now}} to {{yield_target}}", "{{yield_save}}", "{{yield_onetime}}"]
      - ["Overtime", "Cut {{ot_cut_share}} of the {{ot_hours}} of overtime by hiring", "{{ot_naive}}", "None"]
      - ["Steel buying", "A second mill supplies {{second_share}} of volume at {{second_disc}} less", "{{proc_gross}}", "{{qual_onetime}}"]
      - ["Yard lease", "Close the yard and move work to the main plant", "{{yard_lease}}", "{{lease_exit}}"]
    note: "Illustrative data created for this practice case. Claimed savings are gross and do not net out hiring, testing or handling."
    insight: |
      Every claim is gross. Overtime is the worst: the hired workers still
      have to be paid, so only the premium is saved. The second mill needs
      extra testing, and the yard move adds handling cost.
  - id: exhibit-3
    title: "Main plant load if the yard closes"
    kind: table
    ask: "The yard's work would move into the main plant. Is there room?"
    columns: ["Measure", "Value"]
    rows:
      - ["Main plant utilization today", "{{main_util}}"]
      - ["Yard workload, as a share of main-plant capacity", "{{yard_pts}}"]
      - ["Utilization after the move", "{{util_after}}"]
      - ["Highest safe utilization (crane and floor traffic)", "{{max_util}}"]
      - ["Headroom", "{{headroom}}"]
    note: "Illustrative data created for this practice case. Above the safe limit, crane queues and forklift traffic raise accident risk and delay shipments."
    insight: |
      The move fits, but with only {{headroom}} of headroom. Any growth in
      orders would push the plant over the safe limit, so the lease saving is
      real but fragile.
---

## Prompt

Our client, Tolliver Steel Works, fabricates structural steel (beams, columns and trusses) for commercial buildings across the US Midwest. Revenue is about {{revenue}} a year. Steel prices have been flat but customers are pushing back on bids, and margins have narrowed.

The board wants a cost reduction of **{{target}} a year, fully in place within 18 months**. The CEO has asked us: **can Tolliver reach the target, how, and what will it cost to get there?**

## Clarifying information

- Q: What is the cost base?
  A: Exhibit 1 has it. Steel is the largest line, followed by direct labor.
- Q: Is the {{target}} a run-rate saving or a one-time amount?
  A: A **run-rate** saving, meaning the annual saving once all changes are in place. One-time costs to get there are separate but the board wants to see them.
- Q: What is the payback limit?
  A: Projects should repay their one-time costs within two years.
- Q: Are there any areas that must not be cut?
  A: Yes. Weld inspection, material testing and safety training are required by code and by Tolliver's customers. The plant must also stay under a safe utilization of **{{max_util}}**.
- Q: How much steel ends up in the finished product?
  A: Yield is **{{yield_now}}** today. The rest is cutoffs and offcuts, sold as scrap for very little. Better nesting software and saw upgrades could reach **{{yield_target}}**.
- Q: Why is there so much overtime?
  A: Tolliver has about **{{ot_hours}}** of overtime a year, mostly from peaks and rework. About {{ot_cut_share}} of those hours could be replaced by new hires.
- Q: Can Tolliver change steel suppliers?
  A: Only partly. A second mill can supply **{{second_share}}** of volume to the structural specification, at **{{second_disc}}** less. The rest is special grades that only today's mill supplies.
- Q: Did Tolliver invest in the second yard recently?
  A: Yes, it spent **{{crane_sunk}}** last year refurbishing a crane there. The yard manager says closing the yard wastes it.

## Structure

> **Ask:** How would you find and test the savings?

Start from the cost base, then test each lever on three questions: **how much, at what one-time cost, and what does it put at risk?**

- **1. Cost base:** steel, labor, facilities, other. Where is the money, and which lines can move?
- **2. Levers**
  - **Material:** yield (scrap), purchase price, second sourcing
  - **Labor:** overtime, productivity, rework
  - **Footprint:** the second yard lease, plant utilization
  - **Other:** freight, equipment, overhead
- **3. For each lever:** net annual saving, one-time cost, time to implement, interactions with other levers
- **4. Constraints:** code-required inspection, plant safety limit, payback limit, customer specifications
- **5. Risks:** quality escapes, delivery delays, employee morale

A good hypothesis: *"Steel is the biggest line, so yield and sourcing are the heaviest levers. Overtime and the lease are likely smaller, and the headline numbers probably overstate the saving because they ignore what replaces what is cut."*

## Math walkthrough

> **Ask:** The candidate should net down each lever, check the plant limit, and compare the total with the target.

**1. Cost base.**
Total cost is **{{total_cost}}**, so operating profit is **{{op_profit}}**. The {{target}} target is {{target_pct_cost}} of cost but **{{target_pct_profit}}** of profit.

**2. Yield.**
Steel in product: $90M × 88% = {{steel_in_product}}. At 91% yield Tolliver would buy $79.2M ÷ 0.91 = **{{steel_new}}**.
Saving: $90M − {{steel_new}} = **{{yield_save}}** a year, for a one-time cost of {{yield_onetime}}.

**3. Overtime.**
Cutting 90,000 hours at the base wage plus the 50% premium looks like **{{ot_naive}}**. But the new hires also work those hours, at $32, which costs {{ot_replace}}.
True saving: {{ot_naive}} − {{ot_replace}} = **{{ot_save}}**, which is only the premium.

**4. Steel buying.**
$90M × 40% × 5% = **{{proc_gross}}**. Less {{test_cost}} of extra testing: **{{proc_net}}**. One-time cost to qualify the mill: {{qual_onetime}}.

**5. Yard lease.**
Lease {{yard_lease}} less {{handling}} extra handling = **{{lease_net}}**. One-time cost {{lease_exit}}.
Plant load: 70% + 14 pts = **{{util_after}}**, below the {{max_util}} limit by only {{headroom}}.

**6. Total.**

| Lever | Claimed | Net run-rate | One-time cost |
|---|---|---|---|
| Yield | {{yield_save}} | {{yield_save}} | {{yield_onetime}} |
| Overtime | {{ot_naive}} | {{ot_save}} | None |
| Steel buying | {{proc_gross}} | {{proc_net}} | {{qual_onetime}} |
| Yard lease | {{yard_lease}} | {{lease_net}} | {{lease_exit}} |

Counting everything gross gives {{naive_total}}. The net run-rate is **{{total_run}}**, which is only **{{gap}}** above the target.
One-time costs are **{{onetime_total}}**, so payback is about {{payback}}, well inside the two-year limit. Over two years the net saving is {{two_year}}.

**7. The sunk crane.**
The {{crane_sunk}} spent on the yard crane is gone either way. The only relevant question is whether the crane can be reused in the main plant or sold.

## Synthesis

> **Ask:** The candidate should give the CEO a clear recommendation.

**Tolliver can reach the target, but only just. All four levers together save {{total_run}} a year net, {{gap}} above the {{target}} goal, for {{onetime_total}} of one-time cost and a payback under a year.**

1. **Yield and steel buying carry the plan:** together they save about {{yield_save}} plus {{proc_net}}, more than half the total.
2. **Overtime and the lease are smaller than they look:** overtime saves {{ot_save}}, not {{ot_naive}}, and the lease saves {{lease_net}} after handling.
3. **The plan is thin:** if the yard cannot close, the saving falls to {{no_lease}}, short by {{no_lease_gap}}.

**Risks and next steps:** start with yield and the second-mill qualification, since they have the biggest savings and no safety effect; test a few beams from the second mill against specification before any contract; do not close the yard until orders are visible for a year, because the main plant would have only {{headroom}} of headroom to the safe limit; protect weld inspection and safety training from any cut; and look for a second wave (freight, equipment maintenance, rework) to build a cushion beyond the target.

## Common mistakes

- Counting overtime at the full rate ({{ot_naive}}) instead of only the premium ({{ot_save}}).
- Forgetting the extra testing and handling that come with the second mill and the yard move.
- Ignoring the one-time costs, or treating them as part of the run-rate saving.
- Letting the {{crane_sunk}} crane refurbishment influence the lease decision.
- Cutting inspection or safety spending to reach the target.
- Closing the yard without checking the safe utilization limit of {{max_util}}.

## What top candidates do differently

- Turn every claimed saving into a net saving before adding anything up.
- Ask early about lines that cannot be cut, and keep them off the list.
- Compare the target to profit as well as cost: {{target_pct_profit}} of profit shows how serious the ask is.
- Stress-test the answer: what happens if the lease saving does not arrive?

## Creative question

If Tolliver needs savings beyond the {{target}} target, where else could it look?

## Model answer

Group ideas by **where the cost sits**:

- **Material:** sell scrap to better buyers, standardize beam lengths with customers to reduce offcuts, and buy steel in bigger lots.
- **Labor:** reduce rework through better first-time weld quality, cross-train workers to flex between shifts, and plan production so that peaks are smoother.
- **Equipment and energy:** preventive maintenance to cut breakdowns, and off-peak scheduling for the most power-hungry machines.
- **Freight and logistics:** fuller truckloads and better delivery sequencing for each construction site.
- **Commercial:** price the bids that need custom detailing and rush orders higher, and decline the least profitable work.

A top candidate prioritizes: "Rework and bid pricing may be larger than any cost lever, because they affect both overtime and steel waste. I would size them next and add them as a cushion, since the current plan is only {{gap}} above target."
