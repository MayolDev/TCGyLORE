## 2024-05-22 - [Optimizing Resource Controllers]
**Learning:** When optimizing Laravel Resource Controllers for Inertia.js, carefully analyze the frontend components (`Index.tsx`, `Edit.tsx`) to identify unused relationships.
**Insight:**
- In `Index` views, constrain eager loading to only used columns (e.g., `with('relation:id,name')`) and remove unused relationships completely.
- In `Edit` views, often the form relies solely on foreign keys (e.g., `world_id`) already present in the model. In such cases, `$model->load(...)` is entirely unnecessary and can be removed, as dropdowns are typically populated via separate props.
**Action:** Always verify `grep "model\."` in frontend files before removing backend data delivery to ensure no property is accessed.
