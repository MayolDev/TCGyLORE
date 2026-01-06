# Bolt's Journal ⚡

## 2024-05-22 - [Optimizing Card List & Hydration Fixes]
**Learning:**
- **Unused Eager Loading:** In Laravel, `with()` is often copy-pasted. Always check if the relationships are actually used in the view. I removed 5 unused relationships from `CardController::index`.
- **Payload Size:** Selecting only `id,name` for relationships (`with('relation:id,name')`) significantly reduces the JSON payload size for Inertia responses, especially for list views.
- **Hydration Mismatch:** Generating random values (e.g., for background stars) directly in the render body causes hydration mismatches in React/Inertia. Moving this to `useEffect` ensures consistency.
- **Linting:** strict linting rules like `react-hooks/set-state-in-effect` might need targeted exceptions when initializing client-only state (like random positions).

**Action:**
- Always audit `with()` clauses in controllers against the actual props used in the React component.
- Use `useEffect` for any random UI generation.
