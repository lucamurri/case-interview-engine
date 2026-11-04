---
id: battery-storage-texas-entry
title: "Storing the Sun: A Battery-Storage Developer Entering Texas"
client: "Halden Energy (fictional), a European developer of grid-scale batteries"
summary: "A European battery developer wants to build its first US project in Texas. The headline payback looks great — until you test how long today's revenues will last."
industry: energy
sub_industry: "Power markets / energy storage"
type: market-entry
difficulty: advanced
format: candidate-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real market data.
inputs:
  power_mw:          { value: 100,  unit: "MW",        label: "Project power rating" }
  duration_h:        { value: 2,    unit: "hours",     label: "Storage duration at full power" }
  cycles:            { value: 300,  unit: "cycles/year", label: "Full charge–discharge cycles per year" }
  spread:            { value: 40,   unit: "$/MWh",     label: "Average net price spread captured (after losses)" }
  anc_price_now:     { value: 60,   unit: "$/kW-year", label: "Ancillary-services revenue today" }
  anc_price_later:   { value: 30,   unit: "$/kW-year", label: "Ancillary-services revenue from year 3 (forecast)" }
  scarcity_rev:      { value: 3.0,  unit: "$M",        label: "Scarcity-event revenue per year (average)", decimals: 1 }
  om_cost:           { value: 1.6,  unit: "$M",        label: "Fixed operating & maintenance cost per year", decimals: 1 }
  capex_kwh:         { value: 300,  unit: "$/kWh",     label: "Installed cost per kWh of storage" }
  toll_price:        { value: 9,    unit: "$/kW-month", label: "Tolling contract price offered" }
  hurdle_years:      { value: 7,    unit: "years",     label: "Halden's maximum payback period" }
  horizon:           { value: 10,   unit: "years",     label: "Comparison horizon (= tolling contract length)" }
  years_full_anc:    { value: 2,    unit: "years",     label: "Years before ancillary prices fall" }
  storage_gw_2025:   { value: 13,   unit: "GW",        label: "Battery capacity installed in Texas, 2025" }
  anc_need_gw:       { value: 4,    unit: "GW",        label: "Grid's ancillary-services requirement" }

calculations:
  # --- Market ---
  - { id: oversupply, label: "Installed storage vs. ancillary need", formula: "storage_gw_2025 / anc_need_gw", expected: 3.25, unit: "x" }
  # --- Project size and cost ---
  - { id: energy_mwh, label: "Energy capacity", formula: "power_mw * duration_h", expected: 200, unit: "MWh" }
  - { id: energy_kwh, label: "Energy capacity in kWh", formula: "energy_mwh * 1000", expected: 200000, unit: "kWh" }
  - { id: capex, label: "Upfront investment", formula: "energy_mwh * 1000 * capex_kwh / 1e6", expected: 60, unit: "$M" }
  # --- Merchant revenues today ---
  - { id: arb_rev, label: "Energy arbitrage revenue per year", formula: "energy_mwh * cycles * spread / 1e6", expected: 2.4, unit: "$M", decimals: 1 }
  - { id: anc_rev_now, label: "Ancillary revenue per year, today", formula: "power_mw * 1000 * anc_price_now / 1e6", expected: 6.0, unit: "$M", decimals: 1 }
  - { id: merchant_rev_now, label: "Total merchant revenue per year, today", formula: "arb_rev + anc_rev_now + scarcity_rev", expected: 11.4, unit: "$M", decimals: 1 }
  - { id: ebitda_now, label: "Operating cash flow per year, today", formula: "merchant_rev_now - om_cost", expected: 9.8, unit: "$M", decimals: 1 }
  - { id: payback_naive, label: "Payback if today's revenues lasted", formula: "capex / ebitda_now", expected: 6.12, unit: "years", decimals: 1 }
  # --- Merchant revenues after ancillary prices fall ---
  - { id: anc_rev_later, label: "Ancillary revenue per year, from year 3", formula: "power_mw * 1000 * anc_price_later / 1e6", expected: 3.0, unit: "$M", decimals: 1 }
  - { id: ebitda_later, label: "Operating cash flow per year, from year 3", formula: "arb_rev + anc_rev_later + scarcity_rev - om_cost", expected: 6.8, unit: "$M", decimals: 1 }
  - { id: cash_2y, label: "Cash recovered in the first two years", formula: "years_full_anc * ebitda_now", expected: 19.6, unit: "$M", decimals: 1 }
  - { id: remaining_capex, label: "Investment still to recover after two years", formula: "capex - cash_2y", expected: 40.4, unit: "$M", decimals: 1 }
  - { id: years_after, label: "Further years needed at the lower cash flow", formula: "remaining_capex / ebitda_later", expected: 5.94, unit: "years", decimals: 1 }
  - { id: payback_merchant, label: "Realistic merchant payback", formula: "years_full_anc + (capex - years_full_anc * ebitda_now) / ebitda_later", expected: 7.94, unit: "years", decimals: 1 }
  # --- Tolling contract ---
  - { id: toll_rev, label: "Tolling revenue per year", formula: "power_mw * 1000 * toll_price * 12 / 1e6", expected: 10.8, unit: "$M", decimals: 1 }
  - { id: ebitda_toll, label: "Operating cash flow per year, tolled", formula: "toll_rev - om_cost", expected: 9.2, unit: "$M", decimals: 1 }
  - { id: payback_toll, label: "Tolled payback", formula: "capex / ebitda_toll", expected: 6.52, unit: "years", decimals: 1 }
  - { id: cash_needed, label: "Annual cash needed to pay back within the hurdle", formula: "capex / hurdle_years", expected: 8.571, unit: "$M", decimals: 2 }
  - { id: rev_needed, label: "Annual revenue needed (cash + O&M)", formula: "cash_needed + om_cost", expected: 10.171, unit: "$M", decimals: 2 }
  - { id: min_toll_price, label: "Lowest toll price that meets the 7-year hurdle", formula: "(capex / hurdle_years + om_cost) * 1e6 / (power_mw * 1000 * 12)", expected: 8.48, unit: "$/kW-month" }
  # --- 10-year comparison ---
  - { id: cash10_merchant, label: "10-year operating cash, merchant", formula: "years_full_anc * ebitda_now + (horizon - years_full_anc) * ebitda_later", expected: 74.0, unit: "$M" }
  - { id: cash10_toll, label: "10-year operating cash, tolled", formula: "horizon * ebitda_toll", expected: 92, unit: "$M" }
  - { id: toll_advantage, label: "Tolling advantage over 10 years", formula: "cash10_toll - cash10_merchant", expected: 18, unit: "$M" }

answer:
  calc: payback_toll
  headline: "Enter Texas, but sign the tolling contract: payback {{payback_toll}} versus ~{{payback_merchant}} on a merchant basis."

exhibits:
  - id: exhibit-1
    title: "Battery storage installed on the Texas grid (GW)"
    kind: bar
    unit: "GW"
    decimals: 0
    ask: "What does this chart suggest about the market?"
    data:
      - { label: "2022", value: 3 }
      - { label: "2023", value: 5 }
      - { label: "2024", value: 9 }
      - { label: "2025", value: storage_gw_2025 }
    reference: { value: 4, label: "Ancillary-services requirement" }
    note: "Illustrative data created for this practice case; not official grid statistics."
    insight: |
      Storage has grown fast and is now about {{oversupply}} the amount of
      ancillary services the grid needs. Batteries will have to compete for a
      fixed pool of ancillary revenue, so those prices should fall — today's
      revenue mix is not durable.
  - id: exhibit-2
    title: "Merchant revenue and cost assumptions for a 100 MW / 2-hour project"
    kind: table
    ask: "The client's analysts prepared these assumptions. Does the project meet Halden's hurdle?"
    columns: ["Item", "Assumption"]
    rows:
      - ["Energy arbitrage", "{{cycles}}, average net spread {{spread}}"]
      - ["Ancillary services", "{{anc_price_now}} today; analysts forecast {{anc_price_later}} from year 3"]
      - ["Scarcity events (summer price spikes)", "~{{scarcity_rev}} per year on average — highly variable"]
      - ["Fixed operating & maintenance", "{{om_cost}} per year"]
      - ["Installed cost", "{{capex_kwh}}"]
    note: "Illustrative data created for this practice case."
  - id: exhibit-3
    title: "Tolling offer from a Texas electricity retailer"
    kind: table
    ask: "A retailer offers to rent the battery. Should Halden take it?"
    columns: ["Term", "Detail"]
    rows:
      - ["Price", "{{toll_price}} for the full {{power_mw}}"]
      - ["Length", "{{horizon}}"]
      - ["Who earns market revenues", "The retailer keeps all arbitrage, ancillary and scarcity revenue"]
      - ["Halden's obligations", "Build and operate the battery; guarantee 95% availability"]
    note: "Illustrative data created for this practice case."
    insight: |
      A toll swaps uncertain merchant revenue for a fixed fee. The question is
      whether the fixed fee beats the *realistic* merchant case, not today's.
---

## Prompt

Our client, Halden Energy, develops and operates large batteries that connect to the power grid. It has built about 1 GW of projects in Europe and now wants to enter the US, starting with **Texas**, which has one of the fastest-growing battery markets in the world.

Halden's first project would be a **100 MW, 2-hour battery**. The board has asked us: **should Halden enter the Texas market with this project, and if so, how?**

## Clarifying information

- Q: What is Halden's objective and investment criterion?
  A: Build a profitable US platform over five years. Each project must pay back its investment within **{{hurdle_years}}**.
- Q: How does a battery make money in Texas?
  A: Three ways: buying power when it is cheap and selling when it is expensive (*arbitrage*); being paid to stand ready to stabilize the grid (*ancillary services*); and selling during rare extreme price spikes (*scarcity events*).
- Q: Why Texas rather than another state?
  A: Texas has a large, fast-growing grid with lots of solar and wind, a market that is open to independent battery owners, and quick permitting.
- Q: Does Halden have any US presence?
  A: No US team, but it has a site option and a grid connection agreement for this project.
- Q: Are there contracted alternatives to selling into the market?
  A: Yes — a local electricity retailer has offered a tolling contract (it would rent the battery for a fixed fee). Details are available if the candidate asks.
- Q: Should we use a discount rate / NPV?
  A: Halden screens projects on simple payback; a 10-year cash comparison is fine for anything else.

## Structure

> **Ask:** How would you structure your analysis?

A market-entry structure that ends in a decision about **how** to enter, not only **whether**:

- **1. Is the market attractive?**
  - Size and growth of Texas battery demand
  - Revenue streams (arbitrage, ancillary, scarcity) and how durable each one is
  - Competition: how many batteries are being built
  - Regulation and grid-connection rules
- **2. Does the first project make money?**
  - Revenue per year, by stream, today and in future
  - Upfront cost and operating cost
  - Payback versus the hurdle of {{hurdle_years}}
- **3. Can Halden win?**
  - Capabilities it brings from Europe (engineering, operations, supplier deals)
  - Gaps: US team, trading know-how, relationships
- **4. How should it enter?**
  - Build and sell into the market (merchant)
  - Build under a contract (tolling) that fixes revenue
  - Partner or acquire a local developer
- **5. Risks and mitigations**

Top candidates flag early that **revenue durability** is the crux: a fast-growing market attracts competitors, and battery revenues fall as more batteries compete for the same pool.

## Math walkthrough

> **Ask:** Does the project meet Halden's payback hurdle of {{hurdle_years}} — on a merchant basis and under the tolling offer?

**1. Size and cost.**
Energy = 100 MW × 2 h = **{{energy_mwh}}** = {{energy_kwh}}. Investment = 200,000 kWh × $300 = **{{capex}}**.

**2. Merchant revenue today.**
- Arbitrage: 200 MWh × 300 cycles × $40 = **{{arb_rev}}**
- Ancillary: 100,000 kW × $60 = **{{anc_rev_now}}**
- Scarcity: **{{scarcity_rev}}**
- Total **{{merchant_rev_now}}** − O&M {{om_cost}} = **{{ebitda_now}}** of cash a year.

Naive payback = $60M ÷ $9.8M ≈ **{{payback_naive}}** — this looks like it clears the hurdle. *This is the trap.*

**3. Realistic merchant case (Exhibit 1 + analyst forecast).**
From year 3, ancillary revenue halves to {{anc_rev_later}}, so annual cash = $2.4M + $3.0M + $3.0M − $1.6M = **{{ebitda_later}}**.
After two years Halden has recovered 2 × $9.8M = {{cash_2y}}, leaving {{remaining_capex}} ÷ {{ebitda_later}} ≈ {{years_after}} to go.
Payback ≈ **{{payback_merchant}}** — it **fails** the hurdle of {{hurdle_years}}.

**4. Tolling offer (Exhibit 3).**
Revenue = 100,000 kW × $9 × 12 = **{{toll_rev}}**; cash = $10.8M − $1.6M = **{{ebitda_toll}}**.
Payback = $60M ÷ $9.2M ≈ **{{payback_toll}}** — it **passes**.

**5. Negotiation floor.**
To pay back in 7 years Halden needs $60M ÷ 7 ≈ {{cash_needed}} of cash a year, i.e. {{rev_needed}} of revenue (adding back O&M), i.e. **~{{min_toll_price:2}}**. Any toll above that clears the hurdle.

**6. Ten-year comparison.**
Merchant: 2 × $9.8M + 8 × $6.8M = **{{cash10_merchant}}**. Tolled: 10 × $9.2M = **{{cash10_toll}}**. The toll is worth about **{{toll_advantage}}** more, unless scarcity revenue turns out far higher than average.

## Synthesis

> **Ask:** What is your recommendation to the board?

**Halden should enter Texas with this project, but under the tolling contract rather than as a pure merchant plant: the toll pays back in {{payback_toll}}, inside the hurdle of {{hurdle_years}}, while the merchant case only pays back in ~{{payback_merchant}} once ancillary prices fall.**

1. **The market is attractive but crowding:** installed storage is already {{oversupply}} the grid's ancillary need, so the revenue stream that makes today's numbers look good will shrink.
2. **The toll de-risks the first project:** {{cash10_toll}} of cash over ten years versus {{cash10_merchant}} merchant, and a predictable revenue line helps Halden finance the project.
3. **It buys time to learn:** Halden can build a US team and trading capability on a contracted asset, then take merchant exposure on later projects.

**Risks and next steps:** check the retailer's credit strength; negotiate the price (floor ~{{min_toll_price:2}}) and availability penalties; stress-test scarcity revenue in hot and mild summers; explore longer-duration (4-hour) designs that rely less on ancillary revenue.

## Common mistakes

- Stopping at the naive {{payback_naive}} payback and recommending entry on a merchant basis without asking whether today's revenues will last.
- Mixing up **MW** (power, how fast the battery can deliver) and **MWh** (energy, how much it stores). Arbitrage scales with MWh; ancillary payments scale with MW.
- Treating the tolling offer as "free money" without noting that Halden gives up all upside from scarcity events.
- Answering only "yes, enter" without saying **how** — entry mode is half the question in a market-entry case.

## What top candidates do differently

- Read Exhibit 1 as a **competition** chart, not a growth chart: "More batteries chasing a fixed {{anc_need_gw}} requirement means prices fall."
- Calculate the break-even toll price, which turns the answer into a negotiating position.
- Separate the decision on **this project** from the decision on **the platform**: contract the first one, keep options open for later ones.
- Mention financing: contracted revenue usually lets a developer borrow more cheaply.

## Creative question

Beyond this single project, how could Halden build a lasting competitive advantage in the Texas market?

## Model answer

Strong answers think about what is hard to copy:

- **Better trading:** an in-house optimization and trading team (or software) that captures more of the arbitrage and scarcity value than competitors — the main differentiator once ancillary revenues fall.
- **Better sites:** secure grid-connection points near large solar farms or congested areas where price spreads are largest.
- **Lower cost:** use Halden's European supplier relationships and a standard design to build cheaper and faster.
- **Partnerships:** co-locate with solar developers, or offer tolls to data-center operators who need reliable power.

A top candidate prioritizes trading capability: "Hardware is becoming a commodity; the value is shifting to how well you operate it."
