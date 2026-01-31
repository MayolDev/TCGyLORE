# Bolt's Journal

## 2025-01-26 - [Backend] Optimization of Card Index Query
**Learning:** Eager loading relationships using `with()` in Laravel loads all columns by default (`select *`). When related models contain large text fields (like `biography` or `description`) that are unused in the list view, this causes significant memory and bandwidth waste.
**Action:** Always use column constraints in `with()` (e.g., `with('relation:id,name')`) for index/list endpoints to fetch only necessary data.
