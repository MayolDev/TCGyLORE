## 2026-01-15 - Security Headers Middleware
**Vulnerability:** Missing HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.) left the application vulnerable to clickjacking and MIME sniffing.
**Learning:** Laravel middleware provides a centralized way to apply security headers globally.
**Prevention:** Register `SecurityHeaders` middleware in `bootstrap/app.php` to enforce headers on all responses.
