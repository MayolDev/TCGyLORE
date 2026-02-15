# Sentinel Journal

## 2026-02-15 - Stored XSS Prevention via Strict MIME Validation
**Vulnerability:** The `image` validation rule in Laravel allows SVG files by default, which can contain malicious JavaScript (Stored XSS).
**Learning:** Even if the server environment (e.g., missing `libxml`) unintentionally blocks SVG processing, relying on environmental quirks is not a security strategy. Explicitly defining allowed MIME types is crucial.
**Prevention:** Always use `mimes:jpeg,png,jpg,gif,webp` in addition to `image` validation rule to strictly control allowed file types and prevent SVG uploads.

## 2026-02-15 - SQLite Compatibility in Migrations
**Vulnerability:** Using `MODIFY COLUMN` (MySQL specific) in migrations causes test failures in SQLite environments, preventing security tests from running.
**Learning:** Security tests rely on a stable test environment. Migrations must be database-agnostic or conditionally executed.
**Prevention:** Wrap database-specific DDL statements in `if (DB::getDriverName() !== 'sqlite')` blocks.
