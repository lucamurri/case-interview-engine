---
id: insurer-back-office-cost-cut
title: "Trimming the Back Office: An Insurer's Cost Program"
client: "Northgate Mutual Insurance (fictional), a mid-size US property and casualty insurer"
summary: "An insurer needs 15% off its back-office cost. Test automation, offshoring and wider spans of control, and find out which savings overlap, which cost the most to achieve and which hurt service."
industry: financial-services
sub_industry: "Property and casualty insurance"
type: cost-cutting
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative: realistic in shape, not real company data.
inputs:
  staff:          { value: 3600,   unit: "FTE", label: "Non-manager back-office staff" }
  mgrs:           { value: 600,    unit: "FTE", label: "Back-office managers" }
  staff_cost:     { value: 65000,  unit: "$", label: "Fully loaded cost per onshore staff member per year" }
  mgr_cost:       { value: 120000, unit: "$", label: "Fully loaded cost per manager per year" }
  pool:           { value: 1500,   unit: "FTE", label: "Staff in claims intake and policy administration (the work that can change)" }
  auto_share:     { value: 0.40,   unit: "%", label: "Share of that work automation can remove" }
  auto_run:       { value: 5,      unit: "$M", label: "Software and support cost of automation per year" }
  auto_onetime:   { value: 48,     unit: "$M", label: "One-time technology and build cost of automation" }
  sev:            { value: 25000,  unit: "$", label: "Severance per person who leaves" }
  off_share:      { value: 0.60,   unit: "%", label: "Share of the remaining work that can move offshore" }
  off_cost:       { value: 28000,  unit: "$", label: "Fully loaded cost per offshore staff member per year" }
  off_trans:      { value: 45000,  unit: "$", label: "One-time transition cost per offshored role (training, parallel running)" }
  cf_share:       { value: 0.40,   unit: "%", label: "Share of offshored roles that are customer-facing claims intake" }
  prem_aff:       { value: 1200,   unit: "$M", label: "Premium on policies served by the customer-facing teams" }
  ret_drop:       { value: 0.015,  unit: "pts", decimals: 1, label: "Retention drop on those policies seen in the offshore pilot" }
  margin:         { value: 0.30,   unit: "%", label: "Contribution margin on premium" }
  span_now:       { value: 6,      unit: "", label: "Staff per manager today" }
  span_new:       { value: 8,      unit: "", label: "Staff per manager proposed" }
  csat_drop:      { value: 0.08,   unit: "pts", label: "Customer-satisfaction drop in the claims intake pilot" }
  target_pct:     { value: 0.15,   unit: "%", label: "CFO's cost reduction target" }
  hurdle:         { value: 3,      unit: "years", label: "CFO's maximum payback" }

calculations:
  # --- Cost base ---
  - { id: pool_cost, label: "Cost of the claims and policy-admin teams", formula: "pool * staff_cost / 1000000", expected: 97.5, unit: "$M", decimals: 1 }
  - { id: other_staff, label: "Other back-office staff", formula: "staff - pool", expected: 2100, unit: "FTE" }
  - { id: other_cost, label: "Cost of other staff", formula: "other_staff * staff_cost / 1000000", expected: 136.5, unit: "$M", decimals: 1 }
  - { id: mgr_total, label: "Cost of managers", formula: "mgrs * mgr_cost / 1000000", expected: 72, unit: "$M" }
  - { id: base_cost, label: "Back-office cost today", formula: "pool_cost + other_cost + mgr_total", expected: 306, unit: "$M" }
  - { id: target, label: "Savings needed", formula: "base_cost * target_pct", expected: 45.9, unit: "$M", decimals: 1 }
  # --- Automation ---
  - { id: auto_fte, label: "Roles automation removes", formula: "pool * auto_share", expected: 600, unit: "FTE" }
  - { id: auto_gross, label: "Salary saved by automation", formula: "auto_fte * staff_cost / 1000000", expected: 39, unit: "$M" }
  - { id: auto_net, label: "Net annual saving from automation", formula: "auto_gross - auto_run", expected: 34, unit: "$M" }
  - { id: auto_one, label: "One-time cost of automation including severance", formula: "auto_onetime + auto_fte * sev / 1000000", expected: 63, unit: "$M" }
  - { id: auto_payback, label: "Payback on automation", formula: "auto_one / auto_net", expected: 1.8529, unit: "years", decimals: 1 }
  # --- Offshoring, alone and after automation ---
  - { id: off_unit, label: "Saving per role moved offshore", formula: "staff_cost - off_cost", expected: 37000, unit: "$" }
  - { id: off_alone_fte, label: "Roles offshored if done on its own", formula: "pool * off_share", expected: 900, unit: "FTE" }
  - { id: off_alone, label: "Annual saving from offshoring alone", formula: "off_alone_fte * off_unit / 1000000", expected: 33.3, unit: "$M", decimals: 1 }
  - { id: off_alone_one, label: "One-time cost of offshoring alone", formula: "off_alone_fte * (off_trans + sev) / 1000000", expected: 63, unit: "$M" }
  - { id: off_alone_payback, label: "Payback on offshoring alone", formula: "off_alone_one / off_alone", expected: 1.8919, unit: "years", decimals: 1 }
  - { id: remaining, label: "Roles left after automation", formula: "pool - auto_fte", expected: 900, unit: "FTE" }
  - { id: off_fte, label: "Roles offshored after automation", formula: "remaining * off_share", expected: 540, unit: "FTE" }
  - { id: off_gross, label: "Annual saving from offshoring after automation", formula: "off_fte * off_unit / 1000000", expected: 19.98, unit: "$M", decimals: 1 }
  - { id: overlap, label: "Offshoring saving lost to overlap with automation", formula: "off_alone - off_gross", expected: 13.32, unit: "$M", decimals: 1 }
  # --- Span of control ---
  - { id: mgr_after, label: "Managers needed at the wider span", formula: "staff / span_new", expected: 450, unit: "FTE" }
  - { id: mgr_saved, label: "Managers removed", formula: "mgrs - mgr_after", expected: 150, unit: "FTE" }
  - { id: span_saving, label: "Annual saving from the wider span", formula: "mgr_saved * mgr_cost / 1000000", expected: 18, unit: "$M" }
  - { id: span_one, label: "One-time cost of the wider span (severance)", formula: "mgr_saved * sev / 1000000", expected: 3.75, unit: "$M", decimals: 2 }
  # --- Service-level twist ---
  - { id: cf_fte, label: "Customer-facing roles offshored", formula: "off_fte * cf_share", expected: 216, unit: "FTE" }
  - { id: admin_fte, label: "Policy-admin roles offshored", formula: "off_fte - cf_fte", expected: 324, unit: "FTE" }
  - { id: cf_saving, label: "Gross saving from offshoring customer-facing roles", formula: "cf_fte * off_unit / 1000000", expected: 7.992, unit: "$M", decimals: 1 }
  - { id: lost_prem, label: "Premium lost to lower retention", formula: "prem_aff * ret_drop", expected: 18, unit: "$M" }
  - { id: lost_profit, label: "Profit lost to lower retention per year", formula: "lost_prem * margin", expected: 5.4, unit: "$M" }
  - { id: cf_net, label: "Net saving from offshoring customer-facing roles", formula: "cf_saving - lost_profit", expected: 2.592, unit: "$M", decimals: 1 }
  - { id: cf_one, label: "One-time cost of offshoring customer-facing roles", formula: "cf_fte * (off_trans + sev) / 1000000", expected: 15.12, unit: "$M", decimals: 1 }
  - { id: cf_payback, label: "Payback on offshoring customer-facing roles", formula: "cf_one / cf_net", expected: 5.8333, unit: "years", decimals: 1 }
  - { id: admin_saving, label: "Saving from offshoring policy-admin roles", formula: "admin_fte * off_unit / 1000000", expected: 11.988, unit: "$M", decimals: 1 }
  - { id: admin_one, label: "One-time cost of offshoring policy-admin roles", formula: "admin_fte * (off_trans + sev) / 1000000", expected: 22.68, unit: "$M", decimals: 1 }
  - { id: admin_payback, label: "Payback on offshoring policy-admin roles", formula: "admin_one / admin_saving", expected: 1.8919, unit: "years", decimals: 1 }
  # --- The program ---
  - { id: naive_total, label: "Sum of the three levers as first presented", formula: "auto_net + off_alone + span_saving", expected: 85.3, unit: "$M", decimals: 1 }
  - { id: rec_saving, label: "Recommended program: annual saving", formula: "auto_net + admin_saving + span_saving", expected: 63.988, unit: "$M", decimals: 1 }
  - { id: rec_one, label: "Recommended program: one-time cost", formula: "auto_one + admin_one + span_one", expected: 89.43, unit: "$M", decimals: 1 }
  - { id: rec_payback, label: "Recommended program: payback", formula: "rec_one / rec_saving", expected: 1.3976, unit: "years", decimals: 1 }
  - { id: rec_pct, label: "Recommended program as a share of the cost base", formula: "rec_saving / base_cost", expected: 0.2091, unit: "%", decimals: 0 }
  - { id: headroom, label: "Savings above target", formula: "rec_saving - target", expected: 18.088, unit: "$M", decimals: 1 }
  - { id: overstate, label: "How much the first sum overstated the program", formula: "naive_total - rec_saving", expected: 21.312, unit: "$M", decimals: 1 }

answer:
  calc: rec_saving
  headline: "Automate, offshore only policy administration and widen spans: {{rec_saving}} a year ({{rec_pct}} of cost) for {{rec_one}} one time. Keep customer-facing claims intake onshore."

exhibits:
  - id: exhibit-1
    title: "Back-office workforce and cost today"
    kind: table
    ask: "Here is the back-office cost base. Where would you look for savings?"
    columns: ["Group", "People", "Cost per person", "Annual cost"]
    rows:
      - ["Claims intake and policy administration", "{{pool}}", "{{staff_cost}}", "{{pool_cost}}"]
      - ["Other staff (finance, underwriting support, IT service desk)", "{{other_staff}}", "{{staff_cost}}", "{{other_cost}}"]
      - ["Managers (one per {{span_now}} staff)", "{{mgrs}}", "{{mgr_cost}}", "{{mgr_total}}"]
      - ["Total", "", "", "{{base_cost}}"]
    note: "Illustrative data created for this practice case. Northgate Mutual is fictional. Cost per person is fully loaded (pay, benefits, space, equipment)."
    insight: |
      The back office costs {{base_cost}} and the target is {{target}}. The claims and
      policy-admin teams are the only large pool where the work itself can change.
  - id: exhibit-2
    title: "Savings levers as the program team presented them"
    kind: table
    ask: "The program team added up three levers. Does that sum hold?"
    columns: ["Lever", "Annual saving", "One-time cost", "Payback"]
    rows:
      - ["Automate {{auto_share}} of claims and policy-admin work", "{{auto_net}}", "{{auto_one}}", "{{auto_payback}}"]
      - ["Offshore {{off_share}} of claims and policy-admin work", "{{off_alone}}", "{{off_alone_one}}", "{{off_alone_payback}}"]
      - ["Widen spans from {{span_now}} to {{span_new}}", "{{span_saving}}", "{{span_one}}", "Under a year"]
      - ["Sum as presented", "{{naive_total}}", "", ""]
    note: "Illustrative data created for this practice case. Each lever was sized separately, as if the other two were not happening."
    insight: |
      Automation and offshoring act on the same {{pool}} people. If automation goes first
      it removes {{auto_fte}} roles, so offshoring has only {{remaining}} left to move and
      its saving falls by {{overlap}}.
  - id: exhibit-3
    title: "Offshoring pilot results, by type of work"
    kind: table
    ask: "The team ran two small pilots before sizing the plan. What do the results mean?"
    columns: ["Measure", "Policy administration pilot", "Claims intake pilot (customer-facing)"]
    rows:
      - ["Cost saved per role moved", "{{off_unit}}", "{{off_unit}}"]
      - ["Customer satisfaction", "No change", "Down {{csat_drop}}"]
      - ["Retention of policies served", "No change", "Down {{ret_drop}}"]
      - ["Premium on policies served", "Not applicable", "{{prem_aff}}"]
    note: "Illustrative data created for this practice case. Contribution margin on premium is {{margin}}."
    insight: |
      The customer-facing pilot costs {{lost_profit}} a year in lost profit against
      {{cf_saving}} of gross savings, so only {{cf_net}} is left and payback stretches to {{cf_payback}}.
---

## Prompt

Our client is Northgate Mutual Insurance, a mid-size US property and casualty insurer. Premiums have grown slowly while claims costs have risen, and the CFO wants the back-office cost base ({{base_cost}} a year) cut by **{{target_pct}}**.

The program team has proposed three levers: automate claims intake and policy administration, offshore part of that work, and widen managers' spans of control.

The CFO asks us: **can Northgate reach the target, what should the program include, and what will it cost to get there?**

## Clarifying information

- Q: What is the target and the time frame?
  A: Savings of {{target}} a year, in place within about 24 months, with every lever paying back within {{hurdle}}.
- Q: What work can change?
  A: Only the {{pool}} people in claims intake and policy administration. The rest of the back office (finance, underwriting support, service desk) is out of scope for automation and offshoring.
- Q: What does automation need?
  A: A one-time build of {{auto_onetime}}, then {{auto_run}} a year for software and support. It can remove {{auto_share}} of the work in scope. People who leave receive {{sev}} severance.
- Q: What does offshoring involve?
  A: Roles move to a service center at {{off_cost}} per person, against {{staff_cost}} onshore. Each role costs {{off_trans}} to transition plus {{sev}} severance. About {{off_share}} of the work that remains after other changes can move.
- Q: Have any pilots been run?
  A: Yes, two small offshore pilots: one in policy administration (no customer contact) and one in customer-facing claims intake. Ask for the results when you are ready.
- Q: Is service level a concern?
  A: Yes. The customer-facing teams handle policies carrying {{prem_aff}} in premium. The board does not want retention to fall.
- Q: What about the span of control?
  A: Managers lead {{span_now}} staff on average. Industry norms are {{span_new}} for this kind of work. Ignore knock-on effects on manager numbers from other staff cuts; the CFO treats those as upside.

## Structure

The candidate should set out their own approach. A strong one:

- **1. The target and the base**
  - Cost base by group; savings needed; time frame
  - Which parts of the cost can move (staff in scope, managers)
- **2. Levers, each with benefit and cost**
  - Automation: share of work removed, software cost, build cost, severance
  - Offshoring: wage difference, transition cost, which work can move
  - Span of control: managers removed, severance
  - Check **overlap**: do levers act on the same people?
- **3. Cost to achieve:** one-time costs against annual savings, payback against the CFO's limit
- **4. Risks:** customer service and retention, execution, regulation and data, morale and attrition of key people

A good hypothesis: *"Automation and span changes are largely under our control and should pay back fast. Offshoring is cheaper per role but touches customers, so I would test where it can safely be used."*

## Math walkthrough

**1. The base and the target.**
Pool cost {{pool_cost}}, other staff {{other_cost}} and managers {{mgr_total}} add up to **{{base_cost}}**. A {{target_pct}} cut is **{{target}}**.

**2. Automation.**
Removing {{auto_share}} of {{pool}} roles takes out **{{auto_fte}}** roles worth {{auto_gross}} of salary. After {{auto_run}} of software cost, the net saving is **{{auto_net}}** a year.
One-time cost is the {{auto_onetime}} build plus severance for {{auto_fte}} people, or **{{auto_one}}**. Payback is **{{auto_payback}}**.

**3. Offshoring: alone and after automation.**
Each role moved saves {{staff_cost}} less {{off_cost}}, or {{off_unit}}.
On its own, offshoring {{off_alone_fte}} roles saves **{{off_alone}}**, at a one-time cost of {{off_alone_one}}.
But automation goes first. Only {{remaining}} roles remain, and {{off_share}} of them is **{{off_fte}}** roles. Savings are {{off_gross}}, which is **{{overlap}} lower** than the standalone figure: the overlap.

**4. Span of control.**
At {{span_new}} staff per manager, {{staff}} staff need {{mgr_after}} managers, so **{{mgr_saved}}** managers go. Saving: **{{span_saving}}** a year for {{span_one}} of severance.

**5. The service-level twist.**
Of the {{off_fte}} offshored roles, {{cf_share}} ({{cf_fte}}) are customer-facing claims intake and {{admin_fte}} are policy administration.
The claims-intake pilot cut retention by {{ret_drop}} on policies carrying {{prem_aff}}: {{lost_prem}} of premium, or **{{lost_profit}}** of profit a year at a {{margin}} margin.
Gross saving on those roles is only {{cf_saving}}, so the net saving is **{{cf_net}}** and payback is **{{cf_payback}}**, far beyond the {{hurdle}} limit.
Policy-admin offshoring saves **{{admin_saving}}** for {{admin_one}}: payback **{{admin_payback}}**, with no pilot service impact.

**6. The program.**
The team's simple sum was {{naive_total}}. The recommended program (automation, policy-admin offshoring, wider spans) saves **{{rec_saving}}**, which is {{rec_pct}} of the base and {{headroom}} above the target. One-time cost is **{{rec_one}}** and payback is **{{rec_payback}}**.
The first sum overstated the answer by {{overstate}}.

## Synthesis

**Northgate can beat the target: automation, policy-admin offshoring and wider spans save {{rec_saving}} a year ({{rec_pct}} of the base) for {{rec_one}} one time, paying back in {{rec_payback}}. It should keep customer-facing claims intake onshore, because the retention loss wipes out most of that saving.**

1. **Do not add the levers separately:** automation and offshoring act on the same people, and the overlap alone is worth {{overlap}}. The first sum of {{naive_total}} overstated the program by {{overstate}}.
2. **Protect service:** moving claims intake cuts retention and leaves a net saving of {{cf_net}}, with a {{cf_payback}} payback, so it fails the {{hurdle}} test.
3. **Mind the cash:** {{rec_one}} of one-time cost comes before most of the savings, and most of it is severance and automation build.

**Risks and next steps:** plan the automation build in waves so the first release pays for the next; set service-level targets (cycle time, satisfaction, retention) with a trigger to pause offshoring; keep the {{headroom}} cushion in reserve for slippage; manage attrition of key staff during the program; and check whether offshored policy-admin work meets data-privacy and regulatory rules before the first move.

## Common mistakes

- Adding the three levers as if they were independent, and counting {{overlap}} of offshoring savings that automation already takes.
- Ignoring one-time costs (build, transition, severance) and quoting only annual savings.
- Offshoring customer-facing work without checking the pilot, and missing the retention loss.
- Forgetting that the automation saving must be net of its software and support costs.

## What top candidates do differently

- Ask early whether the levers touch the same people, and size them in sequence.
- Test each lever against the payback limit rather than the total only.
- Notice that service quality has a dollar value (premium retained) and put it in the math.
- End with a sequenced plan and the cushion above the target, not just a number.

## Creative question

Beyond automation, offshoring and spans, how else could Northgate lower back-office cost?

## Model answer

Group ideas by **demand, process and sourcing**:

- **Demand:** push customers to self-service (online claims status, digital policy changes) so fewer calls reach the back office; cut avoidable rework with better first-time-right data capture from agents.
- **Process:** simplify products and forms so each policy needs fewer manual steps; straight-through processing for small, low-risk claims; fewer handoffs between intake and adjusters.
- **Sourcing:** use a vendor for overflow in peak seasons instead of permanent staff; consolidate office space as roles change; renegotiate software and printing contracts.

A top candidate prioritizes: "Self-service and straight-through processing reduce volume and also make the automation case stronger, so I would start there and compare the gains with the {{rec_saving}} already in the plan."
