# Palette's Journal

## 2025-05-23 - Tooltips on Icon-Only Buttons
**Learning:** Shadcn UI `Tooltip` component includes an internal `TooltipProvider`, so wrapping it in an external `TooltipProvider` is not strictly necessary unless overriding defaults. However, `TooltipTrigger` must use `asChild` when wrapping a `Button` to ensure valid HTML (no button inside button) and proper ref forwarding.
**Action:** When adding tooltips to existing buttons, always check if the child is a component that forwards refs and supports `asChild` pattern.
