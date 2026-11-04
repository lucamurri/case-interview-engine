---
id: city-transit-fare-redesign
title: "Fare Play: Redesigning a Mid-Sized City's Transit Fares"
client: "Harlow Bay Regional Transit (fictional), the bus and light-rail agency of a mid-sized US city"
summary: "A city council wants more riders and fairer fares without blowing up the transit budget. A flat fare increase raises money but drives riders away — can a smarter fare structure do better on every goal?"
industry: other
sub_industry: "Public sector"
type: pricing
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real transit data.
inputs:
  rides:            { value: 50,   unit: "million rides", label: "Annual rides today" }
  fare:             { value: 2.00, unit: "$",       label: "Average fare paid per ride today", decimals: 2 }
  op_cost:          { value: 400,  unit: "$M",      label: "Annual operating cost" }
  low_share:        { value: 0.40, unit: "%",       label: "Share of rides taken by low-income riders" }
  peer_fare_up:     { value: 0.20, unit: "%",       label: "Fare increase in a comparable peer city" }
  peer_loss_low:    { value: 0.12, unit: "%",       label: "Peer city: ridership lost among low-income riders" }
  peer_loss_other:  { value: 0.04, unit: "%",       label: "Peer city: ridership lost among other riders" }
  new_fare:         { value: 2.50, unit: "$",       label: "Proposed standard fare", decimals: 2 }
  disc_fare:        { value: 1.00, unit: "$",       label: "Proposed low-income fare (Option B)", decimals: 2 }
  admin_cost:       { value: 1.5,  unit: "$M",      label: "Annual cost to run low-income enrollment", decimals: 1 }
  tolerance:        { value: 5,    unit: "$M",      label: "Most the council will add to the transit budget per year" }

calculations:
  # --- Today ---
  - { id: fare_rev, label: "Fare revenue today", formula: "rides * fare", expected: 100, unit: "$M" }
  - { id: farebox, label: "Share of operating cost covered by fares", formula: "fare_rev / op_cost", expected: 0.25, unit: "%" }
  - { id: subsidy_per_ride, label: "Public subsidy per ride today", formula: "(op_cost - fare_rev) / rides", expected: 6, unit: "$", decimals: 2 }
  - { id: rides_low, label: "Rides by low-income riders", formula: "rides * low_share", expected: 20, unit: "million rides" }
  - { id: rides_other, label: "Rides by other riders", formula: "rides - rides_low", expected: 30, unit: "million rides" }
  # --- Price sensitivity (Exhibit 2) ---
  - { id: elast_low, label: "Fare elasticity, low-income riders", formula: "-peer_loss_low / peer_fare_up", expected: -0.6, unit: "", decimals: 1 }
  - { id: elast_other, label: "Fare elasticity, other riders", formula: "-peer_loss_other / peer_fare_up", expected: -0.2, unit: "", decimals: 1 }
  - { id: sensitivity_ratio, label: "Low-income riders' price sensitivity versus other riders", formula: "elast_low / elast_other", expected: 3, unit: "x", decimals: 0 }
  # --- Option A: $2.50 for everyone ---
  - { id: fare_chg_a, label: "Fare change, standard fare", formula: "(new_fare - fare) / fare", expected: 0.25, unit: "%" }
  - { id: a_rides_low, label: "Option A: low-income rides", formula: "rides_low * (1 + elast_low * fare_chg_a)", expected: 17, unit: "million rides" }
  - { id: a_rides_other, label: "Option A and B: other riders' rides at $2.50", formula: "rides_other * (1 + elast_other * fare_chg_a)", expected: 28.5, unit: "million rides" }
  - { id: a_rides, label: "Option A: total rides", formula: "a_rides_low + a_rides_other", expected: 45.5, unit: "million rides" }
  - { id: a_rides_lost, label: "Option A: rides lost", formula: "rides - a_rides", expected: 4.5, unit: "million rides" }
  - { id: a_drop_pct, label: "Option A: ridership fall (%)", formula: "a_rides_lost / rides", expected: 0.09, unit: "%" }
  - { id: a_low_lost, label: "Option A: rides lost by low-income riders", formula: "rides_low - a_rides_low", expected: 3, unit: "million rides" }
  - { id: a_low_lost_share, label: "Option A: share of lost rides that are low-income riders' rides", formula: "a_low_lost / a_rides_lost", expected: 0.667, unit: "%", decimals: 0 }
  - { id: a_rev, label: "Option A: fare revenue", formula: "a_rides * new_fare", expected: 113.75, unit: "$M", decimals: 2 }
  - { id: a_rev_gain, label: "Option A: extra fare revenue", formula: "a_rev - fare_rev", expected: 13.75, unit: "$M", decimals: 2 }
  # --- Option B: $2.50 standard + $1.00 low-income fare ---
  - { id: disc_chg, label: "Fare change, low-income fare", formula: "(disc_fare - fare) / fare", expected: -0.5, unit: "%" }
  - { id: b_rides_low, label: "Option B: low-income rides", formula: "rides_low * (1 + elast_low * disc_chg)", expected: 26, unit: "million rides" }
  - { id: b_rides, label: "Option B: total rides", formula: "b_rides_low + a_rides_other", expected: 54.5, unit: "million rides" }
  - { id: b_rides_added, label: "Option B: rides added", formula: "b_rides - rides", expected: 4.5, unit: "million rides" }
  - { id: b_gain_pct, label: "Option B: ridership growth (%)", formula: "b_rides_added / rides", expected: 0.09, unit: "%" }
  - { id: b_rev_low, label: "Option B: fare revenue from low-income riders", formula: "b_rides_low * disc_fare", expected: 26, unit: "$M" }
  - { id: b_rev_other, label: "Option B: fare revenue from other riders", formula: "a_rides_other * new_fare", expected: 71.25, unit: "$M", decimals: 2 }
  - { id: b_rev, label: "Option B: fare revenue", formula: "b_rev_low + b_rev_other", expected: 97.25, unit: "$M", decimals: 2 }
  - { id: b_net_cost, label: "Option B: net cost to the budget (lost revenue + enrollment cost)", formula: "fare_rev - b_rev + admin_cost", expected: 4.25, unit: "$M", decimals: 2 }
  - { id: b_headroom, label: "Option B: room left under the council's limit", formula: "tolerance - b_net_cost", expected: 0.75, unit: "$M", decimals: 2 }
  - { id: cost_per_added_ride, label: "Option B: budget cost per added ride", formula: "b_net_cost / b_rides_added", expected: 0.944, unit: "$", decimals: 2 }

answer:
  calc: b_rides_added
  headline: "Raise the standard fare to {{new_fare}} but add a {{disc_fare}} low-income fare: ridership grows {{b_gain_pct}} for a net cost of {{b_net_cost}}, inside the council's limit."

exhibits:
  - id: exhibit-1
    title: "Harlow Bay Regional Transit today"
    kind: table
    ask: "Here is a snapshot of the system. What stands out?"
    columns: ["Metric", "Value"]
    rows:
      - ["Annual rides", "{{rides}}"]
      - ["Average fare paid per ride", "{{fare}}"]
      - ["Annual operating cost", "{{op_cost}}"]
      - ["Share of rides by low-income riders (household income below twice the poverty line)", "{{low_share}}"]
      - ["Proposed new standard fare", "{{new_fare}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Fares cover only {{farebox}} of operating cost; taxpayers already fund
      the rest, about {{subsidy_per_ride}} per ride. Fare policy is as much
      about who rides as about revenue.
  - id: exhibit-2
    title: "Ridership lost after a comparable city raised fares by 20%, by rider group"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "A nearby city with a similar system raised its fares two years ago. What does its experience tell us?"
    data:
      - { label: "Low-income riders", value: peer_loss_low }
      - { label: "Other riders", value: peer_loss_other }
    note: "Illustrative data created for this practice case; not results from a real city."
    insight: |
      Low-income riders are {{sensitivity_ratio}} as sensitive to price as other riders.
      Turning this into elasticities (the percentage change in rides for a
      1% change in fare) gives {{elast_low}} for low-income riders and
      {{elast_other}} for everyone else.
---

## Prompt

Our client is Harlow Bay Regional Transit, the public agency that runs buses and light rail in a mid-sized US city. Ridership has not recovered to its old levels, and the agency's fares have not changed in eight years.

The city council has asked the agency to **redesign its fares**. The finance team has proposed raising the standard fare from {{fare}} to {{new_fare}}. Some council members worry this will hurt the riders who depend on transit most. The general manager asks us: **what fare structure should Harlow Bay adopt?**

## Clarifying information

- Q: What is the agency trying to achieve?
  A: Three goals set by the council: grow ridership, make fares fairer for low-income residents, and keep the budget under control — the council will add at most **{{tolerance}}** a year to the transit budget.
- Q: Is the goal to maximize fare revenue?
  A: No. Fares cover only part of the cost; the agency is publicly funded to provide mobility. Revenue matters as a constraint, not as the objective.
- Q: Who rides the system?
  A: About {{low_share}} of rides are taken by low-income riders, many of whom have no car. The rest are a mix of commuters and occasional riders who could often drive instead.
- Q: Is there capacity for more riders?
  A: Yes. Outside the busiest hours, most buses and trains have plenty of empty seats, so extra riders cost almost nothing to carry.
- Q: Could the agency offer a discount to low-income riders?
  A: Yes — they could enroll using proof of an existing benefit (such as food assistance), which keeps verification simple. Running enrollment would cost about **{{admin_cost}}** a year.
- Q: Is there data on how riders react to fare changes?
  A: Yes — a comparable nearby city raised its fares by {{peer_fare_up}} two years ago (Exhibit 2).

## Structure

> **Ask:** How would you structure the fare decision?

A pricing structure built around a **public-sector objective**, not profit:

- **1. Objectives and constraints**
  - Ridership (the main goal), fairness for low-income riders, net budget impact within {{tolerance}}
- **2. How riders respond to price**
  - Price sensitivity (elasticity) by rider group (Exhibit 2)
  - Other factors: service frequency, reliability, safety — which can matter more than price
- **3. Fare options**
  - Flat increase for everyone
  - Higher standard fare plus a low-income discount
  - Other designs: fare capping (riders stop paying once they've spent the price of a pass), off-peak discounts
- **4. Impact of each option**
  - Rides by group, fare revenue, net cost, cost per added ride
- **5. Implementation and risks**
  - Enrollment, fraud, communication, the technology to support new fares

Top candidates say early that **the right answer may lose a little revenue** — the question is whether the ridership and fairness gains are worth the cost.

## Math walkthrough

> **Ask:** Using the exhibits, compare a flat {{new_fare}} fare (Option A) with a {{new_fare}} standard fare plus a {{disc_fare}} low-income fare (Option B) on ridership, fairness and budget.

**1. Today (Exhibit 1).** Fare revenue = 50M × $2.00 = **{{fare_rev}}**, covering **{{farebox}}** of the {{op_cost}} operating cost; the subsidy is ($400M − $100M) ÷ 50M = **{{subsidy_per_ride}}** per ride.
Rides split into **{{rides_low}}** by low-income riders and **{{rides_other}}** by others.

**2. Elasticities (Exhibit 2).** Low-income: −12% ÷ 20% = **{{elast_low}}**. Others: −4% ÷ 20% = **{{elast_other}}**.

**3. Option A — {{new_fare}} for everyone.** The fare rises ($2.50 − $2.00) ÷ $2.00 = **{{fare_chg_a}}**.
- Low-income rides: 20M × (1 − 0.6 × 25%) = **{{a_rides_low}}**
- Other rides: 30M × (1 − 0.2 × 25%) = **{{a_rides_other}}**
- Total **{{a_rides}}**: the system loses **{{a_rides_lost}}** ({{a_drop_pct}}), and {{a_low_lost_share}} of the lost rides belong to low-income riders.
- Revenue = 45.5M × $2.50 = **{{a_rev}}**, a gain of **{{a_rev_gain}}**.

Option A raises money but fails two of the three goals.

**4. Option B — {{new_fare}} standard, {{disc_fare}} low-income.** The low-income fare changes by ($1.00 − $2.00) ÷ $2.00 = **{{disc_chg}}**.
- Low-income rides: 20M × (1 + 0.6 × 50%) = **{{b_rides_low}}**
- Other rides: same as Option A, **{{a_rides_other}}**
- Total **{{b_rides}}**: ridership grows by **{{b_rides_added}}** ({{b_gain_pct}}).
- Revenue = 26M × $1.00 + 28.5M × $2.50 = {{b_rev_low}} + {{b_rev_other}} = **{{b_rev}}**.
- Net cost = $100M − $97.25M + $1.5M enrollment = **{{b_net_cost}}** a year — inside the {{tolerance}} limit, with {{b_headroom}} to spare.

**5. Value for money.** Option B costs $4.25M ÷ 4.5M ≈ **{{cost_per_added_ride}}** per added ride, against an average subsidy of {{subsidy_per_ride}} per ride today. Because the system has spare capacity, those extra rides are very cheap to carry.

*Note:* Option A's ride loss and Option B's ride gain happen to be the same size — a coincidence of these numbers, not a rule.

## Synthesis

> **Ask:** What do you recommend to the general manager and the council?

**Harlow Bay should raise the standard fare to {{new_fare}} and introduce a {{disc_fare}} fare for enrolled low-income riders: ridership grows {{b_gain_pct}} for a net cost of {{b_net_cost}} a year, within the council's limit of {{tolerance}}.**

1. **It meets all three goals:** more riders, lower fares for the residents who depend on transit most, and a budget impact the council has already accepted.
2. **A flat increase backfires:** it would raise {{a_rev_gain}} but lose {{a_rides_lost}} — {{a_drop_pct}} of ridership — with {{a_low_lost_share}} of the lost rides coming from low-income riders.
3. **The extra rides are good value:** about {{cost_per_added_ride}} of budget per added ride, against {{subsidy_per_ride}} of subsidy per ride today.

**Risks and next steps:** the estimates use elasticities from one peer city and a large fare cut, so treat them as a range; if fewer eligible riders enroll, both the cost and the ridership gain shrink. Make enrollment automatic for residents already receiving benefits, add fare capping so frequent riders never pay more than a monthly pass, and review the results after twelve months.

## Common mistakes

- Treating the objective as revenue. A public agency's goal here is ridership and fairness, with revenue as a constraint.
- Using one average elasticity for all riders, which hides who bears the cost of a fare increase.
- Forgetting that a discount changes the **fare paid** by a large percentage ({{disc_chg}}), so the response is large too.
- Ignoring the cost of running the discount program ({{admin_cost}}) and the enrollment challenge.

## What top candidates do differently

- Restate the three objectives and use them as a scorecard for each option.
- Compute cost per added ride and compare it with today's subsidy per ride — a powerful way to show the discount is value for money.
- Note that elasticity estimates are less reliable for large price changes, and suggest a pilot.
- Mention non-price levers: frequency and reliability often move ridership more than fares.

## Creative question

Beyond fares, how could Harlow Bay grow ridership over the next three years?

## Model answer

A strong answer groups ideas around what riders care about:

- **Frequency and reliability:** buses every 10–15 minutes on the busiest corridors, bus-only lanes and traffic-signal priority so buses are not stuck in traffic.
- **Ease of use:** tap-to-pay with a bank card or phone, real-time arrival information, simple route maps.
- **Safety and comfort:** better-lit stops with shelters, staff presence on late-night routes.
- **Partnerships:** employer and university pass programs, where the institution pays a flat fee and everyone rides.

A top candidate prioritizes: "Frequency on the top corridors first — it is usually the single biggest driver of ridership, and it helps every rider, whatever fare they pay."
