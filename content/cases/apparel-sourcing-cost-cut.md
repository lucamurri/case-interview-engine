---
id: apparel-sourcing-cost-cut
title: "Cutting the Cloth: An 8% Cost Cut at an Apparel Brand"
client: "Northgate Outfitters (fictional), a US everyday and outdoor apparel brand selling online and in its own stores"
summary: "The board wants 8% out of the cost base within two years. Compare sourcing consolidation, overhead and returns handling, then check what the one-time costs and quality risk do to the first year."
industry: consumer-retail
sub_industry: "Apparel"
type: cost-cutting
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  cogs:           { value: 480,  unit: "$M",           label: "Product cost (fabric, manufacturing, vendor margin)" }
  freight:        { value: 70,   unit: "$M",           label: "Freight and duties" }
  sga:            { value: 250,  unit: "$M",           label: "Overhead (SG&A), excluding marketing" }
  marketing:      { value: 140,  unit: "$M",           label: "Marketing" }
  returns_units:  { value: 5.0,  unit: "million",      label: "Online items returned per year" }
  cost_return:    { value: 12,   unit: "$",            label: "Handling cost per returned item (shipping label, inspection, repackaging)" }
  target_pct:     { value: 0.08, unit: "%",            label: "Cost reduction target" }
  consol_share:   { value: 0.75, unit: "%",            label: "Share of product cost that can move to fewer vendors" }
  src_saving:     { value: 0.08, unit: "%",            label: "Price saving on consolidated spend" }
  quality_leak:   { value: 0.20, unit: "%",            label: "Share of the gross sourcing saving expected to leak back through defects, returns and rush freight" }
  quality_high:   { value: 0.50, unit: "%",            label: "Leakage in the downside case" }
  src_onetime:    { value: 20,   unit: "$M",           label: "One-time cost of consolidating vendors (testing, tooling, inventory)" }
  ph_src:         { value: 0.40, unit: "%",            label: "Share of the sourcing saving captured in year 1 (contracts roll over)" }
  sga_cut:        { value: 0.12, unit: "%",            label: "Reduction in overhead from fewer layers and shared services" }
  sga_onetime:    { value: 12,   unit: "$M",           label: "One-time severance and restructuring cost" }
  ph_sga:         { value: 0.75, unit: "%",            label: "Share of the overhead saving captured in year 1" }
  ret_rate_cut:   { value: 0.15, unit: "%",            label: "Reduction in returned items (better size guides and fit data)" }
  ret_cost_cut:   { value: 0.20, unit: "%",            label: "Reduction in handling cost per return (automated sorting)" }
  ret_onetime:    { value: 7,    unit: "$M",           label: "One-time cost of the returns program" }
  ph_ret:         { value: 0.50, unit: "%",            label: "Share of the returns saving captured in year 1" }

calculations:
  # --- Cost base and target ---
  - { id: returns_cost, label: "Returns handling cost", formula: "returns_units * cost_return", expected: 60, unit: "$M" }
  - { id: total_cost, label: "Total cost base", formula: "cogs + freight + sga + marketing + returns_cost", expected: 1000, unit: "$M" }
  - { id: cogs_share, label: "Product cost share", formula: "cogs / total_cost", expected: 0.48, unit: "%", decimals: 0 }
  - { id: freight_share, label: "Freight share", formula: "freight / total_cost", expected: 0.07, unit: "%", decimals: 0 }
  - { id: sga_share, label: "Overhead share", formula: "sga / total_cost", expected: 0.25, unit: "%", decimals: 0 }
  - { id: marketing_share, label: "Marketing share", formula: "marketing / total_cost", expected: 0.14, unit: "%", decimals: 0 }
  - { id: returns_share, label: "Returns share", formula: "returns_cost / total_cost", expected: 0.06, unit: "%", decimals: 0 }
  - { id: target, label: "Savings target", formula: "total_cost * target_pct", expected: 80, unit: "$M" }
  # --- Lever 1: sourcing ---
  - { id: src_addr, label: "Product cost that can be consolidated", formula: "cogs * consol_share", expected: 360, unit: "$M" }
  - { id: src_gross, label: "Gross sourcing saving", formula: "src_addr * src_saving", expected: 28.8, unit: "$M", decimals: 1 }
  - { id: src_leak, label: "Saving lost to quality problems", formula: "src_gross * quality_leak", expected: 5.76, unit: "$M", decimals: 1 }
  - { id: src_net, label: "Net sourcing saving", formula: "src_gross - src_leak", expected: 23.04, unit: "$M", decimals: 1 }
  # --- Lever 2: overhead ---
  - { id: sga_save, label: "Overhead saving", formula: "sga * sga_cut", expected: 30, unit: "$M" }
  # --- Lever 3: returns ---
  - { id: ret_new, label: "Returns cost after the program", formula: "returns_units * (1 - ret_rate_cut) * cost_return * (1 - ret_cost_cut)", expected: 40.8, unit: "$M", decimals: 1 }
  - { id: ret_save, label: "Returns saving", formula: "returns_cost - ret_new", expected: 19.2, unit: "$M", decimals: 1 }
  # --- Totals ---
  - { id: gross_total, label: "Run-rate saving if no sourcing quality leakage", formula: "src_gross + sga_save + ret_save", expected: 78, unit: "$M" }
  - { id: run_rate, label: "Run-rate saving after leakage", formula: "src_net + sga_save + ret_save", expected: 72.24, unit: "$M", decimals: 1 }
  - { id: run_pct, label: "Run-rate saving as a share of the cost base", formula: "run_rate / total_cost", expected: 0.07224, unit: "%", decimals: 1 }
  - { id: coverage, label: "Share of the target covered", formula: "run_rate / target", expected: 0.903, unit: "%", decimals: 0 }
  - { id: gap, label: "Remaining gap to the target", formula: "target - run_rate", expected: 7.76, unit: "$M", decimals: 1 }
  # --- One-time cost and year 1 ---
  - { id: onetime_total, label: "Total one-time cost", formula: "src_onetime + sga_onetime + ret_onetime", expected: 39, unit: "$M" }
  - { id: pb_src, label: "Payback on sourcing at full run-rate", formula: "src_onetime / src_net", expected: 0.868, unit: "years", decimals: 1 }
  - { id: pb_sga, label: "Payback on overhead at full run-rate", formula: "sga_onetime / sga_save", expected: 0.4, unit: "years", decimals: 1 }
  - { id: pb_ret, label: "Payback on returns at full run-rate", formula: "ret_onetime / ret_save", expected: 0.3646, unit: "years", decimals: 1 }
  - { id: y1_gross, label: "Year 1 saving", formula: "src_net * ph_src + sga_save * ph_sga + ret_save * ph_ret", expected: 41.316, unit: "$M", decimals: 1 }
  - { id: y1_pct, label: "Year 1 saving as a share of the cost base", formula: "y1_gross / total_cost", expected: 0.041316, unit: "%", decimals: 1 }
  - { id: y1_net, label: "Year 1 saving after one-time costs", formula: "y1_gross - onetime_total", expected: 2.316, unit: "$M", decimals: 1 }
  - { id: cum2, label: "Cumulative saving after two years", formula: "y1_net + run_rate", expected: 74.556, unit: "$M", decimals: 1 }
  # --- Downside ---
  - { id: src_net_high, label: "Net sourcing saving in the downside case", formula: "src_gross * (1 - quality_high)", expected: 14.4, unit: "$M", decimals: 1 }
  - { id: run_high, label: "Run-rate saving in the downside case", formula: "src_net_high + sga_save + ret_save", expected: 63.6, unit: "$M", decimals: 1 }
  - { id: gap_high, label: "Gap to target in the downside case", formula: "target - run_high", expected: 16.4, unit: "$M", decimals: 1 }

answer:
  calc: run_rate
  headline: "The three levers deliver {{run_rate}} a year ({{run_pct}} of costs, {{coverage}} of the {{target}} target); year 1 delivers only {{y1_gross}} and {{y1_net}} after one-time costs."

exhibits:
  - id: exhibit-1
    title: "Northgate's annual cost base"
    kind: table
    ask: "Here is the cost base. Where would you look first?"
    columns: ["Cost category", "Annual cost", "Share of total"]
    rows:
      - ["Product cost", "{{cogs}}", "{{cogs_share}}"]
      - ["Freight and duties", "{{freight}}", "{{freight_share}}"]
      - ["Overhead (SG&A)", "{{sga}}", "{{sga_share}}"]
      - ["Marketing", "{{marketing}}", "{{marketing_share}}"]
      - ["Returns handling", "{{returns_cost}}", "{{returns_share}}"]
      - ["**Total**", "**{{total_cost}}**", "**100%**"]
    note: "Illustrative data created for this practice case. Northgate is fictional. Returns handling is {{returns_units}} items at {{cost_return}} each."
    insight: |
      Product cost is about half the base, so even a small percentage there matters.
      The {{target}} target is {{target_pct}} of {{total_cost}}. Returns handling is small but
      often overlooked.
  - id: exhibit-2
    title: "Cost-cutting levers prepared by management"
    kind: table
    ask: "Management sized three levers. What do you make of them?"
    columns: ["Lever", "What it does", "One-time cost", "Year 1 capture"]
    rows:
      - ["Sourcing consolidation", "Move {{consol_share}} of product cost to fewer vendors for an {{src_saving}} price saving; {{quality_leak}} of the saving expected to leak back through quality problems", "{{src_onetime}}", "{{ph_src}}"]
      - ["Overhead", "Cut {{sga_cut}} of SG&A through fewer layers and shared services", "{{sga_onetime}}", "{{ph_sga}}"]
      - ["Returns handling", "Cut returned items by {{ret_rate_cut}} and handling cost per return by {{ret_cost_cut}}", "{{ret_onetime}}", "{{ph_ret}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Each lever has a one-time cost and takes time to reach full effect. The sourcing
      saving of {{src_gross}} looks like the biggest, but quality leakage takes {{src_leak}} of it back.
  - id: exhibit-3
    title: "Net run-rate saving by lever versus the target"
    kind: bar
    unit: "$M"
    decimals: 1
    ask: "Do the levers get to the target?"
    data:
      - { label: "Sourcing (net of quality leakage)", value: src_net }
      - { label: "Overhead", value: sga_save }
      - { label: "Returns handling", value: ret_save }
    reference: { value: target, label: "Savings target" }
    note: "Illustrative data created for this practice case. Shows full run-rate effect, not year 1."
    insight: |
      The three levers together reach {{run_rate}}, {{coverage}} of the {{target}} target.
      There is a gap of {{gap}} to close elsewhere.
---

## Prompt

Our client, Northgate Outfitters, is a US apparel brand that sells everyday and outdoor clothing online and in its own stores. Costs have grown faster than sales for three years, and profit has slipped. The board wants the total cost base cut by **{{target_pct}} within two years**.

The CEO asks us: **where can Northgate find the savings, which levers should it pull first, and will it reach the target?**

## Clarifying information

- Q: How big is the cost base?
  A: About {{total_cost}} a year across the categories in Exhibit 1.
- Q: Is there anything we cannot cut?
  A: Brand quality and the fit of the product are not negotiable, and marketing is protected this year because new product launches depend on it.
- Q: Is there a budget for one-time costs?
  A: Yes, but the CFO wants one-time costs shown against savings. See Exhibit 2.
- Q: How is the target measured?
  A: Annual cost run-rate by the end of year 2. The board also cares about year 1 results.
- Q: Why are returns costly?
  A: Roughly a quarter of online orders come back, mostly for size and fit. Handling a return (label, inspection, repackaging) costs about {{cost_return}}.
- Q: How many vendors does Northgate use?
  A: 42 vendors across 11 countries. The sourcing team believes {{consol_share}} of product cost could move to about 15 of them.

## Structure

> **Ask:** How would you approach this?

Start from the **cost base**, then evaluate each lever on **size, speed, cost to achieve and risk**.

- **1. Cost base:** product cost, freight and duties, overhead, marketing, returns handling; which are addressable?
- **2. Levers**
  - Sourcing: fewer vendors, better prices, design to cost
  - Overhead: layers, spans, shared services, outsourcing
  - Returns: fewer returns (fit tools), cheaper handling (automation), return fees
- **3. For each lever**
  - Run-rate saving and speed of capture
  - One-time cost and payback
  - Risks: quality, brand, morale, customer experience
- **4. Plan:** does the sum reach the target, what is the year 1 impact, and what covers any gap?

Hypothesis: *"Product cost is half the base, so sourcing will be the biggest lever, but it carries the most quality risk. I expect overhead and returns to be faster, with the sum falling a little short of 8%."*

## Math walkthrough

> **Ask:** Size each lever, check the target, then look at year 1.

**1. The target.**
Cost base: {{cogs}} + {{freight}} + {{sga}} + {{marketing}} + {{returns_cost}} = **{{total_cost}}**. Target: {{target_pct}} × {{total_cost}} = **{{target}}**.

**2. Sourcing.**
Consolidated spend: {{cogs}} × {{consol_share}} = {{src_addr}}. Gross saving: {{src_addr}} × {{src_saving}} = **{{src_gross}}**.
Quality leakage: {{src_gross}} × {{quality_leak}} = {{src_leak}}. Net saving: **{{src_net}}**.

**3. Overhead.**
{{sga}} × {{sga_cut}} = **{{sga_save}}**.

**4. Returns.**
Today: {{returns_units}} × {{cost_return}} = {{returns_cost}}. After the program, returns fall 15% and the cost per return falls 20%: {{returns_units}} × 85% × {{cost_return}} × 80% = {{ret_new}}. Saving: **{{ret_save}}**.

**5. Total versus target.**

| Lever | Run-rate saving | One-time cost | Payback at full run-rate |
|---|---|---|---|
| Sourcing | {{src_net}} | {{src_onetime}} | {{pb_src}} |
| Overhead | {{sga_save}} | {{sga_onetime}} | {{pb_sga}} |
| Returns | {{ret_save}} | {{ret_onetime}} | {{pb_ret}} |
| **Total** | **{{run_rate}}** | **{{onetime_total}}** | |

The levers reach {{run_pct}} of costs, which is **{{coverage}}** of the target and a gap of **{{gap}}**. Ignoring quality leakage the sum would be {{gross_total}}, which falsely looks like it nearly hits {{target}}.

**6. Year 1.**
Phased in: {{src_net}} × {{ph_src}} + {{sga_save}} × {{ph_sga}} + {{ret_save}} × {{ph_ret}} = **{{y1_gross}}**, only {{y1_pct}} of costs. After {{onetime_total}} of one-time costs, year 1 nets **{{y1_net}}**. After two years the cumulative saving is {{cum2}}.

**7. Downside.**
If leakage is {{quality_high}}, net sourcing falls to {{src_net_high}}, the run-rate to {{run_high}}, and the gap rises to **{{gap_high}}**.

## Synthesis

> **Ask:** What would you tell the CEO?

**Northgate can reach {{run_rate}} a year, {{coverage}} of the {{target}} target, with sourcing, overhead and returns. But year 1 will show only {{y1_gross}} of savings, and close to nothing after one-time costs, so the board should expect the full effect in year 2.**

1. **Do first:** returns and overhead. They pay back in under half a year at full run-rate and carry little brand risk.
2. **Do carefully:** sourcing is the biggest lever at {{src_net}} net, but quality is the brand. Run pilots on two categories before moving everything, and keep a second vendor on key items.
3. **Close the gap:** the remaining {{gap}} (more if leakage reaches {{quality_high}}) must come from freight and duties, or marketing efficiency, since the other levers fall short.

**Risks and next steps:** quality problems at new vendors (defects, late shipments) would cost more than the saving, so set quality gates and track return reasons; overhead cuts can slow product development if they hit design or merchandising, so protect those teams; returns programs must not push customers away, so test fit tools before charging fees; and report year 1 to the board honestly as {{y1_pct}} of costs, with a clear path to year 2.

## Common mistakes

- Adding up gross savings ({{gross_total}}) and claiming the target is nearly reached, with no allowance for quality leakage.
- Ignoring the {{onetime_total}} of one-time costs, which wipes out most of the year 1 saving.
- Treating the target as a year 1 number when the savings phase in.
- Cutting marketing even though it is protected and tied to product launches.
- Looking only at the percentage saved, not the risk to brand and quality.

## What top candidates do differently

- Start from where the money is (product cost is nearly half) before picking levers.
- Compare levers on size, speed, one-time cost and risk, in one table.
- Show year 1 and run-rate separately so the CEO is not surprised.
- Name the gap to the target and say where it could come from.

## Creative question

Beyond the three levers, how else could Northgate reduce costs without hurting the customer experience?

## Model answer

Organize ideas by **cost category**:

- **Product:** simplify the range (fewer styles, colors and sizes), reuse fabrics across styles, and design to cost.
- **Freight and duties:** ship by sea instead of air where timing allows, consolidate shipments, and review the country mix for duty savings.
- **Marketing:** cut spending on low-return channels and shift to email and loyalty, while protecting launches.
- **Stores and operations:** adjust store hours and staffing to traffic, and share warehouse space.

A top candidate prioritizes: "Range simplification helps several categories at once: fewer styles lower product cost, freight and returns, and it makes sourcing consolidation easier. I would add it to the plan to cover the remaining {{gap}}."
