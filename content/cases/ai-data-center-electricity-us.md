---
id: ai-data-center-electricity-us
title: "Power-Hungry Models: US Electricity Demand from AI Data Centers"
client: "Sablewood Power (fictional), a US independent power producer"
summary: "A power producer is deciding whether to build a 1 GW plant for AI data centers. Size US AI data-center electricity demand from the chips up, cross-check it from the grid side, and test the build against rivals' pipeline."
industry: tech-ai
sub_industry: "Data centers / power"
type: market-sizing
difficulty: advanced
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real chip shipments,
# grid or consumption data.
inputs:
  accelerators_m:     { value: 10,   unit: "million", label: "AI accelerators (GPUs and similar chips) running in US data centers by 2028" }
  chip_kw:            { value: 0.8,  unit: "kW",      label: "Peak power per accelerator chip", decimals: 1 }
  server_overhead:    { value: 0.50, unit: "%",       label: "Extra server power per accelerator (CPUs, memory, networking)" }
  training_mix:       { value: 0.40, unit: "%",       label: "Share of accelerators used for training models" }
  training_util:      { value: 0.85, unit: "%",       label: "Average power draw vs. peak, training" }
  inference_mix:      { value: 0.60, unit: "%",       label: "Share of accelerators used for inference (answering requests)" }
  inference_util:     { value: 0.60, unit: "%",       label: "Average power draw vs. peak, inference" }
  pue:                { value: 1.25, unit: "",        label: "Power usage effectiveness (facility power ÷ IT power)", decimals: 2 }
  hours_year:         { value: 8760, unit: "hours",   label: "Hours in a year" }
  us_twh:             { value: 4000, unit: "TWh",     label: "Total US electricity consumption per year" }
  grid_capacity_gw:   { value: 16,   unit: "GW",      label: "Grid connections contracted by AI data centers for 2028" }
  load_factor:        { value: 0.65, unit: "%",       label: "Average load as a share of contracted connection" }
  today_avg_gw:       { value: 5.5,  unit: "GW",      label: "Average AI data-center load today (2026)", decimals: 1 }
  region_share:       { value: 0.30, unit: "%",       label: "Share of new AI data-center load in Sablewood's region" }
  rival_a_gw:         { value: 0.3,  unit: "GW",      label: "Rival A's committed gas capacity", decimals: 1 }
  rival_b_gw:         { value: 0.3,  unit: "GW",      label: "Rival B's committed gas capacity", decimals: 1 }
  rival_c_gw:         { value: 0.2,  unit: "GW",      label: "Rival C's nuclear uprate", decimals: 1 }
  plant_gw:           { value: 1.0,  unit: "GW",      label: "Sablewood's proposed gas plant", decimals: 1 }
  phase1_gw:          { value: 0.5,  unit: "GW",      label: "Size of a first phase if the plant is built in two halves", decimals: 1 }
  low_accelerators_m: { value: 8,    unit: "million", label: "Accelerators by 2028 in a slow case (chip or grid delays)" }

calculations:
  - { id: rival_gw, label: "Rivals' committed new round-the-clock capacity in the region", formula: "rival_a_gw + rival_b_gw + rival_c_gw", expected: 0.8, unit: "GW", decimals: 1 }
  # --- Method A: from the chips up ---
  - { id: it_kw, label: "IT power per accelerator, including server share", formula: "chip_kw * (1 + server_overhead)", expected: 1.2, unit: "kW", decimals: 1 }
  - { id: it_peak_gw, label: "Peak IT power of the fleet", formula: "accelerators_m * it_kw", expected: 12, unit: "GW" }
  - { id: avg_util, label: "Weighted average draw vs. peak", formula: "training_mix * training_util + inference_mix * inference_util", expected: 0.70, unit: "%" }
  - { id: it_avg_gw, label: "Average IT power", formula: "it_peak_gw * avg_util", expected: 8.4, unit: "GW" }
  - { id: facility_avg_gw, label: "Average facility power (incl. cooling)", formula: "it_avg_gw * pue", expected: 10.5, unit: "GW" }
  - { id: facility_peak_gw, label: "Peak facility power", formula: "it_peak_gw * pue", expected: 15, unit: "GW" }
  - { id: demand_twh, label: "Annual electricity demand, 2028", formula: "facility_avg_gw * hours_year / 1000", expected: 91.98, unit: "TWh", decimals: 0 }
  - { id: us_share, label: "Share of US electricity consumption", formula: "demand_twh / us_twh", expected: 0.023, unit: "%", decimals: 1 }
  # --- Method B: from the grid side ---
  - { id: check_avg_gw, label: "Average load from grid connections", formula: "grid_capacity_gw * load_factor", expected: 10.4, unit: "GW" }
  - { id: check_twh, label: "Annual demand from grid connections", formula: "check_avg_gw * hours_year / 1000", expected: 91.104, unit: "TWh", decimals: 0 }
  - { id: method_gap, label: "Difference between the two methods", formula: "demand_twh / check_twh - 1", expected: 0.0096, unit: "%", decimals: 0 }
  # --- Growth and Sablewood's region ---
  - { id: today_twh, label: "AI data-center demand today", formula: "today_avg_gw * hours_year / 1000", expected: 48.18, unit: "TWh", decimals: 0 }
  - { id: growth_multiple, label: "2028 demand vs. today", formula: "facility_avg_gw / today_avg_gw", expected: 1.909, unit: "x", decimals: 1 }
  - { id: increment_gw, label: "New average load nationally, 2026–2028", formula: "facility_avg_gw - today_avg_gw", expected: 5.0, unit: "GW", decimals: 1 }
  - { id: region_increment_gw, label: "New average load in Sablewood's region", formula: "increment_gw * region_share", expected: 1.5, unit: "GW", decimals: 1 }
  - { id: region_gap_gw, label: "New load not covered by rivals", formula: "region_increment_gw - rival_gw", expected: 0.7, unit: "GW", decimals: 1 }
  - { id: plant_excess_gw, label: "Proposed plant in excess of the open gap", formula: "plant_gw - region_gap_gw", expected: 0.3, unit: "GW", decimals: 1 }
  # --- Slow case ---
  - { id: low_facility_avg_gw, label: "Average facility power, slow case", formula: "low_accelerators_m * it_kw * avg_util * pue", expected: 8.4, unit: "GW" }
  - { id: low_twh, label: "Annual demand, slow case", formula: "low_facility_avg_gw * hours_year / 1000", expected: 73.584, unit: "TWh", decimals: 0 }
  - { id: low_region_gap_gw, label: "Open regional gap, slow case", formula: "(low_facility_avg_gw - today_avg_gw) * region_share - rival_gw", expected: 0.07, unit: "GW", decimals: 2 }
  # --- Common error ---
  - { id: naive_twh, label: "Demand using chip power only, running flat out (the wrong way)", formula: "accelerators_m * chip_kw * hours_year / 1000", expected: 70.08, unit: "TWh", decimals: 0 }

answer:
  calc: demand_twh
  headline: "About {{demand_twh}} a year by 2028 ({{us_share}} of US power); Sablewood's region has only ~{{region_gap_gw}} of open demand, so build {{phase1_gw}} first, not {{plant_gw}}."

exhibits:
  - id: exhibit-1
    title: "AI accelerator fleet in US data centers, 2028 forecast"
    kind: table
    ask: "Here is the client's forecast of the chip fleet. Estimate how much electricity it will use in a year."
    columns: ["Driver", "Value"]
    rows:
      - ["Accelerators running", "{{accelerators_m}}"]
      - ["Peak power per accelerator chip", "{{chip_kw}}"]
      - ["Extra server power per accelerator (CPUs, memory, networking)", "+{{server_overhead}}"]
      - ["Training: share of fleet / average draw vs. peak", "{{training_mix}} / {{training_util}}"]
      - ["Inference: share of fleet / average draw vs. peak", "{{inference_mix}} / {{inference_util}}"]
      - ["Power usage effectiveness (PUE)", "{{pue}}"]
    note: "Illustrative data created for this practice case; not real shipment or efficiency figures."
    insight: |
      Three multipliers sit between the chip and the grid: server overhead,
      utilization and cooling. Each one matters, and they partly offset —
      chips don't run flat out, but servers and cooling add a lot on top.
  - id: exhibit-2
    title: "The grid-side view"
    kind: table
    ask: "The client's grid team sees things from the other end. Does this view support your number?"
    columns: ["Measure", "Value"]
    rows:
      - ["Grid connections contracted by AI data centers for 2028", "{{grid_capacity_gw}}"]
      - ["Average load as a share of contracted connection", "{{load_factor}}"]
      - ["Average AI data-center load today (2026)", "{{today_avg_gw}}"]
      - ["Total US electricity consumption", "{{us_twh}}"]
    note: "Illustrative data created for this practice case; not official grid statistics."
    insight: |
      Connections of {{grid_capacity_gw}} at {{load_factor}} load give about
      {{check_twh}} a year — within {{method_gap}} of the chip-based estimate.
      Contracted connections sit a little above the fleet's own peak of
      {{facility_peak_gw}}, as you would expect with some headroom.
  - id: exhibit-3
    title: "New round-the-clock generation planned in Sablewood's region"
    kind: bar
    unit: "GW"
    decimals: 1
    ask: "Here is what rivals have committed to build in Sablewood's region, next to Sablewood's proposal. What do you conclude?"
    data:
      - { label: "Rival A (gas)", value: rival_a_gw }
      - { label: "Rival B (gas)", value: rival_b_gw }
      - { label: "Rival C (nuclear uprate)", value: rival_c_gw }
      - { label: "Sablewood (proposed gas plant)", value: plant_gw }
    note: "Illustrative data created for this practice case; projects are fictional."
    insight: |
      Rivals have committed {{rival_gw}}. Against new regional load of about
      {{region_increment_gw}}, that leaves ~{{region_gap_gw}} open — less
      than Sablewood's {{plant_gw}} plant.
---

## Prompt

Our client, Sablewood Power, builds and runs power plants and sells electricity under long-term contracts. AI data centers — buildings full of specialized chips that train and run AI models — are signing large, round-the-clock power contracts across the US.

Sablewood is considering a **1 GW natural-gas plant** in its home region to serve data centers, coming online in 2028. The board asks: **how much electricity will US AI data centers use in 2028, and is there enough demand in our region to justify the plant?**

## Clarifying information

- Q: What counts as an AI data center?
  A: Facilities, or parts of facilities, running AI accelerators — the GPUs and similar chips used to train and run models. Traditional cloud and enterprise computing is out of scope.
- Q: What year are we sizing?
  A: 2028, when the plant would start running. Today's AI data-center load is about **{{today_avg_gw}}** on average.
- Q: Do the chips run all the time?
  A: Data centers run around the clock, but chips rarely draw full power. Training jobs run close to peak; inference (answering user requests) varies with demand during the day. The client has a fleet forecast.
- Q: Is there anything besides the chips?
  A: Yes. Each accelerator sits in a server with processors, memory and networking, and the building needs cooling. **PUE** (power usage effectiveness) measures total facility power divided by the power of the IT equipment.
- Q: How much of the new demand would be in Sablewood's region?
  A: About **{{region_share}}** of new AI data-center load. Rivals have also committed to new plants; the client has the list.
- Q: Can the plant be built in stages?
  A: Yes — it can be built as two units of **{{phase1_gw}}**, with the second unit decided about a year later.

## Structure

> **Ask:** Lay out how you would size 2028 demand and test the plant decision. Drive toward two methods that check each other, then a view on the region.

**Method A — from the chips up (supply side):**

- **Peak IT power** = accelerators × chip power × (1 + server overhead)
- **Average IT power** = peak × average draw (weighted by training vs. inference)
- **Facility power** = IT power × PUE (cooling, power conversion)
- **Annual energy** = average facility power × 8,760 hours

**Method B — from the grid (demand side):**

- Grid connections contracted by AI data centers × average load factor × 8,760 hours

**The decision:**

- New load 2026–2028 = average load in 2028 − today's average load
- Regional share of new load − rivals' committed capacity = open gap
- Compare the open gap with Sablewood's plant, in a base case and a slow case

Top candidates keep **power (GW, how much at any moment)** and **energy (TWh, how much over a year)** clearly separate, and size the plant decision in power terms: a plant serving data centers must match their average round-the-clock load. (This is a simplification worth saying out loud: peaks above the average and plant outages push the need up, while spare capacity on today's grid pushes it down. The case treats these as offsetting.)

## Math walkthrough

> **Ask:** Size 2028 demand both ways, then tell me how much room there is in Sablewood's region — in the base case and if the chip fleet reaches only {{low_accelerators_m}}.

**1. Chips up (Exhibit 1).**
- IT power per accelerator = 0.8 kW × 1.5 = **{{it_kw}}**
- Peak IT power = 10 million × 1.2 kW = **{{it_peak_gw}}** (a million kW is a GW)
- Average draw = (40% × 85%) + (60% × 60%) = 34% + 36% = **{{avg_util}}**
- Average IT power = 12 GW × 70% = **{{it_avg_gw}}**
- Average facility power = 8.4 GW × 1.25 = **{{facility_avg_gw}}**
- Energy = 10.5 GW × 8,760 hours ≈ **{{demand_twh}}** a year, about {{us_share}} of US consumption

**2. Grid side (Exhibit 2).**
16 GW × 65% = **{{check_avg_gw}}**; × 8,760 hours ≈ **{{check_twh}}** — within {{method_gap}} of Method A. Use ~{{demand_twh}}.

**3. Growth.**
Today's load is {{today_avg_gw}} (≈ {{today_twh}} a year), so demand grows about {{growth_multiple}} in two years.
New average load = 10.5 − 5.5 = **{{increment_gw}}** nationally.

**4. Sablewood's region (Exhibit 3).**
- New regional load = 5 GW × 30% = **{{region_increment_gw}}**
- Rivals' committed capacity = 0.3 + 0.3 + 0.2 = **{{rival_gw}}**
- Open gap = 1.5 − 0.8 = **{{region_gap_gw}}**, so a 1 GW plant overshoots by **{{plant_excess_gw}}**

**5. Slow case ({{low_accelerators_m}}).**
Average facility power = 8 million × 1.2 kW × 70% × 1.25 = **{{low_facility_avg_gw}}** (≈ {{low_twh}} a year).
Open gap = (8.4 − 5.5) × 30% − 0.8 = **{{low_region_gap_gw}}** — almost nothing.

*Mental-math tip:* 10.5 × 8,760 is 10 × 8,760 plus half of 8,760, i.e. 87,600 + 4,380 GWh — about {{demand_twh:2}}, since 1 TWh is 1,000 GWh.

## Synthesis

> **Ask:** What do you recommend to the board?

**US AI data centers will use about {{demand_twh}} of electricity in 2028, roughly {{us_share}} of US consumption — but after rivals' projects, Sablewood's region has only about {{region_gap_gw}} of uncommitted new load, so Sablewood should build the plant in stages: a first unit of {{phase1_gw}}, backed by a signed data-center contract.**

- **The national number is solid:** chip-based and grid-based methods agree within {{method_gap}}, and demand grows about {{growth_multiple}} in two years.
- **The regional room is smaller than the headline:** new regional load of {{region_increment_gw}} minus rivals' {{rival_gw}} leaves {{region_gap_gw}}; a full {{plant_gw}} plant would overshoot by {{plant_excess_gw}}.
- **The downside is steep:** if the fleet reaches only {{low_accelerators_m}}, the open gap shrinks to {{low_region_gap_gw}}. A staged build limits the exposure.

**Risks / next steps:** chip efficiency gains could lower power per accelerator; data centers may cluster where power is already available, raising or lowering the regional share; rivals may add more projects. Next, sign a long-term contract with one or two data-center developers before committing to the first unit; tie the second-unit decision to signed contracts and to the grid connection queue.

## Common mistakes

- Multiplying chips by chip power and 8,760 hours ({{naive_twh}}), which ignores server overhead and cooling and assumes chips run flat out — two errors that only partly offset.
- Confusing GW and TWh: comparing an annual energy number with a plant's power rating.
- Using a simple average of training and inference draw instead of weighting by the fleet mix.
- Comparing the plant with total national demand instead of the open gap in Sablewood's region after rivals' projects.
- Ignoring today's load and treating all 2028 demand as new.

## What top candidates do differently

- Build a second method unprompted, and explain why connection data might sit above actual use (developers reserve headroom).
- Convert everything to average GW for the decision, because that is what a round-the-clock plant supplies.
- Run the slow case and show how sensitive the regional gap is ({{region_gap_gw}} vs. {{low_region_gap_gw}}) — small changes in national demand swing a regional decision a lot.
- Turn "build or not" into "how and when to build": staging, contracts and triggers.

## Creative question

Beyond selling power from a new plant, how else could Sablewood profit from data-center growth in its region?

## Model answer

A strong answer looks across the value chain:

- **Site packages:** offer data-center developers land next to Sablewood's existing plants with a ready grid connection — speed to power is what developers value most.
- **Flexibility services:** pay data centers to shift some inference or training load away from peak hours, and sell that flexibility to the grid.
- **Clean-power products:** pair gas with solar, batteries or carbon capture to meet tech companies' clean-energy goals at a premium price.
- **Upgrades:** add capacity at existing plants (uprates), which is faster and cheaper than a new build.

Top candidates prioritize site packages: "The scarcest thing in this market is a powered site. Sablewood already owns some — that's a better business than racing rivals to build another plant."
