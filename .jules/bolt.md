## 2025-02-06 - Optimizing Eager Loading and Migration Pitfalls
**Learning:** Eager loading unused relationships (N+1 over-fetching) in Admin controllers is a common pattern here. Also, database migrations for `cards` and `locations` contained critical errors (missing columns, SQLite incompatibility) that blocked testing.
**Action:** When optimizing controllers, always verify which relationships are actually used by the frontend. For migrations, always include driver checks for raw SQL and ensure foreign key columns exist before constraining them.
