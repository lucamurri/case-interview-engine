---
id: wealth-manager-flat-fee
title: "One Percent or a Flat Fee? Repricing Advice for the Mass Affluent"
client: "Larkspur Wealth Partners (fictional), a US wealth manager with human financial advisers"
summary: "A wealth manager that charges 1% of assets wants a flat annual fee for clients with $100K–$500K, to fend off robo-advisers and win younger clients. Work out what each fee schedule does to revenue and profit, and why one flat fee for the whole tier is a costly mistake."
industry: other
sub_industry: "Wealth management"
type: pricing
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  fee_pct:      { value: 0.01,   unit: "%",       label: "Fee today, share of assets per year" }
  l_n:          { value: 20000,  unit: "clients", label: "Clients with $100K–$250K today" }
  l_assets:     { value: 150000, unit: "$",       label: "Average assets, $100K–$250K band" }
  u_n:          { value: 10000,  unit: "clients", label: "Clients with $250K–$500K today" }
  u_assets:     { value: 300000, unit: "$",       label: "Average assets, $250K–$500K band" }
  l_cts:        { value: 1000,   unit: "$",       label: "Cost to serve per client per year, $100K–$250K band" }
  u_cts:        { value: 1500,   unit: "$",       label: "Cost to serve per client per year, $250K–$500K band" }
  flat_fee:     { value: 1500,   unit: "$",       label: "Option A flat fee for the whole tier, and Option B fee for the $100K–$250K band" }
  tier_u:       { value: 3000,   unit: "$",       label: "Option B fee for the $250K–$500K band" }
  sq_l:         { value: 16000,  unit: "clients", label: "Keep 1%: clients in the $100K–$250K band next year" }
  sq_u:         { value: 10000,  unit: "clients", label: "Keep 1%: clients in the $250K–$500K band next year" }
  a_l:          { value: 24000,  unit: "clients", label: "Option A: clients in the $100K–$250K band next year" }
  a_u:          { value: 11000,  unit: "clients", label: "Option A: clients in the $250K–$500K band next year" }
  b_l:          { value: 24000,  unit: "clients", label: "Option B: clients in the $100K–$250K band next year" }
  b_u:          { value: 10000,  unit: "clients", label: "Option B: clients in the $250K–$500K band next year" }
  launch_cost:  { value: 1,      unit: "$M",      label: "Running cost of a flat-fee offer per year (digital onboarding, marketing)" }
  robo_fee:     { value: 0.0025, unit: "%",       label: "Typical robo-adviser fee, share of assets per year", decimals: 2 }
  l_min:        { value: 100000, unit: "$",       label: "Smallest account in the tier" }

calculations:
  # --- Today (Exhibit 1) ---
  - { id: l_fee, label: "Fee per client today, $100K–$250K band", formula: "l_assets * fee_pct", expected: 1500, unit: "$" }
  - { id: u_fee, label: "Fee per client today, $250K–$500K band", formula: "u_assets * fee_pct", expected: 3000, unit: "$" }
  - { id: l_margin, label: "Profit per client, $100K–$250K band", formula: "l_fee - l_cts", expected: 500, unit: "$" }
  - { id: u_margin, label: "Profit per client, $250K–$500K band", formula: "u_fee - u_cts", expected: 1500, unit: "$" }
  - { id: rev_today, label: "Tier revenue today", formula: "(l_n * l_fee + u_n * u_fee) / 1e6", expected: 60, unit: "$M" }
  - { id: profit_today, label: "Tier profit today", formula: "(l_n * l_margin + u_n * u_margin) / 1e6", expected: 25, unit: "$M" }
  - { id: u_profit_share, label: "Share of tier profit from the $250K–$500K band", formula: "u_n * u_margin / 1e6 / profit_today", expected: 0.60, unit: "%" }
  - { id: robo_cost, label: "Robo-adviser fee on an average $100K–$250K account", formula: "l_assets * robo_fee", expected: 375, unit: "$" }
  # --- Keep 1% ---
  - { id: sq_lost, label: "Keep 1%: clients lost in the $100K–$250K band", formula: "l_n - sq_l", expected: 4000, unit: "" }
  - { id: rev_sq, label: "Keep 1%: tier revenue next year", formula: "(sq_l * l_fee + sq_u * u_fee) / 1e6", expected: 54, unit: "$M" }
  - { id: profit_sq, label: "Keep 1%: tier profit next year", formula: "(sq_l * l_margin + sq_u * u_margin) / 1e6", expected: 23, unit: "$M" }
  # --- Option A: one flat fee ---
  - { id: a_l_profit, label: "Option A: profit, $100K–$250K band", formula: "a_l * (flat_fee - l_cts) / 1e6", expected: 12, unit: "$M" }
  - { id: a_u_margin, label: "Option A: profit per client, $250K–$500K band", formula: "flat_fee - u_cts", expected: 0, unit: "$" }
  - { id: a_u_profit, label: "Option A: profit, $250K–$500K band", formula: "a_u * a_u_margin / 1e6", expected: 0, unit: "$M" }
  - { id: rev_a, label: "Option A: tier revenue next year", formula: "(a_l + a_u) * flat_fee / 1e6", expected: 52.5, unit: "$M" }
  - { id: profit_a, label: "Option A: tier profit next year", formula: "a_l_profit + a_u_profit - launch_cost", expected: 11, unit: "$M" }
  - { id: u_cut, label: "Option A: fee cut per client in the $250K–$500K band", formula: "u_fee - flat_fee", expected: 1500, unit: "$" }
  - { id: u_rev_lost, label: "Option A: revenue given away to existing $250K–$500K clients", formula: "u_n * u_cut / 1e6", expected: 15, unit: "$M" }
  # --- Option B: tiered flat fee ---
  - { id: b_l_profit, label: "Option B: profit, $100K–$250K band", formula: "b_l * (flat_fee - l_cts) / 1e6", expected: 12, unit: "$M" }
  - { id: b_u_profit, label: "Option B: profit, $250K–$500K band", formula: "b_u * (tier_u - u_cts) / 1e6", expected: 15, unit: "$M" }
  - { id: rev_b, label: "Option B: tier revenue next year", formula: "(b_l * flat_fee + b_u * tier_u) / 1e6", expected: 66, unit: "$M" }
  - { id: profit_b, label: "Option B: tier profit next year", formula: "b_l_profit + b_u_profit - launch_cost", expected: 26, unit: "$M" }
  - { id: b_vs_sq, label: "Option B versus keeping 1%", formula: "profit_b - profit_sq", expected: 3, unit: "$M" }
  - { id: b_vs_a, label: "Option B versus Option A", formula: "profit_b - profit_a", expected: 15, unit: "$M" }
  # --- How much can the survey be wrong? ---
  - { id: extra_l, label: "Option B: extra $100K–$250K clients versus keeping 1%", formula: "b_l - sq_l", expected: 8000, unit: "" }
  - { id: be_clients, label: "Extra clients needed to cover the running cost", formula: "launch_cost * 1e6 / l_margin", expected: 2000, unit: "" }
  - { id: be_share, label: "Break-even as a share of the extra clients the survey predicts", formula: "be_clients / extra_l", expected: 0.25, unit: "%" }
  - { id: small_rate, label: "Option B fee as a share of assets for a $100K account", formula: "flat_fee / l_min", expected: 0.015, unit: "%", decimals: 1 }

answer:
  calc: profit_b
  headline: "Choose the tiered flat fee ({{flat_fee}} for $100K–$250K and {{tier_u}} for $250K–$500K): tier profit of about {{profit_b}} next year, versus {{profit_sq}} if fees stay at 1% and only {{profit_a}} with one flat fee."

exhibits:
  - id: exhibit-1
    title: "Larkspur's mass-affluent clients today"
    kind: table
    ask: "Here is the tier today. What does each band earn Larkspur?"
    columns: ["Item", "$100K–$250K", "$250K–$500K"]
    rows:
      - ["Clients", "{{l_n}}", "{{u_n}}"]
      - ["Average assets per client", "{{l_assets}}", "{{u_assets}}"]
      - ["Fee", "{{fee_pct}} of assets", "{{fee_pct}} of assets"]
      - ["Cost to serve per client per year (adviser time, reporting, platform)", "{{l_cts}}", "{{u_cts}}"]
      - ["Average client age", "52", "58"]
    note: "Illustrative data created for this practice case. Larkspur Wealth Partners is fictional."
    insight: |
      An average client earns Larkspur {{l_margin}} a year in the lower band
      and {{u_margin}} in the upper band, so the upper band, with a third of
      the clients, produces {{u_profit_share}} of the tier's {{profit_today}} profit.
  - id: exhibit-2
    title: "Expected clients next year under each fee schedule"
    kind: table
    ask: "Marketing surveyed current clients and prospects about each option. Which fee schedule would you choose?"
    columns: ["Fee schedule", "$100K–$250K band", "$250K–$500K band"]
    rows:
      - ["Keep {{fee_pct}} of assets", "{{sq_l}}", "{{sq_u}}"]
      - ["A. One flat fee of {{flat_fee}} for the whole tier", "{{a_l}}", "{{a_u}}"]
      - ["B. Tiered flat fee: {{flat_fee}} up to $250K, {{tier_u}} from $250K to $500K", "{{b_l}}", "{{b_u}}"]
    note: "Illustrative data created for this practice case; counts combine a fictional survey of current clients with expected new clients. Treat them as the average number of clients during next year. New clients have the same average assets and cost to serve as current clients in the same band."
    insight: |
      Keeping 1% loses {{sq_lost}} lower-band clients to cheaper providers.
      Both flat-fee schedules keep them and win new ones, but Option A gives
      the upper band a fee cut of {{u_cut}} per client, worth {{u_rev_lost}} a
      year, for only a thousand extra clients.
---

## Prompt

Our client, Larkspur Wealth Partners, is a US wealth manager whose financial advisers manage investments and give financial planning advice. Like most of the industry, Larkspur charges **{{fee_pct}} of a client's assets each year**.

Larkspur's "mass affluent" clients, those with $100K to $500K, are under pressure: robo-advisers offer automated portfolios for a fraction of the price, and younger savers dislike a fee that rises every time they save more or the market goes up. Larkspur is considering a **flat annual fee** for this tier to keep clients and attract younger ones. The head of the wealth business asks us: **should we move to a flat fee, and what should the fee schedule be?**

## Clarifying information

- Q: What is the objective?
  A: Maximize the tier's profit next year while growing the number of younger clients. Larkspur will not accept a schedule that makes less profit than keeping today's fee.
- Q: What fee options are on the table?
  A: Two. **Option A:** one flat fee of **{{flat_fee}}** a year for every client with $100K–$500K. **Option B:** a tiered flat fee of {{flat_fee}} for clients with $100K–$250K and **{{tier_u}}** for clients with $250K–$500K.
- Q: What do robo-advisers charge?
  A: Around {{robo_fee}} of assets a year, or {{robo_cost}} on a $150K account, with no human adviser. Larkspur does not plan to match that price; it competes on advice.
- Q: Does a flat fee change what it costs to serve a client?
  A: No. Advisers would serve clients the same way. But launching and marketing a flat-fee offer would cost about **{{launch_cost}}** a year to run.
- Q: What happens if Larkspur keeps charging 1%?
  A: The survey in the second exhibit covers that case too. Larkspur already sees younger clients with growing balances leave for cheaper providers.
- Q: Are there other clients affected?
  A: Clients above $500K keep their current fee arrangements. Ignore them.

## Structure

> **Ask:** How would you structure the pricing decision?

Compare each fee schedule on **next year's profit from the tier**, built by band, and then test the strategic fit:

- **1. Profit by band = clients × (fee per client − cost to serve)**
  - Fee per client: 1% × average assets today; the flat fee under each option
  - Cost to serve: does not change with the fee
- **2. Client response**
  - Existing clients who stay or leave
  - New clients won
- **3. Running cost of the new offer**
- **4. Strategic fit and risks**
  - Competitive position against robo-advisers and other advisers
  - Fairness within each band: a flat fee is cheap for large accounts and expensive for small ones
  - Growth: younger clients' balances rise over time, but a flat fee does not rise with them

Hypothesis: *"A flat fee helps most with clients whose balances are growing, but one fee across a 5x range of account sizes will give away a lot of revenue on the larger accounts. I expect a tiered schedule to work better."*

## Math walkthrough

> **Ask:** Using the two exhibits, what profit does each fee schedule earn next year? Which would you choose?

**1. Today (Exhibit 1).**
Fees: $150K × 1% = **{{l_fee}}** and $300K × 1% = **{{u_fee}}** per client.
Profit per client: $1,500 − $1,000 = **{{l_margin}}** and $3,000 − $1,500 = **{{u_margin}}**.
Tier revenue is {{rev_today}} and profit is **{{profit_today}}**, {{u_profit_share}} of it from the upper band.

**2. Keep 1%.**
Larkspur loses {{sq_lost}} lower-band clients: 16,000 × $500 + 10,000 × $1,500 gives a profit of **{{profit_sq}}** on revenue of {{rev_sq}}. Doing nothing is not free.

**3. Option A: one flat fee.**
Lower band: 24,000 × ($1,500 − $1,000) = **{{a_l_profit}}**.
Upper band: each client now pays $1,500, exactly the cost to serve, so profit per client is {{a_u_margin}} and the band earns nothing.
Profit = $12M + $0 − $1M = **{{profit_a}}** on revenue of {{rev_a}}. Existing upper-band clients get a fee cut of {{u_cut}} each, giving away **{{u_rev_lost}}** a year.

**4. Option B: tiered flat fee.**
Lower band: **{{b_l_profit}}**, the same as Option A. Upper band: 10,000 × ($3,000 − $1,500) = **{{b_u_profit}}**.
Profit = $12M + $15M − $1M = **{{profit_b}}** on revenue of {{rev_b}}.
At the band averages, Option B charges exactly what 1% charges today ({{l_fee}} on $150K and {{u_fee}} on $300K). It repackages today's price rather than cutting it, so the whole gain over keeping 1% comes from clients kept and won.

| Fee schedule | Revenue | Profit next year | Versus keeping 1% |
|---|---|---|---|
| Keep 1% | {{rev_sq}} | {{profit_sq}} | Not applicable |
| A. One flat fee | {{rev_a}} | {{profit_a}} | Much worse |
| B. Tiered flat fee | {{rev_b}} | **{{profit_b}}** | +{{b_vs_sq}} |

**5. How robust is Option B?**
The gain over keeping 1% rests on the survey: {{extra_l}} more lower-band clients. Covering the {{launch_cost}} running cost needs only $1M ÷ $500 = **{{be_clients}}** extra clients, {{be_share}} of what the survey predicts, so the decision survives a fairly optimistic survey.

## Synthesis

> **Ask:** What do you recommend?

**Move to a tiered flat fee: {{flat_fee}} a year for clients with $100K–$250K and {{tier_u}} for $250K–$500K. It should earn about {{profit_b}} from the tier next year, {{b_vs_sq}} more than keeping 1% and {{b_vs_a}} more than one flat fee.**

1. **Keeping 1% is not safe:** the survey expects {{sq_lost}} lower-band clients to leave, cutting profit to {{profit_sq}}.
2. **One flat fee gives away the most profitable clients' revenue:** the upper band would pay only its cost to serve, losing {{u_rev_lost}} a year on clients who were not planning to leave.
3. **The tiered fee keeps the upper band whole and wins younger clients:** it needs only {{be_clients}} extra lower-band clients to cover its running cost, against the {{extra_l}} the survey predicts.

**Risks and next steps:** the gain over keeping 1% is modest ({{b_vs_sq}}), and a flat fee gives up something a percentage fee earns automatically: under 1%, revenue rises whenever markets rise or clients save more, while a flat fee rises only when a client moves up a band. Build in an annual fee review, and treat Option B as a growth play whose payoff comes as younger clients move into the upper band and, above $500K, back onto asset-based fees. Within each band the fee is uneven: a $100K client would pay {{small_rate}} of assets, more than today, so consider a third band or a minimum account size, and smooth the jump at $250K so clients near the line are not penalized. Surveys tend to overstate switching, so pilot the new schedule in two regions before a national launch, and track new-client age and asset growth as well as profit.

## Common mistakes

- Comparing the options only with today's profit of {{profit_today}}, instead of with what happens if Larkspur does nothing.
- Picking the option with the most clients (Option A) without checking that upper-band clients would then earn nothing above their cost to serve.
- Treating revenue as profit: Option B's {{rev_b}} of revenue matters less than its profit after the cost to serve and the {{launch_cost}} running cost.
- Forgetting the running cost of the new offer.
- Assuming a flat fee grows with the client: unlike a 1% fee, it does not rise with markets or savings.
- Ignoring that a single flat fee across a band raises the price for the smallest accounts.

## What top candidates do differently

- Start from profit per client by band, which shows at once where the money is.
- Ask what happens under the status quo, and treat it as a real option with its own client losses.
- Turn the survey into a break-even ({{be_clients}} extra clients) so the client can judge how much the decision depends on it.
- Raise the fairness and boundary issues of flat fees and propose ways to smooth them.

## Creative question

Besides pricing, how could Larkspur make its advice more attractive than a robo-adviser to clients in their 30s?

## Model answer

Organize the ideas around **what younger clients need** that software alone does not give them:

- **Life events:** advice on buying a first home, student loans, equity compensation from tech employers, having children, and saving for college.
- **Access:** video meetings and messaging with a named adviser instead of office visits; a good mobile app that shows the plan, not just the portfolio.
- **Simple bundles:** a flat fee that includes tax preparation or a yearly financial plan, so the fee buys something visible.
- **A path to grow:** a free or low-cost starter plan for clients under $100K that moves them into the tier as their savings grow.

A top candidate prioritizes: "Equity compensation advice is the strongest wedge. Many younger professionals hold company stock or options they don't understand, the stakes are large, and a robo-adviser cannot help with it."
