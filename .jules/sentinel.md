
## 2024-05-14 - Laravel Image Validation Rule Allows SVGs
**Vulnerability:** Laravel's default 'image' validation rule permits SVG files to be uploaded. This can lead to Stored XSS as SVG files can contain executable JavaScript code that triggers when the SVG is viewed in a browser.
**Learning:** The 'image' rule alone is insufficient for preventing malicious file uploads if SVGs are not intended to be supported.
**Prevention:** Override or supplement the default 'image' validation rule with explicit MIME type restrictions using 'mimes:jpeg,png,jpg,gif,webp' to strictly allow only non-executable image formats.
