## 2026-01-29 - Icon-only Button Accessibility
**Learning:** The `Button` component with `size="icon"` does not enforce `aria-label` or screen reader text, leading to inaccessible patterns in headers and sidebars.
**Action:** Always check for `size="icon"` usages and manually add `aria-label` or `<span className="sr-only">` text.
