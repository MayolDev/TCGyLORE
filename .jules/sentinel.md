## 2024-05-20 - Fix XSS via File Upload
**Vulnerability:** The application used Laravel's default 'image' validation rule which allows SVG files. SVG files can contain executable JavaScript, leading to Stored XSS if uploaded as an image.
**Learning:** Default validation rules like 'image' in some frameworks (like Laravel) might be too permissive and include vector graphics formats capable of holding scripts.
**Prevention:** Always restrict file uploads explicitly using the 'mimes' rule (e.g., 'mimes:jpeg,png,jpg,gif,webp') to exclude potentially dangerous file types like SVGs when only raster images are needed.
