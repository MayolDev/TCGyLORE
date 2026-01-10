## 2024-05-23 - Missing Security Headers
**Vulnerability:** The application was serving responses without standard HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.), making it vulnerable to clickjacking and MIME-type sniffing.
**Learning:** Default Laravel installations or rapid prototypes often miss these headers unless explicitly added via middleware or web server config.
**Prevention:** Always include a `SecurityHeaders` middleware in the global or web middleware stack to enforce `Strict-Transport-Security`, `X-Frame-Options`, and `X-Content-Type-Options` by default.
