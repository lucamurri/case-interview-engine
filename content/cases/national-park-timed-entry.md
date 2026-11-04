---
id: national-park-timed-entry
title: "Book Your Slot: Timed Entry at a Crowded National Park"
client: "Ridgeback Canyon National Park (fictional), a busy mountain park run by a national parks agency"
summary: "A national park is jammed at midday and short of money for repairs. A timed-entry reservation with a peak-hour fee can spread visitors through the day, but the fee that raises the most money is not the right one."
industry: public-sector
sub_industry: "Public sector / Parks"
type: pricing
difficulty: beginner
format: candidate-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real park or agency data.
inputs:
  season_days:   { value: 100,  unit: "days",     label: "Days in the peak season" }
  peak_demand:   { value: 2000, unit: "vehicles", label: "Vehicles wanting to enter in the peak slot (9 a.m.–2 p.m.) on a peak-season day" }
  peak_cap:      { value: 1500, unit: "vehicles", label: "Vehicles the park can take in the peak slot (parking and road capacity)" }
  early_demand:  { value: 500,  unit: "vehicles", label: "Vehicles entering in the early slot (6–9 a.m.)" }
  early_cap:     { value: 900,  unit: "vehicles", label: "Capacity of the early slot" }
  late_demand:   { value: 700,  unit: "vehicles", label: "Vehicles entering in the late slot (2–6 p.m.)" }
  late_cap:      { value: 900,  unit: "vehicles", label: "Capacity of the late slot" }
  entry_fee:     { value: 30,   unit: "$",        label: "Entrance fee per vehicle today (all slots)" }
  fee_low:       { value: 15,   unit: "$",        label: "Peak-slot reservation fee, option A" }
  shift_low:     { value: 0.25, unit: "%",        label: "Share of peak visitors who move to another slot at the option A fee" }
  drop_low:      { value: 0.05, unit: "%",        label: "Share of peak visitors who don't come at all at the option A fee" }
  fee_high:      { value: 25,   unit: "$",        label: "Peak-slot reservation fee, option B" }
  shift_high:    { value: 0.35, unit: "%",        label: "Share of peak visitors who move to another slot at the option B fee" }
  drop_high:     { value: 0.10, unit: "%",        label: "Share of peak visitors who don't come at all at the option B fee" }
  system_cost:   { value: 0.4,  unit: "$M",       label: "Annual cost of running the reservation system (software, staff, call center)", decimals: 1 }
  maint_target:  { value: 1.0,  unit: "$M",       label: "Extra money for maintenance the park wants each year", decimals: 1 }

calculations:
  # --- The problem ---
  - { id: peak_excess, label: "Peak-slot demand above capacity, per day", formula: "peak_demand - peak_cap", expected: 500, unit: "vehicles" }
  - { id: offpeak_room, label: "Spare capacity in the early and late slots, per day", formula: "(early_cap - early_demand) + (late_cap - late_demand)", expected: 600, unit: "vehicles" }
  # --- Option A ---
  - { id: shift_a, label: "Peak visitors who move to another slot, option A", formula: "peak_demand * shift_low", expected: 500, unit: "vehicles" }
  - { id: drop_a, label: "Peak visitors who stay away, option A", formula: "peak_demand * drop_low", expected: 100, unit: "vehicles" }
  - { id: peak_a, label: "Peak-slot vehicles, option A", formula: "peak_demand - shift_a - drop_a", expected: 1400, unit: "vehicles" }
  - { id: offpeak_left_a, label: "Spare off-peak capacity left, option A", formula: "offpeak_room - shift_a", expected: 100, unit: "vehicles" }
  - { id: fee_rev_a, label: "Peak-fee revenue per season, option A", formula: "peak_a * fee_low * season_days / 1000000", expected: 2.1, unit: "$M", decimals: 1 }
  - { id: lost_entry_a, label: "Entrance fees lost from visitors who stay away, option A", formula: "drop_a * entry_fee * season_days / 1000000", expected: 0.3, unit: "$M", decimals: 1 }
  - { id: net_a, label: "Net money for maintenance, option A", formula: "fee_rev_a - lost_entry_a - system_cost", expected: 1.4, unit: "$M", decimals: 1 }
  - { id: cushion_a, label: "Amount above the maintenance target, option A", formula: "net_a - maint_target", expected: 0.4, unit: "$M", decimals: 1 }
  # --- Option B ---
  - { id: shift_b, label: "Peak visitors who move to another slot, option B", formula: "peak_demand * shift_high", expected: 700, unit: "vehicles" }
  - { id: drop_b, label: "Peak visitors who stay away, option B", formula: "peak_demand * drop_high", expected: 200, unit: "vehicles" }
  - { id: peak_b, label: "Peak-slot vehicles, option B", formula: "peak_demand - shift_b - drop_b", expected: 1100, unit: "vehicles" }
  - { id: empty_b, label: "Unused peak-slot capacity, option B", formula: "peak_cap - peak_b", expected: 400, unit: "vehicles" }
  - { id: offpeak_over_b, label: "Visitors a day who want to move but find the early and late slots full, option B", formula: "shift_b - offpeak_room", expected: 100, unit: "vehicles" }
  - { id: fee_rev_b, label: "Peak-fee revenue per season, option B", formula: "peak_b * fee_high * season_days / 1000000", expected: 2.75, unit: "$M", decimals: 2 }
  - { id: lost_entry_b, label: "Entrance fees lost from visitors who stay away, option B", formula: "drop_b * entry_fee * season_days / 1000000", expected: 0.6, unit: "$M", decimals: 1 }
  - { id: net_b, label: "Net money for maintenance, option B", formula: "fee_rev_b - lost_entry_b - system_cost", expected: 1.75, unit: "$M", decimals: 2 }
  - { id: extra_b, label: "Extra net money from option B", formula: "net_b - net_a", expected: 0.35, unit: "$M", decimals: 2 }
  - { id: season_lost_a, label: "Vehicle visits lost per season, option A", formula: "drop_a * season_days", expected: 10000, unit: "vehicle visits" }
  - { id: season_lost_b, label: "Vehicle visits lost per season, option B", formula: "drop_b * season_days", expected: 20000, unit: "vehicle visits" }

answer:
  calc: net_a
  headline: "Charge a {{fee_low}} peak-slot fee: it brings the peak down to {{peak_a}} against capacity of {{peak_cap}}, the visitors who move fit into the quieter slots, and it raises {{net_a}} a year for maintenance, above the {{maint_target}} target. The {{fee_high}} fee nets only {{extra_b}} more, asks more visitors to move than the quieter slots can hold, and leaves {{empty_b}} of peak capacity unused."

exhibits:
  - id: exhibit-1
    title: "Vehicles wanting to enter Ridgeback Canyon on a peak-season day, by time slot"
    kind: table
    ask: "Here is demand and capacity by time slot on a typical summer day. Where is the problem?"
    columns: ["Time slot", "Vehicles wanting to enter", "Capacity"]
    rows:
      - ["Early (6–9 a.m.)", "{{early_demand}}", "{{early_cap}}"]
      - ["Peak (9 a.m.–2 p.m.)", "{{peak_demand}}", "{{peak_cap}}"]
      - ["Late (2–6 p.m.)", "{{late_demand}}", "{{late_cap}}"]
    note: "Illustrative data created for this practice case. Ridgeback Canyon is fictional. Capacity is set by parking and road space; above it, rangers close the gate and cars queue on the highway."
    insight: |
      The park is not full all day: it is full at midday. The peak is
      {{peak_excess}} over capacity, while the early and late slots have
      {{offpeak_room}} of spare room, more than the excess.
  - id: exhibit-2
    title: "Visitor survey: response to a peak-slot reservation fee"
    kind: table
    ask: "The park surveyed visitors about two peak-slot fees. What happens at each?"
    columns: ["Peak-slot fee (on top of the entrance fee)", "Move to an early or late slot", "Don't come at all"]
    rows:
      - ["Option A: {{fee_low}}", "{{shift_low}}", "{{drop_low}}"]
      - ["Option B: {{fee_high}}", "{{shift_high}}", "{{drop_high}}"]
    note: "Illustrative data created for this practice case, based on a survey of summer visitors. Shares are of vehicles that would otherwise enter at peak. Reservations for the early and late slots are free."
    insight: |
      Both fees bring the peak under capacity. The higher fee pushes more
      visitors into the other slots than they can hold, and keeps twice as
      many away.
---

## Prompt

Our client is Ridgeback Canyon National Park, one of the most visited mountain parks in the country. On summer days, cars queue for an hour at the entrance by mid-morning, rangers close the gate when the parking areas fill, and trails and viewpoints are crowded. At the same time, the park has a long list of repairs it cannot afford: trails, restrooms and a visitor center roof.

The superintendent is considering a **timed-entry reservation**: visitors book a time slot in advance, and the busy midday slot carries an extra fee. She asks us: **should the park charge a peak-slot fee, and how much?**

## Clarifying information

- Q: What is the objective?
  A: Two things: keep peak-slot visits within capacity, and raise at least **{{maint_target}}** a year of extra money for maintenance. The park is not trying to maximize revenue, and it wants to keep the park open to as many visitors as possible.
- Q: Does the park keep the money it raises?
  A: US parks usually keep most, but not all, of the fees they collect. For this case, assume the agency has agreed that the park keeps all its fee revenue, including entrance fees, and spends the net gain on its repair list.
- Q: What do visitors pay today?
  A: An entrance fee of **{{entry_fee}}** per vehicle, whatever the time of day. There is no reservation today. For simplicity, assume every vehicle pays the fee, and ignore annual passes.
- Q: How long is the busy season?
  A: About **{{season_days}}** a year. Outside the season, the park rarely fills, so the reservation would apply only in the peak season.
- Q: What does a reservation system cost to run?
  A: About **{{system_cost}}** a year, covering the booking software, a call center and staff at the gate.
- Q: Will the reservation cover all time slots?
  A: Yes, every slot needs a booking, so the park can cap each one, but only the peak slot carries a fee. Early and late bookings are free.
- Q: Do we know how visitors would react to a fee?
  A: Yes, the park ran a visitor survey with two fee levels (Exhibit 2).

## Structure

> **Ask:** The candidate should build the structure around the park's two goals, crowding and maintenance money, not around maximizing revenue.

- **1. Size the crowding problem**
  - Peak demand versus peak capacity
  - Spare room in the early and late slots
- **2. For each fee option: where do visitors go?**
  - Stay at peak, move to another slot, or stay away
  - Does the peak fit? Do the other slots still fit?
- **3. For each fee option: money for maintenance**
  - Peak-fee revenue = Peak vehicles × Fee × Season days
  - − Entrance fees lost from visitors who stay away
  - − Cost of running the reservation system
- **4. Compare against the objective**
  - Crowding, money, and how many visitors are turned away

Hypothesis: *"A modest fee should move enough visitors out of midday to fit capacity. A higher fee raises more money but turns more people away, which works against the park's purpose."*

## Math walkthrough

> **Ask:** The candidate should check both fee options against both goals, using Exhibits 1 and 2 and the clarifying information.

**1. The problem (Exhibit 1).**
Peak excess: 2,000 − 1,500 = **{{peak_excess}}** a day.
Spare room in the other slots: (900 − 500) + (900 − 700) = **{{offpeak_room}}**.

**2. Option A: {{fee_low}}.**
Move to another slot: 2,000 × 25% = **{{shift_a}}**. Stay away: 2,000 × 5% = **{{drop_a}}**.
Peak: 2,000 − 500 − 100 = **{{peak_a}}**, under the capacity of {{peak_cap}}. The early and late slots still have {{offpeak_left_a}} to spare.
Money: 1,400 × $15 × 100 days = **{{fee_rev_a}}** of fees, less 100 × $30 × 100 days = **{{lost_entry_a}}** of lost entrance fees, less the {{system_cost}} system cost = **{{net_a}}** a year, **{{cushion_a}}** above the target.

**3. Option B: {{fee_high}}.**
Move: 2,000 × 35% = **{{shift_b}}**. Stay away: 2,000 × 10% = **{{drop_b}}**.
Peak: 2,000 − 700 − 200 = **{{peak_b}}**, leaving **{{empty_b}}** of peak capacity unused every day. The {{shift_b}} that want to move are more than the {{offpeak_room}} of spare room. Because every slot is capped, the early and late slots sell out and **{{offpeak_over_b}}** a day find no slot: they either book midday after all or don't come.
Money: 1,100 × $25 × 100 days = **{{fee_rev_b}}**, less 200 × $30 × 100 days = **{{lost_entry_b}}**, less $0.4M = **{{net_b}}** a year.

**4. Compare.**

| Measure | Option A: {{fee_low}} | Option B: {{fee_high}} |
|---|---|---|
| Peak slot | {{peak_a}}, within capacity | {{peak_b}}, {{empty_b}} of capacity unused |
| Early and late slots | Fit, {{offpeak_left_a}} to spare | Sold out; {{offpeak_over_b}} a day find no slot |
| Vehicle visits lost per season | {{season_lost_a}} | {{season_lost_b}} |
| Net money for maintenance | {{net_a}} | {{net_b}} |
| Meets the objective? | Yes | No: it turns away visitors the park has room for |

Option B raises only **{{extra_b}}** more, turns away twice as many visitors and leaves {{empty_b}} of midday capacity empty every day. The park's objective is to stay open to as many visitors as possible, so the extra money is not worth it.

## Synthesis

> **Ask:** The candidate should give the superintendent a clear recommendation tied to both goals.

**Ridgeback Canyon should launch timed entry with a {{fee_low}} peak-slot fee. It brings the midday peak down to {{peak_a}} against capacity of {{peak_cap}}, the visitors who move fit into the early and late slots, and it raises {{net_a}} a year for maintenance, above the {{maint_target}} target.**

1. **The problem is midday, not the whole day:** the peak is {{peak_excess}} over capacity, while the early and late slots have {{offpeak_room}} of spare room. A fee only needs to move visitors a few hours.
2. **The lower fee meets both goals:** the peak fits with {{offpeak_left_a}} of room left in the quieter slots, and only {{drop_a}} a day stay away.
3. **The higher fee is the wrong trade:** it nets just {{extra_b}} more, but {{offpeak_over_b}} a day who want to move find the early and late slots full, {{empty_b}} of midday capacity sit unused, and it turns away {{season_lost_b}} a season, twice as many as option A.

**Risks and next steps:** survey answers often overstate how flexible people are, so if fewer visitors move, the peak cap still protects the park but more visitors will find midday sold out; watch the booking data in the first weeks. Keep some same-day slots for local residents and visitors who cannot plan ahead, and consider a reduced fee for low-income visitors so the fee does not price families out. Publish the repair list the money pays for, so visitors see what the fee buys, and review the fee after the first season.

## Common mistakes

- Picking the fee that raises the most revenue. The objective is crowding and maintenance money, not revenue.
- Checking only the peak slot and missing that option B asks more visitors to move than the early and late slots can hold.
- Counting peak-fee revenue as money for repairs without subtracting the entrance fees lost and the cost of the reservation system.
- Forgetting that the reservation applies only in the {{season_days}} of the peak season, and multiplying by 365 days.

## What top candidates do differently

- Spot from Exhibit 1 that the park has spare room early and late, so the job is to move visitors, not to turn them away.
- Check every slot, not just the peak, under each option.
- Point out that the cap, not the fee, guarantees the peak never overflows; the fee decides who moves and how much money is raised.
- Raise fairness: a fee can price out lower-income visitors, so suggest same-day slots or discounts.

## Creative question

Besides a peak-slot fee, how could the park reduce midday crowding?

## Model answer

Organize ideas around **when, how and where people visit**:

- **When:** early-bird perks such as ranger talks or guided walks at 7 a.m.; free early and late parking; publicize sunset and sunrise viewpoints.
- **How:** a shuttle bus from a parking area outside the park, so more visitors fit without more cars; discounts for full cars; bike access.
- **Where:** promote less-visited trails and areas of the park; real-time crowding information on the park's website and signs at the entrance.

A top candidate prioritizes: "A shuttle bus is the most powerful, because capacity is set by parking, not by the trails. Moving people by bus raises the number of visitors the park can welcome at midday without building anything inside the park."
