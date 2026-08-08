## 2025-04-14 - Prevent Stored XSS via File Uploads
**Vulnerability:** The application was using Laravel's default 'image' validation rule for file uploads (`illustration` in `CardController`, `image` in `LocationController`). This default rule permits SVG files.
**Learning:** Permitting SVG uploads can lead to Stored XSS vulnerabilities because SVGs can contain embedded JavaScript that executes when viewed in a browser.
**Prevention:** Override the default 'image' validation rule by explicitly adding MIME type restrictions (e.g., `'mimes:jpeg,png,jpg,gif,webp'`) to prevent SVG uploads while still allowing safe image formats.
