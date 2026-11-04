---
id: oncology-biotech-acquisition
title: "Pipeline Premium: A Pharma Company Acquiring an Oncology Biotech"
client: "Brennholt Pharmaceuticals (fictional), a large global pharma company"
summary: "A big pharma company facing a patent cliff wants to buy a three-asset oncology biotech at a 40% premium. Value the risky pipeline, weigh synergies against the premium, and design a deal that works."
industry: pharma-healthcare
sub_industry: "Biopharma M&A / oncology"
type: m-and-a
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company or deal data.
inputs:
  mkt_cap:            { value: 3.5,  unit: "$B", label: "Kelvara's current market value (equity)", decimals: 1 }
  ask_premium:        { value: 0.40, unit: "%",  label: "Premium over market value Kelvara's board expects" }
  margin:             { value: 0.50, unit: "%",  label: "Operating margin on oncology drug sales at peak" }
  profit_multiple:    { value: 4,    unit: "x",  label: "Brennholt's rule of thumb: value of a drug = 4x its peak operating profit" }
  peak1:              { value: 2.0,  unit: "$B", label: "KLV-101 peak annual sales if approved", decimals: 1 }
  pos1:               { value: 0.60, unit: "%",  label: "KLV-101 probability of approval (Phase 3)" }
  peak2:              { value: 1.5,  unit: "$B", label: "KLV-202 peak annual sales if approved", decimals: 1 }
  pos2:               { value: 0.30, unit: "%",  label: "KLV-202 probability of approval (Phase 2)" }
  peak3:              { value: 3.0,  unit: "$B", label: "KLV-303 peak annual sales if approved", decimals: 1 }
  pos3:               { value: 0.10, unit: "%",  label: "KLV-303 probability of approval (Phase 1)" }
  rd_cost:            { value: 0.4,  unit: "$B", label: "Risk-adjusted cost to finish Kelvara's clinical trials", decimals: 1 }
  uplift:             { value: 0.25, unit: "%",  label: "Lift in KLV-101 peak sales from Brennholt's global salesforce" }
  cost_syn:           { value: 100,  unit: "$M", label: "Annual cost synergies (overlapping admin, overhead, listing costs)" }
  cost_syn_multiple:  { value: 8,    unit: "x",  label: "Multiple used to value recurring cost synergies" }
  integration_cost:   { value: 200,  unit: "$M", label: "One-time integration cost" }
  cvr_upfront:        { value: 4.0,  unit: "$B", label: "Alternative structure: cash paid at closing", decimals: 1 }
  cvr_payment:        { value: 1.0,  unit: "$B", label: "Alternative structure: extra payment if KLV-101 is approved", decimals: 1 }

calculations:
  # --- What does Kelvara want? ---
  - { id: offer, label: "Price at the expected premium", formula: "mkt_cap * (1 + ask_premium)", expected: 4.9, unit: "$B", decimals: 1 }
  - { id: premium_paid, label: "Premium in dollars", formula: "offer - mkt_cap", expected: 1.4, unit: "$B", decimals: 1 }
  # --- Standalone, risk-adjusted pipeline value ---
  - { id: v1_unrisked, label: "KLV-101 value if approved", formula: "peak1 * margin * profit_multiple", expected: 4.0, unit: "$B", decimals: 1 }
  - { id: v1, label: "KLV-101 risk-adjusted value", formula: "v1_unrisked * pos1", expected: 2.4, unit: "$B", decimals: 1 }
  - { id: v2_unrisked, label: "KLV-202 value if approved", formula: "peak2 * margin * profit_multiple", expected: 3.0, unit: "$B", decimals: 1 }
  - { id: v2, label: "KLV-202 risk-adjusted value", formula: "v2_unrisked * pos2", expected: 0.9, unit: "$B", decimals: 1 }
  - { id: v3_unrisked, label: "KLV-303 value if approved", formula: "peak3 * margin * profit_multiple", expected: 6.0, unit: "$B", decimals: 1 }
  - { id: v3, label: "KLV-303 risk-adjusted value", formula: "v3_unrisked * pos3", expected: 0.6, unit: "$B", decimals: 1 }
  - { id: pipeline_value, label: "Risk-adjusted pipeline value", formula: "v1 + v2 + v3", expected: 3.9, unit: "$B", decimals: 1 }
  - { id: v1_share, label: "KLV-101 share of pipeline value", formula: "v1 / pipeline_value", expected: 0.615, unit: "%", decimals: 0 }
  - { id: standalone, label: "Standalone value after remaining R&D cost", formula: "pipeline_value - rd_cost", expected: 3.5, unit: "$B", decimals: 1 }
  # --- Synergies ---
  - { id: extra_peak, label: "Extra KLV-101 peak sales from the global launch", formula: "peak1 * uplift", expected: 0.5, unit: "$B", decimals: 1 }
  - { id: rev_syn_unrisked, label: "Revenue synergy if KLV-101 is approved", formula: "peak1 * uplift * margin * profit_multiple", expected: 1.0, unit: "$B", decimals: 1 }
  - { id: rev_syn, label: "Risk-adjusted revenue synergy", formula: "rev_syn_unrisked * pos1", expected: 0.6, unit: "$B", decimals: 1 }
  - { id: cost_syn_gross, label: "Value of recurring cost synergies", formula: "cost_syn * cost_syn_multiple / 1000", expected: 0.8, unit: "$B", decimals: 1 }
  - { id: cost_syn_net, label: "Cost synergies net of integration cost", formula: "(cost_syn * cost_syn_multiple - integration_cost) / 1000", expected: 0.6, unit: "$B", decimals: 1 }
  - { id: synergies, label: "Total synergies", formula: "rev_syn + cost_syn_net", expected: 1.2, unit: "$B", decimals: 1 }
  - { id: syn_vs_premium, label: "Synergies as a share of the premium", formula: "synergies / premium_paid", expected: 0.857, unit: "%", decimals: 0 }
  # --- Verdict on the all-cash offer ---
  - { id: value_to_buyer, label: "Value of Kelvara to Brennholt (walk-away price)", formula: "standalone + synergies", expected: 4.7, unit: "$B", decimals: 1 }
  - { id: overpay, label: "Overpayment at the expected premium", formula: "offer - value_to_buyer", expected: 0.2, unit: "$B", decimals: 1 }
  - { id: max_premium, label: "Highest premium Brennholt can justify", formula: "value_to_buyer / mkt_cap - 1", expected: 0.343, unit: "%", decimals: 0 }
  - { id: v1_linked, label: "Value that depends on KLV-101 (asset + its synergy)", formula: "v1 + rev_syn", expected: 3.0, unit: "$B", decimals: 1 }
  # --- Contingent value right (CVR) structure ---
  - { id: cvr_headline, label: "Headline price with the CVR", formula: "cvr_upfront + cvr_payment", expected: 5.0, unit: "$B", decimals: 1 }
  - { id: cvr_upfront_premium, label: "Upfront premium over market value", formula: "cvr_upfront / mkt_cap - 1", expected: 0.143, unit: "%", decimals: 0 }
  - { id: cvr_expected_payment, label: "Expected value of the CVR payment", formula: "pos1 * cvr_payment", expected: 0.6, unit: "$B", decimals: 1 }
  - { id: cvr_expected_cost, label: "Expected total cost with the CVR", formula: "cvr_upfront + pos1 * cvr_payment", expected: 4.6, unit: "$B", decimals: 1 }
  - { id: cvr_npv, label: "Value created for Brennholt with the CVR", formula: "value_to_buyer - cvr_expected_cost", expected: 0.1, unit: "$B", decimals: 1 }

answer:
  calc: value_to_buyer
  headline: "Kelvara is worth ~{{value_to_buyer}} to Brennholt, so a {{offer}} all-cash deal overpays by {{overpay}}; offer {{cvr_upfront}} upfront plus a {{cvr_payment}} payment on KLV-101 approval instead."

exhibits:
  - id: exhibit-1
    title: "Kelvara Therapeutics pipeline"
    kind: table
    ask: "Here is Kelvara's pipeline. Using Brennholt's rule of thumb, what is it worth on a standalone basis?"
    columns: ["Asset", "Indication", "Stage", "Peak sales if approved", "Probability of approval"]
    rows:
      - ["KLV-101", "Second-line lung cancer", "Phase 3 (readout in 12 months)", "{{peak1}}", "{{pos1}}"]
      - ["KLV-202", "Ovarian cancer", "Phase 2", "{{peak2}}", "{{pos2}}"]
      - ["KLV-303", "Solid tumors (bispecific antibody)", "Phase 1", "{{peak3}}", "{{pos3}}"]
      - ["Remaining trial costs", "{{rd_cost}} in total across all assets, risk-adjusted", "", "", ""]
    note: "Illustrative data created for this practice case. Kelvara, its assets and the probabilities are fictional."
    insight: |
      The biggest prize (KLV-303) is the least likely to happen. Once you weight
      by probability, KLV-101 carries {{v1_share}} of the value — this is really
      a bet on one Phase 3 readout.
  - id: exhibit-2
    title: "Synergy estimates from Brennholt's deal team"
    kind: table
    ask: "Brennholt's deal team has estimated synergies. Do they justify the premium Kelvara's board wants?"
    columns: ["Synergy", "Estimate", "Comment"]
    rows:
      - ["Revenue: global launch of KLV-101", "+{{uplift}} peak sales", "Kelvara would launch in the US only; Brennholt sells in 60 countries. Only happens if KLV-101 is approved"]
      - ["Cost: overlapping admin and overhead", "{{cost_syn}} per year", "Valued at {{cost_syn_multiple}} annual savings"]
      - ["One-time integration cost", "{{integration_cost}}", "Severance, systems, site consolidation"]
      - ["Kelvara market value today", "{{mkt_cap}}", "Board signals it wants a {{ask_premium}} premium"]
    note: "Illustrative data created for this practice case."
    insight: |
      Synergies of about {{synergies}} cover only {{syn_vs_premium}} of a
      {{premium_paid}} premium, and {{rev_syn}} of the synergies depends on the
      same Phase 3 readout.
  - id: exhibit-3
    title: "Alternative deal structure: upfront cash plus a contingent value right (CVR)"
    kind: table
    ask: "Brennholt's bankers propose this structure instead of all cash. Does it fix the problem?"
    columns: ["Component", "Amount", "When paid"]
    rows:
      - ["Cash at closing", "{{cvr_upfront}}", "At closing"]
      - ["CVR payment", "{{cvr_payment}}", "Only if KLV-101 receives US approval"]
      - ["Headline price", "{{cvr_headline}}", "Compare with {{offer}} all cash"]
    note: "Illustrative data created for this practice case."
    insight: |
      A CVR pays Kelvara's shareholders more if *their* optimism about KLV-101
      is right, and protects Brennholt if it is wrong.
---

## Prompt

Our client, Brennholt Pharmaceuticals, is a large global pharma company. Its best-selling cancer drug loses patent protection in 2029, and the company needs new oncology products to fill the gap.

Brennholt is looking at buying **Kelvara Therapeutics**, a publicly listed biotech with three cancer drugs in development and no products on the market yet. Kelvara is worth about **{{mkt_cap}}** on the stock market today. Its board has signaled that it would accept an offer at a **{{ask_premium}} premium** — roughly {{offer}}.

Brennholt's CEO asks us: **is Kelvara worth that price, and if not, how should Brennholt structure an offer?**

## Clarifying information

- Q: What is Brennholt's objective — revenue replacement, or creating shareholder value?
  A: Both, but the board will not approve a deal that is worth less to Brennholt than it pays. Treat "value to Brennholt above the price paid" as the test.
- Q: How does Brennholt value a drug in development?
  A: It uses a rule of thumb: a launched drug is worth about **{{profit_multiple}} its peak annual operating profit** (a shortcut for the discounted profits over its patent life). Oncology drugs earn about **{{margin}}** operating margin at peak. Multiply by the probability of approval to get a risk-adjusted value.
- Q: Does Kelvara have any cash or debt?
  A: Ignore both; the cash it holds roughly covers its overhead until KLV-101 reads out. The remaining trial costs are listed separately.
- Q: When do we learn whether KLV-101 works?
  A: The Phase 3 trial reads out in about 12 months. Approval would follow roughly a year later.
- Q: Are other buyers interested?
  A: Possibly — two other large pharma companies have looked at Kelvara. This is part of why the board feels confident asking for a high premium.
- Q: Should we discount the payments in the deal structure?
  A: No — keep it simple and ignore the time value of money for the CVR payment.

## Structure

> **Ask:** How would you structure your analysis of this acquisition?

The deal works only if **value to Brennholt ≥ price paid**. Break that into four questions:

- **1. What is Kelvara worth on its own?**
  - Each asset: peak sales × margin × value multiple × probability of approval
  - Less the cost to finish the trials
  - Sanity check against today's market value: is our view more or less optimistic than investors'?
- **2. What extra value does Brennholt bring (synergies)?**
  - Revenue: Brennholt's global salesforce, payer relationships, combination therapy with its own drugs
  - Cost: overlapping admin and overhead, manufacturing
  - Less one-time integration cost — and how likely each synergy is
- **3. What is the price, and how should it be paid?**
  - Premium the board wants versus synergies we can realistically capture
  - Who bears the clinical risk: all cash, or cash plus payments tied to milestones
- **4. Strategic fit and risks**
  - Does Kelvara fill the 2029 gap in time?
  - Concentration risk on one trial; competing bidders; integration of a science-driven culture

A strong opening hypothesis: *"Biotech value is concentrated in its late-stage asset, so the price question is really a question about who carries the Phase 3 risk."*

## Math walkthrough

> **Ask:** First, value Kelvara's pipeline on a standalone, risk-adjusted basis (Exhibit 1). Then: do the synergies in Exhibit 2 justify the premium? Finally, evaluate the alternative structure in Exhibit 3.

**1. Value of each drug if approved.**
Value = peak sales × {{margin}} margin × {{profit_multiple}}.
- KLV-101: $2.0B × 50% × 4 = **{{v1_unrisked}}**
- KLV-202: $1.5B × 50% × 4 = **{{v2_unrisked}}**
- KLV-303: $3.0B × 50% × 4 = **{{v3_unrisked}}**

**2. Risk-adjust.**
- KLV-101: $4.0B × 60% = **{{v1}}**
- KLV-202: $3.0B × 30% = **{{v2}}**
- KLV-303: $6.0B × 10% = **{{v3}}**

Pipeline value = {{v1}} + {{v2}} + {{v3}} = **{{pipeline_value}}**. Less {{rd_cost}} of remaining trial costs, standalone value = **{{standalone}}** — exactly Kelvara's market value. Good news: our view is no more optimistic than investors', so the premium must be earned through synergies.

**3. Premium.**
Price = $3.5B × 1.4 = **{{offer}}**, a premium of **{{premium_paid}}**.

**4. Synergies.**
- Revenue: $2.0B × 25% = {{extra_peak}} of extra peak sales; × 50% × 4 = {{rev_syn_unrisked}} if approved; × 60% = **{{rev_syn}}**.
- Cost: $100M × 8 = {{cost_syn_gross}}, less {{integration_cost}} integration = **{{cost_syn_net}}**.
- Total synergies = **{{synergies}}**, only {{syn_vs_premium}} of the {{premium_paid}} premium.

**5. Verdict on the all-cash deal.**
Value to Brennholt = {{standalone}} + {{synergies}} = **{{value_to_buyer}}**. At {{offer}}, Brennholt overpays by **{{overpay}}**. The highest premium it can justify is about **{{max_premium}}**, not {{ask_premium}}.

**6. The CVR structure (Exhibit 3).**
A contingent value right (CVR) is a promise to pay more later if a milestone is hit.
Expected cost = {{cvr_upfront}} + 60% × {{cvr_payment}} = {{cvr_upfront}} + {{cvr_expected_payment}} = **{{cvr_expected_cost}}**.
That is below the walk-away price of {{value_to_buyer}}, so Brennholt creates about **{{cvr_npv}}** of value — while Kelvara's shareholders see a headline price of **{{cvr_headline}}**, above the {{offer}} they asked for.

*Why both sides can say yes:* Kelvara's board probably believes KLV-101 is more likely to succeed than 60%. The CVR lets them be paid for that belief, and Brennholt only pays the extra {{cvr_payment}} in the world where the drug is approved and the deal is clearly worth it. The catch: the closing cash is only a {{cvr_upfront_premium}} premium over market value, so expect the board to push for more cash upfront, especially if a rival bids. Brennholt can raise the closing cash by up to about $0.1B before the expected cost reaches its walk-away.

## Synthesis

> **Ask:** The CEO has two minutes. What is your recommendation?

**Brennholt should pursue Kelvara, but not at {{offer}} in cash: the company is worth about {{value_to_buyer}} to Brennholt, so it should offer {{cvr_upfront}} at closing plus a {{cvr_payment}} payment if KLV-101 is approved — a {{cvr_headline}} headline price that costs Brennholt about {{cvr_expected_cost}} in expectation.**

1. **Standalone, the market prices Kelvara fairly:** our risk-adjusted value of {{standalone}} matches its market value, so every dollar of premium must come from synergies.
2. **Synergies don't cover the asked premium:** {{synergies}} of synergies against a {{premium_paid}} premium; all cash overpays by {{overpay}}, and the justified premium is about {{max_premium}}.
3. **The risk sits in one trial:** {{v1_linked}} of the {{value_to_buyer}} depends on KLV-101's Phase 3 readout. A CVR moves that risk to the sellers, who are the most optimistic about it.

**Risks and next steps:** run clinical due diligence on KLV-101's Phase 2 data to test the {{pos1}} probability; validate the {{uplift}} peak-sales lift by country; prepare for a competing bid (our walk-away is {{value_to_buyer}} in expected value); and confirm the deal fills the 2029 gap — KLV-101 would launch around 2028, but the earlier-stage assets would not.

## Common mistakes

- Adding up peak sales ({{peak1}} + {{peak2}} + {{peak3}}) and comparing them with the price, without multiplying by margin, value multiple and probability of approval.
- Treating the revenue synergy as certain. It only exists if KLV-101 is approved, so it must be risk-adjusted too.
- Forgetting the one-time integration cost and the remaining trial costs.
- Comparing synergies with the **total** price instead of with the **premium** — the market value is what Brennholt would pay anyway for standalone value.
- Saying "don't do the deal" and stopping. The question asks how to structure an offer; the best answer finds a price and structure both sides can accept.

## What top candidates do differently

- Notice that the standalone value equals the market value and say what it means: "We are not paying for a view investors don't already have."
- Spot that KLV-101 is the swing factor and connect it to the deal structure, not just to the risk list.
- Explain *why* a CVR works: it bridges a disagreement about probability between buyer and seller.
- Mention competition from other bidders and set a clear walk-away price.

## Creative question

Beyond the price, what could go wrong after Brennholt closes the deal, and how would you protect the value of Kelvara's pipeline?

## Model answer

Group the risks by **people, science and commercial execution**:

- **People:** Kelvara's scientists may leave once they become part of a large company. Use retention packages tied to milestones, keep Kelvara's research site and brand for a period, and give its leaders real decision rights.
- **Science:** large companies tend to slow down small-company programs with extra review layers. Ring-fence the KLV-101 and KLV-202 teams and budgets; agree go/no-go criteria upfront.
- **Commercial:** the global-launch synergy needs early preparation — payer evidence and pricing strategy in major markets should start before the Phase 3 readout, not after approval.
- **Portfolio:** if KLV-101 fails, have a plan for KLV-202 and KLV-303 (continue, partner, or out-license) so the remaining value is not written off by default.

A top candidate prioritizes: "Retaining the scientists behind KLV-202 and KLV-303 matters most — the CVR shares part of the Phase 3 risk with the sellers, but early-stage value walks out the door with people."
