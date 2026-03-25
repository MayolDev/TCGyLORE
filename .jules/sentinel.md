## 2026-01-05 - SVG Stored XSS via File Uploads
**Vulnerability:** The default Laravel `image` validation rule permits SVG files to be uploaded. SVGs can contain embedded JavaScript, creating a Stored Cross-Site Scripting (XSS) vulnerability.
**Learning:** Found in `CardController` and `LocationController`. The generic `image` rule should not be used when uploading assets that might be rendered directly in the DOM, as Laravel's validation does not strip JS from SVGs.
**Prevention:** Override Laravel's default `image` validation rule with explicit MIME type restrictions using `mimes:jpeg,png,jpg,gif,webp` to block SVG uploads entirely.
