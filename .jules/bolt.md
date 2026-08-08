# Bolt's Journal

## 2025-02-20 - Unused Data Fetching in Controllers
**Learning:** Several Admin Controllers (`CardController`, `CharacterController`, `LocationController`) were fetching `World::all()` for every request to their `index` method, supposedly for a filter dropdown. However, the frontend components were not using this data at all (filters were either missing or hardcoded).
**Action:** Always verify if the data passed to Inertia views is actually used by the React components. Removing unused data reduces database load and network payload size.
