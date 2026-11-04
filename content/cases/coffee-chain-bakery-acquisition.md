---
id: coffee-chain-bakery-acquisition
title: "Croissants with Your Latte: A Coffee Chain Buying a Bakery-Café Chain"
client: "Tallis Coffee Company (fictional), a US coffee-shop chain with 1,000 stores"
summary: "A coffee chain wants to buy a regional bakery-café chain at a 50% premium. Split the synergies into cost and revenue, back-solve the sales uplift the price needs, and see what a store pilot does to the answer."
industry: consumer-retail
sub_industry: "Restaurants"
type: m-and-a
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company or deal data.
inputs:
  t_cafes:          { value: 200,  unit: "bakery-cafés",  label: "Pell & Rye bakery-cafés" }
  t_rev:            { value: 300,  unit: "$M",     label: "Pell & Rye revenue" }
  t_ebitda:         { value: 30,   unit: "$M",     label: "Pell & Rye EBITDA" }
  t_ssg:            { value: 0.03, unit: "%",      label: "Pell & Rye same-store sales growth" }
  price:            { value: 450,  unit: "$M",     label: "Price Pell & Rye's owners are asking" }
  multiple:         { value: 10,   unit: "x",      label: "Typical EV/EBITDA for regional restaurant chains (also used to value synergies)" }
  b_stores:         { value: 1000, unit: "coffee shops", label: "Tallis coffee shops" }
  b_store_sales:    { value: 1.2,  unit: "$M",     label: "Average Tallis store sales per year", decimals: 1 }
  t_purchases:      { value: 100,  unit: "$M",     label: "Pell & Rye spend on ingredients and packaging" }
  purch_saving:     { value: 0.04, unit: "%",      label: "Saving on that spend at Tallis's purchasing prices" }
  t_overhead:       { value: 10,   unit: "$M",     label: "Pell & Rye head-office overhead" }
  overhead_cut:     { value: 0.40, unit: "%",      label: "Share of that overhead Tallis can remove" }
  integration:      { value: 10,   unit: "$M",     label: "One-time integration cost" }
  space_share:      { value: 0.80, unit: "%",      label: "Tallis stores with room for a bakery display case" }
  bakery_margin:    { value: 0.50, unit: "%",      label: "Contribution margin on bakery goods sold in Tallis stores" }
  pilot_gross:      { value: 30,   unit: "$K",     label: "Pilot: Pell & Rye goods sold per store per year" }
  pilot_cannib:     { value: 20,   unit: "$K",     label: "Pilot: fall in Tallis's own pastry and sandwich sales per store per year" }

calculations:
  # --- Standalone value and premium ---
  - { id: t_margin, label: "Pell & Rye EBITDA margin", formula: "t_ebitda / t_rev", expected: 0.10, unit: "%" }
  - { id: standalone, label: "Pell & Rye standalone value", formula: "t_ebitda * multiple", expected: 300, unit: "$M" }
  - { id: premium, label: "Premium over standalone value", formula: "price - standalone", expected: 150, unit: "$M" }
  - { id: premium_pct, label: "Premium as a share of standalone value", formula: "premium / standalone", expected: 0.50, unit: "%" }
  - { id: price_multiple, label: "Asking price as a multiple of EBITDA", formula: "price / t_ebitda", expected: 15, unit: "x" }
  # --- Cost synergies ---
  - { id: purch_syn, label: "Purchasing synergy per year", formula: "t_purchases * purch_saving", expected: 4, unit: "$M" }
  - { id: sga_syn, label: "Overhead synergy per year", formula: "t_overhead * overhead_cut", expected: 4, unit: "$M" }
  - { id: cost_syn, label: "Cost synergies per year", formula: "purch_syn + sga_syn", expected: 8, unit: "$M" }
  - { id: cost_syn_value, label: "Value of cost synergies", formula: "cost_syn * multiple", expected: 80, unit: "$M" }
  - { id: cost_syn_net, label: "Value of cost synergies, net of integration cost", formula: "cost_syn_value - integration", expected: 70, unit: "$M" }
  - { id: cost_cover, label: "Share of the premium covered by cost synergies", formula: "cost_syn_net / premium", expected: 0.467, unit: "%", decimals: 0 }
  # --- Back-solve the revenue synergy ---
  - { id: gap, label: "Premium not covered by cost synergies", formula: "premium - cost_syn_net", expected: 80, unit: "$M" }
  - { id: rev_syn_needed, label: "Revenue-synergy profit needed per year", formula: "gap / multiple", expected: 8, unit: "$M" }
  - { id: sales_needed, label: "Extra bakery sales needed per year", formula: "rev_syn_needed / bakery_margin", expected: 16, unit: "$M" }
  - { id: eligible, label: "Tallis stores that can sell bakery goods", formula: "b_stores * space_share", expected: 800, unit: "stores" }
  - { id: uplift_needed, label: "Net sales uplift needed per eligible store", formula: "sales_needed * 1000 / eligible", expected: 20, unit: "$K" }
  - { id: uplift_share, label: "Needed uplift as a share of average store sales", formula: "uplift_needed / (b_store_sales * 1000)", expected: 0.0167, unit: "%", decimals: 1 }
  # --- Pilot results ---
  - { id: pilot_net, label: "Pilot: net new sales per store", formula: "pilot_gross - pilot_cannib", expected: 10, unit: "$K" }
  - { id: cannib_rate, label: "Share of Pell & Rye sales taken from Tallis's own food", formula: "pilot_cannib / pilot_gross", expected: 0.667, unit: "%", decimals: 0 }
  - { id: pilot_vs_need, label: "Net pilot uplift as a share of the uplift needed", formula: "pilot_net / uplift_needed", expected: 0.50, unit: "%" }
  - { id: gross_needed, label: "Gross Pell & Rye sales per store needed at the pilot's cannibalization", formula: "uplift_needed / (1 - cannib_rate)", expected: 60, unit: "$K" }
  - { id: naive_rev_syn_value, label: "Revenue synergy value if cannibalization is ignored (the wrong way)", formula: "eligible * pilot_gross / 1000 * bakery_margin * multiple", expected: 120, unit: "$M" }
  - { id: naive_value, label: "Value to Tallis if cannibalization is ignored", formula: "standalone + cost_syn_net + naive_rev_syn_value", expected: 490, unit: "$M" }
  - { id: rev_syn, label: "Revenue-synergy profit per year, based on the pilot", formula: "eligible * pilot_net / 1000 * bakery_margin", expected: 4, unit: "$M" }
  - { id: rev_syn_value, label: "Value of the revenue synergy", formula: "rev_syn * multiple", expected: 40, unit: "$M" }
  - { id: total_syn, label: "Total synergy value", formula: "cost_syn_net + rev_syn_value", expected: 110, unit: "$M" }
  - { id: value_to_buyer, label: "Value of Pell & Rye to Tallis (walk-away price)", formula: "standalone + total_syn", expected: 410, unit: "$M" }
  - { id: overpay, label: "Overpayment at the asking price", formula: "price - value_to_buyer", expected: 40, unit: "$M" }
  - { id: max_premium, label: "Highest premium Tallis can justify", formula: "total_syn / standalone", expected: 0.367, unit: "%", decimals: 0 }

answer:
  calc: value_to_buyer
  headline: "Pell & Rye is worth about {{value_to_buyer}} to Tallis, not {{price}}: cost synergies cover only {{cost_cover}} of the premium, and the pilot's net uplift of {{pilot_net}} per store is half the {{uplift_needed}} the price needs."

exhibits:
  - id: exhibit-1
    title: "Pell & Rye Bakery Café at a glance"
    kind: table
    ask: "Here is the target and the asking price. How much of the price is a premium, and what has to cover it?"
    columns: ["Item", "Value"]
    rows:
      - ["Locations", "{{t_cafes}}, in the Midwest and Mid-Atlantic"]
      - ["Revenue", "{{t_rev}}"]
      - ["EBITDA", "{{t_ebitda}}"]
      - ["Same-store sales growth", "{{t_ssg}} a year"]
      - ["Central bakeries", "3, running at about 60% of capacity"]
      - ["Asking price", "{{price}}"]
      - ["Typical value of regional restaurant chains", "{{multiple}} EBITDA"]
    note: "Illustrative data created for this practice case. Pell & Rye and Tallis are fictional."
    insight: |
      At {{multiple}} EBITDA Pell & Rye is worth {{standalone}} on its own, so
      the asking price includes a {{premium}} premium ({{premium_pct}}). Spare
      bakery capacity hints at where the deal team thinks the upside is.
  - id: exhibit-2
    title: "Synergy estimates from Tallis's deal team"
    kind: table
    ask: "Here are the deal team's synergy estimates. How far do the cost synergies go, and what does the revenue synergy have to deliver?"
    columns: ["Synergy", "Estimate", "Comment"]
    rows:
      - ["Cost: purchasing", "{{purch_saving}} of {{t_purchases}} spend", "Flour, butter, dairy and packaging at Tallis's contract prices"]
      - ["Cost: head-office overhead", "{{overhead_cut}} of {{t_overhead}}", "Finance, HR, IT and marketing merged into Tallis"]
      - ["One-time integration cost", "{{integration}}", "Systems, rebranding, severance"]
      - ["Revenue: Pell & Rye goods in Tallis stores", "Not yet sized", "{{space_share}} of {{b_stores}} have room for a display case; contribution margin {{bakery_margin}} (baked in Pell & Rye's spare capacity)"]
      - ["Tallis average store sales", "{{b_store_sales}} a year", "About 15% of sales is food"]
    note: "Illustrative data created for this practice case."
    insight: |
      Cost synergies are worth {{cost_syn_net}} net of integration, or
      {{cost_cover}} of the premium. The remaining {{gap}} has to come from
      selling bakery goods in coffee shops: about {{uplift_needed}} of net new
      sales per eligible store each year.
  - id: exhibit-3
    title: "Pilot results: Pell & Rye goods in 25 Tallis stores, per store per year"
    kind: bar
    unit: "$K"
    decimals: 0
    ask: "Tallis ran a six-month pilot selling Pell & Rye goods in 25 of its stores. What does this tell you about the price?"
    data:
      - { label: "Pell & Rye goods sold", value: pilot_gross }
      - { label: "Fall in Tallis's own food sales", value: pilot_cannib }
      - { label: "Net new sales", value: pilot_net }
    reference: { value: uplift_needed, label: "Net uplift the price needs" }
    note: "Illustrative data created for this practice case; annualized from a fictional six-month pilot. Assume Tallis's own food carries the same contribution margin as Pell & Rye goods."
    insight: |
      Gross sales of {{pilot_gross}} look better than the {{uplift_needed}}
      needed, but {{cannib_rate}} of them replace food Tallis already sold. The
      net uplift is only {{pilot_net}}, half of what the price requires.
---

## Prompt

Our client, Tallis Coffee Company, runs **{{b_stores}}** across the US. Coffee sales are strong, but food is a weak spot: customers say Tallis's pastries and sandwiches are forgettable.

Tallis is in talks to buy **Pell & Rye**, a regional chain of {{t_cafes}} known for its breads and pastries. The owners are asking **{{price}}**. Tallis's CEO likes the idea of putting Pell & Rye croissants in every Tallis store, and asks us: **is Pell & Rye worth the asking price?**

## Clarifying information

- Q: What is Tallis's objective?
  A: Grow profit and fix its food offer. The board will not approve a deal that is worth less to Tallis than the price.
- Q: How should we value the business and the synergies?
  A: Use the typical multiple for regional restaurant chains, **{{multiple}}** EBITDA, for both Pell & Rye's standalone EBITDA and the annual synergies. Ignore taxes and the time it takes to reach full synergies.
- Q: Are there other bidders?
  A: A restaurant-focused private equity fund has shown interest, but it would have no synergies.
- Q: Will Pell & Rye cafés keep their brand?
  A: Yes. The cafés keep operating as they are; Tallis does not plan to close or convert any of them.
- Q: Could Tallis sell its coffee in Pell & Rye cafés?
  A: Pell & Rye has a supply contract with another roaster until 2031, so leave this out.

## Structure

> **Ask:** How would you structure your analysis?

The deal works only if **standalone value + synergies − integration cost ≥ price**. Break it down:

- **1. What is Pell & Rye worth on its own?**
  - EBITDA × typical multiple; compare with the asking price to size the premium
  - Quality of the business: same-store sales, café profitability, brand strength
- **2. Cost synergies (more certain)**
  - Purchasing: Pell & Rye buys at Tallis's scale prices
  - Overhead: merge head-office functions
  - Less one-time integration cost
- **3. Revenue synergies (less certain)**
  - Pell & Rye goods in Tallis stores: eligible stores × net new sales per store × margin
  - Net, not gross: how much do customers just swap one pastry for another?
- **4. Can Tallis deliver it?**
  - Bakery capacity and daily delivery to 800+ stores
  - Freshness, brand fit, keeping Pell & Rye's bakers

A strong opening hypothesis: *"Cost synergies in restaurant deals are usually modest, so the price probably rests on the revenue synergy. I want to work out the sales uplift per store the price implies and check whether it is believable."*

## Math walkthrough

> **Ask:** Using Exhibit 1, size the premium. Using Exhibit 2, how much do cost synergies cover, and what sales uplift per Tallis store does the price need? Then use Exhibit 3: what is Pell & Rye worth to Tallis?

**1. Premium (Exhibit 1).**
Standalone value = $30M × 10 = **{{standalone}}**. The asking price of {{price}} is {{price_multiple}} EBITDA, a premium of **{{premium}}** ({{premium_pct}}).

**2. Cost synergies (Exhibit 2).**
- Purchasing: $100M × 4% = **{{purch_syn}}** a year
- Overhead: $10M × 40% = **{{sga_syn}}** a year
- Total {{cost_syn}} a year × 10 = {{cost_syn_value}}, less {{integration}} integration = **{{cost_syn_net}}**

That covers only **{{cost_cover}}** of the premium. Cost synergies alone do not justify the price.

**3. Back-solve the revenue synergy.**
- Gap to cover: $150M − $70M = **{{gap}}**
- Profit needed per year: $80M ÷ 10 = **{{rev_syn_needed}}**
- Sales needed per year: $8M ÷ 50% = **{{sales_needed}}**
- Eligible stores: 1,000 × 80% = **{{eligible}}**
- Net uplift needed per store: $16M ÷ 800 = **{{uplift_needed}}** a year

That is only {{uplift_share}} of an average store's sales, which sounds easy. The question is whether the extra sales are really new.

**4. The pilot (Exhibit 3).**
Net new sales per store = $30K − $20K = **{{pilot_net}}**, so {{cannib_rate}} of Pell & Rye's sales replaced food Tallis already sold. The net uplift is **{{pilot_vs_need}}** of what the price needs. At this rate of cannibalization, Pell & Rye goods would need gross sales of {{gross_needed}} per store, double the pilot.

**5. Value to Tallis.**
Revenue synergy = 800 × $10K × 50% = **{{rev_syn}}** a year, worth **{{rev_syn_value}}**.

| Component | Value |
|---|---|
| Standalone value | {{standalone}} |
| Cost synergies, net of integration | {{cost_syn_net}} |
| Revenue synergy (net of cannibalization) | {{rev_syn_value}} |
| **Value to Tallis** | **{{value_to_buyer}}** |
| Asking price | {{price}} |
| **Overpayment** | **{{overpay}}** |

The twist: using the pilot's **gross** sales, the revenue synergy looks like {{naive_rev_syn_value}} and the deal seems worth {{naive_value}}, above the price. Netting out cannibalization reverses the answer.

## Synthesis

> **Ask:** What do you recommend to Tallis's CEO?

**Tallis should not pay {{price}} for Pell & Rye. The business is worth about {{value_to_buyer}} to Tallis, so the highest premium it can justify is about {{max_premium}}, not {{premium_pct}}.**

1. **Cost synergies are real but small:** purchasing and overhead savings are worth {{cost_syn_net}}, only {{cost_cover}} of the {{premium}} premium.
2. **The price needs {{uplift_needed}} of net new sales per store:** the pilot delivered {{pilot_net}}, because {{cannib_rate}} of Pell & Rye sales replaced Tallis's own food.
3. **The strategic logic still holds:** better food is what Tallis customers ask for, and Pell & Rye's spare bakery capacity makes it cheap to supply.

**Risks and next steps:** open well below {{value_to_buyer}} (the private equity rival has no synergies and can justify only about {{standalone}}) and treat {{value_to_buyer}} as the walk-away price; any gap to the ask can be bridged with an earn-out tied to bakery sales in Tallis stores. Before raising the offer, test whether better food brings in *new* visits (afternoon and weekend traffic) rather than swaps, and whether pairing pastries with coffee raises average ticket over a longer pilot. Also price the alternative: a supply agreement with Pell & Rye, or another bakery, could deliver much of the food upgrade without paying a premium at all.

## Common mistakes

- Counting the pilot's {{pilot_gross}} of gross sales as the synergy and concluding the deal is worth {{naive_value}}.
- Valuing the target on its own and stopping, without comparing the premium with the synergies.
- Forgetting the one-time integration cost, or applying the uplift to all {{b_stores}} instead of the {{eligible}} that have room.
- Being impressed that the uplift is only {{uplift_share}} of store sales. A small share of a big number can still be unrealistic for one food category.

## What top candidates do differently

- Separate cost and revenue synergies from the start and treat revenue synergies as less certain.
- Back-solve the uplift the price implies, so the debate is about one per-store number instead of a valuation model.
- Ask about cannibalization before seeing Exhibit 3, then quantify it.
- Propose alternatives to a full purchase (a lower bid, an earn-out, a supply agreement), not only "yes" or "no".

## Creative question

How could Tallis raise the *net* new sales from Pell & Rye goods, instead of customers just swapping one pastry for another?

## Model answer

Organize the ideas around **new visits, bigger tickets and new occasions**:

- **New visits:** promote fresh bread and pastries to people who don't drink coffee; morning pre-orders in the app for pickup; a "baked this morning" message that brings people in before work.
- **Bigger tickets:** coffee-and-pastry bundles; whole loaves and boxes of pastries to take home; seasonal items that sell at higher prices.
- **New occasions:** lunch sandwiches on Pell & Rye bread to build the weak midday period; office catering for meetings; weekend family breakfast boxes.
- **Remove the overlap:** retire Tallis's weakest pastries so Pell & Rye goods replace low-margin items, not popular ones.

A top candidate prioritizes: "Lunch is the biggest prize. Coffee shops are busy in the morning and empty at noon, so sandwiches on good bread bring in visits that don't exist today, which is exactly the net uplift the price needs."
