## 2026-03-02 - Optimize Dashboard stats
**Learning:** `DashboardController::index` grouped all cards into memory using `->get()->groupBy(...)`, creating an O(N) memory bottleneck based on the total number of cards in the database.
**Action:** Always group and count at the database level using `select('rarity_id', DB::raw('count(*)'))->groupBy('rarity_id')` to transform an O(N) memory operation into an O(R) one where R is the number of distinct relationship rows (e.g. rarities). Avoid loading thousands of eloquent models into memory for aggregations.
