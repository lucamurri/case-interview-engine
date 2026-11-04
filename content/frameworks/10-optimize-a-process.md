---
title: "10. How do we optimize a process?"
order: 10
type: operations
summary: "Find the bottleneck, quantify the gap, and fix the cheapest constraint first."
---

## Use it when

A client can't produce, process or deliver enough — or does so too slowly or too expensively.

## The core logic

1. **Map the process** as a chain of steps (receive → inspect → process → pack → ship).
2. **Find each step's capacity** per day or week. The step with the lowest capacity is the **bottleneck**; the whole system can't go faster than it.
3. **Compare with demand.** Capacity below demand → a backlog that grows every day. Backlog ÷ (capacity − demand) = time to clear it once fixed.
4. **Explain why the bottleneck is slow:** not enough resources, downtime, changeovers, defects and rework, poor scheduling.
5. **Prioritize fixes** by impact and cost: cheaper process fixes usually come before new equipment or people.

For machines, **overall equipment effectiveness (OEE) = availability × speed × quality**. A line at 60% availability, 90% speed and 95% quality runs at about 51% of its theoretical output.

## Questions that unlock it

- Is demand steady or peaky (seasonal, end of month)?
- Where does work pile up? (That's usually the bottleneck.)
- What does an extra unit of capacity cost at each step?

## Adapt it

- **Pharma manufacturing:** changeovers and cleaning between batches, and quality release, often limit output more than machine speed.
- **Warehouses and e-commerce:** labor per step and shift patterns; returns flows are often an afterthought.
- **Services (claims, call centers):** people are the capacity; automation of simple cases frees experts for complex ones.

## Traps

- Adding capacity everywhere instead of at the bottleneck.
- Forgetting that fixing one bottleneck moves it to the next step — say where it moves.
- Ignoring the cost of the backlog itself (lost sales, penalties, customer goodwill).

## Coach's note

Draw the process as boxes in a row and write a capacity under each one. The interviewer will usually hand you the data for exactly that. Name the bottleneck, quantify the gap against demand, and always say **where the bottleneck moves next** once you fix it. That last step is what separates good answers from great ones.
