## 2024-05-18 - Admin Action Buttons Accessibility
**Learning:** Found a reusable pattern in the design system where action buttons in table/grid views (like Edit and Delete) are displayed as icon-only without proper screen reader support.
**Action:** When adding or reviewing list views, ensure icon-only buttons receive an `aria-label` and `title` to provide native tooltips and screen reader context.
