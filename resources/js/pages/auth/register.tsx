import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthSimpleLayout
            title="Create an Account"
            description="Enter your details to create your account"
        >
            <Head title="Register" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="bg-slate-800/50 border-yellow-500/20 text-yellow-100 placeholder:text-yellow-500/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                            autoComplete="name"
                            autoFocus={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="bg-slate-800/50 border-yellow-500/20 text-yellow-100 placeholder:text-yellow-500/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="bg-slate-800/50 border-yellow-500/20 text-yellow-100 placeholder:text-yellow-500/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="bg-slate-800/50 border-yellow-500/20 text-yellow-100 placeholder:text-yellow-500/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-bold border border-yellow-400/30 shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
                        disabled={processing}
                    >
                        {processing ? 'Creating account...' : 'Register'}
                    </Button>
                </div>

                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link
                        href={route('login')}
                        className="underline underline-offset-4 text-yellow-400 hover:text-yellow-300 font-medium"
                    >
                        Log in
                    </Link>
                </div>
            </form>
        </AuthSimpleLayout>
    );
}
