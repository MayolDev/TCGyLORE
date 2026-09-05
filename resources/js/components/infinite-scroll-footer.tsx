import { WhenVisible } from '@inertiajs/react';

interface Pagina {
    data: unknown[];
    current_page: number;
    last_page: number;
    total: number;
}

/**
 * Pie de listado con scroll infinito. Cuando este pie entra en pantalla pide
 * la pagina siguiente y el controlador la mezcla con Inertia::deepMerge, asi
 * que los elementos se acumulan en vez de sustituirse.
 *
 * `prop` es el nombre de la prop paginada en el controlador: solo se recarga
 * esa, no la vista entera. `preserveUrl` evita que la barra de direcciones se
 * llene de ?page=N mientras se baja.
 */
export default function InfiniteScrollFooter({
    pagina,
    prop,
    nombre,
}: {
    pagina: Pagina;
    prop: string;
    nombre: string;
}) {
    const quedan = pagina.current_page < pagina.last_page;

    return (
        <WhenVisible
            always={quedan}
            params={{ data: { page: pagina.current_page + 1 }, only: [prop], preserveUrl: true }}
            fallback={<></>}
        >
            <div className="py-6 text-center text-sm font-semibold text-yellow-200/60">
                {quedan
                    ? `Cargando mas ${nombre}... (${pagina.data.length} de ${pagina.total})`
                    : `${pagina.total} ${nombre} en total`}
            </div>
        </WhenVisible>
    );
}
