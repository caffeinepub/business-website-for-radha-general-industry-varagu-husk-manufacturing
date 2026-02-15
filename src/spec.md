# Specification

## Summary
**Goal:** Add an attendance-based salary calculator for hotel staff using Rule #4, with staff master management, persistent storage, and a cohesive hospitality-themed UI.

**Planned changes:**
- Implement Rule #4 salary calculation: Paid Days = Present + Paid Leave + Weekly Off; Earned Salary = (Monthly Gross Pay / Total Days in Month) × Paid Days; Net Pay = Earned Salary − (Salary Advance + EPF + ESI), with English validation and non-negative input enforcement.
- Add staff (employee master) CRUD UI: create/view/select staff with Staff Name, optional Mobile, Designation (from existing hotel designation list), and default salary components (Basic, DA, Other Allowance).
- Support salary components per staff: Basic + fixed DA (default 8,419) + Other Allowance; show derived Monthly Gross Pay and use it for earned salary calculations.
- Update finalized employees listing to include a dedicated “Name” column header and always display an employee name (with a consistent fallback when missing).
- Persist staff members and finalized salary records in the Motoko single-actor backend, including stable-state migration if needed, so refreshes do not erase data.
- Apply a “hospitality payroll ledger” theme (warm neutrals + emerald accents) across forms, tables, headers, and summary areas without adding new features.

**User-visible outcome:** Users can manage a hotel staff list, select a staff member to pre-fill salary details, enter attendance/deductions, and see gross/earned/net pay computed via Rule #4 with clear English validations; staff and finalized salary records remain saved after refresh, and the UI uses a consistent hospitality-themed styling.
