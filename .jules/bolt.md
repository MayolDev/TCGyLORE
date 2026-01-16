## 2024-05-24 - Over-fetching in Resource Controllers
**Learning:** Resource controllers often copy-paste eager loading patterns (loading *all* relationships) even for index views that only need a subset of data. This sends megabytes of unnecessary JSON to the frontend.
**Action:** Audit `index` methods to only `with('relation:id,name')` for what is actually displayed in the table/list.
