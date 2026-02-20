import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Únete a la Aventura"
            description="Crea tu cuenta para forjar tu destino"
        >
            <Head title="Registrarse" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-yellow-100 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                            NOMBRE DE HÉROE
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
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
                            value={data.email}
                            className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                            value={data.password}
                            className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
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
                            value={data.password_confirmation}
                            className="bg-slate-900/50 border-yellow-900/50 text-yellow-50 placeholder:text-yellow-200/30 focus:border-yellow-600 focus:ring-yellow-600/50"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black text-lg shadow-2xl shadow-orange-500/50 hover:shadow-orange-400/70 border-2 border-yellow-400/30 hover:scale-105 transition-all tracking-wider"
                        disabled={processing}
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {processing && <Spinner />}
                        INICIAR AVENTURA
                    </Button>

                    <div className="text-center text-sm text-yellow-200/60 mt-4">
                        ¿Ya tienes cuenta?{' '}
                        <TextLink href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                            Entra al Reino
                        </TextLink>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
