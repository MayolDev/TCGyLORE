## 2025-02-21 - Accessible Action Buttons & Component Refs
**Learning:** Found two recurring issues: 1) Base UI components (like `Button`) lacked `forwardRef`, breaking compatibility with Radix Primitives (like `Tooltip`). 2) Navigation buttons were implemented as `<Link><Button>...</Button></Link>`, which is invalid HTML (button inside anchor).
**Action:** Always check `forwardRef` in base components when using Radix `asChild`. Use `<Button asChild><Link>...</Link></Button>` pattern for navigation buttons to ensure valid semantics and accessibility.
