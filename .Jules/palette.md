## 2026-02-25 - ImageUpload Component Props Mismatch
**Learning:** The `ImageUpload` component had a props interface (`ImageUploadProps`) that didn't match its usage in `Create.tsx` and `Edit.tsx`. Specifically, `value` and `onChange` were being passed instead of `currentImage` and `onFileChange`. This caused the "existing image" preview to fail in Edit mode. Fixing the component definition is not enough; verifying usage via `pnpm types` is critical to ensure the UI actually works as intended.
**Action:** Always run `pnpm types` when modifying TypeScript components to catch usage discrepancies that `pnpm build` might miss.

## 2026-02-25 - Wayfinder Artifacts Noise
**Learning:** The project uses `@laravel/vite-plugin-wayfinder` which auto-generates files in `resources/js/actions` and `resources/js/routes`. These files are often modified during local builds (`pnpm build`) even if no logic changed (e.g., timestamp updates). These changes add significant noise to PRs.
**Action:** Always check `git status` for `resources/js/actions` and `resources/js/routes` and revert them to HEAD if they were not intentionally modified.
