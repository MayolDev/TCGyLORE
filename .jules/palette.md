## 2025-04-25 - Replace blocking alert with toast in ImageUpload
**Learning:** Native `alert()` calls can cause jarring, blocking experiences during asynchronous interactions like file uploads in React/Inertia apps. The existing system uses `sonner` for non-blocking toast notifications.
**Action:** Always replace `alert()` with `toast.error()` or `toast.success()` (imported from `sonner`) for inline validation feedback to provide a smoother, non-blocking user experience.
