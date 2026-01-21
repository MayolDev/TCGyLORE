## 2025-02-23 - Unsanitized HTML in Markdown
**Vulnerability:** Found `rehype-raw` being used in `ReactMarkdown` without `rehype-sanitize`. This allows Cross-Site Scripting (XSS) if users (even admins) input malicious HTML, which is then rendered on admin or potentially public pages.
**Learning:** Projects using `rehype-raw` to allow HTML inside Markdown must explicitly include `rehype-sanitize` in the plugin chain. The absence of a sanitization step when enabling raw HTML is a common oversight that leads to XSS.
**Prevention:** Always pair `rehype-raw` with `rehype-sanitize`. Configure the sanitization schema to whitelisting only the specific tags and attributes required (e.g., `span`, `className`, `data-tooltip` for citations) rather than trusting all HTML.
