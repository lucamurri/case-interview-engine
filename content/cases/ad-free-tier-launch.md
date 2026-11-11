---
id: ad-free-tier-launch
title: "Skipping the Ads: Launching a Premium Ad-Free Tier"
client: "Lumen Stream (fictional), a US video streaming service with an ad-supported plan"
summary: "A streaming service plans an ad-free tier at a higher price. Weigh the extra subscription revenue and new subscribers against the ad revenue lost when its best-engaged viewers switch."
industry: media-sports
sub_industry: "Streaming media"
type: product-launch
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative: realistic in shape, not real company data.
inputs:
  ad_users:       { value: 10,     unit: "million", label: "Subscribers on the ad-supported plan" }
  sub_price:      { value: 7.99,   unit: "$", decimals: 2, label: "Ad-supported plan price per month" }
  ad_arpu:        { value: 5.00,   unit: "$", decimals: 2, label: "Average advertising revenue per ad-plan subscriber per month" }
  adfree_price:   { value: 13.99,  unit: "$", decimals: 2, label: "Proposed ad-free plan price per month" }
  migr_share:     { value: 0.06,   unit: "%", label: "Share of ad-plan subscribers expected to upgrade" }
  mig_ad_arpu:    { value: 10.00,  unit: "$", decimals: 2, label: "Advertising revenue per month from the subscribers who upgrade, before they upgrade" }
  new_subs:       { value: 0.4,    unit: "million", label: "New subscribers the ad-free plan attracts (people who would not otherwise subscribe)" }
  var_cost:       { value: 1.50,   unit: "$", decimals: 2, label: "Variable cost per subscriber per month (delivery, payment fees)" }
  mkt:            { value: 12,     unit: "$M", label: "Launch marketing and support per year" }
  migr_low:       { value: 0.04,   unit: "%", label: "Low case: share of ad-plan subscribers who upgrade" }
  migr_high:      { value: 0.10,   unit: "%", label: "High case: share of ad-plan subscribers who upgrade" }

calculations:
  # --- Tier economics per subscriber ---
  - { id: adtier_total, label: "Value of an average ad-plan subscriber per month", formula: "sub_price + ad_arpu", expected: 12.99, unit: "$", decimals: 2 }
  - { id: delta_price, label: "Extra subscription fee from upgrading", formula: "adfree_price - sub_price", expected: 6, unit: "$", decimals: 2 }
  - { id: other_arpu, label: "Advertising revenue per month of the subscribers who stay", formula: "(ad_arpu - migr_share * mig_ad_arpu) / (1 - migr_share)", expected: 4.6809, unit: "$", decimals: 2 }
  # --- Migrators ---
  - { id: migrators, label: "Subscribers who upgrade", formula: "ad_users * migr_share", expected: 0.6, unit: "million" }
  - { id: naive_per_mig, label: "Gain per upgrader using average ad revenue", formula: "delta_price - ad_arpu", expected: 1, unit: "$", decimals: 2 }
  - { id: naive_annual, label: "Annual gain from upgraders using average ad revenue", formula: "migrators * naive_per_mig * 12", expected: 7.2, unit: "$M", decimals: 1 }
  - { id: net_per_mig, label: "Gain or loss per upgrader using their own ad revenue", formula: "delta_price - mig_ad_arpu", expected: -4, unit: "$", decimals: 2 }
  - { id: loss_per_mig, label: "Loss per upgrader per month", formula: "mig_ad_arpu - delta_price", expected: 4, unit: "$", decimals: 2 }
  - { id: upgrade_rev, label: "Extra subscription revenue from upgraders per year", formula: "migrators * delta_price * 12", expected: 43.2, unit: "$M", decimals: 1 }
  - { id: lost_ad, label: "Advertising revenue lost from upgraders per year", formula: "migrators * mig_ad_arpu * 12", expected: 72, unit: "$M" }
  - { id: mig_annual, label: "Net annual effect of upgraders", formula: "upgrade_rev - lost_ad", expected: -28.8, unit: "$M", decimals: 1 }
  # --- New subscribers ---
  - { id: new_contrib_unit, label: "Contribution per new subscriber per month", formula: "adfree_price - var_cost", expected: 12.49, unit: "$", decimals: 2 }
  - { id: new_annual, label: "Annual contribution from new subscribers", formula: "new_subs * new_contrib_unit * 12", expected: 59.952, unit: "$M", decimals: 1 }
  # --- Net impact ---
  - { id: net_annual, label: "Net annual profit impact of the launch", formula: "new_annual + mig_annual - mkt", expected: 19.152, unit: "$M", decimals: 1 }
  - { id: be_new, label: "New subscribers needed to break even", formula: "(0 - mig_annual + mkt) / (new_contrib_unit * 12)", expected: 0.2722, unit: "million", decimals: 2 }
  - { id: be_new_pct, label: "Break-even new subscribers as a share of the forecast", formula: "be_new / new_subs", expected: 0.6805, unit: "%", decimals: 0 }
  - { id: max_migr, label: "Highest upgrade share before the launch loses money", formula: "(new_annual - mkt) / (ad_users * (0 - net_per_mig) * 12)", expected: 0.0999, unit: "%", decimals: 0 }
  - { id: net_low, label: "Net profit impact if the low share upgrades", formula: "new_annual + ad_users * migr_low * net_per_mig * 12 - mkt", expected: 28.752, unit: "$M", decimals: 1 }
  - { id: net_high, label: "Net profit impact if the high share upgrades", formula: "new_annual + ad_users * migr_high * net_per_mig * 12 - mkt", expected: -0.048, unit: "$M", decimals: 2 }

answer:
  calc: net_annual
  headline: "The ad-free tier adds {{net_annual}} a year, but only because new subscribers ({{new_annual}}) outweigh a {{mig_annual}} loss from upgraders. Each upgrader costs {{loss_per_mig}} a month because the ones who upgrade are the best-monetized."

exhibits:
  - id: exhibit-1
    title: "Revenue per subscriber per month, by plan"
    kind: table
    ask: "Here is revenue per subscriber on each plan. What would an upgrade be worth?"
    columns: ["Per month", "Ad plan (average subscriber)", "Ad-free plan"]
    rows:
      - ["Subscription fee", "{{sub_price}}", "{{adfree_price}}"]
      - ["Advertising revenue", "{{ad_arpu}}", "None"]
      - ["Total revenue", "{{adtier_total}}", "{{adfree_price}}"]
    note: "Illustrative data created for this practice case. Advertising revenue is the average across all ad-plan subscribers."
    insight: |
      On averages, an upgrader brings {{adfree_price}} instead of {{adtier_total}}: a gain of
      {{naive_per_mig}} a month. That looks harmless, but averages hide who actually upgrades.
  - id: exhibit-2
    title: "Advertising revenue per subscriber per month, by group"
    kind: bar
    unit: "$"
    decimals: 2
    ask: "The team surveyed who would upgrade. What does the chart tell you?"
    data:
      - { label: "Subscribers who stay on the ad plan", value: other_arpu }
      - { label: "All ad-plan subscribers", value: ad_arpu }
      - { label: "Subscribers likely to upgrade", value: mig_ad_arpu }
    reference: { value: delta_price, label: "Extra fee from upgrading" }
    note: "Illustrative data created for this practice case. Based on viewing hours: heavy viewers see more ads and earn more per month."
    insight: |
      Likely upgraders are heavy viewers who earn {{mig_ad_arpu}} a month in ads, above the
      {{delta_price}} extra fee. Each upgrader costs the service {{loss_per_mig}} a month.
  - id: exhibit-3
    title: "Annual profit impact by share of ad-plan subscribers who upgrade"
    kind: table
    ask: "Here is the launch under three upgrade rates, with new subscribers held at the forecast. What worries you?"
    columns: ["Scenario", "Share upgrading", "Net annual profit impact"]
    rows:
      - ["Low", "{{migr_low}}", "{{net_low}}"]
      - ["Base", "{{migr_share}}", "{{net_annual}}"]
      - ["High", "{{migr_high}}", "{{net_high}}"]
    note: "Illustrative data created for this practice case. New subscribers are {{new_subs}} in every row, and launch marketing is {{mkt}} a year."
    insight: |
      The launch only breaks even if fewer than about {{max_migr}} of ad-plan subscribers upgrade.
      The result also depends on {{new_subs}} truly new subscribers, since break-even needs {{be_new}}.
---

## Prompt

Our client is Lumen Stream, a US video streaming service. About {{ad_users}} subscribers pay {{sub_price}} a month for a cheaper plan that includes ads. Lumen earns advertising revenue on top of the fee.

Some viewers complain about the ads and say they would pay more to remove them. Management wants to launch an **ad-free premium plan at {{adfree_price}} a month**.

The chief executive asks us: **will the ad-free plan make Lumen more money, and how should we think about the risk?**

## Clarifying information

- Q: What does the new plan include?
  A: Same catalog and quality as the ad plan, with no ads. The price would be {{adfree_price}} a month.
- Q: Does Lumen already have an ad-free option?
  A: No. Today the choices are the ad plan or nothing.
- Q: How much does the ad plan earn per subscriber?
  A: {{sub_price}} in fees plus an average of {{ad_arpu}} a month in advertising revenue.
- Q: Who would upgrade?
  A: A survey suggests {{migr_share}} of ad-plan subscribers would upgrade. Ask for the details of who they are when you are ready.
- Q: Will the plan win new subscribers?
  A: The team expects about {{new_subs}} people who would not subscribe today to join at {{adfree_price}}.
- Q: What does a subscriber cost to serve?
  A: About {{var_cost}} a month in delivery and payment fees. The catalog cost is fixed and does not change.
- Q: Are there other costs?
  A: Launch marketing and support cost {{mkt}} a year.

## Structure

> **Ask:** How would you structure the analysis of this launch?

Profit impact = **effect on existing subscribers + effect of new subscribers − launch costs**.

- **1. Existing subscribers who upgrade**
  - How many upgrade
  - Extra fee they pay against the advertising revenue lost
  - Who they are: average or above-average viewers?
- **2. Existing subscribers who stay on the ad plan:** no change, unless advertisers pay less for a smaller audience
- **3. New subscribers**
  - How many truly new (not people who would have joined the ad plan)
  - Revenue less variable cost
- **4. Costs and timing:** launch marketing, ad-sales effects, any content cost
- **5. Risks:** ad inventory shrinks, price competition from rivals, subscribers moving down as well as up

A good hypothesis: *"The upgrade fee looks bigger than the ad revenue per user, so upgraders help. But upgraders are probably the heavy viewers whose ad revenue is above average, so that effect could be negative."*

## Math walkthrough

> **Ask:** Work out the net annual profit impact of the launch, then tell me how much room for error there is.

**1. The naive view.**
An average ad-plan subscriber is worth {{sub_price}} + {{ad_arpu}}, or {{adtier_total}}, against {{adfree_price}} on the ad-free plan. Each upgrade seems to add {{naive_per_mig}} a month, so {{migrators}} upgraders would add {{naive_annual}} a year. That is the trap.

**2. Upgraders are not average.**
The survey shows upgraders are heavy viewers who earn {{mig_ad_arpu}} a month in ads. Each upgrader pays {{delta_price}} more in fees but costs {{mig_ad_arpu}} in lost advertising, for a result of **{{net_per_mig}}** a month.
Annual effect: {{migrators}} × {{net_per_mig}} × 12. In pieces: extra fees {{upgrade_rev}} less lost advertising {{lost_ad}} is **{{mig_annual}}**.
(Subscribers who stay on the ad plan earn {{other_arpu}} a month in ads, so the average of {{ad_arpu}} was held up by the heavy viewers.)

**3. New subscribers.**
Each new subscriber contributes {{adfree_price}} less {{var_cost}}, or {{new_contrib_unit}} a month. For {{new_subs}} that is **{{new_annual}}** a year.

**4. Net impact.**
{{new_annual}} + ({{mig_annual}}) − {{mkt}} of launch cost gives **{{net_annual}}** a year.

**5. How much room for error?**
Break-even needs {{be_new}} new subscribers, or {{be_new_pct}} of the forecast.
Alternatively, break-even holds if no more than **{{max_migr}}** of ad-plan subscribers upgrade. At {{migr_low}} upgrading the launch earns {{net_low}}; at {{migr_high}} it earns {{net_high}}, essentially nothing.

## Synthesis

> **Ask:** What would you recommend to the chief executive?

**Launch the ad-free plan, but treat it as a bet on new subscribers: at {{adfree_price}} it adds {{net_annual}} a year, entirely because new subscribers ({{new_annual}}) outweigh a {{mig_annual}} loss from upgraders, and a modest rise in upgrades would erase the gain.**

1. **Average numbers mislead:** upgraders are Lumen's heaviest viewers, worth {{mig_ad_arpu}} a month in ads, so each upgrade costs {{loss_per_mig}} a month.
2. **New subscribers carry the case:** break-even needs {{be_new}} of the {{new_subs}} forecast. That is {{be_new_pct}}, and it is the most uncertain number.
3. **Little room for error:** if {{migr_high}} of ad-plan subscribers upgrade, profit is {{net_high}}.

**Risks and next steps:** test the price in one market and measure who upgrades and how many new subscribers join; consider a higher price (at least {{mig_ad_arpu}} more than the ad plan, which would cover the lost ad revenue per upgrader) or an ad-free plan that keeps some features back; watch whether advertisers pay less for a smaller, lighter-viewing audience; and set a review point after six months with stop rules based on upgrade share.

## Common mistakes

- Using average advertising revenue per user for upgraders, when upgraders are heavy viewers and earn more.
- Counting all {{new_subs}} new subscribers without asking how many would have joined the ad plan anyway.
- Forgetting variable cost and launch marketing, so the net looks bigger than it is.
- Treating the gain from new subscribers as certain, rather than testing break-even.

## What top candidates do differently

- Ask "who will upgrade?" before doing the math and hypothesize adverse selection.
- Compute break-even on both new subscribers and upgrade share.
- Check the price: what price would make upgrading neutral for Lumen?
- Think about advertisers' reaction and the effect on the ad business.

## Creative question

How could Lumen price or package the ad-free plan so fewer of its heavy ad-plan viewers simply trade down to it?

## Model answer

Group ideas by **price, product and audience**:

- **Price:** a higher price for ad-free, close to the ad revenue the heaviest viewers generate; a discounted annual plan to lock in new subscribers.
- **Product:** keep some live events or new releases with ads even on the premium plan; offer extra features (downloads, more streams) only to premium; a lighter-ad plan in the middle.
- **Audience:** market the ad-free plan to people who have never subscribed (students, households that cut streaming) rather than to current ad-plan users; target upgrade offers to light viewers.

A top candidate prioritizes: "A middle plan with fewer ads would let heavy viewers pay a bit more without costing Lumen the {{mig_ad_arpu}} a month in advertising, so I would test that against the plan as designed."
