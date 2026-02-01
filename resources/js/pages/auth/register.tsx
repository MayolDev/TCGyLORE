import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store as loginStore } from '@/routes/login';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Forja Tu Leyenda"
            description="Crea tu cuenta y comienza tu viaje épico"
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
                                    NOMBRE DE HÉROE
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Tu nombre legendario"
                                    className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-yellow-100 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                                    CORREO LEGENDARIO
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="tu@email.com"
                                    className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-yellow-100 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                                    CLAVE SECRETA
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-yellow-100 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                                    CONFIRMAR CLAVE
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black text-lg shadow-2xl shadow-orange-500/50 hover:shadow-orange-400/70 border-2 border-yellow-400/30 hover:scale-105 transition-all tracking-wider"
                                tabIndex={5}
                                disabled={processing}
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                {processing && <Spinner />}
                                UNIRSE AL REINO
                            </Button>
                        </div>

                        <div className="text-center text-sm text-yellow-200/70">
                            ¿Ya tienes una cuenta?{' '}
                            <TextLink href={loginStore.url()} className="text-yellow-400 hover:text-yellow-300 font-bold" tabIndex={6}>
                                Inicia Sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
