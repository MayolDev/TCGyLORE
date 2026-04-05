## 2025-01-20 - Group By DB vs In-Memory
**Learning:** For large collections, fetching all records with `Model::all()` or `Model::with('rel')->get()` and then calling `->groupBy()` takes O(N) memory and time.
**Action:** Always prefer pushing grouping calculations to the database using `select('foreign_id', DB::raw('count(*) as count'))->groupBy('foreign_id')->with('relation')` before calling `get()`. Handle any model naming conflicts safely using `$item->relationLoaded('rel') && $item->getRelation('rel')`.
