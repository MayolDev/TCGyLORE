## 2025-05-18 - Avoid Accidental Lockfile Commits
**Learning:** When running `pnpm install` in a repository that tracks `package-lock.json` but not `pnpm-lock.yaml`, `pnpm` will generate a `pnpm-lock.yaml`. Committing this file adds significant noise and changes the repository configuration.
**Action:** Always check `git status` for unexpected new files like `pnpm-lock.yaml` before committing, especially after running installation commands. Use `git restore` or `rm` to cleanup unless migration to pnpm is the goal.
