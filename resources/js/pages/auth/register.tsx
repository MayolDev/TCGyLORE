import { Head, Link } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';

export default function Register() {
    return (
        <AuthLayout title="Registro Cerrado" description="El reino no acepta nuevos viajeros por el momento">
            <Head title="Registro" />

            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="rounded-full bg-yellow-500/10 p-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-500"
                    >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-yellow-100 font-cinzel">Solo por Invitación</h3>
                    <p className="text-sm text-yellow-200/60 max-w-xs mx-auto">
                        Las puertas de Tapon'Azo están cerradas temporalmente. Solo aquellos con un pergamino de invitación pueden entrar.
                    </p>
                </div>

                <div className="w-full pt-4">
                    <Button
                        className="w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black border-2 border-yellow-400/30"
                        asChild
                    >
                        <Link href={login()}>
                            Volver al Portal de Acceso
                        </Link>
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
}
