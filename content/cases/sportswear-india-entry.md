---
id: sportswear-india-entry
title: "Running Start: A European Sportswear Brand Entering India"
client: "Veltrup Running (fictional), a German running-shoe and apparel brand"
summary: "A mid-size European running brand wants to enter India's fast-growing premium sportswear market. The market is attractive — the real question is which entry model can break even at a realistic market share."
industry: consumer-retail
sub_industry: "Sportswear / international expansion"
type: market-entry
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real market data.
inputs:
  market_2025:      { value: 1000, unit: "$M",      label: "Premium running footwear and apparel market in India, 2025 (retail value)" }
  market_2028:      { value: 2000, unit: "$M",      label: "Same market, 2028 forecast" }
  plan_share:       { value: 0.015, unit: "%",      label: "Veltrup's realistic market share by 2028", decimals: 1 }
  entrant_low:      { value: 0.01, unit: "%",       label: "Share reached by recent foreign entrants after 3 years (low end)" }
  entrant_high:     { value: 0.02, unit: "%",       label: "Share reached by recent foreign entrants after 3 years (high end)" }
  stores:           { value: 20,   unit: "stores",  label: "Own stores in the company-owned option" }
  store_cost:       { value: 0.6,  unit: "$M",      label: "Rent and staff per store per year", decimals: 1 }
  hq_cost:          { value: 10,   unit: "$M",      label: "Country team, marketing and e-commerce per year (own-store option)" }
  own_cm:           { value: 0.50, unit: "%",       label: "Contribution margin on retail sales (own-store option)" }
  wholesale_share:  { value: 0.50, unit: "%",       label: "Wholesale price as a share of retail price (partner option)" }
  partner_cm:       { value: 0.40, unit: "%",       label: "Veltrup's contribution margin on wholesale revenue (partner option)" }
  partner_fixed:    { value: 4,    unit: "$M",      label: "Fixed cost per year, partner option (small team + brand marketing)" }
  own_upfront:      { value: 30,   unit: "$M",      label: "Upfront investment, own-store option" }
  partner_upfront:  { value: 6,    unit: "$M",      label: "Upfront investment, partner option" }
  hurdle_years:     { value: 4,    unit: "years",   label: "Board's maximum payback period" }
  store_benchmark:  { value: 1.2,  unit: "$M",      label: "Typical annual sales of a premium sportswear store in an Indian mall", decimals: 1 }

calculations:
  # --- Market ---
  - { id: market_multiple, label: "Market growth 2025 to 2028", formula: "market_2028 / market_2025", expected: 2, unit: "x", decimals: 0 }
  # --- Own stores: break-even ---
  - { id: own_fixed, label: "Fixed cost per year, own stores", formula: "stores * store_cost + hq_cost", expected: 22, unit: "$M" }
  - { id: own_be_rev, label: "Break-even retail sales, own stores", formula: "own_fixed / own_cm", expected: 44, unit: "$M" }
  - { id: own_be_share, label: "Market share needed to break even, own stores", formula: "own_be_rev / market_2028", expected: 0.022, unit: "%", decimals: 1 }
  - { id: own_be_per_store, label: "Break-even sales needed per store", formula: "own_be_rev / stores", expected: 2.2, unit: "$M", decimals: 1 }
  # --- Partner: break-even ---
  - { id: partner_cm_retail, label: "Veltrup's contribution per $1 of retail sales, partner option", formula: "wholesale_share * partner_cm", expected: 0.20, unit: "%" }
  - { id: partner_be_rev, label: "Break-even retail sales, partner option", formula: "partner_fixed / partner_cm_retail", expected: 20, unit: "$M" }
  - { id: partner_be_share, label: "Market share needed to break even, partner option", formula: "partner_be_rev / market_2028", expected: 0.01, unit: "%", decimals: 1 }
  # --- Profit at the realistic share ---
  - { id: plan_rev, label: "Retail sales at the realistic share, 2028", formula: "plan_share * market_2028", expected: 30, unit: "$M" }
  - { id: own_contrib, label: "Contribution at realistic share, own stores", formula: "plan_rev * own_cm", expected: 15, unit: "$M" }
  - { id: own_loss, label: "Annual loss at realistic share, own stores", formula: "own_fixed - plan_rev * own_cm", expected: 7, unit: "$M" }
  - { id: partner_contrib, label: "Contribution at realistic share, partner option", formula: "plan_rev * partner_cm_retail", expected: 6, unit: "$M" }
  - { id: partner_profit, label: "Annual profit at realistic share, partner option", formula: "partner_contrib - partner_fixed", expected: 2, unit: "$M" }
  - { id: partner_payback, label: "Payback on the partner investment (at 2028 profit)", formula: "partner_upfront / partner_profit", expected: 3, unit: "years", decimals: 0 }
  # --- When would own stores win? ---
  - { id: fixed_gap, label: "Extra fixed cost of own stores", formula: "own_fixed - partner_fixed", expected: 18, unit: "$M" }
  - { id: cm_gap, label: "Extra contribution per $1 of retail sales from own stores", formula: "own_cm - partner_cm_retail", expected: 0.30, unit: "pts" }
  - { id: crossover_rev, label: "Retail sales at which own stores beat the partner", formula: "(own_fixed - partner_fixed) / (own_cm - partner_cm_retail)", expected: 60, unit: "$M" }
  - { id: crossover_share, label: "Market share at which own stores beat the partner", formula: "crossover_rev / market_2028", expected: 0.03, unit: "%", decimals: 0 }

answer:
  calc: partner_be_share
  headline: "Enter India, but through a local retail partner: it breaks even at {{partner_be_share}} share versus {{own_be_share}} for own stores."

exhibits:
  - id: exhibit-1
    title: "Premium running footwear and apparel market in India, retail value ($M)"
    kind: bar
    unit: "$M"
    decimals: 0
    ask: "Here is the client's market estimate. What do you take from it?"
    data:
      - { label: "2022", value: 550 }
      - { label: "2023", value: 700 }
      - { label: "2024", value: 850 }
      - { label: "2025", value: market_2025 }
      - { label: "2028 (forecast)", value: market_2028 }
    note: "Illustrative data created for this practice case; not official market statistics."
    insight: |
      The market is expected to reach {{market_multiple}} its 2025 size in three years — clearly
      attractive. But a big, fast-growing market also attracts every global
      brand, so the real question is how much share Veltrup can win, and
      whether that is enough to cover the cost of the entry model.
  - id: exhibit-2
    title: "Two ways to enter: own stores versus a local retail partner"
    kind: table
    ask: "The team has costed two entry models. Which one can break even at a realistic share?"
    columns: ["", "Own stores + own website", "Exclusive partner (Indian retailer + marketplaces)"]
    rows:
      - ["Who sells to the consumer", "Veltrup", "Partner buys at {{wholesale_share}} of retail price and resells"]
      - ["Veltrup's contribution margin", "{{own_cm}} of retail sales", "{{partner_cm}} of its wholesale revenue"]
      - ["Fixed cost per year", "{{stores}} at {{store_cost}} each + {{hq_cost}} country team and marketing", "{{partner_fixed}} (small team + brand marketing)"]
      - ["Upfront investment", "{{own_upfront}}", "{{partner_upfront}}"]
      - ["Control of pricing and brand experience", "Full", "Shared; partner sets store standards with Veltrup"]
      - ["Share reached by recent foreign entrants after 3 years", "{{entrant_low}}–{{entrant_high}}", "{{entrant_low}}–{{entrant_high}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      The partner earns Veltrup less per dollar of sales, but its fixed
      costs are a fraction of the own-store model. At low volumes, fixed
      costs decide the winner.
---

## Prompt

Our client, Veltrup Running, is a German sportswear brand known for premium running shoes and apparel. It sells in 14 European countries and has about $600M in annual revenue, but growth at home has slowed.

The CEO sees India — a huge population, a growing middle class and a booming running and fitness culture — as the next big opportunity. She has asked us: **should Veltrup enter India, and if so, how?**

## Clarifying information

- Q: What does success look like for Veltrup?
  A: A profitable India business by 2028 (year three), with the upfront investment paid back within **{{hurdle_years}}**. The board is not willing to fund years of losses for brand-building alone.
- Q: Which segment would Veltrup compete in?
  A: Premium running footwear and apparel, with shoes at around $100 or more. It would not launch cheaper products for India at first.
- Q: Who are the competitors?
  A: The big global sportswear brands are all present and spend heavily on marketing; a few specialist running brands entered in the last five years. Local brands compete mainly at lower price points.
- Q: Does Veltrup have any presence in India today?
  A: No. Some Indian runners buy its shoes abroad or through grey-market resellers online, which suggests some brand awareness among serious runners.
- Q: How do Indian consumers buy premium sportswear?
  A: Through a mix of mall stores, multi-brand retail chains and online marketplaces. Online is growing quickly, especially outside the largest cities.
- Q: Are there partnership options?
  A: Yes — a large Indian fashion and lifestyle retailer has offered an exclusive distribution deal: it would buy Veltrup products wholesale and sell them in its stores and on marketplaces. Details are in Exhibit 2.

## Structure

> **Ask:** Lay out how you would decide whether, and how, Veltrup should enter India.

A market-entry structure that ends in **how** to enter, not only **whether**:

- **1. Is the market attractive?**
  - Size and growth of premium running footwear and apparel
  - Who buys: serious runners versus fashion-led "athleisure" buyers
  - Competitive intensity: global brands' marketing spend, price levels
  - Barriers: import duties, foreign-retail ownership rules, real-estate costs
- **2. Can Veltrup win a meaningful share?**
  - Brand awareness and what makes it different (running credibility)
  - Product fit: sizing, climate, price points
  - Benchmarks: what share have similar foreign entrants reached?
- **3. What do the economics look like for each entry model?**
  - Own stores and website: higher margin, high fixed cost
  - Local partner (wholesale): lower margin, low fixed cost
  - Break-even share and payback for each, against the payback hurdle of {{hurdle_years}}
- **4. Recommendation, risks and next steps**

Top candidates frame the crux early: **"India is clearly attractive; the question is whether Veltrup's likely share covers the fixed cost of the entry model it picks."**

## Math walkthrough

> **Ask:** Using Exhibits 1 and 2, what market share does each entry model need to break even by 2028, and how does that compare with what Veltrup can realistically achieve?

**1. Market (Exhibit 1).** The market grows from {{market_2025}} to {{market_2028}} — it is expected to reach {{market_multiple}} its 2025 size in three years. We will test the economics on the 2028 market.

**2. Own stores — break-even.**
Fixed cost = 20 stores × $0.6M + $10M = **{{own_fixed}}** per year.
Each $1 of retail sales contributes $0.50, so break-even sales = $22M ÷ 50% = **{{own_be_rev}}**.
Share needed = $44M ÷ $2,000M = **{{own_be_share}}** — above even the best recent entrant ({{entrant_high}}).

*Sanity check:* that is {{own_be_per_store}} of sales per store, against a typical premium sportswear store in an Indian mall at {{store_benchmark}}. The own-store model does not work at this scale.

**3. Partner — break-even.**
Veltrup earns {{wholesale_share}} of the retail price, and keeps {{partner_cm}} of that, so each $1 of retail sales contributes 50% × 40% = **{{partner_cm_retail}}**.
Break-even sales = $4M ÷ 20% = **{{partner_be_rev}}**, i.e. a share of $20M ÷ $2,000M = **{{partner_be_share}}** — the bottom of the benchmark range.

**4. Profit at a realistic share.** Assume Veltrup reaches the middle of the benchmark range, {{plan_share}}, i.e. retail sales of 1.5% × $2,000M = **{{plan_rev}}**.
- Own stores: contribution $30M × 50% = {{own_contrib}}, minus {{own_fixed}} fixed cost — a loss of **{{own_loss}}** a year.
- Partner: contribution $30M × 20% = {{partner_contrib}}, minus {{partner_fixed}} — a profit of **{{partner_profit}}** a year.
- Partner payback = $6M ÷ $2M = **{{partner_payback}}**, inside the hurdle of {{hurdle_years}}. The own-store model never pays back at this share.

**5. When would own stores make sense?** Own stores earn {{cm_gap}} more margin on each dollar of retail sales (50% versus 20%) but carry **{{fixed_gap}}** more fixed cost. They win once sales exceed $18M ÷ 30% = **{{crossover_rev}}**, i.e. a share of **{{crossover_share}}** — above anything recent entrants have achieved.

## Synthesis

> **Ask:** The CEO asks for your recommendation. What do you tell her?

**Veltrup should enter India, but through the exclusive retail partner rather than its own stores: the partner model breaks even at a {{partner_be_share}} share and pays back in {{partner_payback}}, while own stores would need {{own_be_share}} — more than any recent foreign entrant has reached.**

1. **The market is worth entering:** premium running is expected to reach {{market_multiple}} its 2025 size by 2028, and Veltrup has real running credibility in a crowded athleisure field.
2. **Fixed cost decides the entry model:** at a realistic {{plan_share}} share the partner earns about {{partner_profit}} a year, while own stores would lose about {{own_loss}} a year and need {{own_be_per_store}} of sales per store.
3. **Keep the option to go direct later:** own stores only beat the partner above a {{crossover_share}} share, so negotiate a partner contract that lets Veltrup open a few flagship stores or take over distribution once it reaches that scale.

**Risks and next steps:** partner execution (store standards, discounting that could hurt the brand); import duties and sizing differences for Indian feet; marketing spend needed to stand out against global brands. Next, test product-market fit with a marketplace-only launch in two or three large cities, and negotiate minimum marketing commitments and price controls with the partner.

## Common mistakes

- Stopping at "the market doubles, so enter" without testing whether Veltrup's share covers the cost of entering.
- Comparing the two models on margin alone: own stores keep more per dollar ({{own_cm}} versus {{partner_cm_retail}}), but margin does not matter if volume never covers fixed cost.
- Applying the partner's {{partner_cm}} margin to retail sales instead of to Veltrup's wholesale revenue, which doubles the partner's contribution.
- Answering "yes, enter" without an entry mode, or recommending own stores "for brand control" without checking the economics.

## What top candidates do differently

- Convert break-even sales into a **market share** and compare it with the benchmark range — the cleanest way to test whether a plan is realistic.
- Sanity-check from the bottom up: {{own_be_per_store}} per store versus a typical {{store_benchmark}} quickly shows the own-store plan is out of reach.
- Calculate the crossover share ({{crossover_share}}), which turns "partner now, direct later" into a concrete trigger.
- Raise India-specific issues without being prompted: rules on foreign ownership of retail, import duties, and the importance of online marketplaces outside big cities.

## Creative question

How could Veltrup build its brand among Indian runners without the marketing budgets of the global giants?

## Model answer

A strong answer focuses on the community of serious runners, where Veltrup's credibility is strongest:

- **Own the running community:** sponsor big-city marathons and half-marathons, set up gait-analysis and shoe-fitting stations at races, and support local running clubs with group runs and training plans.
- **Credible voices:** partner with well-known Indian distance runners and coaches rather than film stars, and seed shoes with club captains.
- **Product built for India:** wider fits, breathable materials for heat and humidity, and colorways designed for the market — then tell that story.
- **Digital first:** a running app or training content in several Indian languages, linked to the partner's online store.

A top candidate prioritizes: "Start with marathons and running clubs in two or three cities — it is the cheapest way to reach the buyers who already value what Veltrup does best."
