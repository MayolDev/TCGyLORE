<?php

use App\Http\Controllers\Admin\AlignmentController;
use App\Http\Controllers\Admin\ArchetypeController;
use App\Http\Controllers\Admin\ArtistController;
use App\Http\Controllers\Admin\CardController;
use App\Http\Controllers\Admin\CardTypeController;
use App\Http\Controllers\Admin\CharacterController;
use App\Http\Controllers\Admin\EditionController;
use App\Http\Controllers\Admin\FactionController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\RarityController;
use App\Http\Controllers\Admin\StoryController;
use App\Http\Controllers\Admin\TimelineEventController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WorldController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rutas del panel de administración
    Route::middleware(['isAdmin'])->prefix('admin')->name('admin.')->group(function () {
        // Gestión de usuarios
        Route::resource('users', UserController::class);

        // Sistema de Lore
        Route::resource('worlds', WorldController::class);
        Route::resource('stories', StoryController::class);
        Route::resource('characters', CharacterController::class);
        Route::resource('locations', LocationController::class);
        Route::resource('timeline-events', TimelineEventController::class);

        // Sistema TCG
        Route::resource('cards', CardController::class);

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
