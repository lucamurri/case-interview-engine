---
# ============================================================================
# CASE TEMPLATE — copy this file, rename it to <id>.md, and fill it in.
# Files starting with "_" are ignored by the site and the tests.
# Run `npm test` when you're done: it checks every section and every number.
# ============================================================================

id: my-new-case                 # lowercase-with-dashes; must match the file name
title: "Catchy Title: What the Case Is About"
client: "Clientco (fictional), one-line description"
summary: "One or two sentences shown on the library card."
industry: pharma-healthcare     # pharma-healthcare | energy | consumer-retail | tech-ai | financial-services | industrials | public-sector | media-sports
sub_industry: "Free text tag, e.g. Medtech"
type: profitability             # market-sizing | profitability | market-entry | pricing | m-and-a | operations
difficulty: intermediate        # beginner | intermediate | advanced
format: interviewer-led         # interviewer-led | candidate-led
time_minutes: 30

# INPUTS — every number the candidate is given. All must be illustrative.
# unit controls how the number is shown:
#   "%"  (0.25 → 25%)   "pts" (0.05 → 5 pts)   "$" / "$M" / "$B" / "$/unit"
#   "x"  (3.2 → 3.2x)   anything else is printed after the number ("million")
# decimals (optional) fixes how many decimals are shown.
inputs:
  units:  { value: 2.0, unit: "million", label: "Units sold per year" }
  price:  { value: 50,  unit: "$",       label: "Price per unit" }

# CALCULATIONS — each step is a formula using inputs or earlier steps.
# Allowed: + - * / ^ ( ) and round(x, d), min, max, abs, floor, ceil, sqrt.
# `expected` is the answer you wrote; the test fails if the formula disagrees
# by more than 0.5% (override with `tolerance: 0.01` for 1%).
calculations:
  - { id: revenue, label: "Annual revenue", formula: "units * price", expected: 100, unit: "$M" }

# The headline number and a one-line answer (placeholders allowed).
answer:
  calc: revenue
  headline: "Revenue is about {{revenue}}."

# EXHIBITS — 1 to 3. Shown one at a time in practice mode.
# kind: table → columns + rows (cells can use {{placeholders}})
# kind: bar   → data list of { label, value } where value is a number or a name;
#               optional `unit`, `decimals`, and `reference: { value, label }`
#               (reference value can also be a number or a name).
# Every note must say the data is illustrative.
exhibits:
  - id: exhibit-1
    title: "Exhibit title"
    kind: table
    ask: "What the interviewer says when handing over the exhibit."
    columns: ["Metric", "Value"]
    rows:
      - ["Units", "{{units}}"]
      - ["Price", "{{price}}"]
    note: "Illustrative data created for this practice case."
    insight: "What a strong candidate should take away."
---

<!--
  BODY — keep these headings exactly. Use {{name}} to insert a number from
  the inputs or calculations above ({{name:1}} forces 1 decimal).
  Structure, Math walkthrough and Synthesis can start with an "Ask" line:
    > **Ask:** the question the interviewer asks
  (required for interviewer-led cases). Everything after it is the model answer.
-->

## Prompt

The situation the interviewer reads aloud.

## Clarifying information

- Q: A question the candidate might ask?
  A: The answer, revealed only if asked.
- Q: Another question?
  A: Another answer.

## Structure

> **Ask:** How would you approach this?

- **Top-level branch**
  - Sub-branch
  - Sub-branch

## Math walkthrough

> **Ask:** What is the revenue?

Revenue = 2.0m × $50 = **{{revenue}}**.

## Synthesis

> **Ask:** What would you tell the CEO?

**Answer first, in one sentence.** Then two or three supporting points, risks and next steps.

## Common mistakes

- A mistake candidates often make.

## What top candidates do differently

- Something the best candidates do.

## Creative question

An open brainstorm question.

## Model answer

A structured model answer.
