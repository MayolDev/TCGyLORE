## 2024-05-22 - [SVG Upload XSS Risk]
**Vulnerability:** File upload endpoints using only the `image` validation rule may allow SVG files, which can contain embedded Scripts (XSS).
**Learning:** While the `image` rule validates image structure, it includes SVGs by default (depending on driver/version). SVGs are XML-based and can execute Javascript.
**Prevention:** Explicitly whitelist safe MIME types using `mimes:jpeg,png,jpg,gif,webp` to exclude `svg` and `svg+xml`.

## 2024-05-22 - [SQLite Migration Compatibility]
**Vulnerability:** CI/Test environments using SQLite fail on migrations containing MySQL-specific raw SQL (like `MODIFY COLUMN`).
**Learning:** SQLite has limited schema alteration capabilities. Raw `ALTER TABLE` statements will crash tests.
**Prevention:** Wrap raw schema changes in `if (DB::getDriverName() !== 'sqlite')` to ensure test suite compatibility.
