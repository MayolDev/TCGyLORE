# Sentinel's Journal

## 2024-05-24 - Stored XSS via SVG Upload
**Vulnerability:** The `image` validation rule in Laravel allows SVGs by default. SVGs can contain executable JavaScript (`<script>` tags), leading to Stored XSS if served directly to the browser.
**Learning:** Standard validation rules like `image` might be too permissive for public uploads where security is paramount.
**Prevention:** Use `mimes:jpeg,png,jpg,gif,webp` instead of `image` to explicitly whitelist safe image formats and exclude SVGs unless strictly necessary and properly sanitized.
