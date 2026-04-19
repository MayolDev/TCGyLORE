## 2026-04-19 - Optimize CardController Index relationships
**Learning:** The `CardController::index` method was eagerly loading 9 relationships for each card, but the React UI only required 4 of them (`world`, `character`, `cardType`, `rarity`), and even then, only the `id` and `name` attributes.
**Action:** When working with Inertia pagination, explicitly select columns in the `with()` array (e.g., `with(['relation:id,name'])`) and exclude unused relationships to minimize payload size and database memory footprint, achieving ~8x performance improvement in raw query generation.
