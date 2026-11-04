---
id: solar-installer-margins
title: "Sunset Margins: A Residential Solar Installer Under Pressure"
client: "Brisbury Solar (fictional), a residential rooftop-solar installer in the US Southwest"
summary: "A rooftop-solar installer's profit fell 90% after a change in how utilities pay for exported power. Find the real cause, then choose between a price cut and a battery bundle."
industry: energy
sub_industry: "Residential solar / distributed energy"
type: profitability
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  leads:          { value: 40000, unit: "leads",     label: "Qualified sales leads per year (both years)" }
  cost_per_lead:  { value: 300,   unit: "$/lead",    label: "Marketing and sales cost per lead" }
  close_23:       { value: 0.10,  unit: "%",         label: "Close rate (leads that sign), FY2023" }
  close_25:       { value: 0.06,  unit: "%",         label: "Close rate, FY2025" }
  price_23:       { value: 24000, unit: "$/install", label: "Average price per installed system, FY2023" }
  price_25:       { value: 22000, unit: "$/install", label: "Average price per installed system, FY2025" }
  equip_23:       { value: 8000,  unit: "$/install", label: "Equipment cost per system (panels, inverter, racking), FY2023" }
  equip_25:       { value: 7000,  unit: "$/install", label: "Equipment cost per system, FY2025" }
  labor:          { value: 4000,  unit: "$/install", label: "Installation labor and permitting per system (both years)" }
  overhead:       { value: 12,    unit: "$M",        label: "Fixed overhead: design, warehouses, admin (both years)" }
  itc:            { value: 0.30,  unit: "%",         label: "Federal tax credit for the homeowner" }
  savings_23:     { value: 2400,  unit: "$/year",    label: "Homeowner's bill savings, before the export-credit cut" }
  savings_25:     { value: 1400,  unit: "$/year",    label: "Homeowner's bill savings, after the export-credit cut" }
  target:         { value: 5,     unit: "$M",        label: "CEO's operating-profit target within a year" }
  price_cut:      { value: 2000,  unit: "$/install", label: "Option A: price cut per system" }
  close_a:        { value: 0.075, unit: "%",         label: "Option A: expected close rate", decimals: 1 }
  attach:         { value: 0.50,  unit: "%",         label: "Option B: share of customers adding a battery" }
  battery_margin: { value: 4000,  unit: "$/battery", label: "Option B: margin per battery after equipment and install" }
  close_b:        { value: 0.065, unit: "%",         label: "Option B: expected close rate", decimals: 1 }

calculations:
  # --- Funnel and fixed costs ---
  - { id: installs_23, label: "Installs, FY2023", formula: "leads * close_23", expected: 4000, unit: "installs" }
  - { id: installs_25, label: "Installs, FY2025", formula: "leads * close_25", expected: 2400, unit: "installs" }
  - { id: install_drop, label: "Fall in installs (%)", formula: "1 - installs_25 / installs_23", expected: 0.40, unit: "%" }
  - { id: mkt_spend, label: "Marketing and sales spend (both years)", formula: "leads * cost_per_lead / 1e6", expected: 12, unit: "$M" }
  - { id: fixed_total, label: "Marketing, sales and overhead (fixed in the short run)", formula: "mkt_spend + overhead", expected: 24, unit: "$M" }
  # --- Unit economics per install ---
  - { id: cac_23, label: "Customer acquisition cost per install, FY2023", formula: "mkt_spend * 1e6 / installs_23", expected: 3000, unit: "$/install" }
  - { id: cac_25, label: "Customer acquisition cost per install, FY2025", formula: "mkt_spend * 1e6 / installs_25", expected: 5000, unit: "$/install" }
  - { id: oh_23, label: "Overhead per install, FY2023", formula: "overhead * 1e6 / installs_23", expected: 3000, unit: "$/install" }
  - { id: oh_25, label: "Overhead per install, FY2025", formula: "overhead * 1e6 / installs_25", expected: 5000, unit: "$/install" }
  - { id: contrib_23, label: "Contribution per install (price − equipment − labor), FY2023", formula: "price_23 - equip_23 - labor", expected: 12000, unit: "$/install" }
  - { id: contrib_25, label: "Contribution per install, FY2025", formula: "price_25 - equip_25 - labor", expected: 11000, unit: "$/install" }
  - { id: ppi_23, label: "Profit per install, FY2023", formula: "contrib_23 - cac_23 - oh_23", expected: 6000, unit: "$/install" }
  - { id: ppi_25, label: "Profit per install, FY2025", formula: "contrib_25 - cac_25 - oh_25", expected: 1000, unit: "$/install" }
  # --- Company P&L ---
  - { id: rev_23, label: "Revenue, FY2023", formula: "installs_23 * price_23 / 1e6", expected: 96, unit: "$M" }
  - { id: rev_25, label: "Revenue, FY2025", formula: "installs_25 * price_25 / 1e6", expected: 52.8, unit: "$M", decimals: 1 }
  - { id: rev_drop, label: "Fall in revenue (%)", formula: "1 - rev_25 / rev_23", expected: 0.45, unit: "%" }
  - { id: profit_23, label: "Operating profit, FY2023", formula: "installs_23 * ppi_23 / 1e6", expected: 24, unit: "$M" }
  - { id: profit_25, label: "Operating profit, FY2025", formula: "installs_25 * ppi_25 / 1e6", expected: 2.4, unit: "$M", decimals: 1 }
  - { id: profit_check, label: "Check: FY2025 profit from the P&L", formula: "installs_25 * contrib_25 / 1e6 - fixed_total", expected: 2.4, unit: "$M", decimals: 1 }
  - { id: profit_drop_pct, label: "Fall in operating profit (%)", formula: "1 - profit_25 / profit_23", expected: 0.90, unit: "%" }
  - { id: margin_23, label: "Operating margin, FY2023", formula: "profit_23 / rev_23", expected: 0.25, unit: "%" }
  - { id: margin_25, label: "Operating margin, FY2025", formula: "profit_25 / rev_25", expected: 0.04545, unit: "%", decimals: 1 }
  # --- Per-install bridge ---
  - { id: br_price, label: "Price effect per install", formula: "price_25 - price_23", expected: -2000, unit: "$/install" }
  - { id: br_equip, label: "Equipment effect per install", formula: "equip_23 - equip_25", expected: 1000, unit: "$/install" }
  - { id: br_cac, label: "Acquisition-cost effect per install", formula: "cac_23 - cac_25", expected: -2000, unit: "$/install" }
  - { id: br_oh, label: "Overhead effect per install", formula: "oh_23 - oh_25", expected: -2000, unit: "$/install" }
  - { id: br_total, label: "Bridge total (must equal change in profit per install)", formula: "br_price + br_equip + br_cac + br_oh", expected: -5000, unit: "$/install" }
  - { id: absorption_share, label: "Share of the per-install drop from spreading fixed costs over fewer installs", formula: "(br_cac + br_oh) / br_total", expected: 0.80, unit: "%" }
  # --- Why close rates fell: the homeowner's payback ---
  - { id: hh_cost_23, label: "Homeowner's net cost after tax credit, FY2023", formula: "price_23 * (1 - itc)", expected: 16800, unit: "$" }
  - { id: hh_cost_25, label: "Homeowner's net cost after tax credit, FY2025", formula: "price_25 * (1 - itc)", expected: 15400, unit: "$" }
  - { id: hh_payback_23, label: "Homeowner payback, FY2023", formula: "hh_cost_23 / savings_23", expected: 7, unit: "years" }
  - { id: hh_payback_25, label: "Homeowner payback, FY2025", formula: "hh_cost_25 / savings_25", expected: 11, unit: "years" }
  - { id: hh_payback_nocredit, label: "Homeowner payback at today's price with no federal tax credit", formula: "price_25 / savings_25", expected: 15.71, unit: "years", decimals: 0 }
  # --- Option A: price cut ---
  - { id: installs_a, label: "Option A: installs", formula: "leads * close_a", expected: 3000, unit: "installs" }
  - { id: contrib_a, label: "Option A: contribution per install", formula: "contrib_25 - price_cut", expected: 9000, unit: "$/install" }
  - { id: profit_a, label: "Option A: operating profit", formula: "installs_a * contrib_a / 1e6 - fixed_total", expected: 3.0, unit: "$M", decimals: 1 }
  - { id: breakeven_installs_a, label: "Option A: installs needed just to match today's profit", formula: "(profit_25 + fixed_total) * 1e6 / contrib_a", expected: 2933.3, unit: "installs", decimals: 0 }
  - { id: breakeven_close_a, label: "Option A: close rate needed to match today's profit", formula: "breakeven_installs_a / leads", expected: 0.07333, unit: "%", decimals: 1 }
  # --- Option B: battery bundle ---
  - { id: battery_per_install, label: "Option B: battery margin per install (attach × margin)", formula: "attach * battery_margin", expected: 2000, unit: "$/install" }
  - { id: contrib_b, label: "Option B: contribution per install", formula: "contrib_25 + battery_per_install", expected: 13000, unit: "$/install" }
  - { id: installs_b, label: "Option B: installs", formula: "leads * close_b", expected: 2600, unit: "installs" }
  - { id: profit_b, label: "Option B: operating profit", formula: "installs_b * contrib_b / 1e6 - fixed_total", expected: 9.8, unit: "$M", decimals: 1 }
  - { id: profit_b_flat, label: "Option B: profit if the close rate does not improve at all", formula: "installs_25 * contrib_b / 1e6 - fixed_total", expected: 7.2, unit: "$M", decimals: 1 }
  - { id: gain_a, label: "Option A: gain versus today", formula: "profit_a - profit_25", expected: 0.6, unit: "$M", decimals: 1 }
  - { id: gain_b, label: "Option B: gain versus today", formula: "profit_b - profit_25", expected: 7.4, unit: "$M", decimals: 1 }

answer:
  calc: profit_25
  headline: "Profit fell to {{profit_25}} because the close rate dropped and fixed sales and overhead costs were spread over {{install_drop}} fewer installs; a battery bundle (+{{gain_b}}) beats a price cut (+{{gain_a}})."

exhibits:
  - id: exhibit-1
    title: "Brisbury Solar sales funnel and unit economics"
    kind: table
    ask: "Here are the key numbers for the last two years. Where did the profit go?"
    columns: ["", "FY2023", "FY2025"]
    rows:
      - ["Qualified leads", "{{leads}}", "{{leads}}"]
      - ["Close rate", "{{close_23}}", "{{close_25}}"]
      - ["Average price per system", "{{price_23}}", "{{price_25}}"]
      - ["Equipment per system", "{{equip_23}}", "{{equip_25}}"]
      - ["Install labor and permitting per system", "{{labor}}", "{{labor}}"]
      - ["Marketing and sales spend", "{{mkt_spend}}", "{{mkt_spend}}"]
      - ["Fixed overhead", "{{overhead}}", "{{overhead}}"]
      - ["**Operating profit**", "**{{profit_23}}**", "**{{profit_25}}**"]
    note: "Illustrative data created for this practice case. Brisbury Solar is fictional."
    insight: |
      Price fell, but equipment got cheaper too. The striking change is the
      close rate: same leads, same spend, far fewer signed customers. Every
      fixed dollar is now spread over fewer roofs.
  - id: exhibit-2
    title: "Two options to restore profit (management estimates)"
    kind: table
    ask: "Management is debating two options. Which would you choose?"
    columns: ["", "Option A: price cut", "Option B: battery bundle"]
    rows:
      - ["What changes", "Cut price by {{price_cut}}", "Offer a home battery with every quote"]
      - ["Expected close rate", "{{close_a}}", "{{close_b}}"]
      - ["Extra margin", "None", "{{attach}} of customers add a battery at {{battery_margin}}"]
      - ["Marketing, sales and overhead", "Unchanged", "Unchanged"]
    note: "Illustrative data created for this practice case."
    insight: |
      The price cut hurts every install to win a few more; the battery adds
      margin on half of all installs and helps a little with closing.
---

## Prompt

Our client, Brisbury Solar, designs and installs rooftop solar systems for homeowners in a Southwestern US state. It grew quickly for five years and was solidly profitable.

In 2024 the state changed how utilities pay homeowners for the solar power they send back to the grid: the credit for exported power was cut sharply. Since then Brisbury's revenue has fallen by {{rev_drop}} and its operating profit has nearly disappeared.

The CEO has asked us: **why has profit collapsed, and what should Brisbury do to restore it?**

## Clarifying information

- Q: What does a typical job look like?
  A: An average home system, installed for about {{price_25}} today. Brisbury buys the equipment, installs it with its own crews and handles the permits.
- Q: How does Brisbury win customers?
  A: It buys leads (online ads, door-to-door partners, home-show events) at about {{cost_per_lead}}, and its sales team turns a share of them into signed contracts. Lead volume and spend have not changed.
- Q: What exactly changed for homeowners?
  A: Before the rule change, exported solar earned close to the retail electricity price. Now it earns much less, so a typical homeowner saves about {{savings_25}} instead of {{savings_23}}. In both years, homeowners who bought a system also got a {{itc}} federal tax credit on it.
- Q: How are costs structured?
  A: Equipment and install labor scale with each job. Marketing and sales spend and the overhead (designers, warehouses, admin) are fixed in the short run.
- Q: What is the goal?
  A: Get back to at least {{target}} of operating profit within a year, without big layoffs.
- Q: What are competitors doing?
  A: Several have cut prices; a few larger players now push solar-plus-battery packages.

## Structure

> **Ask:** The candidate should build a structure that ties profit to the sales funnel, because the fixed sales cost per install depends on how many leads close.

- **Profit = Installs × Contribution per install − Fixed costs**
  - **Installs = Leads × Close rate**
    - Lead volume and quality
    - Close rate: homeowner economics (payback), competition, sales execution
  - **Contribution per install**
    - Price per system (and mix of system sizes)
    - Equipment cost
    - Install labor and permitting
    - Add-ons: batteries, EV chargers, service plans
  - **Fixed costs**
    - Marketing and sales (customer acquisition)
    - Overhead
- **Per-install view:** profit per install = contribution − acquisition cost per install − overhead per install. Both per-install fixed costs move with volume.

Hypothesis: *"The rule change made solar a worse deal for homeowners, so fewer leads sign. With a fixed sales and overhead base, the cost per install has jumped. This is a volume and fixed-cost absorption problem more than a price problem."*

## Math walkthrough

> **Ask:** The candidate should build a per-install profit bridge, explain what drove the close rate, and then compare the two options in Exhibit 2.

**1. Funnel (Exhibit 1).**
Installs: 40,000 × 10% = **{{installs_23}}** in FY2023; 40,000 × 6% = **{{installs_25}}** in FY2025, down {{install_drop}}.
Marketing and sales spend = 40,000 × $300 = **{{mkt_spend}}** in both years.

**2. Unit economics.**

| Per install | FY2023 | FY2025 |
|---|---|---|
| Contribution (price − equipment − labor) | {{contrib_23}} | {{contrib_25}} |
| Acquisition cost ($12M ÷ installs) | {{cac_23}} | {{cac_25}} |
| Overhead ($12M ÷ installs) | {{oh_23}} | {{oh_25}} |
| **Profit per install** | **{{ppi_23}}** | **{{ppi_25}}** |

Operating profit: 4,000 × $6,000 = **{{profit_23}}** in FY2023 and 2,400 × $1,000 = **{{profit_25}}** in FY2025, down {{profit_drop_pct}}. Margin went from {{margin_23}} to {{margin_25}}.

**3. Bridge per install.**

| Driver | Calculation | Impact |
|---|---|---|
| Price | $22,000 − $24,000 | {{br_price}} |
| Equipment | $8,000 − $7,000 | +{{br_equip}} |
| Acquisition cost per install | $3,000 − $5,000 | {{br_cac}} |
| Overhead per install | $3,000 − $5,000 | {{br_oh}} |
| **Total** | | **{{br_total}}** |

Spreading fixed costs over fewer installs explains **{{absorption_share}}** of the drop. Cheaper equipment offset half of the price cut.

**4. Why the close rate fell.**
Homeowner payback before: $24,000 × (1 − 30%) ÷ $2,400 = $16,800 ÷ $2,400 = **{{hh_payback_23}}**. After: $22,000 × 70% ÷ $1,400 = $15,400 ÷ $1,400 = **{{hh_payback_25}}**. A payback of {{hh_payback_25}} is a much harder sell.

**5. Option A: price cut.**
Installs = 40,000 × 7.5% = {{installs_a}}; contribution = $11,000 − $2,000 = {{contrib_a}}.
Profit = 3,000 × $9,000 − $24M = **{{profit_a}}**, only +{{gain_a}} versus today.
Break-even: Brisbury needs ($2.4M + $24M) ÷ $9,000 ≈ {{breakeven_installs_a}}, a close rate of **~{{breakeven_close_a}}**, just to stand still. The whole gain depends on hitting a {{close_a}} close rate.

**6. Option B: battery bundle.**
Extra margin = 50% × $4,000 = {{battery_per_install}}, so contribution = **{{contrib_b}}**.
Profit = 2,600 × $13,000 − $24M = **{{profit_b}}**, or +{{gain_b}}.
Even if the close rate stays at 6%: 2,400 × $13,000 − $24M = **{{profit_b_flat}}**, still far better than Option A and above the CEO's {{target}} target.

## Synthesis

> **Ask:** The candidate should give the CEO an answer-first recommendation.

**Brisbury's profit fell from {{profit_23}} to {{profit_25}} because the export-credit cut lengthened homeowner payback from {{hh_payback_23}} to {{hh_payback_25}}, the close rate fell from {{close_23}} to {{close_25}}, and a fixed sales and overhead base was spread over {{install_drop}} fewer installs. Brisbury should not cut price; it should bundle home batteries, which adds about {{gain_b}} of profit.**

1. **Root cause is fixed-cost absorption, not price:** {{absorption_share}} of the fall in profit per install comes from acquisition cost and overhead per install each rising from {{cac_23}} to {{cac_25}}.
2. **A price cut barely helps:** it adds only {{gain_a}} and needs a close rate of ~{{breakeven_close_a}} just to break even with today.
3. **Batteries fix the homeowner's problem and Brisbury's:** storing solar instead of exporting it restores savings, and the battery margin adds {{battery_per_install}}. The option is robust: even with no close-rate improvement, profit reaches {{profit_b_flat}}.

**Risks and next steps:** battery supply and install capacity (crews need training); confirm the attach rate with a pilot in one region; in parallel cut the worst lead sources, because with a {{close_25}} close rate each low-quality lead is expensive; grow cheaper referral leads from Brisbury's existing customers. Watch federal policy too: the homeowner tax credit ended for systems installed after 2025, which would stretch payback to about {{hh_payback_nocredit}} on today's numbers. That makes the battery bundle and financing offers (leases and power-purchase agreements) more important, and the close rates in Exhibit 2 need re-testing against it.

## Common mistakes

- Blaming the price cut: price fell, but cheaper equipment offset half of it. The bigger story is volume.
- Treating customer acquisition cost as a variable cost. Spend is fixed; the cost *per install* rose only because fewer leads closed.
- Recommending a price cut without checking the break-even close rate.
- Ignoring the homeowner. The case is driven by the customer's payback, so the best answer fixes the customer's economics.

## What top candidates do differently

- Link the regulation change to homeowner payback with one quick calculation, which explains the close-rate drop instead of just describing it.
- Build the per-install bridge and show that the four parts sum to {{br_total}}.
- Test the battery option under a pessimistic case (no close-rate lift) and show it still wins.
- Mention lead quality: the same {{mkt_spend}} could buy fewer, better leads.

## Creative question

Beyond batteries, how could Brisbury change its business model to stay attractive under the new export-credit rules?

## Model answer

Think about **what the homeowner buys, how they pay, and who else could be the customer**:

- **What they buy:** whole-home energy packages (solar, battery, smart thermostat, EV charger) that maximize self-consumption; system sizing to match the home's own use rather than export.
- **How they pay:** leases or power-purchase agreements (the homeowner pays a monthly fee with no upfront cost) through a financing partner, which turns a long payback into immediate savings.
- **Who else:** home builders (solar installed on new homes at lower acquisition cost), small businesses, and virtual power plant programs where a utility pays battery owners to share stored power at peak times.
- **Service:** maintenance and monitoring plans for the installed base, a steady revenue stream with no acquisition cost.

A top candidate prioritizes: "Financing is the fastest lever, because a monthly payment below the homeowner's savings makes payback irrelevant; builder partnerships attack the acquisition-cost problem directly."
