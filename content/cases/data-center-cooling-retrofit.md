---
id: data-center-cooling-retrofit
title: "Keeping Cool: Is a Liquid-Cooling Retrofit Worth It?"
client: "Calloway Data Centers (fictional), operator of a colocation campus in the US Southeast"
summary: "A liquid-cooling retrofit cuts a data center's electricity bill, but a cheaper power contract stretches the payback past the hurdle. The answer flips when the candidate sees that the retrofit also frees power for more servers."
industry: tech-ai
sub_industry: "Data centers"
type: operations
difficulty: intermediate
format: interviewer-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  it_energy:    { value: 160,  unit: "GWh",   label: "Electricity used by the servers per year" }
  pue_now:      { value: 1.5,  unit: "",      label: "Power usage effectiveness (PUE) today: total facility power ÷ IT power" }
  pue_new:      { value: 1.2,  unit: "",      label: "PUE after the liquid-cooling retrofit" }
  price_now:    { value: 100,  unit: "$/MWh", label: "Electricity price under the current contract" }
  price_new:    { value: 75,   unit: "$/MWh", label: "Electricity price under the new contract from next year" }
  capex:        { value: 18,   unit: "$M",    label: "One-time cost of the liquid-cooling retrofit" }
  hurdle:       { value: 4,    unit: "years", label: "Maximum payback the board accepts" }
  grid_cap:     { value: 30,   unit: "MW",    label: "Grid connection limit for the site" }
  peak_draw:    { value: 30,   unit: "MW",    label: "Peak facility power today (servers, cooling and building)" }
  fitout_mw:    { value: 2.4,  unit: "$M",    label: "Cost per MW to fit out halls for extra IT capacity (racks, power distribution)" }
  margin_mw:    { value: 1.2,  unit: "$M",    label: "Annual lease margin per MW of IT capacity, net of the cooling and building power the new tenants add (tenants pay for their own server power)" }
  waitlist:     { value: 8,    unit: "MW",    label: "Tenant demand on the waiting list" }

calculations:
  # --- Energy saving ---
  - { id: facility_now, label: "Facility electricity use today", formula: "it_energy * pue_now", expected: 240, unit: "GWh" }
  - { id: facility_new, label: "Facility electricity use after the retrofit", formula: "it_energy * pue_new", expected: 192, unit: "GWh" }
  - { id: energy_saved, label: "Electricity saved per year", formula: "facility_now - facility_new", expected: 48, unit: "GWh" }
  - { id: energy_saved_pct, label: "Share of the site's total electricity saved", formula: "energy_saved / facility_now", expected: 0.20, unit: "%" }
  - { id: client_energy, label: "Electricity Calloway pays for today (cooling and building)", formula: "facility_now - it_energy", expected: 80, unit: "GWh" }
  - { id: client_saved_pct, label: "Share of Calloway's own electricity saved", formula: "energy_saved / client_energy", expected: 0.60, unit: "%" }
  - { id: saving_now, label: "Annual saving at today's price", formula: "energy_saved * price_now / 1000", expected: 4.8, unit: "$M" }
  - { id: payback_now, label: "Payback at today's price", formula: "capex / saving_now", expected: 3.75, unit: "years" }
  # --- New power contract ---
  - { id: saving_new, label: "Annual saving at the new contract price", formula: "energy_saved * price_new / 1000", expected: 3.6, unit: "$M" }
  - { id: payback_new, label: "Payback at the new contract price", formula: "capex / saving_new", expected: 5, unit: "years" }
  # --- Freed power capacity ---
  - { id: it_load, label: "Peak IT (server) load today", formula: "peak_draw / pue_now", expected: 20, unit: "MW" }
  - { id: draw_new, label: "Peak facility power after the retrofit (same servers)", formula: "it_load * pue_new", expected: 24, unit: "MW" }
  - { id: it_cap_new, label: "IT capacity the grid connection supports after the retrofit", formula: "grid_cap / pue_new", expected: 25, unit: "MW" }
  - { id: extra_it, label: "Extra IT capacity that can be leased", formula: "min(it_cap_new - it_load, waitlist)", expected: 5, unit: "MW" }
  - { id: fitout, label: "Fit-out cost for the extra IT capacity", formula: "fitout_mw * extra_it", expected: 12, unit: "$M" }
  - { id: lease_margin, label: "Annual margin from leasing the extra capacity", formula: "extra_it * margin_mw", expected: 6, unit: "$M" }
  - { id: total_benefit, label: "Total annual benefit (energy saving + lease margin)", formula: "saving_new + lease_margin", expected: 9.6, unit: "$M" }
  - { id: total_capex, label: "Total one-time cost (retrofit + fit-out)", formula: "capex + fitout", expected: 30, unit: "$M" }
  - { id: payback_full, label: "Payback including the extra capacity", formula: "total_capex / total_benefit", expected: 3.125, unit: "years", decimals: 1 }
  - { id: energy_hurdle, label: "Energy savings over the hurdle period", formula: "hurdle * saving_new", expected: 14.4, unit: "$M" }
  - { id: lease_hurdle, label: "Lease margin per MW over the hurdle period", formula: "hurdle * margin_mw", expected: 4.8, unit: "$M" }
  - { id: retrofit_gap, label: "Retrofit cost not recovered by energy savings within the hurdle", formula: "capex - hurdle * saving_new", expected: 3.6, unit: "$M" }
  - { id: net_per_mw, label: "Lease margin over the hurdle period minus fit-out, per MW leased", formula: "hurdle * margin_mw - fitout_mw", expected: 2.4, unit: "$M" }
  - { id: breakeven_mw, label: "Extra MW that must be leased (and fitted out) to meet the hurdle", formula: "retrofit_gap / net_per_mw", expected: 1.5, unit: "MW" }

answer:
  calc: payback_full
  headline: "On energy alone the retrofit pays back in {{payback_new}} at the new power price, missing the board's payback limit of {{hurdle}}; but it frees {{extra_it}} of IT capacity under the grid limit, and with that lease margin the payback falls to {{payback_full}}."

exhibits:
  - id: exhibit-1
    title: "Proposed liquid-cooling retrofit"
    kind: table
    ask: "Here is the engineering team's proposal. What is the payback?"
    columns: ["Item", "Today (air cooling)", "After retrofit (liquid cooling)"]
    rows:
      - ["Electricity used by servers per year", "{{it_energy}}", "{{it_energy}}"]
      - ["Power usage effectiveness (PUE)", "{{pue_now}}", "{{pue_new}}"]
      - ["Electricity price", "{{price_now}}", "{{price_now}}"]
      - ["One-time cost", "—", "{{capex}}"]
    note: "Illustrative data created for this practice case. Calloway Data Centers is fictional. PUE is total facility electricity divided by the electricity used by the servers; the rest goes mostly to cooling. Tenants pay for their servers' electricity; Calloway pays for cooling and building power."
    insight: |
      Cutting PUE from {{pue_now}} to {{pue_new}} saves {{energy_saved}}: a
      fifth of the site's electricity, and {{client_saved_pct}} of the power
      Calloway pays for. It pays back in {{payback_now}}, within the
      board's payback limit of {{hurdle}}.
  - id: exhibit-2
    title: "Electricity price, current and new supply contract ($/MWh)"
    kind: bar
    unit: "$/MWh"
    decimals: 0
    ask: "Procurement has just signed a new power contract. What happens to the payback?"
    data:
      - { label: "Current contract (this year)", value: price_now }
      - { label: "New contract (from next year, fixed for 10 years)", value: price_new }
    note: "Illustrative data created for this practice case."
    insight: |
      Cheaper power is good for Calloway but bad for the retrofit case: each
      MWh saved is worth less, so the saving falls to {{saving_new}} and payback
      stretches to {{payback_new}}.
  - id: exhibit-3
    title: "Site power and tenant demand"
    kind: table
    ask: "One more piece of information from the site team. Does it change your recommendation?"
    columns: ["Item", "Value"]
    rows:
      - ["Grid connection limit", "{{grid_cap}}"]
      - ["Peak facility power today", "{{peak_draw}}"]
      - ["Tenant demand on the waiting list", "{{waitlist}}"]
      - ["Fit-out cost for extra IT capacity, per MW", "{{fitout_mw}}"]
      - ["Annual lease margin per MW of IT capacity (net of the cooling and building power it adds)", "{{margin_mw}}"]
    note: "Illustrative data created for this practice case. The utility says a bigger grid connection would take at least four years. The halls have physical space for more racks."
    insight: |
      The site is at its power limit, so power, not space, caps revenue. With
      PUE at {{pue_new}}, the same {{grid_cap}} supports {{it_cap_new}} of
      servers instead of {{it_load}}.
---

## Prompt

Our client, Calloway Data Centers, runs a colocation campus: it leases space, power and cooling to companies that put their own servers in its halls. Demand from AI companies has grown fast, and Calloway's halls are full.

Today the site is cooled with air. The engineering team proposes a **liquid-cooling retrofit**, which pipes coolant directly to the hottest servers and cuts the electricity spent on cooling.

The CFO asks us: **is the retrofit worth the investment?**

## Clarifying information

- Q: How does Calloway make money?
  A: Tenants pay a monthly fee per kilowatt of IT capacity they reserve. They also pay for the electricity their servers use. Calloway pays for the electricity used for cooling and the building.
- Q: How does Calloway judge investments?
  A: The board wants projects to pay back within **{{hurdle}}**.
- Q: How long does the equipment last?
  A: Liquid-cooling equipment lasts about 15 years.
- Q: Can the site take more customers?
  A: There is a waiting list, but the site is at its grid connection limit, and the halls are full on power, not on floor space.
- Q: Will tenants' servers need liquid cooling anyway?
  A: Increasingly, yes. New AI servers run hotter, and some newer models are only sold with liquid cooling.

## Structure

> **Ask:** How would you evaluate the retrofit?

Compare the **one-time cost** with **all the annual benefits** it unlocks, then test against the hurdle:

- **One-time cost:** retrofit, plus any fit-out it makes possible
- **Annual benefits**
  - **Energy saving** = Server electricity × (PUE today − PUE after) × Electricity price
  - **Capacity freed:** if the site is limited by power, a lower PUE leaves more power for servers → more leased capacity × margin
  - **Strategic:** ability to host hotter AI servers, lower carbon footprint
- **Risks:** future electricity prices, tenant demand, installation downtime

A good hypothesis: *"This looks like a classic capex-for-opex trade, but data centers are usually limited by power. If the retrofit frees power, that may be worth more than the energy saving."*

## Math walkthrough

> **Ask:** Using Exhibit 1, what is the payback on energy savings? Using Exhibit 2, what happens under the new power contract? Then, using Exhibit 3, does anything change?

**1. Energy saving at today's price (Exhibit 1).**
Facility electricity: 160 GWh × 1.5 = {{facility_now}} today and 160 GWh × 1.2 = {{facility_new}} after, a saving of **{{energy_saved}}**. That is {{energy_saved_pct}} of the site's electricity, but tenants pay for their servers' 160 GWh, so Calloway's own bill covers only 240 − 160 = {{client_energy}} of cooling and building power. The retrofit cuts that by **{{client_saved_pct}}**.
At $100/MWh: 48,000 MWh × $100 = **{{saving_now}}** a year. Payback: $18M ÷ $4.8M = **{{payback_now}}**, inside the hurdle.

**2. The new power contract (Exhibit 2).**
From next year power costs {{price_new}}, so the saving falls to 48,000 MWh × $75 = **{{saving_new}}** and the payback stretches to $18M ÷ $3.6M = **{{payback_new}}**, outside the board's limit of {{hurdle}}. On energy alone, the retrofit fails.

**3. Freed power capacity (Exhibit 3).**
Today the site draws {{peak_draw}} at peak, exactly its grid limit, so the IT load at peak is 30 MW ÷ 1.5 = **{{it_load}}**. After the retrofit, the same servers draw 20 × 1.2 = {{draw_new}}.
The 30 MW limit now supports 30 ÷ 1.2 = **{{it_cap_new}}** of IT, so Calloway can lease **{{extra_it}}** more, well within the {{waitlist}} waiting list.
Lease margin: 5 MW × $1.2M = **{{lease_margin}}** a year, after one-time fit-out of 5 × $2.4M = **{{fitout}}**.

**4. Full payback.**

| Option | One-time cost | Annual benefit | Payback |
|---|---|---|---|
| Energy only, today's price | {{capex}} | {{saving_now}} | {{payback_now}} |
| Energy only, new price | {{capex}} | {{saving_new}} | {{payback_new}} |
| **Energy + freed capacity** | **{{total_capex}}** | **{{total_benefit}}** | **{{payback_full}}** |

**5. How much of the new capacity must be leased?**
Fit-out is only needed for the capacity actually leased. Over four years, energy savings bring 4 × $3.6M = {{energy_hurdle}} against the $18M retrofit, leaving **{{retrofit_gap}}** to recover. Each MW leased earns 4 × $1.2M = {{lease_hurdle}} over four years and costs $2.4M to fit out, a net **{{net_per_mw}}**. So Calloway needs $3.6M ÷ $2.4M = **{{breakeven_mw}}** of the {{extra_it}} freed.

## Synthesis

> **Ask:** What would you tell the CFO?

**Calloway should go ahead with the retrofit. On energy savings alone it no longer clears the hurdle (payback {{payback_new}} at the new power price), but by cutting PUE to {{pue_new}} it frees {{extra_it}} of IT capacity under the grid limit, and leasing that capacity brings the payback down to {{payback_full}}.**

1. **The energy case is weaker than it looks:** the new contract cuts the saving from {{saving_now}} to {{saving_new}} a year, so the retrofit fails the board's payback test ({{hurdle}}) on its own.
2. **Power is the real constraint:** the site is at its {{grid_cap}} limit with a waiting list of {{waitlist}}, and a bigger grid connection would take at least four years.
3. **The decision is robust:** the retrofit meets the hurdle if Calloway leases just {{breakeven_mw}} of the {{extra_it}} it frees.

**Risks and next steps:** plan the installation hall by hall to avoid downtime for existing tenants; sign leases with waiting-list tenants before committing the fit-out; check that the retrofit suits the hotter AI servers tenants are moving to, which strengthens the case further; and confirm that the new contract has no minimum-volume clause that would penalize Calloway for using less electricity.

## Common mistakes

- Evaluating the retrofit only on energy savings and rejecting it after the power price falls.
- Using today's electricity price when the new contract applies for most of the payback period.
- Missing that a lower PUE frees power for more servers when the site is at its grid limit.
- Measuring the saving against the whole site's power bill instead of the part Calloway pays: tenants pay for their servers' electricity, so the {{energy_saved}} saving is {{client_saved_pct}} of Calloway's own power, not a fifth.

## What top candidates do differently

- Ask early what limits the site's revenue: space, power or demand.
- Recompute the payback the moment the power price changes, rather than defending the first answer.
- Turn the capacity upside into a break-even ({{breakeven_mw}} of new leases), which tells the CFO how much demand risk the decision carries.
- Mention the strategic angle: new AI servers increasingly need liquid cooling, so the retrofit may soon be required to keep tenants.

## Creative question

If power, not space, limits a data center's revenue, what else could Calloway do to get more revenue from its grid connection?

## Model answer

Group ideas into **use less power for the same servers, use the power more fully, and get more power**:

- **Less power per server:** liquid cooling (this case); hot-aisle containment and higher temperature set points for air-cooled halls; more efficient power distribution and backup systems.
- **Use the power more fully:** tenants rarely use all the capacity they reserve, so sell the unused margin as lower-priced flexible capacity; charge more for high-density AI racks.
- **More power:** on-site solar and battery storage to cover peaks; agree with the utility to cut load during grid emergencies in exchange for a higher connection limit; start the application for a bigger grid connection now, since it takes years.

A top candidate prioritizes: "Selling unused reserved capacity is the fastest lever, because it needs no construction, but it depends on how predictable tenants' usage is, so I would look at a year of metering data first."
