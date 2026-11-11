---
id: electric-compact-tractor-launch
title: "Plugging In: Launching an Electric Compact Tractor"
client: "Marlow Farm Equipment (fictional), a US maker of compact and utility tractors sold through independent dealers"
summary: "A tractor maker plans an electric compact model. Work out unit economics with a costly battery, strip out dealer stocking and diesel cannibalization, and find break-even volume and payback."
industry: industrials
sub_industry: "Agricultural equipment"
type: product-launch
difficulty: advanced
format: interviewer-led
time_minutes: 40

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  diesel_price:   { value: 28000, unit: "$", label: "Wholesale price of the diesel compact tractor" }
  diesel_cost:    { value: 22000, unit: "$", label: "Variable cost of the diesel compact tractor" }
  e_price:        { value: 38000, unit: "$", label: "Planned wholesale price of the electric model" }
  battery_cost:   { value: 12000, unit: "$", label: "Battery pack cost per tractor" }
  e_other_cost:   { value: 18000, unit: "$", label: "All other variable cost of the electric model (no engine or fuel system)" }
  plan_units:     { value: 3000,  unit: "units", label: "Management plan: electric tractors sold to dealers per year" }
  dealers:        { value: 400,   unit: "dealers", label: "Authorized dealers" }
  stock_per_dealer: { value: 3,   unit: "units", label: "Electric tractors each dealer must stock at launch (one-time)" }
  cannib_rate:    { value: 0.4,   unit: "%",   label: "Share of electric buyers who would otherwise have bought the diesel model" }
  fixed_annual:   { value: 5,     unit: "$M",  label: "Added fixed cost per year (marketing, charging support, dealer training)" }
  dev_cost:       { value: 45,    unit: "$M",  label: "One-time development and tooling cost" }
  payback_limit:  { value: 5,     unit: "years", label: "Board's maximum payback for a new platform" }

calculations:
  # --- Unit economics ---
  - { id: diesel_contrib, label: "Contribution per diesel tractor", formula: "diesel_price - diesel_cost", expected: 6000, unit: "$" }
  - { id: e_cost, label: "Variable cost of the electric tractor", formula: "battery_cost + e_other_cost", expected: 30000, unit: "$" }
  - { id: e_contrib, label: "Contribution per electric tractor", formula: "e_price - e_cost", expected: 8000, unit: "$" }
  - { id: battery_share, label: "Battery share of electric variable cost", formula: "battery_cost / e_cost", expected: 0.4, unit: "%", decimals: 0 }
  # --- Dealer stocking and demand ---
  - { id: stock_units, label: "One-time dealer stocking volume", formula: "dealers * stock_per_dealer", expected: 1200, unit: "units" }
  - { id: retail_units, label: "Repeatable annual sales to farmers", formula: "plan_units - stock_units", expected: 1800, unit: "units" }
  - { id: cannib_units, label: "Diesel tractors lost to cannibalization each year", formula: "retail_units * cannib_rate", expected: 720, unit: "units" }
  # --- Profit and payback ---
  - { id: naive_annual, label: "Management view: annual profit", formula: "plan_units * e_contrib / 1000000 - fixed_annual", expected: 19, unit: "$M" }
  - { id: naive_payback, label: "Management view: payback", formula: "dev_cost / naive_annual", expected: 2.368, unit: "years", decimals: 1 }
  - { id: e_total, label: "Electric contribution at repeatable volume", formula: "retail_units * e_contrib / 1000000", expected: 14.4, unit: "$M", decimals: 1 }
  - { id: lost_diesel, label: "Diesel contribution lost", formula: "cannib_units * diesel_contrib / 1000000", expected: 4.32, unit: "$M", decimals: 2 }
  - { id: net_annual, label: "Net annual profit at repeatable volume", formula: "e_total - lost_diesel - fixed_annual", expected: 5.08, unit: "$M", decimals: 2 }
  - { id: payback, label: "Payback at repeatable volume", formula: "dev_cost / net_annual", expected: 8.858, unit: "years", decimals: 1 }
  - { id: year1_net, label: "Year-1 profit including one-time dealer stocking", formula: "plan_units * e_contrib / 1000000 - lost_diesel - fixed_annual", expected: 14.68, unit: "$M", decimals: 2 }
  - { id: payback_y1, label: "Payback if the stocking bump is counted once", formula: "1 + (dev_cost - year1_net) / net_annual", expected: 6.9685, unit: "years", decimals: 1 }
  # --- Break-even ---
  - { id: net_per_unit, label: "Net contribution per electric tractor after cannibalization", formula: "e_contrib - cannib_rate * diesel_contrib", expected: 5600, unit: "$" }
  - { id: breakeven_units, label: "Annual break-even volume (covers fixed cost)", formula: "fixed_annual * 1000000 / net_per_unit", expected: 892.857, unit: "units", decimals: 0 }
  - { id: safety_margin, label: "Cushion between repeatable volume and break-even", formula: "1 - breakeven_units / retail_units", expected: 0.504, unit: "%", decimals: 0 }
  # --- What would fix the payback? ---
  - { id: req_annual, label: "Annual profit needed to meet the payback limit", formula: "dev_cost / payback_limit", expected: 9, unit: "$M" }
  - { id: req_net_unit, label: "Net contribution per tractor needed", formula: "(req_annual + fixed_annual) * 1000000 / retail_units", expected: 7777.78, unit: "$" }
  - { id: req_contrib, label: "Electric contribution needed per tractor", formula: "req_net_unit + cannib_rate * diesel_contrib", expected: 10177.78, unit: "$" }
  - { id: battery_cut, label: "Battery cost reduction needed per pack", formula: "req_contrib - e_contrib", expected: 2177.78, unit: "$" }
  - { id: battery_cut_pct, label: "Battery cost reduction needed (%)", formula: "battery_cut / battery_cost", expected: 0.1815, unit: "%", decimals: 0 }

answer:
  calc: net_annual
  headline: "Management's plan shows {{naive_payback}} payback, but once dealer stocking and diesel cannibalization are removed, net profit is {{net_annual}} a year and payback is {{payback}}. A battery cost cut of about {{battery_cut_pct}} would restore a payback within {{payback_limit}}."

exhibits:
  - id: exhibit-1
    title: "Unit economics: diesel versus electric compact tractor"
    kind: table
    ask: "Here are the per-tractor economics. What stands out?"
    columns: ["Per tractor", "Diesel model", "Electric model"]
    rows:
      - ["Wholesale price", "{{diesel_price}}", "{{e_price}}"]
      - ["Battery pack", "Not applicable", "{{battery_cost}}"]
      - ["All other variable cost", "{{diesel_cost}}", "{{e_other_cost}}"]
      - ["**Contribution**", "**{{diesel_contrib}}**", "**{{e_contrib}}**"]
    note: "Illustrative data created for this practice case. Marlow is fictional. Prices are what Marlow receives from dealers, after dealer margin."
    insight: |
      The electric model earns {{e_contrib}} per tractor against {{diesel_contrib}} for
      diesel, but the battery is {{battery_share}} of its variable cost. The electric
      model has a higher margin per unit, which makes it tempting to push, and
      the launch plan looks good at first glance.
  - id: exhibit-2
    title: "Management's launch plan versus repeatable demand"
    kind: table
    ask: "Management expects to sell 3,000 a year. Is that the right number to plan on?"
    columns: ["Item", "Value"]
    rows:
      - ["Planned sales to dealers, year 1", "{{plan_units}}"]
      - ["Authorized dealers", "{{dealers}}"]
      - ["Launch stock each dealer must hold", "{{stock_per_dealer}}"]
      - ["One-time dealer stocking", "{{stock_units}}"]
      - ["Repeatable annual sales to farmers", "{{retail_units}}"]
      - ["Share of electric buyers who would have bought diesel", "{{cannib_rate}}"]
      - ["Diesel tractors lost each year", "{{cannib_units}}"]
    note: "Illustrative data created for this practice case. Sales to dealers (sell-in) include launch stock that dealers hold on the lot and do not reorder until it sells."
    insight: |
      The {{plan_units}} year-1 figure includes {{stock_units}} tractors that dealers
      stock once. Real, repeatable sales are {{retail_units}}, and {{cannib_units}} of
      them replace diesel sales that Marlow would have made anyway.
  - id: exhibit-3
    title: "Payback on the development cost, by view (years)"
    kind: bar
    unit: "years"
    decimals: 1
    ask: "Three different paybacks are circulating. Which one should the board use?"
    data:
      - { label: "Management view (3,000 a year, no cannibalization)", value: naive_payback }
      - { label: "Year-1 stocking counted once, with cannibalization", value: payback_y1 }
      - { label: "Repeatable demand, with cannibalization", value: payback }
    reference: { value: payback_limit, label: "Board maximum" }
    note: "Illustrative data created for this practice case."
    insight: |
      Only the management view meets the board's {{payback_limit}} limit. The
      realistic views take {{payback_y1}} to {{payback}}, so the launch needs a
      cost or price change to be approved.
---

## Prompt

Our client, Marlow Farm Equipment, makes compact and utility tractors that it sells through independent dealers ({{dealers}}) across the US. Its compact diesel tractor is a steady seller, and small farms, vineyards and landscapers are asking for quieter, cheaper-to-run electric machines.

Marlow plans to launch an **electric compact tractor** next year. Management's plan calls for {{plan_units}} sales a year and a development and tooling investment of {{dev_cost}}. The board will approve new platforms only if they pay back within **{{payback_limit}}**.

The CEO asks us: **is the launch worth it, and what would it take to make it work?**

## Clarifying information

- Q: What are the unit economics?
  A: Exhibit 1 has them. The electric model sells for **{{e_price}}** and costs {{e_cost}} to build, of which **{{battery_cost}}** is the battery pack.
- Q: Who would buy the electric tractor?
  A: Small farms, vineyards, nurseries, municipalities and landscapers who value low noise, no fuel and lower maintenance. Some of them would otherwise buy Marlow's diesel model.
- Q: How many would switch from diesel?
  A: Marlow's research says **{{cannib_rate}}** of electric buyers would otherwise have bought the diesel model.
- Q: How do dealers fit in?
  A: Each dealer must hold **{{stock_per_dealer}}** electric tractors at launch for demonstrations and sales. That stock is bought once, not every year. Exhibit 2 has the details.
- Q: What other costs does the launch bring?
  A: About **{{fixed_annual}}** a year for marketing, charging support and dealer training, on top of the one-time **{{dev_cost}}**.
- Q: Could the battery get cheaper?
  A: Marlow's supplier expects pack prices to fall over time, but there is no contract yet.
- Q: Is there a competitor?
  A: Two start-ups sell electric compact tractors at higher prices, and a large rival has announced a model for next year.

## Structure

> **Ask:** How would you evaluate the launch?

Build the answer from **demand, unit economics and the effect on the existing business**, then test against the board's payback limit.

- **1. Demand**
  - Who buys (segments), how many, and how fast
  - Repeatable farmer demand versus one-time dealer stocking
  - Competitor response and the price premium customers will pay
- **2. Unit economics**
  - Price, battery, other variable cost, contribution per unit
  - Battery cost trend and supplier contracts
- **3. Effect on the diesel model**
  - Share of electric buyers who would have bought diesel
  - Contribution lost on those tractors
- **4. Investment and fixed costs**
  - Development and tooling, annual fixed cost
  - Break-even volume and payback versus the board's limit
- **5. Execution:** dealer readiness, charging, service skills, warranty on batteries

A good hypothesis: *"The electric model earns more per tractor, but the battery is a large share of cost, and some of the volume simply replaces diesel sales. I expect the plan to look better than it is, so I would strip out one-time and replacement volume before judging payback."*

## Math walkthrough

> **Ask:** What is the realistic annual profit and payback? What is the break-even volume? And what would make the payback acceptable?

**1. Unit economics.**
Diesel: $28,000 − $22,000 = **{{diesel_contrib}}**. Electric: $38,000 − ($12,000 + $18,000) = **{{e_contrib}}**.

**2. Repeatable demand.**
Dealer stocking is {{dealers}} × {{stock_per_dealer}} = **{{stock_units}}** tractors, bought once. Repeatable annual sales are {{plan_units}} − {{stock_units}} = **{{retail_units}}**.

**3. Cannibalization.**
{{retail_units}} × {{cannib_rate}} = **{{cannib_units}}** diesel tractors lost. At {{diesel_contrib}} each, that is **{{lost_diesel}}** of contribution.

**4. Profit and payback.**

| View | Annual profit | Payback |
|---|---|---|
| Management: 3,000 a year, no cannibalization | {{naive_annual}} | {{naive_payback}} |
| Repeatable demand, with cannibalization | {{net_annual}} | **{{payback}}** |

Net annual profit: {{e_total}} − {{lost_diesel}} − {{fixed_annual}} = **{{net_annual}}**. Payback: $45M ÷ $5.08M ≈ **{{payback}}**.
If the one-time stocking is counted in year 1, year-1 profit is {{year1_net}}, and payback is about **{{payback_y1}}**. This is still over the {{payback_limit}} limit.

**5. Break-even volume.**
Each electric tractor nets $8,000 − 40% × $6,000 = **{{net_per_unit}}**. To cover {{fixed_annual}} of fixed cost Marlow needs {{fixed_annual}} ÷ {{net_per_unit}} ≈ **{{breakeven_units}}** tractors a year. Repeatable demand of {{retail_units}} gives a cushion of **{{safety_margin}}**, so the launch is profitable but slow to repay.

**6. What would fix the payback?**
To repay {{dev_cost}} in {{payback_limit}}, Marlow needs {{req_annual}} a year. That requires {{req_net_unit}} net per tractor, or {{req_contrib}} of electric contribution. The gap is **{{battery_cut}}** per tractor, equal to a **{{battery_cut_pct}}** cut in battery cost. A price rise of the same amount would also work, but it could reduce volume.

## Synthesis

> **Ask:** What would you tell the CEO?

**Launch the electric tractor, but do not approve it on the current plan. Realistic payback is about {{payback}}, not {{naive_payback}}, because {{stock_units}} of the planned sales are one-time dealer stock and {{cannib_units}} diesel sales would be lost. A battery cost reduction of about {{battery_cut_pct}} would bring payback within {{payback_limit}}.**

1. **The plan overstates demand:** repeatable sales are {{retail_units}}, not {{plan_units}}.
2. **Cannibalization costs {{lost_diesel}} a year:** it reduces the net value of each electric tractor from {{e_contrib}} to {{net_per_unit}}.
3. **The launch is safe but slow:** break-even is {{breakeven_units}} a year, a cushion of {{safety_margin}}, so the downside is limited.
4. **The battery is the lever:** a cut of about {{battery_cut}} per pack fixes the payback.

**Risks and next steps:** negotiate a multi-year battery contract with price steps tied to volume before approving the tooling; ask dealers to share the stocking burden through consignment or a smaller demo fleet, which also lowers the one-time volume bump; target buyers who would not buy diesel (municipalities, nurseries, vineyards with noise limits) to reduce cannibalization; and review a response to the rival's launch, because a price war would cut the {{e_contrib}} contribution quickly. Warranty cost on batteries is not yet in the numbers and should be added.

## Common mistakes

- Planning on {{plan_units}} a year when {{stock_units}} of that is one-time dealer stock.
- Ignoring cannibalization, or treating all electric sales as new.
- Comparing contribution per tractor ({{e_contrib}} versus {{diesel_contrib}}) without netting out the lost diesel sale.
- Calculating payback on year-1 profit, which includes the one-time stocking.
- Treating the battery cost as fixed, instead of the biggest lever on the case.

## What top candidates do differently

- Separate sell-in to dealers from sell-out to farmers before building any forecast.
- Compute the net contribution per electric tractor ({{net_per_unit}}) and use it for break-even.
- Turn the payback gap into a target: "the battery has to be about {{battery_cut_pct}} cheaper".
- Test the target segments: who would never have bought diesel, and so adds profit with no cannibalization.

## Creative question

How could Marlow reduce the cost or the risk of the battery without waiting for pack prices to fall?

## Model answer

Group ideas by **who owns the battery and when**:

- **Business model:** lease or subscribe to the battery, so the customer pays over time and the sale price falls; or offer battery swaps and trade-ins.
- **Supply:** multi-year contracts with price declines, a second supplier, or a joint development with a cell maker.
- **Design:** a smaller standard pack with an optional second pack for heavy-duty users, so the base price is lower.
- **After-sales:** sell second-life batteries into solar storage at the end of tractor life, which raises residual value and could support lower pricing.
- **Customers:** target fleets (municipalities, golf courses, universities) that can share charging infrastructure and take volume discounts.

A top candidate prioritizes: "Battery leasing could remove most of the price gap with diesel, but it moves cost and risk onto Marlow's balance sheet, so I would pilot it with fleet customers first. The supply contract is the quickest lever and needs no change to the product."
