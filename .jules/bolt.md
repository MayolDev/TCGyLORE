## 2025-02-18 - Card Model Shadowing
**Learning:** The `Card` model has a `rarity` string column that shadows the `rarity()` relationship. Accessing `$card->rarity` returns the string (e.g., "comun") instead of the related model, causing `$card->rarity->name` to fail or return null (via `?->`).
**Action:** Always use `select()` to exclude the `rarity` string column when eager loading the `rarity` relationship, or use `join` for aggregations to bypass model hydration.
