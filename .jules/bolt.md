## 2025-01-29 - SQLite Migration Incompatibility
**Learning:** Database migrations utilizing raw SQL statements (e.g., `ALTER TABLE ... MODIFY COLUMN`) fail in SQLite environments (like the test suite) because SQLite uses different syntax or doesn't support certain `ALTER TABLE` operations.
**Action:** Always include conditional driver checks (e.g., `DB::getDriverName() !== 'sqlite'`) or use Schema Builder methods (which abstract these differences) when writing migrations to ensure cross-database compatibility, especially for testing.
