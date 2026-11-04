---
id: parcel-last-mile-costs
title: "Nobody Home: A Parcel Carrier's Rising Delivery Costs"
client: "Brightway Parcel (fictional), a regional parcel carrier in the US Midwest"
summary: "Cost per delivery is up 25% in a year and management blames driver wages. The real driver is failed first attempts. Size it, then decide whether pickup lockers are worth building."
industry: industrials
sub_industry: "Logistics"
type: operations
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  driver_y1:      { value: 200,    unit: "$/day",           label: "Driver cost per route per day, last year" }
  driver_y2:      { value: 212,    unit: "$/day",           label: "Driver cost per route per day, this year" }
  van_cost:       { value: 88,     unit: "$/day",           label: "Van, fuel and maintenance per route per day (both years)" }
  attempts:       { value: 125,    unit: "stops",           label: "Delivery attempts a route can make per day (both years)" }
  fail_y1:        { value: 0.04,   unit: "%",               label: "Share of attempts that fail (nobody home, no safe place), last year" }
  fail_y2:        { value: 0.20,   unit: "%",               label: "Share of attempts that fail, this year" }
  sig_share:      { value: 0.40,   unit: "%",               label: "Share of attempts that are signature-required parcels, this year" }
  fail_sig:       { value: 0.44,   unit: "%",               label: "Failure rate on signature-required parcels, this year" }
  fail_other:     { value: 0.04,   unit: "%",               label: "Failure rate on all other parcels, this year" }
  parcels_day:    { value: 100000, unit: "parcels/day",     label: "Parcels delivered per day" }
  op_days:        { value: 300,    unit: "days",            label: "Delivery days per year" }
  locker_share:   { value: 0.20,   unit: "%",               label: "Share of parcels customers would send to a pickup locker" }
  locker_cost:    { value: 1.00,   unit: "$/parcel", decimals: 2,        label: "All-in cost per parcel delivered to a locker (drop-off, rent, upkeep)" }
  fail_lockers:   { value: 0.04,   unit: "%",               label: "Failure rate on home deliveries once lockers are in place (team estimate)" }
  locker_capex:   { value: 18,     unit: "$M",              label: "One-time cost to install the locker network" }

calculations:
  # --- Cost per delivery, both years ---
  - { id: route_y1, label: "Cost per route per day, last year", formula: "driver_y1 + van_cost", expected: 288, unit: "$/day" }
  - { id: route_y2, label: "Cost per route per day, this year", formula: "driver_y2 + van_cost", expected: 300, unit: "$/day" }
  - { id: success_y1, label: "Successful deliveries per route per day, last year", formula: "attempts * (1 - fail_y1)", expected: 120, unit: "parcels" }
  - { id: success_y2, label: "Successful deliveries per route per day, this year", formula: "attempts * (1 - fail_y2)", expected: 100, unit: "parcels" }
  - { id: cpd_y1, label: "Cost per successful delivery, last year", formula: "route_y1 / success_y1", expected: 2.40, unit: "$/parcel", decimals: 2 }
  - { id: cpd_y2, label: "Cost per successful delivery, this year", formula: "route_y2 / success_y2", expected: 3.00, unit: "$/parcel", decimals: 2 }
  - { id: cpd_change, label: "Increase in cost per delivery", formula: "cpd_y2 - cpd_y1", expected: 0.60, unit: "$/parcel", decimals: 2 }
  - { id: cpd_growth, label: "Growth in cost per delivery", formula: "cpd_y2 / cpd_y1 - 1", expected: 0.25, unit: "%" }
  - { id: wage_growth, label: "Growth in driver cost", formula: "driver_y2 / driver_y1 - 1", expected: 0.06, unit: "%" }
  # --- Bridge ---
  - { id: wage_effect, label: "Wage effect (at last year's success rate)", formula: "(route_y2 - route_y1) / success_y1", expected: 0.10, unit: "$/parcel", decimals: 2 }
  - { id: fail_effect, label: "Failed-delivery effect", formula: "route_y2 / success_y2 - route_y2 / success_y1", expected: 0.50, unit: "$/parcel", decimals: 2 }
  - { id: bridge_total, label: "Bridge total (must equal the increase)", formula: "wage_effect + fail_effect", expected: 0.60, unit: "$/parcel", decimals: 2 }
  - { id: fail_check, label: "Overall failure rate rebuilt from the two parcel types", formula: "sig_share * fail_sig + (1 - sig_share) * fail_other", expected: 0.20, unit: "%" }
  - { id: sig_fail_share, label: "Share of failed attempts that are signature-required parcels", formula: "sig_share * fail_sig / fail_y2", expected: 0.88, unit: "%" }
  - { id: fail_share, label: "Share of the increase caused by failed deliveries", formula: "fail_effect / cpd_change", expected: 0.8333, unit: "%", decimals: 0 }
  # --- Size of the problem ---
  - { id: annual_parcels, label: "Parcels delivered per year", formula: "parcels_day * op_days / 1e6", expected: 30, unit: "million parcels" }
  - { id: cost_attempt, label: "Cost of one delivery attempt this year", formula: "route_y2 / attempts", expected: 2.40, unit: "$/attempt", decimals: 2 }
  - { id: failed_day, label: "Failed attempts per day this year", formula: "parcels_day / (1 - fail_y2) - parcels_day", expected: 25000, unit: "attempts/day" }
  - { id: failure_cost, label: "Annual cost of failed attempts this year", formula: "failed_day * cost_attempt * op_days / 1e6", expected: 18, unit: "$M" }
  - { id: fail_effect_year, label: "Annual cost of the rise in failures", formula: "fail_effect * annual_parcels", expected: 15, unit: "$M" }
  # --- Pickup lockers ---
  - { id: home_cpd, label: "Cost per home delivery with lockers in place", formula: "route_y2 / (attempts * (1 - fail_lockers))", expected: 2.50, unit: "$/parcel", decimals: 2 }
  - { id: blended_cpd, label: "Blended cost per delivery with lockers", formula: "(1 - locker_share) * home_cpd + locker_share * locker_cost", expected: 2.20, unit: "$/parcel", decimals: 2 }
  - { id: locker_saving, label: "Saving per parcel from lockers", formula: "cpd_y2 - blended_cpd", expected: 0.80, unit: "$/parcel", decimals: 2 }
  - { id: locker_saving_year, label: "Annual saving from lockers", formula: "locker_saving * annual_parcels", expected: 24, unit: "$M" }
  - { id: locker_payback, label: "Locker payback", formula: "locker_capex / locker_saving_year", expected: 0.75, unit: "years" }
  - { id: worst_cpd, label: "Blended cost if home failures don't improve", formula: "(1 - locker_share) * cpd_y2 + locker_share * locker_cost", expected: 2.60, unit: "$/parcel", decimals: 2 }
  - { id: worst_saving_year, label: "Annual saving if home failures don't improve", formula: "(cpd_y2 - worst_cpd) * annual_parcels", expected: 12, unit: "$M" }
  - { id: worst_payback, label: "Locker payback if home failures don't improve", formula: "locker_capex / worst_saving_year", expected: 1.5, unit: "years" }

answer:
  calc: fail_share
  headline: "Cost per delivery rose {{cpd_change}} to {{cpd_y2}}, and {{fail_share}} of the rise comes from failed first attempts, not wages; pickup lockers save {{worst_saving_year}}–{{locker_saving_year}} a year and pay back within {{worst_payback}}."

exhibits:
  - id: exhibit-1
    title: "Brightway route economics, last year and this year"
    kind: table
    ask: "Management says driver wages are behind the cost increase. Here are the route numbers. Do you agree?"
    columns: ["Per route, per day", "Last year", "This year"]
    rows:
      - ["Driver cost", "{{driver_y1}}", "{{driver_y2}}"]
      - ["Van, fuel and maintenance", "{{van_cost}}", "{{van_cost}}"]
      - ["Delivery attempts (stops)", "{{attempts}}", "{{attempts}}"]
      - ["Share of attempts that fail", "{{fail_y1}}", "{{fail_y2}}"]
      - ["Signature-required parcels: share of attempts", "0%", "{{sig_share}}"]
      - ["Signature-required parcels: failure rate", "n/a", "{{fail_sig}}"]
      - ["All other parcels: failure rate", "{{fail_y1}}", "{{fail_other}}"]
    note: "Illustrative data created for this practice case. Brightway Parcel is fictional. Brightway delivers about 100,000 parcels a day on 300 delivery days a year. A failed parcel goes back to the depot and is reattempted the next day, using another stop on a route."
    insight: |
      Wages rose only {{wage_growth}}, but the failure rate rose fivefold. Each
      route still makes {{attempts}}, yet delivers only {{success_y2}}
      instead of 120. Other parcels fail no more often than last year; the
      signature-required parcels fail at {{fail_sig}} and cause
      {{sig_fail_share}} of all failed attempts.
  - id: exhibit-2
    title: "Proposal: a network of pickup lockers"
    kind: table
    ask: "The network team proposes pickup lockers at grocery stores and train stations. Are they worth it?"
    columns: ["Item", "Estimate"]
    rows:
      - ["Share of parcels customers would send to a locker", "{{locker_share}}"]
      - ["All-in cost per parcel delivered to a locker", "{{locker_cost}}"]
      - ["Failure rate on remaining home deliveries", "{{fail_lockers}} (team estimate, from {{fail_y2}})"]
      - ["One-time installation cost", "{{locker_capex}}"]
    note: "Illustrative data created for this practice case. A driver drops dozens of parcels at one locker stop, so the cost per parcel is low and lockers almost never fail."
    insight: |
      Lockers help twice: they are a cheap way to deliver, and the customers
      most likely to choose them are the ones who are rarely home.
---

## Prompt

Our client, Brightway Parcel, delivers parcels for online retailers to homes across the US Midwest. It runs about a thousand delivery routes a day, each with one driver and one van.

Over the last year, Brightway's cost per delivered parcel has jumped by a quarter. Retailers will not accept higher prices, so margins are being squeezed. The management team believes the cause is driver wages, which rose after a tight labor market forced a pay increase.

The COO asks us: **why has cost per delivery risen so much, and what should Brightway do about it?**

## Clarifying information

- Q: How is cost per delivery measured?
  A: Total route cost (driver plus van) divided by the number of parcels successfully delivered.
- Q: What happens when nobody is home?
  A: If there is no safe place to leave the parcel, the driver takes it back. It goes out again the next day, using another stop on a route.
- Q: Has anything changed in what Brightway delivers?
  A: Last year Brightway won a large electronics retailer that requires a signature for every parcel. Its parcels are now a little over a quarter of delivered volume.
- Q: How many parcels does Brightway deliver?
  A: About **{{parcels_day}}**, on {{op_days}} a year.
- Q: Can Brightway raise prices?
  A: Not in the short term. Contracts with retailers are fixed for two more years.

## Structure

> **Ask:** How would you structure the problem?

Break cost per delivery into **cost per route** and **deliveries per route**, then test both:

- **Cost per delivery = Cost per route per day ÷ Successful deliveries per route per day**
  - **Cost per route:** driver wages, van, fuel, maintenance
  - **Successful deliveries per route** = Attempts per route × (1 − Failure rate)
    - Attempts: route density, traffic, parcel size
    - Failure rate: nobody home, signature required, no safe place, wrong address
- **Options:** cut the cost of an attempt, or cut the number of attempts per parcel
  - Lockers and pickup points, delivery-day notifications, safe-place photos, evening slots

A strong hypothesis: *"Wages are an obvious suspect, but a wage rise of a few percent can't explain a 25% jump. I'd check whether each route is delivering fewer parcels."*

## Math walkthrough

> **Ask:** Using Exhibit 1, how much has cost per delivery risen, and why? Then, using Exhibit 2, are the lockers worth building? Which assumption worries you most?

**1. Cost per delivery.**
Route cost: $200 + $88 = {{route_y1}} last year, $212 + $88 = {{route_y2}} this year.
Successful deliveries: 125 × (1 − 4%) = {{success_y1}}, then 125 × (1 − 20%) = {{success_y2}}.
Cost per delivery: $288 ÷ 120 = **{{cpd_y1}}**, then $300 ÷ 100 = **{{cpd_y2}}**, up **{{cpd_change}}** ({{cpd_growth}}).

**2. Bridge.**

| Driver | Calculation | Impact per parcel |
|---|---|---|
| Higher wages | ($300 − $288) ÷ 120 | +{{wage_effect}} |
| More failed attempts | $300 ÷ 100 − $300 ÷ 120 | +{{fail_effect}} |
| **Total** | | **+{{bridge_total}}** |

Wages rose {{wage_growth}} and explain only {{wage_effect}} of the rise. Failed deliveries explain **{{fail_share}}**.

The split in Exhibit 1 shows where the failures come from: 40% × 44% + 60% × 4% = {{fail_check}}, so signature-required parcels cause 17.6 ÷ 20 = **{{sig_fail_share}}** of failed attempts. Other parcels fail at the same {{fail_other}} as last year.

**3. Size of the problem.**
Brightway delivers 100,000 × 300 = {{annual_parcels}} a year. The rise in failures costs $0.50 × 30M = **{{fail_effect_year}}** a year.
Each attempt costs $300 ÷ 125 = {{cost_attempt}}. Each day, 100,000 ÷ 80% − 100,000 = {{failed_day}} fail, so failed attempts cost **{{failure_cost}}** a year in total.

**4. Pickup lockers (Exhibit 2).**
With failures back to 4%, a home delivery costs $300 ÷ 120 = {{home_cpd}}.
Blended cost: 80% × $2.50 + 20% × $1.00 = **{{blended_cpd}}**, a saving of **{{locker_saving}}**, or **{{locker_saving_year}}** a year. Payback on {{locker_capex}}: **{{locker_payback}}**.

**5. The assumption to test.**
The team assumes home failures fall back to {{fail_lockers}}, which is optimistic: signature-required parcels will still fail unless that retailer allows locker delivery. Suppose failures don't improve at all: 80% × $3.00 + 20% × $1.00 = {{worst_cpd}}, still a saving of **{{worst_saving_year}}** a year and a payback of **{{worst_payback}}**. The lockers pay off even in the worst case, because locker delivery is cheap on its own.

## Synthesis

> **Ask:** What would you tell the COO?

**Cost per delivery rose from {{cpd_y1}} to {{cpd_y2}}, and {{fail_share}} of that is failed first attempts, not wages. Brightway should build the pickup lockers, which save between {{worst_saving_year}} and {{locker_saving_year}} a year and pay back in 9 to 18 months, and tackle the signature-required parcels behind the failures.**

1. **Wages are a small part of the story:** a {{wage_growth}} pay rise adds {{wage_effect}}; failures add {{fail_effect}}.
2. **Failures are expensive:** every route still makes {{attempts}}, but one in five is wasted; failed attempts cost {{failure_cost}} a year.
3. **Lockers are robust:** they pay off even if home failures don't fall, because a locker parcel costs {{locker_cost}} against {{cpd_y2}} at the door.

**Risks and next steps:** the {{locker_share}} take-up is untested, so pilot lockers in two cities with the highest failure rates first; talk to the electronics retailer about allowing locker delivery or a signature at the locker, since its parcels cause {{sig_fail_share}} of the failures; add delivery-day text messages so customers can redirect parcels before the driver arrives; and track first-attempt success rate weekly as a key measure alongside cost.

## Common mistakes

- Accepting the client's wage explanation without checking how much a {{wage_growth}} rise can explain.
- Measuring cost per *attempt*, which barely changed, instead of cost per *successful delivery*.
- Assuming the lockers only work if home failures fall, without testing the worst case.
- Stopping at the overall failure rate instead of splitting it by parcel type, and so missing that the signature-required retailer causes {{sig_fail_share}} of failed attempts.

## What top candidates do differently

- Split cost per delivery into cost per route and deliveries per route right away.
- Build a two-line bridge so the wage effect and the failure effect are separated.
- Challenge the most optimistic assumption in the proposal and show the decision still holds.
- Link the fix to the root cause: talk to the retailer whose policy created most of the failures.

## Creative question

Apart from lockers, how could Brightway raise its first-attempt success rate?

## Model answer

Organize ideas around **knowing when the customer is home, giving them choices, and changing the rules**:

- **Know when they're home:** predict the best delivery window from past successful deliveries at each address; deliver to workplaces on weekdays; route signature parcels to evening shifts.
- **Give customers choices:** a text the morning of delivery with options to reschedule, redirect to a neighbor or a locker, or name a safe place; live tracking with a two-hour window.
- **Change the rules:** agree with retailers that low-value parcels don't need a signature; accept a photo plus a code instead of a signature; charge retailers for a second attempt on signature parcels.
- **Partner:** use corner shops, pharmacies and gas stations as staffed pickup points, which are cheaper than lockers and accept signature parcels.

A top candidate prioritizes: "Renegotiating the signature rule with the electronics retailer is the biggest single lever, because their parcels cause {{sig_fail_share}} of the failures. It costs nothing to build."
