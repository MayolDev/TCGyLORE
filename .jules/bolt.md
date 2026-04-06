## 2025-04-06 - Eager Loading Optimization for Inertia Payloads
**Learning:** In Inertia controllers (like CardController), eager loading unused relationships creates a massive memory overhead and bloats the JSON payload sent to the frontend.
**Action:** Eager load only the id and name columns for required relationships and exclude entirely unused relationships to improve performance.
