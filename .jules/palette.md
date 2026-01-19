## 2024-05-22 - Tooltips for Icon-Only Buttons
**Learning:** Icon-only buttons (like Edit/Delete) are common but lack accessible names and visual cues for sighted users.
**Action:** Always wrap icon-only buttons in a Tooltip component and add an explicit `aria-label` to the button itself. Use `asChild` on the trigger if the button is a custom component to ensure valid HTML.
