## 2024-05-24 - SVG XSS in Image Uploads
**Vulnerability:** Stored XSS via File Uploads. The application used Laravel's default 'image' validation rule, which inherently permits .svg files. SVGs can contain embedded JavaScript that executes when viewed in a browser without proper Content Security Policy.
**Learning:** Relying on generic framework defaults for security features (like the 'image' validation rule) is insufficient when those defaults trade strict security for convenience.
**Prevention:** Always restrict file uploads using explicitly allowed `mimes` arrays (e.g., `mimes:jpeg,png,jpg,gif,webp`) and never trust generic framework shortcuts for security-critical validation.
