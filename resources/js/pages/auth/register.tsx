import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout>
            <Head title="Register" />
            <div className="text-center">
                <h1 className="text-2xl font-bold">Registration is currently invite-only.</h1>
            </div>
        </AuthLayout>
    );
}
