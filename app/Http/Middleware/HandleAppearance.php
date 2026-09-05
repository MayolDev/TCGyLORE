<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        View::share('appearance', $request->cookie('appearance') ?? 'system');

        // El estilo visual: 'forja' es el de siempre, 'taberna' el nuevo.
        // Va en cookie para poder pintarlo ya en el HTML y que no haya
        // parpadeo entre el tema de arranque y el elegido.
        View::share('estilo', $request->cookie('estilo') ?? 'forja');

        return $next($request);
    }
}
