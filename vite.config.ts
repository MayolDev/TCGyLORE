import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// Wayfinder genera las rutas tipadas llamando a `php artisan`. La etapa de
// assets del Dockerfile es node puro y no tiene PHP, asi que ahi el build
// moria. Los ficheros que genera (resources/js/actions y resources/js/routes)
// estan versionados, de modo que en el contenedor basta con no regenerarlos:
// se compila con los que vienen del repositorio.
const generarRutas = process.env.WAYFINDER !== '0';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        ...(generarRutas ? [wayfinder({ formVariants: true })] : []),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
