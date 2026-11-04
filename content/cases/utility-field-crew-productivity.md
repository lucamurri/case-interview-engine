---
id: utility-field-crew-productivity
title: "More Wrench, Less Windshield: A Utility's Field Crews"
client: "Northfield Power & Gas (fictional), a regulated electric and gas utility in the US Upper Midwest"
summary: "A utility's field crews complete four jobs a day and the CEO wants $30M a year out of field operations. Better scheduling frees 40 crews, but cutting them falls short and can't happen fast. Using them for contractor work gets close, and the candidate must say the target is not fully reachable."
industry: energy
sub_industry: "Electric & gas utility"
type: operations
difficulty: advanced
format: candidate-led
time_minutes: 40

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  crews:            { value: 200,    unit: "crews",              label: "Field crews (three workers and a truck each)" }
  crew_cost:        { value: 0.5,    unit: "$M",                 label: "Fully loaded cost per crew per year" }
  days:             { value: 250,    unit: "days",               label: "Working days per crew per year" }
  shift:            { value: 8,      unit: "hours",              label: "Paid hours per crew per day" }
  wrench_now:       { value: 4,      unit: "hours",              label: "Hours per day spent working on jobs (wrench time), today" }
  drive_now:        { value: 2.5,    unit: "hours",              label: "Hours per day driving between depot and jobs, today" }
  admin_now:        { value: 1.5,    unit: "hours",              label: "Hours per day at the depot, collecting parts and waiting for job packs, today" }
  job_hours:        { value: 1,      unit: "hours",              label: "Wrench time per maintenance and repair job" }
  maint_jobs:       { value: 200000, unit: "jobs/year",          label: "Maintenance and repair jobs per year (stable)" }
  target:           { value: 30,     unit: "$M",                 label: "CEO's target for annual savings from field operations" }
  benchmark:        { value: 6,      unit: "jobs/day",           label: "Jobs per crew per day at a peer utility" }
  drive_new:        { value: 1.75,   unit: "hours",              label: "Driving hours per day with route optimization" }
  admin_new:        { value: 1.25,   unit: "hours",              label: "Depot hours per day with digital job packs and parts delivered to trucks" }
  fix_cost:         { value: 2,      unit: "$M",                 label: "Annual cost of the scheduling software and parts delivery" }
  attrition:        { value: 10,     unit: "crews",              label: "Crews lost each year to retirement and resignation" }
  contractor_conns: { value: 20000,  unit: "connections",        label: "New-customer connections done by contractors each year" }
  contractor_price: { value: 1500,   unit: "$",                  label: "Price paid to contractors per connection" }
  conn_hours:       { value: 2.5,    unit: "hours",              label: "Wrench time per connection for a Northfield crew" }
  conn_wait:        { value: 14,     unit: "weeks",              label: "Average wait for a new connection today" }

calculations:
  # --- Today ---
  - { id: jobs_day_now, label: "Jobs per crew per day today", formula: "wrench_now / job_hours", expected: 4, unit: "jobs/day" }
  - { id: wrench_share, label: "Share of the shift spent on jobs", formula: "wrench_now / shift", expected: 0.50, unit: "%" }
  - { id: field_cost, label: "Annual cost of field crews", formula: "crews * crew_cost", expected: 100, unit: "$M" }
  - { id: capacity_now, label: "Jobs the crews can complete per year today", formula: "crews * jobs_day_now * days", expected: 200000, unit: "jobs/year" }
  - { id: cost_per_job, label: "Crew cost per job today", formula: "field_cost * 1e6 / maint_jobs", expected: 500, unit: "$/job" }
  - { id: bench_nonwrench, label: "Daily hours outside wrench time implied by the peer benchmark", formula: "shift - benchmark * job_hours", expected: 2, unit: "hours" }
  # --- Lever 1: scheduling fix ---
  - { id: wrench_new, label: "Wrench time per day after the scheduling fix", formula: "shift - drive_new - admin_new", expected: 5, unit: "hours" }
  - { id: jobs_day_new, label: "Jobs per crew per day after the fix", formula: "wrench_new / job_hours", expected: 5, unit: "jobs/day" }
  - { id: prod_gain, label: "Productivity gain", formula: "jobs_day_new / jobs_day_now - 1", expected: 0.25, unit: "%" }
  - { id: crews_needed, label: "Crews needed for maintenance work after the fix", formula: "maint_jobs / (jobs_day_new * days)", expected: 160, unit: "crews" }
  - { id: freed_crews, label: "Crews freed by the fix", formula: "crews - crews_needed", expected: 40, unit: "crews" }
  - { id: cut_gross, label: "Saving if the freed crews are removed", formula: "freed_crews * crew_cost", expected: 20, unit: "$M" }
  - { id: cut_net, label: "Net saving after the cost of the fix", formula: "cut_gross - fix_cost", expected: 18, unit: "$M" }
  - { id: cut_gap, label: "Shortfall against the target", formula: "target - cut_net", expected: 12, unit: "$M" }
  - { id: cut_years, label: "Years for attrition to remove the freed crews", formula: "freed_crews / attrition", expected: 4, unit: "years" }
  - { id: cut_year1, label: "Net saving in year 1 through attrition", formula: "attrition * crew_cost - fix_cost", expected: 3, unit: "$M" }
  # --- Lever 2: use the freed capacity for connections ---
  - { id: freed_hours, label: "Wrench hours freed per year", formula: "freed_crews * wrench_new * days", expected: 50000, unit: "hours" }
  - { id: conns_insourced, label: "Connections the freed crews can take over", formula: "min(freed_hours / conn_hours, contractor_conns)", expected: 20000, unit: "connections" }
  - { id: contractor_saved, label: "Contractor spend avoided", formula: "conns_insourced * contractor_price / 1e6", expected: 30, unit: "$M" }
  - { id: redeploy_net, label: "Net saving: fix plus insourcing connections", formula: "contractor_saved - fix_cost", expected: 28, unit: "$M" }
  - { id: redeploy_vs_cut, label: "Advantage of insourcing over cutting crews", formula: "redeploy_net - cut_net", expected: 10, unit: "$M" }
  - { id: target_gap, label: "Remaining shortfall against the target", formula: "target - redeploy_net", expected: 2, unit: "$M" }
  - { id: target_share, label: "Share of the target reached", formula: "redeploy_net / target", expected: 0.9333, unit: "%", decimals: 0 }
  - { id: internal_hour, label: "Northfield crew cost per wrench hour after the fix", formula: "crew_cost * 1e6 / (wrench_new * days)", expected: 400, unit: "$/hour" }
  - { id: contractor_hour, label: "Contractor price per wrench hour", formula: "contractor_price / conn_hours", expected: 600, unit: "$/hour" }

answer:
  calc: redeploy_net
  headline: "Better scheduling lifts crews from {{jobs_day_now}} to {{jobs_day_new}} and frees {{freed_crews}}; cutting them nets only {{cut_net}} and takes {{cut_years}}, but using them for contractor connection work nets {{redeploy_net}} a year from year 1, {{target_gap}} short of the {{target}} target."

exhibits:
  - id: exhibit-1
    title: "How a Northfield crew spends an eight-hour day (hours)"
    kind: bar
    unit: "hours"
    decimals: 1
    ask: "Here is a typical crew day. What stands out?"
    data:
      - { label: "Working on jobs (wrench time)", value: wrench_now }
      - { label: "Driving", value: drive_now }
      - { label: "At the depot: parts, job packs, waiting", value: admin_now }
    note: "Illustrative data created for this practice case. Northfield Power & Gas is fictional. Based on two weeks of truck GPS and timesheet data. A peer utility reports {{benchmark}}, but it serves a dense city territory."
    insight: |
      Only {{wrench_share}} of the paid day is spent on jobs. Driving and depot
      time are the targets. The peer's {{benchmark}} would need only
      {{bench_nonwrench}} of driving and depot time, which is unrealistic in a
      rural territory.
  - id: exhibit-2
    title: "Proposed scheduling fix"
    kind: table
    ask: "The operations team proposes this fix. How much does it save, and does it hit the CEO's target?"
    columns: ["Change", "Today", "With the fix"]
    rows:
      - ["Driving per crew per day (route optimization; first job sent to crews' homes)", "{{drive_now}}", "{{drive_new}}"]
      - ["Depot time per crew per day (digital job packs; parts delivered to trucks overnight)", "{{admin_now}}", "{{admin_new}}"]
      - ["Annual cost (software licenses, parts delivery van)", "—", "{{fix_cost}}"]
    note: "Illustrative data created for this practice case. The union agreement does not allow layoffs; about {{attrition}} leave each year through retirement and resignation."
    insight: |
      Wrench time rises to {{wrench_new}}, freeing {{freed_crews}}. But
      cutting them nets only {{cut_net}}, and with no layoffs it would take
      {{cut_years}} to get there.
  - id: exhibit-3
    title: "New-customer connection work"
    kind: table
    ask: "Here is data on new-customer connections. Does it change your answer?"
    columns: ["Item", "Value"]
    rows:
      - ["Connections sent to contractors each year", "{{contractor_conns}}"]
      - ["Price paid to contractors per connection", "{{contractor_price}}"]
      - ["Wrench time per connection for a Northfield crew", "{{conn_hours}}"]
      - ["Average wait for a new connection today", "{{conn_wait}}"]
    note: "Illustrative data created for this practice case. Northfield crews are trained and certified for connection work; it has been sent to contractors because crews had no spare time. Northfield supplies the materials in both cases."
    insight: |
      A Northfield crew hour costs {{internal_hour}} after the fix against
      {{contractor_hour}} for contractors. The freed crews can take over all
      contractor connections, saving {{contractor_saved}}, more than cutting
      them would.
---

## Prompt

Our client, Northfield Power & Gas, is a regulated utility that delivers electricity and gas to about a million customers across a largely rural territory. Its field crews repair and maintain the network (replacing meters, fixing gas leaks, clearing faults) and connect new customers.

The regulator has frozen rates for three years, so Northfield must cut costs to protect its earnings. The CEO has noticed that crews complete only about four jobs a day, while a peer utility reports six. She has set a target: **$30M a year of savings from field operations.**

She asks us: **why are crews so unproductive, and how do we reach the target?**

## Clarifying information

- Q: How many crews are there, and what do they cost?
  A: **{{crews}}**, each costing about **{{crew_cost}}** a year fully loaded, so about {{field_cost}} in total. They work {{days}} a year.
- Q: How much maintenance and repair work is there?
  A: About **{{maint_jobs}}**, stable from year to year. Each takes about an hour of wrench time on average.
- Q: Can Northfield reduce the number of crews?
  A: Not through layoffs: the union agreement rules them out. About **{{attrition}}** leave each year, and Northfield can choose not to replace them.
- Q: Do crews do any other work?
  A: Some new-customer connections; a lot goes to contractors.
- Q: Why does the peer utility do six jobs a day?
  A: It serves a dense urban territory with short drives between jobs.
- Q: Does the target have to be met in year 1?
  A: The CEO wants it as a recurring annual saving as soon as possible, ideally from next year.

## Structure

> **Ask:** The candidate should lay out how they will find the lost time and what to do with it.

Break the crew day into **where the hours go**, then decide **what to do with the hours saved**.

- **1. Jobs per crew per day = Wrench time ÷ Hours per job**
  - Wrench time = Paid hours − Driving − Depot time (parts, job packs, waiting)
  - Hours per job: job mix, crew skills, first-time fix rate
- **2. Levers to raise wrench time**
  - Driving: route optimization, starting from home, regional parts stores
  - Depot time: digital job packs, parts delivered to trucks
- **3. Turning hours into savings**
  - Fewer crews (limited by the no-layoff agreement and attrition)
  - Do work Northfield currently pays others for (contractors)
  - Do more work that earns money or reduces risk
- **4. Compare with the target and timing**

A strong hypothesis: *"Four jobs in an eight-hour day means half the day is spent off the job. But freeing time only saves money if we either remove cost or use the time for work we pay someone else to do, so I want to know what else crews could be doing."*

## Math walkthrough

> **Ask:** The candidate should size the scheduling fix (Exhibits 1 and 2), test it against the target, then use Exhibit 3 to revise the answer.

**1. Where the day goes (Exhibit 1).**
Crews spend 4 of 8 hours on jobs ({{wrench_share}}), so they complete **{{jobs_day_now}}**. Capacity is 200 × 4 × 250 = {{capacity_now}}, exactly the maintenance workload, at a crew cost of **{{cost_per_job}}**.
The peer's {{benchmark}} would leave only 8 − 6 = {{bench_nonwrench}} for driving and depot time. In a rural territory, that is not a realistic benchmark.

**2. The scheduling fix (Exhibit 2).**
Wrench time = 8 − 1.75 − 1.25 = **{{wrench_new}}**, so crews complete **{{jobs_day_new}}**, a {{prod_gain}} gain.
Maintenance now needs 200,000 ÷ (5 × 250) = {{crews_needed}}, freeing **{{freed_crews}}**.

**3. Option 1: remove the freed crews.**
Saving: 40 × $0.5M = {{cut_gross}}, minus the {{fix_cost}} cost of the fix = **{{cut_net}}**, which is **{{cut_gap}}** short of the target.
And it is slow: with no layoffs, attrition removes {{attrition}} a year, so it takes **{{cut_years}}**. Year 1 nets only 10 × $0.5M − $2M = **{{cut_year1}}**.

**4. Option 2: use the freed crews for connections (Exhibit 3).**
Freed wrench hours: 40 × 5 × 250 = {{freed_hours}}. At {{conn_hours}} per connection, that covers 50,000 ÷ 2.5 = **{{conns_insourced}}**, all of the contractor work.
Contractor spend avoided: 20,000 × $1,500 = **{{contractor_saved}}**. Net of the fix: **{{redeploy_net}}** a year, starting in year 1.
This works because a Northfield crew hour costs $0.5M ÷ (5 × 250) = {{internal_hour}}, while contractors charge $1,500 ÷ 2.5 = {{contractor_hour}}.

**5. Compare with the target.**

| Option | Net annual saving | Year 1 | Shortfall vs. target |
|---|---|---|---|
| Fix + remove freed crews | {{cut_net}} | {{cut_year1}} | {{cut_gap}} |
| **Fix + insource connections** | **{{redeploy_net}}** | **{{redeploy_net}}** | **{{target_gap}}** |

Insourcing is {{redeploy_vs_cut}} a year better, and it arrives immediately. But it reaches {{target_share}} of the target, not all of it.

## Synthesis

> **Ask:** The candidate should give the CEO a straight answer on the target.

**Northfield should fix crew scheduling and use the 40 freed crews to take back the connection work it sends to contractors. That saves {{redeploy_net}} a year from year 1, against {{cut_net}} (reached only after {{cut_years}}) if it cut crews instead. The {{target}} target is not fully reachable from these levers: we should tell the CEO it falls {{target_gap}} short and propose {{redeploy_net}} as the committed number.**

1. **Half the paid day is off the job:** crews spend only {{wrench_share}} of their shift on jobs; route optimization and parts delivered to trucks lift output from {{jobs_day_now}} to {{jobs_day_new}}.
2. **Cutting crews is the wrong way to cash in:** it saves {{cut_net}}, and the no-layoff agreement stretches that over {{cut_years}}.
3. **Insourcing is cheaper and immediate:** a Northfield crew hour costs {{internal_hour}} against {{contractor_hour}} for contractors, so taking back all {{conns_insourced}} saves {{contractor_saved}}, and should also cut the 14-week wait for new customers.

**Risks and next steps:** pilot the scheduling software in one region before rolling out, since drive-time savings in a rural territory are uncertain; check that connection demand stays at {{contractor_conns}} a year, because if it falls, attrition becomes the way to release crews; agree with the union how crews move between maintenance and connection work; and look for the last {{target_gap}} elsewhere, for example in overtime, fleet costs or a higher first-time fix rate, rather than promising a number the field plan can't deliver.

## Common mistakes

- Taking the peer's {{benchmark}} as the target without asking why the peer is faster.
- Counting the freed crews as a saving without checking whether Northfield can actually remove them.
- Stopping at the {{cut_net}} saving and declaring the target unreachable, without asking what else crews could do.
- Claiming the full {{target}} is achievable by stretching assumptions, instead of saying clearly that the plan reaches {{target_share}}.

## What top candidates do differently

- Split the crew day into wrench, driving and depot time before proposing any fix.
- Ask early about constraints on headcount and about work sent to contractors.
- Compare internal and contractor cost per hour to show why insourcing beats cutting.
- Give the CEO an honest answer: the committed number is {{redeploy_net}}, with a short list of places to look for the last {{target_gap}}.

## Creative question

Apart from scheduling, how could Northfield get more useful work out of each crew hour?

## Model answer

Group ideas around **fewer wasted trips, fewer repeat visits, and less work that needs a crew**:

- **Fewer wasted trips:** confirm customer access the day before; bundle jobs on the same street into one visit; small regional parts stores so crews don't return to the depot.
- **Fewer repeat visits:** track first-time fix rate by job type and crew; carry the right parts for the most common faults; give crews remote access to engineers and network maps.
- **Less work that needs a full crew:** send a single technician for simple jobs such as meter swaps; replace scheduled inspections with sensors and drone surveys; let customers do simple checks with video guidance.
- **Better planning:** shift planned maintenance into quiet months; plan routes weekly, not daily, to cluster jobs by area.

A top candidate prioritizes: "Sending single technicians to simple jobs is the biggest lever, because a full three-person crew on a meter swap wastes two people's time. It needs the union's agreement, so I would start the conversation alongside the scheduling pilot."
