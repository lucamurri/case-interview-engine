---
id: oil-major-ev-charging-acquisition
title: "Pump to Plug: An Oil Major Acquiring an EV-Charging Network"
client: "Marrock Energy (fictional), a US integrated oil company with 1,500 branded fuel stations"
summary: "An oil major is offered a fast-charging network at 30x today's EBITDA. Value the growth, separate real synergies from wishful ones, and decide whether $600M is a fair price."
industry: energy
sub_industry: "EV charging / energy transition M&A"
type: m-and-a
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real market or company data.
inputs:
  chargers:           { value: 2000, unit: "chargers", label: "Lumaro fast chargers in operation" }
  mwh_now:            { value: 120,  unit: "MWh",  label: "Energy sold per charger per year, today" }
  mwh_y5:             { value: 240,  unit: "MWh",  label: "Energy sold per charger per year, year 5 (base forecast)" }
  mwh_low:            { value: 180,  unit: "MWh",  label: "Energy sold per charger per year, year 5 (slow EV adoption)" }
  margin_kwh:         { value: 0.20, unit: "$/kWh", label: "Gross margin per kWh (price minus electricity cost)", decimals: 2 }
  site_opex:          { value: 14,   unit: "$K",   label: "Operating cost per charger per year at leased sites (rent, maintenance, software)" }
  ask_price:          { value: 600,  unit: "$M",   label: "Asking price for Lumaro (enterprise value)" }
  exit_multiple:      { value: 10,   unit: "x",    label: "Value multiple on year-5 EBITDA (mature charging network)" }
  discount_rate:      { value: 0.10, unit: "%",    label: "Marrock's discount rate for new-energy investments" }
  years:              { value: 5,    unit: "years", label: "Years until the network matures" }
  cost_syn:           { value: 8,    unit: "$M",   label: "Annual cost synergies (merge Marrock's e-mobility unit, shared overhead)" }
  cost_syn_multiple:  { value: 10,   unit: "x",    label: "Multiple used to value cost synergies" }
  station_chargers:   { value: 1000, unit: "chargers", label: "Chargers Lumaro would install at Marrock stations" }
  capex_charger:      { value: 100,  unit: "$K",   label: "Installed cost per new charger" }
  station_opex:       { value: 8,    unit: "$K",   label: "Operating cost per charger per year at Marrock stations (no rent)" }
  session_kwh:        { value: 30,   unit: "kWh",  label: "Average energy per charging session" }
  store_profit:       { value: 3,    unit: "$/session", label: "Store gross profit per charging session at a Marrock station" }

calculations:
  # --- Lumaro today ---
  - { id: gm_now, label: "Gross margin per charger per year, today", formula: "mwh_now * margin_kwh", expected: 24, unit: "$K" }
  - { id: ebitda_charger_now, label: "EBITDA per charger, today", formula: "gm_now - site_opex", expected: 10, unit: "$K" }
  - { id: ebitda_now, label: "Lumaro EBITDA, today", formula: "chargers * ebitda_charger_now / 1000", expected: 20, unit: "$M" }
  - { id: trailing_multiple, label: "Asking price / today's EBITDA", formula: "ask_price / ebitda_now", expected: 30, unit: "x" }
  # --- Lumaro in year 5, standalone ---
  - { id: gm_y5, label: "Gross margin per charger per year, year 5", formula: "mwh_y5 * margin_kwh", expected: 48, unit: "$K" }
  - { id: ebitda_charger_y5, label: "EBITDA per charger, year 5", formula: "gm_y5 - site_opex", expected: 34, unit: "$K" }
  - { id: ebitda_y5, label: "Lumaro EBITDA, year 5", formula: "chargers * ebitda_charger_y5 / 1000", expected: 68, unit: "$M" }
  - { id: ebitda_growth, label: "Growth in EBITDA per charger, today to year 5", formula: "ebitda_charger_y5 / ebitda_charger_now", expected: 3.4, unit: "x", decimals: 1 }
  - { id: forward_multiple, label: "Asking price / year-5 EBITDA", formula: "ask_price / ebitda_y5", expected: 8.82, unit: "x", decimals: 1 }
  - { id: value_y5, label: "Value of Lumaro in year 5", formula: "ebitda_y5 * exit_multiple", expected: 680, unit: "$M" }
  - { id: pv_factor, label: "Discount factor for year 5", formula: "1 / (1 + discount_rate) ^ years", expected: 0.6209, unit: "", decimals: 2 }
  - { id: standalone, label: "Standalone value of Lumaro today", formula: "value_y5 / (1 + discount_rate) ^ years", expected: 422.2, unit: "$M" }
  # --- Synergies ---
  - { id: cost_syn_value, label: "Value of cost synergies", formula: "cost_syn * cost_syn_multiple", expected: 80, unit: "$M" }
  - { id: sessions, label: "Charging sessions per station charger per year, year 5", formula: "mwh_y5 * 1000 / session_kwh", expected: 8000, unit: "sessions" }
  - { id: store_charger, label: "Store profit per station charger per year", formula: "sessions * store_profit / 1000", expected: 24, unit: "$K" }
  - { id: station_ebitda_charger, label: "EBITDA per station charger, year 5", formula: "gm_y5 + store_charger - station_opex", expected: 64, unit: "$K" }
  - { id: station_ebitda, label: "Station rollout EBITDA, year 5", formula: "station_chargers * station_ebitda_charger / 1000", expected: 64, unit: "$M" }
  - { id: station_value, label: "Value of the station rollout today (before capex)", formula: "station_ebitda * exit_multiple / (1 + discount_rate) ^ years", expected: 397.4, unit: "$M" }
  - { id: station_capex, label: "Capex for the station rollout", formula: "station_chargers * capex_charger / 1000", expected: 100, unit: "$M" }
  - { id: station_npv, label: "Net value of the station rollout", formula: "station_value - station_capex", expected: 297.4, unit: "$M" }
  # --- Verdict ---
  - { id: value_no_rollout, label: "Value to Marrock without the rollout", formula: "standalone + cost_syn_value", expected: 502.2, unit: "$M" }
  - { id: gap_no_rollout, label: "Shortfall versus the asking price without the rollout", formula: "ask_price - value_no_rollout", expected: 97.8, unit: "$M", decimals: 0 }
  - { id: value_total, label: "Total value to Marrock", formula: "standalone + cost_syn_value + station_npv", expected: 799.6, unit: "$M" }
  - { id: deal_npv, label: "Value created at the asking price", formula: "value_total - ask_price", expected: 199.6, unit: "$M" }
  # --- Slow EV adoption ---
  - { id: ebitda_y5_low, label: "Lumaro EBITDA, year 5, slow adoption", formula: "chargers * (mwh_low * margin_kwh - site_opex) / 1000", expected: 44, unit: "$M" }
  - { id: standalone_low, label: "Standalone value, slow adoption", formula: "ebitda_y5_low * exit_multiple / (1 + discount_rate) ^ years", expected: 273.2, unit: "$M" }
  - { id: station_ebitda_low, label: "Station rollout EBITDA, year 5, slow adoption", formula: "station_chargers * (mwh_low * margin_kwh + mwh_low * store_profit / session_kwh - station_opex) / 1000", expected: 46, unit: "$M" }
  - { id: station_npv_low, label: "Net value of the station rollout, slow adoption", formula: "station_ebitda_low * exit_multiple / (1 + discount_rate) ^ years - station_capex", expected: 185.6, unit: "$M" }
  - { id: value_low, label: "Total value to Marrock, slow adoption", formula: "standalone_low + cost_syn_value + station_npv_low", expected: 538.8, unit: "$M" }
  - { id: loss_low, label: "Value lost at the asking price, slow adoption", formula: "ask_price - value_low", expected: 61.2, unit: "$M", decimals: 0 }

answer:
  calc: value_total
  headline: "Lumaro is worth ~{{value_total}} to Marrock versus a {{ask_price}} price — but only with the station rollout; on its own plus cost synergies it is worth ~{{value_no_rollout}}."

exhibits:
  - id: exhibit-1
    title: "Lumaro Charge today"
    kind: table
    ask: "Lumaro's owners want $600M. What do you make of that price?"
    columns: ["Metric", "Value"]
    rows:
      - ["Fast chargers in operation", "{{chargers}} at about 350 leased sites (shopping centers, supermarkets)"]
      - ["Energy sold per charger per year", "{{mwh_now}}"]
      - ["Gross margin (charging price minus electricity cost)", "{{margin_kwh}}"]
      - ["Operating cost per charger per year (rent, maintenance, software)", "{{site_opex}}"]
      - ["EBITDA", "{{ebitda_now}}"]
      - ["Asking price", "{{ask_price}}"]
    note: "Illustrative data created for this practice case. Lumaro Charge is fictional."
    insight: |
      The price is {{trailing_multiple}} today's EBITDA — very expensive for
      infrastructure. It only makes sense if each charger sells much more
      energy in future, so utilization is the key question.
  - id: exhibit-2
    title: "Energy sold per Lumaro charger per year (MWh) — management forecast"
    kind: bar
    unit: "MWh"
    decimals: 0
    ask: "Here is management's utilization forecast. What does it mean for value?"
    data:
      - { label: "2026", value: mwh_now }
      - { label: "2027", value: 140 }
      - { label: "2028", value: 165 }
      - { label: "2029", value: 195 }
      - { label: "2030", value: 220 }
      - { label: "2031", value: mwh_y5 }
    reference: { value: mwh_low, label: "2031 if EV adoption is slow" }
    note: "Illustrative data created for this practice case; not a market forecast."
    insight: |
      Fixed costs per charger barely change as utilization rises, so if energy
      sold per charger doubles, EBITDA per charger grows {{ebitda_growth}}. That operating
      leverage cuts both ways if EV adoption disappoints.
  - id: exhibit-3
    title: "Synergy case prepared by Marrock's strategy team"
    kind: table
    ask: "Marrock's strategy team says the synergies make the deal a bargain. Do you agree?"
    columns: ["Synergy", "Assumption"]
    rows:
      - ["Cost synergies", "{{cost_syn}} per year from merging Marrock's small e-mobility unit and overhead; value at {{cost_syn_multiple}}"]
      - ["Station rollout: chargers", "Lumaro installs {{station_chargers}} at Marrock highway stations, at {{capex_charger}} each"]
      - ["Station rollout: utilization", "Same as Lumaro's network: {{mwh_y5}} per charger in year 5"]
      - ["Station rollout: operating cost", "{{station_opex}} per charger per year (Marrock owns the land, so no rent)"]
      - ["Station rollout: store sales", "Drivers spend ~25 minutes on site; {{store_profit}} of store gross profit; average session {{session_kwh}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      A charger on Marrock's own land costs less to run and earns store profit
      on top. But these are synergies Marrock creates; the question is how much
      of them it should pay to the seller.
---

## Prompt

Our client, Marrock Energy, is a US integrated oil company. Besides oil production and refining, it owns **1,500 branded fuel stations** along highways, most with a convenience store. Gasoline volumes at those stations are expected to decline slowly as electric vehicles (EVs) gain share.

Marrock has been offered the chance to buy **Lumaro Charge**, a fast-growing public fast-charging network with {{chargers}}. Lumaro's owners, a venture-capital-backed founding team, are asking **{{ask_price}}**.

Marrock's CEO asks us: **is Lumaro worth {{ask_price}} to Marrock, and should we buy it?**

## Clarifying information

- Q: Why does Marrock want to own EV charging?
  A: To keep drivers — and their store spending — coming to Marrock sites as cars electrify, and to build a profitable low-carbon business that investors will value.
- Q: How should we value a business that is still growing fast?
  A: Estimate EBITDA after {{years}}, when the network is roughly mature; value it at **{{exit_multiple}} EBITDA**, like other mature infrastructure; then discount back to today at **{{discount_rate}}** a year. For simplicity, ignore the cash earned before then; it roughly covers software, customer acquisition and charger upgrades.
- Q: How does a charger make money?
  A: Lumaro buys electricity and resells it to drivers. Gross margin is about **{{margin_kwh}}**. Costs per charger (site rent, maintenance, software, card fees) are mostly fixed.
- Q: Could Marrock simply install chargers at its own stations without buying Lumaro?
  A: It tried: a 40-charger pilot had poor utilization because Marrock has no charging app, no customer base among EV drivers and no experience running chargers. Building those capabilities in-house would take an estimated three years.
- Q: Are there competing bidders?
  A: Lumaro's owners say a utility is also interested, but nobody has seen a firm offer.
- Q: Should we include the cost of new chargers?
  A: Yes, for any chargers beyond the existing network. Treat that spending as happening upfront and don't discount it.

## Structure

> **Ask:** How would you structure the decision?

Value to Marrock = **standalone value + synergies − cost of achieving them**, compared with the price. Four branches:

- **1. Standalone value of Lumaro**
  - Utilization today and in future (energy sold per charger)
  - Margin per kWh and cost per charger → EBITDA per charger
  - Number of chargers → network EBITDA → value
- **2. Synergies with Marrock**
  - Cost: overlapping teams and overhead
  - Revenue: chargers at Marrock stations (free land, existing grid connection) and extra store sales from drivers who wait while charging
  - Capex and timing needed to capture them
- **3. Price and deal terms**
  - Asking price versus value without and with synergies
  - Which synergies Marrock creates (and should not pay away to the seller)
- **4. Strategic fit and risks**
  - Speed versus building in-house; brand and app capability
  - EV adoption pace, electricity prices, competition from utilities and carmakers' networks

Top candidates say early that **utilization drives everything**: costs per charger are fixed, so profit grows much faster than energy sold.

## Math walkthrough

> **Ask:** First, what is Lumaro worth on its own, using Exhibits 1 and 2? Then value the synergies in Exhibit 3. Finally, what if EV adoption is slow and chargers only reach {{mwh_low}} in year 5?

**1. Today.**
Gross margin per charger = 120 MWh × 1,000 kWh × $0.20 = **{{gm_now}}** a year; less {{site_opex}} of costs = **{{ebitda_charger_now}}**. Across 2,000 chargers, EBITDA = **{{ebitda_now}}** — so the asking price is **{{trailing_multiple}}** today's EBITDA.

**2. Year 5, standalone.**
Gross margin = 240 MWh × $0.20/kWh = **{{gm_y5}}**; less $14K = **{{ebitda_charger_y5}}** per charger.
EBITDA = 2,000 × $34K = **{{ebitda_y5}}**. EBITDA per charger grows {{ebitda_growth}} while energy sold only doubles, because costs are fixed. Against year-5 EBITDA the price is only {{forward_multiple}}.
Value in year 5 = $68M × 10 = {{value_y5}}. Discount factor = 1 ÷ 1.1^5 ≈ 1 ÷ 1.61 ≈ {{pv_factor}}, so standalone value today = $680M × 0.62 ≈ **{{standalone}}**.

**3. Cost synergies.** $8M × 10 = **{{cost_syn_value}}** (they start right away, so no discounting).

**4. Station rollout.**
- Sessions per charger = 240,000 kWh ÷ 30 kWh = {{sessions}}; store profit = 8,000 × $3 = **{{store_charger}}** per charger.
- EBITDA per station charger = $48K + $24K − $8K = **{{station_ebitda_charger}}**; × 1,000 chargers = **{{station_ebitda}}**.
- Value today = $64M × 10 × 0.62 ≈ {{station_value}}; less capex of 1,000 × $100K = {{station_capex}}, net value ≈ **{{station_npv}}**.

**5. Verdict.**
- Without the rollout: {{standalone}} + {{cost_syn_value}} ≈ **{{value_no_rollout}}** — about {{gap_no_rollout}} *below* the asking price.
- With the rollout: {{value_no_rollout}} + {{station_npv}} ≈ **{{value_total}}**, so buying at {{ask_price}} creates about **{{deal_npv}}**.

**6. Slow EV adoption ({{mwh_low}} per charger in year 5).**
- Standalone EBITDA = 2,000 × (180 MWh × $0.20/kWh − $14K) = 2,000 × ($36K − $14K) = 2,000 × $22K = {{ebitda_y5_low}} → value ≈ $440M × 0.62 ≈ **{{standalone_low}}**.
- Station EBITDA = 1,000 × ($36K + $18K store − $8K) = {{station_ebitda_low}} → net value ≈ $460M × 0.62 − $100M ≈ **{{station_npv_low}}**.
- Total ≈ {{standalone_low}} + {{cost_syn_value}} + {{station_npv_low}} ≈ **{{value_low}}** — Marrock would lose about **{{loss_low}}** at the asking price.

## Synthesis

> **Ask:** What do you recommend to Marrock's CEO?

**Marrock should buy Lumaro, but only as the engine for a rollout at its own stations, and should negotiate well below {{ask_price}}: Lumaro plus cost synergies is worth about {{value_no_rollout}}, and the deal only clears its price because of roughly {{station_npv}} of station-rollout value that Marrock itself creates.**

1. **Standalone, the price is too high:** {{trailing_multiple}} today's EBITDA; even crediting management's utilization forecast, Lumaro is worth about {{standalone}}, or {{value_no_rollout}} with cost synergies.
2. **The real prize is Marrock's own sites:** free land, existing grid connections and store sales make a station charger worth far more than a leased-site charger ({{station_ebitda_charger}} versus {{ebitda_charger_y5}} of EBITDA in year 5). Lumaro's app, customers and operating know-how make that rollout possible years sooner.
3. **It is a bet on EV adoption:** if utilization reaches only {{mwh_low}}, the deal loses about {{loss_low}} at the asking price.

**Negotiation and next steps:** open near {{value_no_rollout}} — the rollout value is Marrock's to keep, not the seller's; if the owners hold out for {{ask_price}}, propose an earn-out tied to utilization so Marrock pays more only if the forecast comes true. Diligence Lumaro's utilization by site, electricity contracts and charger reliability; pilot 50 station chargers before committing the full {{station_capex}}.

## Common mistakes

- Valuing Lumaro on today's EBITDA ({{trailing_multiple}}) and rejecting the deal immediately, without looking at utilization growth.
- Forgetting that costs per charger are fixed, and scaling EBITDA in line with energy sold.
- Counting the station rollout without its {{station_capex}} of capex, or without the store profit that makes it attractive.
- Paying the seller for synergies only the buyer can create. The station rollout is why Marrock should buy — not why it should pay more.
- Mixing up kWh and MWh: 1 MWh is 1,000 kWh, so a margin per kWh times MWh gives thousands of dollars.

## What top candidates do differently

- Point out that 30x trailing EBITDA can still be fair for a business whose profit per charger could grow {{ebitda_growth}} — then test whether it will.
- Ask whether Marrock could build instead of buy, and use the failed pilot to show what Lumaro really brings: capability and speed, not hardware.
- Run the slow-adoption case unprompted and turn it into deal terms (an earn-out).
- Link the deal to Marrock's core business: chargers protect store traffic as fuel volumes decline.

## Creative question

If Marrock buys Lumaro, how could it make its highway stations the place EV drivers *choose* to charge, rather than one option among many?

## Model answer

Organize around the **driver's journey: before, during and after the charge**:

- **Before:** show live charger availability and guaranteed reservations in the Lumaro app; integrate with carmakers' navigation systems so Marrock stations appear on route planning; loyalty pricing that links fuel and charging accounts for households with one car of each.
- **During:** a 25-minute stop is a long store visit — upgrade food service, seating, Wi-Fi and restrooms; offer "charge and eat" bundles; send an app notification when the car is ready.
- **After:** reliability as a promise — chargers that work every time (uptime guarantees, fast repair); clear pricing with no surprise fees.

A top candidate prioritizes reliability and availability: "Drivers forgive a plain store, but not a broken charger. The first investment is uptime, because it is what makes them come back."
