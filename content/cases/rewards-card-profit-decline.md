---
id: rewards-card-profit-decline
title: "Points That Cost Too Much: A Premium Rewards Card Losing Profit"
client: "Harbor & Pine Bank (fictional), a US bank with a premium rewards credit card"
summary: "A bank's premium rewards card added cardholders and spend, yet profit fell. Split profit per cardholder into revolvers and transactors to find out who the growth really brought in, then choose a fix."
industry: other
sub_industry: "Financial services / Credit cards"
type: profitability
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real bank or market data.
inputs:
  rev_n:          { value: 600000, unit: "revolvers",   label: "Revolvers (carry a balance), FY2023 and FY2025" }
  tr_n_23:        { value: 400000, unit: "transactors", label: "Transactors (pay in full each month), FY2023" }
  tr_n_25:        { value: 800000, unit: "transactors", label: "Transactors, FY2025" }
  interchange:    { value: 0.02,   unit: "%",           label: "Interchange the bank earns on card spend" }
  rev_spend:      { value: 10000,  unit: "$",           label: "Annual card spend per revolver" }
  tr_spend:       { value: 30000,  unit: "$",           label: "Annual card spend per transactor" }
  rev_reward:     { value: 0.015,  unit: "%",           label: "Effective rewards rate, revolvers" }
  tr_reward:      { value: 0.025,  unit: "%",           label: "Effective rewards rate, transactors" }
  balance:        { value: 4000,   unit: "$",           label: "Average revolving balance per revolver" }
  nim:            { value: 0.15,   unit: "%",           label: "Net interest yield on revolving balances (interest charged minus funding cost)" }
  loss_rate:      { value: 0.05,   unit: "%",           label: "Credit losses per year, share of revolving balances" }
  fee:            { value: 250,    unit: "$",           label: "Annual fee" }
  servicing:      { value: 200,    unit: "$",           label: "Servicing and benefits cost per cardholder per year" }
  tr_reward_a:    { value: 0.02,   unit: "%",           label: "Option A: transactors' effective rewards rate after trimming bonus categories" }
  a_cancel:       { value: 0.25,   unit: "%",           label: "Option A: share of transactors expected to cancel" }
  fee_b:          { value: 350,    unit: "$",           label: "Option B: new annual fee" }
  b_cancel_rev:   { value: 0.20,   unit: "%",           label: "Option B: share of revolvers expected to cancel" }
  b_cancel_tr:    { value: 0.15,   unit: "%",           label: "Option B: share of transactors expected to cancel" }
  c_new:          { value: 100000, unit: "new revolvers", label: "Option C: revolvers won by a targeted campaign" }
  c_acq:          { value: 300,    unit: "$",           label: "Option C: one-time acquisition cost per new account" }
  c_loss_rate:    { value: 0.075,  unit: "%",           label: "Option C: credit losses on new revolvers, share of balances", decimals: 1 }

calculations:
  # --- Totals (Exhibit 1) ---
  - { id: ch_23, label: "Cardholders, FY2023", formula: "(rev_n + tr_n_23) / 1e6", expected: 1.0, unit: "million", decimals: 1 }
  - { id: ch_25, label: "Cardholders, FY2025", formula: "(rev_n + tr_n_25) / 1e6", expected: 1.4, unit: "million", decimals: 1 }
  - { id: spend_23, label: "Card spend, FY2023", formula: "(rev_n * rev_spend + tr_n_23 * tr_spend) / 1e9", expected: 18, unit: "$B" }
  - { id: spend_25, label: "Card spend, FY2025", formula: "(rev_n * rev_spend + tr_n_25 * tr_spend) / 1e9", expected: 30, unit: "$B" }
  - { id: spend_growth, label: "Growth in card spend", formula: "spend_25 / spend_23 - 1", expected: 0.667, unit: "%", decimals: 0 }
  - { id: ich_23, label: "Interchange income, FY2023", formula: "spend_23 * 1000 * interchange", expected: 360, unit: "$M" }
  - { id: ich_25, label: "Interchange income, FY2025", formula: "spend_25 * 1000 * interchange", expected: 600, unit: "$M" }
  - { id: int_inc, label: "Net interest income, both years", formula: "rev_n * balance * nim / 1e6", expected: 360, unit: "$M" }
  - { id: fees_23, label: "Annual fee income, FY2023", formula: "ch_23 * fee", expected: 250, unit: "$M" }
  - { id: fees_25, label: "Annual fee income, FY2025", formula: "ch_25 * fee", expected: 350, unit: "$M" }
  - { id: rwd_23, label: "Rewards cost, FY2023", formula: "(rev_n * rev_spend * rev_reward + tr_n_23 * tr_spend * tr_reward) / 1e6", expected: 390, unit: "$M" }
  - { id: rwd_25, label: "Rewards cost, FY2025", formula: "(rev_n * rev_spend * rev_reward + tr_n_25 * tr_spend * tr_reward) / 1e6", expected: 690, unit: "$M" }
  - { id: losses, label: "Credit losses, both years", formula: "rev_n * balance * loss_rate / 1e6", expected: 120, unit: "$M" }
  - { id: serv_23, label: "Servicing cost, FY2023", formula: "ch_23 * servicing", expected: 200, unit: "$M" }
  - { id: serv_25, label: "Servicing cost, FY2025", formula: "ch_25 * servicing", expected: 280, unit: "$M" }
  - { id: revenue_23, label: "Revenue, FY2023", formula: "ich_23 + int_inc + fees_23", expected: 970, unit: "$M" }
  - { id: revenue_25, label: "Revenue, FY2025", formula: "ich_25 + int_inc + fees_25", expected: 1310, unit: "$M" }
  - { id: rev_growth, label: "Revenue growth", formula: "revenue_25 / revenue_23 - 1", expected: 0.351, unit: "%", decimals: 0 }
  - { id: cost_23, label: "Costs, FY2023", formula: "rwd_23 + losses + serv_23", expected: 710, unit: "$M" }
  - { id: cost_25, label: "Costs, FY2025", formula: "rwd_25 + losses + serv_25", expected: 1090, unit: "$M" }
  - { id: profit_23, label: "Card profit, FY2023", formula: "revenue_23 - cost_23", expected: 260, unit: "$M" }
  - { id: profit_25, label: "Card profit, FY2025", formula: "revenue_25 - cost_25", expected: 220, unit: "$M" }
  - { id: profit_drop, label: "Fall in card profit", formula: "profit_23 - profit_25", expected: 40, unit: "$M" }
  - { id: rwd_increase, label: "Increase in rewards cost", formula: "rwd_25 - rwd_23", expected: 300, unit: "$M" }
  - { id: ich_increase, label: "Increase in interchange income", formula: "ich_25 - ich_23", expected: 240, unit: "$M" }
  # --- Profit per cardholder (Exhibit 2) ---
  - { id: rev_ich, label: "Interchange per revolver", formula: "rev_spend * interchange", expected: 200, unit: "$" }
  - { id: rev_int, label: "Net interest per revolver", formula: "balance * nim", expected: 600, unit: "$" }
  - { id: rev_rwd, label: "Rewards per revolver", formula: "rev_spend * rev_reward", expected: 150, unit: "$" }
  - { id: rev_loss, label: "Credit losses per revolver", formula: "balance * loss_rate", expected: 200, unit: "$" }
  - { id: rev_profit, label: "Profit per revolver", formula: "rev_ich + rev_int + fee - rev_rwd - rev_loss - servicing", expected: 500, unit: "$" }
  - { id: tr_ich, label: "Interchange per transactor", formula: "tr_spend * interchange", expected: 600, unit: "$" }
  - { id: tr_rwd, label: "Rewards per transactor", formula: "tr_spend * tr_reward", expected: 750, unit: "$" }
  - { id: tr_profit, label: "Profit per transactor", formula: "tr_ich + fee - tr_rwd - servicing", expected: -100, unit: "$" }
  - { id: tr_loss, label: "Loss per transactor", formula: "-tr_profit", expected: 100, unit: "$" }
  - { id: tr_rwd_ratio, label: "Transactors' rewards as a multiple of their interchange", formula: "tr_rwd / tr_ich", expected: 1.25, unit: "x" }
  - { id: rev_seg, label: "Profit from revolvers", formula: "rev_n * rev_profit / 1e6", expected: 300, unit: "$M" }
  - { id: tr_seg_23, label: "Loss from transactors, FY2023", formula: "-tr_n_23 * tr_profit / 1e6", expected: 40, unit: "$M" }
  - { id: tr_seg_25, label: "Loss from transactors, FY2025", formula: "-tr_n_25 * tr_profit / 1e6", expected: 80, unit: "$M" }
  - { id: new_tr, label: "Transactors added since FY2023", formula: "tr_n_25 - tr_n_23", expected: 400000, unit: "transactors" }
  - { id: new_tr_effect, label: "Profit effect of the added transactors", formula: "new_tr * tr_profit / 1e6", expected: -40, unit: "$M" }
  # --- Option A: trim bonus categories ---
  - { id: tr_profit_a, label: "Option A: profit per transactor", formula: "tr_spend * (interchange - tr_reward_a) + fee - servicing", expected: 50, unit: "$" }
  - { id: tr_left_a, label: "Option A: transactors who stay", formula: "tr_n_25 * (1 - a_cancel)", expected: 600000, unit: "transactors" }
  - { id: tr_seg_a, label: "Option A: profit from transactors", formula: "tr_left_a * tr_profit_a / 1e6", expected: 30, unit: "$M" }
  - { id: profit_a, label: "Option A: card profit", formula: "rev_seg + tr_left_a * tr_profit_a / 1e6", expected: 330, unit: "$M" }
  - { id: gain_a, label: "Option A: profit gain", formula: "profit_a - profit_25", expected: 110, unit: "$M" }
  # --- Option B: raise the fee ---
  - { id: rev_profit_b, label: "Option B: profit per revolver", formula: "rev_profit + fee_b - fee", expected: 600, unit: "$" }
  - { id: tr_profit_b, label: "Option B: profit per transactor", formula: "tr_profit + fee_b - fee", expected: 0, unit: "$" }
  - { id: rev_seg_b, label: "Option B: profit from revolvers", formula: "rev_n * (1 - b_cancel_rev) * rev_profit_b / 1e6", expected: 288, unit: "$M" }
  - { id: profit_b, label: "Option B: card profit", formula: "rev_seg_b + tr_n_25 * (1 - b_cancel_tr) * tr_profit_b / 1e6", expected: 288, unit: "$M" }
  - { id: gain_b, label: "Option B: profit gain", formula: "profit_b - profit_25", expected: 68, unit: "$M" }
  - { id: rev_hit_b, label: "Option B: fall in profit from revolvers", formula: "rev_seg - rev_seg_b", expected: 12, unit: "$M" }
  # --- Option C: target revolvers ---
  - { id: c_profit_per, label: "Option C: profit per new revolver per year", formula: "rev_profit - balance * (c_loss_rate - loss_rate)", expected: 400, unit: "$" }
  - { id: c_annual, label: "Option C: profit per year from new revolvers", formula: "c_new * c_profit_per / 1e6", expected: 40, unit: "$M" }
  - { id: c_acq_total, label: "Option C: one-time acquisition cost", formula: "c_new * c_acq / 1e6", expected: 30, unit: "$M" }
  - { id: profit_c_y1, label: "Option C: card profit in the first year", formula: "profit_25 + c_annual - c_acq_total", expected: 230, unit: "$M" }
  - { id: profit_c_later, label: "Option C: card profit from the second year", formula: "profit_25 + c_annual", expected: 260, unit: "$M" }
  # --- Robustness of Option A ---
  - { id: worst_a, label: "Option A: card profit even if every transactor cancels", formula: "rev_seg", expected: 300, unit: "$M" }

answer:
  calc: gain_a
  headline: "Profit fell {{profit_drop}} because all of the growth came from transactors, who each cost the bank {{tr_loss}} a year; trimming their bonus categories (Option A) lifts profit to about {{profit_a}}, well above FY2023."

exhibits:
  - id: exhibit-1
    title: "Summit Rewards card results"
    kind: table
    ask: "Here are the card's results for FY2023 and FY2025. What happened?"
    columns: ["Item", "FY2023", "FY2025"]
    rows:
      - ["Cardholders", "{{ch_23}}", "{{ch_25}}"]
      - ["Card spend", "{{spend_23}}", "{{spend_25}}"]
      - ["Interchange income", "{{ich_23}}", "{{ich_25}}"]
      - ["Net interest income", "{{int_inc}}", "{{int_inc}}"]
      - ["Annual fee income", "{{fees_23}}", "{{fees_25}}"]
      - ["Rewards cost", "{{rwd_23}}", "{{rwd_25}}"]
      - ["Credit losses", "{{losses}}", "{{losses}}"]
      - ["Servicing and benefits cost", "{{serv_23}}", "{{serv_25}}"]
    note: "Illustrative data created for this practice case. Harbor & Pine and the Summit Rewards card are fictional."
    insight: |
      Revenue grew {{rev_growth}}, but rewards cost rose {{rwd_increase}}
      while interchange rose only {{ich_increase}}. Net interest income and
      credit losses did not move at all, so the new cardholders are not
      borrowing: they spend, collect points and pay in full.
  - id: exhibit-2
    title: "Summit Rewards economics per cardholder, by type"
    kind: table
    ask: "The team split cardholders into revolvers, who carry a balance, and transactors, who pay in full every month. What does each type earn the bank?"
    columns: ["Item", "Revolvers", "Transactors"]
    rows:
      - ["Cardholders, FY2023", "{{rev_n}}", "{{tr_n_23}}"]
      - ["Cardholders, FY2025", "{{rev_n}}", "{{tr_n_25}}"]
      - ["Annual card spend", "{{rev_spend}}", "{{tr_spend}}"]
      - ["Interchange rate", "{{interchange}}", "{{interchange}}"]
      - ["Effective rewards rate (points cost per $ of spend)", "{{rev_reward}}", "{{tr_reward}}"]
      - ["Average revolving balance", "{{balance}}", "None"]
      - ["Net interest yield on balance", "{{nim}}", "Not applicable"]
      - ["Credit losses (share of balance)", "{{loss_rate}}", "Negligible"]
      - ["Annual fee", "{{fee}}", "{{fee}}"]
      - ["Servicing and benefits cost", "{{servicing}}", "{{servicing}}"]
    note: "Illustrative data created for this practice case. Transactors earn a higher effective rewards rate because they put most of their spend on the 3x and 5x bonus categories (travel and dining)."
    insight: |
      A revolver earns the bank {{rev_profit}} a year; a transactor costs it
      {{tr_loss}}, because the points paid out are {{tr_rwd_ratio}} the
      interchange earned. The {{new_tr}} added since FY2023 explain the whole
      profit fall.
  - id: exhibit-3
    title: "Three options from the card team"
    kind: table
    ask: "The card team has three ideas to restore profit. Which would you pick?"
    columns: ["Option", "What changes", "Expected customer response"]
    rows:
      - ["A. Trim bonus categories", "Transactors' effective rewards rate falls to {{tr_reward_a}}; revolvers, who mostly earn the base rate, are unaffected", "{{a_cancel}} of transactors cancel; those who stay keep their spend"]
      - ["B. Raise the annual fee", "Fee rises from {{fee}} to {{fee_b}} for everyone", "{{b_cancel_rev}} of revolvers and {{b_cancel_tr}} of transactors cancel"]
      - ["C. Target revolvers", "Campaign aimed at customers who carry a balance", "{{c_new}} won; one-time cost {{c_acq}} per account; credit losses {{c_loss_rate}} of balances; other economics as for today's revolvers"]
    note: "Illustrative data created for this practice case; customer responses are from a fictional survey and test campaign."
    insight: |
      Option A fixes the loss-making segment directly. Option B also taxes
      the profitable revolvers, and Option C needs most of a year to pay back its
      acquisition cost.
---

## Prompt

Our client, Harbor & Pine Bank, issues **Summit Rewards**, a premium credit card with a {{fee}} annual fee and generous points on travel and dining. Two years ago the bank launched a big marketing push with a richer points offer. It worked: cardholders grew from {{ch_23}} to {{ch_25}} and card spend from {{spend_23}} to {{spend_25}}.

Yet the card's profit has fallen. The head of cards asks us: **why is profit down when the card is growing so fast, and what should we do about it?**

## Clarifying information

- Q: How does the card make money?
  A: Three ways: **interchange**, a fee the bank earns on every purchase (paid by the merchant's bank and passed on to the merchant); **interest** on balances that cardholders don't pay off; and the **annual fee**.
- Q: What are the main costs?
  A: Rewards (the cost of the points cardholders earn and redeem), credit losses on balances that are never repaid, and servicing and benefits (statements, call centers, fraud, card production, and premium perks such as lounge access and travel insurance).
- Q: What is the objective?
  A: Return the card's profit to at least the FY2023 level next year.
- Q: Have prices, interest rates or loss rates changed?
  A: No. Assume the fee, interchange rate, interest yield and loss rates are the same in both years. Ignore marketing costs already spent.
- Q: Who were the new cardholders?
  A: The campaign ran mainly on travel and points websites and offered extra points on travel and dining.

## Structure

> **Ask:** How would you structure the problem?

Profit per cardholder differs hugely by how the customer uses the card, so I'd build profit by **customer type**:

- **Profit = Σ (number of cardholders × profit per cardholder), by type**
- **Revenue per cardholder**
  - Interchange = spend × interchange rate
  - Net interest = revolving balance × net interest yield (only for customers who carry a balance)
  - Annual fee
- **Costs per cardholder**
  - Rewards = spend × effective rewards rate (higher if the customer optimizes bonus categories)
  - Credit losses = revolving balance × loss rate
  - Servicing and benefits
- **Customer types:** revolvers (carry a balance) versus transactors (pay in full each month)

Hypothesis: *"Card issuers usually make most of their money from interest, not interchange. If spend grew but profit fell, I suspect the growth came from heavy spenders who pay in full and collect more in points than the bank earns in interchange."*

## Math walkthrough

> **Ask:** First use Exhibit 1 to describe what changed. Then use Exhibit 2 to work out profit per cardholder for each type and explain the profit fall. Finally, which of the options in Exhibit 3 should the bank choose?

**1. Total profit (Exhibit 1).**
Revenue: $360M + $360M + $250M = **{{revenue_23}}** in FY2023 and $600M + $360M + $350M = **{{revenue_25}}** in FY2025, up {{rev_growth}}.
Costs: $390M + $120M + $200M = **{{cost_23}}**, then $690M + $120M + $280M = **{{cost_25}}**.
Profit fell from **{{profit_23}}** to **{{profit_25}}**, a drop of **{{profit_drop}}**. Rewards cost rose {{rwd_increase}}, more than the {{ich_increase}} rise in interchange, while interest income and credit losses stayed flat. The new cardholders do not borrow.

**2. Profit per cardholder (Exhibit 2).**

| Item | Revolver | Transactor |
|---|---|---|
| Interchange | $10,000 × 2% = {{rev_ich}} | $30,000 × 2% = {{tr_ich}} |
| Net interest | $4,000 × 15% = {{rev_int}} | None |
| Annual fee | {{fee}} | {{fee}} |
| Less: rewards | $10,000 × 1.5% = {{rev_rwd}} | $30,000 × 2.5% = {{tr_rwd}} |
| Less: credit losses | $4,000 × 5% = {{rev_loss}} | None |
| Less: servicing and benefits | {{servicing}} | {{servicing}} |
| **Profit per cardholder** | **{{rev_profit}}** | **{{tr_profit}}** |

A transactor's points cost {{tr_rwd_ratio}} the interchange they generate, and the annual fee does not cover the gap plus servicing and benefits.

**3. Explain the fall.**
Revolvers earn 600,000 × $500 = **{{rev_seg}}** in both years. Transactors lost the bank {{tr_seg_23}} in FY2023 and {{tr_seg_25}} in FY2025.
All of the growth was transactors: {{new_tr}} × −$100 = **{{new_tr_effect}}**, which is exactly the profit change. The campaign bought spend, not profit.

**4. The options (Exhibit 3).**
- **A. Trim bonus categories.** Each transactor now earns $30,000 × (2% − 2%) + $250 − $200 = **{{tr_profit_a}}**. The {{tr_left_a}} who stay add {{tr_seg_a}}, so profit = $300M + $30M = **{{profit_a}}**, a gain of **{{gain_a}}**.
- **B. Raise the fee to {{fee_b}}.** A revolver earns {{rev_profit_b}} and a transactor {{tr_profit_b}}. But 20% of revolvers leave: 480,000 × $600 = {{rev_seg_b}}, and transactors now only break even, so profit is **{{profit_b}}**, a gain of **{{gain_b}}**. Profit from revolvers, the good customers, falls {{rev_hit_b}}.
- **C. Target revolvers.** Each new revolver earns $500 − $4,000 × (7.5% − 5%) = **{{c_profit_per}}** a year, or {{c_annual}} in total, but the campaign costs {{c_acq_total}} upfront. Profit is **{{profit_c_y1}}** in the first year (below the target) and **{{profit_c_later}}** after that, only just meeting it.

| Option | Card profit next year | Meets the {{profit_23}} objective? |
|---|---|---|
| Today | {{profit_25}} | No |
| A. Trim bonus categories | {{profit_a}} | Yes, comfortably |
| B. Raise the fee | {{profit_b}} | Yes |
| C. Target revolvers | {{profit_c_y1}} (then {{profit_c_later}}) | No in year 1, only just after |

A useful check on Option A: today transactors lose money, so the cancellations are not a threat. Even if every transactor left, profit would be **{{worst_a}}**, still above FY2023.

## Synthesis

> **Ask:** What do you recommend to the head of cards?

**Profit fell {{profit_drop}} because the growth came entirely from transactors, who pay in full and cost the bank {{tr_loss}} each a year. Trim the bonus categories so their rewards no longer exceed interchange (Option A): profit should rise to about {{profit_a}}, comfortably above the FY2023 level of {{profit_23}}.**

1. **The card makes its money from revolvers:** each earns {{rev_profit}} a year, mainly from interest. Their number did not change.
2. **Transactors are paid more in points than they generate:** at a {{tr_reward}} effective rewards rate against {{interchange}} interchange, each new transactor reduced profit.
3. **Option A targets the problem directly:** it turns transactors profitable at {{tr_profit_a}} each and leaves revolvers alone. Option B adds only {{gain_b}} of profit because it drives away profitable revolvers; Option C misses the objective in its first year.

**Risks and next steps:** cutting rewards ("devaluation") draws press and social media criticism, so announce it well ahead and offer a lower-fee card to transactors who want to switch. Check the survey's assumption that revolvers are unaffected: if many of them also use the bonus categories, some may leave too. Pilot Option C on top of A later, but price the extra credit risk carefully and avoid pushing customers into debt they cannot afford. Going forward, judge marketing campaigns on profit per new account, not on spend or account growth.

## Common mistakes

- Celebrating growth in spend and cardholders without asking which customers the growth brought in.
- Treating interchange as profit, and forgetting that rewards cost scales with the same spend.
- Assuming the heaviest spenders are the best customers; on a rewards card the best customers are often the ones who carry a balance.
- Choosing the fee increase because $100 more per cardholder looks like pure profit, without noticing that the revolvers it drives away take {{rev_profit_b}} each of profit with them.
- Fearing the cancellations under Option A, when the customers who leave were losing the bank money.

## What top candidates do differently

- Split cardholders into revolvers and transactors before seeing Exhibit 2, because that is how card businesses think about profit.
- Spot in Exhibit 1 that interest and credit losses did not move, a clue that the new customers do not borrow.
- Compare every option against the stated objective, including timing: Option C fails in its first year.
- Test the robustness of the recommendation: Option A still beats the objective even if every transactor cancels.

## Creative question

Beyond cutting rewards, how could Harbor & Pine make transactors profitable instead of pushing them away?

## Model answer

Organize the ideas around **earning more from transactors** and **paying out less**:

- **Earn more:** a separate ultra-premium card with a higher fee and travel perks (lounge access, travel credits) that heavy spenders value; merchant-funded offers, where retailers and restaurants pay for targeted deals shown to cardholders; travel booking through the bank's own portal, which earns a commission.
- **Pay out less:** negotiate a lower price for the airline and hotel points the bank buys from its transfer partners; points that are worth more when redeemed for the bank's partners (where the bank pays less than face value) and less as cash back; caps on bonus-category earning per year; points that expire after long inactivity.
- **Deepen the relationship:** offer transactors checking, savings and investment accounts, where the bank earns deposit margin and fees; a transactor with $50,000 in savings is a valuable customer even if the card alone loses money.

A top candidate prioritizes: "The relationship idea is the most powerful. Transactors are usually affluent, so the card can be the way in to a profitable banking relationship. The bank should judge them on total relationship profit, not card profit alone."
