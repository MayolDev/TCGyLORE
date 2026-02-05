## 2026-02-05 - Stored XSS via SVG Uploads
**Vulnerability:** Admin controllers allowed image uploads using only the `image` validation rule. In environments without `libxml` or `gd`, or depending on driver configuration, this can allow SVG files which may contain malicious JavaScript (Stored XSS).
**Learning:** Laravel's `image` validation rule is not sufficient for strictly preventing SVG uploads if the underlying driver allows them or if dependencies are missing. Explicit `mimes` validation is required for strict security.
**Prevention:** Always include `mimes:jpeg,png,jpg,gif,webp` (or similar whitelist) when handling image uploads to explicitly exclude `svg`.
