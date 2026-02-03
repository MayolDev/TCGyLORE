import { Head, Link } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';

export default function Register() {
    return (
        <AuthLayout title="Unirse" description="Forja tu leyenda">
            <Head title="Registrarse" />
            <div className="text-center space-y-6">
                <div className="bg-yellow-900/20 p-6 rounded-lg border border-yellow-500/30">
                    <p className="text-yellow-100 font-semibold mb-2">
                        🛡️ Inscripciones Cerradas
                    </p>
                    <p className="text-sm text-yellow-200/70">
                        El registro de nuevos héroes es solo por invitación en este momento.
                    </p>
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-2 shadow-lg shadow-orange-500/20">
                    <Link href={login()}>
                        Volver al Login
                    </Link>
                </Button>
            </div>
        </AuthLayout>
    );
}
