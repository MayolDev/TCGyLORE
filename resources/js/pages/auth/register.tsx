import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

export default function Register() {
    return (
        <AuthSimpleLayout
            title="Registro Cerrado"
            description="La forja de leyendas es solo por invitación."
        >
            <Head title="Registro" />

            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
                    <p>Actualmente el registro de nuevas cuentas está deshabilitado o requiere invitación especial.</p>
                </div>

                <Link
                    href="/login"
                    className="text-sm text-yellow-400 hover:text-yellow-300 underline underline-offset-4"
                >
                    Volver al inicio de sesión
                </Link>
            </div>
        </AuthSimpleLayout>
    );
}
