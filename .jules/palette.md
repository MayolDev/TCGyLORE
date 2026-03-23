## 2024-05-18 - Improve ImageUpload UX and Accessibility
**Learning:** Native `alert()` dialogs block the UI thread and provide a jarring experience, especially in modern React applications. Relying on visual cues alone for drag-and-drop zones makes them inaccessible to keyboard users.
**Action:** Replace `alert()` with non-blocking toast notifications (e.g., `sonner`) for validation errors. Add `focus-within` styling to drag-and-drop areas to ensure clear keyboard focus indicators, and always provide `aria-label` attributes for icon-only buttons like the image delete button.
