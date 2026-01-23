## 2025-05-24 - Inertia Prop Over-fetching
**Learning:** Laravel Controllers often eager load entire model relationships (all columns) passed to Inertia views, but React components typically only use a fraction of that data (e.g., `id` and `name`). This causes unnecessary database load and larger payload sizes.
**Action:** Always inspect the target React component's props and interfaces to identify exactly which fields are needed. Use column constraints (e.g., `with('relation:id,name')`) in the Controller to fetch only what is required.
