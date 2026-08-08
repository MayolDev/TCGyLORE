## 2024-03-24 - Accessibility Pattern for Icon Buttons
**Learning:** Icon-only buttons (like Edit/Delete actions in tables) are a common pattern here but often lack accessibility attributes.
**Action:** Always wrap icon-only buttons in `Tooltip` components and add specific `aria-label` props (e.g., "Edit location Taponazo") rather than generic ones.
