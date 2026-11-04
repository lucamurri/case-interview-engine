---
id: pump-maker-aftermarket
title: "After the Sale: An Industrial Pump Maker's Service Business"
client: "Ostrander Fluid Systems (fictional), a US maker of industrial pumps"
summary: "Revenue is up but profit is down at an industrial pump maker. The answer is not in new pumps; it is in the spare parts and service customers buy after the sale."
industry: other
sub_industry: "Industrials"
type: profitability
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company or market data.
inputs:
  equip_rev_23:    { value: 400,  unit: "$M",              label: "New-pump (equipment) revenue, FY2023" }
  equip_rev_25:    { value: 440,  unit: "$M",              label: "New-pump revenue, FY2025" }
  equip_margin:    { value: 0.15, unit: "%",               label: "Operating margin on new pumps" }
  base_23:         { value: 45,   unit: "thousand pumps",  label: "Installed base of Ostrander pumps in service, FY2023" }
  base_25:         { value: 50,   unit: "thousand pumps",  label: "Installed base, FY2025" }
  spend_per_pump:  { value: 4000, unit: "$/pump/year",     label: "Customer spend on parts and service per pump per year (all suppliers)" }
  capture_23:      { value: 0.60, unit: "%",               label: "Ostrander's capture of that spend, FY2023" }
  am_margin:       { value: 0.50, unit: "%",               label: "Operating margin on aftermarket (parts and service)" }
  mix_young:       { value: 0.25, unit: "%",               label: "Share of installed base aged 0–2 years" }
  mix_mid:         { value: 0.25, unit: "%",               label: "Share of installed base aged 3–5 years" }
  mix_old:         { value: 0.50, unit: "%",               label: "Share of installed base aged 6+ years" }
  cap_young:       { value: 0.80, unit: "%",               label: "Capture rate on pumps aged 0–2 years" }
  cap_mid:         { value: 0.40, unit: "%",               label: "Capture rate on pumps aged 3–5 years" }
  cap_old:         { value: 0.20, unit: "%",               label: "Capture rate on pumps aged 6+ years" }
  program_cost:    { value: 6,    unit: "$M",              label: "Annual cost of the proposed service-contract program" }
  capture_gain:    { value: 0.15, unit: "pts",             label: "Capture gain the team expects from the program" }

calculations:
  - { id: capture_25, label: "Ostrander's capture of aftermarket spend, FY2025 (weighted by pump age)", formula: "mix_young * cap_young + mix_mid * cap_mid + mix_old * cap_old", expected: 0.40, unit: "%" }
  # --- Segment P&L ---
  - { id: pool_23, label: "Aftermarket spend on Ostrander pumps, FY2023", formula: "base_23 * spend_per_pump / 1000", expected: 180, unit: "$M" }
  - { id: pool_25, label: "Aftermarket spend on Ostrander pumps, FY2025", formula: "base_25 * spend_per_pump / 1000", expected: 200, unit: "$M" }
  - { id: am_rev_23, label: "Aftermarket revenue, FY2023", formula: "pool_23 * capture_23", expected: 108, unit: "$M" }
  - { id: am_rev_25, label: "Aftermarket revenue, FY2025", formula: "pool_25 * capture_25", expected: 80, unit: "$M" }
  - { id: am_profit_23, label: "Aftermarket profit, FY2023", formula: "am_rev_23 * am_margin", expected: 54, unit: "$M" }
  - { id: am_profit_25, label: "Aftermarket profit, FY2025", formula: "am_rev_25 * am_margin", expected: 40, unit: "$M" }
  - { id: eq_profit_23, label: "Equipment profit, FY2023", formula: "equip_rev_23 * equip_margin", expected: 60, unit: "$M" }
  - { id: eq_profit_25, label: "Equipment profit, FY2025", formula: "equip_rev_25 * equip_margin", expected: 66, unit: "$M" }
  - { id: rev_23, label: "Total revenue, FY2023", formula: "equip_rev_23 + am_rev_23", expected: 508, unit: "$M" }
  - { id: rev_25, label: "Total revenue, FY2025", formula: "equip_rev_25 + am_rev_25", expected: 520, unit: "$M" }
  - { id: profit_23, label: "Operating profit, FY2023", formula: "eq_profit_23 + am_profit_23", expected: 114, unit: "$M" }
  - { id: profit_25, label: "Operating profit, FY2025", formula: "eq_profit_25 + am_profit_25", expected: 106, unit: "$M" }
  - { id: profit_drop, label: "Fall in operating profit", formula: "profit_23 - profit_25", expected: 8, unit: "$M" }
  - { id: rev_growth, label: "Revenue growth", formula: "rev_25 / rev_23 - 1", expected: 0.0236, unit: "%", decimals: 1 }
  - { id: am_rev_share_23, label: "Aftermarket share of revenue, FY2023", formula: "am_rev_23 / rev_23", expected: 0.2126, unit: "%", decimals: 0 }
  - { id: am_profit_share_23, label: "Aftermarket share of profit, FY2023", formula: "am_profit_23 / profit_23", expected: 0.4737, unit: "%", decimals: 0 }
  - { id: margin_ratio, label: "Aftermarket margin versus new-pump margin", formula: "am_margin / equip_margin", expected: 3.33, unit: "x", decimals: 1 }
  # --- Profit bridge ---
  - { id: eq_effect, label: "Equipment growth effect", formula: "eq_profit_25 - eq_profit_23", expected: 6, unit: "$M" }
  - { id: base_effect, label: "Installed-base growth effect (at the old capture rate)", formula: "(pool_25 - pool_23) * capture_23 * am_margin", expected: 6, unit: "$M" }
  - { id: capture_effect, label: "Capture-rate effect", formula: "pool_25 * (capture_25 - capture_23) * am_margin", expected: -20, unit: "$M" }
  - { id: bridge_total, label: "Bridge total (must equal the profit change)", formula: "eq_effect + base_effect + capture_effect", expected: -8, unit: "$M" }
  - { id: leakage, label: "Aftermarket spend going to other suppliers, FY2025", formula: "pool_25 * (1 - capture_25)", expected: 120, unit: "$M" }
  # --- Capture by pump age ---
  - { id: old_spend, label: "Aftermarket spend on pumps aged 6+ years", formula: "pool_25 * mix_old", expected: 100, unit: "$M" }
  - { id: old_leakage, label: "Spend on pumps aged 6+ years going to other suppliers", formula: "old_spend * (1 - cap_old)", expected: 80, unit: "$M" }
  - { id: old_leak_share, label: "Older pumps' share of the spend going elsewhere", formula: "old_leakage / leakage", expected: 0.667, unit: "%", decimals: 0 }
  # --- Service-contract program ---
  - { id: value_per_point, label: "Profit from one point of capture", formula: "pool_25 * 0.01 * am_margin", expected: 1, unit: "$M" }
  - { id: breakeven_gain, label: "Capture gain needed to pay for the program", formula: "program_cost / (pool_25 * am_margin)", expected: 0.06, unit: "pts" }
  - { id: program_gain, label: "Extra aftermarket profit at the expected capture gain", formula: "pool_25 * capture_gain * am_margin", expected: 15, unit: "$M" }
  - { id: program_net, label: "Net profit from the program", formula: "program_gain - program_cost", expected: 9, unit: "$M" }
  - { id: new_capture, label: "Capture rate with the program", formula: "capture_25 + capture_gain", expected: 0.55, unit: "%" }
  - { id: new_profit, label: "Operating profit with the program", formula: "profit_25 + program_net", expected: 115, unit: "$M" }

answer:
  calc: program_net
  headline: "Profit fell {{profit_drop}} because Ostrander's share of parts and service on its own pumps fell from {{capture_23}} to {{capture_25}}; a service-contract program pays off above {{breakeven_gain}} of recaptured share and should add ~{{program_net}}."

exhibits:
  - id: exhibit-1
    title: "Ostrander results by business"
    kind: table
    ask: "Here are results for the two businesses. What's going on?"
    columns: ["", "FY2023", "FY2025"]
    rows:
      - ["New-pump revenue", "{{equip_rev_23}}", "{{equip_rev_25}}"]
      - ["New-pump operating margin", "{{equip_margin}}", "{{equip_margin}}"]
      - ["Installed base (pumps in service)", "{{base_23}}", "{{base_25}}"]
      - ["Customer spend on parts and service per pump (all suppliers)", "{{spend_per_pump}}", "{{spend_per_pump}}"]
      - ["Ostrander's capture of that spend", "{{capture_23}}", "{{capture_25}}"]
      - ["Aftermarket operating margin", "{{am_margin}}", "{{am_margin}}"]
    note: "Illustrative data created for this practice case. Ostrander is fictional."
    insight: |
      Aftermarket margins are {{margin_ratio}} new-pump margins, and
      Ostrander's capture of its own installed base collapsed. The installed
      base keeps growing, so the opportunity is getting bigger while the share shrinks.
  - id: exhibit-2
    title: "Ostrander's aftermarket capture rate by pump age, FY2025"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Here is capture by pump age. Where is the business leaking?"
    data:
      - { label: "0–2 years (under warranty)", value: cap_young }
      - { label: "3–5 years", value: cap_mid }
      - { label: "6+ years", value: cap_old }
    note: "Illustrative data created for this practice case. Share of the installed base by age: 0–2 years {{mix_young}}, 3–5 years {{mix_mid}}, 6+ years {{mix_old}}. Since 2024, independent parts suppliers have sold lower-priced copies of Ostrander's most common wear parts (seals, bearings, impellers)."
    insight: |
      Once the warranty ends, customers shop around. Half of the installed
      base is more than six years old, and Ostrander captures only {{cap_old}} there.
---

## Prompt

Our client, Ostrander Fluid Systems, designs and builds centrifugal pumps used in water treatment, chemicals and food processing. It sells new pumps through distributors and also sells spare parts and repair services for pumps already installed, which the industry calls the **aftermarket**.

Over the last two years revenue has grown, and the sales team has had record years selling new pumps. Yet operating profit has fallen. The CEO has asked us: **why is profit falling while revenue grows, and what should Ostrander do?**

## Clarifying information

- Q: What is the objective?
  A: Return operating profit to at least the FY2023 level within two years.
- Q: How long do pumps last, and what do they need?
  A: Pumps run for 15–20 years. Seals, bearings and impellers wear out and are replaced every few years, and pumps need periodic repair.
- Q: Who else sells parts and service for Ostrander pumps?
  A: Independent parts suppliers, which sell copies of Ostrander's wear parts, local repair shops, and customers' own maintenance teams.
- Q: Have prices or costs changed?
  A: No: margins on both businesses are stable. Assume the same margins in both years.
- Q: Does Ostrander offer service contracts today?
  A: Only a warranty for the first two years. There is no multi-year service offer.

## Structure

> **Ask:** How would you structure the problem?

Split profit by **business**, because new pumps and the aftermarket have very different economics, and size the aftermarket from the installed base:

- **Profit = New-pump profit + Aftermarket profit**
  - **New-pump profit** = Units × Price × Margin
  - **Aftermarket profit** = Installed base × Spend per pump × Ostrander's capture × Margin
    - Installed base: grows with every new pump sold
    - Spend per pump: parts and service the customer needs each year
    - Capture: share of that spend that comes to Ostrander, by pump age, customer type and product
    - Margin on parts versus service
- **Competition in the aftermarket:** independent parts makers, repair shops, customers' in-house teams

Hypothesis: *"In industrial equipment, most of the profit is usually in parts and service. If revenue is up but profit is down, I suspect the mix shifted toward low-margin new pumps, or Ostrander is losing aftermarket business to cheaper suppliers."*

## Math walkthrough

> **Ask:** First, using Exhibit 1, explain the change in profit. Then, using Exhibit 2, where is Ostrander losing aftermarket business? Finally, the team proposes a {{program_cost}}-a-year service-contract program (multi-year parts-and-repair packages, sold with each new pump and offered to owners of older pumps) that it expects to raise capture by {{capture_gain}}. Is it worth it?

**1. Size the aftermarket.**
Spend on Ostrander pumps: 45k × $4,000 = **{{pool_23}}** in FY2023 and 50k × $4,000 = **{{pool_25}}** in FY2025.
Ostrander's aftermarket revenue: $180M × 60% = **{{am_rev_23}}**, then $200M × 40% = **{{am_rev_25}}**.

**2. Profit by business.**

| Business | FY2023 | FY2025 |
|---|---|---|
| New-pump profit (15% margin) | {{eq_profit_23}} | {{eq_profit_25}} |
| Aftermarket profit (50% margin) | {{am_profit_23}} | {{am_profit_25}} |
| **Total** | **{{profit_23}}** | **{{profit_25}}** |

Revenue grew {{rev_growth}} (from {{rev_23}} to {{rev_25}}) but profit fell **{{profit_drop}}**. In FY2023 the aftermarket was only {{am_rev_share_23}} of revenue but {{am_profit_share_23}} of profit.

**3. Bridge.**

| Driver | Calculation | Impact |
|---|---|---|
| More new pumps | $66M − $60M | +{{eq_effect}} |
| Bigger installed base | ($200M − $180M) × 60% × 50% | +{{base_effect}} |
| Lower capture | $200M × (40% − 60%) × 50% | {{capture_effect}} |
| **Total** | | **{{bridge_total}}** |

The capture loss alone outweighs all the growth. Today **{{leakage}}** a year of parts and service on Ostrander pumps goes to someone else.

**4. Where it leaks (Exhibit 2).**
The overall rate is the age-weighted average: 25% × 80% + 25% × 40% + 50% × 20% = **{{capture_25}}**.
Pumps aged 6+ years account for $200M × 50% = {{old_spend}} of spend, and Ostrander loses $100M × 80% = **{{old_leakage}}** of it, which is **{{old_leak_share}}** of all the spend going elsewhere.

**5. The service-contract program.**
Each point of capture is worth $200M × 1% × 50% = **{{value_per_point}}** of profit.
Break-even: $6M ÷ $1M per point = **{{breakeven_gain}}** of capture.
At the expected {{capture_gain}}: $200M × 15% × 50% = {{program_gain}} − $6M = **{{program_net}}** a year.
Profit would rise to $106M + $9M = **{{new_profit}}**, above the FY2023 level, with capture at {{new_capture}}.

## Synthesis

> **Ask:** What should Ostrander's CEO do?

**Ostrander's profit fell {{profit_drop}} because it is losing the high-margin aftermarket on its own pumps: capture fell from {{capture_23}} to {{capture_25}}, mainly on out-of-warranty pumps. It should launch the service-contract program, which pays off above {{breakeven_gain}} of recaptured share and should add about {{program_net}} a year, enough to beat the FY2023 profit level.**

1. **The real business is the aftermarket:** it earns a {{am_margin}} margin versus {{equip_margin}} on new pumps, and was {{am_profit_share_23}} of profit in FY2023.
2. **The leak is out-of-warranty pumps:** Ostrander captures only {{cap_old}} on pumps over six years old, and these represent {{old_leak_share}} of the spend going to competitors.
3. **The program has a wide safety margin:** it needs {{breakeven_gain}} to break even and the team expects {{capture_gain}}.

**Risks and next steps:** independent suppliers may cut prices further, so the offer must compete on uptime and reliability, not just price; distributors may resist if Ostrander sells service directly, so share margin with them; pilot with the largest water-utility customers; track contract attach rates on every new pump sold.

## Common mistakes

- Celebrating revenue growth and recommending more new-pump sales, which grows the lowest-margin part of the business.
- Treating the aftermarket as a fixed share of revenue instead of building it from the installed base.
- Missing that a growing installed base should *raise* aftermarket profit, which makes the capture loss even larger than the headline suggests.
- Recommending a price cut on parts without checking whether customers leave for price or for convenience.

## What top candidates do differently

- Structure profit by business from the start and expect the aftermarket to be the profit engine.
- Build the bridge so the installed-base growth and capture loss are separated.
- Use Exhibit 2 to target the fix: out-of-warranty pumps, not the whole base.
- Express the program as a break-even in capture points, which makes the decision easy to discuss with the CEO.

## Creative question

Apart from service contracts, how could Ostrander win back aftermarket business on older pumps?

## Model answer

Organize ideas around **why customers leave**: price, convenience and awareness.

- **Price:** a second-line "value" range of genuine parts for older pumps; bundle discounts on overhaul kits; trade-in credits toward a new pump.
- **Convenience:** sensors that monitor vibration and temperature and order parts before a failure; same-day parts delivery through distributors; a certified network of local repair shops using genuine parts.
- **Awareness:** show customers the total cost of a copied part (more breakdowns, shorter life); reliability guarantees that only apply with genuine parts; account managers for large customers.

A top candidate prioritizes: "Monitoring sensors are the most powerful, because they turn Ostrander from a parts vendor into the company that keeps the pump running, which is what the customer is really paying for."
