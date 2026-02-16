## 2025-02-23 - Accessible Image Upload Focus
**Learning:** Hidden interactive elements (like file inputs or hover-reveal buttons) must use `focus-within` utility classes on their parent containers to ensure they become visible or show focus indicators during keyboard navigation.
**Action:** Always add `focus-within:ring` to file dropzones and `focus-within:opacity-100` to hover-reveal overlays.
