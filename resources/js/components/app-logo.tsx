import { Crown, Shield } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="relative flex aspect-square size-10 items-center justify-center rounded-xl border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 shadow-xl shadow-orange-500/50">
                <Shield className="absolute size-7 text-yellow-100 drop-shadow-lg" />
                <Crown className="absolute -top-1 size-4 animate-pulse text-yellow-300 drop-shadow-lg" />
            </div>
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
