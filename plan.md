1. **Add optimization comment**: Insert the required performance comment directly above the newly modified `->with([...])` line in `app/Http/Controllers/Admin/CardController.php` using `sed`.
2. **Read and verify the file content**: Read `app/Http/Controllers/Admin/CardController.php` to ensure the comment was correctly inserted.
3. **Log learning to `.jules/bolt.md`**: Add an entry documenting the optimization of eager loading in Inertia controllers to reduce JSON payload size and memory usage.
4. **Install dependencies**: Run `composer install` and `pnpm install --frozen-lockfile` (or `pnpm install` then revert lockfile).
5. **Setup environment**: Run `cp .env.example .env`, `touch database/database.sqlite`, `php artisan key:generate`, and `php artisan migrate:fresh`.
6. **Build frontend assets**: Run `pnpm build`.
7. **Run tests and formatting**: Run `vendor/bin/pint`, `pnpm lint`, and `php artisan test` to verify no breaking changes were made.
8. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
9. Submit with PR title `⚡ Bolt: Optimize eager loading in CardController to reduce JSON payload` and the requested structural sections.
