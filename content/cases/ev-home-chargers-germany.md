---
id: ev-home-chargers-germany
title: "Plugged In: Home EV Chargers in Germany"
client: "Kalvren Elektrotechnik (fictional), a German maker of switches, sockets and fuse boxes"
summary: "A German electrical-products maker is thinking about launching its own home EV charger. Size the yearly market for wallboxes and decide whether selling hardware alone is enough."
industry: energy
sub_industry: "E-mobility / home charging"
type: market-sizing
difficulty: beginner
format: candidate-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real registration
# or market data.
inputs:
  ev_sales:              { value: 600000, unit: "EVs",  label: "New electric cars bought in Germany per year" }
  first_ev_share:        { value: 0.80,   unit: "%",    label: "Buyers getting their household's first EV" }
  private_parking_share: { value: 0.50,   unit: "%",    label: "First-EV households with a private parking space (garage or driveway)" }
  install_share:         { value: 0.75,   unit: "%",    label: "Of those, households that install a wallbox" }
  hw_price:              { value: 800,    unit: "€",    label: "Average wallbox hardware price" }
  install_price:         { value: 1200,   unit: "€",    label: "Average installation cost (electrician, cabling, permits)" }
  target_share:          { value: 0.10,   unit: "%",    label: "Market share Kalvren believes it can reach in three years" }
  revenue_bar:           { value: 15,     unit: "€M",   label: "Board's minimum annual revenue for a new product line" }

calculations:
  - { id: first_ev_buyers, label: "Households buying their first EV", formula: "ev_sales * first_ev_share", expected: 480000, unit: "households" }
  - { id: parking_households, label: "First-EV households with private parking", formula: "first_ev_buyers * private_parking_share", expected: 240000, unit: "households" }
  - { id: wallbox_units, label: "Wallboxes installed per year", formula: "parking_households * install_share", expected: 180000, unit: "wallboxes" }
  - { id: hw_market, label: "Annual wallbox hardware market", formula: "wallbox_units * hw_price / 1000000", expected: 144, unit: "€M" }
  - { id: install_market, label: "Annual installation market", formula: "wallbox_units * install_price / 1000000", expected: 216, unit: "€M" }
  - { id: installed_value, label: "Total spend on installed wallboxes", formula: "hw_market + install_market", expected: 360, unit: "€M" }
  - { id: hw_value_share, label: "Hardware share of total spend", formula: "hw_market / installed_value", expected: 0.40, unit: "%" }
  - { id: install_total_price, label: "Price of a fitted wallbox (hardware + installation)", formula: "hw_price + install_price", expected: 2000, unit: "€" }
  - { id: kalvren_units, label: "Kalvren wallboxes per year at target share", formula: "wallbox_units * target_share", expected: 18000, unit: "wallboxes" }
  - { id: kalvren_hw_rev, label: "Kalvren revenue, hardware only", formula: "hw_market * target_share", expected: 14.4, unit: "€M", decimals: 1 }
  - { id: hw_shortfall, label: "Shortfall vs. the board's revenue bar, hardware only", formula: "revenue_bar - kalvren_hw_rev", expected: 0.6, unit: "€M", decimals: 1 }
  - { id: kalvren_bundle_rev, label: "Kalvren revenue, hardware + installation package", formula: "installed_value * target_share", expected: 36, unit: "€M" }
  - { id: naive_hw_market, label: "Hardware market if every EV buyer got a wallbox (the wrong way)", formula: "ev_sales * hw_price / 1000000", expected: 480, unit: "€M" }
  - { id: naive_ratio, label: "Naive market vs. correct hardware market", formula: "naive_hw_market / hw_market", expected: 3.333, unit: "x", decimals: 1 }

answer:
  calc: hw_market
  headline: "About {{wallbox_units}} a year, worth {{hw_market}} in hardware — too small on its own for Kalvren's bar, so it should sell a fitted package."

exhibits:
  - id: exhibit-1
    title: "New electric cars bought in Germany per year"
    kind: bar
    unit: "EVs"
    decimals: 0
    ask: "Here is how EV sales have developed. What would you take from it?"
    data:
      - { label: "2022", value: 450000 }
      - { label: "2023", value: 500000 }
      - { label: "2024", value: 550000 }
      - { label: "2025", value: ev_sales }
    note: "Illustrative data created for this practice case; not official registration statistics."
    insight: |
      Sales are growing steadily and reached {{ev_sales}} last year. Wallbox
      demand is driven by this flow of new buyers, not by the total stock of
      EVs on the road — most existing owners already have a charging solution.
  - id: exhibit-2
    title: "Survey of recent German EV buyers"
    kind: table
    ask: "The client surveyed recent EV buyers. How many wallboxes does this imply per year?"
    columns: ["Question", "Answer"]
    rows:
      - ["Is this your household's first EV?", "Yes: {{first_ev_share}}"]
      - ["(First-EV households) Do you have a private parking space?", "Yes: {{private_parking_share}}"]
      - ["(With parking) Did you install a wallbox?", "Yes: {{install_share}}"]
      - ["Average price paid for the wallbox itself", "{{hw_price}}"]
      - ["Average price paid for installation", "{{install_price}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      The filters compound: only {{wallbox_units}}
      a year from {{ev_sales}} sold. Installation costs more than the box itself,
      so most of the customer's spend goes to the electrician.
---

## Prompt

Our client, Kalvren Elektrotechnik, is a well-known German maker of electrical installation products — switches, sockets, fuse boxes. It sells through electrical wholesalers to the electricians who fit its products in homes.

Electric cars are taking off in Germany, and many owners install a **wallbox** — a wall-mounted charger in their garage or driveway that charges much faster than a normal socket. Kalvren is thinking about launching its own wallbox. The CEO asks: **how big is the German market for home wallboxes each year, and is it worth entering?**

## Clarifying information

- Q: What counts as a home charger?
  A: A wallbox installed at a private home. Public chargers and chargers at workplaces are out of scope.
- Q: How many electric cars are sold each year?
  A: About **{{ev_sales}}** were sold last year; the trend is in an exhibit.
- Q: Do buyers of a second EV, or existing owners, need a new wallbox?
  A: Rarely — a household usually keeps one wallbox for its second EV, and replacement demand is small. Focus on households buying their first EV.
- Q: What does Kalvren need from a new product line?
  A: The board wants at least **{{revenue_bar}}** a year of revenue within three years. Kalvren thinks a realistic share is **{{target_share}}**.
- Q: Would Kalvren sell the hardware only, or install it too?
  A: Today it sells hardware only, through wholesalers. It has close relationships with thousands of electricians, though.

## Structure

> **Ask:** Lay out how you would size the market. Drive toward a number of wallboxes per year, then euros.

A **top-down funnel on the flow of new EV buyers**, because a household buys a wallbox when it gets its first EV:

- **Wallboxes per year**
  - New EVs sold per year
  - × share that are the household's first EV
  - × share with a private parking space (apartment dwellers mostly can't install one)
  - × share of those who actually install a wallbox
- **Market value**
  - Hardware: wallboxes × hardware price (the part Kalvren would make today)
  - Installation: wallboxes × installation price (what electricians earn)
- **Is it worth it for Kalvren?**
  - Revenue at a realistic share vs. the board's bar
  - Hardware only vs. a hardware-plus-installation package

Good candidates explain why they use **sales (the flow) and not EVs on the road (the stock)**: a wallbox is a one-time purchase.

## Math walkthrough

> **Ask:** How many wallboxes are installed each year, and what are they worth? Does Kalvren clear the board's bar?

**1. Wallboxes per year (Exhibit 2).**
- First-EV households = {{ev_sales}} × {{first_ev_share}} = **{{first_ev_buyers}}**
- With private parking = 480,000 × 50% = **{{parking_households}}**
- Install a wallbox = 240,000 × 75% = **{{wallbox_units}}**

**2. Market value.**
- Hardware = 180,000 × €800 = **{{hw_market}}**
- Installation = 180,000 × €1,200 = **{{install_market}}**
- Total spend = {{hw_market}} + {{install_market}} = **{{installed_value}}** a year, i.e. about {{install_total_price}} per fitted wallbox. Hardware is only {{hw_value_share}} of it.

**3. Kalvren's opportunity.**
- At {{target_share}}: {{kalvren_units}} a year.
- Hardware only: {{hw_market}} × 10% = **{{kalvren_hw_rev}}** — short of the {{revenue_bar}} bar by {{hw_shortfall}}. And that is at the price households pay: selling through wholesalers and electricians, Kalvren would book less than €800 a box after their markups, so the real gap is wider.
- Hardware + installation package: {{installed_value}} × 10% = **{{kalvren_bundle_rev}}** — comfortably above the bar.

## Synthesis

> **Ask:** Wrap up for the CEO. What is your recommendation?

**Germany installs about {{wallbox_units}} a year in homes, worth {{hw_market}} in hardware and {{installed_value}} including installation; hardware alone would give Kalvren only {{kalvren_hw_rev}} at a {{target_share}} share, so it should enter with a fitted "box plus installation" package sold through its electrician network.**

- Demand comes from first-time EV households with their own parking — only {{wallbox_units}} a year from {{ev_sales}} sold.
- Installation is {{install_market}} of the {{installed_value}} spend; a package lets Kalvren capture value it can't reach with hardware alone, and its electrician relationships are an advantage competitors lack.
- At the same share, a package brings in about {{kalvren_bundle_rev}} of revenue, well above the board's bar.

**Risks / next steps:** package revenue includes the electrician's fee, so check the margin Kalvren keeps; hardware prices may fall as competition grows; check whether electricians would rather sell their own preferred brands. Next, pilot the package with a few hundred electricians and size the apartment-building opportunity.

## Common mistakes

- Multiplying all {{ev_sales}} sold by the hardware price, which gives {{naive_hw_market}} — {{naive_ratio}} the right answer.
- Sizing from the stock of EVs on the road instead of the yearly flow of new buyers.
- Forgetting that half of first-EV households have no private parking.
- Stopping at the market size without testing it against the board's {{revenue_bar}} bar.

## What top candidates do differently

- Explain the flow-versus-stock logic before doing any math.
- Notice that installation is worth more than the hardware and turn that into the recommendation.
- Use Exhibit 1 to point out the market is growing, so the hardware-only gap of {{hw_shortfall}} may close on its own in a year or two — but they don't rely on it, because the gap is measured at the household's price, before wholesaler and electrician markups.

## Creative question

About half of first-time EV households in Germany have no private parking. How could Kalvren reach them?

## Model answer

A strong answer groups ideas by who decides and who pays:

- **Apartment buildings:** sell shared charging systems to landlords and building managers, with one wallbox per parking space and billing per user.
- **Employers:** workplace charging packages for companies whose staff can't charge at home.
- **Partnerships:** bundle with car dealers or electricity suppliers, which already talk to every new EV buyer.
- **Policy:** track rules and subsidies that require charging points in new or renovated buildings.

Top candidates prioritize apartment buildings: "It's the same buyer journey Kalvren already knows — the electrician and the building owner — and households without parking are as numerous as those with it."
