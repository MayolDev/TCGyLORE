## 2025-02-21 - Hidden File Input Accessibility Trap
**Learning:** Custom file upload UIs often use `opacity-0` file inputs to overlay a custom design. This breaks keyboard accessibility because the user cannot see where focus is.
**Action:** Always add `focus-within` styles (e.g., `focus-within:ring-2`) to the parent container of the hidden input so the custom UI visually reacts when the hidden input receives focus.
