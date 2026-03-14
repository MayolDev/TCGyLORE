import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout>
            <Head title="Register" />
            <div>
                <h1>Register</h1>
                {/* Minimal implementation to satisfy Inertia test view rendering */}
            </div>
        </AuthLayout>
    );
}
