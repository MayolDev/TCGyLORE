## 2026-01-28 - Card Controller & Schema Mismatch
**Learning:** The `cards` table schema uses string columns (e.g., `card_type`, `rarity`) instead of foreign keys (`card_type_id`, `rarity_id`), while the `Card` model defines relationships expecting foreign keys. This causes `Card::create` and relationship loading to fail in standard environments unless the schema is patched. `CardSeeder` might rely on specific environment state or fail.
**Action:** When optimizing `CardController`, rely on confirmed working relationships (`world`, `character`) which use foreign keys. Be cautious with `cardType` and `rarity` relations as they may return null due to schema mismatch. Avoid modifying migrations to fix this as it constitutes a destructive architectural change.

## 2026-01-28 - SQLite Migration Limitations
**Learning:** `ALTER TABLE ... MODIFY COLUMN` syntax is not supported in SQLite. Migrations using this must wrap it in a driver check or use standard Schema Builder methods compatible with SQLite (though SQLite has limited ALTER support).
**Action:** Always check database driver compatibility when writing raw SQL in migrations, especially for `sqlite` used in testing.

## 2026-01-28 - Vite Plugin Noise
**Learning:** `@laravel/vite-plugin-wayfinder` generates or modifies TypeScript definition files in `resources/js/actions` and `routes` during the build process.
**Action:** When running `pnpm build`, be aware of these auto-generated changes and revert them if they are not part of the intended code changes to avoid polluting PRs.
