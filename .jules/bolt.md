## 2025-05-23 - Over-fetching in Inertia Controllers
**Learning:** Inertia controllers often eagerly load full relationships (e.g., `with(['characters'])`) for index/edit pages, which fetches heavy TEXT/LONGTEXT columns (biographies, descriptions) that are unused by the frontend.
**Action:** Always verify which columns are actually used by the React components and use constrained eager loading (e.g., `with(['characters:id,name'])`) to reduce payload size and memory usage.
