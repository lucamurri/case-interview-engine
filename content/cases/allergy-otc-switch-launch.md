---
id: allergy-otc-switch-launch
title: "From Prescription to Shelf: Taking an Allergy Drug Over the Counter"
client: "Alverin Pharma (fictional), a mid-size pharmaceutical company with a branded prescription allergy tablet"
summary: "A drug company plans to sell an over-the-counter version of its prescription allergy tablet. Weigh retail margins, advertising and the prescriptions it gives up, and compare against what would happen with no switch."
industry: pharma-healthcare
sub_industry: "Consumer health / prescription-to-OTC switch"
type: product-launch
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative: realistic in shape, not real company data.
inputs:
  rx_now:         { value: 5.0,   unit: "million", label: "Prescriptions filled today (one prescription is a 30-day supply)" }
  rx_net:         { value: 60,    unit: "$", label: "Net revenue per prescription today (after rebates and fees)" }
  cogs_rx:        { value: 4,     unit: "$", label: "Cost of goods per prescription or pack" }
  rx_promo:       { value: 30,    unit: "$M", label: "Annual prescription promotion cost (sales force and doctor marketing)" }
  dn_scripts:     { value: 2.4,   unit: "million", label: "Year three, no switch: prescriptions after generics launch" }
  dn_net:         { value: 32,    unit: "$", label: "Year three: net revenue per prescription, with or without a switch" }
  sw_scripts:     { value: 1.0,   unit: "million", label: "Year three, switch: prescriptions that remain (insurers stop covering most)" }
  sw_promo:       { value: 10,    unit: "$M", label: "Year three, switch: prescription promotion that remains" }
  retail:         { value: 24.00, unit: "$", decimals: 2, label: "OTC shelf price per 30-day pack" }
  retail_margin:  { value: 0.30,  unit: "%", label: "Retailer margin on shelf price" }
  dist_fee:       { value: 0.08,  unit: "%", label: "Distributor fee on the retailer's cost" }
  cogs_otc:       { value: 3.00,  unit: "$", decimals: 2, label: "Cost of goods per OTC pack" }
  otc_packs:      { value: 6.0,   unit: "million", label: "OTC packs sold in year three" }
  ad:             { value: 35,    unit: "$M", label: "Annual advertising and trade promotion for the OTC brand" }
  one_time:       { value: 30,    unit: "$M", label: "One-time cost (consumer studies, packaging, regulatory filing, launch)" }
  margin_hi:      { value: 0.35,  unit: "%", label: "Retailer margin the big chains are asking for" }

calculations:
  # --- Prescription business: today, no switch, and switch ---
  - { id: rx_contrib_now, label: "Prescription contribution today", formula: "rx_now * (rx_net - cogs_rx)", expected: 280, unit: "$M" }
  - { id: rx_profit_now, label: "Prescription profit today after promotion", formula: "rx_contrib_now - rx_promo", expected: 250, unit: "$M" }
  - { id: dn_contrib, label: "Prescription contribution in year three with no switch", formula: "dn_scripts * (dn_net - cogs_rx)", expected: 67.2, unit: "$M", decimals: 1 }
  - { id: dn_profit, label: "Year-three profit with no switch", formula: "dn_contrib - rx_promo", expected: 37.2, unit: "$M", decimals: 1 }
  - { id: sw_rx_contrib, label: "Remaining prescription contribution with the switch", formula: "sw_scripts * (dn_net - cogs_rx)", expected: 28, unit: "$M" }
  - { id: sw_rx_profit, label: "Remaining prescription profit with the switch", formula: "sw_rx_contrib - sw_promo", expected: 18, unit: "$M" }
  # --- OTC price chain ---
  - { id: retailer_take, label: "Retailer's share of the shelf price per pack", formula: "retail * retail_margin", expected: 7.2, unit: "$", decimals: 2 }
  - { id: retailer_cost, label: "Retailer's cost per pack", formula: "retail - retailer_take", expected: 16.8, unit: "$", decimals: 2 }
  - { id: dist_take, label: "Distributor's fee per pack", formula: "retailer_cost * dist_fee", expected: 1.344, unit: "$", decimals: 2 }
  - { id: net_otc, label: "Alverin's net revenue per pack", formula: "retailer_cost - dist_take", expected: 15.456, unit: "$", decimals: 2 }
  - { id: otc_unit, label: "Contribution per OTC pack", formula: "net_otc - cogs_otc", expected: 12.456, unit: "$", decimals: 2 }
  - { id: trade_total, label: "Share of the shelf price kept by retailer and distributor", formula: "1 - net_otc / retail", expected: 0.356, unit: "%", decimals: 1 }
  # --- OTC business and net impact ---
  - { id: otc_contrib, label: "OTC contribution in year three", formula: "otc_packs * otc_unit", expected: 74.736, unit: "$M", decimals: 1 }
  - { id: otc_profit, label: "OTC profit after advertising", formula: "otc_contrib - ad", expected: 39.736, unit: "$M", decimals: 1 }
  - { id: sw_total, label: "Year-three profit with the switch (prescription plus OTC)", formula: "sw_rx_profit + otc_profit", expected: 57.736, unit: "$M", decimals: 1 }
  - { id: delta, label: "Gain from the switch against no switch", formula: "sw_total - dn_profit", expected: 20.536, unit: "$M", decimals: 1 }
  - { id: vs_today, label: "Shortfall of switch profit against today's prescription profit", formula: "rx_profit_now - sw_total", expected: 192.264, unit: "$M", decimals: 0 }
  # --- Why: who buys the OTC packs ---
  - { id: from_rx, label: "Former prescription patients buying OTC", formula: "dn_scripts - sw_scripts", expected: 1.4, unit: "million" }
  - { id: new_users, label: "OTC packs bought by other people", formula: "otc_packs - from_rx", expected: 4.6, unit: "million" }
  - { id: new_contrib, label: "Contribution from those other buyers", formula: "new_users * otc_unit", expected: 57.2976, unit: "$M", decimals: 1 }
  - { id: loss_unit, label: "Contribution lost per patient who moves from prescription to OTC", formula: "(dn_net - cogs_rx) - otc_unit", expected: 15.544, unit: "$", decimals: 2 }
  - { id: cannibal, label: "Contribution lost on patients who move", formula: "from_rx * loss_unit", expected: 21.7616, unit: "$M", decimals: 1 }
  - { id: promo_saved, label: "Prescription promotion no longer needed", formula: "rx_promo - sw_promo", expected: 20, unit: "$M" }
  - { id: bridge, label: "Bridge: other buyers, less moved patients, less advertising, plus promotion saved", formula: "new_contrib - cannibal - ad + promo_saved", expected: 20.536, unit: "$M", decimals: 1 }
  # --- Sensitivities ---
  - { id: be_packs, label: "OTC packs needed to match no switch", formula: "(dn_profit - sw_rx_profit + ad) / otc_unit", expected: 4.3513, unit: "million", decimals: 2 }
  - { id: cushion, label: "Cushion between forecast packs and break-even packs", formula: "1 - be_packs / otc_packs", expected: 0.2748, unit: "%", decimals: 0 }
  - { id: net_hi, label: "Alverin's net revenue per pack at the higher retailer margin", formula: "retail * (1 - margin_hi) * (1 - dist_fee)", expected: 14.352, unit: "$", decimals: 2 }
  - { id: unit_hi, label: "Contribution per pack at the higher retailer margin", formula: "net_hi - cogs_otc", expected: 11.352, unit: "$", decimals: 2 }
  - { id: delta_hi, label: "Gain from the switch at the higher retailer margin", formula: "sw_rx_profit + otc_packs * unit_hi - ad - dn_profit", expected: 13.912, unit: "$M", decimals: 1 }
  - { id: payback, label: "Payback on the one-time cost at the forecast gain", formula: "one_time / delta", expected: 1.4609, unit: "years", decimals: 1 }

answer:
  calc: delta
  headline: "Against what would happen with no switch (generic entry), the OTC launch adds {{delta}} a year: {{sw_total}} against {{dn_profit}}. Compared with today's {{rx_profit_now}} it looks like a loss, but today is not the alternative."

exhibits:
  - id: exhibit-1
    title: "Prescription business: today, year three with no switch, year three with a switch"
    kind: table
    ask: "Here is the prescription business. How would you read the three columns?"
    columns: ["Item", "Today", "Year three, no switch", "Year three, with switch (prescription only)"]
    rows:
      - ["Prescriptions", "{{rx_now}}", "{{dn_scripts}}", "{{sw_scripts}}"]
      - ["Net revenue per prescription", "{{rx_net}}", "{{dn_net}}", "{{dn_net}}"]
      - ["Cost of goods per prescription", "{{cogs_rx}}", "{{cogs_rx}}", "{{cogs_rx}}"]
      - ["Promotion", "{{rx_promo}}", "{{rx_promo}}", "{{sw_promo}}"]
      - ["**Profit**", "**{{rx_profit_now}}**", "**{{dn_profit}}**", "**{{sw_rx_profit}}**"]
    note: "Illustrative data created for this practice case. Alverin is fictional. Profit is after cost of goods and promotion. Generic competition arrives within three years whatever Alverin does."
    insight: |
      Prescription profit falls from {{rx_profit_now}} to {{dn_profit}} even with no switch, because
      generics cut volume and net price. The switch is judged against {{dn_profit}}, not {{rx_profit_now}}.
  - id: exhibit-2
    title: "Where the money goes: price chain for one OTC pack"
    kind: table
    ask: "Here is how the shelf price splits along the chain. What do you notice?"
    columns: ["Step", "Per pack"]
    rows:
      - ["Shelf price", "{{retail}}"]
      - ["Retailer margin ({{retail_margin}} of shelf price)", "{{retailer_take}}"]
      - ["Retailer's cost", "{{retailer_cost}}"]
      - ["Distributor fee ({{dist_fee}} of that cost)", "{{dist_take}}"]
      - ["**Alverin's net revenue per pack**", "**{{net_otc}}**"]
      - ["Cost of goods", "{{cogs_otc}}"]
      - ["**Contribution per pack**", "**{{otc_unit}}**"]
    note: "Illustrative data created for this practice case. Shares are typical illustrative values, not quotes."
    insight: |
      Retailer and distributor keep {{trade_total}} of the shelf price. A prescription earned
      {{dn_net}} net; an OTC pack earns only {{net_otc}}, so each patient who moves is worth less.
  - id: exhibit-3
    title: "Year-three profit: no switch against switch"
    kind: bar
    unit: "$M"
    decimals: 1
    ask: "Here are the two year-three outcomes. What would you recommend?"
    data:
      - { label: "No switch (generics arrive)", value: dn_profit }
      - { label: "Prescription part of the switch", value: sw_rx_profit }
      - { label: "OTC part, after advertising", value: otc_profit }
      - { label: "Switch, total", value: sw_total }
    note: "Illustrative data created for this practice case."
    insight: |
      The switch earns {{sw_total}} ({{sw_rx_profit}} from prescriptions and {{otc_profit}} from OTC)
      against {{dn_profit}} with no switch: a gain of {{delta}} a year.
---

## Prompt

Our client is Alverin Pharma, a mid-size pharmaceutical company. Its main product is a branded prescription allergy tablet that fills {{rx_now}} prescriptions a year and earns about {{rx_profit_now}} in profit. Generic versions will arrive within three years.

Alverin is considering an **over-the-counter (OTC) switch**: selling the same tablet without a prescription, on the pharmacy shelf. Consumers can buy it directly, but insurers will stop paying for most prescriptions.

The CEO asks us: **should Alverin launch the OTC version, and what would it do to profit?**

## Clarifying information

- Q: Who approves the switch?
  A: The regulator has told Alverin the switch is likely to be approved. Assume it is approved and that launch happens on time.
- Q: What happens if Alverin does not switch?
  A: Generics launch within three years. By year three, brand prescriptions fall to {{dn_scripts}} and net revenue per prescription to {{dn_net}}.
- Q: What happens to prescriptions if Alverin does switch?
  A: Insurers stop covering most prescriptions, leaving {{sw_scripts}}, at the same net price of {{dn_net}}. Prescription promotion shrinks from {{rx_promo}} to {{sw_promo}}.
- Q: What would the OTC product earn?
  A: A shelf price of {{retail}} per 30-day pack. The retailer keeps {{retail_margin}} and a distributor takes {{dist_fee}} of the retailer's cost. Cost of goods is {{cogs_otc}} per pack.
- Q: How many packs?
  A: The marketing team forecasts {{otc_packs}} packs in year three. One pack is the same 30-day supply as one prescription.
- Q: What does advertising cost?
  A: {{ad}} a year for consumer advertising and trade promotion. There is also {{one_time}} of one-time cost.
- Q: Any pressure on retailer margins?
  A: The largest chains are asking for {{margin_hi}} instead of {{retail_margin}}.

## Structure

> **Ask:** How would you structure the OTC switch decision?

- **1. The right comparison:** what happens with and without the switch (not just today)
- **2. Prescription business**
  - Volume, price and promotion with and without the switch
  - Which patients move to OTC (cannibalization)
- **3. OTC business**
  - Price chain: shelf price, retailer margin, distributor fee, net price
  - Volume: patients who move, people from competing OTC brands, new users
  - Costs: cost of goods, advertising, trade promotion, one-time costs
- **4. Net profit impact:** year-three profit with the switch less year-three profit without
- **5. Risks:** retailer margin pressure, price competition from OTC brands, timing against generics, consumer safety and regulation

A good hypothesis: *"Taking an Rx patient to OTC earns less per patient, so the switch only pays if it brings new buyers and replaces falling prescription profit. The key is the baseline: what would the prescription business earn without the switch?"*

## Math walkthrough

> **Ask:** Calculate year-three profit with and without the switch, and say how much room for error there is.

**1. The baseline without the switch.**
Today the prescription brand earns {{rx_now}} × ({{rx_net}} − {{cogs_rx}}) = {{rx_contrib_now}} of contribution, or **{{rx_profit_now}}** after promotion.
By year three with generics, {{dn_scripts}} × ({{dn_net}} − {{cogs_rx}}) = {{dn_contrib}}, or **{{dn_profit}}** after promotion.

**2. With the switch: prescription part.**
Only {{sw_scripts}} prescriptions remain: {{sw_rx_contrib}} of contribution, or **{{sw_rx_profit}}** after the reduced promotion.

**3. With the switch: OTC part.**
Price chain: shelf {{retail}}, less retailer {{retailer_take}} gives {{retailer_cost}}; less distributor {{dist_take}} gives **{{net_otc}}** to Alverin; less cost of goods leaves **{{otc_unit}}** per pack. Retailer and distributor keep {{trade_total}}.
{{otc_packs}} packs earn {{otc_contrib}}; after {{ad}} of advertising, OTC profit is **{{otc_profit}}**.

**4. Compare.**
With the switch: {{sw_rx_profit}} + {{otc_profit}} = **{{sw_total}}**. Without: **{{dn_profit}}**. The gain is **{{delta}}** a year, and the {{one_time}} one-time cost pays back in about {{payback}} at that rate.
Measured against today's {{rx_profit_now}}, the switch looks {{vs_today}} short. That is the wrong comparison: generics will end today's profit anyway.

**5. Why it works: who buys.**
{{from_rx}} of the OTC packs are former prescription patients, who now earn {{loss_unit}} less each than they would on a prescription: a loss of {{cannibal}}. The other {{new_users}} packs come from people who were not buying the brand and contribute {{new_contrib}}.
Check: {{new_contrib}} − {{cannibal}} − {{ad}} + {{promo_saved}} of promotion saved = **{{bridge}}**.

**6. Room for error.**
Break-even is **{{be_packs}}** packs, so the forecast of {{otc_packs}} has a cushion of {{cushion}}.
If the chains win a {{margin_hi}} margin, contribution per pack falls to {{unit_hi}} and the gain falls to **{{delta_hi}}**.

## Synthesis

> **Ask:** What would you tell the CEO?

**Alverin should launch the OTC switch. Against the realistic alternative (generics eroding the brand), it lifts year-three profit by {{delta}}, from {{dn_profit}} to {{sw_total}}, with a {{cushion}} cushion on volume, but the gain depends on winning buyers who are new to the brand and on holding retailer margin.**

1. **Compare with the right baseline:** today's {{rx_profit_now}} will not last; with generics the brand earns {{dn_profit}}.
2. **The switch pays through new buyers:** {{new_users}} of the {{otc_packs}} packs come from people outside today's prescription base, adding {{new_contrib}}; patients who move earn {{loss_unit}} less each.
3. **The margin and volume are the risks:** a {{margin_hi}} retailer margin cuts the gain to {{delta_hi}}, and OTC volume must stay above {{be_packs}} to beat doing nothing.

**Risks and next steps:** negotiate retailer margin and shelf placement before committing the {{ad}} advertising budget; run a consumer test of the OTC price and pack to firm up the volume forecast; plan a staged advertising spend that scales with sales; check how rival OTC brands and store brands would respond on price; and confirm the timing of the switch against generic entry, because a delay lets generics take volume before the OTC brand is established.

## Common mistakes

- Comparing the switch with today's prescription profit instead of the no-switch outcome after generics.
- Counting OTC profit without the prescriptions it replaces (cannibalization).
- Using the shelf price as Alverin's revenue and forgetting retailer margin and distributor fees.
- Leaving out advertising, which for a new OTC brand is often the largest cost.

## What top candidates do differently

- Define the baseline first, then compare year-three profit with and without the switch.
- Walk the price chain from shelf price to Alverin's net price before estimating profit.
- Separate packs bought by former Rx patients from packs bought by new buyers.
- Stress the two assumptions that matter most: volume and retailer margin.

## Creative question

How could Alverin make the most of the OTC launch beyond the shelf price and advertising?

## Model answer

Group ideas by **channel, product and consumer**:

- **Channel:** an online store and subscription refills for seasonal allergy sufferers; partnerships with pharmacy chains for in-store pharmacist recommendations.
- **Product:** a children's formula and a nasal spray in the same family; multi-month value packs sold in the peak allergy season.
- **Consumer:** an allergy forecast app with pollen alerts that links to the brand; loyalty offers for people who bought last season.

A top candidate prioritizes: "Subscription refills and value packs raise sales per buyer without more retailer margin, so I would test those first against the {{ad}} advertising plan."
