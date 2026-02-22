import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Únete al Reino"
            description="Comienza tu aventura hoy mismo"
        >
            <Head title="Registrarse" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-yellow-100 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                                    NOMBRE
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-yellow-100 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                                    CORREO ELECTRÓNICO
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="username"
                                    className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-yellow-100 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                                    CONTRASEÑA
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-yellow-100 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                                    CONFIRMAR CONTRASEÑA
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Link
                                    href="/login"
                                    className="underline text-sm text-yellow-400 hover:text-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    ¿Ya estás registrado?
                                </Link>

                                <Button
                                    type="submit"
                                    className="ml-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black text-lg shadow-2xl shadow-orange-500/50 hover:shadow-orange-400/70 border-2 border-yellow-400/30 hover:scale-105 transition-all tracking-wider"
                                    disabled={processing}
                                    style={{ fontFamily: 'Cinzel, serif' }}
                                >
                                    {processing && <Spinner />}
                                    REGISTRARSE
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
