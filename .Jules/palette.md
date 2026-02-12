## 2025-02-18 - The Invisible File Input Trap
**Learning:** Custom file inputs that use `opacity-0` on the actual `<input>` element often create keyboard traps because the focus ring is invisible. Users tab into the "void" and don't know where they are.
**Action:** Always add `focus-within:ring` (or similar) to the parent container of the hidden input. This ensures the custom UI lights up when the invisible input receives keyboard focus.

## 2025-02-18 - Prop Validation in Reusable Components
**Learning:** Renaming props in a reusable component (e.g., `onChange` vs `onFileChange`) without updating all consumers causes silent failures or crashes.
**Action:** When refactoring a component used in multiple places, use `grep` to find all usages and verify props match the new interface. Consider supporting both old and new props temporarily if a full refactor isn't possible.
