# Bolt's Journal

## 2024-05-22 - Resource Controller Optimization
**Learning:** Standard Laravel Resource Controllers often default to eager loading all relationships or `Model::all()` in `create`/`edit` methods. This leads to massive over-fetching, especially when only `id` and `name` are needed for dropdowns or lists.
**Action:** Always audit `with()` and `Model::all()` calls. Use `with('relation:id,name')` and `Model::select('id', 'name')->get()` to reduce memory footprint and payload size.
