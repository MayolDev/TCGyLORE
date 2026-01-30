## 2024-05-22 - Eager Loading vs Form Population
**Learning:** In Resource Controllers using Inertia/React, the `Edit` page often receives the model as a prop. If the form is populated using the model's foreign keys (e.g., `world_id`) and dropdowns are populated via separate props (e.g., `worlds`), eager loading relationships on the main model (e.g., `$card->load('world')`) is completely unnecessary and wasteful.
**Action:** Always check if the `Edit` component actually uses the nested relationship objects before eager loading them in the Controller.
