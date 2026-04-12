
## 2024-05-22 - Optimize Inertia JSON payloads by removing unused eager loads
**Learning:** In Inertia.js applications, returning Eloquent models with all relationships eager-loaded (`with(['rel1', 'rel2', ...])`) includes those entire nested JSON structures in the initial page payload, drastically increasing response size and memory usage even if the frontend table/grid only displays a few fields.
**Action:** When returning paginated data to Inertia, audit the frontend components (e.g., `Index.tsx`) to identify exactly which relationships and columns are needed. Eager load only those specific columns (`with(['relation:id,name'])`) and remove entirely any relationships not used in the UI. Always add comments explaining the optimization.
