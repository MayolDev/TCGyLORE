## 2024-05-22 - Database Aggregation
**Learning:** Found usage of `Model::with(...)->get()->groupBy(...)` for statistical counts. This loads all records into memory, causing performance degradation as data grows.
**Action:** Always use `Model::join(...)->groupBy(...)->selectRaw(...)` for aggregations to offload work to the database and minimize memory usage.
