## 2025-02-27 - Hidden Inputs & Focus Accessibility
**Learning:** Components wrapping hidden file inputs (like `opacity-0`) often break keyboard accessibility because the user cannot see where focus is.
**Action:** Always add `focus-within` styles (like `focus-within:ring-2`) to the parent container of the hidden input so the user gets visual feedback when tabbing to the invisible element.
