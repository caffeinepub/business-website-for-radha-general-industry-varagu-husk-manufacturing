# Specification

## Summary
**Goal:** Enforce Dearness Allowance (DA) as a fixed amount of Rs 8419 across the Salary Split Calculator for all zones and calculation modes, and update the Tamil Nadu Hotel Rule UI/validation to reflect DA as a fixed amount (not a percentage).

**Planned changes:**
- Set DA to a constant value (8419) for all zones (A/B/C/D) and ensure all Salary Split Calculator computations always use this fixed DA in both Manual Entry and Tamil Nadu Hotel Rule modes.
- Update Manual Entry mode so the DA field displays 8419 and is read-only/disabled; prevent any UI interaction from changing DA away from 8419 and ensure resets restore DA to 8419.
- Update Tamil Nadu Hotel Rule configuration UI to remove or disable DA percentage input and revise any displayed formulas/help text to indicate DA is fixed at 8419.
- Adjust Tamil Nadu Hotel Rule validation so it no longer requires or validates DA percentage totals when DA is fixed.

**User-visible outcome:** Users always see DA fixed at ₹8,419 and cannot edit it; salary breakdowns and rule-based calculations consistently use DA = 8419, and the TN Hotel Rule section no longer asks for DA as a percentage.
