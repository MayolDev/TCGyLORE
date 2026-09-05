/**
 * Solo el sello, sin el nombre al lado. Se usa en las pantallas de acceso y
 * en la cabecera del movil. Antes era el logotipo que traia el andamiaje de
 * Laravel, un SVG abstracto que no pintaba nada aqui.
 */
export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <img
            src="/logo-taponazo.png"
            alt="Tapon'Azo"
            className={className}
            width={512}
            height={512}
        />
    );
}
