## 2024-05-14 - Initial Setup
**Learning:** bolt.md needs to exist.
**Action:** Create it before starting.

## 2025-01-04 - Eager Loading Column Optimization
**Learning:** Selecting `Role::all()` or `->with('roles')` in the `UserController` pulls all columns for the related models, resulting in unnecessary memory usage and payload size in Inertia.
**Action:** Always select only the required columns when fetching models or eager loading relationships (e.g., `Role::all(['id', 'name'])` and `->with('roles:id,name')`).
