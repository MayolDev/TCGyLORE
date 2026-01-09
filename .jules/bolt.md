## 2024-05-23 - Frontend Build Dependency on PHP
**Learning:** The frontend build process (`pnpm build`) requires a PHP environment to run `php artisan wayfinder:generate` via the `@laravel/vite-plugin-wayfinder` Vite plugin. This means frontend builds cannot be verified in environments lacking PHP.
**Action:** When working in environments without PHP, skip `pnpm build` verification or mock the wayfinder generation if possible.
