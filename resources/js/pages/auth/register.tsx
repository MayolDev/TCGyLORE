import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
    return (
        <AuthLayout>
            <Head title="Registrar" />
            <div>
                <h1>Register</h1>
                <form>
                    <Input type="text" placeholder="Name" />
                    <Input type="email" placeholder="Email" />
                    <Input type="password" placeholder="Password" />
                    <Input type="password" placeholder="Confirm Password" />
                    <Button type="submit">Register</Button>
                </form>
            </div>
        </AuthLayout>
    );
}
