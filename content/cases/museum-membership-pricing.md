---
id: museum-membership-pricing
title: "Members Only? Closing a Nonprofit Museum's Deficit"
client: "Calloway Museum of Art (fictional), a nonprofit art museum in a mid-sized US city"
summary: "A nonprofit museum must close a $2M deficit. Raising admission looks like the obvious fix, but it falls far short and turns visitors away. Can a membership program do better?"
industry: public-sector
sub_industry: "Nonprofit / Arts"
type: pricing
difficulty: beginner
format: candidate-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real museum data.
inputs:
  deficit:        { value: 2,    unit: "$M",              label: "Annual operating deficit to close" }
  admission:      { value: 20,   unit: "$",               label: "Adult admission price today" }
  visits:         { value: 400,  unit: "thousand",        label: "Paid adult visits per year today" }
  price_25:       { value: 25,   unit: "$",               label: "Admission price option" }
  visits_25:      { value: 340,  unit: "thousand",        label: "Expected paid visits at $25" }
  price_30:       { value: 30,   unit: "$",               label: "Admission price option" }
  visits_30:      { value: 280,  unit: "thousand",        label: "Expected paid visits at $30" }
  unique:         { value: 250,  unit: "thousand",        label: "Different adults who visit each year" }
  join_rate:      { value: 0.10, unit: "%",               label: "Share of visitors expected to join as members" }
  member_fee:     { value: 100,  unit: "$",               label: "Proposed annual membership fee (unlimited free entry)" }
  member_visits:  { value: 2.5,  unit: "",          label: "Paid visits a year by the visitors likely to join, before joining", decimals: 1 }
  donation:       { value: 60,   unit: "$",               label: "Extra donations per member per year, versus non-member visitors" }
  member_cost:    { value: 10,   unit: "$",               label: "Cost per member per year (card, mailings, member events)" }

calculations:
  # --- Raising admission ---
  - { id: adm_rev, label: "Admission revenue today", formula: "visits * admission / 1000", expected: 8, unit: "$M" }
  - { id: rev_25, label: "Admission revenue at $25", formula: "visits_25 * price_25 / 1000", expected: 8.5, unit: "$M" }
  - { id: rev_30, label: "Admission revenue at $30", formula: "visits_30 * price_30 / 1000", expected: 8.4, unit: "$M" }
  - { id: gain_25, label: "Extra revenue at $25", formula: "rev_25 - adm_rev", expected: 0.5, unit: "$M" }
  - { id: gain_30, label: "Extra revenue at $30", formula: "rev_30 - adm_rev", expected: 0.4, unit: "$M" }
  - { id: short_25, label: "Deficit left after the best admission increase", formula: "deficit - gain_25", expected: 1.5, unit: "$M" }
  - { id: visits_lost_25, label: "Visits lost at $25", formula: "visits - visits_25", expected: 60, unit: "thousand" }
  - { id: visits_lost_pct, label: "Share of visits lost at $25", formula: "visits_lost_25 / visits", expected: 0.15, unit: "%" }
  # --- Membership ---
  - { id: lost_adm_member, label: "Admission each new member no longer pays", formula: "member_visits * admission", expected: 50, unit: "$" }
  - { id: net_per_member, label: "Net gain per member per year", formula: "member_fee - lost_adm_member + donation - member_cost", expected: 100, unit: "$" }
  - { id: members_needed, label: "Members needed to close the deficit", formula: "deficit * 1000 / net_per_member", expected: 20, unit: "thousand members" }
  - { id: members_expected, label: "Members expected", formula: "unique * join_rate", expected: 25, unit: "thousand members" }
  - { id: member_net, label: "Net gain from membership", formula: "members_expected * net_per_member / 1000", expected: 2.5, unit: "$M" }
  - { id: net_half_don, label: "Net gain per member if members donate half as much", formula: "member_fee - lost_adm_member + donation / 2 - member_cost", expected: 70, unit: "$" }
  - { id: members_needed_half, label: "Members needed if members donate half as much", formula: "deficit * 1000 / net_half_don", expected: 28.57, unit: "thousand members", decimals: 0 }
  - { id: cushion, label: "Surplus after closing the deficit", formula: "member_net - deficit", expected: 0.5, unit: "$M" }

answer:
  calc: member_net
  headline: "Keep admission at {{admission}} and launch a {{member_fee}} membership: it needs {{members_needed}} to close the {{deficit}} deficit, should attract about {{members_expected}} and raise {{member_net}}, while the best admission increase adds only {{gain_25}}."

exhibits:
  - id: exhibit-1
    title: "Expected paid visits and admission revenue at three prices"
    kind: table
    ask: "The museum tested higher admission prices with a visitor survey. What do you see?"
    columns: ["Adult admission", "Paid visits per year", "Admission revenue"]
    rows:
      - ["{{admission}} (today)", "{{visits}}", "{{adm_rev}}"]
      - ["{{price_25}}", "{{visits_25}}", "{{rev_25}}"]
      - ["{{price_30}}", "{{visits_30}}", "{{rev_30}}"]
    note: "Illustrative data created for this practice case. Calloway is fictional. Children and students enter free at every price."
    insight: |
      Revenue peaks at {{price_25}}, and even there it adds only {{gain_25}},
      a quarter of the deficit, while {{visits_lost_25}} visits are lost.
  - id: exhibit-2
    title: "Proposed membership program"
    kind: table
    ask: "Here is the membership proposal. Does it close the gap?"
    columns: ["Item", "Value"]
    rows:
      - ["Annual fee (unlimited free entry)", "{{member_fee}}"]
      - ["Paid visits a year by likely members, before joining", "{{member_visits}}"]
      - ["Extra donations per member per year", "{{donation}}"]
      - ["Cost to serve a member per year", "{{member_cost}}"]
      - ["Share of visitors expected to join", "{{join_rate}}"]
    note: "Illustrative data created for this practice case, based on a survey of Calloway visitors. Donation figure compares members with non-members at similar museums."
    insight: |
      Each member is worth {{net_per_member}} a year: the fee more than
      covers the admission they stop paying, and members give more. The
      museum needs {{members_needed}}, and expects {{members_expected}}.
---

## Prompt

Our client, the Calloway Museum of Art, is a nonprofit museum with a strong collection of American painting. Since the pandemic, costs have grown faster than income, and the museum now runs an operating deficit of **{{deficit}}** a year. The board will not keep drawing down its endowment to cover it.

The finance committee has proposed raising adult admission from {{admission}}. The director worries this will keep people away and asks us: **how should Calloway price its visits to close the deficit?**

## Clarifying information

- Q: What is the objective?
  A: Break even: close the {{deficit}} deficit every year. The museum is not trying to maximize profit. It also wants to keep the collection open to as many people as possible.
- Q: How many people visit, and what do they pay?
  A: About {{visits}} paid adult visits a year at {{admission}}, made by about {{unique}} different people. Children and students enter free.
- Q: Have we tested higher prices?
  A: Yes, a visitor survey tested {{price_25}} and {{price_30}} (Exhibit 1).
- Q: Does Calloway have a membership program?
  A: No. The team has designed one: {{member_fee}} a year for unlimited free entry, plus member previews and events (Exhibit 2).
- Q: Who would become a member?
  A: Mostly local repeat visitors. Before joining, they visit about {{member_visits}} times a year and pay admission each time.
- Q: Do members give more?
  A: Yes. At similar museums, members donate about **{{donation}}** more a year than other visitors, because the museum has their contact details and a relationship with them.
- Q: Can we change other costs?
  A: The board has already made the cuts it is willing to make. Focus on income.

## Structure

> **Ask:** The candidate should build a structure around the museum's real objective, which is to break even while keeping visitors, not to maximize revenue.

- **1. Objective and size of the gap**
  - Close {{deficit}} a year; keep visitor numbers up
- **2. Option A: raise admission**
  - Admission revenue = Paid visits × Price at each tested price
  - Visitors lost, and what it means for the mission
- **3. Option B: membership**
  - Net gain per member = Fee − Admission no longer paid + Extra donations − Cost to serve
  - Members needed versus members expected
- **4. Compare against the objective**
  - Does it close the gap? What happens to visits? How certain is it?

Hypothesis: *"Museum visitors are price-sensitive, so a higher admission price will lose many visitors for little money. A membership that turns repeat visitors into donors may close more of the gap."*

## Math walkthrough

> **Ask:** The candidate should test both options against the {{deficit}} target, using Exhibit 1 and Exhibit 2.

**1. Raise admission (Exhibit 1).**
Today: 400k × $20 = **{{adm_rev}}**. At $25: 340k × $25 = **{{rev_25}}**. At $30: 280k × $30 = **{{rev_30}}**.
The best case is {{price_25}}, which adds only **{{gain_25}}** and leaves **{{short_25}}** of the deficit. It also loses {{visits_lost_25}} visits, {{visits_lost_pct}} of the total. Raising the price further makes revenue *fall*.

**2. Membership (Exhibit 2).**
Admission each member stops paying: 2.5 × $20 = **{{lost_adm_member}}**.
Net gain per member: $100 − $50 + $60 − $10 = **{{net_per_member}}** a year.
Members needed: $2M ÷ $100 = **{{members_needed}}**.
Members expected: 250k visitors × 10% = **{{members_expected}}**, worth 25k × $100 = **{{member_net}}**, closing the deficit with **{{cushion}}** to spare.

**3. Compare.**

| Option | Raise admission to {{price_25}} | Membership at {{member_fee}} |
|---|---|---|
| Money raised per year | {{gain_25}} | {{member_net}} |
| Closes the {{deficit}} deficit? | No, {{short_25}} short | Yes, {{cushion}} to spare |
| Visits | Down {{visits_lost_25}} visits | Members visit more |

## Synthesis

> **Ask:** The candidate should give the director a recommendation in line with the museum's objective.

**Calloway should keep adult admission at {{admission}} and launch a {{member_fee}} annual membership. It needs {{members_needed}} to close the {{deficit}} deficit and can expect about {{members_expected}}, which raises about {{member_net}} a year.**

1. **A higher price falls short:** the best tested price adds only {{gain_25}} and turns away {{visits_lost_pct}} of visits, which works against the museum's mission.
2. **Membership turns repeat visitors into supporters:** each member is worth {{net_per_member}} a year, more than half from extra donations.
3. **It fits the objective:** the goal is to break even and keep the doors open to as many people as possible, and membership does both.

**Risks and next steps:** the plan depends on donations from members, and the {{donation}} gap is partly selection: people who already give are the ones most likely to join, so some of that money would arrive without a membership. If members give half as much as expected, the net gain per member falls to {{net_half_don}} and the program needs about {{members_needed_half}}, more than expected, so test the donation assumption in the first year. Launch with a founding-member offer in the museum shop and at the ticket desk, track sign-ups monthly against the {{members_needed}} target, and keep the finance committee's admission increase as a fallback.

## Common mistakes

- Treating the goal as maximizing revenue. A nonprofit museum needs to break even while serving visitors.
- Assuming a higher price raises revenue in proportion: at {{price_30}}, revenue is lower than at {{price_25}}.
- Counting every member fee as new money, without subtracting the admission members no longer pay.
- Ignoring donations, which are the biggest source of value from a member.

## What top candidates do differently

- Restate the objective as "close {{deficit}} without losing visitors" and test every option against it.
- Express the membership answer as members needed versus members expected, which makes the risk easy to see.
- Notice that the {{donation}} donation gap is partly selection (likely givers are the ones who join), so not all of it is new money, and stress-test the answer at half the donation.
- Point out that a membership also gives the museum names and emails, which builds a donor base for the future.

## Creative question

Apart from admission and membership, how could Calloway raise more income without turning visitors away?

## Model answer

Group ideas by source of income:

- **Visitors:** paid special exhibitions with a separate ticket; guided tours and evening events; a better café and shop.
- **Donors:** a named-gallery or adopt-a-painting campaign; an annual gala; planned gifts from long-time supporters.
- **Institutions:** corporate memberships for local employers; grants from foundations for education programs; partnerships with universities.
- **Assets:** renting galleries for private events and weddings; licensing images from the collection.

A top candidate prioritizes: "Special exhibitions with a separate ticket are the best fit: the people who want them pay for them, and general admission stays affordable."
