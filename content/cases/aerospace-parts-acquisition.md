---
id: aerospace-parts-acquisition
title: "One Big Customer: Buying a Precision-Machining Competitor"
client: "Altair Forge Aerostructures (fictional), a US maker of aircraft structural parts"
summary: "An aerospace supplier is offered a smaller precision-machining rival for a full price. Synergies look attractive, but nearly half of the target's sales depend on one contract that expires soon."
industry: industrials
sub_industry: "Aerospace components"
type: m-and-a
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  t_rev:        { value: 180,  unit: "$M",  label: "Target (Meridian Machining) revenue" }
  t_margin:     { value: 0.14, unit: "%",   label: "Target EBITDA margin" }
  multiple:     { value: 9.0,  unit: "x",   label: "EBITDA multiple asked by the sellers (and used by Altair for its own value)" }
  c1:           { value: 0.45, unit: "%",   label: "Share of target revenue from its largest customer (an engine maker)" }
  c2:           { value: 0.20, unit: "%",   label: "Share of target revenue from the second customer" }
  c3:           { value: 0.12, unit: "%",   label: "Share of target revenue from the third customer" }
  c_rest:       { value: 0.23, unit: "%",   label: "Share of target revenue from all other customers" }
  price_cut:    { value: 0.08, unit: "%",   label: "Price cut the largest customer is expected to demand at renewal" }
  contrib:      { value: 0.30, unit: "%",   label: "Contribution margin on lost revenue (EBITDA lost per dollar of sales lost)" }
  p_renew:      { value: 0.70, unit: "%",   label: "Probability the largest customer renews" }
  mat_share:    { value: 0.35, unit: "%",   label: "Materials as a share of target revenue (titanium, aluminum)" }
  mat_save:     { value: 0.04, unit: "%",   label: "Saving on materials from Altair's bulk purchasing" }
  oh_save:      { value: 6,    unit: "$M",  label: "Annual overhead saving (duplicate sites and back office)" }
  integ:        { value: 14,   unit: "$M",  label: "One-time integration cost" }

calculations:
  - { id: t_ebitda, label: "Target EBITDA", formula: "t_rev * t_margin", expected: 25.2, unit: "$M", decimals: 1 }
  - { id: ask, label: "Asking price", formula: "t_ebitda * multiple", expected: 226.8, unit: "$M", decimals: 1 }
  - { id: mix_check, label: "Customer shares sum (check)", formula: "c1 + c2 + c3 + c_rest", expected: 1.0, unit: "%" }
  - { id: top3, label: "Share of revenue from the top three customers", formula: "c1 + c2 + c3", expected: 0.77, unit: "%" }
  - { id: cust_rev, label: "Revenue from the largest customer", formula: "t_rev * c1", expected: 81, unit: "$M" }
  - { id: price_loss, label: "EBITDA lost to the renewal price cut", formula: "cust_rev * price_cut", expected: 6.48, unit: "$M", decimals: 2 }
  - { id: ebitda_renew, label: "Target EBITDA if the customer renews at the lower price", formula: "t_ebitda - price_loss", expected: 18.72, unit: "$M", decimals: 1 }
  - { id: lost_ebitda, label: "EBITDA lost if the customer leaves", formula: "cust_rev * contrib", expected: 24.3, unit: "$M", decimals: 1 }
  - { id: ebitda_lost, label: "Target EBITDA if the customer leaves", formula: "t_ebitda - lost_ebitda", expected: 0.9, unit: "$M", decimals: 1 }
  - { id: implied_mult, label: "Multiple paid on post-renewal EBITDA", formula: "ask / ebitda_renew", expected: 12.115, unit: "x", decimals: 1 }
  - { id: mat_syn, label: "Materials synergy", formula: "t_rev * mat_share * mat_save", expected: 2.52, unit: "$M", decimals: 2 }
  - { id: total_syn, label: "Total annual synergies", formula: "mat_syn + oh_save", expected: 8.52, unit: "$M", decimals: 2 }
  - { id: val_renew, label: "Value to Altair if the customer renews", formula: "(ebitda_renew + total_syn) * multiple - integ", expected: 231.16, unit: "$M", decimals: 1 }
  - { id: val_lost, label: "Value to Altair if the customer leaves", formula: "(ebitda_lost + total_syn) * multiple - integ", expected: 70.78, unit: "$M", decimals: 1 }
  - { id: val_exp, label: "Probability-weighted value to Altair", formula: "p_renew * val_renew + (1 - p_renew) * val_lost", expected: 183.046, unit: "$M", decimals: 0 }
  - { id: gap, label: "Asking price minus probability-weighted value", formula: "ask - val_exp", expected: 43.754, unit: "$M", decimals: 0 }
  - { id: naive_val, label: "Naive value: current EBITDA plus synergies, less integration", formula: "(t_ebitda + total_syn) * multiple - integ", expected: 288.28, unit: "$M", decimals: 0 }
  - { id: contingent, label: "Part of the price that depends on renewal", formula: "val_renew - val_lost", expected: 160.38, unit: "$M", decimals: 0 }

answer:
  calc: val_exp
  headline: "Meridian is worth about {{val_exp}} to Altair after the contract risk, not the {{ask}} asked. Pay the difference only if the customer renews."

exhibits:
  - id: exhibit-1
    title: "Meridian Machining: share of revenue by customer"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Here is Meridian's customer mix. What stands out?"
    data:
      - { label: "Largest customer (engine maker)", value: c1 }
      - { label: "Second customer", value: c2 }
      - { label: "Third customer", value: c3 }
      - { label: "All other customers", value: c_rest }
    note: "Illustrative data created for this practice case. Meridian and Altair are fictional."
    insight: |
      The top three customers are {{top3}} of revenue, and one customer is
      {{c1}} alone. Meridian is really a supplier to one engine program,
      and the buyer would inherit that dependence.
  - id: exhibit-2
    title: "Expected annual synergies"
    kind: table
    ask: "The deal team has estimated synergies. How would you test them?"
    columns: ["Synergy", "Basis", "Annual value"]
    rows:
      - ["Materials", "{{mat_save}} saving on {{mat_share}} of Meridian revenue", "{{mat_syn}}"]
      - ["Overhead", "Duplicate sites and back office", "{{oh_save}}"]
      - ["**Total**", "", "**{{total_syn}}**"]
      - ["One-time integration cost", "", "{{integ}}"]
    note: "Illustrative data created for this practice case. No revenue synergies are included."
    insight: |
      Synergies are cost-based and under the buyer's control, so they are
      more credible than revenue synergies, but they are small next to the
      {{ask}} price: about {{total_syn}} a year.
  - id: exhibit-3
    title: "Meridian EBITDA under three contract outcomes"
    kind: table
    ask: "The largest customer's contract expires in 18 months. What does this do to the value?"
    columns: ["Outcome", "Meridian EBITDA", "Value to Altair, including synergies"]
    rows:
      - ["Today (no change)", "{{t_ebitda}}", "{{naive_val}}"]
      - ["Renews at a lower price", "{{ebitda_renew}}", "{{val_renew}}"]
      - ["Customer leaves", "{{ebitda_lost}}", "{{val_lost}}"]
    note: "Illustrative data created for this practice case. Value is EBITDA plus synergies, times the multiple, less integration cost."
    insight: |
      The asking price of {{ask}} only holds if the customer renews, and
      then only just. If the customer leaves, the business is worth about
      {{val_lost}} to Altair.
---

## Prompt

Our client is Altair Forge Aerostructures, a US maker of structural parts for commercial and military aircraft. It is considering buying **Meridian Machining**, a smaller competitor that mills precision parts from titanium and aluminum. Meridian's owners have asked for a price of about nine times EBITDA.

Altair's CEO likes the idea: Meridian would add capacity, and the two companies buy the same metals and have overlapping sites.

She asks us: **should Altair buy Meridian, and how much should it pay?**

## Clarifying information

- Q: Why does Altair want to buy rather than build capacity?
  A: Machining capacity takes about three years to qualify with aircraft customers. Buying Meridian gets qualified capacity immediately.
- Q: What is Meridian's financial position?
  A: Revenue of {{t_rev}}, with a {{t_margin}} EBITDA margin. The sellers ask for **{{multiple}}** EBITDA.
- Q: Who are Meridian's customers?
  A: Hand over Exhibit 1 when asked.
- Q: Are there contracts we should know about?
  A: The largest customer's supply agreement ends in 18 months. Meridian says renewal "looks likely" but nothing is signed. Altair's own view is a **{{p_renew}}** chance of renewal, at a price about **{{price_cut}}** lower. Reveal this only if asked about contracts or customer risk.
- Q: How much EBITDA is lost if that customer leaves?
  A: About **{{contrib}}** of that customer's revenue, because most of Meridian's cost is fixed.
- Q: What synergies does Altair expect?
  A: Exhibit 2. Hand it over when asked about synergies.
- Q: Does the multiple apply to Altair's own business?
  A: Yes. Altair itself trades at about {{multiple}}, so use that to value the combined earnings.

## Structure

> **Ask:** How would you decide whether to buy Meridian, and at what price?

- **1. Strategic fit:** does Meridian bring qualified capacity, skills and customers Altair lacks?
- **2. Standalone value of Meridian**
  - Revenue, margin and EBITDA
  - Customer mix and contract risk, especially concentration
  - Capacity use and quality record
- **3. Synergies**
  - Cost: materials, overhead, sites
  - Revenue: cross-selling (usually less reliable)
  - Integration cost and timing
- **4. Valuation:** EBITDA plus synergies, times the multiple, less integration cost; compare with the asking price
- **5. Risks and deal structure:** customer loss, price protection, earn-out, antitrust, retention of skilled machinists

A good hypothesis: *"The deal works if Meridian's earnings are durable and the synergies are real. In a business with few customers, durability is the first thing I'd test."*

## Math walkthrough

> **Ask:** Using the exhibits, estimate the value of Meridian to Altair and compare it with the price.

**1. The ask.**
EBITDA = {{t_rev}} × {{t_margin}} = **{{t_ebitda}}**. At {{multiple}}, the asking price is **{{ask}}**.

**2. Concentration.**
The largest customer is {{c1}} of revenue, or **{{cust_rev}}**. The top three are {{top3}}.

**3. Contract scenarios.**
*Renews at a lower price:* the price cut falls straight to EBITDA: {{cust_rev}} × {{price_cut}} = {{price_loss}}. EBITDA becomes **{{ebitda_renew}}**. The sellers' price is now {{implied_mult}} of that EBITDA.
*Customer leaves:* {{cust_rev}} × {{contrib}} = {{lost_ebitda}} of EBITDA is lost, leaving **{{ebitda_lost}}**.

**4. Synergies.**
Materials: {{t_rev}} × {{mat_share}} × {{mat_save}} = {{mat_syn}}. Add {{oh_save}} of overhead: **{{total_syn}}** a year.

**5. Value to Altair.**

| Outcome | Calculation | Value |
|---|---|---|
| Renews | ({{ebitda_renew}} + {{total_syn}}) × {{multiple}} − {{integ}} | {{val_renew}} |
| Leaves | ({{ebitda_lost}} + {{total_syn}}) × {{multiple}} − {{integ}} | {{val_lost}} |
| **Probability-weighted** | {{p_renew}} × {{val_renew}} + (1 − {{p_renew}}) × {{val_lost}} | **{{val_exp}}** |

The asking price of {{ask}} is **{{gap}} above** the probability-weighted value. A naive buyer who ignored the contract would value Meridian at {{naive_val}}, and would overpay.

## Synthesis

> **Ask:** What would you tell the CEO?

**Altair should pursue Meridian but not at {{ask}}. After the contract risk, Meridian is worth about {{val_exp}}. Offer a lower upfront price and make the rest depend on the largest customer renewing.**

1. **Concentration is the main risk:** one customer is {{c1}} of revenue and the contract is up in 18 months; losing it takes EBITDA from {{t_ebitda}} to {{ebitda_lost}}.
2. **Synergies help but don't rescue the price:** {{total_syn}} a year is real, since Altair controls it, but is small next to the price gap.
3. **Structure the deal:** {{contingent}} of the value hangs on renewal, so pay it as an earn-out, or require a signed renewal before closing.

**Risks and next steps:** speak to the engine maker (with the sellers' consent) about the renewal; test whether Altair's own relationships with that customer could help retain the work; check capacity if the customer's volume were moved to Altair's plants; plan how to keep skilled machinists, who are scarce; check antitrust review; and look for protection in the contract, such as a price adjustment if the customer leaves before closing.

## Common mistakes

- Valuing Meridian on today's EBITDA ({{naive_val}} with synergies), ignoring the contract.
- Treating a {{price_cut}} price cut as a revenue effect only, when it falls straight to EBITDA.
- Counting synergies that need Meridian's customers to buy more, rather than cost savings Altair controls.
- Forgetting the one-time integration cost of {{integ}}.
- Adding the probabilities of renewal to the revenue instead of valuing each outcome and weighting the values.

## What top candidates do differently

- Ask about customers and contracts before talking about synergies.
- Build the valuation for each contract outcome, then weight it, instead of one blended number.
- Separate synergies Altair controls (cost) from those it does not (revenue).
- Propose a deal structure, not just a price: earn-out, escrow or a renewal condition.

## Creative question

Meridian's biggest customer holds a lot of power over it. Besides buying Meridian, how could Altair get qualified machining capacity while keeping its risk low?

## Model answer

Organize by **how much commitment Altair makes**:

- **Contract:** sign a long-term capacity agreement with Meridian so Altair can use its machines, without owning it.
- **Partnership:** a joint venture for the one product line Altair needs, shared with the engine maker.
- **Smaller deal:** buy only the plant or product line that serves non-concentrated customers.
- **Build:** add machines at Altair's own sites in stages, starting with the cheapest qualification path.

A top candidate prioritizes: "A staged deal reduces risk: a capacity agreement now, with an option to buy after the contract renews and the customer relationship is clearer."
