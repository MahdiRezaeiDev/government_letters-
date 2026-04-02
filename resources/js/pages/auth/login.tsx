import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
}: Props) {
    
    return (
        <>
            <Head title="ورود به حساب کاربری" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div >
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">ایمیل</label>
                                <div className="relative">
                                    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    <input 
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        value="admin@correspondence.local" dir="ltr" className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"/>
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز عبور</label>
                                <div className="relative">
                                    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                    <input
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="رمز عبور"
                                        dir="ltr"
                                        className="w-full border border-gray-200 rounded-xl pr-10 pl-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                    <button onclick="togglePw()" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" id="eyeBtn">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                    </button>
                                    <InputError message={errors.password} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                     id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    type="checkbox" checked className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                    <span className="text-sm text-gray-600">مرا به خاطر بسپار</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">فراموشی رمز؟</a>
                            </div>

                            <button
                            type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="w-full flex justify-center mt-4 gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors text-sm">
                            ورود به سیستم
                            {processing && <Spinner />}
                            </button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
