---
id: airport-security-wait-times
title: "Hurry Up and Wait: Peak-Hour Lines at Airport Security"
client: "Harrowgate Regional Airport Authority (fictional), operator of a mid-sized Australian airport"
summary: "Morning security lines at a regional airport reach more than 20 minutes. Find the slowest step in a screening lane, work out how many lanes the peak needs, and compare more officers with faster bag screening."
industry: public-sector
sub_industry: "Public sector / Airports"
type: operations
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real airport data.
inputs:
  peak_pax:          { value: 1800, unit: "passengers/hour", label: "Passengers arriving at security per hour during the morning peak" }
  peak_hours:        { value: 3,    unit: "hours",           label: "Length of the morning peak" }
  lanes:             { value: 8,    unit: "lanes",           label: "Screening lanes open during the peak today" }
  lanes_total:       { value: 10,   unit: "lanes",           label: "Screening lanes built at the checkpoint" }
  id_rate:           { value: 300,  unit: "passengers/hour", label: "ID and boarding-pass check, per lane" }
  bag_rate:          { value: 200,  unit: "passengers/hour", label: "Bag screening (X-ray), per lane" }
  body_rate:         { value: 360,  unit: "passengers/hour", label: "Body scanner, per lane" }
  officers_per_lane: { value: 5,    unit: "officers",        label: "Officers needed to staff one lane" }
  target_wait:       { value: 10,   unit: "minutes",         label: "Airport's target for the longest wait at security" }
  lane_cost:         { value: 240,  unit: "$K",              label: "Annual cost of staffing one extra lane during the peaks" }
  auto_bag_rate:     { value: 240,  unit: "passengers/hour", label: "Bag screening per lane with automated tray return" }
  auto_capex:        { value: 120,  unit: "$K",              label: "Cost to fit automated tray return to one lane" }

calculations:
  # --- Find the bottleneck ---
  - { id: lane_rate, label: "Throughput of one lane (its slowest step)", formula: "min(id_rate, bag_rate, body_rate)", expected: 200, unit: "passengers/hour" }
  - { id: capacity, label: "Checkpoint capacity during the peak today", formula: "lanes * lane_rate", expected: 1600, unit: "passengers/hour" }
  - { id: queue_growth, label: "Growth of the line per hour of peak", formula: "peak_pax - capacity", expected: 200, unit: "passengers/hour" }
  - { id: peak_queue, label: "Passengers in line at the end of the peak", formula: "queue_growth * peak_hours", expected: 600, unit: "passengers" }
  - { id: peak_wait, label: "Wait for a passenger joining the line at the end of the peak", formula: "peak_queue / capacity * 60", expected: 22.5, unit: "minutes" }
  # --- Option A: open more lanes ---
  - { id: lanes_needed, label: "Lanes needed to keep up with the peak", formula: "ceil(peak_pax / lane_rate)", expected: 9, unit: "lanes" }
  - { id: capacity_a, label: "Checkpoint capacity with option A", formula: "lanes_needed * lane_rate", expected: 1800, unit: "passengers/hour" }
  - { id: extra_officers, label: "Extra officers needed during the peak", formula: "(lanes_needed - lanes) * officers_per_lane", expected: 5, unit: "officers" }
  - { id: cost_a, label: "Annual cost of option A", formula: "(lanes_needed - lanes) * lane_cost", expected: 240, unit: "$K" }
  # --- Option B: faster bag screening ---
  - { id: lane_rate_b, label: "Throughput of one lane with automated tray return", formula: "min(id_rate, auto_bag_rate, body_rate)", expected: 240, unit: "passengers/hour" }
  - { id: capacity_b, label: "Checkpoint capacity with option B (8 lanes)", formula: "lanes * lane_rate_b", expected: 1920, unit: "passengers/hour" }
  - { id: headroom_b, label: "Spare capacity at the peak with option B", formula: "capacity_b - peak_pax", expected: 120, unit: "passengers/hour" }
  - { id: capex_b, label: "One-time cost of option B", formula: "lanes * auto_capex", expected: 960, unit: "$K" }
  - { id: payback_b, label: "Payback of option B against staffing an extra lane", formula: "capex_b / cost_a", expected: 4, unit: "years" }

answer:
  calc: lanes_needed
  headline: "Bag screening limits each lane to {{lane_rate}}, so the {{lanes}} that are open fall {{queue_growth}} short of the peak; opening a 9th lane closes the gap now, and automated tray return ({{capacity_b}} on 8 lanes) pays back in {{payback_b}}."

exhibits:
  - id: exhibit-1
    title: "Throughput of each step in one screening lane (passengers per hour)"
    kind: bar
    unit: "passengers/hour"
    decimals: 0
    ask: "Here is how fast each step in a lane works. Where is the problem?"
    data:
      - { label: "1. ID and boarding-pass check", value: id_rate }
      - { label: "2. Bag screening (X-ray)", value: bag_rate }
      - { label: "3. Body scanner", value: body_rate }
    note: "Illustrative data created for this practice case. Harrowgate Regional Airport is fictional. 8 of the 10 lanes are open during the peak; {{peak_pax}} arrive at security during the morning peak, which lasts {{peak_hours}}."
    insight: |
      Bag screening is the slowest step at {{bag_rate}} per lane, so a lane can
      never move faster than that. More ID officers would not shorten the line.
  - id: exhibit-2
    title: "Two options to shorten the line"
    kind: table
    ask: "Operations has two ideas. Which closes the gap, and what does each cost?"
    columns: ["Option", "What changes", "Cost"]
    rows:
      - ["A. Open more lanes at the peak", "Use the spare lanes; each needs {{officers_per_lane}}", "{{lane_cost}} a year per extra lane"]
      - ["B. Automated tray return", "Bins return on a conveyor and several passengers load at once: bag screening rises to {{auto_bag_rate}} per lane", "{{auto_capex}} per lane, one time; about six months to install"]
    note: "Illustrative data created for this practice case."
    insight: |
      Option A works immediately but leaves no spare capacity. Option B raises
      the bottleneck itself, so the same 8 lanes handle more than the peak.
---

## Prompt

Our client, the Harrowgate Regional Airport Authority, runs a mid-sized Australian airport with one security checkpoint. As at most Australian airports, the airport, not the government, is responsible for passenger screening: it hires a security contractor to staff the lanes and pays for every lane it opens. Most flights leave in the morning, and during the morning peak the security line regularly stretches past the end of the hall. Passengers have missed flights, and airlines are complaining.

The airport's head of operations asks us: **why is the line so long, and what is the cheapest way to bring the wait under 10 minutes?**

## Clarifying information

- Q: How many passengers arrive at security during the peak?
  A: About **{{peak_pax}}**, for about {{peak_hours}} every morning. Outside the peak, the line is short.
- Q: How many lanes are there?
  A: The checkpoint has {{lanes_total}}, and **{{lanes}}** are open during the peak. Each open lane needs {{officers_per_lane}}.
- Q: What happens in a lane?
  A: Three steps: an officer checks ID and boarding pass, bags go through the X-ray, and the passenger walks through the body scanner.
- Q: What is the target?
  A: No passenger should wait more than **{{target_wait}}** at security.
- Q: Is passenger traffic growing?
  A: Slowly. The airport expects a few percent a year as new routes open.

## Structure

> **Ask:** How would you approach this?

Treat the checkpoint as a **queue**: the line grows whenever passengers arrive faster than the lanes can screen them.

- **1. Demand:** passengers per hour at the peak, and how long the peak lasts
- **2. Capacity:** lanes open × throughput per lane
  - Throughput per lane is set by its **slowest step**: ID check, bag screening or body scanner
- **3. The gap:** how fast the line grows, how long it gets, and how long the last passenger waits
- **4. Options to close the gap**
  - More lanes (more officers)
  - A faster bottleneck step (equipment, process)
  - Smoother demand (for example, asking airlines to spread departures)
  - For each: capacity gained, cost, speed

A good hypothesis: *"A lane only moves as fast as its slowest step, so I want to see each step's speed before adding officers."*

## Math walkthrough

> **Ask:** Using Exhibit 1, how long is the wait at the end of the peak? How many lanes does the peak need? Then, using Exhibit 2, compare the two options.

**1. The bottleneck.**
Each lane moves at the speed of its slowest step: bag screening, at **{{lane_rate}}**.
Checkpoint capacity = 8 lanes × 200 = **{{capacity}}**, against {{peak_pax}} arriving.

**2. How long the line gets.**
The line grows by 1,800 − 1,600 = **{{queue_growth}}**. After the 3-hour peak, 200 × 3 = **{{peak_queue}}** are waiting.
A passenger joining the line then waits 600 ÷ 1,600 × 60 = **{{peak_wait}}**, more than double the target.

**3. Option A: open more lanes.**
Lanes needed = 1,800 ÷ 200, so **{{lanes_needed}}**. That is one more lane, or **{{extra_officers}}** during the peak, for **{{cost_a}}** a year.
Capacity matches the peak exactly at {{capacity_a}}, so the line stops growing, but there is no spare capacity for a busy day.

**4. Option B: automated tray return.**
Bag screening rises to {{auto_bag_rate}}. It is still the slowest step, so each lane now handles **{{lane_rate_b}}**.
With the same 8 lanes: 8 × 240 = **{{capacity_b}}**, or {{headroom_b}} of spare capacity at the peak.
It costs 8 × $120K = **{{capex_b}}** once, and avoids staffing a 9th lane, so it pays back in $960K ÷ $240K = **{{payback_b}}**.

## Synthesis

> **Ask:** What would you recommend to the head of operations?

**The line is long because bag screening limits every lane to {{lane_rate}}, so the 8 open lanes handle {{capacity}} against {{peak_pax}} arriving. Harrowgate should open a 9th lane at the peak now ({{extra_officers}}, {{cost_a}} a year), and fit automated tray return, which lets 8 lanes handle {{capacity_b}} and pays back in {{payback_b}}.**

1. **Fix bag screening, not ID checks:** ID checks run at {{id_rate}} per lane, well above the bag-screening rate, so more ID officers would not help.
2. **A 9th lane works today but has no slack:** it matches the peak exactly, so any late-morning bank of flights would rebuild the line.
3. **Tray return raises the bottleneck itself:** it adds capacity without adding officers, and leaves the 9th and 10th lanes free for growth.

**Risks and next steps:** check that the body scanner and the ID check keep up once bags move faster; measure arrivals in 15-minute blocks, since a sharper spike inside the peak would need more than the hourly average suggests; and ask airlines whether a few early departures could move to spread the peak.

## Common mistakes

- Adding up the speed of the three steps, or averaging them, instead of taking the slowest one.
- Adding ID officers because the ID check is the first thing passengers see.
- Working out the line length without multiplying by the length of the peak.
- Stopping at "open one more lane" without noticing that it leaves zero spare capacity.

## What top candidates do differently

- Draw a lane as three steps and circle the slowest one before doing any math.
- Turn the line into a wait time (line ÷ capacity) so it can be compared with the 10-minute target.
- Compare an equipment fix with a staffing fix as a payback, not just as a one-time cost.
- Raise demand-side ideas, such as spreading departures, not only capacity.

## Creative question

Apart from more lanes and faster equipment, how could the airport cut peak waits at security?

## Model answer

Group ideas into **less demand at the peak, faster screening, and a better passenger experience**:

- **Less demand at the peak:** work with airlines to move a few departures out of the busiest hour; open the checkpoint earlier; give passengers live wait times so those with time arrive later.
- **Faster screening:** a priority lane for frequent flyers and business-class passengers; signs and staff in the line telling passengers to prepare (liquids out, laptops ready) before they reach the belt; more divesting space so several passengers load bins at once.
- **Better experience:** bookable screening time slots for the peak; a "late for your flight" call-forward from a staff member watching departure times.

A top candidate prioritizes: "Preparing passengers in the line is almost free and speeds up exactly the bottleneck step, bag screening, so I would start there while the tray-return equipment is installed."
