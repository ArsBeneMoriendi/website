'use client';

import { axiosClient } from '@util/axios';
import { useSearchParams } from 'next/navigation';
import Logo from '../Logo';
import o from '@sass/login.module.sass';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { COOKIE_HOSTNAME } from '-/utils/config';

export default function Login() {
    const [postError, setPostError] = useState<string>();
    const searchParams = useSearchParams();

    const throwError = (message?: string, bool?: boolean) => {
        if (bool === false) return setPostError('');

        if (message) {
            setPostError(message.charAt(0).toUpperCase() + message.slice(1).toLowerCase());

            setTimeout(() => setPostError(''), 5000);
        }
    };

    const handleLogin = async (form: FormData) => {
        const user = await axiosClient
            .post('/v1/users/login', { username: form.get('username'), password: form.get('password') }, { headers: { 'Content-Type': 'application/json' } })
            .then((user) => {
                if (user?.data?.body?.error) return throwError(user.data.body.error.message);
                else {
                    setCookie('napiAuthorizationToken', user.data.body.data.token, {
                        maxAge: 3 * 30 * 24 * 60 * 60,
                        // domain: COOKIE_HOSTNAME,
                        sameSite: 'strict',
                        secure: true,
                    });

                    const uri = searchParams.get('redirectBack') || '/account';

                    if (uri == '__CLOSE__') window.close();
                    else window.location.replace(uri);
                }
            })
            .catch((err) => (err?.response?.data?.body?.error ? throwError(err.response.data.body.error.message) : console.error(err)));
    };

    return (
        <section className={o.box}>
            <Logo size={48} />
            <h1>Welcome back</h1>
            <p>Provide your credentials to access your Nove account</p>
            <form id="loginForm" action={handleLogin}>
                <label htmlFor="username">Login</label>
                <input type="text" id="username" name="username" placeholder="Provide your username or e-mail address" />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Provide password associated with this account" />
                <div className={o.flex}>
                    <button type="submit">
                        Proceed{' '}
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14" height="14" viewBox="0 0 50 50">
                            <path
                                fill="currentColor"
                                d="M 14.988281 3.992188 C 14.582031 3.992188 14.21875 4.238281 14.0625 4.613281 C 13.910156 4.992188 14 5.421875 14.292969 5.707031 L 33.585938 25 L 14.292969 44.292969 C 14.03125 44.542969 13.925781 44.917969 14.019531 45.265625 C 14.109375 45.617188 14.382813 45.890625 14.734375 45.980469 C 15.082031 46.074219 15.457031 45.96875 15.707031 45.707031 L 35.707031 25.707031 C 36.097656 25.316406 36.097656 24.683594 35.707031 24.292969 L 15.707031 4.292969 C 15.519531 4.097656 15.261719 3.992188 14.988281 3.992188 Z"></path>
                        </svg>
                    </button>
                    {postError ? <p className="error">{postError}</p> : null}
                </div>
            </form>
        </section>
    );
}
