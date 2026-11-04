---
id: pe-physical-therapy-rollup
title: "Roll-Up Rehab: Private Equity Buying Physical-Therapy Clinics"
client: "Calloway Pine Capital (fictional), a mid-market private equity fund"
summary: "A PE fund wants to buy a 40-clinic physical-therapy chain and bolt on small clinics. Does the deal clear the fund's 2.5x return target, and what is the return really built on?"
industry: pharma-healthcare
sub_industry: "Healthcare services / private equity"
type: m-and-a
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real deal or market data.
inputs:
  clinics:            { value: 40,    unit: "clinics", label: "Orrin Valley clinics today" }
  rev_clinic:         { value: 2.0,   unit: "$M",  label: "Revenue per clinic per year", decimals: 1 }
  margin:             { value: 0.125, unit: "%",   label: "EBITDA margin", decimals: 1 }
  entry_multiple:     { value: 10,    unit: "x",   label: "Entry price (EV/EBITDA)" }
  debt_share:         { value: 0.50,  unit: "%",   label: "Share of the entry price funded with debt" }
  organic_g:          { value: 0.05,  unit: "%",   label: "Same-clinic EBITDA growth per year" }
  hold:               { value: 5,     unit: "years", label: "Holding period" }
  addons:             { value: 30,    unit: "clinics", label: "Small clinics to acquire (add-ons)" }
  addon_ebitda:       { value: 0.2,   unit: "$M",  label: "EBITDA per add-on clinic at purchase", decimals: 1 }
  addon_multiple:     { value: 6,     unit: "x",   label: "Price paid for add-on clinics (EV/EBITDA)" }
  addon_uplift:       { value: 0.05,  unit: "$M",  label: "Extra EBITDA per add-on clinic after integration", decimals: 2 }
  exit_multiple:      { value: 10,    unit: "x",   label: "Exit multiple, base case" }
  downside_multiple:  { value: 8,     unit: "x",   label: "Exit multiple, downside case" }
  paydown:            { value: 20,    unit: "$M",  label: "Debt repaid from cash flow over the hold" }
  target_moic:        { value: 2.5,   unit: "x",   label: "Fund's target multiple of invested capital", decimals: 1 }

calculations:
  # --- Entry ---
  - { id: ebitda_clinic, label: "EBITDA per clinic", formula: "rev_clinic * margin", expected: 0.25, unit: "$M", decimals: 2 }
  - { id: entry_ebitda, label: "Platform EBITDA at entry", formula: "clinics * ebitda_clinic", expected: 10, unit: "$M" }
  - { id: entry_ev, label: "Entry enterprise value", formula: "entry_ebitda * entry_multiple", expected: 100, unit: "$M" }
  - { id: entry_debt, label: "Debt at entry", formula: "entry_ev * debt_share", expected: 50, unit: "$M" }
  - { id: entry_equity, label: "Equity invested by the fund", formula: "entry_ev - entry_debt", expected: 50, unit: "$M" }
  - { id: entry_leverage, label: "Debt / EBITDA at entry", formula: "entry_debt / entry_ebitda", expected: 5.0, unit: "x", decimals: 1 }
  # --- EBITDA at exit ---
  - { id: growth_factor, label: "Organic growth factor over the hold", formula: "(1 + organic_g) ^ hold", expected: 1.2763, unit: "x", decimals: 2 }
  - { id: organic_ebitda, label: "Platform EBITDA at exit (organic only)", formula: "entry_ebitda * (1 + organic_g) ^ hold", expected: 12.763, unit: "$M", decimals: 1 }
  - { id: addon_clinic_price, label: "Price per add-on clinic", formula: "addon_ebitda * addon_multiple", expected: 1.2, unit: "$M", decimals: 1 }
  - { id: addon_price, label: "Total spent on add-ons (funded with debt)", formula: "addons * addon_ebitda * addon_multiple", expected: 36, unit: "$M" }
  - { id: addon_clinic_ebitda, label: "EBITDA per add-on clinic after integration", formula: "addon_ebitda + addon_uplift", expected: 0.25, unit: "$M", decimals: 2 }
  - { id: addon_ebitda_total, label: "Add-on EBITDA at exit", formula: "addons * (addon_ebitda + addon_uplift)", expected: 7.5, unit: "$M", decimals: 1 }
  - { id: addon_clinic_value, label: "Value of one integrated add-on at the exit multiple", formula: "addon_clinic_ebitda * exit_multiple", expected: 2.5, unit: "$M", decimals: 1 }
  - { id: exit_ebitda, label: "Total EBITDA at exit", formula: "organic_ebitda + addon_ebitda_total", expected: 20.263, unit: "$M", decimals: 1 }
  # --- Returns, base case ---
  - { id: exit_ev, label: "Exit enterprise value", formula: "exit_ebitda * exit_multiple", expected: 202.63, unit: "$M" }
  - { id: exit_debt, label: "Debt at exit", formula: "entry_debt + addon_price - paydown", expected: 66, unit: "$M" }
  - { id: exit_equity, label: "Equity value at exit", formula: "exit_ev - exit_debt", expected: 136.63, unit: "$M" }
  - { id: moic, label: "Multiple of invested capital (MOIC)", formula: "exit_equity / entry_equity", expected: 2.733, unit: "x", decimals: 1 }
  - { id: irr, label: "Approximate IRR", formula: "(exit_equity / entry_equity) ^ (1 / hold) - 1", expected: 0.2227, unit: "%", decimals: 0 }
  # --- Where does the return come from? ---
  - { id: equity_gain, label: "Equity value created", formula: "exit_equity - entry_equity", expected: 86.63, unit: "$M", decimals: 0 }
  - { id: organic_value, label: "Value from organic EBITDA growth", formula: "(organic_ebitda - entry_ebitda) * exit_multiple", expected: 27.63, unit: "$M", decimals: 0 }
  - { id: addon_value, label: "Value from add-ons (exit value minus price paid)", formula: "addon_ebitda_total * exit_multiple - addon_price", expected: 39, unit: "$M" }
  - { id: bridge_check, label: "Organic + add-ons + debt paydown (must equal equity gain)", formula: "organic_value + addon_value + paydown", expected: 86.63, unit: "$M", decimals: 0 }
  - { id: addon_share, label: "Add-ons' share of value created", formula: "addon_value / equity_gain", expected: 0.450, unit: "%", decimals: 0 }
  - { id: noaddon_equity, label: "Exit equity without add-ons", formula: "organic_ebitda * exit_multiple - (entry_debt - paydown)", expected: 97.63, unit: "$M", decimals: 0 }
  - { id: noaddon_moic, label: "MOIC without add-ons", formula: "noaddon_equity / entry_equity", expected: 1.953, unit: "x", decimals: 1 }
  # --- Downside and break-even ---
  - { id: downside_ev, label: "Exit value at the downside multiple", formula: "exit_ebitda * downside_multiple", expected: 162.10, unit: "$M" }
  - { id: downside_moic, label: "MOIC at the downside multiple", formula: "(downside_ev - exit_debt) / entry_equity", expected: 1.922, unit: "x", decimals: 1 }
  - { id: needed_equity, label: "Exit equity needed for the target MOIC", formula: "target_moic * entry_equity", expected: 125, unit: "$M" }
  - { id: breakeven_multiple, label: "Lowest exit multiple that still hits the target", formula: "(target_moic * entry_equity + exit_debt) / exit_ebitda", expected: 9.426, unit: "x", decimals: 1 }
  - { id: exit_leverage, label: "Debt / EBITDA at exit", formula: "exit_debt / exit_ebitda", expected: 3.257, unit: "x", decimals: 1 }

answer:
  calc: moic
  headline: "Buy Orrin Valley: the plan returns ~{{moic}} (about {{irr}} a year), above the {{target_moic}} target — but only because of the add-on program, so the deal is a bet on executing the roll-up."

exhibits:
  - id: exhibit-1
    title: "Orrin Valley Rehab and the fund's investment plan"
    kind: table
    ask: "Here are the target's numbers and the deal team's plan. What return does the fund make?"
    columns: ["Item", "Assumption"]
    rows:
      - ["Clinics today", "{{clinics}}, each with {{rev_clinic}} of revenue"]
      - ["EBITDA margin", "{{margin}}"]
      - ["Asking price", "{{entry_multiple}} EBITDA, funded {{debt_share}} with debt"]
      - ["Same-clinic EBITDA growth", "{{organic_g}} per year for {{hold}}"]
      - ["Add-on program", "Buy {{addons}} (single-site practices), each with {{addon_ebitda}} of EBITDA, at {{addon_multiple}} EBITDA (funded with debt)"]
      - ["Integration benefit", "+{{addon_uplift}} of EBITDA per add-on clinic (better payer rates, shared billing and scheduling)"]
      - ["Debt repaid from cash flow", "{{paydown}} over the hold"]
      - ["Exit", "After {{hold}}, at {{exit_multiple}} EBITDA"]
    note: "Illustrative data created for this practice case. Orrin Valley Rehab and Calloway Pine are fictional."
    insight: |
      The fund buys the platform at {{entry_multiple}} but buys add-ons at
      {{addon_multiple}}. Once integrated, every add-on is valued like the
      platform — that gap is the heart of a roll-up.
  - id: exhibit-2
    title: "Typical purchase multiples for physical-therapy businesses, by size (EV/EBITDA)"
    kind: bar
    unit: "x"
    decimals: 0
    ask: "What does this chart tell you about the roll-up strategy — and about its risks?"
    data:
      - { label: "Single clinic", value: addon_multiple }
      - { label: "Small group (2–10 clinics)", value: 8 }
      - { label: "Regional platform (30–60 clinics)", value: entry_multiple }
      - { label: "National platform (100+ clinics)", value: 12 }
    reference: { value: exit_multiple, label: "Exit multiple in the base case" }
    note: "Illustrative data created for this practice case; not actual transaction statistics."
    insight: |
      Bigger platforms sell for higher multiples because buyers pay for scale,
      payer contracts and management depth. Buying small and selling big is
      "multiple arbitrage". The flip side: if sector multiples fall, the whole
      platform is worth less at exit.
---

## Prompt

Our client, Calloway Pine Capital, is a mid-market private equity fund. It is considering buying **Orrin Valley Rehab**, a chain of **{{clinics}}** outpatient physical-therapy clinics in the US Midwest. Patients come mostly after surgery, sports injuries or for chronic back pain; most revenue comes from commercial insurers and Medicare.

The deal team's plan is a classic "roll-up": buy Orrin Valley as a platform, then acquire dozens of small independent clinics and plug them into its systems. The fund's investment committee meets next week and asks: **should Calloway Pine buy Orrin Valley at the asking price?**

## Clarifying information

- Q: What return does the fund need?
  A: At least **{{target_moic}}** its money (multiple of invested capital, or MOIC) over a hold of **{{hold}}** — roughly a 20% annual return.
- Q: How will the deal be financed?
  A: **{{debt_share}}** of the entry price with debt, the rest with the fund's equity. Add-on purchases are funded with an additional debt facility. Cash flow repays about {{paydown}} of debt over the hold.
- Q: Why is the market attractive?
  A: Demand for physical therapy is growing with an aging population and more joint-replacement surgery, and the market is highly fragmented — most clinics are owned by one or two therapists who are looking to retire or sell.
- Q: What are the main risks in this industry?
  A: Reimbursement (insurers and Medicare can cut rates), a shortage of licensed therapists, and competition from hospital systems that run their own clinics.
- Q: Should we consider taxes, fees or interest?
  A: No — keep it simple. Interest is already reflected in the debt repayment figure.

## Structure

> **Ask:** The candidate should lay out how to judge the investment before asking for numbers.

A PE investment structure: **can we make the target return, what is that return built on, and how fragile is it?**

- **1. Is this a good business in a good market?**
  - Demand growth (aging, surgery volumes, sports medicine)
  - Fragmentation: enough small clinics available to buy?
  - Payer mix and reimbursement risk; therapist labor supply
- **2. What return does the deal plan produce?**
  - Entry: EBITDA × entry multiple; debt and equity split
  - Value creation levers: organic EBITDA growth, add-on acquisitions (and integration benefits), debt paydown, multiple expansion
  - Exit: EBITDA × exit multiple − debt → equity value → MOIC and IRR
- **3. How robust is it?**
  - Which lever drives most of the return?
  - What exit multiple do we need? What if multiples fall?
- **4. Can we execute?**
  - Management's track record integrating clinics
  - Systems for billing, scheduling and payer contracting that add-ons can plug into

A strong hypothesis: *"In a roll-up, the return usually comes from buying small clinics cheaply and selling them as part of a bigger platform — so I want to test how much of our return depends on the add-on program."*

## Math walkthrough

> **Ask:** The candidate should calculate the base-case MOIC and IRR, then break the return into its drivers and test the exit multiple.

**1. Entry.**
EBITDA per clinic = $2.0M × 12.5% = {{ebitda_clinic}}, so platform EBITDA = 40 × $0.25M = **{{entry_ebitda}}**.
Entry value = $10M × 10 = **{{entry_ev}}**: {{entry_debt}} of debt ({{entry_leverage}} EBITDA) and **{{entry_equity}}** of fund equity.

**2. EBITDA at exit.**
- Organic: $10M × 1.05^5 ≈ $10M × {{growth_factor}} ≈ **{{organic_ebitda}}**. (Mental math: 5% a year compounds to a bit more than 25% over five years.)
- Add-ons: 30 clinics × $0.2M × 6 = **{{addon_price}}** paid ({{addon_clinic_price}} per clinic). After integration each earns $0.2M + $0.05M = {{addon_clinic_ebitda}}, so 30 × $0.25M = **{{addon_ebitda_total}}**.
- Total exit EBITDA = {{organic_ebitda}} + {{addon_ebitda_total}} ≈ **{{exit_ebitda}}**.

**3. Exit and returns.**
Exit value = $20.3M × 10 ≈ **{{exit_ev}}**.
Debt at exit = $50M + $36M − $20M = **{{exit_debt}}**.
Equity at exit ≈ {{exit_ev}} − {{exit_debt}} ≈ **{{exit_equity}}**.
MOIC ≈ $137M ÷ $50M ≈ **{{moic:2}}**, an IRR of about **{{irr}}**. (Rule of thumb over five years: 2x is about 15% a year, 3x about 25%.) That clears the {{target_moic}} target.

**4. Where does the return come from?**

| Lever | Calculation | Value created |
|---|---|---|
| Organic EBITDA growth | ($12.8M − $10M) × 10 | {{organic_value}} |
| Add-ons | $7.5M × 10 − $36M | {{addon_value}} |
| Debt paydown | | {{paydown}} |
| **Total** | | **{{bridge_check}}** |

The add-ons deliver **{{addon_share}}** of the value created: each clinic costs {{addon_clinic_price}} and is worth {{addon_clinic_value}} inside the platform. Without them, exit equity is $12.8M × 10 − ($50M − $20M) ≈ {{noaddon_equity}}, a MOIC of only **{{noaddon_moic}}** — below target.

**5. How sensitive is it to the exit multiple?**
At {{downside_multiple}} (for example after Medicare rate cuts): $20.3M × 8 ≈ {{downside_ev}}, less $66M of debt, gives a MOIC of **{{downside_moic}}** — below target.
Break-even: the fund needs 2.5 × $50M = {{needed_equity}} of equity plus {{exit_debt}} of debt, so ($125M + $66M) ÷ $20.3M ≈ **{{breakeven_multiple}}**.

## Synthesis

> **Ask:** The candidate should give the investment committee a clear go/no-go with conditions.

**Calloway Pine should buy Orrin Valley at {{entry_multiple}}: the plan returns about {{moic}} (roughly {{irr}} a year), above the {{target_moic}} target — but the return rests on the add-on program, so the fund should only proceed with a credible pipeline of small clinics to buy.**

1. **The roll-up is the thesis:** add-ons bought at {{addon_multiple}} and valued at {{exit_multiple}} create {{addon_value}}, or {{addon_share}} of the value. Without them the deal returns {{noaddon_moic}}.
2. **The margin of safety is thin:** the exit multiple can fall to about {{breakeven_multiple}} before the fund misses its target; at {{downside_multiple}} it earns only {{downside_moic}}.
3. **Leverage is manageable:** debt falls from {{entry_leverage}} to about {{exit_leverage}} EBITDA by exit, even after funding the add-ons.

**Risks and next steps:** confirm there are at least {{addons}} available from willing sellers in the region at around {{addon_multiple}}; test reimbursement exposure by payer; check therapist retention at acquired clinics (therapists *are* the capacity); diligence management's integration playbook; and consider offering sellers part of the price in rollover equity to keep them motivated.

## Common mistakes

- Forgetting that the add-ons are paid for with debt — counting their exit value without subtracting the {{addon_price}} spent on them.
- Computing returns on enterprise value instead of equity. MOIC is exit **equity** ÷ entry **equity**.
- Assuming the exit multiple will be higher than the entry multiple without justification. Multiple expansion is upside, not the base case.
- Stopping at "{{moic}} beats {{target_moic}}, so yes" without asking what the return depends on.

## What top candidates do differently

- Build a simple value bridge (organic growth, add-ons, debt paydown) and check that it adds up to the equity gain.
- Use Exhibit 2 both ways: it explains the multiple arbitrage *and* shows the risk if sector multiples fall.
- Translate the sensitivity into a single number the committee can debate: the break-even exit multiple of {{breakeven_multiple}}.
- Point out that in a people business, capacity is therapists — integration that drives therapists away destroys the add-on value.

## Creative question

Beyond buying more clinics, how could Calloway Pine grow Orrin Valley's EBITDA faster than the {{organic_g}} a year in the plan?

## Model answer

Group the ideas by **revenue per clinic, cost per clinic and new services**:

- **Revenue per clinic:** renegotiate payer contracts using the larger platform's scale; reduce no-shows with reminders and online booking (an empty appointment slot is lost revenue); extend opening hours to evenings and weekends.
- **Cost per clinic:** centralize billing and claims follow-up to cut denied claims; shared purchasing for equipment; use physical-therapy assistants for routine sessions so licensed therapists focus on evaluations.
- **New services:** direct contracts with employers for workplace-injury prevention; partnerships with orthopedic surgeons for post-surgery programs; virtual (telehealth) home-exercise follow-ups; sports-performance programs paid in cash.

A top candidate prioritizes: "Start with no-shows and denied claims — both lift EBITDA within months without new investment, and both get easier with the platform's shared systems."
