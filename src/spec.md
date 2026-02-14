# Specification

## Summary
**Goal:** Enforce a pure white background across the entire site, including all sections and the hero, without tinted/gray backgrounds, gradients, or full-bleed background images that make the page appear non-white.

**Planned changes:**
- Set/confirm global base backgrounds to pure white for `html`, `body`, and `#root` in light mode.
- Remove/replace any section-level tinted/gray background utility classes (e.g., muted/tinted backgrounds) so all sections render on white.
- Update the hero section styling to eliminate any full-bleed background image/overlay/gradient so the hero background matches the site’s white background.
- Ensure header and footer backgrounds render as white while preserving readable text contrast.

**User-visible outcome:** The entire site scrolls on a consistent pure white background, including the hero, header, footer, and all content sections, with no tinted/gradient/full-bleed backgrounds affecting the page color.
