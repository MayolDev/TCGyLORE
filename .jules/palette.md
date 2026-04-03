
## 2024-05-15 - Replace blocking alert with toast notifications
**Learning:** Using native browser `alert()` for validation feedback (like file size limits in ImageUpload) disrupts the user workflow and creates a jarring experience, as it blocks the entire browser thread.
**Action:** Use non-blocking, integrated UI notifications like `sonner` toast messages to provide feedback on inline interactions, ensuring a smooth and modern UX that aligns with the rest of the application.
