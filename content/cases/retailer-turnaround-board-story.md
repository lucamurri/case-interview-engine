---
id: retailer-turnaround-board-story
title: "One Story for the Board: Why a Home-Goods Chain's Profit Halved"
client: "Hearthline Home (fictional), a US home-goods chain with 250 stores and a website"
summary: "Sales are flat and profit has halved at a home-goods chain. The team already has the findings; the job is to compute the numbers that matter, find the one storyline that explains them, and turn it into the board's recommendation."
industry: consumer-retail
sub_industry: "Specialty retail"
type: profitability
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  mall_stores:     { value: 150,  unit: "stores", label: "Mall stores" }
  off_stores:      { value: 100,  unit: "stores", label: "Off-mall stores (strip centers and main streets)" }
  mall_23:         { value: 600,  unit: "$M",     label: "Mall store sales, FY2023" }
  off_23:          { value: 400,  unit: "$M",     label: "Off-mall store sales, FY2023" }
  ecom_23:         { value: 200,  unit: "$M",     label: "E-commerce sales, FY2023" }
  ssg_mall:        { value: -0.20, unit: "%",     label: "Same-store sales change, mall stores, FY2023 to FY2025" }
  ssg_off:         { value: 0.05, unit: "%",      label: "Same-store sales change, off-mall stores, FY2023 to FY2025" }
  growth_ecom:     { value: 0.50, unit: "%",      label: "E-commerce sales growth, FY2023 to FY2025" }
  gm:              { value: 0.50, unit: "%",      label: "Gross margin, all channels (after returns)" }
  store_var:       { value: 0.05, unit: "%",      label: "Variable store costs (hourly staff, card fees), share of store sales" }
  ecom_fulfil:     { value: 0.20, unit: "%",      label: "Fulfillment and shipping, share of online sales" }
  ecom_mkt:        { value: 0.10, unit: "%",      label: "Digital marketing, share of online sales" }
  ret_23:          { value: 0.11, unit: "%",      label: "Online return rate, FY2023" }
  ret_25:          { value: 0.12, unit: "%",      label: "Online return rate, FY2025" }
  mall_fixed:      { value: 180,  unit: "$M",     label: "Mall store fixed costs (rent, base staff), both years" }
  off_fixed:       { value: 120,  unit: "$M",     label: "Off-mall store fixed costs, both years" }
  ecom_fixed_23:   { value: 20,   unit: "$M",     label: "E-commerce fixed costs (platform, team), FY2023" }
  ecom_fixed_25:   { value: 24,   unit: "$M",     label: "E-commerce fixed costs, FY2025" }
  ovh_23:          { value: 100,  unit: "$M",     label: "Corporate overhead, FY2023" }
  ovh_25:          { value: 106,  unit: "$M",     label: "Corporate overhead, FY2025" }
  fixed_per_mall:  { value: 1.2,  unit: "$M",     label: "Fixed cost per mall store", decimals: 1 }
  weak_stores:     { value: 50,   unit: "mall stores", label: "Weakest mall stores" }
  weak_sales:      { value: 2.0,  unit: "$M",     label: "Average sales of the weakest 50 mall stores, FY2025", decimals: 1 }
  strong_sales:    { value: 3.8,  unit: "$M",     label: "Average sales of the other 100 mall stores, FY2025", decimals: 1 }
  recapture:       { value: 0.20, unit: "%",      label: "Share of a closed store's sales that moves to the website" }
  closure_cost:    { value: 0.2,  unit: "$M",     label: "One-time cost to close a store at lease end (clearance, severance)", decimals: 1 }
  fulfil_new:      { value: 0.15, unit: "%",      label: "Fulfillment and shipping cost under the team's e-commerce plan" }

calculations:
  # --- Sales ---
  - { id: mall_25, label: "Mall store sales, FY2025", formula: "mall_23 * (1 + ssg_mall)", expected: 480, unit: "$M" }
  - { id: off_25, label: "Off-mall store sales, FY2025", formula: "off_23 * (1 + ssg_off)", expected: 420, unit: "$M" }
  - { id: ecom_25, label: "E-commerce sales, FY2025", formula: "ecom_23 * (1 + growth_ecom)", expected: 300, unit: "$M" }
  - { id: rev_23, label: "Total sales, FY2023", formula: "mall_23 + off_23 + ecom_23", expected: 1200, unit: "$M" }
  - { id: rev_25, label: "Total sales, FY2025", formula: "mall_25 + off_25 + ecom_25", expected: 1200, unit: "$M" }
  - { id: rev_b, label: "Total sales, both years", formula: "rev_25 / 1000", expected: 1.2, unit: "$B", decimals: 1 }
  - { id: ecom_share_25, label: "E-commerce share of sales, FY2025", formula: "ecom_25 / rev_25", expected: 0.25, unit: "%" }
  # --- Margins ---
  - { id: store_cm, label: "Store contribution margin (before fixed costs)", formula: "gm - store_var", expected: 0.45, unit: "%" }
  - { id: ecom_cm, label: "E-commerce contribution margin (before fixed costs)", formula: "gm - ecom_fulfil - ecom_mkt", expected: 0.20, unit: "%" }
  - { id: cm_gap, label: "Margin lost on each dollar of sales that moves from a store to the website", formula: "store_cm - ecom_cm", expected: 0.25, unit: "pts" }
  # --- Profit ---
  - { id: contrib_23, label: "Contribution, FY2023", formula: "(mall_23 + off_23) * store_cm + ecom_23 * ecom_cm", expected: 490, unit: "$M" }
  - { id: fixed_23, label: "Fixed costs, FY2023", formula: "mall_fixed + off_fixed + ecom_fixed_23 + ovh_23", expected: 420, unit: "$M" }
  - { id: profit_23, label: "Operating profit, FY2023", formula: "contrib_23 - fixed_23", expected: 70, unit: "$M" }
  - { id: contrib_25, label: "Contribution, FY2025", formula: "(mall_25 + off_25) * store_cm + ecom_25 * ecom_cm", expected: 465, unit: "$M" }
  - { id: fixed_25, label: "Fixed costs, FY2025", formula: "mall_fixed + off_fixed + ecom_fixed_25 + ovh_25", expected: 430, unit: "$M" }
  - { id: profit_25, label: "Operating profit, FY2025", formula: "contrib_25 - fixed_25", expected: 35, unit: "$M" }
  - { id: profit_drop, label: "Fall in operating profit", formula: "profit_23 - profit_25", expected: 35, unit: "$M" }
  - { id: margin_23, label: "Operating margin, FY2023", formula: "profit_23 / rev_23", expected: 0.0583, unit: "%", decimals: 1 }
  - { id: margin_25, label: "Operating margin, FY2025", formula: "profit_25 / rev_25", expected: 0.0292, unit: "%", decimals: 1 }
  # --- Profit bridge ---
  - { id: mall_eff, label: "Mall sales decline", formula: "(mall_25 - mall_23) * store_cm", expected: -54, unit: "$M" }
  - { id: off_eff, label: "Off-mall sales growth", formula: "(off_25 - off_23) * store_cm", expected: 9, unit: "$M" }
  - { id: ecom_eff, label: "E-commerce sales growth", formula: "(ecom_25 - ecom_23) * ecom_cm", expected: 20, unit: "$M" }
  - { id: ecom_fixed_eff, label: "Higher e-commerce fixed costs", formula: "ecom_fixed_23 - ecom_fixed_25", expected: -4, unit: "$M" }
  - { id: ovh_eff, label: "Higher corporate overhead", formula: "ovh_23 - ovh_25", expected: -6, unit: "$M" }
  - { id: bridge_total, label: "Bridge total (must equal the profit change)", formula: "mall_eff + off_eff + ecom_eff + ecom_fixed_eff + ovh_eff", expected: -35, unit: "$M" }
  - { id: mall_loss, label: "Profit lost to the mall decline", formula: "-mall_eff", expected: 54, unit: "$M" }
  - { id: mall_decline, label: "Fall in mall same-store sales", formula: "-ssg_mall", expected: 0.20, unit: "%" }
  - { id: ovh_rise, label: "Rise in corporate overhead", formula: "ovh_25 - ovh_23", expected: 6, unit: "$M" }
  - { id: mall_vs_drop, label: "Mall effect as a multiple of the whole profit fall", formula: "-mall_eff / profit_drop", expected: 1.54, unit: "x", decimals: 1 }
  - { id: ovh_share, label: "Overhead increase as a share of the profit fall", formula: "-ovh_eff / profit_drop", expected: 0.171, unit: "%", decimals: 0 }
  # --- Mall stores, store by store ---
  - { id: fw_mall_23, label: "Mall store profit after fixed store costs, FY2023", formula: "mall_23 * store_cm - mall_fixed", expected: 90, unit: "$M" }
  - { id: fw_mall_25, label: "Mall store profit after fixed store costs, FY2025", formula: "mall_25 * store_cm - mall_fixed", expected: 36, unit: "$M" }
  - { id: strong_stores, label: "Other mall stores", formula: "mall_stores - weak_stores", expected: 100, unit: "mall stores" }
  - { id: weak_rev, label: "Sales of the weakest 50 mall stores", formula: "weak_stores * weak_sales", expected: 100, unit: "$M" }
  - { id: weak_fw, label: "Profit after store costs, weakest 50 mall stores", formula: "weak_rev * store_cm - weak_stores * fixed_per_mall", expected: -15, unit: "$M" }
  - { id: weak_loss, label: "Annual loss of the weakest 50 mall stores", formula: "-weak_fw", expected: 15, unit: "$M" }
  - { id: strong_fw, label: "Profit after store costs, other 100 mall stores", formula: "strong_stores * strong_sales * store_cm - strong_stores * fixed_per_mall", expected: 51, unit: "$M" }
  - { id: ecom_cm_new, label: "E-commerce contribution margin under the team's plan", formula: "gm - fulfil_new - ecom_mkt", expected: 0.25, unit: "%" }
  - { id: close_all, label: "Profit change from closing all 150 mall stores (with the e-commerce plan)", formula: "-fw_mall_25 + mall_25 * recapture * ecom_cm_new", expected: -12, unit: "$M" }
  # --- The plan ---
  - { id: close_all_loss, label: "Profit lost by closing all mall stores", formula: "-close_all", expected: 12, unit: "$M" }
  - { id: margin_fix, label: "E-commerce plan alone", formula: "ecom_25 * (ecom_cm_new - ecom_cm)", expected: 15, unit: "$M" }
  - { id: close_weak_alone, label: "Closing the weakest 50 alone (today's online margin)", formula: "-weak_fw + weak_rev * recapture * ecom_cm", expected: 19, unit: "$M" }
  - { id: naive_sum, label: "The two levers added separately (the wrong way)", formula: "margin_fix + close_weak_alone", expected: 34, unit: "$M" }
  - { id: moved_online, label: "Sales that move online from the closed stores", formula: "weak_rev * recapture", expected: 20, unit: "$M" }
  - { id: ecom_contrib_new, label: "E-commerce contribution after both levers", formula: "(ecom_25 + moved_online) * ecom_cm_new", expected: 80, unit: "$M" }
  - { id: ecom_contrib_25, label: "E-commerce contribution, FY2025", formula: "ecom_25 * ecom_cm", expected: 60, unit: "$M" }
  - { id: plan_gain, label: "Profit gain from both levers together", formula: "-weak_fw + ecom_contrib_new - ecom_contrib_25", expected: 35, unit: "$M" }
  - { id: plan_profit, label: "Operating profit with the plan (run rate)", formula: "profit_25 + plan_gain", expected: 70, unit: "$M" }
  - { id: closure_total, label: "One-time cost of closing the weakest 50", formula: "weak_stores * closure_cost", expected: 10, unit: "$M" }
  - { id: profit_with_ovh, label: "Operating profit if overhead also returns to the FY2023 level", formula: "plan_profit - ovh_eff", expected: 76, unit: "$M" }
  # --- How robust is the plan? ---
  - { id: strong_rev, label: "Sales of the other 100 mall stores", formula: "strong_stores * strong_sales", expected: 380, unit: "$M" }
  - { id: sens_pt, label: "Profit lost for each further 1% fall in sales at the other 100 mall stores", formula: "strong_rev * 0.01 * store_cm", expected: 1.71, unit: "$M", decimals: 1 }
  - { id: cushion_pts, label: "Further fall in mall sales the overhead cushion covers", formula: "ovh_rise / sens_pt / 100", expected: 0.035, unit: "%", decimals: 1 }
  - { id: close_cost_rate, label: "Margin given up per dollar of sales when a mall store closes (after online recapture)", formula: "store_cm - recapture * ecom_cm_new", expected: 0.40, unit: "%" }
  - { id: breakeven_sales, label: "Sales below which a mall store is worth closing at lease end", formula: "fixed_per_mall / close_cost_rate", expected: 3.0, unit: "$M", decimals: 1 }

answer:
  calc: plan_gain
  headline: "Profit halved from {{profit_23}} to {{profit_25}} because mall sales fell from {{mall_23}} to {{mall_25}} against fixed store costs, and the online sales that replaced them earn {{cm_gap}} less margin per dollar. Close the {{weak_stores}} that lose money as their leases end and cut online fulfillment costs: together worth {{plan_gain}}, enough to get back to {{profit_23}} only if mall sales stop falling, so also close any mall store below {{breakeven_sales}} of sales at lease end."

exhibits:
  - id: exhibit-1
    title: "Hearthline sales by channel"
    kind: table
    ask: "Sales are flat over two years. Here is the split by channel. What do you see?"
    columns: ["Channel", "Stores", "FY2023 sales", "Change, FY2023 to FY2025"]
    rows:
      - ["Mall stores", "{{mall_stores}}", "{{mall_23}}", "{{ssg_mall}}"]
      - ["Off-mall stores", "{{off_stores}}", "{{off_23}}", "{{ssg_off}}"]
      - ["E-commerce", "—", "{{ecom_23}}", "{{growth_ecom}}"]
    note: "Illustrative data created for this practice case. Hearthline is fictional. No stores opened or closed in the period, so the store changes are same-store sales."
    insight: |
      The flat total hides two opposite stories. Mall sales fell to
      {{mall_25}} while e-commerce grew to {{ecom_25}}, now {{ecom_share_25}}
      of sales. Mall customers are not lost; many are buying online instead.
  - id: exhibit-2
    title: "Margin by channel (same in FY2023 and FY2025)"
    kind: table
    ask: "Here are margins by channel. Is a dollar online worth as much as a dollar in a store?"
    columns: ["Share of sales", "Stores", "E-commerce"]
    rows:
      - ["Gross margin (after returns)", "{{gm}}", "{{gm}}"]
      - ["Variable store costs (hourly staff, card fees)", "{{store_var}}", "—"]
      - ["Fulfillment and shipping", "—", "{{ecom_fulfil}}"]
      - ["Digital marketing", "—", "{{ecom_mkt}}"]
      - ["Online return rate, FY2023 → FY2025", "—", "{{ret_23}} → {{ret_25}}"]
    note: "Illustrative data created for this practice case. Gross margin is after the cost of returned goods, so the return rate is already reflected in it."
    insight: |
      The same sofa earns {{store_cm}} in a store but only {{ecom_cm}} online,
      before fixed costs. Every dollar that moves from a mall store to the
      website loses {{cm_gap}} of margin.
  - id: exhibit-3
    title: "Fixed costs and the mall fleet"
    kind: table
    ask: "Finally, the team has broken out fixed costs and the mall stores one by one. Does this change what you would tell the board?"
    columns: ["Item", "FY2023", "FY2025"]
    rows:
      - ["Mall store fixed costs (rent, base staff)", "{{mall_fixed}}", "{{mall_fixed}}"]
      - ["Off-mall store fixed costs", "{{off_fixed}}", "{{off_fixed}}"]
      - ["E-commerce fixed costs (platform, team)", "{{ecom_fixed_23}}", "{{ecom_fixed_25}}"]
      - ["Corporate overhead", "{{ovh_23}}", "{{ovh_25}}"]
      - ["Fixed cost per mall store", "{{fixed_per_mall}}", "{{fixed_per_mall}}"]
      - ["Average sales, weakest {{weak_stores}}", "—", "{{weak_sales}}"]
      - ["Average sales, other {{strong_stores}}", "—", "{{strong_sales}}"]
    note: "Illustrative data created for this practice case. All 50 of the weakest stores' leases end within the next three years; closing a store at lease end costs about {{closure_cost}} (clearance sales, severance). When Hearthline closed eight mall stores in 2024, about {{recapture}} of their sales moved to the website and almost none to other stores."
    insight: |
      Store fixed costs did not move while mall sales fell, so the whole
      sales loss hit profit. But most mall stores still earn money: the
      other {{strong_stores}} make {{strong_fw}} after store costs. The
      problem is concentrated in the weakest {{weak_stores}}.
---

## Prompt

Our client, Hearthline Home, sells furniture, bedding and kitchenware through 250 stores and a website. Over the last two years, sales have been flat at about {{rev_b}}, but operating profit has halved.

The team has spent three weeks on the analysis and has three exhibits of findings. The board meets next week, and the CEO asks us: **what is the one story that explains what happened, and what should we recommend to the board?** The board's goal is to get operating profit back to the FY2023 level within three years.

## Clarifying information

- Q: What is the objective?
  A: Return operating profit to the FY2023 level of {{profit_23}} within three years, and give the board one clear story it can act on.
- Q: Have prices or margins changed?
  A: No. Gross margin by channel has been stable. Differences in profit come from volume, channel mix and fixed costs.
- Q: Why is corporate overhead up?
  A: Mostly wage inflation and a new finance system. The CFO expects it to stay at about this level.
- Q: Are online customers new customers?
  A: Partly. Customer data shows that many online buyers used to shop in Hearthline's mall stores.
- Q: Can Hearthline close stores whenever it wants?
  A: Closing before a lease ends means paying the rest of the rent. Closing at lease end costs only clearance and severance.

## Structure

> **Ask:** Before you look at the details, how would you organize the story for the board?

Split profit by **channel**, because stores and the website have different margins, and separate **variable contribution** from **fixed costs**:

- **Profit = Store contribution + Online contribution − Fixed costs**
  - **Store contribution** = Sales by store type (mall, off-mall) × Store margin
  - **Online contribution** = Online sales × Online margin (after fulfillment and marketing)
  - **Fixed costs:** store rent and base staff, e-commerce platform, corporate overhead
- **Then build the storyline as a pyramid:** one governing answer, three supporting points with numbers, then the recommendation

Hypothesis: *"Flat sales with halved profit usually means a mix shift or fixed-cost deleverage. I suspect mall stores are losing traffic, part of it moving online at a lower margin, while store rents stay the same."*

## Math walkthrough

> **Ask:** Using all three exhibits, explain the change in profit with a bridge. Then, should Hearthline close its mall stores? Finally, the team's e-commerce plan (ship-from-store and a higher free-shipping threshold) would cut fulfillment and shipping from {{ecom_fulfil}} to {{fulfil_new}} of online sales, at no added fixed cost. What would closing the weakest mall stores and this plan do together, and how robust is the result if mall sales keep falling?

**1. Sales (Exhibit 1).**
Mall: $600M × (1 − 20%) = **{{mall_25}}**. Off-mall: $400M × 1.05 = **{{off_25}}**. E-commerce: $200M × 1.5 = **{{ecom_25}}**.
Total: {{rev_23}} in both years. E-commerce is now {{ecom_share_25}} of sales.

**2. Margins (Exhibit 2).**
Stores: 50% − 5% = **{{store_cm}}**. Online: 50% − 20% − 10% = **{{ecom_cm}}**. A dollar that moves online loses **{{cm_gap}}** of margin. The return rate is already in gross margin, so it is not a separate problem.

**3. Profit.**

| Item | FY2023 | FY2025 |
|---|---|---|
| Contribution | {{contrib_23}} | {{contrib_25}} |
| Fixed costs (Exhibit 3) | {{fixed_23}} | {{fixed_25}} |
| **Operating profit** | **{{profit_23}}** | **{{profit_25}}** |
| Operating margin | {{margin_23}} | {{margin_25}} |

**4. Bridge.**

| Driver | Calculation | Impact |
|---|---|---|
| Mall sales decline | ($480M − $600M) × 45% | {{mall_eff}} |
| Off-mall growth | ($420M − $400M) × 45% | +{{off_eff}} |
| E-commerce growth | ($300M − $200M) × 20% | +{{ecom_eff}} |
| E-commerce fixed costs | $20M − $24M | {{ecom_fixed_eff}} |
| Corporate overhead | $100M − $106M | {{ovh_eff}} |
| **Total** | | **{{bridge_total}}** |

The mall decline alone is **{{mall_vs_drop}}** the whole fall. E-commerce grew by half as much in sales as the malls lost, but at less than half the margin, so it replaced only {{ecom_eff}} of the {{mall_loss}} lost. Overhead is the biggest rise in the cost table, but explains only {{ovh_share}} of the fall.

**5. Should Hearthline close its mall stores? (Exhibit 3)**
Fixed store costs did not move, so mall stores went from {{fw_mall_23}} to **{{fw_mall_25}}** of profit after store costs.
Weakest 50: 50 × $2.0M = {{weak_rev}} of sales; $100M × 45% − 50 × $1.2M = **{{weak_fw}}**, a loss.
Other 100: 100 × $3.8M × 45% − 100 × $1.2M = **{{strong_fw}}**.
Closing all 150 would give up $36M and recover only $480M × 20% × 25% online: a change of **{{close_all}}**, even with the e-commerce plan. So the answer is not "close the malls"; it is "close the loss-makers".

**6. The plan, computed together.**
New online margin: 50% − 15% − 10% = **{{ecom_cm_new}}**.
Closing the weakest 50 removes a loss of $15M and moves $100M × 20% = **{{moved_online}}** of sales online.
Online contribution: ($300M + $20M) × 25% = **{{ecom_contrib_new}}**, against {{ecom_contrib_25}} today.
Total gain: $15M + ($80M − $60M) = **{{plan_gain}}**, which brings profit to **{{plan_profit}}**, exactly the FY2023 level.
Adding the two levers separately gives {{naive_sum}}, because it values the moved sales at today's lower online margin; the combined figure is the right one.
One-time closure costs: 50 × $0.2M = **{{closure_total}}**, not part of the run rate. Because leases end over three years, the full gain arrives in year three, just inside the board's deadline.

**7. How robust is it?**
The plan reaches {{profit_23}} on FY2025 sales, but mall sales fell {{mall_decline}} in the last two years. Each further 1% fall at the other 100 mall stores costs $380M × 1% × 45% = **{{sens_pt}}** a year.
Bringing overhead back to the FY2023 level would add {{ovh_rise}}, which covers only $6M ÷ $1.7M ≈ **{{cushion_pts}}** of further decline.
So the plan needs a rule, not just a list. Closing a mall store gives up 45% − 20% × 25% = **{{close_cost_rate}}** of margin on each dollar of its sales and saves $1.2M of fixed cost, so any mall store with sales below $1.2M ÷ 40% = **{{breakeven_sales}}** is worth closing when its lease ends. The weakest 50, at $2.0M, are well below it; the other 100 average $3.8M, but more of them will cross the line if the decline continues.

## Synthesis

> **Ask:** You have two minutes with the board. Give them the storyline and the recommendation.

**Hearthline's profit halved because its mall stores are losing customers to its own website: mall sales fell {{mall_decline}} against store costs that did not move, and the sales that moved online earn {{cm_gap}} less margin per dollar. Close the {{weak_stores}} that lose money as their leases end and cut online fulfillment costs; together these add {{plan_gain}} and return profit to {{profit_23}} on today's sales. Because mall sales are still falling, the board should also adopt a standing rule: close any mall store with sales below {{breakeven_sales}} when its lease ends.**

The board story as a pyramid, answer first:

| Level | Message | Evidence |
|---|---|---|
| Governing answer | Profit halved because the mall-to-online shift moves sales to a lower-margin channel while store costs stay fixed | {{profit_23}} → {{profit_25}} on flat sales of {{rev_b}} |
| Supporting point 1 | **Mall stores explain more than the whole fall** | Mall decline costs {{mall_loss}}, {{mall_vs_drop}} the total fall; off-mall stores grew |
| Supporting point 2 | **Online growth replaces sales, not profit** | Online earns {{ecom_cm}} against {{store_cm}} in stores; it added {{ecom_eff}} back |
| Supporting point 3 | **Most mall stores still earn money; 50 do not** | Other {{strong_stores}} earn {{strong_fw}}; weakest {{weak_stores}} lose {{weak_loss}}; closing all would cost {{close_all_loss}} |
| Recommendation | Close the weakest 50 at lease end, lower online fulfillment cost, and close any mall store below {{breakeven_sales}} of sales at lease end | {{plan_gain}} together, profit back to {{plan_profit}} on today's sales; {{closure_total}} one-time; each further 1% mall decline costs {{sens_pt}} |

1. **Mall stores explain the fall:** mall sales dropped from {{mall_23}} to {{mall_25}}, costing {{mall_loss}} of profit, more than the whole decline, because rent and base staff stayed at {{mall_fixed}}.
2. **The website is growing at a lower margin:** online sales rose {{growth_ecom}}, but each dollar earns {{ecom_cm}} against {{store_cm}} in stores, so growth put back only {{ecom_eff}}.
3. **The fix is targeted, not a retreat from malls:** the weakest {{weak_stores}} lose {{weak_loss}} a year while the other {{strong_stores}} earn {{strong_fw}}. Closing them at lease end and raising the online margin to {{ecom_cm_new}} adds {{plan_gain}}. Because each further 1% fall in mall sales costs {{sens_pt}}, the same test, sales below {{breakeven_sales}}, should apply to every mall store at lease end.

**What not to lead with:** corporate overhead rose {{ovh_rise}} and is the biggest jump in the cost table, but it explains only {{ovh_share}} of the fall. Cutting it is a cushion, not the story: if overhead returned to the FY2023 level, profit would reach {{profit_with_ovh}}, but that covers only about {{cushion_pts}} of further mall decline.

**Risks and next steps:** the plan only just meets the goal on today's sales, and the CFO expects overhead to stay where it is, so the board should ask management for a plan to bring it back to the FY2023 level as a cushion. The {{recapture}} recapture rate comes from just eight closures; test it on the first group of closures before committing to all 50. A higher free-shipping threshold may cost some online sales, and ship-from-store adds work for store staff, so the pilot should measure online sales and store labor as well as shipping cost. Next steps: rank the 50 stores by lease end date, pilot ship-from-store in two regions, and report the online margin to the board every quarter alongside online sales.

## Common mistakes

- Leading with corporate overhead because it is the largest increase in the cost table. It explains only {{ovh_share}} of the fall.
- Celebrating e-commerce growth without noticing it earns {{cm_gap}} less per dollar, or concluding the opposite, that e-commerce should be cut, when it still adds {{ecom_eff}}.
- Recommending closing all mall stores. Most still earn money, and closing all of them would cut profit by {{close_all_loss}}.
- Adding the two levers separately ({{naive_sum}}) instead of computing them together ({{plan_gain}}).
- Including the {{closure_total}} of one-time closure costs in the run-rate profit, or ignoring them altogether.
- Presenting the findings exhibit by exhibit instead of as one storyline with an answer first.

## What top candidates do differently

- State the governing answer in one sentence before showing any numbers, then support it with three points.
- Use the bridge to show that one driver, the mall decline, is larger than the whole fall.
- Name the distractor (overhead, return rate) and explain why it is not the story, instead of ignoring it.
- Change their first instinct after Exhibit 3, from "close the malls" to "close the loss-makers", and show the number that proves it.
- Say plainly that the plan meets the goal only on today's sales, size what each further 1% of mall decline costs, and turn the store finding into a rule (close below {{breakeven_sales}} at lease end) rather than a one-time list.

## Creative question

Apart from closing stores, how could Hearthline make its remaining mall stores earn more?

## Model answer

Organize ideas around **space, traffic and the website**:

- **Space:** shrink stores at lease renewal and keep only the best-selling categories; sublet unused space; renegotiate rent using the falling mall traffic as leverage.
- **Traffic:** in-store design services and events that bring people in; local delivery from the store; exclusive in-store ranges.
- **The website:** use stores as pickup and returns points, which cuts online shipping costs and brings online customers into the store, where they often buy more; let store staff sell from the website's full range.

A top candidate prioritizes: "Turn stores into pickup and returns points. It attacks both halves of the story at once: it lowers online fulfillment cost and brings traffic back into the mall stores."
