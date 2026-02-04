import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { store as loginStore } from '@/routes/login';
import { Head } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Únete a la Leyenda"
            description="Crea tu cuenta y comienza tu aventura"
        >
            <Head title="Registro" />

            <div className="text-center text-yellow-100 mb-6">
                <p>El registro es solo por invitación.</p>
                <div className="mt-4">
                    <TextLink href={loginStore()} className="text-yellow-400 hover:text-yellow-300">
                        ¿Ya tienes cuenta? Inicia sesión
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
