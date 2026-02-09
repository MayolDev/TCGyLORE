## 2025-05-18 - File Upload Accessibility & Feedback
**Learning:** Hidden file inputs (`opacity-0`) block visual focus indicators, making keyboard navigation confusing. Also, native `alert()` for validation disrupts the flow.
**Action:** Use `focus-within` on the parent container to show a focus ring when the hidden input is focused. Replace `alert()` with `sonner` toast notifications for non-blocking feedback.
