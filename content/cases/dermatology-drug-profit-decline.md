---
id: dermatology-drug-profit-decline
title: "Patent Cliff: A Branded Dermatology Drug Losing Profit"
client: "Corvane Therapeutics (fictional), a mid-size specialty pharma company"
summary: "Operating profit on a psoriasis cream fell by nearly two-thirds in two years. Find out why — and whether cutting patient copay support would help."
industry: pharma-healthcare
sub_industry: "Specialty pharma / market access"
type: profitability
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  units_23:      { value: 4.0,  unit: "million tubes", label: "Tubes sold, FY2023" }
  units_25:      { value: 3.2,  unit: "million tubes", label: "Tubes sold, FY2025" }
  list_23:       { value: 500,  unit: "$/tube",  label: "List price per tube, FY2023" }
  list_25:       { value: 540,  unit: "$/tube",  label: "List price per tube, FY2025" }
  gtn_23:        { value: 0.35, unit: "%",       label: "Gross-to-net discount, FY2023" }
  gtn_25:        { value: 0.55, unit: "%",       label: "Gross-to-net discount, FY2025" }
  cogs_unit:     { value: 20,   unit: "$/tube",  label: "Cost of goods per tube (both years)" }
  sga_23:        { value: 400,  unit: "$M",      label: "Sales, marketing & admin cost, FY2023" }
  sga_25:        { value: 420,  unit: "$M",      label: "Sales, marketing & admin cost, FY2025" }
  market_units:  { value: 10,   unit: "million tubes", label: "Total prescriptions in the category (flat)" }
  rebate_chg:    { value: 0.10, unit: "pts",     label: "Change in PBM rebates" }
  copay_chg:     { value: 0.07, unit: "pts",     label: "Change in copay assistance" }
  gov_chg:       { value: 0.02, unit: "pts",     label: "Change in government rebates" }
  dist_chg:      { value: 0.01, unit: "pts",     label: "Change in distributor fees" }
  copay_cut:     { value: 0.05, unit: "pts",     label: "Proposed cut in copay assistance (share of list)" }
  volume_loss:   { value: 0.05, unit: "%",       label: "Expected volume loss from the copay cut" }

calculations:
  # --- Why did profit fall? ---
  - { id: net_23, label: "Net price per tube, FY2023", formula: "list_23 * (1 - gtn_23)", expected: 325, unit: "$/tube" }
  - { id: net_25, label: "Net price per tube, FY2025", formula: "list_25 * (1 - gtn_25)", expected: 243, unit: "$/tube" }
  - { id: rev_23, label: "Net revenue, FY2023", formula: "units_23 * net_23", expected: 1300, unit: "$M" }
  - { id: rev_25, label: "Net revenue, FY2025", formula: "units_25 * net_25", expected: 777.6, unit: "$M", decimals: 1 }
  - { id: cogs_23, label: "Cost of goods, FY2023", formula: "units_23 * cogs_unit", expected: 80, unit: "$M" }
  - { id: cogs_25, label: "Cost of goods, FY2025", formula: "units_25 * cogs_unit", expected: 64, unit: "$M" }
  - { id: op_23, label: "Operating profit, FY2023", formula: "rev_23 - cogs_23 - sga_23", expected: 820, unit: "$M" }
  - { id: op_25, label: "Operating profit, FY2025", formula: "rev_25 - cogs_25 - sga_25", expected: 293.6, unit: "$M", decimals: 1 }
  - { id: profit_drop, label: "Fall in operating profit", formula: "op_23 - op_25", expected: 526.4, unit: "$M", decimals: 1 }
  - { id: profit_drop_pct, label: "Fall in operating profit (%)", formula: "profit_drop / op_23", expected: 0.642, unit: "%", decimals: 0 }
  - { id: share_23, label: "Market share, FY2023", formula: "units_23 / market_units", expected: 0.40, unit: "%" }
  - { id: share_25, label: "Market share, FY2025", formula: "units_25 / market_units", expected: 0.32, unit: "%" }
  # --- Profit bridge FY2023 → FY2025 ---
  - { id: volume_effect, label: "Volume effect (fewer tubes at the old net price)", formula: "(units_25 - units_23) * net_23", expected: -260, unit: "$M" }
  - { id: price_effect, label: "Net price effect (new volume × change in net price)", formula: "units_25 * (net_25 - net_23)", expected: -262.4, unit: "$M", decimals: 1 }
  - { id: cogs_effect, label: "Cost-of-goods effect", formula: "cogs_23 - cogs_25", expected: 16, unit: "$M" }
  - { id: sga_effect, label: "SG&A effect", formula: "sga_23 - sga_25", expected: -20, unit: "$M" }
  - { id: bridge_total, label: "Bridge total (must equal the profit change)", formula: "volume_effect + price_effect + cogs_effect + sga_effect", expected: -526.4, unit: "$M", decimals: 1 }
  # --- Inside the net price ---
  - { id: list_effect, label: "Net price gained from the list-price increase", formula: "(list_25 - list_23) * (1 - gtn_23)", expected: 26, unit: "$/tube" }
  - { id: gtn_effect, label: "Net price lost to higher gross-to-net", formula: "list_25 * (gtn_23 - gtn_25)", expected: -108, unit: "$/tube" }
  - { id: net_change, label: "Change in net price per tube", formula: "net_25 - net_23", expected: -82, unit: "$/tube" }
  - { id: controllable_gtn, label: "Gross-to-net increase from PBM rebates and copay support", formula: "rebate_chg + copay_chg", expected: 0.17, unit: "pts" }
  - { id: gtn_change, label: "Increase in gross-to-net", formula: "gtn_25 - gtn_23", expected: 0.20, unit: "pts" }
  - { id: gtn_components, label: "Sum of gross-to-net components (Exhibit 2)", formula: "rebate_chg + copay_chg + gov_chg + dist_chg", expected: 0.20, unit: "pts" }
  # --- Should Corvane cut copay assistance? ---
  - { id: new_gtn, label: "Gross-to-net after the copay cut", formula: "gtn_25 - copay_cut", expected: 0.50, unit: "%" }
  - { id: new_net, label: "Net price after the copay cut", formula: "list_25 * (1 - new_gtn)", expected: 270, unit: "$/tube" }
  - { id: new_units, label: "Tubes after 5% volume loss", formula: "units_25 * (1 - volume_loss)", expected: 3.04, unit: "million tubes" }
  - { id: new_rev, label: "Revenue after the copay cut, less cost of goods", formula: "new_units * (new_net - cogs_unit)", expected: 760, unit: "$M" }
  - { id: new_op, label: "Operating profit after the copay cut", formula: "new_units * (new_net - cogs_unit) - sga_25", expected: 340, unit: "$M" }
  - { id: op_gain, label: "Profit gain from the copay cut", formula: "new_op - op_25", expected: 46.4, unit: "$M", decimals: 1 }
  - { id: contrib_25, label: "Contribution (revenue minus cost of goods), FY2025", formula: "units_25 * (net_25 - cogs_unit)", expected: 713.6, unit: "$M", decimals: 1 }
  - { id: breakeven_units, label: "Break-even volume after the copay cut", formula: "units_25 * (net_25 - cogs_unit) / (new_net - cogs_unit)", expected: 2.8544, unit: "million tubes" }
  - { id: max_volume_loss, label: "Maximum volume loss before the cut stops paying off", formula: "1 - breakeven_units / units_25", expected: 0.108, unit: "%", decimals: 0 }

answer:
  calc: profit_drop
  headline: "Profit fell {{profit_drop}} ({{profit_drop_pct}}), half from lost volume and half from a 20-point jump in gross-to-net — a targeted copay cut adds ~{{op_gain}}."

exhibits:
  - id: exhibit-1
    title: "Dermavel summary financials"
    kind: table
    ask: "Here are Dermavel's key numbers. Why did operating profit fall?"
    columns: ["", "FY2023", "FY2025"]
    rows:
      - ["Tubes sold", "{{units_23}}", "{{units_25}}"]
      - ["List price per tube", "{{list_23}}", "{{list_25}}"]
      - ["Gross-to-net discount (rebates, copay support, fees)", "{{gtn_23}}", "{{gtn_25}}"]
      - ["Cost of goods per tube", "{{cogs_unit}}", "{{cogs_unit}}"]
      - ["Sales, marketing & admin", "{{sga_23}}", "{{sga_25}}"]
      - ["**Operating profit**", "**{{op_23}}**", "**{{op_25}}**"]
    note: "Illustrative data created for this practice case. Dermavel and Corvane are fictional."
    insight: |
      List price went **up**, yet profit collapsed. That contradiction is the
      clue: the money is leaking between list price and net price.
  - id: exhibit-2
    title: "Change in gross-to-net components, FY2023 → FY2025 (percentage points of list price)"
    kind: bar
    unit: "pts"
    ask: "What is driving the bigger discount?"
    data:
      - { label: "PBM rebates", value: rebate_chg }
      - { label: "Copay assistance", value: copay_chg }
      - { label: "Government rebates", value: gov_chg }
      - { label: "Distributor fees", value: dist_chg }
    note: "Illustrative data created for this practice case."
    insight: |
      Rebates to pharmacy benefit managers (PBMs) and copay assistance explain
      {{controllable_gtn}} of the {{gtn_change}}. Both are decisions Corvane controls, at least partly.
---

## Prompt

Our client is Corvane Therapeutics, a mid-size specialty pharma company. Its biggest product is **Dermavel**, a branded prescription cream for moderate psoriasis that makes up about 60% of company profit.

Over the last two years Dermavel's operating profit has fallen sharply, even though the company has raised the list price. Dermavel's main patent expires in 2028, so the CEO is worried about losing even more before then.

The CEO has asked us: **why has Dermavel's profit fallen, and what should Corvane do about it?**

## Clarifying information

- Q: What is the objective — restore profit, grow share, or prepare for the patent expiry?
  A: Restore as much profit as possible over the next two years, before the patent expires.
- Q: Has the overall market changed?
  A: Total prescriptions in the category are flat at about **{{market_units}}** a year. A new oral (pill) competitor launched in 2024.
- Q: What does "gross-to-net" mean here?
  A: The gap between list price and the cash Corvane actually keeps: rebates paid to insurers' pharmacy benefit managers (PBMs), copay assistance paid on behalf of patients, government rebates and distributor fees.
- Q: Are there other Corvane products affected?
  A: No — focus on Dermavel only.
- Q: Has the cost of making the cream changed?
  A: No, cost of goods is stable at about {{cogs_unit}}.

## Structure

> **Ask:** How would you approach this problem?

Start from the **profit equation** and push it one level further than usual, because in pharma the price that matters is the *net* price:

- **Profit = Revenue − Costs**
  - Revenue = Volume × Net price
    - Volume: market size (flat) × Dermavel's share (did the new pill take patients?)
    - Net price = List price × (1 − gross-to-net)
      - List price changes
      - Gross-to-net: PBM rebates, copay assistance, government rebates, distributor fees
  - Costs
    - Cost of goods (per tube × volume)
    - Sales, marketing & admin (mostly fixed)

State a hypothesis early: *"List price rose, so I suspect volume fell to the new competitor and net price fell because of larger rebates or patient support."*

## Math walkthrough

> **Ask:** Quantify what drove the profit decline. Then: Corvane is considering cutting copay assistance by 5 points of list price, which it expects to cost 5% of volume. Is it worth it?

**1. Net price per tube.**
FY2023: $500 × (1 − 35%) = **{{net_23}}**. FY2025: $540 × (1 − 55%) = **{{net_25}}**.
The bigger discount changed net price by {{gtn_effect}}, while the list increase added +{{list_effect}} — a net change of {{net_change}}.

**2. Profit in each year.**
FY2023: 4.0m × $325 = {{rev_23}} revenue − {{cogs_23}} COGS − {{sga_23}} SG&A = **{{op_23}}**.
FY2025: 3.2m × $243 = {{rev_25}} − {{cogs_25}} − {{sga_25}} = **{{op_25}}**.
Profit fell **{{profit_drop}}**, or about **{{profit_drop_pct}}**.

**3. Bridge the gap.**

| Driver | Calculation | Impact |
|---|---|---|
| Volume | (3.2m − 4.0m) × $325 | {{volume_effect}} |
| Net price | 3.2m × ($243 − $325) | {{price_effect}} |
| Cost of goods | $80M − $64M | +{{cogs_effect}} |
| SG&A | $400M − $420M | {{sga_effect}} |
| **Total** | | **{{bridge_total}}** |

Volume and net price each explain about half. Share fell from {{share_23}} to {{share_25}} of a flat market — consistent with the new oral competitor.

**4. The copay cut.**
New gross-to-net = 55% − 5 pts = {{new_gtn}}, so net price = $540 × 50% = **{{new_net}}**.
New volume = 3.2m × 95% = {{new_units}}.
New profit = 3.04m × ($270 − $20) − $420M = {{new_rev}} − $420M = **{{new_op}}**, up **{{op_gain}}**.

**5. How much volume can we afford to lose?**
Today's contribution = 3.2m × ($243 − $20) = {{contrib_25}}. After the cut, each tube contributes $250, so break-even volume = $713.6M ÷ $250 ≈ {{breakeven_units}}.
That means the cut still pays off unless volume falls by more than **~{{max_volume_loss}}** — about twice the client's estimate.

## Synthesis

> **Ask:** Summarize your recommendation for the CEO.

**Dermavel's profit fell {{profit_drop}} ({{profit_drop_pct}}) because Corvane is selling 20% fewer tubes *and* keeping much less of each sale: the gross-to-net discount jumped from 35% to 55%, wiping out the list-price increase. Corvane should rein in the discounts it controls, starting with a targeted copay cut worth roughly {{op_gain}} a year.**

1. **Volume ({{volume_effect}}):** share dropped from {{share_23}} to {{share_25}} as the new oral competitor took patients.
2. **Net price ({{price_effect}}):** PBM rebates (+10 pts) and copay assistance (+7 pts) drove most of the extra discount.
3. **Action:** trimming copay support by 5 points adds ~{{op_gain}} and stays profitable unless volume drops more than ~{{max_volume_loss}}; target it at patients with good insurance coverage so adherent patients aren't hurt.

**Next steps:** renegotiate PBM contracts using real outcomes data; focus the sales force on dermatologists where Dermavel still wins; prepare a lifecycle plan for the 2028 patent expiry (new formulation, authorized generic).

## Common mistakes

- Concluding "price fell" when **list** price actually rose — missing the list-versus-net distinction is the single biggest trap in pharma cases.
- Only looking at revenue and forgetting to check costs (SG&A actually rose).
- Building a bridge that doesn't add up to the total change — always check your parts sum to {{profit_drop}}.
- Recommending a copay cut without asking how many patients might stop treatment, or without considering patient-access and reputational effects.

## What top candidates do differently

- Name the gross-to-net mechanism in the structure, before seeing the data.
- Quantify the bridge and say which half matters more and which levers the client controls.
- Turn the copay question into a **break-even** ("we can lose up to ~{{max_volume_loss}} of volume") rather than a single yes/no number — it shows judgment about uncertainty.
- Raise the patient angle unprompted: who loses copay support, and is there a fairer way to target it?

## Creative question

The new oral competitor is winning patients who dislike applying cream every day. Beyond pricing, what could Corvane do to defend Dermavel's position over the next two years?

## Model answer

Group ideas by **patient, prescriber and payer**:

- **Patient:** an easier-to-use format (once-daily foam or spray), adherence reminders through an app, nurse support for the first month.
- **Prescriber:** publish head-to-head or real-world data showing where a topical is the better choice (for example, patients who want to avoid systemic side effects); focus field teams on high-volume dermatologists.
- **Payer:** offer outcomes-based contracts (rebates tied to results) instead of blanket rebates, so Corvane only pays more when the drug works.

A top candidate prioritizes: "The fastest lever is focusing on the patients for whom a topical is clinically preferable; the most valuable longer-term lever is a new formulation that can extend the franchise past 2028."
