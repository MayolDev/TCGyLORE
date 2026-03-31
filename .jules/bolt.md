
## 2026-03-31 - Optimize Dashboard Cards by Rarity Query
**Learning:** In Laravel, optimizing collection operations like `$models->groupBy(...)->map(...)` to `select(..., DB::raw('count(*)'))->groupBy(...)` transforms an O(N) memory allocation to an O(R) one. However, in this specific codebase, the `Card` model has a `rarity` column that shadows the `rarity()` relationship. Using standard eager loading mapping will fail.
**Action:** When performing aggregate queries with relations on the `Card` model, bypass the shadowed attribute by explicitly checking `$item->relationLoaded('rarity') && $item->getRelation('rarity')` rather than using `$item->rarity`.
