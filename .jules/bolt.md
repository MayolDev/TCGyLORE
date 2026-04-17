## 2024-04-17 - Optimize CardController Index Eager Loading
**Learning:** The Card index page eagerly loaded many relationships (archetype, alignment, faction, edition, artist) that were not used in the UI list view. Also, the needed relations (world, character, cardType, rarity) loaded all columns instead of just the id and name.
**Action:** Limit eager loading to only required relationships and use column constraints (e.g. `world:id,name`) to reduce memory and query time payload sizes.
