---
id: refill-detergent-sizing
title: "Pour It Again: Sizing the US Refill and Concentrate Detergent Market"
client: "Brightloop Home Care (fictional), a laundry and cleaning brand weighing a refill-first product line"
summary: "How much do US households spend each year on refillable and concentrated laundry detergent? Build the market from households, loads and price, then sanity-check it."
industry: consumer-retail
sub_industry: "Household products"
type: market-sizing
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  households:    { value: 131,  unit: "million", label: "US households" }
  user_share:    { value: 0.14, unit: "%",       label: "Share of households that regularly buy refill or concentrate products" }
  loads_week:    { value: 5,    unit: "loads",   label: "Laundry loads per household per week" }
  weeks:         { value: 52,   unit: "weeks",   label: "Weeks per year" }
  refill_share:  { value: 0.70, unit: "%",       label: "Share of a user household's loads washed with a refill or concentrate product" }
  conc_mix:      { value: 0.40, unit: "%",       label: "Share of refill-or-concentrate loads that use a concentrate" }
  p_liquid:      { value: 0.22, unit: "$/load",  decimals: 2, label: "Price per load, standard liquid" }
  p_conc:        { value: 0.27, unit: "$/load",  decimals: 2, label: "Price per load, concentrate" }
  p_refill:      { value: 0.32, unit: "$/load",  decimals: 2, label: "Price per load, refill pouch or bulk refill" }
  p_pod:         { value: 0.38, unit: "$/load",  decimals: 2, label: "Price per load, single-dose pod (not in scope)" }
  total_market:  { value: 8000, unit: "$M",      label: "Total US spend on laundry detergent, all formats" }

calculations:
  - { id: user_hh, label: "Households that regularly use refill or concentrate", formula: "households * user_share", expected: 18.34, unit: "million", decimals: 1 }
  - { id: loads_year, label: "Loads per household per year", formula: "loads_week * weeks", expected: 260, unit: "loads" }
  - { id: refill_loads_hh, label: "Refill or concentrate loads per user household per year", formula: "loads_year * refill_share", expected: 182, unit: "loads" }
  - { id: total_loads, label: "Refill and concentrate loads per year, US", formula: "user_hh * refill_loads_hh", expected: 3337.88, unit: "million loads", decimals: 0 }
  - { id: price_avg, label: "Average price per refill or concentrate load", formula: "conc_mix * p_conc + (1 - conc_mix) * p_refill", expected: 0.30, unit: "$/load", decimals: 2 }
  - { id: spend, label: "Annual US spend on refill and concentrate detergent", formula: "total_loads * price_avg", expected: 1001.364, unit: "$M", decimals: 0 }
  # --- Traps and checks ---
  - { id: naive_spend, label: "Spend if every user household washed every load with refill", formula: "user_hh * loads_year * price_avg", expected: 1430.52, unit: "$M", decimals: 0 }
  - { id: overstatement, label: "Overstatement from ignoring the 70% share", formula: "naive_spend - spend", expected: 429.156, unit: "$M", decimals: 0 }
  - { id: all_loads, label: "All US laundry loads per year", formula: "households * loads_year", expected: 34060, unit: "million loads", decimals: 0 }
  - { id: load_share, label: "Refill and concentrate share of all loads", formula: "total_loads / all_loads", expected: 0.098, unit: "%", decimals: 0 }
  - { id: market_share, label: "Refill and concentrate share of laundry detergent spend", formula: "spend / total_market", expected: 0.12517, unit: "%", decimals: 1 }
  - { id: premium, label: "Price premium of refill and concentrate over standard liquid", formula: "price_avg / p_liquid - 1", expected: 0.3636, unit: "%", decimals: 0 }

answer:
  calc: spend
  headline: "US households spend about {{spend}} a year on refill and concentrate detergent: {{user_hh}} households x {{refill_loads_hh}} per household x {{price_avg}}, or {{market_share}} of all detergent spend."

exhibits:
  - id: exhibit-1
    title: "Household laundry facts"
    kind: table
    ask: "Here are the household facts the client has gathered. How would you use them?"
    columns: ["Fact", "Value"]
    rows:
      - ["US households", "{{households}}"]
      - ["Loads per household per week", "{{loads_week}}"]
      - ["Households that regularly buy refill or concentrate", "{{user_share}}"]
      - ["Share of a user household's loads that use refill or concentrate", "{{refill_share}}"]
    note: "Illustrative data created for this practice case. Brightloop is fictional."
    insight: |
      Two separate shares are hiding here: how many households use the product
      at all, and how much of their laundry it covers. Multiplying only the first
      overstates the market.
  - id: exhibit-2
    title: "Shelf price per load by format"
    kind: bar
    unit: "$/load"
    decimals: 2
    ask: "Prices differ by format. Which price should you use?"
    data:
      - { label: "Standard liquid", value: p_liquid }
      - { label: "Concentrate", value: p_conc }
      - { label: "Refill pouch or bulk refill", value: p_refill }
      - { label: "Single-dose pod", value: p_pod }
    reference: { value: price_avg, label: "Blended refill and concentrate price" }
    note: "Illustrative data created for this practice case."
    insight: |
      Standard liquid and pods are out of scope. Weight concentrate and refill by
      how many loads each sells ({{conc_mix}} concentrate) to get {{price_avg}}.
  - id: exhibit-3
    title: "Cross-check: total laundry detergent spend"
    kind: table
    ask: "The client also has a total-market figure. How would you use it?"
    columns: ["Measure", "Value"]
    rows:
      - ["Total US spend on laundry detergent, all formats", "{{total_market}}"]
      - ["Standard liquid price per load", "{{p_liquid}}"]
      - ["Single-dose pod price per load", "{{p_pod}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Use the total as a sanity check, not an input. Refill and concentrate should
      be a minority share, well below the full market.
---

## Prompt

Our client, Brightloop Home Care, sells laundry and cleaning products. It is thinking about a refill-first line: concentrated detergent and refill pouches that cut plastic and shipping weight.

Before it commits, the head of strategy wants to know how big the opportunity is today. She asks us: **how much do US households spend each year on refillable and concentrated laundry detergent?**

## Clarifying information

- Q: What counts as "refillable or concentrated"?
  A: Concentrated liquids and powders, and refill pouches or bulk refills that go into a reusable bottle. Standard liquid and single-dose pods are out of scope.
- Q: Are we sizing retail sales or Brightloop's own sales?
  A: The whole US market, at the price households pay at the shelf or online. Brightloop's share comes later.
- Q: Households only, or also businesses and laundromats?
  A: Households only.
- Q: Do I have data?
  A: Yes, Exhibit 1 has household facts; the candidate should say what else they would want. Ask for each exhibit as you need it.

## Structure

> **Ask:** How would you size this market?

Build **bottom-up from households**, because laundry is a household habit:

- **Spend = loads washed with refill or concentrate × price per load**
  - **Loads**
    - US households
    - Share of households that use refill or concentrate regularly (adoption)
    - Loads per household per year (loads per week × 52)
    - Share of those households' loads that use the product (they may also use standard liquid or pods)
  - **Price per load**
    - Concentrate versus refill, weighted by loads sold
- **Sanity check:** compare with total detergent spend and with loads per person

A good candidate also names segments that would split adoption (age, household size, urban versus suburban) and says they will use one average to keep it simple.

## Math walkthrough

> **Ask:** Estimate the annual spend, then tell me whether it looks reasonable.

**1. Households that use the product.**
{{households}} households × {{user_share}} = **{{user_hh}}** households.

**2. Loads per user household.**
{{loads_week}} a week × 52 weeks = {{loads_year}} a year. Only {{refill_share}} of them use refill or concentrate: {{loads_year}} × {{refill_share}} = **{{refill_loads_hh}}** a year.

**3. Total loads.**
{{user_hh}} households × {{refill_loads_hh}} = **{{total_loads}}** a year.

**4. Price per load.**
Weight the two formats: 40% × $0.27 + 60% × $0.32 = **{{price_avg}}**.

**5. Spend.**
{{total_loads}} × {{price_avg}} = **{{spend}}** a year.

**6. Sanity check.**
- Against all loads: {{all_loads}} a year in the US, so refill and concentrate cover about {{load_share}} of loads, in line with {{user_share}} of households adopting.
- Against the market: {{spend}} is {{market_share}} of the {{total_market}} total, a minority share, as expected for a format that costs about {{premium}} more per load than standard liquid.
- The shortcut trap: if every user household washed every load with the product, spend would be {{naive_spend}}, which overstates the market by {{overstatement}}.

## Synthesis

> **Ask:** What would you tell the head of strategy?

**US households spend about {{spend}} a year on refill and concentrate detergent, roughly {{market_share}} of all detergent spend, so the format is real but still a minority one.**

1. **Size:** {{user_hh}} households × {{refill_loads_hh}} per household × {{price_avg}}.
2. **Why the shares matter:** users still wash about 30% of loads with other products, so counting every load would overstate the market by {{overstatement}}.
3. **Headroom:** if adoption doubled from {{user_share}}, spend would roughly double, which is the upside Brightloop is betting on.

**Risks and next steps:** the answer is most sensitive to adoption and to the {{refill_share}} load share, so test both with household panel data; split the market by segment to see where adoption is growing fastest; and check whether refill buyers trade down to cheaper formats when prices rise.

## Common mistakes

- Multiplying households by loads and price without applying an adoption rate.
- Applying the adoption rate but assuming user households use the product for every load.
- Using the pod or standard liquid price for a refill product.
- Skipping the sanity check, so an answer ten times too large goes unnoticed.

## What top candidates do differently

- Lay out the formula before asking for numbers, and say which inputs they are least sure of.
- Define scope aloud: formats, households versus businesses, retail price versus manufacturer price.
- Round sensibly (131 million becomes 130 million) and state it, so the math stays fast.
- Cross-check from a second angle, such as share of total detergent spend.

## Creative question

Beyond selling refills in stores, how could Brightloop make households more likely to switch to a refill format?

## Model answer

Organize ideas by **barriers to switching**:

- **Price:** a starter kit with a reusable bottle at a low price, and a per-load price that undercuts standard liquid after the second refill.
- **Convenience:** subscription delivery that arrives before the bottle runs out, and lighter pouches that fit a mailbox.
- **Habit and trust:** proof that performance matches standard liquid, and clear instructions so the refill never spills.
- **Retail:** a dedicated refill shelf next to standard detergent, with in-store signs showing the plastic saved.

A top candidate prioritizes: "Price and convenience drive switching, so I would start with a low-cost starter kit plus subscription refills, then measure how many starter-kit buyers become repeat buyers."
