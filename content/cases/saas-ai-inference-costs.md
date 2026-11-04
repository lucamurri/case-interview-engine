---
id: saas-ai-inference-costs
title: "Inference Bill: A SaaS Company's AI Features Eating Its Margin"
client: "Clausewright (fictional), a B2B contract-management software company"
summary: "A software company added free AI features and its gross margin fell 15 points. Work out who is driving the inference bill and how to fix the unit economics without switching the features off."
industry: tech-ai
sub_industry: "B2B SaaS / generative AI"
type: profitability
difficulty: advanced
format: candidate-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company or vendor pricing.
inputs:
  seats:          { value: 200000, unit: "seats",           label: "Paid seats (users)" }
  seat_price:     { value: 50,     unit: "$/seat/month",    label: "Average subscription price per seat" }
  non_ai_pct:     { value: 0.20,   unit: "%",               label: "Hosting and support cost (excluding AI), share of subscription revenue" }
  active_share:   { value: 0.50,   unit: "%",               label: "Share of seats using the AI assistant each month" }
  mix_light:      { value: 0.50,   unit: "%",               label: "Light users, share of AI-active seats" }
  mix_med:        { value: 0.30,   unit: "%",               label: "Medium users, share of AI-active seats" }
  mix_heavy:      { value: 0.20,   unit: "%",               label: "Heavy users, share of AI-active seats" }
  q_light:        { value: 100,    unit: "queries/month",   label: "AI queries per light user per month" }
  q_med:          { value: 500,    unit: "queries/month",   label: "AI queries per medium user per month" }
  q_heavy:        { value: 1500,   unit: "queries/month",   label: "AI queries per heavy user per month" }
  cost_query:     { value: 0.03,   unit: "$/query",         label: "Average inference cost per query today" }
  churn_before:   { value: 0.10,   unit: "%",               label: "Annual seat churn before the AI launch" }
  churn_after:    { value: 0.08,   unit: "%",               label: "Annual seat churn since the AI launch" }
  routed_cost:    { value: 0.02,   unit: "$/query",         label: "Average cost per query with model routing" }
  pro_price:      { value: 30,     unit: "$/seat/month",    label: "Price of the AI Pro add-on" }
  pro_uptake:     { value: 0.75,   unit: "%",               label: "Heavy users expected to buy AI Pro" }
  cap_queries:    { value: 500,    unit: "queries/month",   label: "Monthly query allowance in the standard plan" }
  gm_target:      { value: 0.70,   unit: "%",               label: "Board's minimum gross margin" }

calculations:
  # --- The P&L before and after AI ---
  - { id: revenue, label: "Annual subscription revenue", formula: "seats * seat_price * 12 / 1e6", expected: 120, unit: "$M" }
  - { id: non_ai_cogs, label: "Hosting and support cost", formula: "revenue * non_ai_pct", expected: 24, unit: "$M" }
  - { id: gp_pre, label: "Gross profit before AI", formula: "revenue - non_ai_cogs", expected: 96, unit: "$M" }
  - { id: gm_pre, label: "Gross margin before AI", formula: "gp_pre / revenue", expected: 0.80, unit: "%" }
  - { id: active_seats, label: "AI-active seats", formula: "seats * active_share", expected: 100000, unit: "seats" }
  - { id: avg_q, label: "Average queries per active seat per month", formula: "mix_light * q_light + mix_med * q_med + mix_heavy * q_heavy", expected: 500, unit: "queries/month" }
  - { id: ai_cost_seat, label: "Inference cost per active seat", formula: "avg_q * cost_query", expected: 15, unit: "$/seat/month" }
  - { id: inference, label: "Annual inference cost", formula: "active_seats * ai_cost_seat * 12 / 1e6", expected: 18, unit: "$M" }
  - { id: gp_now, label: "Gross profit today", formula: "gp_pre - inference", expected: 78, unit: "$M" }
  - { id: gm_now, label: "Gross margin today", formula: "gp_now / revenue", expected: 0.65, unit: "%" }
  - { id: gm_drop, label: "Fall in gross margin", formula: "gm_pre - gm_now", expected: 0.15, unit: "pts" }
  # --- Who drives the bill ---
  - { id: light_seats, label: "Light-user seats", formula: "active_seats * mix_light", expected: 50000, unit: "seats" }
  - { id: med_seats, label: "Medium-user seats", formula: "active_seats * mix_med", expected: 30000, unit: "seats" }
  - { id: heavy_seats, label: "Heavy-user seats", formula: "active_seats * mix_heavy", expected: 20000, unit: "seats" }
  - { id: cost_light, label: "Inference cost per light seat", formula: "q_light * cost_query", expected: 3, unit: "$/seat/month" }
  - { id: cost_med, label: "Inference cost per medium seat", formula: "q_med * cost_query", expected: 15, unit: "$/seat/month" }
  - { id: cost_heavy, label: "Inference cost per heavy seat", formula: "q_heavy * cost_query", expected: 45, unit: "$/seat/month" }
  - { id: inf_light, label: "Annual inference cost, light users", formula: "light_seats * cost_light * 12 / 1e6", expected: 1.8, unit: "$M", decimals: 1 }
  - { id: inf_med, label: "Annual inference cost, medium users", formula: "med_seats * cost_med * 12 / 1e6", expected: 5.4, unit: "$M", decimals: 1 }
  - { id: inf_heavy, label: "Annual inference cost, heavy users", formula: "heavy_seats * cost_heavy * 12 / 1e6", expected: 10.8, unit: "$M", decimals: 1 }
  - { id: heavy_cost_share, label: "Heavy users' share of the inference bill", formula: "inf_heavy / inference", expected: 0.60, unit: "%" }
  - { id: heavy_seat_share, label: "Heavy users as a share of all paid seats", formula: "heavy_seats / seats", expected: 0.10, unit: "%" }
  - { id: heavy_seat_margin, label: "Gross profit per heavy seat", formula: "seat_price * (1 - non_ai_pct) - cost_heavy", expected: -5, unit: "$/seat/month" }
  - { id: heavy_seat_loss, label: "Loss per heavy seat", formula: "-heavy_seat_margin", expected: 5, unit: "$/seat/month" }
  - { id: breakeven_q, label: "Monthly queries at which a seat's gross profit reaches zero", formula: "seat_price * (1 - non_ai_pct) / cost_query", expected: 1333.3, unit: "queries/month", decimals: 0 }
  # --- Does AI pay for itself through lower churn? ---
  - { id: retained_seats, label: "Seats retained each year thanks to lower churn", formula: "seats * (churn_before - churn_after)", expected: 4000, unit: "seats" }
  - { id: retained_rev, label: "Annual revenue from retained seats", formula: "retained_seats * seat_price * 12 / 1e6", expected: 2.4, unit: "$M", decimals: 1 }
  # --- Lever 1: model routing ---
  - { id: inference_routed, label: "Annual inference cost with routing", formula: "active_seats * avg_q * routed_cost * 12 / 1e6", expected: 12, unit: "$M" }
  - { id: routing_saving, label: "Saving from routing", formula: "inference - inference_routed", expected: 6, unit: "$M" }
  - { id: gm_routed_only, label: "Gross margin with routing alone", formula: "(gp_pre - inference_routed) / revenue", expected: 0.70, unit: "%" }
  # --- Lever 2: AI Pro add-on with a usage allowance ---
  - { id: pro_seats, label: "Heavy users buying AI Pro", formula: "heavy_seats * pro_uptake", expected: 15000, unit: "seats" }
  - { id: pro_rev, label: "Annual AI Pro revenue", formula: "pro_seats * pro_price * 12 / 1e6", expected: 5.4, unit: "$M", decimals: 1 }
  - { id: capped_seats, label: "Heavy users who stay on the standard plan (capped)", formula: "heavy_seats - pro_seats", expected: 5000, unit: "seats" }
  - { id: cap_saving, label: "Inference saved by capping those seats (at routed cost)", formula: "capped_seats * (q_heavy - cap_queries) * routed_cost * 12 / 1e6", expected: 1.2, unit: "$M", decimals: 1 }
  - { id: pro_seat_margin, label: "Gross profit per AI Pro seat (routed cost)", formula: "seat_price + pro_price - seat_price * non_ai_pct - q_heavy * routed_cost", expected: 40, unit: "$/seat/month" }
  # --- Combined result ---
  - { id: new_inference, label: "Annual inference cost after both levers", formula: "inference_routed - cap_saving", expected: 10.8, unit: "$M", decimals: 1 }
  - { id: new_rev, label: "Annual revenue after both levers", formula: "revenue + pro_rev", expected: 125.4, unit: "$M", decimals: 1 }
  - { id: new_gp, label: "Gross profit after both levers", formula: "new_rev - non_ai_cogs - new_inference", expected: 90.6, unit: "$M", decimals: 1 }
  - { id: new_gm, label: "Gross margin after both levers", formula: "new_gp / new_rev", expected: 0.7225, unit: "%", decimals: 0 }
  - { id: pricing_gain, label: "Gross profit gained from the AI Pro lever (new revenue plus capped usage)", formula: "pro_rev + cap_saving", expected: 6.6, unit: "$M", decimals: 1 }
  - { id: gp_recovered, label: "Gross profit recovered", formula: "new_gp - gp_now", expected: 12.6, unit: "$M", decimals: 1 }

answer:
  calc: new_gm
  headline: "Free AI costs {{inference}} a year and cut gross margin from {{gm_pre}} to {{gm_now}}; heavy users drive {{heavy_cost_share}} of it. Model routing plus an AI Pro tier lifts margin back to ~{{new_gm}}."

exhibits:
  - id: exhibit-1
    title: "Clausewright gross margin before and after the AI launch"
    kind: table
    ask: "Here is the gross-margin picture. What changed?"
    columns: ["", "Before AI (FY2024)", "Today (FY2025)"]
    rows:
      - ["Paid seats", "{{seats}}", "{{seats}}"]
      - ["Subscription revenue", "{{revenue}}", "{{revenue}}"]
      - ["Hosting and support", "{{non_ai_cogs}}", "{{non_ai_cogs}}"]
      - ["AI inference (model provider bills)", "—", "{{inference}}"]
      - ["**Gross margin**", "**{{gm_pre}}**", "**{{gm_now}}**"]
    note: "Illustrative data created for this practice case. Clausewright is fictional. AI features are included in every plan at no extra charge."
    insight: |
      Revenue did not move at all: the AI features were given away. The whole
      fall in margin is a new variable cost, so the next question is who uses it.
  - id: exhibit-2
    title: "AI queries per active seat per month, by usage tier"
    kind: bar
    unit: "queries/month"
    decimals: 0
    ask: "Product analytics split AI users into three tiers. What do you see?"
    data:
      - { label: "Light users", value: q_light }
      - { label: "Medium users", value: q_med }
      - { label: "Heavy users", value: q_heavy }
    note: "Illustrative data created for this practice case. Share of AI-active seats: light {{mix_light}}, medium {{mix_med}}, heavy {{mix_heavy}}."
    insight: |
      Usage is highly skewed. Heavy users cost {{cost_heavy}} in inference on a
      {{seat_price}} plan, so every heavy seat now loses money.
  - id: exhibit-3
    title: "Two levers proposed by the product and engineering teams"
    kind: table
    ask: "The teams have proposed two fixes. What would they do to gross margin?"
    columns: ["Lever", "How it works", "Key assumption"]
    rows:
      - ["Model routing", "Send simple tasks (summaries, clause lookup) to a smaller, cheaper model; keep the large model for drafting", "Average cost falls from {{cost_query}} to {{routed_cost}}"]
      - ["AI Pro add-on", "Standard plan includes {{cap_queries}}; unlimited use costs {{pro_price}} extra", "{{pro_uptake}} of heavy users upgrade; the rest stay within the allowance"]
    note: "Illustrative data created for this practice case."
    insight: |
      One lever lowers the cost of every query; the other makes the heaviest
      users pay for what they use. Light and medium users see no price change from either.
---

## Prompt

Our client, Clausewright, sells contract-management software to legal and procurement teams, priced per user (seat) per month. A year ago it launched an AI assistant that drafts clauses, summarizes contracts and flags risks, and included it in every plan at no extra charge.

Customers love it. But the company's gross margin, long one of its proudest numbers, has fallen sharply, and investors have noticed. The CFO has suggested limiting the AI features to the most expensive plan.

The CEO has asked us: **why has gross margin fallen, and how can Clausewright restore it without losing what customers value about the AI?**

## Clarifying information

- Q: What is the target?
  A: The board wants gross margin back to at least {{gm_target}} within a year.
- Q: How does Clausewright pay for the AI?
  A: It calls a large language model from an outside provider and pays per query (each request the assistant handles). Today the average is {{cost_query}}.
- Q: Has the AI brought in any revenue?
  A: Not directly: it is free. Churn (customers canceling seats) has improved from {{churn_before}} to {{churn_after}} a year since the launch.
- Q: Has anything else in the cost base changed?
  A: No. Hosting and support are about {{non_ai_pct}} of subscription revenue, as before.
- Q: How many people use the AI?
  A: About {{active_share}} of seats use it in a given month. Usage data by tier is available if the candidate asks.
- Q: What are competitors doing?
  A: Two competitors launched similar assistants; one charges for it as an add-on, the other includes a monthly allowance.

## Structure

> **Ask:** The candidate should break gross margin into revenue and cost per seat, then split the AI cost into users × usage × cost per query, and look at the distribution of usage, not just the average.

- **Gross margin = (Revenue − Cost of revenue) ÷ Revenue**
  - **Revenue**
    - Seats × price per seat
    - AI monetization (today none): add-on, usage fees, higher-priced plans
    - Retention effect: does the AI reduce churn?
  - **Cost of revenue**
    - Hosting and support (unchanged)
    - **AI inference = Active seats × Queries per seat × Cost per query**
      - Active seats: how many use it
      - Queries per seat: distribution by user type (light, medium, heavy)
      - Cost per query: model choice, prompt length, caching

Hypothesis: *"Revenue didn't change, so the margin fall is a new cost. With AI usage, a small group of power users usually drives most of the cost, so I'd look at the distribution before deciding whether to restrict or price the feature."*

## Math walkthrough

> **Ask:** The candidate should size the inference bill, find who drives it, test whether lower churn pays for it, and quantify the two levers against the {{gm_target}} target.

**1. Size the problem (Exhibit 1).**
Revenue = 200,000 seats × $50 × 12 = **{{revenue}}**. Hosting and support = 20% × $120M = **{{non_ai_cogs}}**, so gross margin before AI was **{{gm_pre}}**.

**2. Inference cost (Exhibit 2).**
Average queries per active seat = 50% × 100 + 30% × 500 + 20% × 1,500 = 50 + 150 + 300 = **{{avg_q}}**.
Cost per active seat = 500 × $0.03 = **{{ai_cost_seat}}**.
Active seats = 200,000 × 50% = {{active_seats}}, so annual inference = 100,000 × $15 × 12 = **{{inference}}**.
Gross margin = ($120M − $24M − $18M) ÷ $120M = **{{gm_now}}**, a fall of **{{gm_drop}}**.

**3. Who drives the bill.**

| Tier | Seats | Cost per seat | Annual cost |
|---|---|---|---|
| Light | {{light_seats}} | 100 × $0.03 = {{cost_light}} | {{inf_light}} |
| Medium | {{med_seats}} | 500 × $0.03 = {{cost_med}} | {{inf_med}} |
| Heavy | {{heavy_seats}} | 1,500 × $0.03 = {{cost_heavy}} | {{inf_heavy}} |

Heavy users are {{heavy_seat_share}} of all paid seats but **{{heavy_cost_share}}** of the inference bill. A heavy seat brings $50 − $10 hosting − $45 inference = **{{heavy_seat_margin}}** of gross profit: it loses money. Any seat above ~{{breakeven_q}} is underwater.

**4. Does lower churn pay for the AI?**
Two points less churn retains 200,000 × (10% − 8%) = {{retained_seats}}, worth 4,000 × $50 × 12 = **{{retained_rev}}** of revenue a year, and less in gross profit once those seats' own hosting and AI costs are counted. That is real value, but it covers only a small part of the {{inference}} bill. The AI has to earn its keep in other ways.

**5. Lever 1: model routing (Exhibit 3).**
Inference = 100,000 × 500 × $0.02 × 12 = **{{inference_routed}}**, a saving of **{{routing_saving}}**. On its own, routing brings gross margin to ($96M − $12M) ÷ $120M = **{{gm_routed_only}}**: exactly the board's floor, with no buffer if routing quality forces some tasks back to the large model.

**6. Lever 2: AI Pro add-on.**
- Upgrades: 20,000 × 75% = {{pro_seats}} at $30 × 12 → **{{pro_rev}}** of new revenue.
- The other {{capped_seats}} drop from 1,500 to 500 queries: 5,000 × 1,000 × $0.02 × 12 = **{{cap_saving}}** saved.
- An AI Pro seat now earns $50 + $30 − $10 − 1,500 × $0.02 = **{{pro_seat_margin}}** instead of losing money.

**7. Combined.**
Revenue = $120M + $5.4M = {{new_rev}}. Inference = $12M − $1.2M = {{new_inference}}.
Gross profit = $125.4M − $24M − $10.8M = **{{new_gp}}**, so gross margin ≈ **{{new_gm}}**, above the {{gm_target}} target. That recovers **{{gp_recovered}}** of gross profit.

## Synthesis

> **Ask:** The candidate should give the CEO a clear recommendation.

**Clausewright's gross margin fell from {{gm_pre}} to {{gm_now}} because it gave away an AI feature that costs {{inference}} a year, {{heavy_cost_share}} of it driven by a small group of heavy users. Rather than restricting the AI, it should route simple tasks to cheaper models and launch an AI Pro add-on for heavy users, which lifts gross margin to about {{new_gm}}.**

1. **The cost is concentrated:** heavy users are {{heavy_seat_share}} of seats but {{heavy_cost_share}} of the bill, and each one loses {{heavy_seat_loss}} on today's pricing.
2. **Engineering reaches the floor:** model routing saves {{routing_saving}} with no price change for customers, which on its own just reaches {{gm_routed_only}}, with no buffer.
3. **Pricing adds the buffer:** an AI Pro add-on brings in {{pro_rev}} from the customers who value the AI most and turns them into the most profitable seats ({{pro_seat_margin}} each); with the {{cap_saving}} saved on heavy users who stay within the allowance, it is worth {{pricing_gain}}.

**Why not the CFO's idea?** Restricting AI to the top plan would protect margin but give up the churn benefit ({{retained_rev}} of revenue a year and growing) and hand an argument to competitors who include it.

**Risks and next steps:** check routing quality on real contracts before rollout (a wrong clause is costly for a legal product); check how many medium users go above the {{cap_queries}} allowance, since that is their average, and raise it if too many would hit it; build a usage dashboard per customer; model-provider prices are falling, so renegotiate volume pricing and re-check the allowance every six months.

## Common mistakes

- Working only with the average usage ({{avg_q}}) and missing that heavy users drive {{heavy_cost_share}} of the cost.
- Recommending switching the AI off, without weighing churn, competition and customer value.
- Treating inference as a fixed cost. It scales with every query, which is very different from traditional software where serving one more user costs almost nothing.
- Raising the price for everyone, which charges light users for a cost they don't create.

## What top candidates do differently

- Write the cost driver as active seats × queries per seat × cost per query in the structure, so each lever maps to one term.
- Compute the break-even usage per seat (~{{breakeven_q}}), which shows exactly where the pricing model breaks.
- Combine an engineering lever (cost per query) with a pricing lever (who pays), and check the combined result against the board's target.
- Note that a legal product cannot trade accuracy for cost lightly, and propose testing routing before rollout.

## Creative question

Beyond routing and pricing, how else could Clausewright lower its inference cost per query over the next two years?

## Model answer

Group ideas into **use fewer tokens, pay less per token, and own more of the stack**:

- **Fewer tokens:** shorter prompts and smarter retrieval (send only the relevant clauses, not the whole contract); cache answers to common questions, such as standard clause explanations.
- **Less per token:** negotiate committed-volume pricing with the provider; run batch jobs (overnight contract reviews) at cheaper off-peak rates; multi-source across providers to keep pricing competitive.
- **Own more:** fine-tune a smaller open-weight model on Clausewright's own contract data for frequent tasks; it can be cheaper and more accurate on narrow legal work.

A top candidate prioritizes: "Smarter retrieval is the quickest win, since most contract queries only need a few pages; fine-tuning a smaller model is the bigger long-term lever, and Clausewright's contract data is an asset competitors can't copy."
