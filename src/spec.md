# Specification

## Summary
**Goal:** Replace the site’s orange background with a plain white background everywhere.

**Planned changes:**
- Update the global background theme token(s) (e.g., the value behind `bg-background`) so light mode resolves to pure white.
- Explicitly set the base page background to white on `body` (and, if needed, `html`/`#root`) to ensure no orange shows in any empty space outside/behind sections.

**User-visible outcome:** The entire site displays a plain white page background at all scroll positions, with no orange visible behind or around content.
