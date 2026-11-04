---
id: security-startup-build-vs-buy
title: "Build, Buy or Partner: Adding AI Threat Detection to a Software Suite"
client: "Brindle Systems (fictional), a maker of IT-management and security software for mid-size businesses"
summary: "A software company wants an AI threat-detection product to sell to its 10,000 customers. Building looks cheapest, until you price in how many customers it loses by arriving two years late."
industry: tech-ai
sub_industry: "Cybersecurity software"
type: m-and-a
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  customers:        { value: 10000, unit: "customers", label: "Brindle's installed base of business customers" }
  arr:              { value: 40,    unit: "$K",        label: "Annual subscription price per customer for threat detection" }
  attach_fast:      { value: 0.20,  unit: "%",         label: "Share of customers who buy, if Brindle launches within 6 months" }
  attach_mid:       { value: 0.15,  unit: "%",         label: "Share of customers who buy, if Brindle launches in 12 months" }
  attach_slow:      { value: 0.10,  unit: "%",         label: "Share of customers who buy, if Brindle launches in 24 months" }
  own_margin:       { value: 0.75,  unit: "%",         label: "Profit margin on Brindle's own product (after hosting, support and sales)" }
  partner_margin:   { value: 0.30,  unit: "%",         label: "Profit margin to Brindle when reselling a partner's product (after the partner's share)" }
  horizon:          { value: 5,     unit: "years",     label: "Planning horizon" }
  build_cost:       { value: 30,    unit: "$M",        label: "Build: total engineering cost" }
  build_launch:     { value: 2,     unit: "years",     label: "Build: time to launch" }
  buy_price:        { value: 150,   unit: "$M",        label: "Buy: price for Wrenfield AI" }
  integration:      { value: 10,    unit: "$M",        label: "Buy: one-time cost to integrate Wrenfield into Brindle's suite" }
  wren_arr:         { value: 8,     unit: "$M",        label: "Wrenfield's own subscription revenue today" }

calculations:
  # --- The prize ---
  - { id: buyers_fast, label: "Customers who buy with a fast launch", formula: "customers * attach_fast", expected: 2000, unit: "customers" }
  - { id: rev_fast, label: "Annual revenue with a fast launch", formula: "buyers_fast * arr / 1000", expected: 80, unit: "$M" }
  - { id: own_profit_fast, label: "Annual profit, own product, fast launch", formula: "rev_fast * own_margin", expected: 60, unit: "$M" }
  - { id: partner_annual, label: "Annual profit, partner product", formula: "rev_fast * partner_margin", expected: 24, unit: "$M" }
  # --- Five-year comparison, first pass ---
  - { id: build_years, label: "Years Brindle sells a built product within the horizon", formula: "horizon - build_launch", expected: 3, unit: "years" }
  - { id: build_naive, label: "Build: five-year profit if attach is unaffected by timing", formula: "own_profit_fast * build_years - build_cost", expected: 150, unit: "$M" }
  - { id: buy_profit, label: "Buy: five-year profit", formula: "own_profit_fast * horizon - buy_price - integration", expected: 140, unit: "$M" }
  - { id: partner_profit, label: "Partner: five-year profit", formula: "partner_annual * horizon", expected: 120, unit: "$M" }
  # --- The twist: time to market ---
  - { id: rev_slow, label: "Annual revenue with a launch in 24 months", formula: "customers * attach_slow * arr / 1000", expected: 40, unit: "$M" }
  - { id: own_profit_slow, label: "Annual profit, own product, launch in 24 months", formula: "rev_slow * own_margin", expected: 30, unit: "$M" }
  - { id: build_profit, label: "Build: five-year profit with the late-launch attach rate", formula: "own_profit_slow * build_years - build_cost", expected: 60, unit: "$M" }
  - { id: delay_cost, label: "Profit lost by arriving late", formula: "build_naive - build_profit", expected: 90, unit: "$M" }
  - { id: buy_vs_partner, label: "Buy versus partner, five-year profit", formula: "buy_profit - partner_profit", expected: 20, unit: "$M" }
  - { id: buy_vs_build, label: "Buy versus build, five-year profit", formula: "buy_profit - build_profit", expected: 80, unit: "$M" }
  - { id: max_buy_price, label: "Highest price at which buying still beats partnering", formula: "own_profit_fast * horizon - integration - partner_profit", expected: 170, unit: "$M" }
  - { id: payback, label: "Years for the acquisition to pay back", formula: "(buy_price + integration) / own_profit_fast", expected: 2.67, unit: "years", decimals: 1 }

answer:
  calc: buy_profit
  headline: "Buy Wrenfield: it earns about {{buy_profit}} over five years, against {{partner_profit}} for partnering and only {{build_profit}} for building, because a two-year build halves the share of customers who buy."

exhibits:
  - id: exhibit-1
    title: "Three ways to add AI threat detection to Brindle's suite"
    kind: table
    ask: "Here are the three options. Over five years, which one makes Brindle the most profit?"
    columns: ["", "Build", "Buy Wrenfield AI", "Partner with Ostra Defense"]
    rows:
      - ["What it means", "In-house team builds the product", "Acquire a startup with a working product", "Resell Ostra's product under a revenue share"]
      - ["Upfront cost", "{{build_cost}} of engineering", "{{buy_price}} + {{integration}} integration", "None"]
      - ["Time to launch", "{{build_launch}}", "About 6 months", "About 3 months"]
      - ["Profit margin to Brindle", "{{own_margin}}", "{{own_margin}}", "{{partner_margin}}"]
      - ["Who owns the product", "Brindle", "Brindle", "Ostra; contract renews every 2 years"]
      - ["Other", "", "Wrenfield has {{wren_arr}} of subscription revenue from its own customers", ""]
    note: "Illustrative data created for this practice case. Brindle, Wrenfield AI and Ostra Defense are fictional. Price {{arr}} per customer per year; the sales team expects {{attach_fast}} of the installed base to buy."
    insight: |
      If {{attach_fast}} of customers buy whatever the timing, building looks
      best: {{build_naive}} over five years, against {{buy_profit}} for buying
      and {{partner_profit}} for partnering. But that assumes customers wait two years.
  - id: exhibit-2
    title: "Share of Brindle customers who would buy its threat detection, by launch date"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Brindle surveyed its customers. What does this do to the comparison?"
    data:
      - { label: "Launch within 6 months", value: attach_fast }
      - { label: "Launch in 12 months", value: attach_mid }
      - { label: "Launch in 24 months", value: attach_slow }
    note: "Illustrative data from a fictional customer survey created for this practice case. Customers who buy a rival's tool in the meantime rarely switch for several years."
    insight: |
      Customers are choosing a threat-detection tool now. Half of the
      opportunity is gone if Brindle arrives in two years: a late build earns
      only {{build_profit}}.
---

## Prompt

Our client, Brindle Systems, sells IT-management and endpoint-security software to about **{{customers}}**, mostly mid-size businesses. Customers are asking for **AI-based threat detection**: software that watches network and user activity and flags attacks as they happen.

Brindle's leadership sees a chance to sell it to its existing customers, but disagrees on how to get it. The CTO wants to build it, the head of strategy wants to buy a startup called **Wrenfield AI**, and the head of sales wants to resell a product from **Ostra Defense**. The CEO asks us: **should Brindle build, buy or partner?**

## Clarifying information

- Q: What is the objective?
  A: Maximize profit from selling threat detection to the installed base over the next **{{horizon}}**. Selling to new customers is upside, not the base case.
- Q: What would customers pay?
  A: About **{{arr}}** per customer per year, the same whichever option Brindle picks.
- Q: Should we discount future profits?
  A: No. Compare simple five-year totals.
- Q: When does each option start earning?
  A: For simplicity, treat buying (launch in about 6 months) and partnering (about 3 months) as selling for the full five years. A build sells only after it launches.
- Q: Is the Wrenfield price negotiable?
  A: Wrenfield is asking **{{buy_price}}**. Its investors have hinted they would take a little more or less depending on terms.
- Q: Are there other startups Brindle could buy?
  A: Two others, but both are further behind than Wrenfield.

## Structure

> **Ask:** How would you compare the three options?

Compare the options on the same yardstick, **five-year profit from the installed base**, then on strategic factors:

- **Revenue:** customers × share who buy × price
  - The share who buy depends on **time to market**: how many customers pick a rival first?
- **Profit to Brindle:** margin on its own product versus margin after a partner's revenue share
- **Cost:** engineering cost (build), purchase price and integration (buy), none upfront (partner)
- **Strategic factors**
  - Ownership and control of the product roadmap
  - Execution risk: can Brindle hire AI security engineers? Will Wrenfield's team stay?
  - Partner risk: contract renewals, partner selling to Brindle's rivals

A strong hypothesis: *"In security software, customers pick a tool once and stick with it, so speed may matter more than cost. I want to see how the share of customers who buy changes with launch timing."*

## Math walkthrough

> **Ask:** Using Exhibit 1, what is the five-year profit of each option? Then use Exhibit 2: does the answer change?

**1. The prize.**
Customers who buy = 10,000 × 20% = **{{buyers_fast}}**, paying $40K each = **{{rev_fast}}** a year.
Brindle's own product: $80M × 75% = **{{own_profit_fast}}** a year. Partner: $80M × 30% = **{{partner_annual}}** a year.

**2. First pass (Exhibit 1).**

| Option | Calculation | Five-year profit |
|---|---|---|
| Build | $60M × 3 years − $30M | {{build_naive}} |
| Buy | $60M × 5 years − $150M − $10M | {{buy_profit}} |
| Partner | $24M × 5 years | {{partner_profit}} |

On these numbers, building wins: it is cheapest and Brindle keeps the full margin.

**3. Add time to market (Exhibit 2).**
A build launches in {{build_launch}}, when only {{attach_slow}} of customers would still buy.
Revenue = 10,000 × 10% × $40K = {{rev_slow}} a year, and profit = $40M × 75% = **{{own_profit_slow}}** a year.
Build = $30M × 3 years − $30M = **{{build_profit}}**. Arriving late costs **{{delay_cost}}**.

| Option | Five-year profit |
|---|---|
| **Buy** | **{{buy_profit}}** |
| Partner | {{partner_profit}} |
| Build | {{build_profit}} |

Buying now beats partnering by **{{buy_vs_partner}}** and building by **{{buy_vs_build}}**.

**4. How much could Brindle pay?**
Buying beats partnering as long as $60M × 5 − $10M − price exceeds $120M, so the most Brindle should pay is **{{max_buy_price}}**. At {{buy_price}}, the deal pays back in about **{{payback}}**.

## Synthesis

> **Ask:** What do you recommend to the CEO?

**Brindle should buy Wrenfield AI. It earns about {{buy_profit}} over five years, against {{partner_profit}} for partnering and {{build_profit}} for building, and Brindle should pay no more than {{max_buy_price}}.**

1. **Time to market decides it:** customers are picking a tool now, and a two-year build halves the share who buy. That costs the build option {{delay_cost}}.
2. **Buying beats partnering on profit and control:** Brindle keeps a {{own_margin}} margin instead of {{partner_margin}}, owns the roadmap, and the deal pays back in about {{payback}}.
3. **There is upside not counted:** Wrenfield's {{wren_arr}} of revenue from its own customers, sales to new customers, and the value of owning the product after year five.

**Risks and next steps:** the lead over partnering is only {{buy_vs_partner}}, so the case depends on keeping Wrenfield's engineers (use retention packages and earn-outs) and integrating within six months. In diligence, test Wrenfield's detection quality on Brindle customers' data, check the survey's attach rates against a small sales pilot, and confirm the integration estimate with Brindle's engineers. If the price rises above {{max_buy_price}}, partner with Ostra now and keep building in the background.

## Common mistakes

- Comparing only upfront costs and choosing build because {{build_cost}} is much less than {{buy_price}}.
- Assuming the share of customers who buy is the same regardless of launch date.
- Counting Wrenfield's {{wren_arr}} of revenue as the main reason to buy. The value is in selling to Brindle's own base.
- Comparing revenue instead of profit, which hides that partnering gives Brindle only {{partner_margin}} of each dollar.

## What top candidates do differently

- Put all three options on one yardstick (five-year profit) before talking about strategy.
- Ask about time to market before Exhibit 2 and see that it drives the answer.
- Give a walk-away price ({{max_buy_price}}) and a fallback (partner) instead of just "buy".
- Note that the options can be combined: partner now for speed, then build or buy to own the product later.

## Creative question

If Brindle buys Wrenfield, what could go wrong in the first year, and how would you prevent it?

## Model answer

Organize around **people, product and customers**:

- **People:** Wrenfield's engineers leave after the deal. Use retention bonuses that vest over two to three years, keep the team together, and give the founders a clear role.
- **Product:** integration takes longer than six months, or the product works less well on Brindle customers' networks. Run a technical test before signing, and set integration milestones with a named owner.
- **Customers:** Wrenfield's own customers leave because they fear being neglected; Brindle's sales team doesn't know how to sell security analytics. Keep Wrenfield's customer team in place and train Brindle's sellers with Wrenfield's experts in the first deals.

A top candidate prioritizes: "People first. In a small AI company the team *is* the product, and the deal is only worth {{buy_vs_partner}} more than partnering. If the engineers leave, Brindle has paid {{buy_price}} for something it could have rented."
