---
id: payments-take-rate-cut
title: "Cutting the Take: When a Payments Price Cut Wins Share but Loses Money"
client: "Brightledger Payments (fictional), a US card-payment processor for online and in-store merchants"
summary: "A payment processor cut its fee to win merchants. Volume and market share rose, revenue fell. Was the cut a mistake, or was it aimed at the wrong merchants?"
industry: tech-ai
sub_industry: "Fintech / Payments"
type: pricing
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  rate_old:        { value: 0.025, unit: "%",          label: "Take rate before the cut (fee as a share of payment volume)", decimals: 1 }
  rate_new:        { value: 0.020, unit: "%",          label: "Take rate after the cut", decimals: 1 }
  var_cost:        { value: 0.010, unit: "%",          label: "Variable cost as a share of volume (card-network and issuer fees, fraud losses, processing), all merchants", decimals: 1 }
  tpv_before:      { value: 40,    unit: "$B",         label: "Payment volume, year before the cut" }
  tpv_after:       { value: 48,    unit: "$B",         label: "Payment volume, year after the cut" }
  market_tpv:      { value: 500,   unit: "$B",         label: "Card volume processed in Brightledger's markets (both years)" }
  merchants_before: { value: 52,   unit: "thousand merchants", label: "Active merchants, year before the cut" }
  merchants_after: { value: 54,    unit: "thousand merchants", label: "Active merchants, year after the cut" }
  small_before:    { value: 28,    unit: "$B",         label: "Volume from small and mid-sized merchants, before" }
  small_after:     { value: 28,    unit: "$B",         label: "Volume from small and mid-sized merchants, after" }
  large_before:    { value: 12,    unit: "$B",         label: "Volume from large merchants, before" }
  large_after:     { value: 20,    unit: "$B",         label: "Volume from large merchants, after" }
  churn_small_before: { value: 0.08, unit: "%",        label: "Annual churn of small merchants, before" }
  churn_small_after:  { value: 0.08, unit: "%",        label: "Annual churn of small merchants, after" }
  comp_a_small:    { value: 0.029, unit: "%",          label: "Competitor A rate for small merchants", decimals: 1 }
  comp_b_small:    { value: 0.027, unit: "%",          label: "Competitor B rate for small merchants", decimals: 1 }
  comp_a_large:    { value: 0.021, unit: "%",          label: "Competitor A rate for large merchants", decimals: 1 }
  comp_b_large:    { value: 0.019, unit: "%",          label: "Competitor B rate for large merchants", decimals: 1 }

calculations:
  # --- Headline results ---
  - { id: rev_before, label: "Revenue, before the cut", formula: "tpv_before * rate_old * 1000", expected: 1000, unit: "$M" }
  - { id: rev_after, label: "Revenue, after the cut", formula: "tpv_after * rate_new * 1000", expected: 960, unit: "$M" }
  - { id: rev_change, label: "Change in revenue", formula: "rev_after - rev_before", expected: -40, unit: "$M" }
  - { id: vol_growth, label: "Volume growth", formula: "tpv_after / tpv_before - 1", expected: 0.20, unit: "%" }
  - { id: share_before, label: "Market share, before", formula: "tpv_before / market_tpv", expected: 0.08, unit: "%", decimals: 1 }
  - { id: share_after, label: "Market share, after", formula: "tpv_after / market_tpv", expected: 0.096, unit: "%", decimals: 1 }
  # --- Break-even volume growth ---
  - { id: be_rev_growth, label: "Volume growth needed to keep revenue flat", formula: "rate_old / rate_new - 1", expected: 0.25, unit: "%" }
  - { id: margin_old, label: "Contribution per dollar of volume, before", formula: "rate_old - var_cost", expected: 0.015, unit: "%", decimals: 1 }
  - { id: margin_new, label: "Contribution per dollar of volume, after", formula: "rate_new - var_cost", expected: 0.010, unit: "%", decimals: 1 }
  - { id: be_profit_growth, label: "Volume growth needed to keep contribution flat", formula: "margin_old / margin_new - 1", expected: 0.50, unit: "%" }
  - { id: tpv_needed, label: "Volume needed to keep contribution flat", formula: "tpv_before * (1 + be_profit_growth)", expected: 60, unit: "$B" }
  - { id: contrib_before, label: "Contribution, before the cut", formula: "tpv_before * margin_old * 1000", expected: 600, unit: "$M" }
  - { id: contrib_after, label: "Contribution, after the cut", formula: "tpv_after * margin_new * 1000", expected: 480, unit: "$M" }
  - { id: contrib_drop, label: "Fall in contribution", formula: "contrib_before - contrib_after", expected: 120, unit: "$M" }
  # --- By merchant segment ---
  - { id: small_growth, label: "Volume growth, small and mid-sized merchants", formula: "small_after / small_before - 1", expected: 0, unit: "%" }
  - { id: large_growth, label: "Volume growth, large merchants", formula: "large_after / large_before - 1", expected: 0.6667, unit: "%", decimals: 0 }
  - { id: large_share_of_growth, label: "Large merchants' share of the volume growth", formula: "(large_after - large_before) / (tpv_after - tpv_before)", expected: 1, unit: "%" }
  - { id: small_effect, label: "Contribution change, small and mid-sized merchants", formula: "(small_after * margin_new - small_before * margin_old) * 1000", expected: -140, unit: "$M" }
  - { id: large_effect, label: "Contribution change, large merchants", formula: "(large_after * margin_new - large_before * margin_old) * 1000", expected: 20, unit: "$M" }
  - { id: small_giveaway, label: "Contribution given away to small and mid-sized merchants", formula: "-small_effect", expected: 140, unit: "$M" }
  - { id: bridge_total, label: "Bridge total (must equal the contribution change)", formula: "small_effect + large_effect", expected: -120, unit: "$M" }
  # --- Competitors ---
  - { id: comp_small_avg, label: "Average competitor rate, small merchants", formula: "(comp_a_small + comp_b_small) / 2", expected: 0.028, unit: "%", decimals: 1 }
  - { id: comp_large_avg, label: "Average competitor rate, large merchants", formula: "(comp_a_large + comp_b_large) / 2", expected: 0.020, unit: "%", decimals: 1 }
  - { id: small_headroom, label: "Gap between competitors' small-merchant rate and the old rate", formula: "comp_small_avg - rate_old", expected: 0.003, unit: "pts", decimals: 1 }
  # --- Tiered pricing ---
  - { id: tier_contrib, label: "Contribution with tiered pricing (small at the old rate, large at the new rate)", formula: "(small_after * margin_old + large_after * margin_new) * 1000", expected: 620, unit: "$M" }
  - { id: tier_vs_now, label: "Tiered pricing versus today", formula: "tier_contrib - contrib_after", expected: 140, unit: "$M" }
  - { id: tier_vs_before, label: "Tiered pricing versus before the cut", formula: "tier_contrib - contrib_before", expected: 20, unit: "$M" }
  - { id: small_1pct, label: "1% of small-merchant volume", formula: "small_after * 0.01 * 1000", expected: 280, unit: "$M" }
  - { id: churn_point_cost, label: "Contribution lost per 1% of small-merchant volume lost at the old rate", formula: "small_1pct * margin_old", expected: 4.2, unit: "$M", decimals: 1 }
  - { id: tier_rev, label: "Revenue with tiered pricing", formula: "(small_after * rate_old + large_after * rate_new) * 1000", expected: 1100, unit: "$M" }

answer:
  calc: tier_vs_now
  headline: "The cut needed {{be_profit_growth}} volume growth to pay off and got {{vol_growth}}, but all of it came from large merchants; restoring {{rate_old}} for small merchants while keeping {{rate_new}} for large ones adds {{tier_vs_now}} of contribution."

exhibits:
  - id: exhibit-1
    title: "Brightledger results before and after the price cut"
    kind: table
    ask: "Here are the headline results. Did the price cut work?"
    columns: ["", "Year before the cut", "Year after the cut"]
    rows:
      - ["Take rate", "{{rate_old}}", "{{rate_new}}"]
      - ["Payment volume", "{{tpv_before}}", "{{tpv_after}}"]
      - ["Revenue", "{{rev_before}}", "{{rev_after}}"]
      - ["Market share of card volume", "{{share_before}}", "{{share_after}}"]
      - ["Active merchants", "{{merchants_before}}", "{{merchants_after}}"]
      - ["Variable cost (share of volume)", "{{var_cost}}", "{{var_cost}}"]
    note: "Illustrative data created for this practice case. Brightledger is fictional. Revenue is the fee merchants pay; card-network and issuer fees are part of variable cost."
    insight: |
      Volume and share are up, revenue is down. Because {{var_cost}} of every
      dollar of volume already goes to variable cost, the cut removed a
      third of the contribution per dollar, so break-even volume growth is
      much higher for contribution than for revenue.
  - id: exhibit-2
    title: "Payment volume by merchant segment"
    kind: table
    ask: "Here is the volume split by merchant size. Does it change your view?"
    columns: ["Segment", "Volume before", "Volume after", "Growth"]
    rows:
      - ["Small and mid-sized merchants", "{{small_before}}", "{{small_after}}", "{{small_growth}}"]
      - ["Large merchants (over $100M a year each)", "{{large_before}}", "{{large_after}}", "{{large_growth}}"]
      - ["Total", "{{tpv_before}}", "{{tpv_after}}", "{{vol_growth}}"]
    note: "Illustrative data created for this practice case. Small-merchant churn was {{churn_small_before}} a year before the cut and {{churn_small_after}} after it."
    insight: |
      All the growth came from large merchants, who grew {{large_growth}},
      above the {{be_profit_growth}} break-even. Small merchants did not move
      at all: for them the cut was a pure giveaway.
  - id: exhibit-3
    title: "Competitors' standard rates by merchant segment"
    kind: table
    ask: "Here is what competitors charge. What pricing would you recommend?"
    columns: ["Processor", "Small and mid-sized merchants", "Large merchants"]
    rows:
      - ["Competitor A", "{{comp_a_small}}", "{{comp_a_large}}"]
      - ["Competitor B", "{{comp_b_small}}", "{{comp_b_large}}"]
      - ["Brightledger before the cut", "{{rate_old}}", "{{rate_old}}"]
      - ["Brightledger today", "{{rate_new}}", "{{rate_new}}"]
    note: "Illustrative data created for this practice case; not real processors' prices."
    insight: |
      Competitors already price by segment. Small merchants pay them about
      {{comp_small_avg}}, so Brightledger's old {{rate_old}} was already
      cheaper. Large merchants pay about {{comp_large_avg}}, which is why
      the cut won them.
---

## Prompt

Our client, Brightledger Payments, processes card payments for about fifty thousand US merchants, from coffee shops to national retailers. It earns a fee, called the **take rate**, on every dollar of payments it processes.

Eighteen months ago, under pressure from aggressive competitors, Brightledger cut its take rate for all merchants from {{rate_old}} to {{rate_new}}. The sales team points to record volume and a higher market share. The CFO points to lower revenue. The CEO asks us: **was the price cut a good decision, and what should Brightledger's pricing be now?**

## Clarifying information

- Q: What is the objective?
  A: Grow contribution (revenue minus variable cost). Market share is a means, not the goal.
- Q: What are Brightledger's variable costs?
  A: Card-network and issuer fees, fraud and chargeback losses, and processing, about **{{var_cost}}** of volume for all merchants. Fixed costs (engineering, sales, offices) did not change.
- Q: Did the cut apply to everyone?
  A: Yes, one rate for every merchant, new and existing.
- Q: How do merchants choose a processor?
  A: Large merchants run formal tenders and switch for a few basis points. Small merchants choose on ease of setup and support, and rarely switch once their point-of-sale systems and website are connected.
- Q: Did the market grow?
  A: Card volume in Brightledger's markets was roughly flat at {{market_tpv}}.

## Structure

> **Ask:** How would you assess whether the price cut worked?

Judge the cut on **contribution**, not volume or revenue, and then look inside the average:

- **1. Did volume grow enough?**
  - Break-even volume growth for revenue and for contribution
  - Actual growth versus break-even
- **2. Where did the volume come from?**
  - By merchant segment: small and mid-sized versus large
  - New merchants won versus more volume from existing ones
- **3. Who actually needed a lower price?**
  - Price sensitivity by segment: switching behavior, churn
  - Competitors' rates by segment
- **4. What pricing now?**
  - Back to one rate, stay at one rate, or tiered pricing by segment
  - Risks: merchant reaction, competitor response

Hypothesis: *"A uniform price cut usually gives a discount to customers who would have stayed anyway. I expect the volume came from one price-sensitive segment, and the rest of the base just paid less."*

## Math walkthrough

> **Ask:** First, using Exhibit 1, how much volume growth did the cut need to break even, and did it get there? Then use Exhibit 2 and Exhibit 3 to test your conclusion.

**1. Headline results (Exhibit 1).**
Revenue: $40B × 2.5% = **{{rev_before}}** before, $48B × 2.0% = **{{rev_after}}** after, a change of **{{rev_change}}**. Volume grew **{{vol_growth}}** and share rose from {{share_before}} to {{share_after}}. (Merchant count and share are a distraction here: the question is contribution.)

**2. Break-even volume growth.**
- For revenue: 2.5% ÷ 2.0% − 1 = **{{be_rev_growth}}**.
- For contribution: Brightledger kept 2.5% − 1.0% = {{margin_old}} of volume before and 2.0% − 1.0% = {{margin_new}} after, so volume must grow 1.5% ÷ 1.0% − 1 = **{{be_profit_growth}}**, to {{tpv_needed}}.

Volume grew only {{vol_growth}}. Contribution fell from {{contrib_before}} to {{contrib_after}}, down **{{contrib_drop}}**.

*First answer:* the cut did not pay for itself. The obvious recommendation is to reverse it.

> **Ask:** Here is the split by merchant segment (Exhibit 2). Does it change your view?

**3. By segment (Exhibit 2).**

| Segment | Growth | Contribution before | Contribution after | Change |
|---|---|---|---|---|
| Small and mid-sized | {{small_growth}} | $28B × 1.5% | $28B × 1.0% | {{small_effect}} |
| Large | {{large_growth}} | $12B × 1.5% | $20B × 1.0% | +{{large_effect}} |
| **Total** | {{vol_growth}} | | | **{{bridge_total}}** |

Large merchants account for **{{large_share_of_growth}}** of the growth and grew {{large_growth}}, above the {{be_profit_growth}} break-even: in that segment the cut **paid off**, even though it now keeps only {{margin_new}} of volume. Small merchants did not grow at all and their churn did not change: the cut handed them **{{small_giveaway}}** of contribution for nothing.

So the cut was not wrong; it was aimed at everyone when only one segment needed it.

**4. Competitors (Exhibit 3).** Competitors charge small merchants about {{comp_small_avg}}, {{small_headroom}} above Brightledger's old rate, and large merchants about {{comp_large_avg}}, the same as Brightledger today. Going back to {{rate_old}} for large merchants would likely lose the volume just won.

**5. Tiered pricing.** Small and mid-sized merchants back at {{rate_old}}, large merchants at {{rate_new}}:
$28B × 1.5% + $20B × 1.0% = **{{tier_contrib}}** of contribution, **{{tier_vs_now}}** above today and {{tier_vs_before}} above the level before the cut. Revenue would be {{tier_rev}}.

## Synthesis

> **Ask:** What do you tell the CEO?

**The cut was right for large merchants and wrong for everyone else. Brightledger should move to tiered pricing, {{rate_old}} for small and mid-sized merchants and {{rate_new}} for large ones, which raises contribution to {{tier_contrib}}, {{tier_vs_now}} more than today and above the level before the cut.**

1. **On average the cut failed:** it needed {{be_profit_growth}} volume growth to keep contribution flat and got {{vol_growth}}, so contribution fell {{contrib_drop}}.
2. **The average hides two very different segments:** large merchants grew {{large_growth}}, enough to pay for their lower rate; small merchants did not respond at all, and the discount gave away {{small_giveaway}} on them.
3. **Tiering matches the market:** competitors already charge small merchants about {{comp_small_avg}} and large merchants about {{comp_large_avg}}, so each Brightledger rate stays competitive.

**Risks and next steps:** raising rates on fifty thousand small merchants will cause complaints and some churn, so phase it in over two billing cycles, give notice, and pair it with better support or faster payouts; each 1% of small-merchant volume lost (about {{small_1pct}}) costs about {{churn_point_cost}} of contribution, so the plan survives a lot of it. Large merchants earn a thinner margin per dollar, so set a floor rate in every tender and track fraud losses by segment. Watch whether competitors respond with their own small-merchant discounts.

## Common mistakes

- Celebrating volume and share growth without checking contribution.
- Computing break-even growth on revenue ({{be_rev_growth}}) instead of contribution ({{be_profit_growth}}): variable cost makes the bar twice as high.
- Recommending a full reversal from Exhibit 1 alone, which would give back the large-merchant volume the cut won.
- Assuming all merchants are equally price-sensitive, or using merchant count rather than volume to judge the segments.

## What top candidates do differently

- Express the decision as a break-even volume growth before looking at the results, so the verdict is immediate.
- Ask for a segment split as soon as the average looks bad, and expect the uniform cut to have subsidized price-insensitive customers.
- Change their answer when the evidence changes, and say so explicitly.
- Check that the new tiered prices are still competitive against Exhibit 3 before recommending them.

## Creative question

Other than price, how could Brightledger make small merchants less likely to leave when their rate goes back up?

## Model answer

Organize ideas around what small merchants value: getting paid, running their business, and getting help.

- **Getting paid:** next-day or same-day payouts; instant access to the day's sales for a small fee.
- **Running the business:** free tools such as invoicing, inventory, online ordering and simple sales reports; small loans repaid from future card sales.
- **Getting help:** a named support contact or 24/7 phone support; free setup of card readers and online checkout.
- **Communication:** explain the change in plain language, show how the rate still compares with competitors, and lock in the rate for two years for merchants who sign up for the new tools.

A top candidate prioritizes: "Faster payouts are the strongest lever. For a small business, cash flow matters more than a quarter-point on fees, and it is cheap for Brightledger to offer."
