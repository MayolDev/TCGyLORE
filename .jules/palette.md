## 2024-05-23 - Reusable Loading Button Pattern
**Learning:** The `Button` component lacked a native loading state, leading to inconsistent manual implementations of spinners (e.g., in Login vs ForgotPassword).
**Action:** Use the `loading` prop on the `Button` component instead of manually rendering spinners. This ensures consistent spinner sizing, placement, and automatic disabling of the button.
