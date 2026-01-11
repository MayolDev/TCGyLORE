import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout
            title="Accede a Tu Reino"
            description="Ingresa tus credenciales para forjar tu destino"
        >
            <Head title="Iniciar Sesión" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-bold text-yellow-100"
                                    style={{ fontFamily: 'Cinzel, serif' }}
                                >
                                    CORREO LEGENDARIO
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="tu@email.com"
                                    className="border-yellow-900/50 bg-slate-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-bold text-yellow-100"
                                        style={{ fontFamily: 'Cinzel, serif' }}
                                    >
                                        CLAVE SECRETA
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu clave?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="border-yellow-900/50 bg-slate-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-yellow-900/50 data-[state=checked]:bg-yellow-600"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-yellow-200/80"
                                >
                                    Recordar mi sesión
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-lg font-black tracking-wider text-white shadow-2xl shadow-orange-500/50 transition-all hover:scale-105 hover:from-yellow-500 hover:to-red-500 hover:shadow-orange-400/70"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                {processing && <Spinner />}
                                ENTRAR AL REINO
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 rounded-lg border border-green-600/30 bg-green-900/20 p-3 text-center text-sm font-medium text-green-400">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
