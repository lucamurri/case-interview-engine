---
id: industrial-robots-mexico-auto
title: "Robots on the Line: Industrial Robot Demand in Mexican Auto Plants"
client: "Kestrelgard Robotics (fictional), a mid-sized European maker of industrial robot arms"
summary: "A European robot maker is weighing a local sales and service hub in Mexico. Size annual robot demand from the Mexican auto industry two ways, then test whether the hub breaks even — with and without new plants."
industry: other
sub_industry: "Industrials"
type: market-sizing
difficulty: advanced
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real production,
# robot-installation or pricing data.
inputs:
  vehicles_m:                { value: 4.0,  unit: "million vehicles",          label: "Vehicles produced in Mexico per year", decimals: 1 }
  density_now:               { value: 10,   unit: "robots per 1,000 vehicles", label: "Robots installed today per 1,000 vehicles of annual output (carmakers + suppliers)" }
  robot_life:                { value: 10,   unit: "years",                     label: "Useful life of a robot before replacement" }
  growth_m:                  { value: 0.2,  unit: "million vehicles",          label: "Added production capacity per year (trend in Exhibit 1)", decimals: 1 }
  new_density:               { value: 20,   unit: "robots per 1,000 vehicles", label: "Robot density of new capacity" }
  deepen_rate:               { value: 0.5,  unit: "robots per 1,000 vehicles", label: "Robots added each year in existing plants (further automation)", decimals: 1 }
  robot_price_k:             { value: 50,   unit: "$K",                        label: "Average robot price (arm and controller, excluding integration)" }
  oem_plants:                { value: 20,   unit: "plants",                    label: "Vehicle assembly plants in Mexico" }
  changeover_years:          { value: 5,    unit: "years",                     label: "Years between major model changeovers at a plant" }
  robots_per_changeover:     { value: 1500, unit: "robots",                    label: "Robots bought at a major model changeover" }
  supplier_plants:           { value: 800,  unit: "plants",                    label: "Large parts-supplier plants" }
  supplier_robots_per_plant: { value: 4.5,  unit: "robots/year",               label: "Robots bought per supplier plant per year", decimals: 1 }
  target_share:              { value: 0.10, unit: "%",                         label: "Kestrelgard's target share of Mexican auto robot sales" }
  contrib_margin:            { value: 0.30, unit: "%",                         label: "Kestrelgard's contribution margin on robot sales" }
  hub_cost:                  { value: 12,   unit: "$M",                        label: "Annual fixed cost of a Mexican sales and service hub" }

calculations:
  # --- Method A: installed-base (stock and flow) ---
  - { id: robot_stock, label: "Robots installed in Mexican auto today", formula: "vehicles_m * 1000 * density_now", expected: 40000, unit: "robots" }
  - { id: replacement, label: "Replacement demand", formula: "robot_stock / robot_life", expected: 4000, unit: "robots/year" }
  - { id: growth_robots, label: "Demand from new capacity", formula: "growth_m * 1000 * new_density", expected: 4000, unit: "robots/year" }
  - { id: deepening, label: "Demand from further automation of existing plants", formula: "vehicles_m * 1000 * deepen_rate", expected: 2000, unit: "robots/year" }
  - { id: demand_a, label: "Annual robot demand (installed-base method)", formula: "replacement + growth_robots + deepening", expected: 10000, unit: "robots/year" }
  # --- Method B: plant-by-plant ---
  - { id: oem_changeovers, label: "Model changeovers per year", formula: "oem_plants / changeover_years", expected: 4, unit: "changeovers/year" }
  - { id: oem_robots, label: "Robots bought by assembly plants", formula: "oem_changeovers * robots_per_changeover", expected: 6000, unit: "robots/year" }
  - { id: supplier_robots, label: "Robots bought by supplier plants", formula: "supplier_plants * supplier_robots_per_plant", expected: 3600, unit: "robots/year" }
  - { id: demand_b, label: "Annual robot demand (plant-by-plant method)", formula: "oem_robots + supplier_robots", expected: 9600, unit: "robots/year" }
  - { id: method_gap, label: "Difference between the two methods", formula: "demand_a / demand_b - 1", expected: 0.04167, unit: "%", decimals: 0 }
  # --- Value and the hub decision ---
  - { id: market_value, label: "Annual robot market value", formula: "demand_a * robot_price_k / 1000", expected: 500, unit: "$M" }
  - { id: kg_units, label: "Kestrelgard robots per year at target share", formula: "demand_a * target_share", expected: 1000, unit: "robots/year" }
  - { id: kg_rev, label: "Kestrelgard revenue at target share", formula: "market_value * target_share", expected: 50, unit: "$M" }
  - { id: kg_contrib, label: "Kestrelgard contribution at target share", formula: "kg_rev * contrib_margin", expected: 15, unit: "$M" }
  - { id: hub_profit, label: "Contribution after hub cost", formula: "kg_contrib - hub_cost", expected: 3, unit: "$M" }
  - { id: breakeven_share, label: "Market share needed to cover the hub", formula: "hub_cost / (market_value * contrib_margin)", expected: 0.08, unit: "%" }
  # --- Stress test: no new plants ---
  - { id: growth_share, label: "Share of demand from new capacity", formula: "growth_robots / demand_a", expected: 0.40, unit: "%" }
  - { id: replacement_share, label: "Share of demand from replacement", formula: "replacement / demand_a", expected: 0.40, unit: "%" }
  - { id: stable_demand, label: "Demand without new capacity", formula: "demand_a - growth_robots", expected: 6000, unit: "robots/year" }
  - { id: stable_value, label: "Market value without new capacity", formula: "stable_demand * robot_price_k / 1000", expected: 300, unit: "$M" }
  - { id: breakeven_share_stable, label: "Share needed to cover the hub without new capacity", formula: "hub_cost / (stable_value * contrib_margin)", expected: 0.1333, unit: "%", decimals: 0 }
  - { id: stable_contrib, label: "Kestrelgard contribution at target share without new capacity", formula: "stable_value * target_share * contrib_margin", expected: 9, unit: "$M" }

answer:
  calc: demand_a
  headline: "About {{demand_a}} (~{{market_value}}); the hub breaks even at a share of {{breakeven_share}}, but needs {{breakeven_share_stable}} if new plants stop coming."

exhibits:
  - id: exhibit-1
    title: "Vehicle production in Mexico"
    kind: bar
    unit: "million vehicles"
    decimals: 1
    ask: "Here is recent vehicle production. What trend would you build into the sizing?"
    data:
      - { label: "2022", value: 3.4 }
      - { label: "2023", value: 3.6 }
      - { label: "2024", value: 3.8 }
      - { label: "2025", value: vehicles_m }
    note: "Illustrative data created for this practice case; not official production statistics."
    insight: |
      Output is rising by a steady {{growth_m}} a year, mainly from new plants
      built to supply the US. New capacity is far more automated than old,
      so growth matters more for robot demand than its share of output suggests.
  - id: exhibit-2
    title: "Robot use in Mexican auto plants (carmakers and parts suppliers)"
    kind: table
    ask: "The client's analysts compiled these figures. Use them to size annual robot demand."
    columns: ["Driver", "Value"]
    rows:
      - ["Robot density today", "{{density_now}} of annual output"]
      - ["Robot density in new capacity", "{{new_density}}"]
      - ["Further automation in existing plants", "+{{deepen_rate}} each year"]
      - ["Robot life before replacement", "{{robot_life}}"]
      - ["Average robot price (excluding integration)", "{{robot_price_k}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Demand has three sources: replacing old robots, equipping new capacity
      and automating existing plants further. Replacement and automation are fairly steady;
      new capacity is {{growth_share}} of demand and depends on investment decisions.
  - id: exhibit-3
    title: "Plant-level buying patterns"
    kind: table
    ask: "Here is a second view from the plant side. Does it support your estimate?"
    columns: ["Buyer", "Count", "Buying pattern"]
    rows:
      - ["Vehicle assembly plants", "{{oem_plants}}", "{{robots_per_changeover}} at each major model changeover, every {{changeover_years}}"]
      - ["Large parts-supplier plants", "{{supplier_plants}}", "{{supplier_robots_per_plant}} on average"]
    note: "Illustrative data created for this practice case."
    insight: |
      This view gives {{demand_b}}, within {{method_gap}} of the installed-base
      estimate. It also shows how demand is bought: a few very large
      changeover tenders, and a long tail of small supplier orders.
---

## Prompt

Our client, Kestrelgard Robotics, is a mid-sized European maker of industrial robot arms — the machines that weld, paint and assemble car bodies. It sells mainly to European carmakers and their suppliers.

Mexico has become one of the world's largest car-producing countries, with new plants being built to supply the US market. Kestrelgard sells into Mexico today through a distributor, and wins little business. Management is considering opening a **local sales and service hub** — engineers, spare parts and a demonstration center.

The CEO asks: **how many industrial robots does the Mexican auto industry buy each year, and would a local hub pay for itself?**

## Clarifying information

- Q: Who counts as the auto industry?
  A: Vehicle assembly plants run by carmakers, plus large parts suppliers (bodies, seats, engines, electronics). Smaller workshops are out of scope.
- Q: What counts as a robot?
  A: An industrial robot arm and its controller. The cost of integrating it into a line (tooling, programming, safety fencing) is excluded.
- Q: What does the hub cost, and what does Kestrelgard earn?
  A: The hub costs about **{{hub_cost}}** a year. Kestrelgard's contribution margin (price minus variable costs) on robots is about **{{contrib_margin}}**.
- Q: What share could Kestrelgard reach with a hub?
  A: Management believes **{{target_share}}** within three years, mostly by winning supplier plants that value local service.
- Q: Is the Mexican auto industry growing?
  A: Yes, steadily — the client has production data. But new investment depends heavily on US trade policy.
- Q: Are robots replaced on a regular cycle?
  A: Roughly — a robot lasts about {{robot_life}} before it is replaced, often at a model changeover.

## Structure

> **Ask:** Walk me through how you would size annual robot demand. Aim for two independent methods, then the hub decision.

**Method A — installed base (stock and flow).** Robot purchases come from three sources:

- **Replacement:** robots installed today ÷ robot life
  - Installed robots = vehicles produced × robots per 1,000 vehicles
- **New capacity:** added vehicle output per year × robot density of new plants
- **Further automation:** existing output × robots added per 1,000 vehicles per year

**Method B — plant by plant (buyer view):**

- **Assembly plants:** plants ÷ years between changeovers × robots per changeover
- **Supplier plants:** plants × robots bought per plant per year

**Then the decision:**

- Market value = robots × average price
- Kestrelgard contribution = market value × target share × margin, vs. the hub's fixed cost
- Break-even share, and how it moves if new capacity dries up

Top candidates explain why they want two methods: the installed-base view captures drivers (growth, automation), while the plant view shows how customers actually buy — and a match between them builds confidence.

## Math walkthrough

> **Ask:** Size the market both ways and tell me whether the hub pays for itself — including if new plant investment stops.

**1. Installed base (Exhibits 1–2).**
Robots installed = {{vehicles_m}} ÷ 1,000 × 10 = **{{robot_stock}}**.
- Replacement = 40,000 ÷ 10 years = **{{replacement}}**
- New capacity: Exhibit 1 shows output rising by {{growth_m}} a year, so 200,000 ÷ 1,000 × 20 = **{{growth_robots}}**
- Further automation = 4,000 (thousand vehicles) × 0.5 = **{{deepening}}**
- Total = 4,000 + 4,000 + 2,000 = **{{demand_a}}**

**2. Plant by plant (Exhibit 3).**
- Assembly plants: 20 plants ÷ 5 years = {{oem_changeovers}}; × 1,500 robots = **{{oem_robots}}**
- Suppliers: 800 plants × 4.5 = **{{supplier_robots}}**
- Total = **{{demand_b}}**, within {{method_gap}} of Method A. Use ~{{demand_a}} as the working number.

**3. Market value.**
10,000 robots × $50K = **{{market_value}}** a year.

**4. Does the hub pay for itself?**
At {{target_share}}: {{kg_units}}, revenue **{{kg_rev}}**, contribution = $50M × 30% = **{{kg_contrib}}**.
After the {{hub_cost}} hub: **{{hub_profit}}** a year.
Break-even share = $12M ÷ ($500M × 30%) = **{{breakeven_share}}**.

**5. Stress test — no new plants.**
New capacity is {{growth_share}} of demand. Without it, demand = 10,000 − 4,000 = **{{stable_demand}}**, worth **{{stable_value}}**.
Break-even share = $12M ÷ ($300M × 30%) ≈ **{{breakeven_share_stable}}** — above the {{target_share}} target.
Put the other way: at a {{target_share}} share, this steady demand earns $300M × 10% × 30% = **{{stable_contrib}}** of contribution, so a hub costing no more than that would still pay for itself.

## Synthesis

> **Ask:** What is your recommendation to the CEO?

**The Mexican auto industry buys about {{demand_a}} (~{{market_value}}), and a local hub breaks even at a market share of {{breakeven_share}} — so Kestrelgard should open it, but start with a leaner hub that pays for itself on steady demand alone, because new-plant demand could vanish with a change in US trade policy.**

- **The market is real and cross-checked:** installed-base and plant-level methods agree within {{method_gap}}.
- **The economics are thin but positive:** a {{target_share}} share gives {{kg_contrib}} of contribution, {{hub_profit}} above the hub's cost.
- **The risk is concentrated in growth:** {{growth_share}} of demand comes from new capacity; without it the break-even share jumps to {{breakeven_share_stable}}.

**How to enter:** start with a service hub costing no more than about {{stable_contrib}} a year (what a {{target_share}} share of steady demand earns), focused on supplier plants and the replacement cycle, and add sales and demo capacity only as new-plant tenders are won. The full {{hub_cost}} hub needs new plants to keep coming. Note that reaching {{target_share}} takes about three years, so the hub will run at a loss at first. **Next steps:** check which assembly plants have changeovers in the next three years; test win rates with five or six supplier plants; agree service-contract pricing, which adds recurring revenue on the installed base.

## Common mistakes

- Using only the installed base divided by robot life ({{replacement}}), which misses new capacity and further automation — replacement is only {{replacement_share}} of demand.
- Applying today's density to new capacity. New plants are built with {{new_density}}, versus {{density_now}} in today's fleet.
- Mixing units: "robots per 1,000 vehicles" needs vehicles in thousands (4.0m vehicles is 4,000 thousand).
- Treating {{demand_a}} as stable and recommending a full-scale hub without testing what happens if new investment stops.
- Including integration costs in the price, which inflates the market Kestrelgard actually sells into.

## What top candidates do differently

- Propose the second method unprompted and explain what each one is good for.
- Separate demand by durability (replacement vs. new capacity) and connect it to trade-policy risk.
- Turn the answer into a break-even share and compare it with the target, under both scenarios.
- Use Exhibit 3 to talk about go-to-market: a few huge tenders (relationship-driven, with carmakers' headquarters) versus a long tail of supplier plants (service-driven, local).

## Creative question

Beyond selling robots, how could Kestrelgard make the Mexican hub more profitable?

## Model answer

A strong answer looks for revenue that rides on the installed base:

- **Service contracts:** maintenance, spare parts and guaranteed response times for supplier plants, which run lean and can't afford downtime.
- **Refurbishment:** buy back old robots at changeovers, refurbish them and resell them to smaller suppliers at a lower price point.
- **Training and programming:** a local training center for robot technicians — a scarce skill — sold to customers and used to build loyalty.
- **Robots as a service:** lease robots to suppliers that lack capital, paid monthly, with service included.

Top candidates link it to the risk: "Service revenue depends on robots already installed, not on new plants — it makes the hub's economics robust to the trade-policy scenario."
