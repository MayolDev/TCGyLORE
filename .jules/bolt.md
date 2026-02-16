## 2025-05-23 - Card Model & Migration Issues
**Learning:** The `Card` model has a naming conflict between the `rarity` column (string) and the `rarity()` relationship. Accessing `$card->rarity` returns the string if the column exists. Furthermore, the migration `2025_12_21_171052_update_cards_table_with_relations.php` was found empty, causing missing foreign key columns (`card_type_id`, `rarity_id`, etc.) in fresh database setups.
**Action:** When working with `Card` model, ensure specific columns are selected to avoid the `rarity` string column if it exists, or ensure the migration logic correctly drops the legacy column and adds the foreign key. I populated the empty migration to fix this.

## 2025-05-23 - SQLite Migration Compatibility
**Learning:** The project uses SQLite for testing. Migrations using `MODIFY COLUMN` (MySQL syntax) fail in SQLite.
**Action:** Wrap such statements in `if (DB::getDriverName() !== 'sqlite')` to prevent test failures.
