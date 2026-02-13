## 2026-02-13 - Broken Migrations and Auto-Generated Files
**Learning:** `resources/js` files are often modified by build tools or plugins (like wayfinder). Always check `git status` and revert unintended changes in this directory before committing.
**Action:** Run `git restore resources/js` if build artifacts pollute the working directory.

## 2026-02-13 - SQLite Migration Limitations
**Learning:** SQLite does not support `MODIFY COLUMN`. Use `if (DB::getDriverName() !== 'sqlite')` to wrap such statements or use `change()` if supported (but requires `doctrine/dbal`).
**Action:** Avoid `MODIFY COLUMN` in migrations intended for SQLite compatibility.

## 2026-02-13 - Transitioning to Relations
**Learning:** When transitioning from string columns to relations, removing string columns from `$fillable` while they are `NOT NULL` in database causes `Card::create` to fail.
**Action:** Use model events (`creating`) to provide default values for legacy columns during transition, or make columns nullable in a migration.
