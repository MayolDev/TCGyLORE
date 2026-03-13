## 2025-01-20 - Stored XSS via Laravel Default Image Validation
**Vulnerability:** Laravel's default `image` validation rule permits SVG files, which can contain embedded `<script>` tags, leading to Stored Cross-Site Scripting (XSS) when rendered by browsers.
**Learning:** In this codebase, the standard `image` rule is insufficient for protecting against malicious payloads in user-uploaded media like location images and card illustrations.
**Prevention:** Override the default `image` rule and explicitly enforce secure MIME types using `mimes:jpeg,png,jpg,gif,webp` to block vector graphics and other potentially executable formats.
