<?php

use App\Http\Controllers\CatalogoController;
use Illuminate\Support\Facades\Route;

/*
 * API pública de solo lectura.
 *
 * Existe para una cosa: que la mesa de pruebas (taponazo.mayoldev.es/mesa, otro
 * proyecto, .NET) lea las cartas de AQUÍ en vez de llevar su propia copia. Antes
 * la misma carta vivía en tres sitios —los .md del diseño, un cartas.json
 * commiteado a mano y esta base de datos— y cambiar un coste obligaba a
 * regenerar un fichero y redesplegar un contenedor.
 */
Route::get('/catalogo', [CatalogoController::class, 'index'])->name('api.catalogo');
