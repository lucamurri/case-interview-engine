---
id: rail-yard-dwell-time
title: "Waiting on the Track: Cutting Dwell Time at a Freight Classification Yard"
client: "Prairie Central Railroad (fictional), a regional US freight railroad"
summary: "Freight cars spend about 30 hours in the railroad's biggest sorting yard against a 24-hour target. Find the real bottleneck, price the fixes, and avoid the obvious but wrong answer."
industry: industrials
sub_industry: "Rail freight"
type: operations
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  cars_day:      { value: 1800, unit: "cars",  label: "Cars processed per day at Harlan Yard" }
  target:        { value: 24,   unit: "hours", label: "Target dwell time" }
  h_insp:        { value: 5.0,  unit: "hours", label: "Average time in inbound inspection (waiting plus inspecting)" }
  h_hump:        { value: 4.0,  unit: "hours", label: "Average time waiting for and passing over the hump" }
  h_build:       { value: 8.0,  unit: "hours", label: "Average time on a classification track while the outbound train is built" }
  h_crew:        { value: 11.0, unit: "hours", label: "Average wait for a crew once the train is built" }
  h_dep:         { value: 2.0,  unit: "hours", label: "Average time from crew arrival to departure" }
  insp_cap:      { value: 2000, unit: "cars",  label: "Inspection capacity per day" }
  hump_rate:     { value: 110,  unit: "cars",  label: "Hump rate per operating hour" }
  hump_hours:    { value: 20,   unit: "hours", label: "Hump operating hours per day (rest is engine servicing and maintenance)" }
  car_cost:      { value: 2.5,  unit: "$/car-hour", decimals: 2, label: "Cost of a car sitting idle (lease, lost use, customer penalties)" }
  extra_crews:   { value: 14,   unit: "crews", label: "Extra crews needed for a standby crew pool" }
  crew_cost:     { value: 0.18, unit: "$M",    decimals: 2, label: "Cost per crew per year" }
  crew_cut:      { value: 0.60, unit: "%",     label: "Share of crew wait the standby pool removes" }
  portal_cost:   { value: 9,    unit: "$M",    label: "Cost of an automated inspection portal" }
  portal_save:   { value: 2.0,  unit: "hours", label: "Hours the portal takes off inspection time" }
  hump_spend:    { value: 20,   unit: "$M",    label: "Spent two years ago on a new hump control system" }
  hurdle:        { value: 3,    unit: "years", label: "Maximum payback for a yard investment" }

calculations:
  - { id: dwell, label: "Current dwell time", formula: "h_insp + h_hump + h_build + h_crew + h_dep", expected: 30, unit: "hours" }
  - { id: gap, label: "Gap to the target", formula: "dwell - target", expected: 6, unit: "hours" }
  - { id: crew_share, label: "Crew wait as a share of dwell", formula: "h_crew / dwell", expected: 0.3667, unit: "%", decimals: 0 }
  - { id: insp_util, label: "Inspection utilization", formula: "cars_day / insp_cap", expected: 0.90, unit: "%" }
  - { id: hump_cap_day, label: "Hump capacity per day", formula: "hump_rate * hump_hours", expected: 2200, unit: "cars" }
  - { id: hump_util, label: "Hump utilization", formula: "cars_day / hump_cap_day", expected: 0.8182, unit: "%", decimals: 0 }
  - { id: crew_save, label: "Hours saved by the standby crew pool", formula: "h_crew * crew_cut", expected: 6.6, unit: "hours", decimals: 1 }
  - { id: new_dwell, label: "Dwell time with the standby crew pool", formula: "dwell - crew_save", expected: 23.4, unit: "hours", decimals: 1 }
  - { id: cars_freed, label: "Cars no longer sitting in the yard at any time", formula: "cars_day * crew_save / 24", expected: 495, unit: "cars" }
  - { id: crew_benefit, label: "Annual benefit of the crew pool", formula: "cars_day * 365 * crew_save * car_cost / 1000000", expected: 10.8405, unit: "$M", decimals: 1 }
  - { id: crew_total_cost, label: "Annual cost of the crew pool", formula: "extra_crews * crew_cost", expected: 2.52, unit: "$M", decimals: 1 }
  - { id: crew_net, label: "Net annual benefit of the crew pool", formula: "crew_benefit - crew_total_cost", expected: 8.3205, unit: "$M", decimals: 1 }
  - { id: portal_benefit, label: "Annual benefit of the inspection portal", formula: "cars_day * 365 * portal_save * car_cost / 1000000", expected: 3.285, unit: "$M", decimals: 1 }
  - { id: portal_payback, label: "Payback on the inspection portal", formula: "portal_cost / portal_benefit", expected: 2.7397, unit: "years", decimals: 1 }
  - { id: both_dwell, label: "Dwell time with both fixes", formula: "dwell - crew_save - portal_save", expected: 21.4, unit: "hours", decimals: 1 }
  - { id: portal_alone, label: "Dwell time with the portal alone", formula: "dwell - portal_save", expected: 28, unit: "hours" }

answer:
  calc: crew_net
  headline: "The bottleneck is waiting for crews ({{h_crew}} of {{dwell}}). A standby crew pool brings dwell to {{new_dwell}} and nets {{crew_net}} a year; the busy-looking inspection and hump steps are not the problem."

exhibits:
  - id: exhibit-1
    title: "Where a car spends its time at Harlan Yard (average hours per stage)"
    kind: bar
    unit: "hours"
    decimals: 1
    ask: "Here is the time a typical car spends in each stage of the yard. What do you notice?"
    data:
      - { label: "Inbound inspection", value: h_insp }
      - { label: "Hump", value: h_hump }
      - { label: "Train build on classification track", value: h_build }
      - { label: "Waiting for a crew", value: h_crew }
      - { label: "Departure", value: h_dep }
    reference: { value: target, label: "Target dwell for the whole yard" }
    note: "Illustrative data created for this practice case. Prairie Central is fictional."
    insight: |
      Total dwell is {{dwell}}, {{gap}} above target. Waiting for a crew
      is the largest single block at {{h_crew}} ({{crew_share}} of the
      total), and it adds no value to the car.
  - id: exhibit-2
    title: "Capacity versus load at the yard's processing steps"
    kind: table
    ask: "The yard manager says the inspection step and the hump are the problem, because they are busy. Here is the data."
    columns: ["Step", "Capacity per day", "Load per day", "Utilization"]
    rows:
      - ["Inbound inspection", "{{insp_cap}}", "{{cars_day}}", "{{insp_util}}"]
      - ["Hump", "{{hump_cap_day}}", "{{cars_day}}", "{{hump_util}}"]
    note: "Illustrative data created for this practice case. Hump capacity is {{hump_rate}} an hour over {{hump_hours}} of operation."
    insight: |
      Both steps are busy but have spare capacity, and together they account
      for only {{h_insp}} plus {{h_hump}}. Queues build only at the
      steps that are short of capacity, and crews are the one resource that
      is not shown here.
  - id: exhibit-3
    title: "Two fixes the yard team has costed"
    kind: table
    ask: "Which fix would you do first, and what would it be worth?"
    columns: ["", "Standby crew pool", "Automated inspection portal"]
    rows:
      - ["Cost", "{{crew_total_cost}} a year", "{{portal_cost}} one time"]
      - ["Hours taken off dwell", "{{crew_save}}", "{{portal_save}}"]
      - ["Cost of an idle car per hour", "{{car_cost}}", "{{car_cost}}"]
    note: "Illustrative data created for this practice case. The yard also spent {{hump_spend}} on a new hump control system two years ago."
    insight: |
      The crew pool removes {{crew_save}} at a fraction of the cost.
      The portal removes {{portal_save}} and ties up {{portal_cost}}.
---

## Prompt

Our client, Prairie Central Railroad, runs freight across the US Midwest. Its largest classification yard, Harlan Yard, sorts inbound cars by destination and builds outbound trains. A car arrives on one train, is inspected, rolls over a small hill (the hump) to be sorted onto a track, waits for its outbound train to be built, and leaves with a new crew.

Cars now spend about 30 hours in the yard. The company's target is 24, because slow yards mean late deliveries, angry shippers and more cars needed to move the same freight.

The COO asks us: **why do cars sit so long at Harlan Yard, what should we fix, and what is the fix worth?**

## Clarifying information

- Q: What is the goal and the time frame?
  A: Reach the {{target}}-hour target within a year, at a payback inside {{hurdle}}.
- Q: Has the volume changed?
  A: No. The yard handles about {{cars_day}} a day and volume is steady.
- Q: Is there data on where cars wait?
  A: Yes. Exhibit 1 shows average hours by stage. Hand it over when the candidate asks how dwell splits up.
- Q: Are the yard's machines and tracks at capacity?
  A: Exhibit 2 shows capacity and load for inspection and the hump. Hand it over when asked about capacity.
- Q: What does a waiting car cost?
  A: About {{car_cost}} per car-hour, covering lease cost, lost use and penalties paid to shippers.
- Q: Has the yard invested recently?
  A: Yes. It spent **{{hump_spend}}** two years ago on a new hump control system, so the hump is a sore subject.
- Q: What fixes are already costed?
  A: Exhibit 3 shows two. Hand it over once the candidate has a view on the bottleneck.

## Structure

> **Ask:** The candidate should set out how they would find the bottleneck and size the benefit.

Follow a car through the yard, and ask at each stage: **how long, and why?**

- **1. Dwell by stage:** inbound inspection, hump, train build, wait for crew, departure
- **2. Cause of waiting at each stage**
  - Inspection: inspector numbers, shift patterns, inspection time per car
  - Hump: rate, operating hours, breakdowns, how cars arrive
  - Train build: how many tracks, how long to fill a train, minimum train size
  - Crews: how many are on call, hours-of-service rules, rest periods, scheduling
- **3. Benefit of fixing the worst stage**
  - Hours saved times cars times cost of an idle car
  - Cars released back to the network
- **4. Cost, payback and risks**

A good hypothesis: *"Cars wait in queues, and queues build where capacity is scarcest. I'd check capacity at each stage, but crews are a typical bottleneck because they follow legal work-hour rules that machines do not."*

## Math walkthrough

> **Ask:** The candidate should find the biggest block of dwell (Exhibit 1), test whether capacity explains it (Exhibit 2), and value the fixes (Exhibit 3).

**1. Where does the time go?**
Total dwell is {{h_insp}} + {{h_hump}} + {{h_build}} + {{h_crew}} + {{h_dep}} = **{{dwell}}**, which is {{gap}} above the target. The wait for a crew is {{crew_share}} of the total and the largest block.

**2. Are inspection and the hump the problem?**
Inspection: {{cars_day}} ÷ {{insp_cap}} = **{{insp_util}}**. Hump: capacity is {{hump_rate}} × {{hump_hours}} = {{hump_cap_day}} a day, so utilization is **{{hump_util}}**. Both are busy but have room, and together they hold only 9 of the 30 hours.

**3. Fix the crews.**
A standby crew pool removes {{crew_cut}} of the wait: {{h_crew}} × {{crew_cut}} = **{{crew_save}}**, bringing dwell to **{{new_dwell}}**, under the target. This frees {{cars_freed}} that no longer sit in the yard at any time.
Benefit: {{cars_day}} × 365 days × {{crew_save}} × {{car_cost}} = **{{crew_benefit}}** a year.
Cost: {{extra_crews}} × {{crew_cost}} = **{{crew_total_cost}}**. Net: **{{crew_net}}** a year.

**4. Compare with the portal.**
Saving {{portal_save}} is worth {{cars_day}} × 365 × {{portal_save}} × {{car_cost}} = **{{portal_benefit}}** a year. Payback on {{portal_cost}} is **{{portal_payback}}**, which passes the {{hurdle}} rule. But on its own the portal only gets dwell to {{portal_alone}}, still above target.

**5. The hump money.**
The {{hump_spend}} on the hump control system is sunk. It is no reason to invest more in the hump, and no reason to ignore it if it is the problem. Here, it is not.

## Synthesis

> **Ask:** The candidate should give the COO a clear recommendation.

**Fix crew availability first. A standby crew pool cuts dwell from {{dwell}} to {{new_dwell}}, meets the {{target}}-hour target, and is worth {{crew_net}} a year net. The inspection portal pays back in {{portal_payback}}, so do it second to reach {{both_dwell}}.**

1. **Bottleneck:** waiting for a crew is {{h_crew}} of {{dwell}}; inspection and the hump have spare capacity.
2. **Benefit:** {{crew_benefit}} a year in avoided idle-car cost for {{crew_total_cost}} of crew cost, and {{cars_freed}} freed.
3. **Sequencing:** the crew pool alone reaches the target; the portal alone does not ({{portal_alone}}).

**Risks and next steps:** the saving of {{crew_cut}} of the crew wait is an estimate, so run the standby pool for one quarter before committing; check union rules and hours-of-service limits; watch that once crews no longer wait, the train-build step ({{h_build}}) becomes the next constraint; and track on-time delivery to shippers, not only dwell, to confirm the benefit.

## Common mistakes

- Blaming the busiest-looking step (the hump or inspection) without comparing hours of waiting by stage.
- Calling for more hump investment because of the {{hump_spend}} already spent, or ignoring the hump only because of it.
- Forgetting that crews are a constraint of rules and scheduling, not only of headcount.
- Valuing the fix on revenue instead of idle-car cost, or forgetting the cost of the extra crews.
- Not checking the fix actually reaches the target: the portal alone leaves dwell at {{portal_alone}}.

## What top candidates do differently

- Follow a single car through the yard before suggesting any fix.
- Distinguish a **busy** step from a **bottleneck**: a step with {{insp_util}} utilization can still be fine.
- Ask what happens after the first fix: where does the next queue appear?
- Put the benefit in terms of cars released, which the COO can picture, as well as dollars.

## Creative question

Beyond adding crews, how could the railroad shorten the time cars wait for an outbound train?

## Model answer

Organize by **what delays the train**:

- **Crews:** better crew scheduling that matches shift starts to train-ready times; cross-train crews to work at several yards; call crews earlier using predictions of train-ready times.
- **Trains:** shorter, more frequent trains at quiet hours; fixed departure times so shippers can plan.
- **Cars:** sort cars in blocks before they reach the yard so less hump work is needed; send cars through without sorting when a whole train is going to one place.
- **Information:** share live yard data with customers, so they can reroute urgent loads.

A top candidate prioritizes: "Better crew scheduling costs little and can be tested quickly; I'd start there and add standby crews only for the gap that remains."
