# Bolt's Journal

This journal tracks critical performance learnings, bottlenecks, and architectural patterns.

## 2025-01-28 - Optimize Resource Controller Eager Loading
**Learning:** Resource Controllers often eager load relationships that are unused in the frontend view (e.g., `index` or `edit` pages).
**Action:** When optimizing, verify which relationships are actually consumed by the React component. Use `with(['relation:id,name'])` to select only necessary columns instead of full models. This reduces memory usage and payload size significantly.
