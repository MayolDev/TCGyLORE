## 2024-05-22 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons (like Trash/Edit) in Admin tables lacked accessible names and tooltips. The project uses `shadcn/ui` Tooltip component which internally provides `TooltipProvider`, so wrapping individual buttons is straightforward but essential for WCAG compliance.
**Action:** Always wrap `lucide-react` icon buttons with `Tooltip > TooltipTrigger > Button` and add `aria-label` to the button itself.
