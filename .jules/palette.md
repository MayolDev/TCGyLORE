## 2025-04-18 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Found a widespread pattern in this app's Admin index pages where icon-only action buttons (Edit, Delete) in table rows and grid cards are missing `aria-label` attributes. This is a significant accessibility issue for screen readers, as these buttons visually rely entirely on Lucide icons (like Pencil, Trash2).
**Action:** Always verify `aria-label` attributes on icon-only buttons when working with lists and tables in this app.
