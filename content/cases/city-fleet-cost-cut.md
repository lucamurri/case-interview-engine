---
id: city-fleet-cost-cut
title: "Fewer Wheels: Cutting a City's Vehicle Fleet Budget"
client: "City of Larkfield (fictional), a mid-size US city with 1,200 vehicles"
summary: "A city must cut its fleet budget by 9%. Test right-sizing and a shared motor pool, longer replacement cycles and outsourcing maintenance, and spot which savings are real."
industry: public-sector
sub_industry: "Municipal operations"
type: cost-cutting
difficulty: beginner
format: candidate-led
time_minutes: 25

# All numbers are illustrative: realistic in shape, not real company data.
inputs:
  veh_police:     { value: 300,   unit: "vehicles", label: "Police vehicles" }
  veh_fire:       { value: 100,   unit: "vehicles", label: "Fire and EMS vehicles" }
  veh_pw:         { value: 350,   unit: "vehicles", label: "Public works vehicles" }
  veh_parks:      { value: 150,   unit: "vehicles", label: "Parks and recreation vehicles" }
  veh_admin:      { value: 300,   unit: "vehicles", label: "Administration and inspector vehicles" }
  under_pw:       { value: 20,    unit: "vehicles", label: "Public works vehicles driven under 3,000 miles a year" }
  under_parks:    { value: 40,    unit: "vehicles", label: "Parks vehicles driven under 3,000 miles a year" }
  under_admin:    { value: 160,   unit: "vehicles", label: "Administration vehicles driven under 3,000 miles a year" }
  light:          { value: 700,   unit: "vehicles", label: "Light-duty vehicles (sedans, SUVs, pickups) on a replacement cycle" }
  capital:        { value: 3500,  unit: "$", label: "Capital cost per vehicle per year (purchase net of resale, six-year cycle)" }
  ins:            { value: 1200,  unit: "$", label: "Insurance and registration per vehicle per year" }
  maint:          { value: 3400,  unit: "$", label: "In-house maintenance cost per vehicle per year (fully allocated)" }
  fuel:           { value: 4000,  unit: "$", label: "Fuel per vehicle per year" }
  pool_cars:      { value: 70,    unit: "vehicles", label: "Vehicles kept to form the shared motor pool" }
  software:       { value: 0.15,  unit: "$M", decimals: 2, label: "Booking system and pool management per year" }
  resale:         { value: 5500,  unit: "$", label: "Sale price per surplus vehicle (one time)" }
  price:          { value: 30000, unit: "$", label: "Purchase price of a light-duty vehicle" }
  y6:             { value: 6,     unit: "years", label: "Current replacement cycle" }
  y8:             { value: 8,     unit: "years", label: "Longer replacement cycle under test" }
  y10:            { value: 10,    unit: "years", label: "Longest replacement cycle under test" }
  r6:             { value: 9000,  unit: "$", label: "Resale value after six years" }
  r8:             { value: 6000,  unit: "$", label: "Resale value after eight years" }
  r10:            { value: 3000,  unit: "$", label: "Resale value after ten years" }
  m6:             { value: 3000,  unit: "$", label: "Average annual maintenance on a six-year cycle (light-duty)" }
  m8:             { value: 3300,  unit: "$", label: "Average annual maintenance on an eight-year cycle (light-duty)" }
  m10:            { value: 4300,  unit: "$", label: "Average annual maintenance on a ten-year cycle (light-duty)" }
  oh:             { value: 750,   unit: "$", label: "Garage overhead included in maintenance cost per vehicle per year" }
  vendor:         { value: 2900,  unit: "$", label: "Outside vendor's price per light-duty vehicle per year" }
  garages:        { value: 3,     unit: "garages", label: "City garages today" }
  gar_extra:      { value: 0.05,  unit: "$M", decimals: 2, label: "Extra travel and handling cost per year if one garage closes" }
  gar_one:        { value: 0.4,   unit: "$M", label: "One-time cost to close one garage" }
  target_pct:     { value: 0.09,  unit: "%", label: "Required cut in the fleet budget" }

calculations:
  - { id: total_veh, label: "Vehicles in the fleet", formula: "veh_police + veh_fire + veh_pw + veh_parks + veh_admin", expected: 1200, unit: "vehicles" }
  - { id: under, label: "Under-used vehicles", formula: "under_pw + under_parks + under_admin", expected: 220, unit: "vehicles" }
  - { id: under_pct, label: "Share of the fleet that is under-used", formula: "under / total_veh", expected: 0.1833, unit: "%", decimals: 0 }
  - { id: budget, label: "Annual fleet budget", formula: "total_veh * (capital + ins + maint + fuel) / 1000000", expected: 14.52, unit: "$M", decimals: 2 }
  - { id: target, label: "Savings required", formula: "budget * target_pct", expected: 1.3068, unit: "$M", decimals: 2 }
  # --- Right-sizing and pool ---
  - { id: avoid, label: "Cost avoided per vehicle removed (excluding fuel)", formula: "capital + ins + maint", expected: 8100, unit: "$" }
  - { id: removed, label: "Vehicles removed after setting up the pool", formula: "under - pool_cars", expected: 150, unit: "vehicles" }
  - { id: rs_gross, label: "Gross saving from right-sizing", formula: "removed * avoid / 1000000", expected: 1.215, unit: "$M", decimals: 2 }
  - { id: rs_net, label: "Net saving after pool software", formula: "rs_gross - software", expected: 1.065, unit: "$M", decimals: 2 }
  - { id: sale, label: "One-time proceeds from selling surplus vehicles", formula: "removed * resale / 1000000", expected: 0.825, unit: "$M", decimals: 2 }
  # --- Replacement cycle ---
  - { id: dep6, label: "Annual capital cost, six-year cycle", formula: "(price - r6) / y6", expected: 3500, unit: "$" }
  - { id: dep8, label: "Annual capital cost, eight-year cycle", formula: "(price - r8) / y8", expected: 3000, unit: "$" }
  - { id: dep10, label: "Annual capital cost, ten-year cycle", formula: "(price - r10) / y10", expected: 2700, unit: "$" }
  - { id: tot6, label: "Capital plus maintenance, six-year cycle", formula: "dep6 + m6", expected: 6500, unit: "$" }
  - { id: tot8, label: "Capital plus maintenance, eight-year cycle", formula: "dep8 + m8", expected: 6300, unit: "$" }
  - { id: tot10, label: "Capital plus maintenance, ten-year cycle", formula: "dep10 + m10", expected: 7000, unit: "$" }
  - { id: naive_unit, label: "Purchase-only saving per vehicle per year on an eight-year cycle", formula: "price / y6 - price / y8", expected: 1250, unit: "$" }
  - { id: naive_cycle, label: "Saving if only purchases are counted", formula: "light * naive_unit / 1000000", expected: 0.875, unit: "$M", decimals: 2 }
  - { id: true_unit, label: "True saving per vehicle per year on an eight-year cycle", formula: "tot6 - tot8", expected: 200, unit: "$" }
  - { id: true_cycle, label: "True saving from the longer cycle", formula: "light * true_unit / 1000000", expected: 0.14, unit: "$M", decimals: 2 }
  - { id: worse10, label: "Extra cost per vehicle per year of a ten-year cycle versus six", formula: "tot10 - tot6", expected: 500, unit: "$" }
  # --- Maintenance: in-house vs outsourced ---
  - { id: alloc_saving, label: "Saving if outsourcing is judged on allocated cost", formula: "light * (maint - vendor) / 1000000", expected: 0.35, unit: "$M", decimals: 2 }
  - { id: var_cost, label: "Maintenance cost per vehicle that disappears if work leaves", formula: "maint - oh", expected: 2650, unit: "$" }
  - { id: avoid_saving, label: "Saving if outsourcing is judged on avoidable cost", formula: "light * (var_cost - vendor) / 1000000", expected: -0.175, unit: "$M", decimals: 2 }
  - { id: oh_total, label: "Total garage overhead", formula: "total_veh * oh / 1000000", expected: 0.9, unit: "$M", decimals: 2 }
  - { id: gar_per, label: "Overhead per garage", formula: "oh_total / garages", expected: 0.3, unit: "$M", decimals: 2 }
  - { id: gar_net, label: "Net saving from closing one garage", formula: "gar_per - gar_extra", expected: 0.25, unit: "$M", decimals: 2 }
  - { id: gar_payback, label: "Payback on closing one garage", formula: "gar_one / gar_net", expected: 1.6, unit: "years", decimals: 1 }
  # --- The plan ---
  - { id: plan, label: "Recommended plan: annual saving", formula: "rs_net + true_cycle + gar_net", expected: 1.455, unit: "$M", decimals: 2 }
  - { id: plan_pct, label: "Recommended plan as a share of the budget", formula: "plan / budget", expected: 0.1002, unit: "%", decimals: 1 }
  - { id: cushion, label: "Savings above target", formula: "plan - target", expected: 0.1482, unit: "$M", decimals: 2 }
  - { id: naive_plan, label: "Plan if purchase-only and allocated-cost savings were used", formula: "rs_net + naive_cycle + alloc_saving", expected: 2.29, unit: "$M", decimals: 2 }
  - { id: overstate, label: "How much that overstated the plan", formula: "naive_plan - plan", expected: 0.835, unit: "$M", decimals: 2 }
  - { id: fuel_total, label: "Annual fuel cost, left untouched by this plan", formula: "total_veh * fuel / 1000000", expected: 4.8, unit: "$M", decimals: 1 }

answer:
  calc: plan
  headline: "Right-size and pool, move light-duty vehicles to an eight-year cycle and close one garage: {{plan}} a year ({{plan_pct}} of the budget), just above the {{target}} target. Outsourcing maintenance costs more, not less."

exhibits:
  - id: exhibit-1
    title: "Larkfield's fleet by department"
    kind: table
    ask: "Here is the fleet. Where would you look first?"
    columns: ["Department", "Vehicles", "Driven under 3,000 miles a year", "Can join a shared pool?"]
    rows:
      - ["Police", "{{veh_police}}", "Not counted", "No: take-home and emergency use"]
      - ["Fire and EMS", "{{veh_fire}}", "Not counted", "No: emergency response"]
      - ["Public works", "{{veh_pw}}", "{{under_pw}}", "Some pickups"]
      - ["Parks and recreation", "{{veh_parks}}", "{{under_parks}}", "Yes"]
      - ["Administration and inspectors", "{{veh_admin}}", "{{under_admin}}", "Yes"]
      - ["Total", "{{total_veh}}", "{{under}}", ""]
    note: "Illustrative data created for this practice case. Larkfield is fictional. Emergency vehicles are excluded from the under-used count."
    insight: |
      {{under}} ({{under_pct}} of the fleet) are driven under 3,000 miles a year,
      mostly in administration. Those are candidates for a shared motor pool.
  - id: exhibit-2
    title: "Light-duty vehicles: cost per year by replacement cycle"
    kind: table
    ask: "Fleet management wants to keep vehicles longer. What do the numbers say?"
    columns: ["Replace after", "Capital cost per year (purchase less resale)", "Maintenance per year", "Total per year"]
    rows:
      - ["{{y6}}", "{{dep6}}", "{{m6}}", "{{tot6}}"]
      - ["{{y8}}", "{{dep8}}", "{{m8}}", "{{tot8}}"]
      - ["{{y10}}", "{{dep10}}", "{{m10}}", "{{tot10}}"]
    note: "Illustrative data created for this practice case. Capital cost is the purchase price of {{price}} less resale value, spread over the years held. Maintenance includes repair downtime."
    insight: |
      Total cost is lowest at {{y8}}. Going to {{y10}} costs {{worse10}} more per vehicle per
      year than today, because maintenance climbs faster than capital falls.
  - id: exhibit-3
    title: "Maintenance: in-house against an outside vendor, per light-duty vehicle per year"
    kind: table
    ask: "A vendor has offered to take over maintenance of light-duty vehicles. Should the city accept?"
    columns: ["Item", "Per vehicle per year"]
    rows:
      - ["In-house maintenance, fully allocated", "{{maint}}"]
      - ["Of which garage overhead (building, supervisors) that stays if work leaves", "{{oh}}"]
      - ["In-house cost that disappears if the work leaves", "{{var_cost}}"]
      - ["Vendor price", "{{vendor}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      The vendor looks {{alloc_saving}} cheaper on allocated cost, but the avoidable in-house cost
      is only {{var_cost}} per vehicle, so outsourcing would cost the city {{avoid_saving}} a year
      unless a garage closes.
---

## Prompt

Our client is the City of Larkfield, a mid-size US city that owns and runs **{{total_veh}}**, from police cruisers and fire trucks to inspectors' sedans. The fleet budget is {{budget}} a year (capital, insurance, maintenance and fuel).

Faced with a budget gap, the city council has told every department to cut. For fleet, the target is **{{target_pct}}**, or {{target}} a year.

The city manager asks us: **how can Larkfield cut its fleet budget, and which ideas are real?**

## Clarifying information

- Q: What does the target count?
  A: Recurring annual savings in the fleet budget. One-time cash from selling vehicles helps this year but does not count toward the target.
- Q: Which vehicles are off limits?
  A: Police and fire/EMS vehicles stay as they are: take-home policy and response times make them untouchable for this exercise.
- Q: How is usage measured?
  A: By miles driven. {{under}} are driven under 3,000 miles a year (Exhibit 1).
- Q: What does a shared pool involve?
  A: Staff book a car through an app. The city keeps {{pool_cars}} of the under-used vehicles as the pool. A booking system costs {{software}} a year.
- Q: What does a vehicle cost to own?
  A: Per vehicle per year: {{capital}} of capital, {{ins}} of insurance and registration, {{maint}} of maintenance and {{fuel}} of fuel.
- Q: What do replacement cycles look like?
  A: Light-duty vehicles ({{light}} in all) are replaced after {{y6}}. Exhibit 2 shows the cost of longer cycles.
- Q: What is the maintenance setup?
  A: Three city garages ({{garages}}) service all vehicles. A vendor has quoted {{vendor}} per light-duty vehicle per year. Closing a garage costs {{gar_one}} one time.

## Structure

The candidate should set out their own approach. A strong one:

- **1. Size the problem:** the budget by cost type, the target in dollars, and the time frame
- **2. Levers across the vehicle lifecycle**
  - **Fleet size:** do we need all these vehicles? (usage data, shared pool)
  - **Replacement policy:** when to buy and sell (capital against maintenance)
  - **Maintenance:** in-house against outsourced, garage footprint
  - **Running cost:** fuel, idling, vehicle type (not in the first list, but worth noting)
- **3. For each lever:** annual saving, one-time cost, risk to service
- **4. Which savings are real:** one-time against recurring, allocated against avoidable cost
- **5. Risks:** service to residents, staff pushback, public safety

A good hypothesis: *"The cleanest savings are vehicles we do not need. Longer replacement cycles and outsourcing may look good on paper but need a check on total cost."*

## Math walkthrough

**1. Budget and target.**
{{total_veh}} × ({{capital}} + {{ins}} + {{maint}} + {{fuel}}) gives a budget of **{{budget}}**. {{target_pct}} of that is **{{target}}**.

**2. Right-sizing and the pool.**
{{under}} are under-used. Keep {{pool_cars}} as a shared pool and remove **{{removed}}**. Each removed vehicle avoids capital, insurance and maintenance, or {{avoid}} (fuel is small for these vehicles and trips move to the pool).
Gross saving is {{rs_gross}}; after {{software}} of pool software, **{{rs_net}}** a year.
Selling the surplus vehicles brings {{sale}} once: useful cash but a one-time item, not part of the recurring target.

**3. Replacement cycle.**
Purchase-only view: {{price}} over {{y6}} against {{y8}} is {{naive_unit}} less per vehicle per year, or {{naive_cycle}} across {{light}}. That is misleading.
Include resale and maintenance and the totals per vehicle are {{tot6}} (at {{y6}}), **{{tot8}}** (at {{y8}}) and {{tot10}} (at {{y10}}). The real saving at {{y8}} is {{true_unit}} per vehicle, or **{{true_cycle}}**. At {{y10}} the city pays {{worse10}} more per vehicle than today.

**4. Maintenance: outsource or not?**
On the fully allocated cost, a vendor at {{vendor}} against {{maint}} appears to save {{alloc_saving}}. But {{oh}} of the {{maint}} is garage overhead that stays whether the work stays or leaves. The avoidable in-house cost is only {{var_cost}}, so outsourcing would change the budget by **{{avoid_saving}}** a year.
The better move is to close a garage: overhead is {{oh_total}} across {{garages}}, or {{gar_per}} each. Less {{gar_extra}} of extra handling, the saving is **{{gar_net}}**, with payback of **{{gar_payback}}** on the {{gar_one}} closure cost.

**5. The plan.**
Right-sizing {{rs_net}} + longer cycle {{true_cycle}} + garage consolidation {{gar_net}} gives **{{plan}}**, or {{plan_pct}} of the budget: about {{cushion}} above the target.
If the purchase-only and allocated-cost numbers had been used, the plan would have shown {{naive_plan}}, overstating the real result by {{overstate}}.

## Synthesis

**Larkfield can meet its {{target_pct}} target: right-size the fleet and set up a motor pool, move light-duty vehicles to an eight-year cycle and close one garage. That saves {{plan}} a year ({{plan_pct}} of the budget), {{cushion}} above the target, but it has little cushion and the savings are smaller than they first look.**

1. **Biggest and cleanest lever:** removing {{removed}} under-used vehicles saves {{rs_net}} a year; the {{sale}} from selling them is one time and should go to a one-off fund, not the recurring budget.
2. **Smaller than it looks:** a purchase-only view shows {{naive_cycle}} from longer cycles, but resale value and maintenance cut the real saving to {{true_cycle}}; going to ten years makes costs worse.
3. **Do not outsource:** the vendor's price looks {{alloc_saving}} lower, but the avoidable cost is lower still. Closing a garage saves {{gar_net}} instead.

**Risks and next steps:** check usage data by vehicle before choosing which to remove; pilot the pool in two departments to test booking and availability; confirm the garage consolidation does not slow repairs for emergency vehicles; with only {{cushion}} of cushion, look at fuel ({{fuel_total}}, untouched by this plan) through idling rules and right-sized replacement vehicles.

## Common mistakes

- Counting sale proceeds of {{sale}} as part of the recurring budget cut.
- Judging a longer replacement cycle on purchase price alone and forgetting maintenance and lower resale value.
- Comparing a vendor's price with fully allocated in-house cost, so overhead that does not go away is counted as a saving.
- Cutting emergency vehicles or take-home police cars the city has said are off limits.

## What top candidates do differently

- Separate one-time cash from recurring savings before presenting a total.
- Ask what cost actually disappears (avoidable cost) for every make-or-buy comparison.
- Test an ownership-length decision as a curve (capital falling, maintenance rising) and find the low point.
- Present the plan against the target, including how thin the cushion is.

## Creative question

Besides the levers above, how could Larkfield lower the cost of running its fleet?

## Model answer

Group ideas by **vehicle, driver and place**:

- **Vehicle:** replace some sedans with smaller or electric models where daily miles are low; buy standard models to share parts; add telematics to track idling and misuse.
- **Driver:** idling and speed policies; driver training for lower fuel use and fewer accidents; ending car allowances for staff who rarely need one.
- **Place:** share vehicles and garages with the county or school district; fuel contracts bought jointly with neighbors; selling or leasing spare garage space.

A top candidate prioritizes: "Fuel is {{fuel_total}} a year and not yet in the plan, so I would start with telematics and idling rules, which cost little and can be tested within one quarter."
