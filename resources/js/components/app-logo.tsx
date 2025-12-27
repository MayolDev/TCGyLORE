import { Shield, Crown } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="relative flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 shadow-xl shadow-orange-500/50 border-2 border-yellow-400/50">
                <Shield className="absolute size-7 text-yellow-100 drop-shadow-lg" />
                <Crown className="absolute size-4 text-yellow-300 -top-1 drop-shadow-lg animate-pulse" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate leading-tight font-black tracking-wide text-yellow-100 text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
                    TAPON'AZO
                </span>
                <span className="text-[11px] text-yellow-400/90 font-bold tracking-[0.15em]" style={{ fontFamily: 'Trade Winds, cursive' }}>
                    Legends Forge
                </span>
            </div>
        </>
    );
}
