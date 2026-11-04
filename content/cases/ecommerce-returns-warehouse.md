---
id: ecommerce-returns-warehouse
title: "Return to Sender: An E-Commerce Returns Warehouse"
client: "Thimbleton Apparel (fictional), an online fashion retailer"
summary: "After the holidays, 120,000 returned items are piling up in a returns center. Find the bottleneck, work out how long it takes to clear the pile, and pick the cheapest fix that works."
industry: consumer-retail
sub_industry: "E-commerce / reverse logistics"
type: operations
difficulty: beginner
format: candidate-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  inflow:             { value: 10000,  unit: "items/day", label: "Returned items arriving per day" }
  backlog:            { value: 120000, unit: "items", label: "Returned items waiting to be processed" }
  receive_cap:        { value: 15000,  unit: "items/day", label: "Receiving and unpacking capacity" }
  inspectors:         { value: 40,     unit: "inspectors", label: "Inspectors on staff" }
  shift_hours:        { value: 8,      unit: "hours", label: "Productive hours per inspector per day" }
  inspect_rate:       { value: 25,     unit: "items/hour", label: "Items inspected per inspector per hour" }
  repack_cap:         { value: 13000,  unit: "items/day", label: "Repackaging capacity" }
  putaway_cap:        { value: 11000,  unit: "items/day", label: "Put-away (back onto shelves) capacity" }
  temp_inspectors:    { value: 20,     unit: "inspectors", label: "Temporary inspectors available from an agency" }
  temp_wage:          { value: 25,     unit: "$/hour", label: "Agency cost per temporary inspector per hour" }
  putaway_new:        { value: 13000,  unit: "items/day", label: "Put-away capacity with an evening shift" }
  putaway_shift_cost: { value: 1500,   unit: "$/day", label: "Cost of the evening put-away shift" }
  item_value:         { value: 40,     unit: "$/item", label: "Average resale value of a returned item" }
  markdown_rate:      { value: 0.10,   unit: "%", label: "Value a fashion item loses per month while it waits" }

calculations:
  # --- Find the bottleneck ---
  - { id: insp_cap, label: "Inspection capacity today", formula: "inspectors * shift_hours * inspect_rate", expected: 8000, unit: "items/day" }
  - { id: backlog_growth, label: "Daily growth of the backlog", formula: "inflow - insp_cap", expected: 2000, unit: "items/day" }
  - { id: wait_days, label: "Days a newly returned item waits behind the backlog", formula: "backlog / insp_cap", expected: 15, unit: "days" }
  - { id: backlog_value, label: "Resale value stuck in the backlog", formula: "backlog * item_value / 1e6", expected: 4.8, unit: "$M", decimals: 1 }
  - { id: markdown_month, label: "Value lost to markdowns per month", formula: "backlog * item_value * markdown_rate / 1000", expected: 480, unit: "$K" }
  # --- Option A: add temporary inspectors ---
  - { id: insp_cap_new, label: "Inspection capacity with temporary inspectors", formula: "(inspectors + temp_inspectors) * shift_hours * inspect_rate", expected: 12000, unit: "items/day" }
  - { id: system_a, label: "Throughput with option A (slowest step)", formula: "min(receive_cap, insp_cap_new, repack_cap, putaway_cap)", expected: 11000, unit: "items/day" }
  - { id: burn_a, label: "Backlog cleared per day, option A", formula: "system_a - inflow", expected: 1000, unit: "items/day" }
  - { id: days_a, label: "Days to clear the backlog, option A", formula: "backlog / burn_a", expected: 120, unit: "days" }
  # --- Option B: temporary inspectors + evening put-away shift ---
  - { id: system_b, label: "Throughput with option B (slowest step)", formula: "min(receive_cap, insp_cap_new, repack_cap, putaway_new)", expected: 12000, unit: "items/day" }
  - { id: burn_b, label: "Backlog cleared per day, option B", formula: "system_b - inflow", expected: 2000, unit: "items/day" }
  - { id: days_b, label: "Days to clear the backlog, option B", formula: "backlog / burn_b", expected: 60, unit: "days" }
  # --- Cost ---
  - { id: temp_cost_day, label: "Temporary inspector cost per day", formula: "temp_inspectors * shift_hours * temp_wage", expected: 4000, unit: "$/day" }
  - { id: cost_day_b, label: "Total extra cost per day, option B", formula: "temp_cost_day + putaway_shift_cost", expected: 5500, unit: "$/day" }
  - { id: cost_a, label: "Total cost of option A", formula: "temp_cost_day * days_a / 1000", expected: 480, unit: "$K" }
  - { id: cost_b, label: "Total cost of option B", formula: "cost_day_b * days_b / 1000", expected: 330, unit: "$K" }
  # --- After the backlog clears ---
  - { id: per_inspector, label: "Items inspected per inspector per day", formula: "shift_hours * inspect_rate", expected: 200, unit: "items/day" }
  - { id: keep_temps, label: "Temporary inspectors still needed to keep up with inflow", formula: "backlog_growth / (shift_hours * inspect_rate)", expected: 10, unit: "inspectors" }
  - { id: keep_cost_day, label: "Daily cost of the inspectors kept on", formula: "keep_temps * shift_hours * temp_wage", expected: 2000, unit: "$/day" }

answer:
  calc: days_b
  headline: "Inspection is the bottleneck; adding temporary inspectors *and* an evening put-away shift clears the backlog in {{days_b}} for about {{cost_b}}."

exhibits:
  - id: exhibit-1
    title: "Daily capacity of each step in the returns center (items per day)"
    kind: bar
    unit: "items/day"
    decimals: 0
    ask: "Here is the capacity of each step. Why is the backlog growing?"
    data:
      - { label: "1. Receive and unpack", value: receive_cap }
      - { label: "2. Inspect and grade", value: insp_cap }
      - { label: "3. Repackage", value: repack_cap }
      - { label: "4. Put away", value: putaway_cap }
    reference: { value: inflow, label: "Returns arriving per day" }
    note: "Illustrative data created for this practice case. Thimbleton Apparel is fictional."
    insight: |
      Inspection is the only step below the daily inflow, so it is the
      bottleneck. Put-away is the next-slowest step — fix inspection and it
      becomes the new limit.
  - id: exhibit-2
    title: "Options proposed by the returns-center manager"
    kind: table
    ask: "The manager has two options. How long would each take to clear the backlog, and what would it cost?"
    columns: ["Option", "What changes", "Extra cost"]
    rows:
      - ["A. Temporary inspectors", "Add {{temp_inspectors}} for {{shift_hours}} a day each", "{{temp_wage}} per inspector"]
      - ["B. Temporary inspectors + evening put-away shift", "As option A, plus put-away capacity rises to {{putaway_new}}", "As option A, plus {{putaway_shift_cost}} for the extra shift"]
    note: "Illustrative data created for this practice case."
    insight: |
      Compare the options on total cost to clear the backlog, not cost per day:
      the faster option pays for its extra shift by finishing sooner.
---

## Prompt

Our client, Thimbleton Apparel, sells clothing online. Customers can return items free of charge, and returns go to a single returns center, where each item is unpacked, inspected, repackaged and put back on the shelves to be sold again.

Since the holidays, returns have been arriving faster than the center can handle them. **{{backlog}}** are now waiting to be processed, and the pile is getting bigger every day. While items wait, they can't be sold — and fashion items lose value quickly.

The head of operations asks us: **why is the backlog growing, and what is the fastest, cheapest way to clear it?**

## Clarifying information

- Q: How many returns arrive each day?
  A: About **{{inflow}}**, and that rate will hold for the next few months.
- Q: What are the steps in the returns center?
  A: Four steps: receive and unpack, inspect and grade (decide if the item can be resold as new, sold at a discount, or thrown away), repackage, and put away on the shelves.
- Q: How does inspection work?
  A: There are **{{inspectors}}**, each working {{shift_hours}} of productive time a day and inspecting about **{{inspect_rate}}** each.
- Q: Why does the backlog matter?
  A: An average item resells for {{item_value}}, and a fashion item loses about **{{markdown_rate}}** of its value for every month it waits, because the season moves on.
- Q: Can we hire permanent staff?
  A: Not quickly — the client wants a fix for the next few months while it reviews its returns process.

## Structure

> **Ask:** The candidate should set out how they will find the problem before jumping to solutions.

A simple **flow** structure: follow an item through the center and compare each step's capacity with the daily inflow.

- **1. Where is the bottleneck?**
  - Capacity of each step: receive, inspect, repackage, put away
  - Compare with the items arriving per day
- **2. How big is the problem?**
  - How fast the backlog grows
  - How long items wait, and the value they lose
- **3. How do we clear it?**
  - Add capacity at the bottleneck (people, hours, faster methods)
  - Check what becomes the next bottleneck
  - Time to clear the backlog, and cost of each option
- **4. Recommendation and longer-term fixes**

A good hypothesis: *"The whole center can only go as fast as its slowest step, so I want to see capacity step by step."*

## Math walkthrough

> **Ask:** The candidate should find the bottleneck (Exhibit 1), then compare the two options (Exhibit 2) on time to clear the backlog and cost.

**1. The bottleneck.**
Inspection capacity = 40 inspectors × 8 hours × 25 items = **{{insp_cap}}**. Every other step handles more than the {{inflow}} arriving, so inspection is the bottleneck.
The backlog grows by 10,000 − 8,000 = **{{backlog_growth}}**.
A newly returned item waits about 120,000 ÷ 8,000 = **{{wait_days}}** before it is even inspected.

**2. What it costs to wait.**
The backlog holds 120,000 × $40 = **{{backlog_value}}** of resale value, losing about $4.8M × 10% = **{{markdown_month}}** a month.

**3. Option A: temporary inspectors.**
Inspection rises to 60 × 8 × 25 = **{{insp_cap_new}}**. But put-away now becomes the slowest step, so the center only processes **{{system_a}}**.
Backlog shrinks by 11,000 − 10,000 = {{burn_a}}, so clearing it takes 120,000 ÷ 1,000 = **{{days_a}}**.
Cost: 20 × 8 × $25 = {{temp_cost_day}}, or about **{{cost_a}}** in total.

**4. Option B: temporary inspectors + evening put-away shift.**
Now the slowest step is inspection again, at {{system_b}}.
Backlog shrinks by {{burn_b}}, so clearing it takes 120,000 ÷ 2,000 = **{{days_b}}**.
Cost: $4,000 + $1,500 = {{cost_day_b}}, or about **{{cost_b}}** in total.

Option B costs more per day but is cheaper overall, because it finishes in {{days_b}} instead of {{days_a}}.

**5. After the backlog clears.**
Returns still arrive at {{inflow}}, and the permanent team inspects only {{insp_cap}}. Each inspector handles 8 × 25 = **{{per_inspector}}**, so the center needs to keep 2,000 ÷ 200 = **{{keep_temps}}** from the agency for as long as returns stay this high, at about {{keep_cost_day}}. Put-away (11,000 items/day) keeps up on its own, so the evening shift can stop.

## Synthesis

> **Ask:** The candidate should close with a clear recommendation for the head of operations.

**Thimbleton should bring in {{temp_inspectors}} from an agency *and* add an evening put-away shift: that clears the backlog of {{backlog}} in about {{days_b}} for roughly {{cost_b}} — faster and cheaper than adding inspectors alone ({{days_a}}, {{cost_a}}).**

1. **Inspection is the bottleneck:** it handles {{insp_cap}} against {{inflow}} arriving, so the backlog grows by {{backlog_growth}}.
2. **Fixing one step moves the bottleneck:** with extra inspectors, put-away caps the center at {{system_a}}, so both steps need help.
3. **Waiting is expensive:** the backlog holds {{backlog_value}} of stock and loses about {{markdown_month}} of value a month — more than the whole option B plan costs.

**Next steps:** once the pile is gone, keep {{keep_temps}} from the agency ({{keep_cost_day}}) and end the evening shift, or the backlog starts growing again; start with the items that lose value fastest (seasonal fashion) to cut markdown losses; check that the agency can supply trained inspectors quickly; then fix the root cause — why so many items come back, and whether simple returns can skip full inspection.

## Common mistakes

- Adding up or averaging the capacity of the steps instead of taking the slowest one.
- Forgetting that the new returns keep arriving: the backlog shrinks only by capacity *minus* inflow, not by full capacity.
- Stopping after fixing inspection and missing that put-away becomes the next bottleneck.
- Comparing options on cost per day instead of total cost to clear the backlog.

## What top candidates do differently

- Draw the four steps as a simple flow and mark the slowest one before calculating.
- Check the "next bottleneck" without being asked.
- Put a dollar value on waiting (lost resale value) so the cost of the fix has something to be compared with.
- Separate the short-term fix (clear the backlog) from the long-term fix (fewer returns, faster processing).

## Creative question

Beyond adding people, how could Thimbleton reduce the work its returns center has to do in the first place?

## Model answer

Group ideas by **fewer returns, simpler returns, and faster processing**:

- **Fewer returns:** better size guides and fit recommendations, more product photos and customer reviews about fit, and flagging items with unusually high return rates to the buying team.
- **Simpler returns:** a fast lane for items returned unopened with tags on, which need only a quick scan instead of full inspection; "keep it" refunds for very cheap items where processing costs more than the item is worth.
- **Faster processing:** pre-printed barcodes on return labels so each item is identified with a single scan; send damaged items straight to discount resellers instead of inspecting them in detail.

A top candidate prioritizes: "The fast lane for unopened items is the quickest win — it takes load off the bottleneck without hiring anyone."
