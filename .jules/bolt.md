## 2025-02-12 - Handling shadowed relationships in Eloquent groupBy
**Learning:** When optimizing an O(N) collection count (fetching all models) to an O(R) database-level groupBy, accessing relationships can be blocked by shadowed attributes (like `rarity` string vs `rarity()` relation on the `Card` model).
**Action:** Use `$item->relationLoaded('rarity') ? $item->getRelation('rarity') : null` to safely access the eager-loaded relationship data during the mapping phase of the optimized query.
