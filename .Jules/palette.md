## 2025-01-27 - Icon-only Buttons
**Learning:** Icon-only buttons (like Edit/Delete) were found without ARIA labels or tooltips, making them inaccessible to screen readers and potentially confusing for users.
**Action:** Always wrap icon-only buttons in a `Tooltip` component and include an explicit `aria-label`.
