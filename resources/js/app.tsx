import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { initializeEstilo } from './hooks/use-estilo';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#d97706',  // Ámbar dorado
        showSpinner: true,
    },
});

// This will set light / dark mode on load...
initializeTheme();
initializeEstilo();

// Inertia restaura las páginas del historial SIN pedir al servidor: tras
// borrar una carta y volver «atrás», el listado enseñaba los datos viejos
// como fantasmas. En un panel de datos vivos, volver atrás debe re-pedir.
window.addEventListener('popstate', () => {
    setTimeout(() => router.reload(), 0);
});
// Lo mismo si el navegador resucita la página desde la bfcache
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        router.reload();
    }
});
