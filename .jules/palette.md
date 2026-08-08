## 2025-05-20 - Client-side Validation Feedback
**Learning:** Found usage of native `alert()` for file validation, which disrupts user flow. Also noted widespread use of `confirm()` for destructive actions.
**Action:** Replace `alert()` with `sonner` toasts for non-blocking feedback. Plan to replace `confirm()` with custom Dialog components in future iterations to improve accessibility and consistency.
