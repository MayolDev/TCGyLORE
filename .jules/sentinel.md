## 2026-04-09 - File Upload Stored XSS Prevention
**Vulnerability:** The application allowed file uploads with the generic 'image' validation rule, which includes SVGs. SVGs can contain executable JavaScript, leading to Stored XSS if the image is viewed directly.
**Learning:** In Laravel, the 'image' rule validates mimes (jpeg, png, gif, bmp, svg, webp). Without explicitly restricting mimes, developers might inadvertently allow dangerous file types like SVG.
**Prevention:** Always combine the 'image' validation rule with explicitly defined safe MIME types (e.g., 'mimes:jpeg,png,jpg,gif,webp') to restrict uploads and block SVG vulnerabilities.
