## 2024-05-20 - Stored XSS via SVG File Uploads
**Vulnerability:** Laravel's default 'image' validation rule permits SVG files. SVGs are XML-based and can contain embedded JavaScript (`<script>` tags) which will execute when the image is rendered directly in a browser, leading to Stored Cross-Site Scripting (XSS).
**Learning:** We must not rely on Laravel's 'image' rule when user-uploaded images are served from our domain. We should enforce specific MIME types to only allow raster images.
**Prevention:** Override Laravel's default 'image' validation rule with explicit MIME type restrictions using 'mimes:jpeg,png,jpg,gif,webp'.
