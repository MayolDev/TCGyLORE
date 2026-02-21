## 2024-03-01 - Accessible Hidden Inputs

**Learning:** When using custom file inputs, the native input is often hidden with `opacity-0`. This breaks keyboard focus visibility.
**Action:** Use `focus-within:ring-*` on the parent container to show focus state when the hidden input receives focus.
