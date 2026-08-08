## 2025-01-26 - Accessible Icon Buttons
**Learning:** Icon-only buttons (like delete/edit actions in tables) are invisible to screen readers without `aria-label`, and ambiguous to all users without tooltips. Using a combination of `Tooltip` and `aria-label` solves both issues efficiently.
**Action:** Always wrap `lucide-react` icon buttons in `Tooltip` components and add descriptive `aria-label` props in Admin interfaces.
