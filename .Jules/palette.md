## 2025-02-23 - Standardizing Button Loading States
**Learning:** Users lack visual feedback during async operations when buttons only receive a `disabled` state without a loading indicator. Developers often forget to manually add a spinner.
**Action:** centralized the loading state logic into the `Button` component itself via a `loading` prop, ensuring consistent feedback and reducing boilerplate code.
