# Brand Guidelines

This document outlines the brand guidelines, visual identity, and communication tone for the **Tectonic Protocol**.


## Visual Identity

### Logos and Assets

All official logos are stored in the `/public` directory of this repository.
- **Tectonic Logo:** `/public/Logo.svg` - Used specifically for the Tectonic Protocol, the Web UI, and stablecoin-specific products.
- **Hero Image:** `/public/tectonic-hero.png` - Primary banner for social media and landing pages.

### Color Palette

The Tectonic UI uses a modern, high-contrast color scheme to ensure accessibility and a premium feel.

* **Primary Accent (Tectonic Gold):** `#FFC517`
  * Used for primary badges, highlights, and calls to action. Represents wealth, stability, and the EquityCoin system.
* **Secondary Accent (Forest Green):** `#228B22`
  * Used for non-text success states, stablecoin health indicators, and positive yields.
  * Do not use for normal-sized text on the documented dark surfaces; use an approved high-contrast text color instead.
* **Dark Surfaces & Text Contrasts:**
  * **Surface Background:** `#0F172A` (Slate 900) - Primary app background.
  * **Surface Element:** `#1E293B` (Slate 800) - Used for cards, modals, and elevated elements.
  * **Primary Text:** `#F8FAFC` (Slate 50) - Used for primary readability on dark surfaces.
  * **Secondary Text:** `#94A3B8` (Slate 400) - Used for descriptions and secondary info.
  * **Accessibility Target:** All text pairings on dark surfaces must meet or exceed WCAG 2.1 AA (4.5:1) contrast ratio. `#F8FAFC` on `#0F172A` achieves a 15.3:1 contrast ratio.

## Typography

The UI utilizes modern, sans-serif fonts to maintain readability across dense financial dashboards.

- **Primary Font:** Geist (loaded natively via `next/font/google` for optimal performance and zero layout shift)
- **Fallback Stack:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
- **Usage:** Headings should be bold and authoritative; data tables should use tabular numerals for clean alignment.

## Terminology & Copywriting

When writing documentation, UI copy, or community announcements, strictly adhere to the following capitalization and spelling rules:
- **Tectonic Protocol** (Not "tectonic protocol" or "Tectonic protocol")
- **EquityCoin** (One word, CamelCase)
- **StableCoin** (One word, CamelCase)
