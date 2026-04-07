## 2025-04-07 - Accessible Icon-Only Actions
**Learning:** The admin panel frequently uses icon-only action buttons (e.g., Edit, Delete) inside data grids and tables. These lack accessible names, rendering them silent and unnavigable for screen readers.
**Action:** Always add descriptive `aria-label` and `title` attributes to icon-only `<Button>` or `<Link>` elements. Utilize dynamic variables from the list item to provide explicit context (e.g., `aria-label={\`Eliminar carta ${card.name}\`}`).
