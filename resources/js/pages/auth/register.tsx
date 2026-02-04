import AuthLayout from '@/layouts/auth-layout';
import { Head, Link } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Registro Cerrado"
            description="El registro de nuevas cuentas está restringido por invitación."
        >
            <Head title="Registro" />

            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="p-4 rounded-full bg-yellow-900/20 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                <h3 className="text-xl font-cinzel font-bold text-yellow-100">
                    Solo por Invitación
                </h3>

                <p className="text-sm text-yellow-200/60 max-w-xs mx-auto">
                    Para mantener la integridad del Reino, el acceso a nuevos Señores del Lore se otorga únicamente mediante invitación directa de la Administración.
                </p>

                <div className="pt-4">
                    <Link
                        href={route('login')}
                        className="text-sm font-medium text-yellow-500 hover:text-yellow-400 hover:underline transition-colors"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
