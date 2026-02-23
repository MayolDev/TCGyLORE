## 2026-02-23 - Card Model Naming Conflict & Dashboard Optimization
**Learning:** The `Card` model has a `rarity` enum column (string) that shadows the `rarity()` relationship. This causes `$card->rarity` to return the string value instead of the related model, breaking eager loading access unless explicitly handled.
**Action:** When working with `Card` model, always use `select()` to exclude `rarity` column if the relationship is needed, or rename the relationship. For aggregations, bypass the model entirely using `join` and `selectRaw`.
