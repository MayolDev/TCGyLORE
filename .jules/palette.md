## 2024-05-23 - Toast Notifications for Validation
**Learning:** Client-side validation errors (e.g., file constraints) must be displayed using `sonner` toast notifications instead of native browser alerts to maintain a consistent and non-intrusive UI.
**Action:** Replace any `alert()` calls with `toast.error()` or appropriate toast variant.
