---
id: uk-heat-pump-installations
title: "Boiler Swap: Residential Heat-Pump Installations in the UK"
client: "Hollowmere Heating (fictional), a UK boiler-installation and servicing company"
summary: "A boiler installer must decide how many engineers to retrain for heat pumps. Size annual UK heat-pump installations in existing homes, then turn the number into a workforce plan — with and without a bigger grant."
industry: energy
sub_industry: "Home heating / decarbonization"
type: market-sizing
difficulty: intermediate
format: interviewer-led
time_minutes: 25

# All numbers are illustrative — realistic in shape, not real housing,
# installation or grant data.
inputs:
  boiler_homes_m:     { value: 24,     unit: "million",       label: "UK homes heated by a gas or oil boiler" }
  boiler_life:        { value: 15,     unit: "years",         label: "Average boiler life" }
  suitable_share:     { value: 0.50,   unit: "%",             label: "Homes suitable for a heat pump without major works" }
  conv_none:          { value: 0.04,   unit: "%",             label: "Suitable homes choosing a heat pump at replacement, with no grant" }
  conv_now:           { value: 0.10,   unit: "%",             label: "Suitable homes choosing a heat pump at replacement, with today's grant" }
  conv_grant:         { value: 0.20,   unit: "%",             label: "Suitable homes choosing a heat pump at replacement, with the proposed larger grant" }
  new_homes:          { value: 200000, unit: "homes",         label: "New homes built per year" }
  newbuild_hp_share:  { value: 0.60,   unit: "%",             label: "New homes built with a heat pump" }
  hollowmere_share:   { value: 0.02,   unit: "%",             label: "Hollowmere's share of UK boiler replacements (assumed to carry over to heat pumps)" }
  install_days:       { value: 4,      unit: "engineer-days", label: "Engineer time per heat-pump installation" }
  working_days:       { value: 200,    unit: "days",          label: "Days an engineer spends on installations per year" }
  engineers:          { value: 400,    unit: "engineers",     label: "Hollowmere's installation engineers today" }

calculations:
  - { id: replacements_m, label: "Boilers replaced per year", formula: "boiler_homes_m / boiler_life", expected: 1.6, unit: "million" }
  - { id: suitable_m, label: "Replacements in heat-pump-suitable homes", formula: "replacements_m * suitable_share", expected: 0.8, unit: "million" }
  - { id: retrofit, label: "Heat pumps installed in existing homes per year", formula: "suitable_m * conv_now * 1000000", expected: 80000, unit: "heat pumps" }
  - { id: hp_share_of_replacements, label: "Heat pumps as a share of all boiler replacements", formula: "retrofit / (replacements_m * 1000000)", expected: 0.05, unit: "%" }
  - { id: newbuild_hp, label: "Heat pumps installed in new homes per year", formula: "new_homes * newbuild_hp_share", expected: 120000, unit: "heat pumps" }
  - { id: total_hp, label: "Total residential heat-pump installations per year", formula: "retrofit + newbuild_hp", expected: 200000, unit: "heat pumps" }
  - { id: retrofit_share, label: "Existing homes' share of installations", formula: "retrofit / total_hp", expected: 0.40, unit: "%" }
  - { id: hollowmere_installs, label: "Hollowmere heat-pump jobs per year", formula: "retrofit * hollowmere_share", expected: 1600, unit: "jobs" }
  - { id: installs_per_engineer, label: "Installations per engineer per year", formula: "working_days / install_days", expected: 50, unit: "jobs" }
  - { id: engineers_needed, label: "Engineers needed for heat pumps", formula: "hollowmere_installs / installs_per_engineer", expected: 32, unit: "engineers" }
  - { id: engineer_share, label: "Share of Hollowmere's engineers to retrain", formula: "engineers_needed / engineers", expected: 0.08, unit: "%" }
  - { id: retrofit_grant, label: "Existing-home installations with the larger grant", formula: "suitable_m * conv_grant * 1000000", expected: 160000, unit: "heat pumps" }
  - { id: grant_multiple, label: "Existing-home installations with the larger grant vs. today", formula: "retrofit_grant / retrofit", expected: 2, unit: "x" }
  - { id: engineers_grant, label: "Engineers needed with the larger grant", formula: "retrofit_grant * hollowmere_share / installs_per_engineer", expected: 64, unit: "engineers" }
  - { id: engineer_share_grant, label: "Share of engineers to retrain with the larger grant", formula: "engineers_grant / engineers", expected: 0.16, unit: "%" }
  - { id: naive_retrofit, label: "Installations if the stock of homes is used instead of the yearly flow (the wrong way)", formula: "boiler_homes_m * suitable_share * conv_now * 1000000", expected: 1200000, unit: "heat pumps" }

answer:
  calc: retrofit
  headline: "About {{retrofit}} a year in existing homes ({{total_hp}} including new builds): Hollowmere should retrain {{engineers_needed}} now and prepare for {{engineers_grant}} if the larger grant passes."

exhibits:
  - id: exhibit-1
    title: "Heating in UK homes"
    kind: table
    ask: "Here are the client's figures on homes and boilers. How many existing homes switch to a heat pump each year?"
    columns: ["Measure", "Value"]
    rows:
      - ["Homes heated by a gas or oil boiler", "{{boiler_homes_m}}"]
      - ["Average boiler life", "{{boiler_life}}"]
      - ["Homes suitable for a heat pump without major works (insulation, space for a unit)", "{{suitable_share}}"]
      - ["New homes built per year", "{{new_homes}}"]
      - ["New homes built with a heat pump", "{{newbuild_hp_share}}"]
    note: "Illustrative data created for this practice case; not official housing statistics."
    insight: |
      Homeowners switch heating when the old boiler fails, so the market is
      driven by the {{replacements_m}} replacements a year, not by the
      {{boiler_homes_m}} homes in the stock.
  - id: exhibit-2
    title: "Suitable homes choosing a heat pump when their boiler is replaced, by grant level"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "The government is consulting on a larger installation grant. What does this survey suggest?"
    data:
      - { label: "No grant", value: conv_none }
      - { label: "Today's grant", value: conv_now }
      - { label: "Proposed larger grant", value: conv_grant }
    note: "Illustrative data from a fictional homeowner survey created for this practice case."
    insight: |
      The grant is the biggest lever on demand: the proposed grant would take
      the choice rate from {{conv_now}} to {{conv_grant}}, taking installations
      in existing homes to {{grant_multiple}} today's level.
---

## Prompt

Our client, Hollowmere Heating, installs and services gas boilers in homes across the UK. It employs about **{{engineers}}** installation engineers. The UK wants homes to move from gas boilers to **heat pumps** — electric units that move heat from the outside air into the home, using far less energy than they deliver.

Retraining an engineer to install heat pumps takes several months and costs money, so Hollowmere doesn't want to retrain too many too early — or too few and lose the market to new competitors. The CEO asks: **how many heat pumps are installed in UK homes each year, and how many of our engineers should we retrain?**

## Clarifying information

- Q: Which installations are in scope?
  A: Residential heat pumps in England, Scotland, Wales and Northern Ireland, both existing homes and new builds. Commercial buildings are out of scope.
- Q: Does Hollowmere work on new homes?
  A: No. Housebuilders use their own contractors, so Hollowmere only competes for **existing homes**.
- Q: When do homeowners switch to a heat pump?
  A: Almost always when their old boiler needs replacing. Very few replace a working boiler.
- Q: Is there government support?
  A: Yes, a grant toward installation cost today, and a larger grant is under consultation. The client has survey data on how grants change homeowners' choices.
- Q: What share of the market would Hollowmere win?
  A: Assume it keeps its share of boiler replacements, about **{{hollowmere_share}}**.
- Q: How long does an installation take?
  A: About **{{install_days}}** per job, and engineers spend about **{{working_days}}** a year on installations (the rest is servicing, training and travel).

## Structure

> **Ask:** How would you structure this?

Size the **yearly flow of switches**, split into the segment Hollowmere can serve, then convert to engineers:

- **Existing homes (Hollowmere's market)**
  - Homes with a boiler ÷ boiler life = replacements per year
  - × share of homes suitable for a heat pump
  - × share of suitable homes that choose one (depends on the grant)
- **New homes (context only)**
  - New homes per year × share built with a heat pump
- **Hollowmere's workforce need**
  - Existing-home installations × Hollowmere's share = jobs
  - ÷ jobs per engineer per year = engineers to retrain
- **Scenario:** today's grant vs. the proposed larger grant

Top candidates point out right away that this is a **replacement market**: the number of homes matters only through how often boilers fail.

## Math walkthrough

> **Ask:** Using Exhibit 1, how many heat pumps go into existing homes each year, and how many in total? How many engineers does Hollowmere need? Then, using Exhibit 2, what changes with the larger grant?

**1. Existing homes.**
Replacements = 24m ÷ 15 years = **{{replacements_m}}** a year.
Suitable = {{replacements_m}} × {{suitable_share}} = **{{suitable_m}}**.
Heat pumps = {{suitable_m}} × {{conv_now}} = **{{retrofit}}** a year — only {{hp_share_of_replacements}} of all boiler replacements.

**2. New homes and total.**
New homes = {{new_homes}} × {{newbuild_hp_share}} = **{{newbuild_hp}}**.
Total = 80,000 + 120,000 = **{{total_hp}}** a year; existing homes are {{retrofit_share}} of it.

**3. Hollowmere's engineers.**
Jobs = 80,000 × 2% = **{{hollowmere_installs}}** a year.
Jobs per engineer = 200 days ÷ 4 days = **{{installs_per_engineer}}** a year.
Engineers = 1,600 ÷ 50 = **{{engineers_needed}}**, or {{engineer_share}} of the workforce.

**4. Larger grant (Exhibit 2).**
Existing-home installations = 0.8m × 20% = **{{retrofit_grant}}**.
Engineers = 160,000 × 2% ÷ 50 = **{{engineers_grant}}**, or {{engineer_share_grant}} of the workforce.

## Synthesis

> **Ask:** What do you recommend to the CEO?

**About {{retrofit}} a year go into existing UK homes — the market Hollowmere can serve — so it should retrain about {{engineers_needed}} now ({{engineer_share}} of its workforce) and line up a second group to reach {{engineers_grant}} if the larger grant is approved.**

- **The market is small today but growing:** heat pumps are only {{hp_share_of_replacements}} of boiler replacements, and most of the {{total_hp}} installed in total go into new homes, which Hollowmere doesn't serve.
- **Policy is the swing factor:** the proposed grant would lift existing-home installations to {{grant_multiple}} today's level, about {{retrofit_grant}} a year.
- **Retraining is a staged bet:** {{engineers_needed}} cover today's share; an option on {{engineers_grant}} protects Hollowmere if the market jumps.

**Risks / next steps:** competitors could take a larger share of heat pumps than of boilers (Hollowmere's share is not guaranteed); electricity and gas prices affect the choice; suitability could rise as homes are insulated. Next, track the grant consultation, sign up a heat-pump supplier for training and stock, and plan for lower boiler volumes as heat pumps grow.

## Common mistakes

- Applying the choice rate to all homes with a boiler instead of to yearly replacements, which gives {{naive_retrofit}} a year — {{boiler_life}} of demand counted at once.
- Counting new-build installations in Hollowmere's market, even though housebuilders use their own contractors.
- Forgetting the suitability filter: many homes need insulation or have no space for an outdoor unit.
- Stopping at the market size. The CEO asked how many engineers to retrain.

## What top candidates do differently

- Frame it as a **flow** (replacements) from the start and explain why.
- Separate the total market ({{total_hp}}) from Hollowmere's serviceable market ({{retrofit}}).
- Present the answer as a staged plan with a trigger (the grant decision), not a single number.
- Note the other side of the coin: every heat pump Hollowmere installs replaces a boiler job it would otherwise have done.

## Creative question

Many homeowners hesitate to switch to a heat pump even when their boiler fails. Besides grants, how could Hollowmere increase the share who choose one?

## Model answer

A strong answer tackles the reasons for hesitation:

- **Upfront cost:** offer financing or a monthly subscription that includes the unit, installation and servicing.
- **Uncertainty about performance:** a free home survey with an estimate of running costs, and a comfort guarantee.
- **Time pressure:** a boiler breakdown is an emergency; offer a temporary heater or a fast-track install so customers don't default to a new boiler.
- **Trust:** reviews and case studies from local customers; Hollowmere's servicing relationships give it a head start.
- **Planning ahead:** contact servicing customers whose boilers are over 12 years old before they fail.

Top candidates prioritize planning ahead: "Hollowmere already services thousands of old boilers. Talking to those homeowners before the boiler fails is the cheapest way to turn an emergency purchase into a considered one."
