## 2025-04-28 - Missing ARIA Labels on Icon-only Header Buttons
**Learning:** Found a recurring pattern in `app-header.tsx` where icon-only components (like Menu and Search buttons) lacked accessible names (ARIA labels), reducing screen reader accessibility.
**Action:** Always ensure any `<Button>` or interactive element that only contains an `<Icon>` (or similar SVG/icon component) includes a descriptive `aria-label` attribute to support assistive technologies.
