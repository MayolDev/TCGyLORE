## 2026-03-31 - Replace blocking alert with toast in image upload
**Learning:** Using native blocking alerts (like `alert()`) is bad for UX as it disrupts the flow. Always use non-blocking toast notifications (like `sonner`) for form validation feedback.
**Action:** Replace `alert()` calls with `toast.error()` or `toast.success()` using the existing toast library for smoother interactions.
