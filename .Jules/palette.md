## 2025-05-23 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons (like Edit/Delete actions in tables) are common but often lack accessibility labels.
**Action:** Always wrap icon-only buttons in a `Tooltip` component (from `@/components/ui/tooltip`) and add an `aria-label` to the button itself. This ensures both visual hover context and screen reader support.
