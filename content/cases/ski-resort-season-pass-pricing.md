---
id: ski-resort-season-pass-pricing
title: "Powder Math: Pricing a Ski Resort's Season Pass"
client: "Tamarack Ridge Mountain Resort (fictional), a mid-sized ski resort in Colorado"
summary: "A ski resort wants to sell a season pass. The pass brings in cash before the first snowfall, but every frequent skier who buys one stops paying for day tickets. Find the price that earns the most."
industry: consumer-retail
sub_industry: "Leisure & travel"
type: pricing
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  day_price:     { value: 100,  unit: "$",              label: "Average price paid per day ticket (after discounts)" }
  anc_margin:    { value: 40,   unit: "$/visit",        label: "Contribution per visit from food, rentals, lessons and lodging" }
  occ_skiers:    { value: 60,   unit: "thousand skiers", label: "Occasional skiers (1–3 visits a season)" }
  occ_visits:    { value: 2,    unit: "visits",         label: "Average visits per season, occasional skiers" }
  reg_skiers:    { value: 25,   unit: "thousand skiers", label: "Regular skiers (4–9 visits a season)" }
  reg_visits:    { value: 6,    unit: "visits",         label: "Average visits per season, regular skiers" }
  freq_skiers:   { value: 5,    unit: "thousand skiers", label: "Frequent skiers (10+ visits a season)" }
  freq_visits:   { value: 12,   unit: "visits",         label: "Average visits per season, frequent skiers" }
  p_low:         { value: 500,  unit: "$",              label: "Pass price option: low" }
  p_mid:         { value: 700,  unit: "$",              label: "Pass price option: middle" }
  p_high:        { value: 900,  unit: "$",              label: "Pass price option: high" }
  n_low:         { value: 20,   unit: "thousand passes", label: "Passes sold at the low price" }
  n_mid:         { value: 10,   unit: "thousand passes", label: "Passes sold at the middle price" }
  n_high:        { value: 4,    unit: "thousand passes", label: "Passes sold at the high price" }
  prior_low:     { value: 6,    unit: "visits",         label: "Day-ticket visits last season, average buyer at the low price" }
  prior_mid:     { value: 7,    unit: "visits",         label: "Day-ticket visits last season, average buyer at the middle price" }
  prior_high:    { value: 10,   unit: "visits",         label: "Day-ticket visits last season, average buyer at the high price" }
  with_low:      { value: 9,    unit: "visits",         label: "Expected visits with a pass, average buyer at the low price" }
  with_mid:      { value: 11,   unit: "visits",         label: "Expected visits with a pass, average buyer at the middle price" }
  with_high:     { value: 14,   unit: "visits",         label: "Expected visits with a pass, average buyer at the high price" }

calculations:
  # --- Today ---
  - { id: ticket_visits, label: "Day-ticket visits per season today", formula: "occ_skiers * occ_visits + reg_skiers * reg_visits + freq_skiers * freq_visits", expected: 330, unit: "thousand visits" }
  - { id: ticket_rev, label: "Day-ticket revenue per season today", formula: "ticket_visits * day_price / 1000", expected: 33, unit: "$M" }
  - { id: occ_spend, label: "Day-ticket spend per occasional skier", formula: "occ_visits * day_price", expected: 200, unit: "$" }
  - { id: reg_spend, label: "Day-ticket spend per regular skier", formula: "reg_visits * day_price", expected: 600, unit: "$" }
  - { id: freq_spend, label: "Day-ticket spend per frequent skier", formula: "freq_visits * day_price", expected: 1200, unit: "$" }
  - { id: be_visits, label: "Visits at which a middle-price pass beats day tickets", formula: "p_mid / day_price", expected: 7, unit: "times" }
  # --- Pass revenue ---
  - { id: rev_low, label: "Pass revenue at the low price", formula: "n_low * p_low / 1000", expected: 10, unit: "$M" }
  - { id: rev_mid, label: "Pass revenue at the middle price", formula: "n_mid * p_mid / 1000", expected: 7, unit: "$M" }
  - { id: rev_high, label: "Pass revenue at the high price", formula: "n_high * p_high / 1000", expected: 3.6, unit: "$M" }
  # --- Cannibalization ---
  - { id: lost_low, label: "Day-ticket revenue lost from pass buyers, low price", formula: "n_low * prior_low * day_price / 1000", expected: 12, unit: "$M" }
  - { id: lost_mid, label: "Day-ticket revenue lost from pass buyers, middle price", formula: "n_mid * prior_mid * day_price / 1000", expected: 7, unit: "$M" }
  - { id: lost_high, label: "Day-ticket revenue lost from pass buyers, high price", formula: "n_high * prior_high * day_price / 1000", expected: 4, unit: "$M" }
  - { id: ticket_net_low, label: "Ticket revenue change, low price", formula: "rev_low - lost_low", expected: -2, unit: "$M" }
  - { id: ticket_net_mid, label: "Ticket revenue change, middle price", formula: "rev_mid - lost_mid", expected: 0, unit: "$M" }
  - { id: ticket_net_high, label: "Ticket revenue change, high price", formula: "rev_high - lost_high", expected: -0.4, unit: "$M", tolerance: 0.01 }
  # --- Extra visits ---
  - { id: anc_low, label: "Extra on-mountain contribution from added visits, low price", formula: "n_low * (with_low - prior_low) * anc_margin / 1000", expected: 2.4, unit: "$M" }
  - { id: anc_mid, label: "Extra on-mountain contribution from added visits, middle price", formula: "n_mid * (with_mid - prior_mid) * anc_margin / 1000", expected: 1.6, unit: "$M" }
  - { id: anc_high, label: "Extra on-mountain contribution from added visits, high price", formula: "n_high * (with_high - prior_high) * anc_margin / 1000", expected: 0.64, unit: "$M" }
  - { id: net_low, label: "Net gain from the pass, low price", formula: "ticket_net_low + anc_low", expected: 0.4, unit: "$M" }
  - { id: net_mid, label: "Net gain from the pass, middle price", formula: "ticket_net_mid + anc_mid", expected: 1.6, unit: "$M" }
  - { id: net_high, label: "Net gain from the pass, high price", formula: "ticket_net_high + anc_high", expected: 0.24, unit: "$M" }
  - { id: mid_vs_low, label: "Advantage of the middle price over the low price", formula: "net_mid - net_low", expected: 1.2, unit: "$M" }
  # --- Cash before the season ---
  - { id: precash_share, label: "Pre-season pass cash as a share of today's day-ticket revenue", formula: "rev_mid / ticket_rev", expected: 0.2121, unit: "%", decimals: 0 }

answer:
  calc: net_mid
  headline: "Price the pass at {{p_mid}}: it adds about {{net_mid}} a season, versus {{net_low}} at {{p_low}} and {{net_high}} at {{p_high}}, and brings in {{rev_mid}} of cash before the first snowfall."

exhibits:
  - id: exhibit-1
    title: "Tamarack Ridge skiers by visits per season (day tickets only today)"
    kind: table
    ask: "Here is who skis at Tamarack Ridge today. What does it tell you about a season pass?"
    columns: ["Segment", "Skiers", "Average visits per season", "Day-ticket spend per skier"]
    rows:
      - ["Occasional (1–3 visits)", "{{occ_skiers}}", "{{occ_visits}}", "{{occ_spend}}"]
      - ["Regular (4–9 visits)", "{{reg_skiers}}", "{{reg_visits}}", "{{reg_spend}}"]
      - ["Frequent (10+ visits)", "{{freq_skiers}}", "{{freq_visits}}", "{{freq_spend}}"]
    note: "Illustrative data created for this practice case. Tamarack Ridge is fictional. Average price paid per day ticket: {{day_price}}."
    insight: |
      A frequent skier already spends {{freq_spend}} on day tickets, so any
      pass priced below that is a discount for them. The pass only earns new
      money from skiers who would otherwise have spent less than its price.
  - id: exhibit-2
    title: "Season-pass demand at three price points (resort survey)"
    kind: table
    ask: "The resort surveyed its skiers about three pass prices. Which price should it pick?"
    columns: ["Pass price", "Passes sold", "Buyers' day-ticket visits last season (average)", "Buyers' expected visits with a pass (average)"]
    rows:
      - ["{{p_low}}", "{{n_low}}", "{{prior_low}}", "{{with_low}}"]
      - ["{{p_mid}}", "{{n_mid}}", "{{prior_mid}}", "{{with_mid}}"]
      - ["{{p_high}}", "{{n_high}}", "{{prior_high}}", "{{with_high}}"]
    note: "Illustrative data created for this practice case. Buyers at each price include everyone who would also buy at a higher price. Contribution per visit from food, rentals, lessons and lodging: {{anc_margin}}."
    insight: |
      The lower the price, the more passes sell, but the extra buyers are
      skiers who visit less. Pass revenue alone points to {{p_low}}; once lost
      day tickets and extra visits are counted, {{p_mid}} wins.
---

## Prompt

Our client, Tamarack Ridge, is a mid-sized ski resort about two hours from Denver. Today it sells only day tickets. Larger resorts nearby sell season passes, and Tamarack Ridge's skiers keep asking for one.

The general manager likes the idea: pass money arrives in the spring and fall, before the resort knows whether it will be a good snow year. But the finance team worries that the best customers will simply stop buying day tickets. The general manager asks us: **should Tamarack Ridge sell a season pass, and at what price?**

## Clarifying information

- Q: What is the objective?
  A: Maximize the resort's profit per season. Steadier cash before the season is a welcome bonus, not the goal.
- Q: How much do skiers pay for a day ticket?
  A: About {{day_price}} on average after online and multi-day discounts.
- Q: Does it cost the resort anything to carry an extra skier?
  A: Almost nothing on the lifts: lifts, grooming and patrol are fixed costs. But every visit brings spending on food, rentals, lessons and lodging worth about **{{anc_margin}}** of contribution.
- Q: Who skis here?
  A: Exhibit 1 splits skiers by how often they come.
- Q: Do we know how many passes would sell?
  A: Yes, a survey tested three prices (Exhibit 2). Pass holders also said they would ski more often, because each extra day is "free".
- Q: Is there a capacity problem?
  A: Only on a handful of holiday Saturdays. Most days the mountain has plenty of room.
- Q: When is pass money paid?
  A: Passes go on sale in March for the next season and sales close in November, before the resort opens.

## Structure

> **Ask:** The candidate should set up the pass decision as a change in profit, not as pass revenue alone.

A pass changes three things, so compare each price on all three:

- **1. Pass revenue** = Passes sold × Pass price
- **2. Lost day tickets (cannibalization)** = Pass buyers × Visits they used to pay for × Day-ticket price
  - The more often a buyer used to ski, the more the pass gives away
- **3. Extra visits** = Pass buyers × Added visits × On-mountain contribution per visit
  - Food, rentals, lessons, lodging
- **Other effects:** cash before the season and protection in a bad snow year, crowding on peak days, loyalty against rival resorts

Hypothesis: *"The pass will lose money on frequent skiers, who pay more than the pass price today. It makes money only if it attracts enough skiers below the break-even number of visits and makes them come more often."*

## Math walkthrough

> **Ask:** The candidate should use Exhibit 1 to explain who gains from a pass, then compare the three prices in Exhibit 2 on net profit.

**1. Today (Exhibit 1).**
Day-ticket visits: 60k × 2 + 25k × 6 + 5k × 12 = **{{ticket_visits}}**, worth 330k × $100 = **{{ticket_rev}}** a season.
At {{p_mid}}, a pass pays off for any skier who skis more than $700 ÷ $100 = **{{be_visits}}** a season. A frequent skier spends {{freq_spend}} on day tickets, so for them a pass is a pure discount.

**2. Compare the three prices (Exhibit 2).**

| Pass price | {{p_low}} | {{p_mid}} | {{p_high}} |
|---|---|---|---|
| Pass revenue | {{rev_low}} | {{rev_mid}} | {{rev_high}} |
| Day tickets lost | −{{lost_low}} | −{{lost_mid}} | −{{lost_high}} |
| Extra on-mountain contribution | +{{anc_low}} | +{{anc_mid}} | +{{anc_high}} |
| **Net gain** | **{{net_low}}** | **{{net_mid}}** | **{{net_high}}** |

For example, at {{p_mid}}: pass revenue = 10k × $700 = {{rev_mid}}; day tickets lost = 10k × 7 × $100 = {{lost_mid}}; extra visits = 10k × (11 − 7) × $40 = {{anc_mid}}.

**3. Read the table.**
- On pass revenue alone, {{p_low}} looks best ({{rev_low}}). But its buyers used to spend more than that on day tickets, so ticket revenue changes by {{ticket_net_low}} before counting extra visits.
- At {{p_mid}}, pass revenue exactly replaces the lost day tickets (net {{ticket_net_mid}}), and the extra visits add {{anc_mid}}.
- At {{p_high}}, only the most frequent skiers buy, so the pass mostly discounts the resort's best customers.

{{p_mid}} beats {{p_low}} by **{{mid_vs_low}}** a season.

**4. Cash before the season.** At {{p_mid}}, **{{rev_mid}}** arrives before opening day, about {{precash_share}} of today's day-ticket revenue. In a poor snow year that money is already in the bank.

## Synthesis

> **Ask:** The candidate should give the general manager a clear recommendation.

**Tamarack Ridge should launch a season pass at {{p_mid}}: it adds about {{net_mid}} of profit a season, more than {{p_low}} ({{net_low}}) or {{p_high}} ({{net_high}}), and locks in {{rev_mid}} of cash before the season starts.**

1. **Cannibalization is real:** pass buyers already pay for many day tickets, so at {{p_low}} the resort gives away more ticket revenue than it gains from passes.
2. **The profit comes from extra visits:** at {{p_mid}} pass and ticket revenue roughly cancel out; the gain is the {{anc_mid}} of food, rental, lesson and lodging spending from the extra days.
3. **The pass also reduces weather risk:** about {{precash_share}} of a season's ticket revenue is collected before the snow falls.

**Risks and next steps:** survey answers about how often people will ski are often too optimistic, and the whole gain depends on those extra visits, so check the result if pass holders add only two visits instead of four. Black out the busiest holiday Saturdays or offer a cheaper pass without them, so pass holders do not crowd out full-price day skiers. Sell the pass early with a price that rises in the fall, and track renewals after the first season.

## Common mistakes

- Choosing {{p_low}} because it brings in the most pass revenue, without subtracting the day tickets the buyers stop paying for.
- Assuming every pass buyer is a new customer. Most are existing skiers who already pay for several days.
- Ignoring on-mountain spending. Without it, no pass price adds profit, and the candidate wrongly concludes the resort should not sell a pass at all.
- Treating extra skiers as costly. The lifts run anyway, so the marginal cost of a visit is close to zero.

## What top candidates do differently

- Compute the break-even number of visits ({{be_visits}} a season at {{p_mid}}) first and use it to explain who gains from a pass.
- Lay out all three prices in one table with pass revenue, lost tickets and extra visits, so the trade-off is obvious.
- Spot that the answer depends on the extra-visits assumption, and suggest testing it.
- Mention the cash and weather-risk benefit, which often matters as much to a resort's owners as the profit number.

## Creative question

Beyond a single season pass, what other ticket products could Tamarack Ridge offer to earn more from occasional and regular skiers?

## Model answer

Organize ideas by skier segment:

- **Occasional skiers:** a 3-day or 5-day pack bought in advance at a discount; a "learn to ski" bundle with rentals and a lesson; a midweek-only pass at a low price.
- **Regular skiers:** a pass with holiday blackout dates; a pass that includes discounts on food and rentals, which pulls more spending to the mountain.
- **Frequent skiers and families:** a family pass with a discount for each extra child; a premium pass with early lift access or free parking.
- **Partnerships:** a joint pass with a resort in another region; corporate passes for Denver employers.

A top candidate prioritizes: "A midweek pass is the strongest idea, because it fills the mountain on quiet days, when extra visits cost nothing, without discounting the busy weekends."
