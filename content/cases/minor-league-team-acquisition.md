---
id: minor-league-team-acquisition
title: "Buying the Ballclub: Is a Minor-League Team Worth the Asking Price?"
client: "Copperline Sports Partners (fictional), a group of local investors"
summary: "An investor group is offered a minor-league baseball team at 25 times its EBITDA. The seller's attendance plan justifies the price, but the stadium, its lease and the major-league affiliation decide whether that plan can happen."
industry: other
sub_industry: "Sports"
type: m-and-a
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real team, league or deal data.
inputs:
  home_games:      { value: 75,   unit: "games",  label: "Home games per season" }
  attendance:      { value: 4000, unit: "fans",   label: "Average attendance per home game, last season" }
  ticket:          { value: 10,   unit: "$",      label: "Average ticket revenue per fan (after free and discounted tickets)" }
  concession:      { value: 15,   unit: "$",      label: "Concessions and merchandise spend per fan" }
  concession_cost: { value: 5,    unit: "$",      label: "Cost of food, drink and merchandise per fan" }
  sponsorship:     { value: 1.5,  unit: "$M",     label: "Sponsorship and local media revenue per season", decimals: 1 }
  gameday_cost:    { value: 20,   unit: "$K",     label: "Game-day operating cost per home game (staff, security, cleaning, utilities)" }
  staff_fixed:     { value: 2.5,  unit: "$M",     label: "Front office and year-round staff", decimals: 1 }
  rent:            { value: 1.0,  unit: "$M",     label: "Stadium rent per year, current lease", decimals: 1 }
  other_fixed:     { value: 0.5,  unit: "$M",     label: "Other fixed costs (insurance, team travel, league fees)", decimals: 1 }
  multiple:        { value: 10,   unit: "x",      label: "EV/EBITDA multiple in recent sales of comparable teams" }
  ask_price:       { value: 50,   unit: "$M",     label: "Seller's asking price" }
  plan_attendance: { value: 6000, unit: "fans",   label: "Average attendance per game in year 3 of the seller's plan" }
  seats:           { value: 6000, unit: "seats",  label: "Stadium capacity (fixed seats plus lawn and standing areas)" }
  max_fill:        { value: 0.80, unit: "%",      label: "Highest share of capacity filled on average over a season by well-run teams in this league" }
  rent_new:        { value: 1.2,  unit: "$M",     label: "Stadium rent per year under the city's renewal offer", decimals: 1 }
  upgrades:        { value: 5,    unit: "$M",     label: "One-time stadium upgrades the team must pay for (clubhouse, lighting)" }

calculations:
  # --- Revenue per game ---
  - { id: ticket_game, label: "Ticket revenue per home game", formula: "attendance * ticket / 1000", expected: 40, unit: "$K" }
  - { id: conc_game, label: "Concessions and merchandise revenue per home game", formula: "attendance * concession / 1000", expected: 60, unit: "$K" }
  - { id: sponsor_game, label: "Sponsorship and media revenue per home game", formula: "sponsorship * 1000 / home_games", expected: 20, unit: "$K" }
  - { id: rev_game, label: "Revenue per home game", formula: "ticket_game + conc_game + sponsor_game", expected: 120, unit: "$K" }
  - { id: revenue, label: "Revenue per season", formula: "rev_game * home_games / 1000", expected: 9.0, unit: "$M", decimals: 1 }
  # --- Costs and EBITDA ---
  - { id: conc_cost_total, label: "Cost of food, drink and merchandise per season", formula: "attendance * concession_cost * home_games / 1000000", expected: 1.5, unit: "$M", decimals: 1 }
  - { id: gameday_total, label: "Game-day operating costs per season", formula: "gameday_cost * home_games / 1000", expected: 1.5, unit: "$M", decimals: 1 }
  - { id: fixed_total, label: "Fixed costs per season", formula: "staff_fixed + rent + other_fixed", expected: 4.0, unit: "$M", decimals: 1 }
  - { id: ebitda, label: "EBITDA, last season", formula: "revenue - conc_cost_total - gameday_total - fixed_total", expected: 2.0, unit: "$M", decimals: 1 }
  - { id: ebitda_margin, label: "EBITDA margin", formula: "ebitda / revenue", expected: 0.222, unit: "%", decimals: 0 }
  - { id: standalone, label: "Value today at the comparable multiple", formula: "ebitda * multiple", expected: 20, unit: "$M" }
  - { id: ask_multiple, label: "Asking price as a multiple of today's EBITDA", formula: "ask_price / ebitda", expected: 25, unit: "x" }
  # --- The seller's plan ---
  - { id: fan_margin, label: "Profit from one extra fan at one game (ticket + concessions − their cost)", formula: "ticket + concession - concession_cost", expected: 20, unit: "$" }
  - { id: fan_season, label: "Profit per season from one extra fan of average attendance", formula: "fan_margin * home_games", expected: 1500, unit: "$" }
  - { id: plan_gain, label: "Extra EBITDA in the seller's plan", formula: "(plan_attendance - attendance) * fan_season / 1000000", expected: 3.0, unit: "$M", decimals: 1 }
  - { id: plan_ebitda, label: "EBITDA in year 3 of the seller's plan", formula: "ebitda + plan_gain", expected: 5.0, unit: "$M", decimals: 1 }
  - { id: plan_value, label: "Value on the seller's plan", formula: "plan_ebitda * multiple", expected: 50, unit: "$M" }
  - { id: plan_fill, label: "Share of capacity the plan needs filled, on average, every game", formula: "plan_attendance / seats", expected: 1.0, unit: "%" }
  - { id: fill_today, label: "Share of capacity filled today", formula: "attendance / seats", expected: 0.667, unit: "%", decimals: 0 }
  # --- What is realistic ---
  - { id: max_att, label: "Realistic best average attendance", formula: "seats * max_fill", expected: 4800, unit: "fans" }
  - { id: real_gain, label: "Extra EBITDA from realistic attendance growth", formula: "(max_att - attendance) * fan_season / 1000000", expected: 1.2, unit: "$M", decimals: 1 }
  - { id: rent_rise, label: "Rise in stadium rent under the renewal offer", formula: "rent_new - rent", expected: 0.2, unit: "$M", decimals: 1 }
  - { id: real_ebitda, label: "Realistic EBITDA after the new lease", formula: "ebitda + real_gain - rent_rise", expected: 3.0, unit: "$M", decimals: 1 }
  - { id: real_value, label: "Value at realistic EBITDA", formula: "real_ebitda * multiple", expected: 30, unit: "$M" }
  - { id: walkaway, label: "Walk-away price (value less the stadium upgrades)", formula: "real_value - upgrades", expected: 25, unit: "$M" }
  - { id: overpay, label: "Gap between the asking price and the walk-away price", formula: "ask_price - walkaway", expected: 25, unit: "$M" }
  - { id: plan_only_value, label: "Value on the seller's plan after the lease and upgrades", formula: "(plan_ebitda - rent_rise) * multiple - upgrades", expected: 43, unit: "$M" }

answer:
  calc: walkaway
  headline: "The team is worth at most about {{walkaway}} to Copperline, half the {{ask_price}} asking price: the seller's plan needs a sellout every game, realistic attendance tops out at {{max_att}}, and the new stadium lease adds rent plus {{upgrades}} of upgrades that the team's major-league license requires."

exhibits:
  - id: exhibit-1
    title: "Riverton Rail Cats economics, last season"
    kind: table
    ask: "Here is what the seller shared about last season. What does the team earn?"
    columns: ["Item", "Value"]
    rows:
      - ["Home games", "{{home_games}}"]
      - ["Average attendance per game", "{{attendance}}"]
      - ["Average ticket revenue per fan", "{{ticket}}"]
      - ["Concessions and merchandise spend per fan", "{{concession}}"]
      - ["Cost of food, drink and merchandise per fan", "{{concession_cost}}"]
      - ["Sponsorship and local media, per season", "{{sponsorship}}"]
      - ["Game-day operating cost per home game", "{{gameday_cost}}"]
      - ["Front office and year-round staff", "{{staff_fixed}}"]
      - ["Stadium rent (current lease)", "{{rent}}"]
      - ["Other fixed costs (insurance, team travel, league fees)", "{{other_fixed}}"]
    note: "Illustrative data created for this practice case. The Rail Cats are fictional. Player salaries are paid by the major-league parent club, not by the team."
    insight: |
      Each home game brings in {{rev_game}}, so the season brings in
      {{revenue}} and the team earns {{ebitda}} of EBITDA. At comparable
      multiples it is worth about {{standalone}} today, so the asking price
      is {{ask_multiple}} today's EBITDA.
  - id: exhibit-2
    title: "The seller's attendance plan"
    kind: bar
    unit: "fans"
    decimals: 0
    ask: "The seller says this plan justifies the price. What do you make of it?"
    data:
      - { label: "Last season", value: attendance }
      - { label: "Year 1", value: 4800 }
      - { label: "Year 2", value: 5400 }
      - { label: "Year 3", value: plan_attendance }
    note: "Illustrative data created for this practice case. Average attendance per home game. The seller expects more theme nights, fireworks and group sales to drive the growth, with no change in ticket prices or spending per fan."
    insight: |
      The plan is worth {{plan_gain}} of extra EBITDA, which at {{multiple}}
      is exactly the asking price. But it assumes a 50% rise in attendance,
      and the candidate should ask whether the stadium can hold it.
---

## Prompt

Our client, Copperline Sports Partners, is a group of local business owners who want to buy the Riverton Rail Cats, a minor-league baseball team affiliated with a major-league club. The team plays in a city-owned stadium and is popular with families, but attendance has been flat for several years.

The current owner is retiring and asks **{{ask_price}}** for the team. He says the price is fair because attendance will grow by half under his plan. The investors ask us: **should Copperline buy the Rail Cats, and what is the most it should pay?**

## Clarifying information

- Q: What is the objective?
  A: Copperline wants a sound investment and a team that stays in Riverton. It will not pay more than the team is worth to it, and it values teams at the multiple paid in recent comparable sales.
- Q: What multiple do comparable teams sell for?
  A: About **{{multiple}}** EBITDA in recent sales of similar teams.
- Q: Who pays the players?
  A: The major-league parent club pays players and coaches. The team pays for the stadium operation, staff and travel, which are all in Exhibit 1.
- Q: How many fans can the stadium hold?
  A: Capacity is **{{seats}}**, including the lawn and standing areas. That is the most the stadium is allowed to hold.
- Q: How full can a stadium like this get over a season?
  A: Weekend and fireworks nights sell out, but weeknight games early in the season rarely do. Well-run teams in this league average at most about **{{max_fill}}** of their capacity across a season.
- Q: What are the terms of the stadium lease?
  A: The lease ends in three years. The city has offered a 15-year renewal at **{{rent_new}}** a year, on the condition that the team pays for **{{upgrades}}** of upgrades to the clubhouse and lighting within the next two seasons. Cities often pay for much of this kind of work, but Riverton paid for the last renovation and has said the team must fund this one.
- Q: Why does the stadium need upgrades?
  A: Since 2021, Major League Baseball has licensed each affiliated minor-league team directly, and the license sets facility standards for clubhouses, training space and field lighting. The stadium falls short. If the standards are not met, the team can lose its license and the parent club can move its affiliate elsewhere, and a team without an affiliate has no players to field.
- Q: Does the seller's plan include the new lease or the upgrades?
  A: No. The plan keeps today's rent and includes no stadium spending.

## Structure

> **Ask:** The candidate should build a structure that values the team today, tests the seller's plan, and checks what the stadium and the affiliation require.

- **1. What does the team earn today?**
  - Revenue per game = Attendance × (Ticket + Concessions) + Sponsorship per game
  - × Home games, minus food and merchandise costs, game-day costs and fixed costs = EBITDA
  - Value = EBITDA × comparable multiple
- **2. Is the seller's plan realistic?**
  - Profit per extra fan, and what the plan is worth
  - Can the stadium hold that many fans? How full do similar stadiums get?
- **3. What else must the buyer pay for?**
  - Stadium lease: term, rent, conditions
  - Major-league affiliation: facility standards and what happens if they are missed
- **4. Price**
  - Walk-away price = Value at realistic EBITDA − One-time stadium costs
  - Opening offer below it

Hypothesis: *"At 25 times today's EBITDA, the price depends entirely on the growth plan. I want to check whether the stadium and its lease allow that growth."*

## Math walkthrough

> **Ask:** The candidate should value the team today, test the seller's plan against the stadium, and include the lease and the upgrades the team's major-league license requires.

**1. Revenue per game (Exhibit 1).**
Tickets: 4,000 × $10 = **{{ticket_game}}**. Concessions and merchandise: 4,000 × $15 = **{{conc_game}}**. Sponsorship: $1.5M ÷ 75 = **{{sponsor_game}}**.
Revenue per game: **{{rev_game}}**, or $120K × 75 = **{{revenue}}** a season.

**2. EBITDA.**

| Item | Calculation | Per season |
|---|---|---|
| Revenue | $120K × 75 | {{revenue}} |
| Food, drink and merchandise | 4,000 × $5 × 75 | −{{conc_cost_total}} |
| Game-day costs | $20K × 75 | −{{gameday_total}} |
| Fixed costs | $2.5M + $1.0M + $0.5M | −{{fixed_total}} |
| **EBITDA** | | **{{ebitda}}** |

At {{multiple}}, the team is worth about **{{standalone}}** today. The asking price is **{{ask_multiple}}** today's EBITDA.

**3. The seller's plan (Exhibit 2).**
Each extra fan at a game adds $10 + $15 − $5 = **{{fan_margin}}**, or $20 × 75 = **{{fan_season}}** a season.
Plan: (6,000 − 4,000) × $1,500 = **{{plan_gain}}**, so EBITDA reaches **{{plan_ebitda}}** and the value **{{plan_value}}**, exactly the asking price. The seller is asking Copperline to pay today for all of his plan.

**4. Can the stadium hold it?**
The plan needs 6,000 ÷ 6,000 = **{{plan_fill}}** of capacity filled at every game, against {{fill_today}} today. The realistic best is 6,000 × 80% = **{{max_att}}** a game.
Realistic gain: (4,800 − 4,000) × $1,500 = **{{real_gain}}**.

**5. The lease and the affiliation.**
Rent rises $1.2M − $1.0M = **{{rent_rise}}** a year. Realistic EBITDA: $2.0M + $1.2M − $0.2M = **{{real_ebitda}}**, worth $3.0M × 10 = **{{real_value}}**.
The {{upgrades}} of upgrades are not optional: without them the city will not renew and the team can lose its license and its affiliate. Walk-away price: $30M − $5M = **{{walkaway}}**, which is **{{overpay}}** below the asking price.
Even if the seller's attendance plan came true, the lease and upgrades would cut its value to **{{plan_only_value}}**, below the asking price.

| Step | EBITDA | Value |
|---|---|---|
| Today | {{ebitda}} | {{standalone}} |
| Seller's plan | {{plan_ebitda}} | {{plan_value}} |
| Realistic attendance and new lease | {{real_ebitda}} | {{real_value}} |
| Less stadium upgrades (one-time) | | **{{walkaway}}** |

## Synthesis

> **Ask:** The candidate should give the investors a clear recommendation and a price.

**Copperline should not pay {{ask_price}}. The Rail Cats are worth at most about {{walkaway}} to it: the seller's plan needs a sellout at every game, and the new stadium lease adds rent and {{upgrades}} of upgrades that the team's major-league license requires. Copperline should open near today's value of {{standalone}} and walk away above {{walkaway}}.**

1. **The price is all plan:** the team earns {{ebitda}}, worth about {{standalone}} at comparable multiples; the asking price is {{ask_multiple}} that EBITDA, and only the seller's growth plan gets it to {{ask_price}}.
2. **The stadium caps the plan:** {{plan_attendance}} a game is the stadium's full capacity of {{seats}}, at every game. Similar teams top out at about {{max_fill}}, or {{max_att}} a game, which adds {{real_gain}}, not {{plan_gain}}.
3. **The lease and the affiliation come with a bill:** to keep the stadium and its major-league affiliate, the owner must pay {{upgrades}} of upgrades and {{rent_rise}} more rent a year, none of which is in the seller's plan.

**Risks and next steps:** walking away is a real option if the seller will not move toward {{walkaway}}, and Copperline should say so early. Before bidding, confirm the facility requirements and deadline with Major League Baseball and the parent club in writing, and ask the city whether it would share the cost of the upgrades, which would raise the walk-away price. Check whether higher ticket prices on sold-out weekend nights could add to revenue without more fans, and ask for three years of game-by-game attendance to see how often the stadium sells out today.

## Common mistakes

- Valuing the team on the seller's year-3 EBITDA, which pays the seller for growth the stadium cannot hold and the buyer would have to deliver.
- Not asking about stadium capacity, and so missing that the plan needs a full stadium at every game.
- Counting all extra revenue as profit, instead of subtracting the cost of food, drink and merchandise.
- Ignoring the lease and the affiliation, which together cost {{upgrades}} up front and {{rent_rise}} a year.
- Offering the walk-away price. {{walkaway}} is the ceiling, not the first bid.

## What top candidates do differently

- Turn the plan into a capacity check right away: {{plan_fill}} of capacity every game is a red flag.
- Ask who owns the stadium and when the lease ends, because a team's value depends on where it plays.
- Treat the upgrades as part of the price, not as an operating cost.
- Give a walk-away price and an opening offer, and say what would change them (city cost-sharing, higher prices on sellout nights).

## Creative question

If Copperline buys the team, how could it grow profit without needing more seats?

## Model answer

Organize ideas around **more revenue per fan, more events, and more partners**:

- **More revenue per fan:** higher prices for the best seats and for weekend and fireworks nights; group packages with food included; premium areas such as a party deck or picnic terrace.
- **More events:** concerts, college and high school games, festivals and private events on the roughly 290 days a year with no home game.
- **More partners:** naming rights for the stadium and its seating areas; local media and streaming deals; community partnerships with schools and youth leagues that bring families back.

A top candidate prioritizes: "Non-baseball events, because the stadium sits empty most of the year. Every concert or festival uses fixed costs the team already pays."
