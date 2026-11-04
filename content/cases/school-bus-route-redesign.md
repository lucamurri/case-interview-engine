---
id: school-bus-route-redesign
title: "Staggering the Bells: Fixing a School District's Bus Shortage"
client: "Maple Ridge Unified School District (fictional), a suburban US school district with 16,000 bus riders"
summary: "A school district is short of bus drivers and over budget because every school starts at the same time. Staggered bell times let each bus run several routes, but the cheapest plan puts teenagers on buses before dawn."
industry: public-sector
sub_industry: "Public sector / K-12 education"
type: operations
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real district data.
inputs:
  routes_el:      { value: 120,   unit: "routes",   label: "Bus routes serving elementary schools" }
  routes_mid:     { value: 60,    unit: "routes",   label: "Bus routes serving middle schools" }
  routes_hs:      { value: 60,    unit: "routes",   label: "Bus routes serving high schools" }
  spare:          { value: 0.10,  unit: "%",        label: "Spare buses and substitute drivers, on top of the buses running routes" }
  bus_cost:       { value: 25,    unit: "$K",       label: "Annual cost per bus (lease, insurance and fixed maintenance)" }
  driver_cost:    { value: 50,    unit: "$K",       label: "Annual cost per driver (pay and benefits for one morning and one afternoon run)" }
  extra_cost:     { value: 12.5,  unit: "$K",       label: "Added annual cost when a bus and driver take on one more route (driver hours and fuel between schools)", decimals: 1 }
  run_cost:       { value: 15,    unit: "$K",       label: "Running cost per route per year (fuel and mileage-based maintenance)" }
  drivers_staff:  { value: 198,   unit: "drivers",  label: "Drivers on staff today" }
  leavers:        { value: 66,    unit: "drivers",  label: "Drivers who leave each year through normal turnover" }
  budget:         { value: 17,    unit: "$M",       label: "Transportation budget the board has set for next year" }
  riders:         { value: 16000, unit: "students", label: "Students who ride the bus" }
  long_today:     { value: 320,   unit: "students", label: "Students riding more than 45 minutes each way, today" }
  long_3:         { value: 2400,  unit: "students", label: "Students riding more than 45 minutes each way, three-tier plan" }
  long_2:         { value: 640,   unit: "students", label: "Students riding more than 45 minutes each way, two-tier plan" }
  ontime_today:   { value: 0.85,  unit: "%",        label: "Buses arriving on time, today" }
  ontime_3:       { value: 0.90,  unit: "%",        label: "Buses arriving on time, three-tier plan (routing software estimate)" }
  ontime_2:       { value: 0.97,  unit: "%",        label: "Buses arriving on time, two-tier plan (routing software estimate)" }

calculations:
  # --- Today: one bell time, one route per bus ---
  - { id: routes, label: "Bus routes in total", formula: "routes_el + routes_mid + routes_hs", expected: 240, unit: "routes" }
  - { id: buses_today, label: "Buses and drivers needed today (one route each, plus spares)", formula: "routes * (1 + spare)", expected: 264, unit: "buses" }
  - { id: short_today, label: "Driver shortage today", formula: "buses_today - drivers_staff", expected: 66, unit: "drivers" }
  - { id: bus_today, label: "Bus cost today", formula: "buses_today * bus_cost / 1000", expected: 6.6, unit: "$M", decimals: 1 }
  - { id: driver_today, label: "Driver cost today", formula: "buses_today * driver_cost / 1000", expected: 13.2, unit: "$M", decimals: 1 }
  - { id: run_total, label: "Route running cost (the same in every plan)", formula: "routes * run_cost / 1000", expected: 3.6, unit: "$M", decimals: 1 }
  - { id: cost_today, label: "Transportation cost today", formula: "bus_today + driver_today + run_total", expected: 23.4, unit: "$M", decimals: 1 }
  - { id: over_today, label: "Amount today's cost is over next year's budget", formula: "cost_today - budget", expected: 6.4, unit: "$M", decimals: 1 }
  # --- Three equal tiers ---
  - { id: tier_3, label: "Routes per tier with three equal tiers", formula: "routes / 3", expected: 80, unit: "routes" }
  - { id: buses_3, label: "Buses and drivers needed, three tiers", formula: "tier_3 * (1 + spare)", expected: 88, unit: "buses" }
  - { id: extra_3, label: "Extra routes run by buses already in service, three tiers", formula: "routes - tier_3", expected: 160, unit: "routes" }
  - { id: cost_3, label: "Transportation cost, three tiers", formula: "buses_3 * (bus_cost + driver_cost) / 1000 + extra_3 * extra_cost / 1000 + run_total", expected: 12.2, unit: "$M", decimals: 1 }
  - { id: save_3, label: "Annual saving, three tiers", formula: "cost_today - cost_3", expected: 11.2, unit: "$M", decimals: 1 }
  # --- Two tiers: elementary first, middle and high later ---
  - { id: tier_2, label: "Routes in the larger tier with two tiers", formula: "max(routes_el, routes_mid + routes_hs)", expected: 120, unit: "routes" }
  - { id: buses_2, label: "Buses and drivers needed, two tiers", formula: "tier_2 * (1 + spare)", expected: 132, unit: "buses" }
  - { id: extra_2, label: "Extra routes run by buses already in service, two tiers", formula: "routes - tier_2", expected: 120, unit: "routes" }
  - { id: cost_2, label: "Transportation cost, two tiers", formula: "buses_2 * (bus_cost + driver_cost) / 1000 + extra_2 * extra_cost / 1000 + run_total", expected: 15.0, unit: "$M", decimals: 1 }
  - { id: save_2, label: "Annual saving, two tiers", formula: "cost_today - cost_2", expected: 8.4, unit: "$M", decimals: 1 }
  - { id: save_2_pct, label: "Saving as a share of today's cost, two tiers", formula: "save_2 / cost_today", expected: 0.359, unit: "%", decimals: 0 }
  - { id: room_2, label: "Room under next year's budget, two tiers", formula: "budget - cost_2", expected: 2.0, unit: "$M", decimals: 1 }
  - { id: extra_save_3, label: "Extra saving from a third tier", formula: "cost_2 - cost_3", expected: 2.8, unit: "$M", decimals: 1 }
  # --- Getting there: drivers and year one ---
  - { id: drivers_2, label: "Drivers needed, two tiers", formula: "buses_2", expected: 132, unit: "drivers" }
  - { id: surplus_2, label: "Staff drivers above the two-tier need", formula: "drivers_staff - buses_2", expected: 66, unit: "drivers" }
  - { id: years_2, label: "Years for turnover to absorb the surplus, two tiers", formula: "surplus_2 / leavers", expected: 1.0, unit: "years", decimals: 1 }
  - { id: surplus_3, label: "Staff drivers above the three-tier need", formula: "drivers_staff - buses_3", expected: 110, unit: "drivers" }
  - { id: years_3, label: "Years for turnover to absorb the surplus, three tiers", formula: "surplus_3 / leavers", expected: 1.67, unit: "years", decimals: 1 }
  - { id: surplus_cost_y1, label: "Year-one cost of surplus drivers, two tiers (half the surplus on payroll on average)", formula: "surplus_2 / 2 * driver_cost / 1000", expected: 1.65, unit: "$M", decimals: 2 }
  - { id: year1_cost_2, label: "Year-one transportation cost, two tiers", formula: "cost_2 + surplus_cost_y1", expected: 16.65, unit: "$M", decimals: 2 }
  - { id: year1_room_2, label: "Room under the budget in year one, two tiers", formula: "budget - year1_cost_2", expected: 0.35, unit: "$M", decimals: 2 }
  # --- Service (Exhibit 2) ---
  - { id: long_share_today, label: "Share of riders over 45 minutes, today", formula: "long_today / riders", expected: 0.02, unit: "%" }
  - { id: long_share_3, label: "Share of riders over 45 minutes, three tiers", formula: "long_3 / riders", expected: 0.15, unit: "%" }
  - { id: long_share_2, label: "Share of riders over 45 minutes, two tiers", formula: "long_2 / riders", expected: 0.04, unit: "%" }

answer:
  calc: save_2
  headline: "Move to two bell times, elementary first and middle and high schools later: {{buses_2}} instead of {{buses_today}} cuts cost by {{save_2}} to {{cost_2}}, under the {{budget}} budget, while a third tier would save {{extra_save_3}} more but start high schools at 7:10 and leave {{long_share_3}} of riders on the bus for over 45 minutes."

exhibits:
  - id: exhibit-1
    title: "Maple Ridge bus routes, fleet and costs"
    kind: table
    ask: "Today every school starts at 8:15, so each bus runs one route in the morning and one in the afternoon. Here are the routes and costs. What does today's system cost, and what would staggered bell times save?"
    columns: ["Item", "Value"]
    rows:
      - ["Routes serving elementary schools", "{{routes_el}}"]
      - ["Routes serving middle schools", "{{routes_mid}}"]
      - ["Routes serving high schools", "{{routes_hs}}"]
      - ["Spare buses and substitute drivers (share of buses running routes)", "{{spare}}"]
      - ["Cost per bus per year (lease, insurance, fixed maintenance)", "{{bus_cost}}"]
      - ["Cost per driver per year (one morning and one afternoon run)", "{{driver_cost}}"]
      - ["Added cost per year for each extra route a bus and driver run", "{{extra_cost}}"]
      - ["Running cost per route per year (fuel, mileage-based maintenance)", "{{run_cost}}"]
      - ["Drivers on staff", "{{drivers_staff}}"]
      - ["Drivers who leave each year (normal turnover)", "{{leavers}}"]
    note: "Illustrative data created for this practice case. Maple Ridge is fictional. The district leases its buses on contracts it can end as buses are no longer needed. The routes stay the same under any bell schedule; only which bus runs them changes."
    insight: |
      The fleet is sized for the busiest moment of the day. With one bell
      time, all {{routes}} run at once, so the district needs
      {{buses_today}}. With staggered bells, it needs only enough buses for
      the largest tier.
  - id: exhibit-2
    title: "Routing software results for the two bell-time plans"
    kind: table
    ask: "The routing software has tested both schedules. Here is what it found. Does this change your recommendation?"
    columns: ["Measure", "Today", "Three tiers", "Two tiers"]
    rows:
      - ["Bell times", "All schools 8:15", "High 7:10, middle 7:55, elementary 8:40 (some elementary schools in each tier)", "Elementary 7:50, middle and high 8:40"]
      - ["First high school pickup", "7:20", "6:10", "7:45"]
      - ["Students riding more than 45 minutes each way", "{{long_today}}", "{{long_3}}", "{{long_2}}"]
      - ["Buses arriving on time", "{{ontime_today}}", "{{ontime_3}}", "{{ontime_2}}"]
    note: "Illustrative data created for this practice case. {{riders}} ride the bus. Three tiers leave about 45 minutes between bells, so the software stretches some routes and a late first run delays the next two. Pediatric health groups recommend that middle and high schools start at 8:30 a.m. or later, because teenagers' sleep cycles shift later; in a district survey, most high school parents opposed any start before 8:00."
    insight: |
      The cheapest plan fails on service: {{long_share_3}} of riders would
      be on the bus for more than 45 minutes, and high school students would
      be picked up at 6:10. Two tiers keep long rides to {{long_share_2}} of
      riders, up from {{long_share_today}} today but far below three tiers,
      and put teenagers on the later bell.
---

## Prompt

Our client is Maple Ridge Unified, a suburban school district that buses {{riders}} to its elementary, middle and high schools. Every school starts at the same time, 8:15, and the district cannot hire enough bus drivers to cover all its routes. It fills the gap with drivers from a private contractor and by doubling up routes, where one bus runs two routes back to back, so about one bus in seven arrives late.

Transportation is also the district's fastest-growing cost. The school board has set a budget of **{{budget}}** for next year. The superintendent asks us: **how can the district get students to school on time within that budget?**

## Clarifying information

- Q: What is the objective?
  A: Cover every route on time and bring transportation cost within the {{budget}} budget next year. The district is not trying to make money; any saving goes back into classrooms.
- Q: What does the district spend today?
  A: About what it would cost to run every route fully staffed. Contracted drivers cost about the same per driver as staff drivers.
- Q: Can the district change bell times?
  A: Yes. The board sets bell times, and it is open to staggering them if the plan works for families.
- Q: Can it simply pay drivers more to fill the gap?
  A: It has raised pay twice in three years. The shortage is regional, and higher pay would add cost without fixing the budget.
- Q: Are there other constraints?
  A: The board's guideline is to keep rides under 45 minutes each way. A few hundred students on the district's outer edges already ride longer, and the board does not want that number to grow much. The board has also heard from parents about start times for teenagers.
- Q: Can the district cut drivers quickly if it needs fewer?
  A: It would rather not lay anyone off. It can stop hiring and let normal turnover bring numbers down.

## Structure

> **Ask:** How would you approach this?

Treat it as a **capacity** problem: the fleet and driver team are sized for the busiest moment of the day, so the question is how to spread routes over more of the day.

- **1. Why today's system is expensive**
  - One bell time → every route runs at once → one bus and one driver per route
  - Cost = Buses × (Bus cost + Driver cost) + Route running cost
- **2. Staggered bell times**
  - Buses needed = Routes in the largest tier × (1 + Spares)
  - Added cost of the extra routes each bus runs (driver hours, fuel between schools)
  - Saving versus today; check against the {{budget}} budget
- **3. Service and families**
  - Ride times, on-time arrivals, early starts for teenagers, childcare for young children
- **4. Getting there**
  - Drivers needed versus drivers on staff; how long turnover takes; year-one cost

Hypothesis: *"Because every school starts together, the district needs a bus for every route. Two or three bell times could cut the fleet and driver team by half or more, which should also end the driver shortage."*

## Math walkthrough

> **Ask:** Using Exhibit 1, what does today's system cost, and what would three equal tiers and two tiers (elementary first, then middle and high schools together) cost? Then, using Exhibit 2, which plan should the district choose, and can it get there next year?

**1. Today.**
Routes: 120 + 60 + 60 = **{{routes}}**. With one bell time each needs its own bus: 240 × 1.1 = **{{buses_today}}**, and the district is **{{short_today}}** short.

| Cost line | Calculation | Today |
|---|---|---|
| Buses | 264 × $25K | {{bus_today}} |
| Drivers | 264 × $50K | {{driver_today}} |
| Route running cost | 240 × $15K | {{run_total}} |
| **Total** | | **{{cost_today}}** |

That is **{{over_today}}** over next year's budget.

**2. Three equal tiers.**
Routes per tier: 240 ÷ 3 = **{{tier_3}}**, so the district needs 80 × 1.1 = **{{buses_3}}**.
The other {{extra_3}} are run by buses already on the road, at $12.5K each.
Cost: 88 × ($25K + $50K) + 160 × $12.5K + $3.6M = **{{cost_3}}**, a saving of **{{save_3}}**.

**3. Two tiers.**
The larger tier has max(120, 60 + 60) = **{{tier_2}}**, so the district needs 120 × 1.1 = **{{buses_2}}**, and {{extra_2}} are second runs.
Cost: 132 × ($25K + $50K) + 120 × $12.5K + $3.6M = **{{cost_2}}**, a saving of **{{save_2}}** ({{save_2_pct}}), with **{{room_2}}** to spare under the budget.

| Plan | Buses and drivers | Cost | Saving |
|---|---|---|---|
| Today (one bell) | {{buses_today}} | {{cost_today}} | — |
| Three tiers | {{buses_3}} | {{cost_3}} | {{save_3}} |
| Two tiers | {{buses_2}} | {{cost_2}} | {{save_2}} |

A third tier saves only **{{extra_save_3}}** more than two.

**4. Service (Exhibit 2).**
Riders over 45 minutes: 2,400 ÷ 16,000 = **{{long_share_3}}** with three tiers, against 640 ÷ 16,000 = **{{long_share_2}}** with two tiers and **{{long_share_today}}** today.
Three tiers would also start high schools at 7:10 with first pickups at 6:10, against pediatric guidance and parents' wishes, and on-time arrivals reach only {{ontime_3}}, against {{ontime_2}} with two tiers. The two-tier plan puts middle and high schools at 8:40.

**5. Getting there next year.**
Two tiers need {{drivers_2}}; the district has {{drivers_staff}} on staff, so it ends all contracted work and still has **{{surplus_2}}** more than it needs. With {{leavers}} leaving each year, turnover absorbs them within about a year, with no layoffs.
In year one, about half that surplus is still on the payroll on average: 66 ÷ 2 × $50K = **{{surplus_cost_y1}}**, so year-one cost is $15.0M + $1.65M = **{{year1_cost_2}}**, only **{{year1_room_2}}** under the budget. The full saving arrives in year two.
Three tiers would leave {{surplus_3}} too many, which turnover takes about {{years_3}} to absorb.

## Synthesis

> **Ask:** What should the superintendent recommend to the board?

**Maple Ridge should move to two bell times, elementary schools at 7:50 and middle and high schools at 8:40. That needs {{buses_2}} instead of {{buses_today}}, ends the driver shortage and cuts cost by {{save_2}} a year to {{cost_2}}, within the {{budget}} budget.**

1. **The fleet is sized for one busy moment:** with every school starting at 8:15, each of the {{routes}} needs its own bus and driver. Staggering bells lets each bus run two routes.
2. **Two tiers meet both goals:** cost falls {{save_2_pct}}, the district needs fewer drivers than it has today, and the software expects {{ontime_2}} on-time arrivals, up from {{ontime_today}}.
3. **A third tier is not worth it:** it saves only {{extra_save_3}} more, but puts high school students on buses at 6:10, against pediatric guidance on teenagers' sleep, and leaves {{long_share_3}} of riders on the bus for more than 45 minutes, seven times today's share.

**Risks and next steps:** year one is tight. With surplus drivers leaving through turnover, cost is {{year1_cost_2}}, only {{year1_room_2}} under budget, so stop hiring now and end contracts first. Long rides still double, from {{long_share_today}} to {{long_share_2}} of riders, so ask the routing team to shorten the longest routes before the plan goes to the board. Young children will wait for buses earlier, in the dark in winter, so review stop locations and lighting, and work with after-school programs because elementary students finish earlier. Return surplus leased buses as contracts allow, publish the new bell times early so families can plan, and track on-time arrivals and ride times every month in the first term.

## Common mistakes

- Sizing the fleet on total routes divided by tiers without checking the split. The largest tier sets the fleet: two tiers work here because elementary routes equal middle and high routes combined.
- Forgetting the spare buses and substitute drivers, which every plan still needs.
- Forgetting that a bus running a second route still costs something: extra driver hours and fuel between schools.
- Counting route running costs as a saving. The same routes are driven in every plan.
- Recommending the cheapest plan without checking ride times, on-time arrivals and start times, which are part of the objective.
- Assuming the district can shed drivers overnight, and so overstating the year-one saving.

## What top candidates do differently

- Spot early that buses needed depend on the **largest tier**, not on the total number of routes.
- Show the marginal trade-off: the third tier saves {{extra_save_3}} but breaks the service guideline.
- Use the sleep research and the parent survey as part of the decision, not as an afterthought.
- Check how the plan gets from {{drivers_staff}} on staff to the {{drivers_2}} it needs, and say that year one is only just within budget.

## Creative question

Besides changing bell times, how else could Maple Ridge cut its bus costs or make its service more reliable?

## Model answer

Group ideas by **demand, routes and drivers**:

- **Demand:** check who actually rides each route and drop stops nobody uses; widen walk zones near schools where it is safe; offer more spaces in a family carpool program.
- **Routes:** combine routes for small specialized programs; use smaller vans for routes with few riders; share buses with neighboring districts for magnet and special-education routes.
- **Drivers:** offer full-day jobs by combining driving with other district work (maintenance, food service, aides), which makes the job more attractive; pay for commercial driver's license training in exchange for a commitment to stay.

A top candidate prioritizes: "Full-day jobs come first. The driver shortage is really a shortage of split-shift workers, and two tiers plus another role turns a part-time job into a full-time one, which is easier to fill."
