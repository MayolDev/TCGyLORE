/**
 * El sello de lacre del proyecto. Antes habia aqui un escudo y una corona de
 * iconos genericos con degradado naranja; el emblema es el de verdad.
 */
export default function AppLogo() {
    return (
        <>
            <img
                src="/logo-taponazo.png"
                alt="Tapon'Azo"
                className="size-11 shrink-0 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                width={512}
                height={512}
            />
            <div className="ml-2 grid flex-1 text-left">
                <span
                    className="truncate text-base leading-tight font-black tracking-wide text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
                    TAPON'AZO
                </span>
                <span
                    className="text-[11px] font-bold tracking-[0.15em] text-yellow-400/90"
                    style={{ fontFamily: 'Trade Winds, cursive' }}
                >
                    Legends Forge
                </span>
            </div>
        </>
    );
}
