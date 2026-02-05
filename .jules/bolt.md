## 2025-05-23 - Migration Schema Mismatches and SQLite Compatibility
**Learning:**
1. The codebase migrations were in a transitional state where `create_cards_table.php` defined legacy string/enum columns, but `update_cards_table_with_relations.php` (which was empty) was supposed to add foreign keys. This caused `CardController` to fail in fresh environments (like tests) because it expected foreign keys.
2. `ALTER TABLE ... MODIFY COLUMN` is not supported in SQLite. Migrations using this must wrap it in `if (DB::getDriverName() !== 'sqlite')`.

**Action:**
1. Ensure `create_table` migrations allow nullable columns if they are to be superseded or if data is optional during transition.
2. Always add driver checks for raw SQL schema modifications.
3. Verified and fixed migrations `2025_12_21_124455_create_cards_table.php`, `2025_12_21_171052_update_cards_table_with_relations.php`, and `2025_12_27_225915_update_location_types_to_english.php` to ensure CI/CD and local testing stability.
