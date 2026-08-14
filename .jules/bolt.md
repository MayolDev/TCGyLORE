# Bolt's Journal

## 2024-05-24 - Optimizing Resource Controllers
**Learning:** Resource Controllers often over-fetch data for index views. Using `with(['relation:id,name'])` significantly reduces memory usage compared to full model hydration, especially when relations contain large text fields.
**Action:** Always audit `index` methods for unconstrained eager loading.
