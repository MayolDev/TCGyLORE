## 2026-04-23 - Adding ARIA Labels to Icon-Only Buttons in App Header
**Learning:** In the `app-header.tsx` component, icon-only buttons like the mobile menu toggle and the search button lacked `aria-label` or `sr-only` text, making them inaccessible to screen readers. This is a common pattern to watch out for when using icon libraries.
**Action:** Add `<span className="sr-only">[Descriptive Text]</span>` inside the `<Button>` component whenever it only contains an `<Icon>`.
