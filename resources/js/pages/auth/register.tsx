import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Registrarse"
            description="Crea tu cuenta"
        >
            <Head title="Registrarse" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                autoFocus
                                autoComplete="name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="username"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                required
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Registrarse
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
