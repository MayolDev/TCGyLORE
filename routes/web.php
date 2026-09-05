<?php

use App\Http\Controllers\Admin\AlignmentController;
use App\Http\Controllers\Admin\ArchetypeController;
use App\Http\Controllers\Admin\ArtistController;
use App\Http\Controllers\Admin\CardController;
use App\Http\Controllers\Admin\CardTypeController;
use App\Http\Controllers\Admin\CharacterController;
use App\Http\Controllers\Admin\EditionController;
use App\Http\Controllers\Admin\EditorImageController;
use App\Http\Controllers\Admin\FactionController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\ManualSectionController;
use App\Http\Controllers\Admin\RarityController;
use App\Http\Controllers\Admin\DeckController;
use App\Http\Controllers\Admin\SearchController;
use App\Http\Controllers\Admin\StoryController;
use App\Http\Controllers\Admin\TallerCardController;
use App\Http\Controllers\Admin\TimelineEventController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WorldController;
use App\Http\Controllers\ChronicleController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// La Cronica: el lore como libro, publico y sin login.
Route::get('cronica', ChronicleController::class)->name('cronica');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rutas del panel de administración
    Route::middleware(['isAdmin'])->prefix('admin')->name('admin.')->group(function () {
        // Gestión de usuarios
        Route::resource('users', UserController::class);

        // Imágenes insertadas desde el editor WYSIWYG
        Route::post('editor-images', [EditorImageController::class, 'store'])->name('editor-images.store');

        // Buscador unico sobre todo el proyecto
        Route::get('buscar', SearchController::class)->name('search');

        // Sistema de Lore
        Route::resource('worlds', WorldController::class);
        Route::resource('stories', StoryController::class);
        // El grafo va con su propio segmento para no caer en el comodin
        // characters/{character} del resource.
        Route::get('grafo-relaciones', [CharacterController::class, 'graph'])->name('characters.graph');
        Route::resource('characters', CharacterController::class);
        // Relaciones entre personajes: se crean desde la ficha del personaje
        // y se borran por su propio id, que es de la fila de relacion.
        Route::post('characters/{character}/relations', [CharacterController::class, 'storeRelation'])
            ->name('characters.relations.store');
        Route::delete('character-relations/{relation}', [CharacterController::class, 'destroyRelation'])
            ->name('characters.relations.destroy');
        Route::resource('locations', LocationController::class);
        Route::resource('timeline-events', TimelineEventController::class);

        // Sistema TCG
        // La ruta del taller va con su propio segmento (cards-taller) para no
        // caer en el comodin cards/{card} del resource.
        Route::get('cards-taller', fn () => inertia('Admin/Cards/Workshop'))->name('cards.workshop');
        // El taller manda aquí sus cartas para pasarlas a la Biblioteca,
        // y las relee al abrir una carta existente (?card=ID)
        Route::post('taller-cards', [TallerCardController::class, 'store'])->name('taller-cards.store');
        Route::get('taller-cards/{card}', [TallerCardController::class, 'show'])->name('taller-cards.show');
        Route::resource('cards', CardController::class);

        // Mazos (constructor estilo Hearthstone)
        Route::resource('decks', DeckController::class)->except(['show']);

        // Manual del Juego
        Route::resource('manual-sections', ManualSectionController::class);

        // Taxonomías TCG
        Route::resource('card-types', CardTypeController::class);
        Route::resource('rarities', RarityController::class);
        Route::resource('alignments', AlignmentController::class);
        Route::resource('archetypes', ArchetypeController::class);
        Route::resource('factions', FactionController::class);
        Route::resource('editions', EditionController::class);
        Route::resource('artists', ArtistController::class);
    });
});

require __DIR__.'/settings.php';
