# Bolt's Performance Journal ⚡

## 2024-05-23 - Optimizing Resource Controllers
**Learning:** Resource Controllers often over-fetch relationships using unrestricted `with()` clauses, loading large text columns (like `biography` or `description`) that are unused in Index views.
**Action:** When optimizing `index` methods, use column constraints (e.g., `with(['relation:id,name'])`) instead of full eager loading, and remove relationships that are not consumed by the frontend. This reduces payload size and database memory usage.
