---
id: warehouse-robotics-sizing
title: "Pick and Place: Sizing the US Market for Warehouse Picking Robots"
client: "Brightlane Robotics (fictional), a start-up that builds mobile picking robots for warehouses"
summary: "A robotics start-up wants to know how much US warehouses spend each year on picking robots. Watch out for the difference between the robots already installed and the robots bought this year."
industry: industrials
sub_industry: "Warehouse automation"
type: market-sizing
difficulty: intermediate
format: interviewer-led
time_minutes: 25

# All numbers are illustrative — realistic in shape, not real company data.
inputs:
  warehouses:   { value: 4000,  unit: "sites",  label: "Large US warehouses and distribution centers" }
  share_suit:   { value: 0.30,  unit: "%",      label: "Share of large warehouses suitable for picking robots" }
  penetration:  { value: 0.40,  unit: "%",      label: "Share of suitable warehouses already running picking robots" }
  growth_pts:   { value: 0.05,  unit: "pts",    label: "Increase in that share per year (new sites adopting)" }
  robots_site:  { value: 40,    unit: "robots", label: "Picking robots per adopting warehouse" }
  life:         { value: 6,     unit: "years",  label: "Useful life of a picking robot" }
  buy_share:    { value: 0.50,  unit: "%",      label: "Share of robots bought outright (the rest are leased)" }
  price:        { value: 45000, unit: "$",      label: "Purchase price per robot" }
  lease_fee:    { value: 13000, unit: "$",      label: "Lease fee per robot per year" }

calculations:
  - { id: suitable, label: "Suitable warehouses", formula: "warehouses * share_suit", expected: 1200, unit: "sites" }
  - { id: sites_with, label: "Warehouses running robots today", formula: "suitable * penetration", expected: 480, unit: "sites" }
  - { id: installed, label: "Installed robots today", formula: "sites_with * robots_site", expected: 19200, unit: "robots" }
  - { id: replace, label: "Robots replaced each year", formula: "installed / life", expected: 3200, unit: "robots" }
  - { id: new_sites, label: "New adopting warehouses per year", formula: "suitable * growth_pts", expected: 60, unit: "sites" }
  - { id: new_robots, label: "Robots for new warehouses each year", formula: "new_sites * robots_site", expected: 2400, unit: "robots" }
  - { id: deploy, label: "Robots put into service each year", formula: "replace + new_robots", expected: 5600, unit: "robots" }
  - { id: bought, label: "Robots bought outright each year", formula: "deploy * buy_share", expected: 2800, unit: "robots" }
  - { id: buy_spend, label: "Annual spend on robots bought", formula: "bought * price / 1000000", expected: 126, unit: "$M" }
  - { id: leased_fleet, label: "Robots under lease", formula: "installed * (1 - buy_share)", expected: 9600, unit: "robots" }
  - { id: lease_spend, label: "Annual lease payments", formula: "leased_fleet * lease_fee / 1000000", expected: 124.8, unit: "$M", decimals: 1 }
  - { id: total_spend, label: "Total annual US spend on picking robots", formula: "buy_spend + lease_spend", expected: 250.8, unit: "$M", decimals: 1 }
  - { id: naive, label: "Naive answer: installed base times price", formula: "installed * price / 1000000", expected: 864, unit: "$M" }
  - { id: per_site, label: "Annual spend per robotic warehouse", formula: "total_spend / sites_with", expected: 0.5225, unit: "$M", decimals: 2 }
  - { id: share_deploy, label: "Share of deployments that are replacements", formula: "replace / deploy", expected: 0.5714, unit: "%", decimals: 0 }

answer:
  calc: total_spend
  headline: "Annual US spend on picking robots is about {{total_spend}}, far below the {{naive}} you get by pricing the whole installed base."

exhibits:
  - id: exhibit-1
    title: "Warehouse survey: how many sites, and how many use robots?"
    kind: table
    ask: "Here is a survey of large US warehouses. How would you use it?"
    columns: ["Metric", "Value"]
    rows:
      - ["Large warehouses in the US", "{{warehouses}}"]
      - ["Share suitable for picking robots (high order volume, many small items)", "{{share_suit}}"]
      - ["Share of suitable sites already running robots", "{{penetration}}"]
      - ["Typical robots per adopting site", "{{robots_site}}"]
      - ["Yearly increase in the share of suitable sites adopting", "{{growth_pts}}"]
    note: "Illustrative data created for this practice case. Brightlane is fictional."
    insight: |
      The survey gives the **stock** of sites that use robots. Sizing a market
      per year needs a **flow**, so the candidate must go one step further.
  - id: exhibit-2
    title: "Robot economics"
    kind: table
    ask: "And here is what a robot costs. What does this change?"
    columns: ["Metric", "Value"]
    rows:
      - ["Purchase price per robot", "{{price}}"]
      - ["Lease fee per robot per year", "{{lease_fee}}"]
      - ["Share of robots bought outright", "{{buy_share}}"]
      - ["Useful life of a robot", "{{life}}"]
    note: "Illustrative data created for this practice case."
    insight: |
      Buyers pay once; lessees pay every year. Spend in a given year is new
      purchases plus lease payments on the whole leased fleet.
  - id: exhibit-3
    title: "Robots: installed base versus robots put into service each year"
    kind: bar
    unit: "robots"
    ask: "Which of these numbers is the right one to multiply by price?"
    data:
      - { label: "Installed base", value: installed }
      - { label: "Replacements per year", value: replace }
      - { label: "New-site robots per year", value: new_robots }
      - { label: "Total put into service per year", value: deploy }
    note: "Illustrative data created for this practice case."
    insight: |
      Only the {{deploy}} put into service each year are bought or newly
      leased. Pricing the whole installed base of {{installed}} overstates annual
      spend several times over.
---

## Prompt

Our client, Brightlane Robotics, builds mobile robots that pick small items from shelves and bring them to packing stations in warehouses. The founders are preparing an investor pitch and want a credible number for the size of the US market.

They ask us: **how much do US warehouses spend each year on picking robots?**

## Clarifying information

- Q: Does "spend" include software and installation?
  A: Keep it to the robots themselves: purchases and lease payments. Software and installation come later.
- Q: Which warehouses count?
  A: Large warehouses and distribution centers only. Small sites do not run enough orders to justify robots.
- Q: Does the market include fixed conveyor systems or robotic arms?
  A: No. Only mobile picking robots.
- Q: Is there data on how many sites exist and how many already use robots?
  A: Yes. Exhibit 1 has it, and Exhibit 2 has robot prices and lease terms.
- Q: Is the market growing?
  A: Yes, steadily. Exhibit 1 shows how fast new sites adopt robots.

## Structure

> **Ask:** How would you size this market?

Build from the customer up, and separate **stock** from **flow**:

- **1. Who can buy?**
  - Number of large warehouses
  - Share that are suitable (order volume, item size and layout)
- **2. How many robots are in use?**
  - Share of suitable sites already using robots
  - Robots per site
- **3. How many robots are bought each year?**
  - Replacements: installed base divided by robot life
  - New adopters: suitable sites times yearly adoption, times robots per site
- **4. What does a robot cost?**
  - Buy versus lease, price per robot, annual fee

A good hypothesis: *"The installed base is large, but a robot lasts several years, so annual spend should be a fraction of the installed base times the price."*

## Math walkthrough

> **Ask:** Please size the annual spend using Exhibits 1 and 2.

**1. Suitable sites.**
{{warehouses}} warehouses × {{share_suit}} = **{{suitable}}**.

**2. Robots in use today.**
{{penetration}} of them run robots, which is **{{sites_with}}**. With {{robots_site}} each, the installed base is **{{installed}}**.

**3. Robots put into service each year.**
Replacements: {{installed}} ÷ {{life}} = **{{replace}}**.
New adopters: {{suitable}} × {{growth_pts}} = {{new_sites}}, times {{robots_site}} = **{{new_robots}}**.
Total: **{{deploy}}**, and about {{share_deploy}} of them replace old robots.

**4. Spend.**
Bought outright: {{deploy}} × {{buy_share}} = {{bought}} × {{price}} = **{{buy_spend}}**.
Leased: half the installed base ({{leased_fleet}}) pays {{lease_fee}} a year = **{{lease_spend}}**.
Total: **{{total_spend}}** a year, or about {{per_site}} per robotic warehouse.

**5. The trap.**
Multiplying the installed base by the price gives {{naive}}. That is the value of everything installed over many years, not what is spent in one year.

**Sense check:** divide by the number of robotic sites ({{sites_with}}). About {{per_site}} per site for {{robots_site}} is plausible.

## Synthesis

> **Ask:** What number would you give the founders, and how confident are you?

**US warehouses spend about {{total_spend}} a year on picking robots. Brightlane should present that as the current market, with the growth story coming from the {{growth_pts}} yearly rise in adoption.**

1. **Customers:** {{suitable}} suitable, of which {{sites_with}} already use robots.
2. **Flow, not stock:** {{deploy}} go into service each year, more than half of them replacements.
3. **Mix of buying and leasing:** purchases bring {{buy_spend}} and leases {{lease_spend}}, so the lease business is as big as the sales business.

**Risks and next steps:** the answer is most sensitive to the share of suitable sites and to robots per site, so test both with five customer interviews; check whether robot life is really six years in a busy site; add software and service revenue, which usually recur; and check whether adoption speeds up or slows as the easy sites finish.

## Common mistakes

- Multiplying the installed base by the price, which gives {{naive}} instead of {{total_spend}}.
- Forgetting replacements, which are more than half of annual deployments.
- Counting every warehouse as a customer, ignoring suitability.
- Treating lease fees as a one-time amount instead of an annual payment on the whole leased fleet.

## What top candidates do differently

- Say "stock versus flow" out loud before touching numbers.
- Round as they go ({{warehouses}} to 4 thousand, {{share_suit}} to 30%) and keep the math visible.
- Cross-check with spend per site and ask whether a manager would pay that.
- Point out that the investor number is a market snapshot, and show how the growth would change it.

## Creative question

Besides selling or leasing robots, how else could Brightlane make money from warehouses that already use its robots?

## Model answer

Organize by **what the customer needs after installation**:

- **Software:** subscriptions for fleet management, analytics and order planning.
- **Service:** maintenance contracts, spare parts, battery replacement and 24/7 remote support.
- **Pay per use:** charge per item picked, so small warehouses can start with no capital cost.
- **Data:** sell benchmarking on picking speed and error rates (with consent) to the warehouse operator.
- **Used robots:** refurbish robots at replacement time and sell them to smaller sites.

A top candidate prioritizes: "Pay per use widens the market to sites that cannot afford robots today, while service contracts add recurring revenue at high margin."
