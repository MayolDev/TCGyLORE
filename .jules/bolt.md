## 2026-03-15 - [Database vs Memory Aggregation]
**Learning:** Counting related model distribution via $model->all()->groupBy(...)->map(...count()) is an O(N) memory anti-pattern.
**Action:** Use database-level aggregation `select('foreign_key', DB::raw('count(*) as count'))->groupBy('foreign_key')->with('relation')` to reduce memory to O(R) where R is the number of distinct groups.
