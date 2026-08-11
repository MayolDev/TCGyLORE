## 2025-05-16 - Standardized Button Loading State
**Learning:** Adding a `loading` prop to the base `Button` component (handling disabled state and spinner injection) significantly reduces boilerplate in forms and improves consistency.
**Action:** Use `loading={processing}` instead of manual `disabled` + conditional `Spinner` rendering for submit buttons.
