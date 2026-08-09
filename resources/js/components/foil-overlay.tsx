/**
 * Brillo de carta foil: el mismo barrido diagonal que enseña el taller en
 * pantalla, para que las cartas foil brillen también en la Biblioteca, el
 * constructor de mazos y la ficha. Ponlo dentro de un contenedor relative.
 */
export default function FoilOverlay() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="foil-sweep" />
            <style>{`
                .foil-sweep{position:absolute;top:-60%;left:-30%;width:50%;height:220%;
                    background:linear-gradient(105deg,transparent,rgba(255,255,255,.45),transparent);
                    transform:rotate(8deg);animation:foil-sweep 3.4s ease-in-out infinite}
                @keyframes foil-sweep{0%{left:-40%}55%{left:120%}100%{left:120%}}
            `}</style>
        </div>
    );
}
