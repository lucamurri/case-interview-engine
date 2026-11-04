---
id: womens-soccer-league-expansion
title: "Expansion Season: A Soccer Owner Bets on the Women's Game"
client: "Torvane Sports Group (fictional), owner of Harbor City FC, a men's professional soccer club"
summary: "A men's club owner can buy an expansion team in a fast-growing women's league for $60M. Build the season-by-season cash flow, find the breakeven year, and see how much the answer depends on the next media deal."
industry: media-sports
sub_industry: "Sports"
type: market-entry
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real league or club data.
inputs:
  fee:             { value: 60,    unit: "$M",            label: "Expansion fee, paid before the first season" }
  league_teams:    { value: 16,    unit: "teams",         label: "Teams in the league after expansion, including Harbor City" }
  media_deal_now:  { value: 64,    unit: "$M",            label: "League media deal per year, seasons 1–3 (shared equally)" }
  media_deal_new:  { value: 128,   unit: "$M",            label: "Expected league media deal per year from season 4" }
  home_games:      { value: 15,    unit: "games",         label: "Home games per season" }
  ticket_price:    { value: 40,    unit: "$",             label: "Average ticket price" }
  att_1:           { value: 10000, unit: "fans per game", label: "Average attendance, season 1" }
  att_2:           { value: 12500, unit: "fans per game", label: "Average attendance, season 2" }
  att_3:           { value: 15000, unit: "fans per game", label: "Average attendance, season 3 onward" }
  spons_1:         { value: 5.0,   unit: "$M",            label: "Sponsorship revenue, season 1", decimals: 1 }
  spons_2:         { value: 5.5,   unit: "$M",            label: "Sponsorship revenue, season 2", decimals: 1 }
  spons_3:         { value: 7.0,   unit: "$M",            label: "Sponsorship revenue, season 3 onward", decimals: 1 }
  players:         { value: 4.0,   unit: "$M",            label: "Player salaries (league salary cap)", decimals: 1 }
  staff:           { value: 2.5,   unit: "$M",            label: "Coaches, medical and front-office staff", decimals: 1 }
  gameday_cost:    { value: 0.1,   unit: "$M",            label: "Game-day cost per home game (security, staff, field)", decimals: 1 }
  travel:          { value: 1.5,   unit: "$M",            label: "Team travel", decimals: 1 }
  admin:           { value: 2.5,   unit: "$M",            label: "Marketing and administration", decimals: 1 }
  hurdle:          { value: 8,     unit: "seasons",       label: "Owner's target: recover the fee within this many seasons" }
  stadium_cap:     { value: 25000, unit: "seats",         label: "Capacity of Harbor City FC's stadium" }

calculations:
  # --- Media share per team ---
  - { id: media_now, label: "Media share per team, seasons 1–3", formula: "media_deal_now / league_teams", expected: 4, unit: "$M" }
  - { id: media_new, label: "Media share per team, from season 4", formula: "media_deal_new / league_teams", expected: 8, unit: "$M" }
  # --- Revenue by season ---
  - { id: tix_1, label: "Ticket revenue, season 1", formula: "home_games * att_1 * ticket_price / 1e6", expected: 6.0, unit: "$M", decimals: 1 }
  - { id: tix_2, label: "Ticket revenue, season 2", formula: "home_games * att_2 * ticket_price / 1e6", expected: 7.5, unit: "$M", decimals: 1 }
  - { id: tix_3, label: "Ticket revenue, season 3 onward", formula: "home_games * att_3 * ticket_price / 1e6", expected: 9.0, unit: "$M", decimals: 1 }
  - { id: rev_1, label: "Revenue, season 1", formula: "tix_1 + media_now + spons_1", expected: 15, unit: "$M" }
  - { id: rev_2, label: "Revenue, season 2", formula: "tix_2 + media_now + spons_2", expected: 17, unit: "$M" }
  - { id: rev_3, label: "Revenue, season 3", formula: "tix_3 + media_now + spons_3", expected: 20, unit: "$M" }
  - { id: rev_4, label: "Revenue, season 4 onward", formula: "tix_3 + media_new + spons_3", expected: 24, unit: "$M" }
  # --- Costs and profit ---
  - { id: gameday_total, label: "Game-day costs per season", formula: "home_games * gameday_cost", expected: 1.5, unit: "$M", decimals: 1 }
  - { id: costs, label: "Operating costs per season", formula: "players + staff + gameday_total + travel + admin", expected: 12, unit: "$M" }
  - { id: profit_1, label: "Operating profit, season 1", formula: "rev_1 - costs", expected: 3, unit: "$M" }
  - { id: profit_2, label: "Operating profit, season 2", formula: "rev_2 - costs", expected: 5, unit: "$M" }
  - { id: profit_3, label: "Operating profit, season 3", formula: "rev_3 - costs", expected: 8, unit: "$M" }
  - { id: profit_4, label: "Operating profit, season 4 onward", formula: "rev_4 - costs", expected: 12, unit: "$M" }
  # --- Cumulative cash, with the new media deal ---
  - { id: cum_1, label: "Cumulative cash after season 1", formula: "-fee + profit_1", expected: -57, unit: "$M" }
  - { id: cum_2, label: "Cumulative cash after season 2", formula: "cum_1 + profit_2", expected: -52, unit: "$M" }
  - { id: cum_3, label: "Cumulative cash after season 3", formula: "cum_2 + profit_3", expected: -44, unit: "$M" }
  - { id: cum_4, label: "Cumulative cash after season 4", formula: "cum_3 + profit_4", expected: -32, unit: "$M" }
  - { id: cum_5, label: "Cumulative cash after season 5", formula: "cum_4 + profit_4", expected: -20, unit: "$M" }
  - { id: cum_6, label: "Cumulative cash after season 6", formula: "cum_5 + profit_4", expected: -8, unit: "$M" }
  - { id: cum_7, label: "Cumulative cash after season 7", formula: "cum_6 + profit_4", expected: 4, unit: "$M" }
  - { id: cum_8, label: "Cumulative cash after season 8", formula: "cum_7 + profit_4", expected: 16, unit: "$M" }
  - { id: to_recover, label: "Fee still to recover after season 3", formula: "-cum_3", expected: 44, unit: "$M" }
  - { id: breakeven_season, label: "Breakeven season with the new media deal", formula: "3 + ceil(-cum_3 / profit_4)", expected: 7, unit: "" }
  # --- If the media deal does not grow ---
  - { id: breakeven_flat, label: "Breakeven season if the media share stays flat", formula: "3 + ceil(-cum_3 / profit_3)", expected: 9, unit: "" }
  - { id: cum_8_flat, label: "Cumulative cash after season 8, flat media deal", formula: "cum_3 + (hurdle - 3) * profit_3", expected: -4, unit: "$M" }
  - { id: profit_needed, label: "Season profit needed in seasons 4–8 to break even by season 8", formula: "-cum_3 / (hurdle - 3)", expected: 8.8, unit: "$M", decimals: 1 }
  - { id: media_needed, label: "Media share per team needed to break even by season 8", formula: "media_now + profit_needed - profit_3", expected: 4.8, unit: "$M", decimals: 1 }
  - { id: media_uplift_needed, label: "Media-deal growth needed to meet the target", formula: "media_needed / media_now - 1", expected: 0.20, unit: "%" }
  - { id: fill_rate, label: "Stadium filled at season-3 attendance", formula: "att_3 / stadium_cap", expected: 0.60, unit: "%" }

answer:
  calc: breakeven_season
  headline: "With the new media deal the team recovers its {{fee}} fee in season {{breakeven_season}}, inside the owner's target of {{hurdle}}; without it, breakeven slips to season {{breakeven_flat}}, but the media share only has to grow {{media_uplift_needed}} to stay on target."

exhibits:
  - id: exhibit-1
    title: "League average attendance per game"
    kind: bar
    unit: "fans"
    decimals: 0
    ask: "Here is how the league has grown. What do you take from it?"
    data:
      - { label: "2022", value: 6000 }
      - { label: "2023", value: 7500 }
      - { label: "2024", value: 9000 }
      - { label: "2025", value: 11000 }
    reference: { value: att_3, label: "Harbor City plan, season 3" }
    note: "Illustrative data created for this practice case; not real league statistics. The league is fictional."
    insight: |
      Attendance has nearly doubled in three years. The plan's season-3
      figure is above today's league average, which is plausible for a team in a
      large city with an existing fan base but is worth testing.
  - id: exhibit-2
    title: "Harbor City women's team: projected P&L by season"
    kind: table
    ask: "Here is the business plan. When does the team pay back the expansion fee?"
    columns: ["", "Season 1", "Season 2", "Season 3", "Season 4 onward"]
    rows:
      - ["Average attendance", "{{att_1}}", "{{att_2}}", "{{att_3}}", "{{att_3}}"]
      - ["Ticket revenue (at {{ticket_price}}, {{home_games}})", "{{tix_1}}", "{{tix_2}}", "{{tix_3}}", "{{tix_3}}"]
      - ["Media share (league deal ÷ {{league_teams}}, incl. Harbor City)", "{{media_now}}", "{{media_now}}", "{{media_now}}", "{{media_new}}"]
      - ["Sponsorship", "{{spons_1}}", "{{spons_2}}", "{{spons_3}}", "{{spons_3}}"]
      - ["Players, staff, travel, admin", "{{players}} + {{staff}} + {{travel}} + {{admin}}", "same", "same", "same"]
      - ["Game-day costs", "{{gameday_total}}", "{{gameday_total}}", "{{gameday_total}}", "{{gameday_total}}"]
    note: "Illustrative data created for this practice case. The league's current media deal ({{media_deal_now}} a year) ends after season 3. The plan assumes the next deal doubles to {{media_deal_new}}; negotiations have not started."
    insight: |
      The team makes an operating profit from season 1, so the question is
      only how fast it earns back the fee, and from season 4 the answer hangs
      on the media deal.
---

## Prompt

Our client is Torvane Sports Group, which owns Harbor City FC, a men's professional soccer club, and the 25,000-seat stadium it plays in.

A fast-growing women's professional league is expanding and has offered Torvane a new team in Harbor City for an expansion fee of **$60 million**. The team would share Harbor City FC's stadium, training facility and front office. The owner has asked us: **should Torvane buy the expansion team, and when would it earn back the fee?**

## Clarifying information

- Q: What is the owner's objective?
  A: Grow the group with a business that pays for itself. The owner wants the cash operating profit to recover the expansion fee within {{hurdle}}.
- Q: Should we discount future cash flows?
  A: No. Use simple cumulative cash with no discounting, and ignore taxes and financing.
- Q: How does a team in this league make money?
  A: Three main sources: ticket sales, an equal share of the league's media deal, and sponsorship. Merchandise and concessions are small; ignore them.
- Q: Are there costs beyond the team's own operations?
  A: The stadium is already owned and staffed, so the women's team only pays a game-day cost of {{gameday_cost}} per home game. Players are paid within a league salary cap.
- Q: Who are the competitors?
  A: There is no other women's professional team in the region. The team would compete for fans' time and money with Harbor City FC itself and with other local sports.

## Structure

> **Ask:** How would you structure the decision?

- **1. Is the market attractive?**
  - League growth: attendance, media deal, sponsorship
  - Local demand: fan base, competing teams and events
- **2. Does the team pay?**
  - Revenue per season: tickets (games × attendance × price), media share, sponsorship
  - Costs: players (salary cap), staff, travel, game-day costs, admin
  - Season-by-season profit and cumulative cash against the {{fee}} fee
- **3. Can Torvane win?**
  - What it brings: stadium, fan base, sponsor relationships, front office
  - What it lacks: experience in the women's game, player recruitment
- **4. How should it enter?**
  - Buy the expansion slot outright, bring in a minority partner, or wait for a later expansion round
- **5. Risks:** the next media deal, attendance after the launch year, sharing dates with the men's team

Hypothesis: *"Torvane already has a stadium and staff, so its costs should be lower than a stand-alone team's. The fee is the big number, so the answer depends on how fast profit grows."*

## Math walkthrough

> **Ask:** Using Exhibit 2, calculate profit season by season and find the season in which cumulative cash turns positive. Then: the plan assumes the league's media deal doubles from season 4. What if it stays flat?

**1. Revenue by season.**
Media share: $64M ÷ 16 teams (Harbor City is one of the 16) = **{{media_now}}**, rising to $128M ÷ 16 = **{{media_new}}** from season 4.
Tickets: 15 games × 10,000 fans × $40 = **{{tix_1}}** in season 1, then {{tix_2}} and {{tix_3}}.

| Revenue line | Season 1 | Season 2 | Season 3 | Season 4+ |
|---|---|---|---|---|
| Tickets | {{tix_1}} | {{tix_2}} | {{tix_3}} | {{tix_3}} |
| Media | {{media_now}} | {{media_now}} | {{media_now}} | {{media_new}} |
| Sponsorship | {{spons_1}} | {{spons_2}} | {{spons_3}} | {{spons_3}} |
| **Revenue** | **{{rev_1}}** | **{{rev_2}}** | **{{rev_3}}** | **{{rev_4}}** |

**2. Costs and profit.**
Game-day costs: 15 × $0.1M = {{gameday_total}}. Total costs: $4.0M + $2.5M + $1.5M + $1.5M + $2.5M = **{{costs}}** a season.
Profit: **{{profit_1}}**, **{{profit_2}}**, **{{profit_3}}**, then **{{profit_4}}** a season from season 4.

**3. Cumulative cash.**

| After season | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| Cumulative cash | −{{fee}} | {{cum_1}} | {{cum_2}} | {{cum_3}} | {{cum_4}} | {{cum_5}} | {{cum_6}} | **{{cum_7}}** |

Cumulative cash turns positive in **season {{breakeven_season}}**, inside the target of {{hurdle}}.

**4. If the media deal stays flat.**
Profit stays at {{profit_3}} after season 3. Still to recover: {{to_recover}}, which takes $44M ÷ $8M, rounded up to 6 more seasons, so breakeven moves to **season {{breakeven_flat}}**. After season 8 cumulative cash would still be {{cum_8_flat}}: the target is missed.

**5. How much growth does the media deal need?**
To break even by season 8, seasons 4–8 must earn $44M ÷ 5 = **{{profit_needed}}** a season, which means a media share of $4M + ($8.8M − $8M) = **{{media_needed}}**. The deal only needs to grow **{{media_uplift_needed}}**, not double.

## Synthesis

> **Ask:** What would you tell the owner?

**Torvane should buy the expansion team. On the business plan it recovers the {{fee}} fee in season {{breakeven_season}}, inside the target of {{hurdle}}. The plan's biggest assumption is that the league's media deal doubles, but even if it grows only {{media_uplift_needed}}, the team still pays back by season 8.**

1. **The team is profitable from season 1:** {{profit_1}} in year one, rising to {{profit_4}} a season, helped by using Harbor City FC's stadium and staff.
2. **The media deal decides how fast it pays back:** doubled, breakeven comes in season {{breakeven_season}}; flat, it slips to season {{breakeven_flat}}.
3. **The market is growing:** league attendance nearly doubled in three years, and the plan fills only {{fill_rate}} of the stadium in season 3.

**Risks and next steps:** test season-3 attendance of {{att_3}} against the best-performing teams in the league; agree with the league how expansion teams share the next media deal, since any further expansion would split it more ways and dilute Harbor City's share; lock in founding sponsors before launch; plan the schedule with Harbor City FC so the two teams' home dates don't clash. The fee also buys a franchise that can be sold later. Expansion fees in growing leagues have tended to rise, which is upside not counted here.

## Common mistakes

- Forgetting the expansion fee and declaring the team "profitable from year one" without asking when the investment comes back.
- Applying season-4 profit to every season, which brings breakeven forward by ignoring the slow first three years.
- Treating the doubled media deal as certain instead of a forecast.
- Answering only "yes" without saying how to reduce the risk (sponsor commitments, a partner, media-deal terms).

## What top candidates do differently

- Lay out a clean season-by-season table and keep running totals, so the breakeven season is easy to see.
- Test the single assumption the answer depends on (the media deal) and compute how much growth it really needs.
- Use Torvane's existing stadium and staff as the reason its costs beat a stand-alone team's.
- Mention that the fee buys an asset with resale value, while keeping it out of the payback calculation.

## Creative question

How could Torvane use its men's club to make the women's team more successful?

## Model answer

Organize ideas by **fans, sponsors and operations**:

- **Fans:** joint season tickets for both teams; double-headers on the same day; cross-promotion at every men's game to a crowd that already loves the club.
- **Sponsors:** sell combined sponsorship packages; recruit brands that want to reach women and families and are not yet sponsoring the men's club.
- **Operations:** shared training facility, medical staff, analytics and academy; one ticketing and marketing team.

A top candidate prioritizes: "Cross-promotion at men's games is the cheapest way to build attendance in season 1, which is when the plan is weakest."
