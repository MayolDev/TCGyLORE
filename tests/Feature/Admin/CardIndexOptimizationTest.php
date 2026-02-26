<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Card;
use App\Models\World;
use App\Models\CardType;
use App\Models\Rarity;
use App\Models\Archetype;
use App\Models\Alignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CardIndexOptimizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create Admin role
        Role::firstOrCreate(['name' => 'Admin']);
        Role::firstOrCreate(['name' => 'Usuario']);
    }

    public function test_admin_card_index_loads_optimized_relations()
    {
        // 1. Create an Admin user
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        // 2. Create related models (World, CardType, Rarity, etc.)
        $world = World::create(['name' => 'Test World', 'description' => 'A test world', 'is_active' => true]);
        $cardType = CardType::create(['name' => 'Creature', 'slug' => 'creature', 'description' => 'A creature card']);
        $rarity = Rarity::create(['name' => 'Common', 'slug' => 'common', 'description' => 'A common card']);
        $archetype = Archetype::create(['name' => 'Warrior', 'slug' => 'warrior', 'description' => 'A warrior archetype']);
        $alignment = Alignment::create(['name' => 'Neutral', 'slug' => 'neutral', 'description' => 'Neutral alignment']);

        // 3. Create a Card with all relationships set
        $card = Card::forceCreate([
            'world_id' => $world->id,
            'character_id' => null,
            'name' => 'Test Card',
            'effect' => 'Test Effect',
            'cost' => 1,
            'card_type_id' => $cardType->id,
            'rarity_id' => $rarity->id,
            'archetype_id' => $archetype->id,
            'alignment_id' => $alignment->id,
            // Legacy/Required string columns (based on migration analysis and assumption)
            'card_type' => 'Creature',
            'rarity' => 'Common',
            'archetype' => 'Warrior',
            'alignment' => 'neutral',
        ]);

        // 4. Make Request
        $response = $this->actingAs($admin)->get(route('admin.cards.index'));

        // 5. Assert Success
        $response->assertOk();

        // 6. Assert Optimized Structure
        // Since Inertia returns props, we need to inspect those props.
        // Inertia testing helpers allow asserting props.
        $cards = $response->viewData('page')['props']['cards']['data'];

        $this->assertCount(1, $cards);
        $cardData = $cards[0];

        // Check essential data is present
        $this->assertEquals($card->id, $cardData['id']);
        $this->assertEquals($card->name, $cardData['name']);

        // Check relationships that SHOULD be loaded (optimized)
        $this->assertArrayHasKey('world', $cardData);
        $this->assertEquals($world->id, $cardData['world']['id']);
        $this->assertEquals($world->name, $cardData['world']['name']);

        $this->assertArrayHasKey('card_type', $cardData);
        $this->assertEquals($cardType->id, $cardData['card_type']['id']);
        $this->assertEquals($cardType->name, $cardData['card_type']['name']);

        $this->assertArrayHasKey('rarity', $cardData);
        $this->assertEquals($rarity->id, $cardData['rarity']['id']);
        $this->assertEquals($rarity->name, $cardData['rarity']['name']);

        // Check relationships that SHOULD NOT be loaded (to verify optimization)
        // If they are not loaded, they won't be in the serialized JSON if they are null or not appended.
        // However, standard Eloquent serialization includes relations if loaded.
        // Before optimization, 'archetype' key would be present as an object.
        // After optimization, if not loaded, it might be missing or null depending on how it's accessed/serialized.

        // Strategy: Verify that 'archetype' relationship is NOT loaded or present in the payload as a full object.
        // Note: The `cards` table has a string column `archetype`.
        // The model has `archetype()` relationship.
        // If relation is loaded, `$card->archetype` is the model. If not loaded, it's the string value from column?
        // Wait, if column name conflicts with relationship name, accessing `$card->archetype` returns the column value (string).
        // To access the relationship, one must use `$card->getRelation('archetype')`.
        // If `with('archetype')` is used, it eagerly loads it into the `relations` array.
        // When serialized to JSON, `attributes` and `relations` are merged. If there's a conflict, `relations` usually take precedence or vice versa depending on Laravel version.
        // BUT, given the conflict, relying on `archetype` key in JSON is tricky.

        // However, `faction`, `edition`, `artist` do NOT have conflicting string columns in the migration I saw (only `archetype`, `card_type`, `rarity`, `alignment` seemed to have strings).
        // Let's check `faction`. Migration 2025_12_21_124455_create_cards_table.php has `$table->string('faction')->nullable();`.
        // So `faction` also conflicts.

        // Let's check `edition`. Migration 2025_12_27_173348_create_editions_table.php created the table.
        // Migration 2025_12_21_124455_create_cards_table.php has `$table->string('edition')->nullable();`.
        // So `edition` also conflicts.

        // This confirms the naming conflict issue mentioned in memory.
        // "The `Card` model contains a naming conflict where the `rarity` column (string, enum) shadows the `rarity()` relationship..."

        // Optimization: Removing `with(['archetype'])` means the relation won't be loaded.
        // The JSON will likely contain the string value from the column `archetype`.
        // Before optimization: It might have contained the relation object (if it overrides) or still the string.
        // Actually, if there is a collision, `$card->archetype` returns the attribute (string).
        // So `with('archetype')` might satisfy the eagerness but accessing it via property gives string.
        // Unless the resource/controller explicitly formats it.
        // The controller just passes `Card::query()->with(...)->paginate(...)`.

        // If the goal is performance, removing the `with` query is the win.
        // The test can inspect the `relations` on the model if we can access the raw query log or similar, but for Feature test we inspect JSON.

        // If I remove `archetype` from `with`, the `archetype` key in JSON will definitely be the string column.
        // If I include `with`, it is still likely the string column due to shadowing.
        // SO, the visible change in JSON might be minimal for shadowed fields.

        // However, `world` does NOT have a string column `world` (it has `world_id`).
        // `character` does NOT have a string column `character` (it has `character_id`).
        // `artist`? `cards` table has `$table->string('artist')->nullable();`. Shadowed.

        // `world` and `character` are the ones we can safely check for "id,name" optimization.
        // Before: `world` object has `created_at`, `updated_at`, `description`, etc.
        // After: `world` object ONLY has `id`, `name`.

        $this->assertArrayNotHasKey('description', $cardData['world'], "World description should not be loaded");
        $this->assertArrayNotHasKey('created_at', $cardData['world'], "World created_at should not be loaded");

        // Also check `character` if we had one (we set null in this test, let's create one to be sure).
    }
}
