---
id: streaming-league-rights-bid
title: "Going for Goal: A Streaming Service Bidding for Soccer Rights"
client: "Arcwave (fictional), a US subscription streaming service"
summary: "A streaming service must set its maximum bid for five years of exclusive rights to a pro soccer league. The sign-up forecast looks strong, until you ask who would have joined anyway and who leaves when the season ends."
industry: other
sub_industry: "Media & sports"
type: m-and-a
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company, league or rights data.
inputs:
  existing_subs:    { value: 40,   unit: "million",   label: "Arcwave subscribers today" }
  gross_signups:    { value: 4.0,  unit: "million",   label: "New sign-ups per year the marketing team expects from the league", decimals: 1 }
  price_month:      { value: 10,   unit: "$",         label: "Subscription price per month" }
  sub_margin:       { value: 0.50, unit: "%",         label: "Contribution margin on subscription revenue (after payment fees, streaming and support costs)" }
  matches:          { value: 200,  unit: "matches",   label: "League matches streamed per year" }
  ad_per_match:     { value: 0.4,  unit: "$M",        label: "Advertising and sponsorship revenue per match", decimals: 1 }
  production:       { value: 120,  unit: "$M",        label: "Production, studio and marketing cost per year" }
  years:            { value: 5,    unit: "years",     label: "Length of the rights deal" }
  current_fee:      { value: 150,  unit: "$M",        label: "Annual fee the current rights holder (a cable network) pays" }
  league_ask:       { value: 180,  unit: "$M",        label: "Annual fee the league expects from the winning bid" }
  anyway_share:     { value: 0.25, unit: "%",         label: "Share of sign-ups who would have subscribed anyway" }
  season_months:    { value: 8,    unit: "months",    label: "Length of the league season" }
  offseason_cancel: { value: 0.50, unit: "%",         label: "Share of soccer sign-ups who cancel when the season ends" }

calculations:
  # --- The marketing team's case ---
  - { id: annual_price, label: "Subscription revenue per subscriber per year", formula: "price_month * 12", expected: 120, unit: "$" }
  - { id: naive_per_sub, label: "Contribution per subscriber per year (full year)", formula: "annual_price * sub_margin", expected: 60, unit: "$" }
  - { id: naive_sub_contrib, label: "Subscription contribution, marketing team's case", formula: "gross_signups * naive_per_sub", expected: 240, unit: "$M" }
  - { id: ad_rev, label: "Advertising and sponsorship revenue per year", formula: "matches * ad_per_match", expected: 80, unit: "$M" }
  - { id: naive_annual, label: "Maximum annual fee, marketing team's case", formula: "naive_sub_contrib + ad_rev - production", expected: 200, unit: "$M" }
  - { id: naive_total, label: "Maximum five-year bid, marketing team's case", formula: "naive_annual * years / 1000", expected: 1.0, unit: "$B", decimals: 1 }
  # --- Twist 1: who would have joined anyway? ---
  - { id: incremental, label: "Truly incremental subscribers per year", formula: "gross_signups * (1 - anyway_share)", expected: 3.0, unit: "million", decimals: 1 }
  - { id: sport_only_share, label: "Share of sign-ups who joined only for the sport", formula: "1 - anyway_share", expected: 0.75, unit: "%" }
  - { id: anyway_subs, label: "Sign-ups who would have subscribed anyway", formula: "gross_signups - incremental", expected: 1.0, unit: "million", decimals: 1 }
  - { id: incr_effect, label: "Contribution lost by removing sign-ups who would have joined anyway", formula: "(gross_signups - incremental) * naive_per_sub", expected: 60, unit: "$M" }
  # --- Twist 2: off-season churn ---
  - { id: offseason_months, label: "Off-season months", formula: "12 - season_months", expected: 4, unit: "months" }
  - { id: stay_share, label: "Share of soccer sign-ups still subscribed in the off-season", formula: "1 - offseason_cancel", expected: 0.50, unit: "%" }
  - { id: paid_months, label: "Average paid months per soccer subscriber per year", formula: "(1 - offseason_cancel) * 12 + offseason_cancel * season_months", expected: 10, unit: "months" }
  - { id: real_per_sub, label: "Contribution per soccer subscriber per year, after churn", formula: "paid_months * price_month * sub_margin", expected: 50, unit: "$" }
  - { id: churn_effect, label: "Contribution lost to off-season cancellations", formula: "incremental * (12 - paid_months) * price_month * sub_margin", expected: 30, unit: "$M" }
  # --- Corrected value ---
  - { id: real_sub_contrib, label: "Subscription contribution, corrected", formula: "incremental * real_per_sub", expected: 150, unit: "$M" }
  - { id: real_annual, label: "Maximum annual fee, corrected", formula: "real_sub_contrib + ad_rev - production", expected: 110, unit: "$M" }
  - { id: bridge_check, label: "Marketing case less both corrections (must equal the corrected fee)", formula: "naive_annual - incr_effect - churn_effect", expected: 110, unit: "$M" }
  - { id: real_total, label: "Maximum five-year bid, corrected", formula: "real_annual * years / 1000", expected: 0.55, unit: "$B", decimals: 2 }
  - { id: real_vs_naive, label: "Corrected value as a share of the marketing team's case", formula: "real_annual / naive_annual", expected: 0.55, unit: "%" }
  # --- Versus the league's expectation ---
  - { id: league_total, label: "Five-year cost at the league's expected fee", formula: "league_ask * years / 1000", expected: 0.9, unit: "$B", decimals: 1 }
  - { id: shortfall, label: "Annual loss if Arcwave pays the league's expected fee", formula: "league_ask - real_annual", expected: 70, unit: "$M" }
  - { id: shortfall_total, label: "Five-year loss at the league's expected fee", formula: "shortfall * years", expected: 350, unit: "$M" }
  - { id: breakeven_subs, label: "Incremental subscribers needed to justify the league's fee", formula: "(league_ask + production - ad_rev) / real_per_sub", expected: 4.4, unit: "million", decimals: 1 }
  - { id: breakeven_vs_plan, label: "Needed incremental subscribers versus the corrected forecast", formula: "breakeven_subs / incremental", expected: 1.467, unit: "x", decimals: 1 }
  - { id: base_lift, label: "Incremental subscribers as a share of Arcwave's base", formula: "incremental / existing_subs", expected: 0.075, unit: "%", decimals: 1 }

answer:
  calc: real_annual
  headline: "Bid no more than about {{real_annual}} a year ({{real_total}} over five years), not the marketing team's {{naive_annual}}: a quarter of sign-ups would have joined anyway and half of the rest cancel in the off-season, so the league's expected {{league_ask}} would lose money."

exhibits:
  - id: exhibit-1
    title: "Marketing team's business case for the Meridian Soccer League rights"
    kind: table
    ask: "Here is the marketing team's business case. What is the most Arcwave should pay per year?"
    columns: ["Item", "Assumption"]
    rows:
      - ["Rights", "Exclusive US streaming of all {{matches}} a year, for {{years}}"]
      - ["New sign-ups from the league", "{{gross_signups}} per year"]
      - ["Subscription price", "{{price_month}} per month"]
      - ["Contribution margin on subscriptions", "{{sub_margin}}"]
      - ["Advertising and sponsorship", "{{ad_per_match}} per match"]
      - ["Production, studio and marketing", "{{production}} per year"]
      - ["Arcwave subscribers today", "{{existing_subs}}"]
      - ["Current rights holder pays", "{{current_fee}} per year; the league expects about {{league_ask}} from the next deal"]
    note: "Illustrative data created for this practice case. Arcwave and the Meridian Soccer League are fictional."
    insight: |
      On the team's numbers, the rights are worth {{naive_annual}} a year,
      comfortably above the league's {{league_ask}}. But the business case treats every
      sign-up as new and as paying all year.
  - id: exhibit-2
    title: "Survey of people who signed up during a past sports-rights launch: would you have subscribed anyway?"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Arcwave surveyed people who signed up when it launched a basketball package two years ago. How does this change your number?"
    data:
      - { label: "Signed up only for the sport", value: sport_only_share }
      - { label: "Was planning to subscribe anyway (for films and series)", value: anyway_share }
    note: "Illustrative data from a fictional customer survey created for this practice case. Assume soccer sign-ups behave the same way."
    insight: |
      A quarter of the sign-ups would have come anyway, so the league really
      brings {{incremental}} new subscribers a year, not {{gross_signups}}.
  - id: exhibit-3
    title: "Share of sports sign-ups still subscribed, by time of year"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Here is how long sports sign-ups stayed after the basketball launch. What does it do to the value?"
    data:
      - { label: "During the season", value: 1.0 }
      - { label: "Off-season", value: stay_share }
    note: "Illustrative data created for this practice case. The season lasts {{season_months}}; the off-season lasts {{offseason_months}}. Most of those who cancel rejoin when the next season starts and are counted again in the next year's sign-ups."
    insight: |
      Half of the incremental subscribers stop paying for {{offseason_months}}
      a year, so the average soccer subscriber pays for {{paid_months}}, not 12.
---

## Prompt

Our client, Arcwave, is a US streaming service with about **{{existing_subs}}** subscribers, known mainly for films and drama series. Growth has slowed, and the leadership team believes live sports could bring in new subscribers.

The **Meridian Soccer League**, a fast-growing professional league, is auctioning **exclusive US streaming rights for the next {{years}}**. Bids are due in two weeks. Arcwave's CEO asks us: **what is the maximum Arcwave should bid?**

## Clarifying information

- Q: What is Arcwave's objective?
  A: Grow profit. Arcwave is not willing to lose money on sports to build its brand; the rights must pay for themselves within the deal.
- Q: How is the bid structured?
  A: An annual fee, the same each year, for {{years}}. Arcwave also pays its own production and marketing costs.
- Q: Should we discount future cash flows?
  A: No. The CFO compares undiscounted five-year totals for rights deals, and the fee is paid evenly over the years. Mention that discounting would lower the value further.
- Q: Will the league bring in advertising?
  A: Yes, Arcwave sells ads and sponsorship around matches, about **{{ad_per_match}}** per match.
- Q: Are subscriber numbers the same each year?
  A: Assume yes: about **{{gross_signups}} soccer-driven sign-ups each season, new or returning**. Subscribers who cancel in the off-season and come back are counted again in the next year's sign-ups.
- Q: Who else is bidding?
  A: The current rights holder, a cable network, pays **{{current_fee}}** a year. The league expects about **{{league_ask}}** a year this time.

## Structure

> **Ask:** How would you structure your analysis of the maximum bid?

The maximum bid is the profit the rights create **for Arcwave**, before the fee:

- **Maximum annual fee = Extra subscription profit + Advertising − Production costs**
  - **Extra subscription profit** = Incremental subscribers × Months they pay × Price × Margin
    - Incremental: sign-ups that would not have happened without soccer
    - Months paid: do they stay after the season ends?
  - **Advertising and sponsorship** = Matches × Revenue per match
  - **Production costs** = Studio, commentary, production crews, marketing
- **Other considerations**
  - Strategic value: less churn among existing subscribers who like sports, brand
  - What the league expects, and the next-best bidder
  - Deal terms: exclusivity, number of matches, rights to highlights

A strong hypothesis: *"Sports rights are usually overvalued when every sign-up is counted as new and loyal. I'd want to know how many subscribers soccer really adds, and for how many months they pay."*

## Math walkthrough

> **Ask:** Using Exhibit 1, what is the maximum annual fee on the marketing team's numbers? Then use Exhibits 2 and 3 to correct it. Can Arcwave pay what the league expects?

**1. Marketing team's case (Exhibit 1).**
Contribution per subscriber = $10 × 12 × 50% = **{{naive_per_sub}}** a year.
Subscriptions: 4.0M × $60 = **{{naive_sub_contrib}}**. Advertising: 200 × $0.4M = **{{ad_rev}}**.
Maximum fee = $240M + $80M − $120M = **{{naive_annual}}** a year, or {{naive_total}} over five years. That would beat the league's {{league_ask}}.

**2. Who would have joined anyway (Exhibit 2).**
Incremental subscribers = 4.0M × 75% = **{{incremental}}**. The {{anyway_subs}} who would have joined anyway are worth {{incr_effect}} a year that the league does not create.

**3. Off-season churn (Exhibit 3).**
Average months paid = 50% × 12 + 50% × 8 = **{{paid_months}}**.
Contribution per soccer subscriber = 10 × $10 × 50% = **{{real_per_sub}}** a year.
Churn costs 3.0M × 2 months × $10 × 50% = **{{churn_effect}}** a year.

**4. Corrected maximum fee.**

| Step | Annual value |
|---|---|
| Marketing team's case | {{naive_annual}} |
| Less sign-ups who would have joined anyway | −{{incr_effect}} |
| Less off-season cancellations | −{{churn_effect}} |
| **Corrected maximum fee** | **{{bridge_check}}** |

Check: 3.0M × $50 = {{real_sub_contrib}}, plus $80M of ads, less $120M of production, gives **{{real_annual}}** a year, or **{{real_total}}** over five years. That is only {{real_vs_naive}} of the marketing team's number.

**5. Against the league's expectation.**
At {{league_ask}} a year, Arcwave would lose {{shortfall}} a year, or **{{shortfall_total}}** over the deal. To break even it would need ($180M + $120M − $80M) ÷ $50 = **{{breakeven_subs}}** incremental subscribers a year, {{breakeven_vs_plan}} the corrected forecast and more than even the marketing team's gross sign-ups.

## Synthesis

> **Ask:** What should Arcwave bid?

**Arcwave should bid no more than about {{real_annual}} a year ({{real_total}} over five years). At the league's expected {{league_ask}} it would lose about {{shortfall_total}} over the deal, so unless the terms change Arcwave should be ready to walk away.**

1. **The marketing case double-counts:** a quarter of sign-ups would have joined anyway, so soccer adds {{incremental}} subscribers a year, not {{gross_signups}}.
2. **Sports fans are seasonal:** half cancel for the {{offseason_months}} of the off-season, cutting the value of each subscriber from {{naive_per_sub}} to {{real_per_sub}} a year.
3. **The gap is too big to close with subscribers alone:** matching the league's price needs {{breakeven_subs}} incremental subscribers a year, an unrealistic {{breakeven_vs_plan}} the corrected forecast.

**Risks and next steps:** the number is undiscounted, so at Arcwave's cost of capital the maximum bid would be lower still. Upside not counted: existing subscribers who stay because of soccer, which Arcwave should measure from its own data before the bid. Ways to bid higher without taking the risk: offer an annual plan at a discount that keeps fans through the off-season; propose a lower fixed fee plus a share of subscription growth; or bid for a smaller package (for example, 100 matches) at a lower price.

## Common mistakes

- Taking the marketing team's {{gross_signups}} sign-ups at face value instead of asking how many are truly incremental.
- Valuing each subscriber at a full year of revenue ({{annual_price}}) and ignoring the off-season.
- Counting subscription revenue instead of contribution: the {{sub_margin}} margin halves the value.
- Using Arcwave's {{existing_subs}} subscribers in the calculation. They are context; only the change in subscribers matters.
- Anchoring on what the current rights holder pays. A cable network earns money differently and is not a guide to Arcwave's value.

## What top candidates do differently

- Define the maximum bid as the value the rights create *for this buyer*, then build it up from incremental subscribers.
- Ask about incrementality and seasonality before seeing Exhibits 2 and 3.
- Show a bridge from the marketing team's {{naive_annual}} to the corrected {{real_annual}}, so the CEO sees exactly why the numbers differ.
- Say explicitly that the value is undiscounted and what discounting would do.
- Suggest deal structures (revenue share, smaller package, annual plans) instead of just "bid low".

## Creative question

If Arcwave wins the rights, how could it keep more soccer fans subscribed during the off-season?

## Model answer

Organize around **reasons to stay, cost of leaving and content between seasons**:

- **Reasons to stay:** off-season soccer content, such as documentaries on clubs, player transfer shows and classic matches; youth and women's leagues; recommendations that point soccer fans to Arcwave's films and series.
- **Cost of leaving:** an annual plan at a discount (for example, 10 months' price for 12); loyalty perks such as early ticket access or merchandise discounts that need continuous membership.
- **Content between seasons:** rights to an international tournament or a summer league that fills the gap.

A top candidate prioritizes: "Start with the annual plan. On average soccer fans pay for 10 months, so a 12-month plan at roughly that price keeps the seasonal half subscribed and makes them easier to reach with other content. It costs little if it is targeted at soccer sign-ups, though part of the discount goes to fans who would have stayed all year anyway."
