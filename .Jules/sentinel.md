## 2024-01-08 - Admin Manual XSS Risk
**Vulnerability:** The Admin Manual feature uses `rehype-raw` to render Markdown content, which allows full HTML injection. While currently restricted to Admins, this presents a Stored XSS risk if an Admin account is compromised or if the content is ever displayed to non-admins without sanitization.
**Learning:** Even "trusted" interfaces like Admin panels need Defense in Depth. Libraries that enable HTML in Markdown (like `rehype-raw`) should be treated with extreme caution.
**Prevention:**
1. Use `rehype-sanitize` alongside `rehype-raw` to whitelist safe tags.
2. If HTML is not strictly needed, disable `rehype-raw`.
3. Added Global Security Headers (CSP, X-Frame-Options, etc.) as a mitigation layer to reduce impact of potential XSS.
