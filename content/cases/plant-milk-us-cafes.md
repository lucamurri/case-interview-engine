---
id: plant-milk-us-cafes
title: "Milk Alternatives: Plant-Based Milk Used by US Cafés"
client: "Fernmoor Oat Co. (fictional), a fast-growing US oat-milk brand sold mainly in grocery stores"
summary: "An oat-milk brand wants to know if coffee shops are worth a dedicated sales team. Size how much plant-based milk US cafés pour each year, then test the economics."
industry: consumer-retail
sub_industry: "Food & beverage / foodservice"
type: market-sizing
difficulty: beginner
format: interviewer-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real industry data.
inputs:
  cafes:            { value: 40000, unit: "cafés",        label: "Coffee shops in the US" }
  drinks_per_day:   { value: 250,   unit: "drinks/day",   label: "Drinks sold per café per day" }
  milk_drink_share: { value: 0.64,  unit: "%",            label: "Drinks that contain milk (lattes, cappuccinos, etc.)" }
  plant_share:      { value: 0.20,  unit: "%",            label: "Milk drinks made with a plant-based milk" }
  oz_per_drink:     { value: 8,     unit: "oz",           label: "Milk per drink" }
  oz_per_gallon:    { value: 128,   unit: "oz",           label: "Fluid ounces in a gallon" }
  open_days:        { value: 360,   unit: "days",         label: "Days a café is open per year" }
  price_gal:        { value: 10,    unit: "$/gallon",     label: "Wholesale price of barista plant milk" }
  oat_share:        { value: 0.60,  unit: "%",            label: "Oat share of plant milk poured in cafés" }
  almond_share:     { value: 0.25,  unit: "%",            label: "Almond share of plant milk poured in cafés" }
  soy_share:        { value: 0.10,  unit: "%",            label: "Soy share of plant milk poured in cafés" }
  other_share:      { value: 0.05,  unit: "%",            label: "Other plant milks (coconut, pea, etc.)" }
  fernmoor_share:   { value: 0.10,  unit: "%",            label: "Share of café oat milk Fernmoor could win in three years" }
  gross_margin:     { value: 0.30,  unit: "%",            label: "Fernmoor's gross margin on café sales" }
  team_cost:        { value: 4,     unit: "$M",           label: "Annual cost of a dedicated café sales team" }

calculations:
  - { id: milk_drinks, label: "Milk drinks per café per day", formula: "drinks_per_day * milk_drink_share", expected: 160, unit: "drinks/day" }
  - { id: plant_drinks, label: "Plant-milk drinks per café per day", formula: "milk_drinks * plant_share", expected: 32, unit: "drinks/day" }
  - { id: plant_oz_day, label: "Plant milk per café per day (oz)", formula: "plant_drinks * oz_per_drink", expected: 256, unit: "oz" }
  - { id: gal_per_cafe_day, label: "Plant milk per café per day (gallons)", formula: "plant_oz_day / oz_per_gallon", expected: 2, unit: "gallons" }
  - { id: cartons_per_day, label: "Half-gallon cartons per café per day (sanity check)", formula: "gal_per_cafe_day * 2", expected: 4, unit: "half-gallon cartons" }
  - { id: gal_per_cafe_year, label: "Plant milk per café per year", formula: "gal_per_cafe_day * open_days", expected: 720, unit: "gallons" }
  - { id: total_gal_m, label: "Plant milk poured by US cafés per year", formula: "gal_per_cafe_year * cafes / 1000000", expected: 28.8, unit: "million gallons" }
  - { id: market_value, label: "Wholesale value of café plant milk", formula: "total_gal_m * price_gal", expected: 288, unit: "$M" }
  - { id: oat_gal_m, label: "Oat milk poured by US cafés per year", formula: "total_gal_m * oat_share", expected: 17.28, unit: "million gallons", decimals: 1 }
  - { id: oat_value, label: "Wholesale value of café oat milk", formula: "oat_gal_m * price_gal", expected: 172.8, unit: "$M", decimals: 1 }
  - { id: fernmoor_gal_m, label: "Fernmoor café volume at target share", formula: "oat_gal_m * fernmoor_share", expected: 1.728, unit: "million gallons", decimals: 1 }
  - { id: fernmoor_rev, label: "Fernmoor café revenue at target share", formula: "oat_value * fernmoor_share", expected: 17.28, unit: "$M", decimals: 1 }
  - { id: fernmoor_gp, label: "Fernmoor gross profit from cafés", formula: "fernmoor_rev * gross_margin", expected: 5.184, unit: "$M", decimals: 1 }
  - { id: net_contrib, label: "Gross profit after the sales team's cost", formula: "fernmoor_gp - team_cost", expected: 1.184, unit: "$M", decimals: 1 }
  - { id: breakeven_share, label: "Share of café oat milk needed to cover the sales team", formula: "team_cost / (oat_value * gross_margin)", expected: 0.0772, unit: "%", decimals: 1 }

answer:
  calc: total_gal_m
  headline: "US cafés pour about {{total_gal_m}} of plant milk a year (~{{market_value}} wholesale); a café team pays off if Fernmoor wins more than {{breakeven_share}} of café oat milk."

exhibits:
  - id: exhibit-1
    title: "A typical US café day (client survey of café owners)"
    kind: table
    ask: "The client surveyed café owners. Use this to estimate how much plant milk one café goes through."
    columns: ["Measure", "Average"]
    rows:
      - ["Drinks sold per day", "{{drinks_per_day}}"]
      - ["Share of drinks with milk", "{{milk_drink_share}}"]
      - ["Share of milk drinks made with plant milk", "{{plant_share}}"]
      - ["Milk per drink", "{{oz_per_drink}}"]
      - ["Days open per year", "{{open_days}}"]
    note: "Illustrative data created for this practice case; 1 gallon = 128 oz."
    insight: |
      One café pours only {{gal_per_cafe_day}} of plant milk a day, but across
      {{cafes}} that adds up fast.
  - id: exhibit-2
    title: "Plant milk poured in US cafés, by type (share of volume)"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Here is the mix by type. What does it mean for Fernmoor?"
    data:
      - { label: "Oat", value: oat_share }
      - { label: "Almond", value: almond_share }
      - { label: "Soy", value: soy_share }
      - { label: "Other", value: other_share }
    note: "Illustrative data created for this practice case."
    insight: |
      Oat is already the café favorite at {{oat_share}} of volume, so
      Fernmoor competes inside the largest pool — but against established
      barista brands, not for a new category.
---

## Prompt

Our client, Fernmoor Oat Co., makes oat milk. It has grown quickly in grocery stores, but almost none of its volume goes to coffee shops. Baristas prefer "barista editions" — plant milks designed to foam and blend with espresso — and Fernmoor has just developed one.

Selling to cafés means hiring a dedicated sales team to visit thousands of shops. The CEO asks: **how much plant-based milk do US cafés use in a year, and is the café channel worth a dedicated sales team?**

## Clarifying information

- Q: What counts as a café?
  A: Coffee shops — chains and independents — about **{{cafes}}** in the US. Restaurants, offices and hotels are out of scope.
- Q: Which plant milks are included?
  A: All of them: oat, almond, soy and others. Fernmoor only makes oat milk.
- Q: Do we want gallons or dollars?
  A: Both — start with volume, then convert at a wholesale price of about **{{price_gal}}**.
- Q: What would the sales team cost, and what margin does Fernmoor make?
  A: About **{{team_cost}}** a year; gross margin on café sales would be about **{{gross_margin}}**.
- Q: What share could Fernmoor realistically win?
  A: The CEO thinks **{{fernmoor_share}}** of café oat milk within three years.

## Structure

> **Ask:** How would you estimate how much plant milk US cafés use?

A **supply-side, per-café build** — estimate one typical café, then multiply by the number of cafés:

- **Plant milk per café per day**
  - Drinks sold per day
  - × share of drinks with milk
  - × share of those made with plant milk
  - × ounces of milk per drink → convert to gallons
- **Per year** = per day × days open
- **US total** = per café × number of cafés
- **Value and the decision**
  - × wholesale price → market in dollars
  - × oat share → the pool Fernmoor competes in
  - × Fernmoor's share × margin vs. the sales team's cost

A strong candidate notes that consumer surveys are an alternative (how many people order plant-milk drinks), but cafés are the buyer here, so a per-café view is more useful.

## Math walkthrough

> **Ask:** Using Exhibit 1, how many gallons do US cafés pour a year? Then, using Exhibit 2, is a café sales team worth it?

**1. One café, one day.**
Milk drinks = {{drinks_per_day}} × {{milk_drink_share}} = **{{milk_drinks}}**.
Plant-milk drinks = 160 × 20% = **{{plant_drinks}}**.
Milk = 32 × 8 oz = **{{plant_oz_day}}** ÷ 128 = **{{gal_per_cafe_day}}** a day.

**2. One café, one year.**
2 gallons × 360 days = **{{gal_per_cafe_year}}**.

**3. All US cafés.**
720 gallons × 40,000 cafés = **{{total_gal_m}}** a year.
At {{price_gal}}, that is **{{market_value}}** wholesale.

**4. Fernmoor's opportunity (Exhibit 2).**
Oat milk = {{total_gal_m}} × {{oat_share}} ≈ **{{oat_gal_m}}**, worth **{{oat_value}}**.
At {{fernmoor_share}}: revenue = $172.8M × 10% ≈ **{{fernmoor_rev}}**; gross profit = $17.3M × 30% ≈ **{{fernmoor_gp}}**.
After the {{team_cost}} sales team: ≈ **{{net_contrib}}** a year.

**5. Break-even.**
The team pays for itself once Fernmoor wins $4M ÷ ($172.8M × 30%) ≈ **{{breakeven_share}}** of café oat milk.

*Mental-math tip:* 32 × 8 = {{plant_oz_day}}, which is exactly 2 × 128 — interview numbers are often chosen to cancel, so look for it.

## Synthesis

> **Ask:** What would you tell the CEO?

**US cafés pour about {{total_gal_m}} of plant milk a year, worth about {{market_value}} wholesale; at a {{fernmoor_share}} share of café oat milk, Fernmoor would earn about {{fernmoor_gp}} of gross profit, covering a {{team_cost}} sales team — so the café channel is worth building, but only just.**

- Oat is the largest pool at {{oat_share}} of café volume ({{oat_value}}).
- The team breaks even at a {{breakeven_share}} share, leaving only a thin cushion below the {{fernmoor_share}} target.
- The bigger prize may be indirect: baristas influence what customers buy in grocery stores, where Fernmoor already sells.

**Risks / next steps:** large chains buy under national contracts and may need a separate approach; café plant-milk share could keep rising (upside); price competition from established barista brands. Next, pilot the team in two or three cities to test win rates before hiring nationally, and consider selling through foodservice distributors to cut the cost of reaching small cafés.

## Common mistakes

- Forgetting to convert ounces to gallons, or dividing by the wrong number (there are 128 fluid ounces in a gallon).
- Applying the plant-milk share to all drinks instead of only milk drinks.
- Sizing only the total plant-milk market and forgetting that Fernmoor sells oat milk only.
- Giving a market size without answering the question that matters: does the sales team pay off?

## What top candidates do differently

- Build one café first and sanity-check it ("{{gal_per_cafe_day}} a day is {{cartons_per_day}} — plausible for a busy shop").
- Calculate the break-even share ({{breakeven_share}}), which turns a yes/no into a target the CEO can manage.
- Mention the halo effect on grocery sales — a strategic reason to enter beyond the café profit itself.

## Creative question

How could Fernmoor win cafés away from the established barista brands?

## Model answer

A strong answer groups ideas by what the café owner cares about:

- **Product:** a barista edition that foams and pours latte art reliably — run blind tests with baristas and publish the results.
- **Price and terms:** introductory pricing, free samples, and a reliable delivery schedule through foodservice distributors.
- **Marketing support:** co-branded menu boards and "made with Fernmoor" cups, so cafés can charge a premium for oat drinks.
- **Community:** sponsor barista competitions and training; baristas talk to each other and switch together.

Top candidates prioritize product performance: "Baristas choose what foams well under pressure; if we win the blind test, price and marketing become much easier."
