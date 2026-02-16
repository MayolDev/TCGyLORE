## 2026-02-16 - Stored XSS via SVG Uploads
**Vulnerability:** The `image` validation rule in Laravel allows SVG files by default if the environment supports them. SVGs can contain malicious JavaScript (Stored XSS).
**Learning:** Relying on default validation rules or environment limitations (like missing extensions) is insufficient. Explicitly defining allowed MIME types is crucial for security.
**Prevention:** Use `mimes:jpeg,png,jpg,gif,webp` in addition to `image` to explicitly block dangerous formats like SVG.

## 2026-02-16 - Test Environment Compatibility
**Vulnerability:** Migrations using `MODIFY COLUMN` (MySQL syntax) fail in SQLite-based test environments, blocking security testing.
**Learning:** Security tests must be runnable in all environments. Always check driver compatibility when writing raw SQL migrations.
**Prevention:** Wrap database-specific statements in driver checks (e.g., `if (DB::getDriverName() !== 'sqlite')`) or use schema builder methods compatible with all drivers.
