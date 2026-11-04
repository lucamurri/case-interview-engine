---
id: ai-coding-assistant-seats
title: "Copilot Seats: AI Coding Assistants for US Developers"
client: "Lumen Code (fictional), a venture-backed AI coding-assistant startup"
summary: "Size the annual US revenue pool for paid AI coding-assistant seats, then decide where a challenger should focus."
industry: tech-ai
sub_industry: "Developer tools / SaaS"
type: market-sizing
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — chosen to be realistic and easy to work with,
# not taken from any market report.
inputs:
  us_devs_m:          { value: 4.5,  unit: "million", label: "Professional software developers in the US" }
  employed_share:     { value: 0.85, unit: "%",       label: "Share employed by a company (vs. freelance/indie)" }
  large_mix:          { value: 0.50, unit: "%",       label: "Employed developers at large companies (1,000+ staff)" }
  mid_mix:            { value: 0.30, unit: "%",       label: "Employed developers at mid-size companies (100–999)" }
  small_mix:          { value: 0.20, unit: "%",       label: "Employed developers at small companies (<100)" }
  large_adopt:        { value: 0.56, unit: "%",       label: "Paid-seat adoption at large companies" }
  mid_adopt:          { value: 0.30, unit: "%",       label: "Paid-seat adoption at mid-size companies" }
  small_adopt:        { value: 0.15, unit: "%",       label: "Paid-seat adoption at small companies" }
  indie_adopt:        { value: 0.25, unit: "%",       label: "Freelance/indie developers paying for their own seat" }
  business_price:     { value: 30,   unit: "$",       label: "Business seat price per month" }
  individual_price:   { value: 10,   unit: "$",       label: "Individual seat price per month" }
  target_share:       { value: 0.05, unit: "%",       label: "Lumen's 3-year market-share goal" }

calculations:
  - id: employed_devs_m
    label: "Developers employed by companies"
    formula: "us_devs_m * employed_share"
    expected: 3.825
    unit: "million"
    decimals: 1
  - id: indie_devs_m
    label: "Freelance / indie developers"
    formula: "us_devs_m - employed_devs_m"
    expected: 0.675
    unit: "million"
    decimals: 2
  - id: business_adopt
    label: "Weighted business adoption rate"
    formula: "large_mix * large_adopt + mid_mix * mid_adopt + small_mix * small_adopt"
    expected: 0.40
    unit: "%"
  - id: business_seats_m
    label: "Company-paid seats"
    formula: "employed_devs_m * business_adopt"
    expected: 1.53
    unit: "million"
  - id: indie_seats_m
    label: "Self-paid seats"
    formula: "indie_devs_m * indie_adopt"
    expected: 0.16875
    unit: "million"
  - id: business_rev
    label: "Annual revenue from company-paid seats"
    formula: "business_seats_m * business_price * 12"
    expected: 550.8
    unit: "$M"
  - id: indie_rev
    label: "Annual revenue from self-paid seats"
    formula: "indie_seats_m * individual_price * 12"
    expected: 20.25
    unit: "$M"
    decimals: 0
  - id: total_rev
    label: "Total annual US market"
    formula: "business_rev + indie_rev"
    expected: 571.05
    unit: "$M"
  - id: business_rev_share
    label: "Share of market from company-paid seats"
    formula: "business_rev / total_rev"
    expected: 0.9645
    unit: "%"
    decimals: 0
  - id: large_seat_share
    label: "Share of company-paid seats at large companies"
    formula: "large_mix * large_adopt / business_adopt"
    expected: 0.70
    unit: "%"
  - id: lumen_rev
    label: "Lumen revenue at its 3-year share goal"
    formula: "total_rev * target_share"
    expected: 28.55
    unit: "$M"

answer:
  calc: total_rev
  headline: "About {{total_rev}} a year today, and {{business_rev_share}} of it is company-paid — Lumen should sell to enterprises."

exhibits:
  - id: exhibit-1
    title: "Employed US developers by company size, and paid AI-assistant adoption"
    kind: table
    ask: "Here is some survey data the client collected. What does it tell you?"
    columns: ["Company size", "Share of employed developers", "Share with a company-paid AI seat"]
    rows:
      - ["Large (1,000+ staff)", "{{large_mix}}", "{{large_adopt}}"]
      - ["Mid-size (100–999)", "{{mid_mix}}", "{{mid_adopt}}"]
      - ["Small (<100)", "{{small_mix}}", "{{small_adopt}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Adoption is strongly skewed to large companies. A strong candidate
      spots that the weighted average is a round {{business_adopt}} and that large
      companies alone give {{large_seat_share}} of company-paid seats.
---

## Prompt

Our client, Lumen Code, is a young startup that sells an AI coding assistant — a tool that suggests and writes code inside a developer's editor. Lumen has a strong product but only a few thousand paying users, and it is preparing to raise its next funding round.

The CEO wants a credible estimate of **how big the US market for paid AI coding-assistant seats is today, in annual revenue**, and a view on where Lumen should focus.

## Clarifying information

- Q: Who counts as a developer?
  A: Professional software developers working in the US, about **{{us_devs_m}}**. Students and hobbyists who never pay are excluded.
- Q: What is a "seat"?
  A: One developer's paid subscription. A company can buy seats for its employees (a business seat), or a developer can pay for their own (an individual seat).
- Q: What do seats cost?
  A: Business seats average **{{business_price}} per month**; individual seats average **{{individual_price}} per month**.
- Q: Are we sizing Lumen's revenue or the whole market?
  A: The whole market (all vendors) today. We'll get to Lumen afterwards.
- Q: Does usage-based spending (for example, paying per API call) count?
  A: No — seat subscriptions only.
- Q: How many developers work for companies versus freelance?
  A: About **{{employed_share}}** are employed by a company; the rest are freelancers or independents.

## Structure

> **Ask:** How would you estimate the size of this market?

A clean approach is a **top-down funnel split by who pays**, because businesses and individuals have different prices and adoption rates:

- **Market revenue = company-paid revenue + self-paid revenue**
  - Company-paid revenue
    - Employed developers (total developers × share employed)
    - × share whose company buys them a seat (likely varies by company size)
    - × business price per month × 12
  - Self-paid revenue
    - Freelance / indie developers
    - × share who pay for their own seat
    - × individual price per month × 12

Good candidates say up front that **adoption probably differs by company size** (large firms have budgets and procurement; small firms are price-sensitive) and ask for data on it.

## Math walkthrough

> **Ask:** Using the exhibit and the prices you were given, how big is the market?

**1. Split the developers.**
Employed developers = {{us_devs_m}} × {{employed_share}} ≈ **{{employed_devs_m:3}}**, leaving **{{indie_devs_m}}** freelancers.

**2. Weighted business adoption (Exhibit 1).**
(50% × 56%) + (30% × 30%) + (20% × 15%) = 28% + 9% + 3% = **{{business_adopt}}**.

**3. Seats.**
Company-paid seats = {{employed_devs_m:3}} × {{business_adopt}} = **{{business_seats_m}}**.
Self-paid seats = {{indie_devs_m}} × {{indie_adopt}} ≈ **{{indie_seats_m}}**.

**4. Revenue.**
Company-paid = {{business_seats_m}} × $30 × 12 = 1.53m × $360 ≈ **{{business_rev}}**.
Self-paid = {{indie_seats_m:3}} × $10 × 12 ≈ **{{indie_rev}}**.

**5. Total.** {{business_rev}} + {{indie_rev}} ≈ **{{total_rev}} per year**.

**Follow-up — Lumen's goal.** If Lumen wins {{target_share}} of today's market, that is about **{{lumen_rev}}** in annual revenue.

*Mental-math tip:* round 3.825m to 3.8m early if you like — you'll land at roughly $567M, which is just as good in an interview. Say that you're rounding.

## Synthesis

> **Ask:** The CEO joins the call. What do you tell them?

**The US market for paid AI coding-assistant seats is about {{total_rev}} a year, and roughly {{business_rev_share}} of it comes from companies buying seats for their developers — so Lumen should build an enterprise sales motion rather than chase individual developers.**

- Company-paid seats are ~{{business_seats_m}} versus ~{{indie_seats_m}} self-paid, and they cost three times as much.
- Large companies alone hold {{large_seat_share}} of company-paid seats; mid-size firms (30% adoption) are the next growth pocket.
- A {{target_share}} share would be worth roughly {{lumen_rev}} a year — a useful anchor for the fundraising story.

**Risks / next steps:** prices may fall as large platforms bundle assistants for free; validate adoption rates with customer interviews; size growth, not just today's market.

## Common mistakes

- Multiplying all {{us_devs_m}} developers by one adoption rate and one price, which hides the business-versus-individual split that drives the recommendation.
- Forgetting to convert the monthly price to annual (×12) — an error of 12×.
- Using a simple average of the three adoption rates (34%) instead of the weighted average ({{business_adopt}}).
- Giving a number with no "so what" for Lumen.

## What top candidates do differently

- Segment by **who pays** before being prompted, and explain why.
- Sanity-check the answer: "about {{total_rev}} across ~1.7 million seats is roughly $28 per seat per month on average — consistent with mostly business pricing."
- Land the number in one sentence, then pivot straight to the implication for Lumen.

## Creative question

Apart from selling more seats in the US, what are three ways Lumen could grow revenue over the next three years?

## Model answer

A strong answer groups ideas rather than listing them:

- **Sell more per customer:** premium tiers (security and compliance features, private model hosting), usage-based add-ons for heavy users, AI code review and testing products.
- **Reach new customers:** international markets with large developer bases; adjacent users such as data analysts and IT operations staff who write scripts.
- **New channels:** partnerships with cloud providers or code-hosting platforms that resell Lumen inside their marketplaces.

Top candidates close by prioritising: "I'd start with enterprise premium tiers, because the exhibit shows large companies are where the money already is."
