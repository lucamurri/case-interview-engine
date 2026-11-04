---
id: biosimilar-us-entry
title: "Biosimilar Bet: A Generics Maker Entering the US Biologics Market"
client: "Orvisca Pharma (fictional), a European generics manufacturer"
summary: "A generics maker wants to launch its first biosimilar in the US. A $6B brand looks like a huge prize, until you size the real biosimilar pool and compare going alone with a pharmacy-benefit-manager partnership."
industry: pharma-healthcare
sub_industry: "Biosimilars / market access"
type: market-entry
difficulty: advanced
format: interviewer-led
time_minutes: 35

# All numbers are illustrative — realistic in shape, not real market or company data.
inputs:
  patients:       { value: 200,   unit: "thousand patients", label: "US patients treated with the reference biologic per year" }
  ref_price:      { value: 30000, unit: "$/patient-year",    label: "Reference product net price per patient per year" }
  analog_a:       { value: 0.30,  unit: "%",                 label: "Biosimilar volume share 3 years after launch, analog molecule A" }
  analog_b:       { value: 0.45,  unit: "%",                 label: "Analog molecule B" }
  analog_c:       { value: 0.50,  unit: "%",                 label: "Analog molecule C" }
  analog_d:       { value: 0.35,  unit: "%",                 label: "Analog molecule D" }
  bios_discount:  { value: 0.50,  unit: "%",                 label: "Biosimilar net price discount versus the reference net price" }
  entrants:       { value: 5,     unit: "biosimilars",       label: "Expected biosimilar competitors, including Orvisca" }
  orv_share:      { value: 0.20,  unit: "%",                 label: "Orvisca's assumed share of biosimilar volume (going alone)" }
  low_share:      { value: 0.10,  unit: "%",                 label: "Downside share of biosimilar volume (going alone)" }
  cogs:           { value: 3000,  unit: "$/patient-year",    label: "Orvisca's manufacturing cost per patient-year" }
  sga_alone:      { value: 60,    unit: "$M",                label: "Annual US sales, marketing and market-access cost (going alone)" }
  investment:     { value: 400,   unit: "$M",                label: "Upfront investment: development, clinical studies, plant expansion" }
  ramp_y1:        { value: 0.25,  unit: "%",                 label: "Year-1 volume as a share of steady state (going alone)" }
  ramp_y2:        { value: 0.50,  unit: "%",                 label: "Year-2 volume as a share of steady state (going alone)" }
  hurdle:         { value: 5,     unit: "years",             label: "Orvisca's maximum payback from launch" }
  pbm_cover:      { value: 0.25,  unit: "%",                 label: "Share of US patients covered by the PBM's formularies" }
  pbm_convert:    { value: 0.60,  unit: "%",                 label: "Share of those patients the PBM moves to its private label" }
  supply_price:   { value: 8000,  unit: "$/patient-year",    label: "Price the PBM pays Orvisca per patient-year" }
  sga_pbm:        { value: 10,    unit: "$M",                label: "Annual account-management and safety-monitoring cost (PBM deal)" }
  capacity:       { value: 40,    unit: "thousand patients", label: "Plant capacity after expansion (patient-years of supply)" }

calculations:
  # --- Size the prize ---
  - { id: ref_market, label: "Reference product US net sales", formula: "patients * ref_price / 1e6", expected: 6, unit: "$B" }
  - { id: bios_share, label: "Biosimilar volume share at year 3 (average of analogs)", formula: "(analog_a + analog_b + analog_c + analog_d) / 4", expected: 0.40, unit: "%" }
  - { id: bios_price, label: "Biosimilar net price", formula: "ref_price * (1 - bios_discount)", expected: 15000, unit: "$/patient-year" }
  - { id: bios_patients, label: "Patients on biosimilars at year 3", formula: "patients * bios_share", expected: 80, unit: "thousand patients" }
  - { id: bios_pool, label: "Biosimilar revenue pool at year 3", formula: "bios_patients * bios_price / 1e6", expected: 1.2, unit: "$B", decimals: 1 }
  - { id: pool_vs_ref, label: "Biosimilar pool as a share of the reference product's sales", formula: "bios_pool / ref_market", expected: 0.20, unit: "%" }
  - { id: equal_share, label: "Equal share of biosimilar volume among the entrants", formula: "1 / entrants", expected: 0.20, unit: "%" }
  # --- Option A: go alone ---
  - { id: orv_patients, label: "Orvisca patients at steady state (going alone)", formula: "bios_patients * orv_share", expected: 16, unit: "thousand patients" }
  - { id: margin_a, label: "Margin per patient-year (going alone)", formula: "bios_price - cogs", expected: 12000, unit: "$/patient-year" }
  - { id: rev_a, label: "Steady-state revenue (going alone)", formula: "orv_patients * bios_price / 1000", expected: 240, unit: "$M" }
  - { id: gp_a, label: "Steady-state gross profit (going alone)", formula: "orv_patients * margin_a / 1000", expected: 192, unit: "$M" }
  - { id: op_a, label: "Steady-state operating profit (going alone)", formula: "gp_a - sga_alone", expected: 132, unit: "$M" }
  - { id: payback_a_naive, label: "Payback going alone if full volume came in year 1 (the trap)", formula: "investment / op_a", expected: 3.03, unit: "years", decimals: 1 }
  - { id: y1_a, label: "Year-1 operating profit (going alone)", formula: "gp_a * ramp_y1 - sga_alone", expected: -12, unit: "$M" }
  - { id: y2_a, label: "Year-2 operating profit (going alone)", formula: "gp_a * ramp_y2 - sga_alone", expected: 36, unit: "$M" }
  - { id: cum3_a, label: "Cumulative operating profit after 3 years (going alone)", formula: "y1_a + y2_a + op_a", expected: 156, unit: "$M" }
  - { id: cum4_a, label: "Cumulative operating profit after 4 years (going alone)", formula: "cum3_a + op_a", expected: 288, unit: "$M" }
  - { id: remaining_a, label: "Investment still to recover after 4 years (going alone)", formula: "investment - cum4_a", expected: 112, unit: "$M" }
  - { id: payback_a, label: "Payback (going alone)", formula: "4 + remaining_a / op_a", expected: 4.85, unit: "years", decimals: 1 }
  - { id: cum5_a, label: "Cumulative operating profit after 5 years (going alone)", formula: "cum4_a + op_a", expected: 420, unit: "$M" }
  - { id: op_a_low, label: "Steady-state operating profit at the downside share", formula: "bios_patients * low_share * margin_a / 1000 - sga_alone", expected: 36, unit: "$M" }
  - { id: payback_a_low, label: "Payback at the downside share (ignoring the ramp)", formula: "investment / op_a_low", expected: 11.1, unit: "years", decimals: 0 }
  # --- Option B: PBM private label ---
  - { id: pbm_patients, label: "Patients supplied under the PBM deal", formula: "patients * pbm_cover * pbm_convert", expected: 30, unit: "thousand patients" }
  - { id: margin_b, label: "Margin per patient-year (PBM deal)", formula: "supply_price - cogs", expected: 5000, unit: "$/patient-year" }
  - { id: rev_b, label: "Annual revenue (PBM deal)", formula: "pbm_patients * supply_price / 1000", expected: 240, unit: "$M" }
  - { id: gp_b, label: "Annual gross profit (PBM deal)", formula: "pbm_patients * margin_b / 1000", expected: 150, unit: "$M" }
  - { id: op_b, label: "Annual operating profit (PBM deal)", formula: "gp_b - sga_pbm", expected: 140, unit: "$M" }
  - { id: payback_b, label: "Payback (PBM deal)", formula: "investment / op_b", expected: 2.86, unit: "years", decimals: 1 }
  - { id: cum5_b, label: "Cumulative operating profit after 5 years (PBM deal)", formula: "5 * op_b", expected: 700, unit: "$M" }
  - { id: advantage5, label: "Five-year advantage of the PBM deal", formula: "cum5_b - cum5_a", expected: 280, unit: "$M" }
  - { id: headroom, label: "Spare plant capacity under the PBM deal", formula: "capacity - pbm_patients", expected: 10, unit: "thousand patients" }

answer:
  calc: payback_b
  headline: "Enter, but through the PBM private-label deal: payback in {{payback_b}} versus ~{{payback_a}} going alone, and {{advantage5}} more operating profit over five years."

exhibits:
  - id: exhibit-1
    title: "Biosimilar share of molecule volume three years after the first biosimilar launch, analog molecules"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Here is how biosimilars have done on four comparable biologics. What share should we expect?"
    data:
      - { label: "Analog A (oncology, infused)", value: analog_a }
      - { label: "Analog B (supportive care, injected)", value: analog_b }
      - { label: "Analog C (oncology, infused)", value: analog_c }
      - { label: "Analog D (autoimmune, self-injected)", value: analog_d }
    note: "Illustrative data created for this practice case; not real market statistics."
    insight: |
      The average is a round {{bios_share}}, but the self-injected autoimmune
      analog (closest to Talvenzo) sits below it. Patients and doctors are slower
      to switch when the patient injects at home and the pharmacy benefit decides.
  - id: exhibit-2
    title: "Go-alone launch assumptions"
    kind: table
    ask: "Here are the team's assumptions for launching under Orvisca's own brand. Does it meet the hurdle?"
    columns: ["Item", "Assumption"]
    rows:
      - ["Reference product (Talvenzo) patients", "{{patients}}"]
      - ["Reference net price", "{{ref_price}}"]
      - ["Biosimilar net price discount", "{{bios_discount}} below the reference net price"]
      - ["Biosimilar competitors", "{{entrants}}, launching within 12 months of each other"]
      - ["Orvisca share of biosimilar volume", "{{orv_share}}"]
      - ["Volume ramp", "{{ramp_y1}} of steady state in year 1, {{ramp_y2}} in year 2, full from year 3"]
      - ["Manufacturing cost", "{{cogs}}"]
      - ["US sales, marketing and market access", "{{sga_alone}} a year from launch"]
      - ["Upfront investment", "{{investment}}"]
    note: "Illustrative data created for this practice case. Orvisca and Talvenzo are fictional."
    insight: |
      Two assumptions carry the case: the equal-split share and the slow ramp.
      With a fixed sales team, both hit profit almost one-for-one.
  - id: exhibit-3
    title: "Private-label offer from a large pharmacy benefit manager (PBM)"
    kind: table
    ask: "A large PBM offers to sell Orvisca's biosimilar under its own private label. How does that compare?"
    columns: ["Term", "Detail"]
    rows:
      - ["PBM's coverage", "{{pbm_cover}} of US patients"]
      - ["Patients moved to the private label", "{{pbm_convert}} of covered patients, from launch"]
      - ["Price paid to Orvisca", "{{supply_price}}"]
      - ["Orvisca's role", "Manufacture and supply; safety monitoring. The PBM handles pricing, formulary placement and distribution."]
      - ["Orvisca's ongoing cost", "{{sga_pbm}} a year"]
      - ["Contract length", "5 years, exclusive supplier"]
    note: "Illustrative data created for this practice case."
    insight: |
      A much lower price per patient, but full volume from day one and almost no
      selling cost. The question is which effect is bigger.
---

## Prompt

Our client, Orvisca Pharma, is a European generics manufacturer with a strong record in small-molecule generics (copies of chemical drugs). Over the last five years it has built a biologics plant and developed **ORV-21**, a biosimilar of **Talvenzo**, a blockbuster self-injected biologic for rheumatoid arthritis and psoriasis.

Talvenzo's key US patents expire in 2027. Orvisca has never sold a product in the US under its own name. The CEO has asked us: **should Orvisca enter the US with ORV-21, and if so, how?**

## Clarifying information

- Q: What is a biosimilar, and how is it different from a generic?
  A: A biologic is a large, complex molecule made in living cells. A biosimilar is a highly similar version of it, approved after analytical and clinical studies. It costs far more to develop and make than a generic, and the price discounts are smaller.
- Q: How do biosimilars win patients in the US?
  A: For self-injected drugs like Talvenzo, mostly through **pharmacy benefit managers (PBMs)**, which decide which drugs insurance plans cover (the formulary). Some PBMs now sell biosimilars under their own private label.
- Q: What is Orvisca's objective and investment criterion?
  A: Build a US business; the investment must pay back within **{{hurdle}}** of launch. Use simple payback.
- Q: How many competitors are expected?
  A: {{entrants}} in total, including Orvisca, all launching within about a year of each other.
- Q: Has the investment already been spent?
  A: About half has been committed. Treat the full {{investment}} as the decision amount for simplicity.
- Q: Can the plant supply the volume?
  A: After expansion, the plant can supply about {{capacity}} a year.

## Structure

> **Ask:** How would you structure the decision?

A market-entry structure that sizes the *biosimilar* pool, not the brand, and ends with a choice of entry mode:

- **1. How big is the prize?**
  - Reference product sales: patients × net price
  - Biosimilar uptake (analog molecules, PBM behavior, physician and patient willingness to switch)
  - Biosimilar price discount and how fast it erodes
- **2. How much can Orvisca win?**
  - Number of competitors and timing
  - Differentiation: supply reliability, device (autoinjector), interchangeability status (pharmacists can substitute without asking the doctor)
- **3. Does it pay?**
  - Revenue, manufacturing cost, launch and selling costs
  - Upfront investment and payback against the hurdle of {{hurdle}}
- **4. How should Orvisca enter?**
  - Go alone with its own brand and sales team
  - Partner: PBM private label, a US commercial partner, or a licensing deal
- **5. Risks:** patent litigation, approval timing, price erosion, customer concentration

Top candidates say early that **the brand's sales are not the market**: biosimilars take only part of the volume at a lower price, and the US market is controlled by a handful of PBMs.

## Math walkthrough

> **Ask:** (1) Using Exhibit 1, how big is the US biosimilar revenue pool? (2) Using Exhibit 2, does going alone meet the hurdle of {{hurdle}}? (3) What if Orvisca wins only {{low_share}} of biosimilar volume? (4) Using Exhibit 3, how does the PBM deal compare?

**1. Size the prize.**
Talvenzo today: 200k patients × $30,000 = **{{ref_market}}**.
Biosimilar share (Exhibit 1): (30% + 45% + 50% + 35%) ÷ 4 = **{{bios_share}}**, so {{bios_patients}} on biosimilars.
Biosimilar price = $30,000 × (1 − 50%) = **{{bios_price}}**.
Pool = 80k × $15,000 = **{{bios_pool}}**, only **{{pool_vs_ref}}** of Talvenzo's sales, to be shared among {{entrants}}.

**2. Go alone (Exhibit 2).**
Orvisca's patients = 80k × 20% = **{{orv_patients}}** (the {{orv_share}} share is simply an equal split, {{equal_share}} each).
Margin per patient = $15,000 − $3,000 = {{margin_a}}. Revenue = 16k × $15,000 = {{rev_a}}; gross profit = 16k × $12,000 = {{gp_a}}.
Steady-state operating profit = $192M − $60M = **{{op_a}}** a year.
With the ramp:
- Year 1: $192M × 25% − $60M = **{{y1_a}}**
- Year 2: $192M × 50% − $60M = **{{y2_a}}**
- Years 3–5: {{op_a}} each

Cumulative: {{cum3_a}} after 3 years, {{cum4_a}} after 4. Remaining = $400M − $288M = {{remaining_a}}, so payback ≈ 4 + $112M ÷ $132M ≈ **{{payback_a}}**. It just scrapes under the hurdle of {{hurdle}}.

**3. Downside.**
At a {{low_share}} share: 80k × 10% × $12,000 − $60M = **{{op_a_low}}** a year, a payback of roughly **{{payback_a_low}}**. Because the sales team is a fixed cost, going alone is very sensitive to share, and a late or undifferentiated entrant can easily get less than an equal split.

**4. PBM private label (Exhibit 3).**
Patients = 200k × 25% × 60% = **{{pbm_patients}}**, within the plant's capacity (spare: {{headroom}}).
Margin per patient = $8,000 − $3,000 = {{margin_b}}. Revenue = 30k × $8,000 = {{rev_b}}; gross profit = 30k × $5,000 = {{gp_b}}.
Operating profit = $150M − $10M = **{{op_b}}** a year, from year 1.
Payback = $400M ÷ $140M ≈ **{{payback_b}}**.
Over five years: PBM deal 5 × $140M = **{{cum5_b}}** versus **{{cum5_a}}** going alone, an advantage of **{{advantage5}}**.

## Synthesis

> **Ask:** What do you recommend to Orvisca's CEO?

**Orvisca should enter the US with ORV-21, but through the PBM private-label deal rather than under its own brand: the deal pays back in {{payback_b}} versus ~{{payback_a}} going alone, and earns about {{advantage5}} more operating profit over five years.**

1. **The prize is smaller than it looks:** Talvenzo's {{ref_market}} of sales becomes a biosimilar pool of about {{bios_pool}}, split among {{entrants}}.
2. **Going alone barely clears the hurdle and is fragile:** it relies on an equal {{orv_share}} share; at {{low_share}}, payback stretches to ~{{payback_a_low}}.
3. **The PBM deal wins on volume and cost:** a lower price per patient ({{supply_price}} versus {{bios_price}}), but {{pbm_patients}} from day one and almost no selling cost.

**Risks and next steps:** a single customer, so negotiate a minimum volume commitment, price protection, and a term of at least five years; check whether exclusivity stops Orvisca from using its spare capacity (about {{headroom}}) with other PBMs; confirm the patent settlement and launch date; invest in an autoinjector and interchangeability status to be the PBM's preferred supplier at renewal; use the US experience to decide later whether to build a commercial team for future biosimilars.

## Common mistakes

- Sizing the opportunity as Talvenzo's {{ref_market}} instead of the biosimilar pool of {{bios_pool}}.
- Assuming Orvisca gets an equal share without asking about differentiation and timing.
- Rejecting the PBM deal because its price is far below the biosimilar net price, without computing volume and selling-cost savings.
- Forgetting the launch ramp, which turns an apparent {{payback_a_naive}} payback into ~{{payback_a}}.
- Ignoring concentration risk: one customer controls all the volume, and contracts get renegotiated.

## What top candidates do differently

- Use Exhibit 1 critically: the closest analog (self-injected, autoimmune) is below the average, so they flag {{bios_share}} as optimistic.
- Separate fixed and variable costs: going alone carries a fixed {{sga_alone}} sales team, which makes it highly sensitive to share.
- Treat entry mode as the real decision and compare options on the same basis (payback and five-year profit).
- Bring the patient and payer view: the PBM deal is attractive partly because PBMs, not doctors, decide which self-injected biologics patients receive.

## Creative question

Beyond price, how could Orvisca make ORV-21 the biosimilar PBMs and patients prefer, so it keeps the business when the contract comes up for renewal?

## Model answer

Group ideas by **who chooses**:

- **PBM:** guaranteed supply backed by dual manufacturing sites; interchangeability status so pharmacies can substitute automatically; flexible contract terms (volume tiers, multi-year price commitments).
- **Patient:** a better autoinjector (less pain, fewer steps), a citrate-free formulation that stings less, and a patient support program for switching (nurse training, a support line).
- **Physician:** real-world switching data showing equal efficacy and safety; education for rheumatologists and dermatologists on switching.

A top candidate prioritizes: "Supply reliability and interchangeability matter most to the PBM, which is the real customer; the device and patient support protect Orvisca if patients are switched between biosimilars."
