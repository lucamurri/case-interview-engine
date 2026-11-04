---
id: pe-hvac-services-buyout
title: "Keeping It Cool: A Private Equity Bid for an HVAC Maintenance Company"
client: "Harrow Lane Partners (fictional), a mid-market private equity fund"
summary: "A PE fund is offered a commercial HVAC maintenance company at a fixed asking price. Rebuild the real EBITDA, value the business at exit, and decide whether the seller's margin plan is credible."
industry: other
sub_industry: "Industrial services"
type: m-and-a
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company or deal data.
inputs:
  rev:              { value: 200,  unit: "$M",    label: "Revenue, FY2025" }
  contract_rev:     { value: 120,  unit: "$M",    label: "Revenue from multi-year maintenance contracts, FY2025" }
  repair_rev:       { value: 80,   unit: "$M",    label: "Revenue from one-off repairs and replacements, FY2025" }
  labor:            { value: 90,   unit: "$M",    label: "Technician labor cost" }
  parts:            { value: 50,   unit: "$M",    label: "Parts and materials" }
  sga:              { value: 40,   unit: "$M",    label: "Sales, general and administrative costs" }
  addbacks:         { value: 4,    unit: "$M",    label: "Seller's add-back: overtime and recruiting costs labeled \"one-time\"" }
  ask_price:        { value: 240,  unit: "$M",    label: "Seller's fixed asking price (enterprise value)" }
  debt:             { value: 120,  unit: "$M",    label: "Debt lenders will provide at entry" }
  paydown:          { value: 45,   unit: "$M",    label: "Debt repaid from cash flow over the hold" }
  hold:             { value: 5,    unit: "years", label: "Holding period" }
  exit_rev:         { value: 250,  unit: "$M",    label: "Revenue in the exit year (seller's plan, accepted by the fund)" }
  exit_multiple:    { value: 10,   unit: "x",     label: "Exit multiple (EV/EBITDA)" }
  target_moic:      { value: 2.5,  unit: "x",     label: "Fund's target multiple of invested capital", decimals: 1 }
  lever_price:      { value: 0.01, unit: "pts",   label: "Margin gain from annual price escalators in contracts" }
  lever_purch:      { value: 0.01, unit: "pts",   label: "Margin gain from central parts purchasing" }
  lever_util:       { value: 0.04, unit: "pts",   label: "Margin gain from higher technician utilization (seller's plan)" }
  util_now:         { value: 0.60, unit: "%",     label: "Technician billable utilization today" }
  util_plan:        { value: 0.80, unit: "%",     label: "Billable utilization in the seller's plan" }
  util_median:      { value: 0.65, unit: "%",     label: "Billable utilization, peer median" }
  util_top:         { value: 0.70, unit: "%",     label: "Billable utilization, peer top quartile" }

calculations:
  # --- Rebuild EBITDA ---
  - { id: ebitda, label: "Rebuilt EBITDA, FY2025", formula: "rev - labor - parts - sga", expected: 20, unit: "$M" }
  - { id: margin, label: "EBITDA margin, FY2025", formula: "ebitda / rev", expected: 0.10, unit: "%" }
  - { id: contract_share, label: "Contract share of revenue", formula: "contract_rev / rev", expected: 0.60, unit: "%" }
  - { id: seller_ebitda, label: "Seller's \"adjusted\" EBITDA", formula: "ebitda + addbacks", expected: 24, unit: "$M" }
  - { id: seller_multiple, label: "Asking price as a multiple of the seller's EBITDA", formula: "ask_price / seller_ebitda", expected: 10, unit: "x" }
  - { id: true_multiple, label: "Asking price as a multiple of rebuilt EBITDA", formula: "ask_price / ebitda", expected: 12, unit: "x" }
  - { id: addback_value, label: "Price the add-back is worth at the exit multiple", formula: "addbacks * exit_multiple", expected: 40, unit: "$M" }
  # --- Entry ---
  - { id: equity, label: "Equity invested by the fund", formula: "ask_price - debt", expected: 120, unit: "$M" }
  - { id: exit_debt, label: "Debt at exit", formula: "debt - paydown", expected: 75, unit: "$M" }
  # --- Seller's plan ---
  - { id: plan_margin, label: "EBITDA margin in the seller's plan", formula: "margin + lever_price + lever_purch + lever_util", expected: 0.16, unit: "%" }
  - { id: plan_ebitda, label: "Exit-year EBITDA, seller's plan", formula: "exit_rev * plan_margin", expected: 40, unit: "$M" }
  - { id: plan_ev, label: "Exit value, seller's plan", formula: "plan_ebitda * exit_multiple", expected: 400, unit: "$M" }
  - { id: plan_equity, label: "Exit equity, seller's plan", formula: "plan_ev - exit_debt", expected: 325, unit: "$M" }
  - { id: plan_moic, label: "MOIC, seller's plan", formula: "plan_equity / equity", expected: 2.708, unit: "x", decimals: 1 }
  - { id: plan_gain, label: "Total margin gain in the seller's plan", formula: "plan_margin - margin", expected: 0.06, unit: "pts" }
  - { id: util_share, label: "Utilization lever's share of the planned margin gain", formula: "lever_util / plan_gain", expected: 0.667, unit: "%", decimals: 0 }
  # --- Credible plan ---
  - { id: margin_per_point, label: "Margin gain per point of utilization (seller's own math)", formula: "lever_util / ((util_plan - util_now) * 100)", expected: 0.002, unit: "pts", decimals: 1 }
  - { id: real_util_gain, label: "Margin gain if utilization reaches the peer top quartile", formula: "margin_per_point * (util_top - util_now) * 100", expected: 0.02, unit: "pts" }
  - { id: real_margin, label: "Credible EBITDA margin at exit", formula: "margin + lever_price + lever_purch + real_util_gain", expected: 0.14, unit: "%" }
  - { id: real_ebitda, label: "Credible exit-year EBITDA", formula: "exit_rev * real_margin", expected: 35, unit: "$M" }
  - { id: real_ev, label: "Credible exit value", formula: "real_ebitda * exit_multiple", expected: 350, unit: "$M" }
  - { id: real_equity, label: "Credible exit equity", formula: "real_ev - exit_debt", expected: 275, unit: "$M" }
  - { id: real_moic, label: "MOIC, credible plan", formula: "real_equity / equity", expected: 2.292, unit: "x", decimals: 1 }
  - { id: util_gap_value, label: "Exit value that rests on utilization above the top quartile", formula: "plan_ev - real_ev", expected: 50, unit: "$M" }
  # --- Price the fund can pay ---
  - { id: max_equity, label: "Most equity the fund can invest and still hit its target", formula: "real_equity / target_moic", expected: 110, unit: "$M" }
  - { id: max_price, label: "Highest price that hits the target on the credible plan", formula: "max_equity + debt", expected: 230, unit: "$M" }
  - { id: max_multiple, label: "Highest price as a multiple of rebuilt EBITDA", formula: "max_price / ebitda", expected: 11.5, unit: "x", decimals: 1 }
  - { id: price_gap, label: "Asking price above the highest justified price", formula: "ask_price - max_price", expected: 10, unit: "$M" }

answer:
  calc: max_price
  headline: "Not at {{ask_price}}: real EBITDA is {{ebitda}}, not {{seller_ebitda}}, and the seller's plan needs utilization of {{util_plan}} that no peer reaches; on a credible plan the deal returns {{real_moic}}, so bid no more than {{max_price}}."

exhibits:
  - id: exhibit-1
    title: "Coldbrook Mechanical: income statement as presented by the seller, FY2025"
    kind: table
    ask: "Here is the seller's income statement. What is the business really earning?"
    columns: ["Line", "FY2025", "Comment"]
    rows:
      - ["Maintenance contracts", "{{contract_rev}}", "Multi-year contracts with office, hospital and school buildings"]
      - ["Repairs and replacements", "{{repair_rev}}", "One-off jobs, often for contract customers"]
      - ["**Revenue**", "**{{rev}}**", ""]
      - ["Technician labor", "{{labor}}", "Includes overtime and recruiting agencies"]
      - ["Parts and materials", "{{parts}}", "Bought branch by branch"]
      - ["Sales, general and administrative", "{{sga}}", ""]
      - ["Add-back: overtime and recruiting", "+{{addbacks}}", "Seller calls these \"one-time\"; similar amounts appear in FY2023 and FY2024"]
      - ["**Adjusted EBITDA (seller)**", "**{{seller_ebitda}}**", "Asking price {{ask_price}}, \"only 10x\""]
    note: "Illustrative data created for this practice case. Coldbrook Mechanical and Harrow Lane Partners are fictional."
    insight: |
      The add-back recurs every year: technicians are scarce, so overtime and
      recruiting are a running cost, not a one-time one. Real EBITDA is
      {{ebitda}}, which makes the asking price {{true_multiple}}, not {{seller_multiple}}.
  - id: exhibit-2
    title: "Seller's plan: EBITDA margin from {{margin}} to {{plan_margin}} by the exit year"
    kind: table
    ask: "The seller says the margin will reach {{plan_margin}}. What return does that give the fund, and do you believe it?"
    columns: ["Lever", "Margin gain", "What it assumes"]
    rows:
      - ["Price escalators in contracts", "+{{lever_price}}", "Annual increases already written into most contracts"]
      - ["Central parts purchasing", "+{{lever_purch}}", "Volume discounts from two national distributors"]
      - ["Technician utilization", "+{{lever_util}}", "Billable hours rise from {{util_now}} to {{util_plan}} of paid hours with new routing software. Net figure: most freed hours are reinvested in technician retention pay, scheduling software and more hours per job"]
      - ["**Total**", "**+{{plan_gain}}**", "Exit-year revenue of {{exit_rev}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Two-thirds of the planned margin gain ({{util_share}}) comes from one
      lever: technician utilization. That is the assumption to test.
  - id: exhibit-3
    title: "Technician billable utilization: Coldbrook versus peers"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Here is how Coldbrook's technicians compare with other HVAC service companies. What does it do to your answer?"
    data:
      - { label: "Coldbrook today", value: util_now }
      - { label: "Peer median", value: util_median }
      - { label: "Peer top quartile", value: util_top }
      - { label: "Seller's plan", value: util_plan }
    reference: { value: util_top, label: "Peer top quartile" }
    note: "Illustrative data from a fictional benchmarking study created for this practice case. Utilization is billable hours divided by paid hours; the rest is driving, training and waiting for parts."
    insight: |
      The plan asks Coldbrook to beat the best peers by ten points. Driving
      between sites puts a ceiling on utilization; reaching the top quartile
      ({{util_top}}) is ambitious, {{util_plan}} is not credible.
---

## Prompt

Our client, Harrow Lane Partners, is a mid-market private equity fund. A banker has brought it **Coldbrook Mechanical**, a company that maintains and repairs heating, ventilation and air-conditioning (HVAC) systems in commercial buildings across the US Southeast. Coldbrook has about 900 technicians working out of 14 branches.

The founder wants to retire and is asking a **fixed price of {{ask_price}}** — no auction, take it or leave it. The banker's pitch is that this is "only 10x EBITDA" for a business with recurring contracts and a clear plan to raise margins. The fund's partners ask us: **should Harrow Lane buy Coldbrook at the asking price?**

## Clarifying information

- Q: What return does the fund need?
  A: At least **{{target_moic}}** its equity (MOIC) over a hold of about **{{hold}}**.
- Q: How would the deal be financed?
  A: Lenders will provide **{{debt}}** of debt; the fund puts in the rest as equity. Cash flow repays about **{{paydown}}** of debt over the hold. Ignore fees and taxes.
- Q: What exit multiple should we assume?
  A: Similar HVAC service companies sell for about **{{exit_multiple}}** EBITDA. The fund does not count on selling for a higher multiple than that.
- Q: What does the revenue look like?
  A: About {{contract_share}} comes from multi-year maintenance contracts, which renew at over 90%. The rest is one-off repair and replacement work, much of it for contract customers.
- Q: What is the revenue outlook?
  A: The fund's own diligence supports the seller's revenue forecast of about **{{exit_rev}}** in the exit year, driven by contract growth and price escalators. The question is the margin, not the revenue.
- Q: Technician labor is {{labor}}, about 45% of revenue. Why does 20 points of utilization add only {{lever_util}} of margin?
  A: The gross saving would be much larger, but the seller's plan reinvests most of the freed hours: retention pay to keep scarce technicians, scheduling software, and more hours per job on contract visits. The net gain in the plan is about **0.2 pts of margin per point of utilization**.
- Q: What are the main risks in this industry?
  A: A shortage of trained technicians, customers switching to building owners' in-house teams, and price competition on one-off repair work.

## Structure

> **Ask:** The candidate should lay out how to judge the deal before asking for numbers.

Three questions, in order:

- **1. What does the business really earn today?**
  - Revenue by stream (contracts versus one-off repairs)
  - Costs: technician labor, parts, overhead
  - Seller's adjustments: are the add-backs really one-time?
- **2. What could it earn at exit, and what is that worth?**
  - Exit-year revenue × EBITDA margin × exit multiple
  - Margin levers in the seller's plan: which are already contracted, which depend on operations?
- **3. Does the return clear the target at this price?**
  - Exit value − debt at exit = equity; ÷ equity invested = MOIC
  - If not, what is the highest price that works?

Also worth raising: technician supply (the business can't grow without people), contract renewal rates, and customer concentration.

A strong hypothesis: *"A fixed price set by the seller usually rests on the seller's numbers. I want to rebuild EBITDA myself and find the one assumption the plan depends on most."*

## Math walkthrough

> **Ask:** The candidate should rebuild EBITDA, compute the return on the seller's plan, then test the utilization assumption and find the highest price the fund can pay.

**1. Rebuild EBITDA (Exhibit 1).**
EBITDA = $200M − $90M − $50M − $40M = **{{ebitda}}**, a {{margin}} margin.
The seller adds back {{addbacks}} of overtime and recruiting, but the same cost appears every year. With technicians scarce, it is part of running the business. Rebuilt EBITDA stays at **{{ebitda}}**, so the asking price is **{{true_multiple}}** EBITDA, not {{seller_multiple}}. At a {{exit_multiple}} multiple, that add-back alone is worth {{addback_value}} of price.

**2. Entry.**
Equity = $240M − $120M = **{{equity}}**. Debt at exit = $120M − $45M = **{{exit_debt}}**.

**3. The seller's plan (Exhibit 2).**
Exit margin = 10% + 1 pt + 1 pt + 4 pts = **{{plan_margin}}**.
Exit EBITDA = $250M × 16% = {{plan_ebitda}}; exit value = $40M × 10 = **{{plan_ev}}**.
Exit equity = $400M − $75M = {{plan_equity}}; MOIC = $325M ÷ $120M ≈ **{{plan_moic}}**. On the seller's numbers the deal clears the {{target_moic}} target.

**4. Test the big assumption (Exhibit 3).**
Utilization delivers {{util_share}} of the planned margin gain. The seller's own math is 4 pts for 20 points of utilization, or **{{margin_per_point}}** of margin per point.
No peer reaches {{util_plan}}. A credible stretch is the top quartile, {{util_top}}: 10 points × 0.2 pts = **{{real_util_gain}}**.

| Item | Seller's plan | Credible plan |
|---|---|---|
| Exit margin | {{plan_margin}} | {{real_margin}} |
| Exit EBITDA | {{plan_ebitda}} | {{real_ebitda}} |
| Exit value (× 10) | {{plan_ev}} | {{real_ev}} |
| Less debt at exit | {{exit_debt}} | {{exit_debt}} |
| Exit equity | {{plan_equity}} | {{real_equity}} |
| **MOIC** | **{{plan_moic}}** | **{{real_moic}}** |

The unrealistic part of the plan is worth **{{util_gap_value}}** of exit value, and without it the deal misses the target.

**5. Highest price.**
To earn {{target_moic}}, the fund can invest at most $275M ÷ 2.5 = **{{max_equity}}** of equity. Adding {{debt}} of debt, the highest price is **{{max_price}}**, or {{max_multiple}} rebuilt EBITDA, which is {{price_gap}} below the ask.

## Synthesis

> **Ask:** The candidate should give the partners a clear recommendation and a price.

**Harrow Lane should not buy Coldbrook at {{ask_price}}. Real EBITDA is {{ebitda}}, not {{seller_ebitda}}, and the seller's plan needs technician utilization of {{util_plan}}, above every peer. On a credible plan the deal returns {{real_moic}}, below the {{target_moic}} target. The fund should go back with no more than {{max_price}}.**

1. **The price is {{true_multiple}} EBITDA, not {{seller_multiple}}:** the {{addbacks}} add-back recurs every year and should not be paid for.
2. **One lever carries the plan:** utilization delivers {{util_share}} of the margin gain. Capping it at the peer top quartile ({{util_top}}) gives a {{real_margin}} margin instead of {{plan_margin}}.
3. **The gap is bridgeable:** the business is good (recurring contracts, contracted price escalators), and {{max_price}} is only {{price_gap}} below the ask.

**Risks and next steps:** the seller has said the price is fixed, so offer structure instead of a lower headline: for example {{max_price}} upfront plus an earn-out paid only if the margin passes {{real_margin}}. That pays the founder for the plan only if it works. In diligence, ride along with technicians to see where the unbilled hours go; check technician turnover and wage inflation, which hit the biggest cost line; and confirm the contract renewal rate by customer.

## Common mistakes

- Accepting the seller's "adjusted" EBITDA without asking whether the add-backs recur.
- Calculating MOIC on enterprise value instead of equity.
- Accepting a 16% margin because each lever sounds reasonable on its own, without checking it against peers.
- Saying "walk away" without giving a price at which the fund would buy. The business is attractive; the price is the problem.

## What top candidates do differently

- Ask for the income statement and rebuild EBITDA line by line before discussing value.
- Rank the plan's levers by how much they rely on execution: price escalators are written into contracts, utilization is not.
- Sanity-check the lever against the labor cost line: with labor at 45% of revenue, 10 points of utilization would save about 6 margin points gross, so they ask where the rest goes and learn the plan reinvests most of the freed hours.
- Use the seller's own math (margin per utilization point) to scale the lever down, instead of throwing it out.
- Turn the disagreement into a deal structure: an earn-out lets the seller keep the upside they believe in.

## Creative question

Beyond routing software, how could Coldbrook get more billable hours out of the technicians it already has?

## Model answer

Group the ideas by **where an unbilled hour goes**: driving, waiting and admin.

- **Driving:** group contract visits by neighborhood; assign technicians to a fixed set of buildings near their homes; move some branches closer to customer clusters.
- **Waiting for parts:** stock the most common parts in vans; next-morning parts delivery to the job site; remote diagnosis by sensor so the technician arrives with the right part.
- **Admin:** mobile apps for work orders and invoicing instead of paper; send junior helpers on routine filter changes so senior technicians do the complex, higher-priced work.

A top candidate prioritizes: "Van stock and remote diagnosis first. A second trip for a missing part doubles the driving and wastes the first visit, so cutting return trips raises utilization and customer satisfaction together."
