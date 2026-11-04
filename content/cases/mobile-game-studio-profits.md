---
id: mobile-game-studio-profits
title: "Level Up, Profit Down: A Mobile Game Studio"
client: "Brambleleaf Games (fictional), an independent mobile puzzle-game studio"
summary: "A mobile game studio grew revenue fast by buying more ads, and went from profit to loss. Compare what each player costs with what they're worth."
industry: tech-ai
sub_industry: "Mobile gaming / consumer apps"
type: profitability
difficulty: beginner
format: candidate-led
time_minutes: 20

# All numbers are illustrative — realistic in shape, not real company or ad-market data.
inputs:
  organic:        { value: 2.0, unit: "million players", label: "New organic players per year (both years)" }
  ltv_organic:    { value: 3,   unit: "$/player",        label: "Lifetime value per organic player" }
  paid_23:        { value: 1.0, unit: "million players", label: "New paid players, FY2023 (all from social ads)" }
  cpi_23:         { value: 2,   unit: "$/install",       label: "Cost per install, FY2023" }
  ltv_paid_23:    { value: 3,   unit: "$/player",        label: "Lifetime value per paid player, FY2023" }
  fixed:          { value: 4,   unit: "$M",              label: "Studio fixed costs: team, servers, tools (both years)" }
  social_inst:    { value: 1.0, unit: "million players", label: "FY2025 installs from social ads" }
  social_cpi:     { value: 2,   unit: "$/install",       label: "Cost per install, social ads" }
  social_ltv:     { value: 3,   unit: "$/player",        label: "Lifetime value, social-ad players" }
  video_inst:     { value: 1.0, unit: "million players", label: "FY2025 installs from video ad networks" }
  video_cpi:      { value: 4,   unit: "$/install",       label: "Cost per install, video networks" }
  video_ltv:      { value: 3,   unit: "$/player",        label: "Lifetime value, video-network players" }
  offer_inst:     { value: 2.0, unit: "million players", label: "FY2025 installs from reward offerwalls" }
  offer_cpi:      { value: 5,   unit: "$/install",       label: "Cost per install, offerwalls" }
  offer_ltv:      { value: 2,   unit: "$/player",        label: "Lifetime value, offerwall players" }

calculations:
  # --- FY2023 ---
  - { id: rev_23, label: "Revenue, FY2023", formula: "organic * ltv_organic + paid_23 * ltv_paid_23", expected: 9, unit: "$M" }
  - { id: ua_23, label: "User-acquisition spend, FY2023", formula: "paid_23 * cpi_23", expected: 2, unit: "$M" }
  - { id: profit_23, label: "Profit, FY2023", formula: "rev_23 - ua_23 - fixed", expected: 3, unit: "$M" }
  # --- FY2025 ---
  - { id: organic_rev, label: "Revenue from organic players (both years)", formula: "organic * ltv_organic", expected: 6, unit: "$M" }
  - { id: paid_25, label: "New paid players, FY2025", formula: "social_inst + video_inst + offer_inst", expected: 4, unit: "million players" }
  - { id: paid_rev_25, label: "Revenue from paid players, FY2025", formula: "social_inst * social_ltv + video_inst * video_ltv + offer_inst * offer_ltv", expected: 10, unit: "$M" }
  - { id: rev_25, label: "Revenue, FY2025", formula: "organic * ltv_organic + paid_rev_25", expected: 16, unit: "$M" }
  - { id: ua_25, label: "User-acquisition spend, FY2025", formula: "social_inst * social_cpi + video_inst * video_cpi + offer_inst * offer_cpi", expected: 16, unit: "$M" }
  - { id: profit_25, label: "Profit, FY2025", formula: "rev_25 - ua_25 - fixed", expected: -4, unit: "$M" }
  - { id: loss_25, label: "Loss, FY2025", formula: "-profit_25", expected: 4, unit: "$M" }
  - { id: rev_growth, label: "Revenue growth, FY2023 to FY2025", formula: "rev_25 / rev_23 - 1", expected: 0.778, unit: "%", decimals: 0 }
  - { id: ua_multiple, label: "User-acquisition spend, FY2025 versus FY2023", formula: "ua_25 / ua_23", expected: 8, unit: "x" }
  # --- Unit economics: LTV vs CPI ---
  - { id: avg_cpi_25, label: "Average cost per install, FY2025", formula: "ua_25 / paid_25", expected: 4, unit: "$/install" }
  - { id: avg_ltv_25, label: "Average lifetime value per paid player, FY2025", formula: "paid_rev_25 / paid_25", expected: 2.5, unit: "$/player", decimals: 2 }
  - { id: ratio_23, label: "LTV ÷ CPI, FY2023", formula: "ltv_paid_23 / cpi_23", expected: 1.5, unit: "x", decimals: 1 }
  - { id: ratio_25, label: "LTV ÷ CPI, FY2025", formula: "avg_ltv_25 / avg_cpi_25", expected: 0.625, unit: "x", decimals: 2 }
  - { id: social_profit, label: "Profit from social-ad players", formula: "social_inst * (social_ltv - social_cpi)", expected: 1, unit: "$M" }
  - { id: video_profit, label: "Profit from video-network players", formula: "video_inst * (video_ltv - video_cpi)", expected: -1, unit: "$M" }
  - { id: offer_profit, label: "Profit from offerwall players", formula: "offer_inst * (offer_ltv - offer_cpi)", expected: -6, unit: "$M" }
  - { id: offer_loss, label: "Loss on offerwall players", formula: "-offer_profit", expected: 6, unit: "$M" }
  - { id: paid_profit_25, label: "Total profit from paid players, FY2025 (check)", formula: "social_profit + video_profit + offer_profit", expected: -6, unit: "$M" }
  - { id: ratio_social, label: "LTV ÷ CPI, social ads", formula: "social_ltv / social_cpi", expected: 1.5, unit: "x", decimals: 1 }
  - { id: ratio_video, label: "LTV ÷ CPI, video networks", formula: "video_ltv / video_cpi", expected: 0.75, unit: "x", decimals: 2 }
  - { id: ratio_offer, label: "LTV ÷ CPI, offerwalls", formula: "offer_ltv / offer_cpi", expected: 0.4, unit: "x", decimals: 1 }
  # --- Recommendation: keep only profitable channels ---
  - { id: new_rev, label: "Revenue keeping only social ads", formula: "organic * ltv_organic + social_inst * social_ltv", expected: 9, unit: "$M" }
  - { id: new_ua, label: "User-acquisition spend keeping only social ads", formula: "social_inst * social_cpi", expected: 2, unit: "$M" }
  - { id: new_profit, label: "Profit keeping only social ads", formula: "new_rev - new_ua - fixed", expected: 3, unit: "$M" }
  - { id: profit_swing, label: "Profit improvement versus FY2025", formula: "new_profit - profit_25", expected: 7, unit: "$M" }

answer:
  calc: profit_swing
  headline: "The studio is paying {{avg_cpi_25}} for players worth {{avg_ltv_25}}; cutting the video and offerwall channels restores a {{new_profit}} profit, a {{profit_swing}} improvement."

exhibits:
  - id: exhibit-1
    title: "Brambleleaf summary results"
    kind: table
    ask: "Here are the studio's headline numbers. What do you notice?"
    columns: ["", "FY2023", "FY2025"]
    rows:
      - ["New organic players (no ad spend)", "{{organic}}", "{{organic}}"]
      - ["New paid players (from ads)", "{{paid_23}}", "{{paid_25}}"]
      - ["Revenue", "{{rev_23}}", "{{rev_25}}"]
      - ["User-acquisition (ad) spend", "{{ua_23}}", "{{ua_25}}"]
      - ["Fixed costs", "{{fixed}}", "{{fixed}}"]
      - ["**Profit**", "**{{profit_23}}**", "**{{profit_25}}**"]
    note: "Illustrative data created for this practice case. Brambleleaf Games is fictional."
    insight: |
      Revenue grew {{rev_growth}}, but ad spend grew to {{ua_multiple}} its FY2023
      level. Every extra dollar of revenue cost more than a dollar of ads.
  - id: exhibit-2
    title: "FY2025 paid players by ad channel"
    kind: table
    ask: "Here is the ad spend broken down by channel. Which channels are worth it?"
    columns: ["Channel", "Installs", "Cost per install (CPI)", "Lifetime value per player (LTV)"]
    rows:
      - ["Social-media ads", "{{social_inst}}", "{{social_cpi}}", "{{social_ltv}}"]
      - ["Video ad networks", "{{video_inst}}", "{{video_cpi}}", "{{video_ltv}}"]
      - ["Reward offerwalls (players paid in rewards to install)", "{{offer_inst}}", "{{offer_cpi}}", "{{offer_ltv}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Only social ads bring players worth more than they cost. Offerwalls bring
      the most players and lose the most money: people installing for a reward
      rarely stick around or spend.
---

## Prompt

Our client, Brambleleaf Games, is an independent studio that makes one popular mobile puzzle game. The game is free to download and makes money from in-app purchases and ads.

Two years ago the studio raised money and began spending heavily on advertising to attract new players. Revenue has grown {{rev_growth}} since then, but the studio has gone from a healthy profit to a loss.

The founders have asked us: **why is Brambleleaf losing money while revenue grows, and what should it do?**

## Clarifying information

- Q: What is the goal?
  A: Get back to profit this year without shrinking the team.
- Q: How does the studio get new players?
  A: Some find the game on their own (organic players). The rest come from paid ads, where the studio pays a cost per install (CPI) each time someone downloads the game from an ad.
- Q: How do you measure what a player is worth?
  A: With lifetime value (LTV): the total revenue a player brings in over their time in the game, after app-store fees. For simplicity, assume each year's new players deliver their full LTV within that year.
- Q: Has the game itself changed?
  A: No major changes. Organic players and their LTV (about **{{ltv_organic}}**) are the same in both years.
- Q: Where did paid players come from in FY2023?
  A: All from social-media ads, at a CPI of about **{{cpi_23}}** and an LTV of about **{{ltv_paid_23}}**.
- Q: What are the fixed costs?
  A: About {{fixed}} a year for the team, servers and tools, unchanged.

## Structure

> **Ask:** The candidate should split players into organic and paid, and judge paid growth by comparing what a player is worth (LTV) with what they cost (CPI), channel by channel.

- **Profit = Revenue − Ad spend − Fixed costs**
  - **Organic players** × LTV (no acquisition cost)
  - **Paid players**, by ad channel
    - Installs × LTV (revenue)
    - Installs × CPI (ad spend)
    - Profit per paid player = LTV − CPI
  - **Fixed costs**: team, servers, tools

Hypothesis: *"The studio bought growth. As it spent more, it probably moved into more expensive channels that bring less valuable players, so newer paid players cost more than they're worth."*

## Math walkthrough

> **Ask:** The candidate should explain the swing from profit to loss and find which ad channels destroy value.

**1. FY2023 (Exhibit 1).**
Revenue = 2.0m × $3 + 1.0m × $3 = **{{rev_23}}**. Ad spend = 1.0m × $2 = **{{ua_23}}**.
Profit = $9M − $2M − $4M = **{{profit_23}}**.

**2. FY2025.**
Organic revenue is unchanged at 2.0m × $3 = {{organic_rev}}.
Paid revenue = 1.0m × $3 + 1.0m × $3 + 2.0m × $2 = **{{paid_rev_25}}**, so total revenue = $6M + $10M = **{{rev_25}}**.
Ad spend = 1.0m × $2 + 1.0m × $4 + 2.0m × $5 = **{{ua_25}}**.
Profit = $16M − $16M − $4M = **{{profit_25}}**.

**3. Unit economics.**
Average CPI = $16M ÷ 4.0m = **{{avg_cpi_25}}**; average LTV = $10M ÷ 4.0m = **{{avg_ltv_25}}**.
LTV ÷ CPI went from {{ratio_23}} in FY2023 to **{{ratio_25}}** in FY2025: the average paid player now loses money.

**4. By channel (Exhibit 2).**

| Channel | LTV ÷ CPI | Profit (installs × (LTV − CPI)) |
|---|---|---|
| Social ads | {{ratio_social}} | {{social_profit}} |
| Video networks | {{ratio_video}} | {{video_profit}} |
| Offerwalls | {{ratio_offer}} | {{offer_profit}} |
| **Total** | | **{{paid_profit_25}}** |

**5. Keep only social ads.**
Revenue = $6M + $3M = {{new_rev}}; ad spend = {{new_ua}}.
Profit = $9M − $2M − $4M = **{{new_profit}}**, an improvement of **{{profit_swing}}**, even though revenue falls back to {{new_rev}}.

## Synthesis

> **Ask:** The candidate should give the founders a clear answer and recommendation.

**Brambleleaf is losing money because it is buying players who are worth less than they cost: in FY2025 it paid {{avg_cpi_25}} for players worth {{avg_ltv_25}}. It should stop buying video and offerwall installs and keep only social ads, which turns a {{loss_25}} loss into a {{new_profit}} profit.**

1. **Growth was bought at a loss:** ad spend grew to {{ua_multiple}} its FY2023 level while revenue grew {{rev_growth}}.
2. **Offerwalls are the main problem:** they lose {{offer_loss}} a year, because players who install for a reward rarely spend.
3. **Social ads still work:** LTV ÷ CPI of {{ratio_social}}, the same as when the studio was profitable.

**Risks and next steps:** check LTV estimates as players age (LTV is a forecast); test whether cheaper video campaigns can get CPI below LTV before cutting them completely; invest some of the savings in features that raise LTV for all players (events, new levels); expect lower downloads to worry investors, so explain the switch from growth at any cost to profitable growth.

## Common mistakes

- Looking at revenue growth and calling the strategy a success.
- Using the average LTV and CPI only and recommending cutting all ads, which would also cut the profitable social channel.
- Comparing LTV with CPI without checking the timing: LTV arrives over months, while CPI is paid up front. (This case simplifies it away, but say it.)
- Forgetting organic players, who bring revenue at no acquisition cost.

## What top candidates do differently

- Introduce LTV versus CPI in the structure, before seeing any data.
- Break the averages down by channel, because averages hide the one channel that works.
- Note that revenue will fall under the recommendation and explain why that is fine.
- Mention a simple rule for the future: only buy installs in channels where LTV ÷ CPI is comfortably above 1.

## Creative question

How could Brambleleaf raise the lifetime value of its players so that more ad channels become profitable?

## Model answer

Think about the three things that make up LTV: **how long players stay, how often they pay, and how much they spend**.

- **Stay longer (retention):** a better first-day tutorial, daily challenges and streak rewards, regular new levels, seasonal events.
- **Pay more often (conversion):** a low-priced starter pack, a monthly subscription that removes ads and adds perks, well-timed offers when players get stuck.
- **Spend more (ads and purchases):** optional rewarded ads (watch an ad to get an extra life) for players who never buy; bundles for the biggest spenders.

A top candidate prioritizes: "Retention comes first, because every other lever depends on players still being in the game. A small improvement in how many players return after the first week raises LTV for every channel at once."
