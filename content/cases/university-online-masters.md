---
id: university-online-masters
title: "Logging In at a Loss: A University's Online Master's Program"
client: "Calloway University (fictional), a private nonprofit university in the US Midwest"
summary: "A new online master's program lost almost $5M in its second year and the board wants it to break even within three years. The loss looks structural until you separate one-time launch costs from the per-student economics."
industry: other
sub_industry: "Higher education"
type: profitability
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real university data.
inputs:
  list_tuition:   { value: 30000, unit: "$", label: "Published tuition per student per year" }
  discount:       { value: 0.20,  unit: "%",         label: "Average tuition discount (scholarships and employer rates)" }
  var_cost:       { value: 8000,  unit: "$", label: "Variable cost per student per year (adjunct instructors, student support, payment fees)" }
  intake_26:      { value: 250,   unit: "students",  label: "New students starting the program, FY2026" }
  persist:        { value: 0.60,  unit: "%",         label: "Share of first-year students who continue to the second year" }
  platform:       { value: 1.2,   unit: "$M",        label: "Online learning platform license and hosting (recurring)", decimals: 1 }
  course_dev:     { value: 3.2,   unit: "$M",        label: "Course development to build the program's 12 courses (one-time, ends FY2026)", decimals: 1 }
  marketing:      { value: 4.4,   unit: "$M",        label: "Marketing and student recruitment per year", decimals: 1 }
  staff:          { value: 2.4,   unit: "$M",        label: "Program staff: director, advisers, admissions", decimals: 1 }
  intake_29:      { value: 300,   unit: "students",  label: "New students per year expected by FY2028–FY2029 at the same marketing budget" }
  coach_cost:     { value: 0.4,   unit: "$M",        label: "Annual cost of a student-success coaching service", decimals: 1 }
  persist_coach:  { value: 0.80,  unit: "%",         label: "Share continuing to the second year with coaching (pilot result)" }

calculations:
  # --- FY2026 P&L ---
  - { id: net_tuition, label: "Net tuition per student per year", formula: "list_tuition * (1 - discount)", expected: 24000, unit: "$" }
  - { id: contrib_per, label: "Contribution per student per year", formula: "net_tuition - var_cost", expected: 16000, unit: "$" }
  - { id: contrib_margin, label: "Contribution margin", formula: "contrib_per / net_tuition", expected: 0.667, unit: "%", decimals: 0 }
  - { id: students_26, label: "Students enrolled, FY2026 (first-years + continuing second-years)", formula: "intake_26 * (1 + persist)", expected: 400, unit: "students" }
  - { id: revenue_26, label: "Net tuition revenue, FY2026", formula: "students_26 * net_tuition / 1e6", expected: 9.6, unit: "$M", decimals: 1 }
  - { id: var_26, label: "Variable cost, FY2026", formula: "students_26 * var_cost / 1e6", expected: 3.2, unit: "$M", decimals: 1 }
  - { id: contrib_26, label: "Contribution, FY2026", formula: "revenue_26 - var_26", expected: 6.4, unit: "$M", decimals: 1 }
  - { id: platform_total, label: "Platform and course development, FY2026", formula: "platform + course_dev", expected: 4.4, unit: "$M", decimals: 1 }
  - { id: fixed_26, label: "Fixed cost, FY2026", formula: "platform_total + marketing + staff", expected: 11.2, unit: "$M", decimals: 1 }
  - { id: result_26, label: "Operating result, FY2026", formula: "contrib_26 - fixed_26", expected: -4.8, unit: "$M", decimals: 1 }
  - { id: breakeven_26, label: "Students needed to break even at FY2026 costs", formula: "fixed_26 * 1e6 / contrib_per", expected: 700, unit: "students" }
  # --- Steady state, once course development ends ---
  - { id: fixed_steady, label: "Recurring fixed cost (without course development)", formula: "platform + marketing + staff", expected: 8.0, unit: "$M", decimals: 1 }
  - { id: result_steady_26, label: "FY2026 result on recurring costs only", formula: "contrib_26 - fixed_steady", expected: -1.6, unit: "$M", decimals: 1 }
  - { id: breakeven_steady, label: "Students needed to break even on recurring costs", formula: "fixed_steady * 1e6 / contrib_per", expected: 500, unit: "students" }
  - { id: loss_steady_26, label: "FY2026 loss on recurring costs only", formula: "abs(result_steady_26)", expected: 1.6, unit: "$M", decimals: 1 }
  - { id: one_time_share, label: "Share of the FY2026 loss caused by one-time course development", formula: "course_dev / -result_26", expected: 0.667, unit: "%", decimals: 0 }
  # --- Unit economics of a new student ---
  - { id: cac, label: "Marketing cost per new student", formula: "marketing * 1e6 / intake_26", expected: 17600, unit: "$" }
  - { id: years_per_student, label: "Average years enrolled per new student", formula: "1 + persist", expected: 1.6, unit: "years", decimals: 1 }
  - { id: life_contrib, label: "Contribution over a new student's time in the program", formula: "contrib_per * years_per_student", expected: 25600, unit: "$" }
  - { id: unit_surplus, label: "Contribution left per new student after recruitment cost", formula: "life_contrib - cac", expected: 8000, unit: "$" }
  # --- FY2029 outlook ---
  - { id: students_29, label: "Students enrolled, FY2029 (base case)", formula: "intake_29 * (1 + persist)", expected: 480, unit: "students" }
  - { id: gap_29, label: "Shortfall versus the break-even enrollment", formula: "breakeven_steady - students_29", expected: 20, unit: "students" }
  - { id: result_29, label: "Operating result, FY2029 (base case)", formula: "students_29 * contrib_per / 1e6 - fixed_steady", expected: -0.32, unit: "$M", decimals: 2 }
  # --- Coaching lever ---
  - { id: students_coach, label: "Students enrolled, FY2029 with coaching", formula: "intake_29 * (1 + persist_coach)", expected: 540, unit: "students" }
  - { id: fixed_coach, label: "Recurring fixed cost with coaching", formula: "fixed_steady + coach_cost", expected: 8.4, unit: "$M", decimals: 1 }
  - { id: breakeven_coach, label: "Students needed to break even with coaching", formula: "fixed_coach * 1e6 / contrib_per", expected: 525, unit: "students" }
  - { id: result_coach, label: "Operating result, FY2029 with coaching", formula: "students_coach * contrib_per / 1e6 - fixed_coach", expected: 0.24, unit: "$M", decimals: 2 }
  # --- Bridge from FY2026 to FY2029 ---
  - { id: dev_effect, label: "Course development ends", formula: "course_dev", expected: 3.2, unit: "$M", decimals: 1 }
  - { id: growth_effect, label: "Higher intake (more students at the FY2026 persistence rate)", formula: "(students_29 - students_26) * contrib_per / 1e6", expected: 1.28, unit: "$M", decimals: 2 }
  - { id: coach_gain, label: "Extra contribution from better persistence", formula: "(students_coach - students_29) * contrib_per / 1e6", expected: 0.96, unit: "$M", decimals: 2 }
  - { id: coach_net, label: "Net effect of coaching", formula: "coach_gain - coach_cost", expected: 0.56, unit: "$M", decimals: 2 }
  - { id: bridge_check, label: "Bridge total (must equal the FY2029 result with coaching)", formula: "result_26 + dev_effect + growth_effect + coach_net", expected: 0.24, unit: "$M", decimals: 2 }

answer:
  calc: result_coach
  headline: "The {{result_26}} loss is mostly one-time course building; on recurring costs the program needs {{breakeven_steady}}, base-case growth reaches only {{students_29}}, and coaching that lifts persistence to {{persist_coach}} gets it to a {{result_coach}} surplus by FY2029."

exhibits:
  - id: exhibit-1
    title: "Online MS in Data Analytics: FY2026 program P&L"
    kind: table
    ask: "Here is the program's P&L for its second year."
    columns: ["", "FY2026"]
    rows:
      - ["Students enrolled", "{{students_26}}"]
      - ["Net tuition per student", "{{net_tuition}}"]
      - ["Net tuition revenue", "{{revenue_26}}"]
      - ["Variable cost (at {{var_cost}} per student)", "{{var_26}}"]
      - ["**Contribution**", "**{{contrib_26}}**"]
      - ["Platform and course development", "{{platform_total}}"]
      - ["Marketing and recruitment", "{{marketing}}"]
      - ["Program staff", "{{staff}}"]
      - ["**Operating result**", "**{{result_26}}**"]
    note: "Illustrative data created for this practice case. Calloway University is fictional. Direct program costs only; no central university overhead is charged to the program."
    insight: |
      Each student contributes {{contrib_per}} a year, a {{contrib_margin}} margin.
      The loss comes from fixed costs, so the key question is which of them
      will still be there in three years.
  - id: exhibit-2
    title: "Enrollment outlook and coaching pilot"
    kind: table
    ask: "Here is the admissions team's outlook and the result of a coaching pilot."
    columns: ["", "FY2026 actual", "FY2029 base case", "FY2029 with coaching"]
    rows:
      - ["New students starting", "{{intake_26}}", "{{intake_29}}", "{{intake_29}}"]
      - ["Share continuing to year 2", "{{persist}}", "{{persist}}", "{{persist_coach}}"]
      - ["Students enrolled (first-years + second-years)", "{{students_26}}", "?", "?"]
      - ["Marketing budget", "{{marketing}}", "{{marketing}}", "{{marketing}}"]
      - ["Coaching cost", "–", "–", "{{coach_cost}}"]
    note: "Illustrative data created for this practice case. The coaching pilot assigned a personal success coach to 60 first-year students; {{persist_coach}} of them continued, against {{persist}} for everyone else."
    insight: |
      Growth in new students alone leaves the program {{gap_29}} short.
      Keeping more of the students it already recruited is cheaper than
      recruiting more: four in ten first-years drop out today.
---

## Prompt

Our client is Calloway University, a private nonprofit university in the Midwest. Two years ago it launched a fully online, part-time **Master of Science in Data Analytics** for working adults. The program takes two years to complete.

The program lost almost $5 million this year, its second. Some trustees want to close it. The provost believes in it and has asked us: **can the program break even within three years, and what would it take?**

## Clarifying information

- Q: What is the objective? Does the program need to make money?
  A: No. As a nonprofit, Calloway wants the program to cover its own direct costs (an operating result of zero or better) by FY2029, three years from now. It serves the university's mission of reaching working adults, so a small surplus is enough.
- Q: Which of the fixed costs are recurring?
  A: The {{platform_total}} for platform and course development has two parts. {{course_dev}} is the one-time cost of building the program's 12 courses (instructional designers, video production), and it ends this year. The {{platform}} platform license and hosting will continue every year.
- Q: How is enrollment counted?
  A: Students take two years. Enrollment in any year is the new first-year class plus the second-years who continued from last year's class. Today {{persist}} of first-years continue. Last year's (FY2025) first-year class was also {{intake_26}}.
- Q: What price do students actually pay?
  A: Published tuition is {{list_tuition}} a year, but the average discount (scholarships and employer partnership rates) is {{discount}}.
- Q: How fast can enrollment grow?
  A: Admissions expects new-student intake to reach about {{intake_29}} a year by FY2028 on the current marketing budget, as alumni referrals and employer partnerships build. Assume the FY2028 and FY2029 classes are both {{intake_29}}.
- Q: Why do students leave after the first year?
  A: Exit surveys point to workload and work–life conflicts rather than course quality. A coaching pilot showed results; data is available if the candidate asks.
- Q: Is central university overhead charged to the program?
  A: No, the P&L shows direct program costs only. Ignore overhead.

## Structure

> **Ask:** How would you structure the problem?

A profitability tree adapted to a program with a breakeven objective:

- **Operating result = Students × Contribution per student − Fixed costs**
  - **Students**
    - New students: inquiries, applications, admits, yield
    - Persistence: share who continue to year 2
  - **Contribution per student**
    - Net tuition: published price less discounts
    - Variable cost: instructors per section, student support, fees
  - **Fixed costs**
    - One-time: building courses
    - Recurring: platform, marketing, staff
- **Breakeven test:** students needed versus students realistically achievable by FY2029

Hypothesis: *"New programs carry launch costs. If contribution per student is healthy, the loss may say more about the program's age than its economics. I want to separate one-time from recurring costs, then compare the breakeven enrollment with a realistic forecast."*

## Math walkthrough

> **Ask:** Using Exhibit 1, why does the program lose money? How many students does it need to break even, and can it get there by FY2029?

**1. Per-student economics.**
Net tuition: $30,000 × (1 − 20%) = **{{net_tuition}}**. Contribution: $24,000 − $8,000 = **{{contrib_per}}** per student per year, a {{contrib_margin}} margin.

**2. FY2026 P&L.**
Students: 250 × (1 + 60%) = **{{students_26}}**. Contribution: 400 × $16,000 = {{contrib_26}}. Fixed cost: $4.4M + $4.4M + $2.4M = {{fixed_26}}. Result: **{{result_26}}**.
At these costs the program needs $11.2M ÷ $16,000 = **{{breakeven_26}}**, almost twice today's enrollment. That is the number that worries the trustees.

**3. Remove the one-time cost.**
Course development ({{course_dev}}) ends this year and explains {{one_time_share}} of the loss. Recurring fixed cost is $1.2M + $4.4M + $2.4M = **{{fixed_steady}}**, so FY2026 on a recurring basis would have lost only {{loss_steady_26}}.
Breakeven enrollment: $8.0M ÷ $16,000 = **{{breakeven_steady}}**.

**4. Is recruitment worth it?**
Marketing costs $4.4M ÷ 250 = **{{cac}}** per new student. Each new student stays {{years_per_student}} on average and contributes $16,000 × 1.6 = **{{life_contrib}}**, leaving {{unit_surplus}} toward platform and staff. Recruiting students pays.

**5. FY2029 base case (Exhibit 2).**
Enrollment: 300 × (1 + 60%) = **{{students_29}}**, {{gap_29}} short of breakeven. Result: 480 × $16,000 − $8.0M = **{{result_29}}**. Close, but the target is missed.

**6. Coaching.**
With persistence at 80%: 300 × 1.8 = **{{students_coach}}**. Fixed cost rises to {{fixed_coach}}, so breakeven moves to {{breakeven_coach}}. Result: 540 × $16,000 − $8.4M = **{{result_coach}}**.

## Synthesis

> **Ask:** What should the provost tell the board?

**The program can break even by FY2029, but only if Calloway keeps more of the students it recruits. The {{result_26}} loss is mostly one-time course building; on recurring costs the program needs {{breakeven_steady}}. Growth alone gets it to {{students_29}}, and a coaching service that lifts persistence from {{persist}} to {{persist_coach}} turns the result into a {{result_coach}} surplus.**

| Step | Impact | Result |
|---|---|---|
| FY2026 operating result | | {{result_26}} |
| Course development ends | +{{dev_effect}} | {{result_steady_26}} |
| Intake grows from {{intake_26}} to {{intake_29}} | +{{growth_effect}} | {{result_29}} |
| Coaching: +{{coach_gain}} contribution, −{{coach_cost}} cost | +{{coach_net}} | **{{bridge_check}}** |

1. **The economics per student are good:** {{contrib_per}} of contribution a year and {{unit_surplus}} left per recruit after marketing. Closing the program now would mean writing off the course build just as it stops costing money.
2. **Growth is necessary but not sufficient:** the base case is {{gap_29}} short.
3. **Persistence is the cheapest lever:** each student who stays for year 2 adds {{contrib_per}} with no recruiting cost.

**Risks and next steps:** the pilot covered only 60 students, so roll coaching out to the next full class and track persistence each term; the surplus is thin, so prepare a fallback (a smaller tuition discount or shared marketing with Calloway's other online programs); watch for price competition from larger online programs; review the board's three-year target if FY2027 intake comes in below 280.

## Common mistakes

- Treating the {{course_dev}} course build as a recurring cost and concluding the program needs {{breakeven_26}}, which leads to closing a viable program.
- Counting enrollment as the new class only and forgetting the continuing second-years.
- Recommending heavy marketing cuts: at {{cac}} per recruit against {{life_contrib}} of contribution, recruitment pays for itself.
- Applying a for-profit objective. The goal is breakeven while serving the mission, not maximum surplus.

## What top candidates do differently

- Ask early which costs are one-time, and restate the problem as "launch costs versus ongoing economics."
- Express the target as a breakeven enrollment and compare it with a realistic forecast, which makes the gap concrete.
- Notice that persistence raises enrollment without new recruiting cost.
- Say plainly that the base case misses the target, then show what closes the gap.

## Creative question

Beyond coaching, what could Calloway do to raise enrollment or lower costs in the online program?

## Model answer

Organize ideas by **students in, students staying, cost per student**:

- **Students in:** employer partnerships where companies pay tuition for groups of staff; stackable certificates that let students start small and convert to the full degree; offering the program to Calloway's own alumni.
- **Students staying:** flexible pacing (taking one course a term during busy periods); cohort study groups; a "pause" option instead of withdrawal.
- **Cost per student:** reuse the courses in other online programs to share platform and staff; larger online sections with teaching assistants; shared admissions with other graduate programs.

A top candidate prioritizes: "Employer partnerships do two things at once: they bring groups of students at a low recruiting cost, and employer-funded students are less likely to drop out."
