# Sentinel's Journal

This journal records CRITICAL security learnings, vulnerability patterns, and architectural gaps found in the codebase.

## Format
`## YYYY-MM-DD - [Title]
**Vulnerability:** [What you found]
**Learning:** [Why it existed]
**Prevention:** [How to avoid next time]`

## 2024-05-23 - Stored XSS via SVG Uploads
**Vulnerability:** The application allowed file uploads with the `image` validation rule, which implicitly includes `svg` files. SVG files can contain embedded scripts (XSS) that execute when the image is viewed directly or embedded in certain contexts.
**Learning:** Laravel's default `image` validation rule is insufficient for preventing Stored XSS because it considers SVG as a valid image type.
**Prevention:** Explicitly use `mimes:jpeg,png,jpg,gif,webp` in validation rules for all file uploads to exclude SVG and other potentially dangerous vector formats.
