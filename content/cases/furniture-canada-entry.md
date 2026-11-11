---
id: furniture-canada-entry
title: "Across the Border: A Value Furniture Retailer Considers Canada"
client: "Haven & Oak Home (fictional), a US value furniture and home-goods retailer"
summary: "A US furniture chain weighs opening 12 stores in Canada. Store economics look fine until cannibalized online sales and tariffs on imported goods come into the picture."
industry: consumer-retail
sub_industry: "Furniture retail"
type: market-entry
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  stores:        { value: 12,   unit: "stores", label: "Planned Canadian stores in the first wave" }
  sales_store:   { value: 12.0, unit: "$M",     label: "Expected sales per store per year (at maturity)" }
  gm:            { value: 0.40, unit: "%",      label: "Gross margin before duties" }
  logistics_pct: { value: 0.08, unit: "%",      label: "Delivery and warehousing cost, as a share of sales" }
  opex_store:    { value: 2.2,  unit: "$M",     decimals: 1, label: "Store operating cost per year (rent, staff, utilities)" }
  tariff_rate:   { value: 0.15, unit: "%",      label: "Duty rate on goods that do not qualify for duty-free trade" }
  tariff_share:  { value: 0.60, unit: "%",      label: "Share of cost of goods subject to duty with today's sourcing" }
  tariff_fix:    { value: 0.25, unit: "%",      label: "Share of cost of goods subject to duty after shifting sourcing" }
  online_ca:     { value: 40,   unit: "$M",     label: "Sales to Canadian customers through the US website today" }
  cannibal:      { value: 0.30, unit: "%",      label: "Share of those online sales that would move to the new stores" }
  online_contrib: { value: 0.30, unit: "%",     label: "Contribution margin on online sales after shipping" }
  capex_store:   { value: 2.5,  unit: "$M",     decimals: 1, label: "Fit-out and opening cost per store" }
  dc_capex:      { value: 22,   unit: "$M",     label: "Canadian distribution center" }
  launch:        { value: 8,    unit: "$M",     label: "Launch marketing and hiring" }
  hurdle:        { value: 5,    unit: "years",  label: "Board's maximum payback for a new market" }

calculations:
  - { id: sales_total, label: "Canadian store sales", formula: "stores * sales_store", expected: 144, unit: "$M" }
  - { id: cogs, label: "Cost of goods", formula: "sales_total * (1 - gm)", expected: 86.4, unit: "$M", decimals: 1 }
  - { id: gp, label: "Gross profit before duties", formula: "sales_total - cogs", expected: 57.6, unit: "$M", decimals: 1 }
  - { id: logistics, label: "Delivery and warehousing", formula: "sales_total * logistics_pct", expected: 11.52, unit: "$M", decimals: 1 }
  - { id: opex, label: "Store operating cost", formula: "stores * opex_store", expected: 26.4, unit: "$M", decimals: 1 }
  - { id: pre_tariff, label: "Store profit before duties", formula: "gp - logistics - opex", expected: 19.68, unit: "$M", decimals: 1 }
  - { id: tariff, label: "Duties with today's sourcing", formula: "cogs * tariff_share * tariff_rate", expected: 7.776, unit: "$M", decimals: 1 }
  - { id: store_ebit, label: "Store profit after duties", formula: "pre_tariff - tariff", expected: 11.904, unit: "$M", decimals: 1 }
  - { id: shifted, label: "Online sales that move into stores", formula: "online_ca * cannibal", expected: 12, unit: "$M" }
  - { id: lost_contrib, label: "Online contribution lost", formula: "shifted * online_contrib", expected: 3.6, unit: "$M", decimals: 1 }
  - { id: incr_ebit, label: "Incremental annual profit for Haven & Oak", formula: "store_ebit - lost_contrib", expected: 8.304, unit: "$M", decimals: 1 }
  - { id: invest, label: "Total upfront investment", formula: "stores * capex_store + dc_capex + launch", expected: 60, unit: "$M" }
  - { id: payback, label: "Payback with today's sourcing", formula: "invest / incr_ebit", expected: 7.2254, unit: "years", decimals: 1 }
  - { id: tariff_new, label: "Duties after shifting sourcing", formula: "cogs * tariff_fix * tariff_rate", expected: 3.24, unit: "$M", decimals: 1 }
  - { id: tariff_saved, label: "Duties avoided", formula: "tariff - tariff_new", expected: 4.536, unit: "$M", decimals: 1 }
  - { id: incr_fix, label: "Incremental annual profit after the sourcing change", formula: "pre_tariff - tariff_new - lost_contrib", expected: 12.84, unit: "$M", decimals: 1 }
  - { id: payback_fix, label: "Payback after the sourcing change", formula: "invest / incr_fix", expected: 4.6729, unit: "years", decimals: 1 }
  - { id: naive_payback, label: "Naive payback ignoring duties and cannibalization", formula: "invest / pre_tariff", expected: 3.0488, unit: "years", decimals: 1 }

answer:
  calc: payback_fix
  headline: "As planned, Canada pays back in {{payback}}, outside the {{hurdle}} limit. Shifting sourcing to cut duties brings it to {{payback_fix}}."

exhibits:
  - id: exhibit-1
    title: "Canadian store model: 12 stores at maturity"
    kind: table
    ask: "Here is the store plan. Does the market look attractive?"
    columns: ["Line", "Annual amount"]
    rows:
      - ["Store sales", "{{sales_total}}"]
      - ["Gross profit before duties", "{{gp}}"]
      - ["Delivery and warehousing", "{{logistics}}"]
      - ["Store operating cost", "{{opex}}"]
      - ["**Store profit before duties**", "**{{pre_tariff}}**"]
    note: "Illustrative data created for this practice case. Haven & Oak is fictional. Sales are at maturity, which takes about three years."
    insight: |
      Before duties the stores look healthy, with {{pre_tariff}} of profit on
      {{invest}} of investment. That is a payback of {{naive_payback}}, which is
      the number a hasty candidate would stop at.
  - id: exhibit-2
    title: "Canadian customers who already buy online from Haven & Oak"
    kind: table
    ask: "Haven & Oak already ships to Canada. How does this affect the case?"
    columns: ["Metric", "Value"]
    rows:
      - ["Sales through the US website to Canada", "{{online_ca}}"]
      - ["Share that would move to the new stores", "{{cannibal}}"]
      - ["Online sales that move", "{{shifted}}"]
      - ["Contribution margin on online sales", "{{online_contrib}}"]
      - ["Contribution lost", "{{lost_contrib}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Not all of the {{sales_total}} of store sales is new. {{shifted}} was
      already ours, so we lose {{lost_contrib}} of online contribution.
  - id: exhibit-3
    title: "Payback versus the board's limit (years)"
    kind: bar
    unit: "years"
    decimals: 1
    ask: "Putting it all together, where does this leave the decision?"
    data:
      - { label: "Naive (ignores duties and cannibalization)", value: naive_payback }
      - { label: "Realistic, today's sourcing", value: payback }
      - { label: "After shifting sourcing", value: payback_fix }
    reference: { value: hurdle, label: "Board's maximum payback" }
    note: "Illustrative data created for this practice case."
    insight: |
      Only the naive view and the sourcing fix pass the limit. The realistic
      plan with today's sourcing does not.
---

## Prompt

Our client, Haven & Oak Home, is a US retailer of low-priced sofas, tables and home goods, with stores across the US and a large website. Growth in the US is slowing and the CEO wants a new market. Canada looks natural: the same language and tastes, and many Canadians already order from the website.

The company plans to open 12 stores in Ontario and Quebec, supplied from a new Canadian distribution center.

The CEO asks us: **should Haven & Oak enter Canada with stores, and if so, how?**

## Clarifying information

- Q: What does the company want from Canada?
  A: Profitable growth, with the first wave paid back within **{{hurdle}}**.
- Q: Does Haven & Oak already sell in Canada?
  A: Yes, through its US website, about **{{online_ca}}** a year. Hand over Exhibit 2 when this comes up.
- Q: What do the stores look like?
  A: Large-format stores selling {{sales_store}} each at maturity, as shown in Exhibit 1.
- Q: Who are the competitors?
  A: Strong local value furniture chains and one global flat-pack retailer; Canadians also buy online.
- Q: What about duties on products?
  A: Most goods are made in Asia and Mexico and shipped to the US first. Under the trade agreement, goods that qualify cross the border duty-free, but about **{{tariff_share}}** of cost of goods today do not and pay about **{{tariff_rate}}**. Reveal this only if asked about trade or sourcing.
- Q: Can sourcing change?
  A: Yes. By moving suppliers to qualifying factories in Mexico and the US, the share facing duty could fall to **{{tariff_fix}}**, at no extra cost of goods.

## Structure

> **Ask:** How would you decide whether to enter Canada?

- **1. Market:** size, growth, tastes, and competitors (local chains, flat-pack players, online)
- **2. Store economics:** sales per store, gross margin, store costs, ramp-up time
- **3. Impact on the existing business**
  - Cannibalization of current online sales to Canada
  - Brand benefit (new customers who find the brand in stores)
- **4. Cost to serve:** a Canadian distribution center, delivery, duties and customs
- **5. Investment, payback and risks**

A good hypothesis: *"Furniture is bulky, so local stores and a local distribution center should lower delivery cost and win customers. But I'd check how much of the sales is new and what duties do to margin."*

## Math walkthrough

> **Ask:** Estimate the annual profit and payback of the Canadian plan, using the exhibits.

**1. Store profit before duties.**
Sales: {{stores}} × {{sales_store}} = **{{sales_total}}**. Cost of goods: {{sales_total}} × (1 − {{gm}}) = {{cogs}}, so gross profit is {{gp}}.
Less delivery ({{logistics}}) and store costs ({{opex}}): **{{pre_tariff}}**.
Investment: {{stores}} × {{capex_store}} + {{dc_capex}} + {{launch}} = **{{invest}}**. A naive payback is {{invest}} ÷ {{pre_tariff}} = {{naive_payback}}.

**2. Duties.**
{{cogs}} × {{tariff_share}} × {{tariff_rate}} = **{{tariff}}**, which cuts store profit to **{{store_ebit}}**.

**3. Cannibalization.**
{{online_ca}} × {{cannibal}} = {{shifted}} of existing online sales moves to the stores. At {{online_contrib}} contribution, Haven & Oak loses **{{lost_contrib}}**.
Incremental profit: {{store_ebit}} − {{lost_contrib}} = **{{incr_ebit}}** a year.
Payback: {{invest}} ÷ {{incr_ebit}} = **{{payback}}**, outside the {{hurdle}} limit.

**4. Shift sourcing.**
With {{tariff_fix}} of cost of goods facing duty: {{cogs}} × {{tariff_fix}} × {{tariff_rate}} = {{tariff_new}}, avoiding **{{tariff_saved}}** a year.
Incremental profit rises to **{{incr_fix}}** and payback falls to **{{payback_fix}}**, inside the limit.

## Synthesis

> **Ask:** What would you tell the CEO?

**Enter Canada with stores, but only after moving sourcing to cut duties. As planned, the first wave pays back in {{payback}}, outside the board's {{hurdle}}-year limit. After the sourcing change, profit is {{incr_fix}} a year and payback is {{payback_fix}}.**

1. **Stores are profitable before duties:** {{pre_tariff}} a year, but that overstates the gain.
2. **Two leaks:** duties cost {{tariff}} a year, and {{shifted}} of sales is not new, costing {{lost_contrib}} of online contribution.
3. **The fix is in sourcing:** shifting suppliers avoids {{tariff_saved}} a year and is the difference between failing and passing the hurdle.

**Risks and next steps:** sales per store are a forecast for mature stores, so test with a pilot of three or four stores before the full {{stores}}; check how long ramp-up takes, because early years will lose money; confirm which suppliers can qualify for duty-free entry and how fast; stay alert to trade rules changing, since the case depends on them; compare the distribution center with using a third-party operator to reduce the {{dc_capex}} commitment; and check French-language and local-taste needs in Quebec.

## Common mistakes

- Stopping at the naive payback of {{naive_payback}} and ignoring duties and cannibalization.
- Counting all {{sales_total}} of store sales as incremental when {{shifted}} was already ours.
- Treating duties as a percent of sales instead of a share of cost of goods.
- Forgetting the distribution center and launch costs in the investment.
- Asking for payback in the steady state without mentioning ramp-up.

## What top candidates do differently

- Look for the existing business hiding in the new one: current Canadian online buyers.
- Quantify duties as a function of sourcing, and then ask what the company can control.
- Offer a staged entry (pilot, then scale) rather than all-or-nothing.
- Link the recommendation back to the board's {{hurdle}}-year test.

## Creative question

Besides opening its own stores, how else could Haven & Oak serve Canadian customers?

## Model answer

Organize by **how much the company invests**:

- **Online only:** open a Canadian warehouse and fast delivery, with no stores.
- **Pop-up and small formats:** showrooms in malls where customers see furniture and order online, with a small footprint.
- **Partner:** sell through a Canadian department store or home-improvement chain.
- **Marketplace:** list on Canadian online marketplaces and use their delivery network.

A top candidate prioritizes: "Showrooms plus online ordering capture most of the benefit of stores at a fraction of the {{invest}} investment, and make a good pilot before committing to large stores."
