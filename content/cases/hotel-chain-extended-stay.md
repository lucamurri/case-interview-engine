---
id: hotel-chain-extended-stay
title: "Longer Stays: A Midscale Hotel Chain Weighs Extended-Stay"
client: "Larchmont Hotels (fictional), a US owner-operator of 150 midscale hotels"
summary: "A midscale hotel chain wants to launch an extended-stay brand. Owning the new hotels earns more per hotel; franchising earns far more per dollar invested. Ask the right question and you find the new brand also takes guests from the old one."
industry: other
sub_industry: "Hospitality"
type: market-entry
difficulty: intermediate
format: candidate-led
time_minutes: 30

# All numbers are illustrative — realistic in shape, not real hotel data.
inputs:
  rooms:          { value: 100,  unit: "rooms",      label: "Rooms per extended-stay hotel" }
  nights:         { value: 360,  unit: "nights",     label: "Nights per year (rounded for easy math)" }
  occ:            { value: 0.80, unit: "%",          label: "Occupancy, extended-stay hotel" }
  adr:            { value: 125,  unit: "$/night",    label: "Average daily rate (price per occupied room)" }
  own_opex:       { value: 0.50, unit: "%",          label: "Operating costs as a share of revenue, owned hotel (staff, utilities, property tax, upkeep)" }
  own_capex:      { value: 15,   unit: "$M",         label: "Capital to buy land and build one hotel" }
  fee_rate:       { value: 0.12, unit: "%",          label: "Franchise fees as a share of room revenue (royalty, marketing, reservations, loyalty)" }
  fr_support:     { value: 0.072, unit: "$M",        label: "Larchmont's cost to support one franchised hotel per year", decimals: 3 }
  fr_capital:     { value: 0.5,  unit: "$M",         label: "Capital per franchised hotel (development incentives paid to owners)", decimals: 1 }
  hurdle:         { value: 0.12, unit: "%",          label: "Larchmont's required return on capital (pre-tax)" }
  capital_avail:  { value: 150,  unit: "$M",         label: "Capital Larchmont can commit over the next five years" }
  fr_pipeline:    { value: 40,   unit: "franchised hotels", label: "Franchised hotels the development team expects to sign in five years" }
  cannib_share:   { value: 0.10, unit: "%",          label: "Share of a new hotel's room revenue that comes from guests who now stay at Larchmont midscale hotels" }
  lost_margin:    { value: 0.50, unit: "%",          label: "Contribution Larchmont's existing hotels earn on that revenue" }
  occ_mid:        { value: 0.66, unit: "%",          label: "Occupancy, Larchmont midscale hotels" }

calculations:
  # --- One extended-stay hotel ---
  - { id: room_nights, label: "Occupied room-nights per hotel per year", formula: "rooms * nights * occ", expected: 28800, unit: "room-nights" }
  - { id: room_rev, label: "Room revenue per hotel per year", formula: "room_nights * adr / 1e6", expected: 3.6, unit: "$M", decimals: 1 }
  # --- Own model ---
  - { id: own_ebitda, label: "Operating profit per owned hotel", formula: "room_rev * (1 - own_opex)", expected: 1.8, unit: "$M", decimals: 1 }
  - { id: own_roc, label: "Return on capital, owned hotel", formula: "own_ebitda / own_capex", expected: 0.12, unit: "%" }
  # --- Franchise model ---
  - { id: fr_fees, label: "Franchise fees per hotel", formula: "room_rev * fee_rate", expected: 0.432, unit: "$M", decimals: 3 }
  - { id: fr_net, label: "Profit to Larchmont per franchised hotel", formula: "fr_fees - fr_support", expected: 0.36, unit: "$M", decimals: 2 }
  - { id: fr_roc, label: "Return on capital, franchised hotel", formula: "fr_net / fr_capital", expected: 0.72, unit: "%" }
  - { id: profit_ratio, label: "Profit per owned hotel versus per franchised hotel", formula: "own_ebitda / fr_net", expected: 5, unit: "x", decimals: 0 }
  # --- Portfolio over five years ---
  - { id: own_hotels, label: "Hotels Larchmont can build with its capital", formula: "capital_avail / own_capex", expected: 10, unit: "hotels" }
  - { id: own_profit, label: "Annual profit, owned portfolio", formula: "own_hotels * own_ebitda", expected: 18, unit: "$M" }
  - { id: own_charge, label: "Capital charge at the hurdle, owned portfolio", formula: "own_hotels * own_capex * hurdle", expected: 18, unit: "$M" }
  - { id: own_ep, label: "Profit above the hurdle, owned portfolio", formula: "own_profit - own_charge", expected: 0, unit: "$M" }
  - { id: fr_total_capital, label: "Capital for the franchised portfolio", formula: "fr_pipeline * fr_capital", expected: 20, unit: "$M" }
  - { id: fr_profit, label: "Annual profit, franchised portfolio", formula: "fr_pipeline * fr_net", expected: 14.4, unit: "$M", decimals: 1 }
  - { id: fr_charge, label: "Capital charge at the hurdle, franchised portfolio", formula: "fr_total_capital * hurdle", expected: 2.4, unit: "$M", decimals: 1 }
  - { id: fr_ep, label: "Profit above the hurdle, franchised portfolio", formula: "fr_profit - fr_charge", expected: 12, unit: "$M" }
  # --- Cannibalization ---
  - { id: cannib, label: "Contribution lost at existing Larchmont hotels per new hotel", formula: "room_rev * cannib_share * lost_margin", expected: 0.18, unit: "$M", decimals: 2 }
  - { id: own_net, label: "Profit per owned hotel after cannibalization", formula: "own_ebitda - cannib", expected: 1.62, unit: "$M", decimals: 2 }
  - { id: own_roc_net, label: "Return on capital, owned, after cannibalization", formula: "own_net / own_capex", expected: 0.108, unit: "%" }
  - { id: fr_net_after, label: "Profit per franchised hotel after cannibalization", formula: "fr_net - cannib", expected: 0.18, unit: "$M", decimals: 2 }
  - { id: fr_roc_net, label: "Return on capital, franchised, after cannibalization", formula: "fr_net_after / fr_capital", expected: 0.36, unit: "%" }
  - { id: own_profit_net, label: "Annual profit, owned portfolio, after cannibalization", formula: "own_hotels * own_net", expected: 16.2, unit: "$M", decimals: 1 }
  - { id: own_ep_net, label: "Profit above the hurdle, owned, after cannibalization", formula: "own_profit_net - own_charge", expected: -1.8, unit: "$M", decimals: 1 }
  - { id: fr_profit_net, label: "Annual profit, franchised portfolio, after cannibalization", formula: "fr_pipeline * fr_net_after", expected: 7.2, unit: "$M", decimals: 1 }
  - { id: fr_ep_net, label: "Profit above the hurdle, franchised, after cannibalization", formula: "fr_profit_net - fr_charge", expected: 4.8, unit: "$M", decimals: 1 }
  - { id: cannib_share_fr, label: "Share of franchise profit lost to cannibalization", formula: "cannib / fr_net", expected: 0.50, unit: "%" }

answer:
  calc: fr_ep_net
  headline: "Enter by franchising: net of cannibalization it returns {{fr_roc_net}} and adds {{fr_ep_net}} a year above the {{hurdle}} hurdle, while owned hotels fall to {{own_roc_net}}, below the hurdle."

exhibits:
  - id: exhibit-1
    title: "US hotel occupancy by segment, 2025"
    kind: bar
    unit: "%"
    decimals: 0
    ask: "Here is occupancy across hotel segments."
    data:
      - { label: "Extended-stay", value: occ }
      - { label: "Upscale", value: 0.72 }
      - { label: "Midscale (Larchmont's segment)", value: occ_mid }
      - { label: "Economy", value: 0.58 }
    note: "Illustrative data created for this practice case; not real industry statistics. Extended-stay guests stay five nights or more; the hotels offer kitchens in every room and weekly rather than daily housekeeping."
    insight: |
      Extended-stay fills more rooms than any other segment, and long stays with
      light housekeeping keep operating costs low. The market is attractive; the
      question is how Larchmont should enter.
  - id: exhibit-2
    title: "Two ways to grow the new brand: economics per hotel"
    kind: table
    ask: "Here are the economics of owning versus franchising one hotel."
    columns: ["", "Larchmont owns and runs", "Franchised to a local owner"]
    rows:
      - ["Rooms, occupancy, average rate", "{{rooms}}, {{occ}}, {{adr}}", "{{rooms}}, {{occ}}, {{adr}}"]
      - ["Room revenue", "{{room_rev}}", "{{room_rev}} (kept by the owner)"]
      - ["Larchmont's income", "All revenue", "Fees of {{fee_rate}} of room revenue"]
      - ["Larchmont's costs", "Operating costs of {{own_opex}} of revenue", "Support cost of {{fr_support}} a year"]
      - ["Larchmont's capital per hotel", "{{own_capex}}", "{{fr_capital}}"]
      - ["Hotels in five years", "Limited by Larchmont's {{capital_avail}} of capital", "{{fr_pipeline}} expected"]
    note: "Illustrative data created for this practice case. Larchmont Hotels is fictional. Capital excludes the brand launch, which costs the same in both models. Assume 360 operating nights a year."
    insight: |
      Owning earns {{profit_ratio}} as much per hotel, but franchising needs a
      thirtieth of the capital and lets the brand grow four times as fast.
---

## Prompt

Our client, Larchmont Hotels, owns and operates 150 midscale hotels across the US, mostly near highways and business parks. Its occupancy has been flat for years.

The CEO has noticed that **extended-stay hotels**, built for guests who stay five nights or more (project workers, relocating families, traveling nurses), are filling more rooms than any other segment. She is considering launching a Larchmont extended-stay brand and has asked us: **should Larchmont enter extended-stay, and how?**

## Clarifying information

- Q: What is Larchmont's objective and investment criterion?
  A: Grow profit over the next five years. Every investment must earn at least {{hurdle}} a year pre-tax on the capital it uses.
- Q: How much capital is available?
  A: About {{capital_avail}} over five years, after maintaining the existing hotels.
- Q: Does Larchmont franchise today?
  A: No. It owns and runs all its hotels. Several competitors grow by franchising: local investors build and own the hotels, and the brand earns fees for its name, reservation system and loyalty program.
- Q: Would franchise owners be interested?
  A: Larchmont's development team has spoken to hotel investors and expects to sign about {{fr_pipeline}} in five years.
- Q: Would the new hotels take guests from Larchmont's existing hotels?
  A: Yes, some. Guest data suggests about {{cannib_share}} of a new hotel's room revenue would come from guests who now stay five or more nights at Larchmont midscale hotels. Larchmont's existing hotels earn a contribution of about {{lost_margin}} on that revenue. This applies whichever model Larchmont chooses.
- Q: Why do people choose extended-stay over midscale hotels?
  A: A kitchen, more space and a lower weekly price. Housekeeping is weekly, so the hotels need fewer staff.

## Structure

> **Ask:** How would you structure your analysis?

- **1. Is the market attractive?**
  - Demand: occupancy and growth of extended-stay versus Larchmont's segment
  - Profitability: lower staffing and longer stays
  - Competitors: established extended-stay brands, new entrants
- **2. Can Larchmont win?**
  - What it brings: brand, reservation system, loyalty members, operating know-how
  - What it lacks: extended-stay design, franchise sales and support
- **3. Does it pay, and which model?**
  - Own: profit per hotel, capital per hotel, return on capital
  - Franchise: fees per hotel, support cost, capital per hotel, return on capital
  - Scale over five years given the capital available
  - Effect on Larchmont's existing hotels (cannibalization)
- **4. Risks:** franchise owners' quality, overbuilding in the segment, brand confusion with midscale hotels

Hypothesis: *"Owning gives more profit per hotel, but Larchmont's capital is limited. Franchising usually wins on return on capital, so I expect it to be the better way in, as long as the new brand doesn't simply move guests from the old one."*

## Math walkthrough

> **Ask:** Compare owning and franchising per hotel and across a five-year portfolio. Then account for any effect on Larchmont's existing hotels.

**1. Revenue per hotel.**
Room-nights: 100 rooms × 360 × 80% = **{{room_nights}}**. Room revenue: 28,800 × $125 = **{{room_rev}}**.

**2. Per hotel.**
Own: $3.6M × (1 − 50%) = **{{own_ebitda}}** a year on {{own_capex}} of capital, a return of **{{own_roc}}**, exactly the hurdle.
Franchise: fees of $3.6M × 12% = {{fr_fees}}, less support of {{fr_support}}, leaves **{{fr_net}}** on {{fr_capital}} of capital, a return of **{{fr_roc}}**.

**3. Portfolio over five years.**
Own: $150M ÷ $15M = **{{own_hotels}}**, earning {{own_profit}} a year. The capital charge at 12% is {{own_charge}}, so profit above the hurdle is **{{own_ep}}**.
Franchise: 40 hotels × $0.5M = {{fr_total_capital}} of capital, earning 40 × $0.36M = {{fr_profit}} a year. The capital charge is {{fr_charge}}, so profit above the hurdle is **{{fr_ep}}**, and Larchmont keeps the rest of its capital for other uses.

**4. Cannibalization (if the candidate asks).**
Each new hotel costs the existing hotels $3.6M × 10% × 50% = **{{cannib}}** a year of contribution, in either model.

| Per hotel | Own | Franchise |
|---|---|---|
| Profit per hotel before cannibalization | {{own_ebitda}} | {{fr_net}} |
| Profit per hotel after cannibalization | {{own_net}} | {{fr_net_after}} |
| Return on capital after cannibalization | **{{own_roc_net}}** | **{{fr_roc_net}}** |
| Portfolio profit after cannibalization | {{own_profit_net}} | {{fr_profit_net}} |
| Profit above the {{hurdle}} hurdle | **{{own_ep_net}}** | **{{fr_ep_net}}** |

Owning now falls **below the hurdle**. Franchising still clears it comfortably, but cannibalization takes {{cannib_share_fr}} of its profit.

## Synthesis

> **Ask:** What is your recommendation to the CEO?

**Larchmont should enter extended-stay by franchising, not by building its own hotels. Net of the guests the new brand takes from existing hotels, franchising returns {{fr_roc_net}} on capital and adds {{fr_ep_net}} a year above the {{hurdle}} hurdle, while owned hotels return only {{own_roc_net}}, below the hurdle.**

1. **The market is attractive:** extended-stay runs at {{occ}} occupancy versus {{occ_mid}} in Larchmont's own segment, with lower operating costs.
2. **Franchising fits Larchmont's capital:** {{fr_pipeline}} need {{fr_total_capital}}; owning only {{own_hotels}} would use all {{capital_avail}}.
3. **Cannibalization is real and must be managed:** it halves franchise profit per hotel, so site new hotels away from Larchmont's existing ones and target guests Larchmont does not serve today.

**Risks and next steps:** Larchmont has never franchised, so it must build franchise sales, quality audits and owner support; protect the brand with design standards and the right to remove poor performers; test cannibalization in the first ten locations and adjust the siting rules; consider owning two or three flagship hotels to prove the concept to investors, accepting a lower return on those.

## Common mistakes

- Choosing ownership because it earns {{profit_ratio}} as much per hotel, without dividing by the capital it needs.
- Comparing the models on hotels Larchmont could afford to own, rather than on how many hotels each model can realistically reach.
- Never asking whether the new hotels would take guests from Larchmont's existing hotels.
- Assuming a franchise business runs itself: support costs, quality control and owner relationships are new capabilities for Larchmont.

## What top candidates do differently

- Compare models on return on capital and on profit above the hurdle, not on profit per hotel.
- Ask about cannibalization unprompted and apply it to both models.
- Notice that the original ownership return of {{own_roc}} only just meets the hurdle, so any extra cost would push it below.
- Name the capabilities Larchmont would need to build to become a franchisor.

## Creative question

How could Larchmont reduce the share of guests the new brand takes from its existing hotels?

## Model answer

Organize ideas around **where, who and what**:

- **Where:** open extended-stay hotels near hospitals, construction sites and new factories, away from existing Larchmont hotels; avoid markets where Larchmont already has strong weekday business.
- **Who:** target segments that rarely use midscale hotels today: relocating families, traveling nurses, insurance-claim stays after home damage; sign contracts with employers and staffing agencies.
- **What:** make the products clearly different: kitchens, weekly pricing and a minimum stay; keep midscale hotels focused on one- to three-night business and leisure trips.

A top candidate prioritizes: "Siting is the biggest lever. If the rule is no new hotel within a few miles of an existing Larchmont hotel, most of the overlap disappears."
