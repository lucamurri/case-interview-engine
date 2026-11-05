---
id: green-hydrogen-fertilizer-plant
title: "Green on Paper: A Utility's Hydrogen Plant for a Fertilizer Maker"
client: "Northfield Power (fictional), a regional US electric utility with a growing wind portfolio"
summary: "A utility wants to build an electrolyzer and sell green hydrogen to a nearby fertilizer plant. The business plan shows a steady profit, but it counts a production subsidy for twice as long as the law allows."
industry: energy
sub_industry: "Hydrogen"
type: market-entry
difficulty: advanced
format: candidate-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real market or policy data.
inputs:
  mw:             { value: 100,  unit: "MW",            label: "Electrolyzer size" }
  hours:          { value: 5000, unit: "hours/year",    label: "Operating hours per year (when power is cheap)" }
  kwh_per_kg:     { value: 50,   unit: "kWh/kg",        label: "Electricity used per kg of hydrogen" }
  power_price:    { value: 40,   unit: "$/MWh",         label: "Power price paid by the project (wholesale value)" }
  retail_tariff:  { value: 120,  unit: "$/MWh",         label: "Northfield's industrial retail tariff (for reference)" }
  capex_kw:       { value: 1500, unit: "$/kW",          label: "Installed cost of the electrolyzer plant" }
  crf:            { value: 0.10, unit: "%",             label: "Annual capital charge (return plus repayment over a 20-year life)" }
  om_fixed:       { value: 5,    unit: "$M",            label: "Fixed operating and maintenance cost per year" }
  life:           { value: 20,   unit: "years",         label: "Project life" }
  gas_price:      { value: 4,    unit: "$/MMBtu",       label: "Natural gas price" }
  gas_per_kg:     { value: 0.2,  unit: "MMBtu/kg",      label: "Gas used per kg of gray hydrogen", decimals: 1 }
  smr_other:      { value: 0.40, unit: "$/kg",          label: "Other costs of the fertilizer plant's gas-based hydrogen unit", decimals: 2 }
  co2_per_kg:     { value: 10,   unit: "kg CO2/kg",     label: "CO2 emitted per kg of gray hydrogen" }
  carbon_now:     { value: 50,   unit: "$/tonne",       label: "Carbon price paid on emissions today and through years 1–10" }
  plant_demand:   { value: 40,   unit: "thousand tonnes", label: "Fertilizer plant's hydrogen use per year" }
  subsidy:        { value: 3.00, unit: "$/kg",          label: "Production subsidy for green hydrogen", decimals: 2 }
  discount:       { value: 0.10, unit: "$/kg",          label: "Discount to the fertilizer plant's current cost, offered to win the contract", decimals: 2 }
  subsidy_years:  { value: 10,   unit: "years",         label: "Years the subsidy is paid (from start of operation)" }
  carbon_later:   { value: 150,  unit: "$/tonne",       label: "Forecast carbon price, years 11–20" }

calculations:
  # --- Output ---
  - { id: energy_mwh, label: "Electricity used per year", formula: "mw * hours", expected: 500000, unit: "MWh" }
  - { id: h2_mkg, label: "Hydrogen produced per year", formula: "energy_mwh * 1000 / kwh_per_kg / 1e6", expected: 10, unit: "million kg" }
  - { id: plant_share, label: "Share of the fertilizer plant's hydrogen supplied", formula: "h2_mkg / plant_demand", expected: 0.25, unit: "%" }
  # --- Green hydrogen cost per kg ---
  - { id: power_kg, label: "Power cost per kg", formula: "power_price * kwh_per_kg / 1000", expected: 2.00, unit: "$/kg", decimals: 2 }
  - { id: capex, label: "Upfront investment", formula: "mw * 1000 * capex_kw / 1e6", expected: 150, unit: "$M" }
  - { id: cap_charge, label: "Annual capital charge", formula: "capex * crf", expected: 15, unit: "$M" }
  - { id: capex_kg, label: "Capital recovery per kg", formula: "cap_charge / h2_mkg", expected: 1.50, unit: "$/kg", decimals: 2 }
  - { id: om_kg, label: "Fixed O&M per kg", formula: "om_fixed / h2_mkg", expected: 0.50, unit: "$/kg", decimals: 2 }
  - { id: green_cost, label: "Green hydrogen cost per kg (before subsidy)", formula: "power_kg + capex_kg + om_kg", expected: 4.00, unit: "$/kg", decimals: 2 }
  - { id: power_share, label: "Power's share of the green hydrogen cost", formula: "power_kg / green_cost", expected: 0.50, unit: "%" }
  # --- The fertilizer plant's alternative ---
  - { id: gray_cost, label: "Gray hydrogen production cost", formula: "gas_price * gas_per_kg + smr_other", expected: 1.20, unit: "$/kg", decimals: 2 }
  - { id: carbon_kg_now, label: "Carbon cost per kg of gray hydrogen, today", formula: "co2_per_kg * carbon_now / 1000", expected: 0.50, unit: "$/kg", decimals: 2 }
  - { id: gray_total_now, label: "Gray hydrogen cost including carbon, today", formula: "gray_cost + carbon_kg_now", expected: 1.70, unit: "$/kg", decimals: 2 }
  # --- The business plan ---
  - { id: price_now, label: "Sale price to the fertilizer plant", formula: "gray_total_now - discount", expected: 1.60, unit: "$/kg", decimals: 2 }
  - { id: green_net, label: "Green hydrogen cost after subsidy", formula: "green_cost - subsidy", expected: 1.00, unit: "$/kg", decimals: 2 }
  - { id: margin_plan, label: "Margin per kg above the capital charge, business plan", formula: "price_now - green_net", expected: 0.60, unit: "$/kg", decimals: 2 }
  - { id: profit_plan, label: "Profit per year above the capital charge, business plan", formula: "margin_plan * h2_mkg", expected: 6, unit: "$M" }
  - { id: plan_life, label: "Lifetime profit above the capital charge, business plan", formula: "profit_plan * life", expected: 120, unit: "$M" }
  # --- Exhibit 3: subsidy ends, carbon price rises ---
  - { id: carbon_kg_later, label: "Carbon cost per kg of gray hydrogen, years 11–20", formula: "co2_per_kg * carbon_later / 1000", expected: 1.50, unit: "$/kg", decimals: 2 }
  - { id: price_later, label: "Sale price, years 11–20 (same formula: gray + carbon − discount)", formula: "gray_cost + carbon_kg_later - discount", expected: 2.60, unit: "$/kg", decimals: 2 }
  - { id: margin_later, label: "Margin per kg, years 11–20 (no subsidy)", formula: "price_later - green_cost", expected: -1.40, unit: "$/kg", decimals: 2 }
  - { id: profit_later, label: "Profit per year, years 11–20", formula: "margin_later * h2_mkg", expected: -14, unit: "$M" }
  - { id: life_total, label: "Lifetime profit above the capital charge, corrected", formula: "subsidy_years * profit_plan + (life - subsidy_years) * profit_later", expected: -80, unit: "$M" }
  - { id: life_loss, label: "Lifetime loss after the capital charge, corrected", formula: "-life_total", expected: 80, unit: "$M" }
  - { id: plan_gap, label: "Overstatement in the business plan", formula: "plan_life - life_total", expected: 200, unit: "$M" }
  - { id: subsidy_loss, label: "Subsidy the plan counted for years 11–20", formula: "(life - subsidy_years) * subsidy * h2_mkg", expected: 300, unit: "$M" }
  - { id: carbon_gain, label: "Extra revenue from the higher carbon price, years 11–20", formula: "(life - subsidy_years) * (carbon_kg_later - carbon_kg_now) * h2_mkg", expected: 100, unit: "$M" }
  # --- Conditions for a go ---
  - { id: avg_subsidy, label: "Subsidy per kg averaged over the project life", formula: "subsidy * subsidy_years / life", expected: 1.50, unit: "$/kg", decimals: 2 }
  - { id: price_required, label: "Fixed 20-year price that covers cost and the capital charge", formula: "green_cost - avg_subsidy", expected: 2.50, unit: "$/kg", decimals: 2 }
  - { id: carbon_avg, label: "Average carbon price over the project life", formula: "(carbon_now + carbon_later) / 2", expected: 100, unit: "$/tonne" }
  - { id: alt_avg, label: "Fertilizer plant's expected average cost of gray hydrogen plus carbon", formula: "gray_cost + co2_per_kg * carbon_avg / 1000", expected: 2.20, unit: "$/kg", decimals: 2 }
  - { id: price_gap, label: "Gap between the required price and the buyer's expected alternative", formula: "price_required - alt_avg", expected: 0.30, unit: "$/kg", decimals: 2 }
  - { id: power_kg_allowed, label: "Power cost per kg the project can afford at the buyer's price (price + subsidy − capital − O&M)", formula: "alt_avg + avg_subsidy - capex_kg - om_kg", expected: 1.70, unit: "$/kg", decimals: 2 }
  - { id: power_needed, label: "Power price at which the project pays at the buyer's price", formula: "power_kg_allowed * 1000 / kwh_per_kg", expected: 34, unit: "$/MWh" }
  - { id: power_cut, label: "Power price cut needed versus the plan", formula: "1 - power_needed / power_price", expected: 0.15, unit: "%" }

answer:
  calc: life_total
  headline: "Don't build on the current plan: the subsidy lasts {{subsidy_years}}, not {{life}}, so a project shown earning {{plan_life}} actually loses {{life_loss}}. Build only with power at about {{power_needed}} or less and a 20-year contract at the buyer's {{alt_avg}}; at today's power price the project would need {{price_required}}, which the buyer won't pay."

exhibits:
  - id: exhibit-1
    title: "Northfield's business plan for a 100 MW electrolyzer"
    kind: table
    ask: "Here is the business plan the project team prepared."
    columns: ["Item", "Assumption"]
    rows:
      - ["Electrolyzer size and running hours", "{{mw}}, {{hours}}"]
      - ["Electricity per kg of hydrogen", "{{kwh_per_kg}}"]
      - ["Power price paid by the project", "{{power_price}}"]
      - ["Northfield's industrial retail tariff (for reference)", "{{retail_tariff}}"]
      - ["Installed cost", "{{capex_kw}}"]
      - ["Annual capital charge", "{{crf}} of the investment"]
      - ["Fixed operating and maintenance cost", "{{om_fixed}} a year"]
      - ["Production subsidy", "{{subsidy}}"]
      - ["Sale price", "Fertilizer plant's cost of gray hydrogen plus carbon, less {{discount}}"]
      - ["Result shown to the board", "Profit above the capital charge of {{profit_plan}} a year for {{life}}"]
    note: "Illustrative data created for this practice case. Northfield Power is fictional."
    insight: |
      Power is about half the cost of green hydrogen, so the power price and
      running hours matter as much as the electrolyzer's cost. The retail tariff is a
      distraction: the project pays the wholesale value of the power it uses.
  - id: exhibit-2
    title: "The fertilizer plant's current hydrogen supply"
    kind: table
    ask: "Here is what the fertilizer plant pays for hydrogen today."
    columns: ["Item", "Value"]
    rows:
      - ["Hydrogen used per year", "{{plant_demand}}"]
      - ["Source", "Made on site from natural gas (gray hydrogen)"]
      - ["Natural gas price and use", "{{gas_price}}, {{gas_per_kg}}"]
      - ["Other production costs", "{{smr_other}}"]
      - ["CO2 emitted", "{{co2_per_kg}}"]
      - ["Carbon price paid today", "{{carbon_now}}"]
    note: "Illustrative data created for this practice case. The fertilizer company is fictional. MMBtu is one million British thermal units, the standard US unit for natural gas."
    insight: |
      Gray hydrogen is cheap. Green hydrogen only competes once the subsidy and the
      carbon price are counted.
  - id: exhibit-3
    title: "Subsidy rules, carbon outlook and a power offer"
    kind: table
    ask: "Our policy team sent this note on the subsidy rules. Does it change anything?"
    columns: ["Item", "Detail"]
    rows:
      - ["Production subsidy", "{{subsidy}}, paid for the first {{subsidy_years}} of operation only"]
      - ["Carbon price forecast", "{{carbon_now}} in years 1–10, rising to an average of {{carbon_later}} in years 11–20"]
      - ["Fertilizer company's position", "Open to a long-term supply contract; wants to cut emissions but will not pay more than it expects gray hydrogen plus carbon to cost"]
      - ["Northfield renewables team", "Can offer the project power from a new wind farm at a fixed price for 20 years; price under negotiation"]
    note: "Illustrative data created for this practice case; not a description of any real subsidy program."
    insight: |
      The business plan counted the subsidy for all {{life}}. Without it, green
      hydrogen costs {{green_cost}}, and even a much higher carbon price does not
      close the gap.
---

## Prompt

Our client, Northfield Power, is a regional electric utility in the US Midwest. It owns several wind farms and wants to find new, long-term buyers for clean electricity.

A large fertilizer plant near one of Northfield's substations uses hydrogen to make ammonia. Today it makes that hydrogen from natural gas, which emits CO2. Northfield's project team proposes building a **100 MW electrolyzer** (a plant that splits water into hydrogen and oxygen using electricity) next to the fertilizer plant and selling it **green hydrogen**.

The CEO has asked us: **should Northfield enter the hydrogen business with this project, and on what terms?**

## Clarifying information

- Q: What is Northfield's objective and investment test?
  A: Enter a growing market and earn at least its required return. The capital charge of {{crf}} a year on the investment already includes that return, so the project must earn a profit above the capital charge over a life of {{life}}.
- Q: Who buys the hydrogen, and how much do they need?
  A: One fertilizer plant using {{plant_demand}} a year. The project would supply {{plant_share}} of it. There is no other buyer nearby, and hydrogen is expensive to transport.
- Q: Where does the power come from, and at what price?
  A: From the grid and Northfield's wind farms. The project pays the wholesale value of that power, {{power_price}} on average, running about {{hours}} when prices are lowest.
- Q: How does the subsidy work?
  A: The government pays {{subsidy}} for green hydrogen produced. Details of the rules are in Exhibit 3 if the candidate asks.
- Q: Does the fertilizer plant pay for its emissions?
  A: Yes. It pays a carbon price of {{carbon_now}} of CO2, and the price is expected to rise.
- Q: Has a contract been agreed?
  A: No. The business plan assumes the fertilizer plant buys each year at its own cost of gray hydrogen plus carbon, less a {{discount}} discount.

## Structure

> **Ask:** How would you structure your analysis?

- **1. Is the market attractive?**
  - Demand: the fertilizer plant's hydrogen use, other future buyers
  - Policy: subsidy (size and duration), carbon price path
  - Competitors: gray hydrogen today, other green suppliers later
- **2. Does the project pay?**
  - Green cost per kg = power price × kWh per kg + capital recovery per kg + O&M per kg
  - Buyer's alternative = gray production cost + carbon cost
  - Margin = sale price − (green cost − subsidy), year by year over the life
- **3. Can Northfield win?**
  - What it brings: cheap wind power, grid connection, experience building large plants
  - What it lacks: hydrogen operations, chemical-industry customers
- **4. How should it enter?**
  - Sell year by year at the buyer's cost, sign a long-term offtake contract (an agreement to buy a set volume of hydrogen for many years), or form a joint venture with the fertilizer company
- **5. Risks:** policy duration, power price, running hours, electrolyzer performance

Hypothesis: *"Green hydrogen usually costs several times gray hydrogen. If this project looks profitable, I'd want to know which assumption is doing the work, probably the subsidy or the carbon price, and whether it lasts the whole life of the plant."*

## Math walkthrough

> **Ask:** What does green hydrogen cost per kg, how does it compare with the fertilizer plant's alternative, and does the business plan hold up once you see Exhibit 3?

**1. Output.**
Electricity: 100 MW × 5,000 hours = {{energy_mwh}}. Hydrogen: 500,000,000 kWh ÷ 50 kWh/kg = **{{h2_mkg}}** a year, {{plant_share}} of the plant's needs.

**2. Green cost per kg (Exhibit 1).**
- Power: $0.04/kWh × 50 kWh = **{{power_kg}}** (using the {{power_price}} wholesale value, not the retail tariff)
- Capital: 100,000 kW × $1,500 = {{capex}}; × 10% = {{cap_charge}} a year ÷ 10M kg = **{{capex_kg}}**
- O&M: $5M ÷ 10M kg = **{{om_kg}}**
- Total **{{green_cost}}**, with power {{power_share}} of the cost.

**3. The buyer's alternative (Exhibit 2).**
Gray hydrogen: $4 × 0.2 + $0.40 = **{{gray_cost}}**. Carbon: 10 kg × $50/tonne = {{carbon_kg_now}}. Total **{{gray_total_now}}**.

**4. The business plan.**
Price: $1.70 − $0.10 = {{price_now}}. Cost after subsidy: $4.00 − $3.00 = {{green_net}}. Margin {{margin_plan}} × 10M kg = **{{profit_plan}}** a year, or **{{plan_life}}** over {{life}}.

**5. Which assumption is too optimistic? (Exhibit 3)**
The subsidy lasts only **{{subsidy_years}}**, but the plan counts it for all {{life}}.
Years 11–20: the carbon cost rises to {{carbon_kg_later}} and the price to $1.20 + $1.50 − $0.10 = {{price_later}}. But without the subsidy the cost is {{green_cost}}, so the margin is **{{margin_later}}**, or {{profit_later}} a year.

| Item | Years 1–10 | Years 11–20 | Lifetime |
|---|---|---|---|
| Profit above capital charge per year | {{profit_plan}} | {{profit_later}} | |
| Total | 10 × $6M | 10 × −$14M | **{{life_total}}** |

The plan overstates lifetime profit by **{{plan_gap}}**: it counted {{subsidy_loss}} of subsidy that will not be paid, partly offset by {{carbon_gain}} from the higher carbon price.

**6. What terms would make it work?**
Averaged over the life, the subsidy is worth $3.00 × 10 ÷ 20 = **{{avg_subsidy}}**. At the plan's {{power_price}} power, a fixed 20-year price must be $4.00 − $1.50 = **{{price_required}}** to cover cost and the capital charge.
But the buyer won't pay more than it expects gray hydrogen plus carbon to cost: $1.20 + 10 kg × $100/tonne = **{{alt_avg}}** (carbon averages {{carbon_avg}}: {{carbon_now}} in years 1–10 and {{carbon_later}} in years 11–20). The required price is **{{price_gap}}** too high, so the price is capped at {{alt_avg}} and the power cost has to give.
Power cost per kg the project can afford = price + subsidy − capital − O&M = $2.20 + $1.50 − $1.50 − $0.50 = **{{power_kg_allowed}}**. At 50 kWh/kg that is $1.70 × 1,000 ÷ 50 = **{{power_needed}}**, {{power_cut}} below the plan's {{power_price}}. Northfield's renewables team could lock that in with a 20-year power purchase agreement from its new wind farm.
The contract should be take-or-pay (the buyer pays for the agreed volume whether or not it takes it), so Northfield is not left with unsold hydrogen.

## Synthesis

> **Ask:** What is your recommendation to Northfield's CEO?

**Northfield should not build on the current business plan: the subsidy lasts {{subsidy_years}}, not {{life}}, so a project shown earning {{plan_life}} over its life actually loses {{life_loss}}. It should build only if it secures power at about {{power_needed}} or less, for example through a long-term power purchase agreement with its new wind farm, and signs a 20-year take-or-pay contract at the buyer's {{alt_avg}}. Without that cheaper power the project would need {{price_required}}, which the buyer won't pay.**

| Lifetime profit above the capital charge | Amount |
|---|---|
| Business plan | {{plan_life}} |
| Subsidy not paid in years 11–20 | −{{subsidy_loss}} |
| Higher carbon price in years 11–20 | +{{carbon_gain}} |
| **Corrected** | **{{life_total}}** |

1. **Green hydrogen costs {{green_cost}} against {{gray_total_now}} for gray plus carbon today.** Only the subsidy makes it competitive, and only for half the plant's life.
2. **Selling year by year at the buyer's cost leaves Northfield with all the risk:** when the subsidy ends, the price does not cover the cost.
3. **The buyer caps the price, so power decides the go:** a fixed 20-year price spreads the subsidy over the whole life, but at {{power_price}} power the project needs {{price_required}}, {{price_gap}} above the {{alt_avg}} the buyer will pay. Power at {{power_needed}} or less closes that gap.

**Risks and next steps:** running hours matter, since fewer hours raise the capital cost per kg, so test the plan at 4,000 hours; check the fertilizer company's credit for a 20-year contract; ask whether the subsidy could be extended, but don't count on it; consider a joint venture in which the fertilizer company shares the investment and the risk; make the go decision conditional on the wind power price: commit no capital until power is locked in at {{power_needed}} or less.

## Common mistakes

- Using the {{retail_tariff}} retail tariff for power, which makes green hydrogen look hopeless, or ignoring capital recovery and making it look cheap.
- Taking the plan's {{profit_plan}} a year at face value without asking how long the subsidy lasts.
- Assuming a rising carbon price will rescue the project. It adds {{carbon_gain}} but the subsidy loss is {{subsidy_loss}}.
- Answering only "no" instead of saying under what terms the project would work.

## What top candidates do differently

- Build the cost per kg from its parts and notice that power is {{power_share}} of it.
- Ask about the subsidy's duration before running the numbers.
- Turn the answer into conditions: the contract price the buyer will accept and the power price that makes the project pay at it.
- Point out that a fixed long-term price shifts risk between the two parties, which is the real negotiation.

## Creative question

If Northfield wants to be in the hydrogen business for the long term, what else could it do to make green hydrogen cheaper or more valuable?

## Model answer

Organize ideas around **cost, revenue and risk**:

- **Lower cost:** pair the electrolyzer with dedicated wind and solar to cut the power price; run more hours by combining several power sources; buy electrolyzers in volume across several projects; sell the oxygen by-product.
- **Higher revenue:** help the fertilizer company sell "low-carbon ammonia" at a premium to food companies with emission targets; offer grid services by turning the electrolyzer down when power is scarce.
- **Lower risk:** sign a contract-for-difference with the buyer (a contract that settles the difference between an agreed price and the market price) so neither side carries all the carbon-price risk; bring in the fertilizer company as a joint-venture partner; build in phases, starting smaller.

A top candidate prioritizes: "Cheaper power is the biggest lever, because it is half the cost. A dedicated wind farm at a fixed price both lowers the cost and removes the power-price risk for 20 years."
