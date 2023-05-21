'use client';

import { useEffect, useState } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Response, User } from '@/Interfaces';
import { axiosClient } from '@/utils';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '@/loader';

import o from '~/account/page.module.sass';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const active = useSelectedLayoutSegment();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<Response<User>>();

    const sidebar = [
        { label: 'Overview', path: '/account/', target: null },
        { label: 'Personal info', path: '/account/personal', target: 'personal' },
        { label: 'Language', path: '/account/language', target: 'language' },
        { label: 'Security', path: '/account/security', target: 'security' },
    ];

    useEffect(() => {
        if (!getCookie('napiAuthorizationToken')) return window.location.replace(`/login?redirectBack=${active ? '/account/' + active : '/account'}`);

        const getData = async () => {
            await axiosClient
                .get('/users/me', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Owner ${getCookie('napiAuthorizationToken')}`,
                    },
                })
                .then((res) => (res.data ? setData(res.data) : window.location.replace(`/login?redirectBack=${active ? '/account/' + active : '/account'}`), setLoading(false)))
                .catch(
                    (err) => (
                        err.response?.data
                            ? err.response.data.body.error.code === 'invalid_authorization_token'
                                ? window.location.replace(`/login?redirectBack=${active ? '/account/' + active : '/account'}`)
                                : setData(err.response.data)
                            : null,
                        err.response?.data.body.error.code !== 'invalid_authorization_token' ? setLoading(false) : null
                    )
                );
        };

        getData();
    }, [active]);

    return loading ? (
        <main>
            <title>Dashboard — Nove</title>
            <Loader type="window" text="Please wait while we're setting up credentials..." />
        </main>
    ) : data?.body?.data ? (
        <main>
            <title>Account — Nove</title>
            <section className={o.dashboard}>
                <aside>
                    <header>
                        <Image src={`${data.body.data.avatar}?v=${data.body.data.updatedAt}`} width={48} height={48} alt="User avatar" />
                        <h1>{data.body.data.username}</h1>
                    </header>
                    <ul>
                        {sidebar.map((list) => (
                            <li key={list.target}>
                                <Link className={active === list.target ? o.active : ''} href={list.path}>
                                    {list.target === 'language' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M 12 2 C 10.814 2 9.5418125 3.6912344 8.7578125 6.3652344 C 8.6648125 6.6822344 8.9121875 7 9.2421875 7 L 14.757812 7 C 15.087813 7 15.334188 6.6822344 15.242188 6.3652344 C 14.458187 3.6912344 13.186 2 12 2 z M 8.0664062 2.8085938 C 6.2694063 3.5805938 4.7487344 4.8665156 3.6777344 6.4785156 C 3.5307344 6.6995156 3.6968906 7 3.9628906 7 L 5.9296875 7 C 6.3556875 7 6.5475625 6.8363281 6.6015625 6.6113281 C 6.9555625 5.1343281 7.4554063 3.8475937 8.0664062 2.8085938 z M 15.933594 2.8085938 C 16.544594 3.8475937 17.044437 5.1353281 17.398438 6.6113281 C 17.452437 6.8363281 17.651813 7 17.882812 7 L 20.033203 7 C 20.299203 7 20.469266 6.6995156 20.322266 6.4785156 C 19.251266 4.8665156 17.730594 3.5805938 15.933594 2.8085938 z M 2.71875 9 C 2.56675 9 2.4287188 9.0991406 2.3867188 9.2441406 C 2.1357188 10.120141 2 11.045 2 12 C 2 12.955 2.1357188 13.879859 2.3867188 14.755859 C 2.4287187 14.900859 2.56675 15 2.71875 15 L 5.6289062 15 C 5.9249063 15 6.1500937 14.747125 6.1210938 14.453125 C 6.0440937 13.665125 6 12.848 6 12 C 6 11.152 6.0430937 10.334875 6.1210938 9.546875 C 6.1500937 9.252875 5.9249063 9 5.6289062 9 L 2.71875 9 z M 8.6484375 9 C 8.3944375 9 8.1764844 9.1855 8.1464844 9.4375 C 8.0524844 10.2495 8 11.107 8 12 C 8 12.893 8.0524844 13.7505 8.1464844 14.5625 C 8.1764844 14.8145 8.3944375 15 8.6484375 15 L 15.351562 15 C 15.605562 15 15.823516 14.8145 15.853516 14.5625 C 15.947516 13.7505 16 12.893 16 12 C 16 11.107 15.947516 10.2495 15.853516 9.4375 C 15.823516 9.1855 15.605563 9 15.351562 9 L 8.6484375 9 z M 18.371094 9 C 18.075094 9 17.849906 9.252875 17.878906 9.546875 C 17.955906 10.334875 18 11.152 18 12 C 18 12.848 17.956906 13.665125 17.878906 14.453125 C 17.849906 14.747125 18.075094 15 18.371094 15 L 21.28125 15 C 21.43325 15 21.571281 14.900859 21.613281 14.755859 C 21.864281 13.879859 22 12.955 22 12 C 22 11.045 21.864281 10.120141 21.613281 9.2441406 C 21.571281 9.0991406 21.43325 9 21.28125 9 L 18.371094 9 z M 3.9667969 17 C 3.7007969 17 3.5307344 17.300484 3.6777344 17.521484 C 4.7487344 19.133484 6.2694063 20.419406 8.0664062 21.191406 C 7.4554063 20.152406 6.9555625 18.864672 6.6015625 17.388672 C 6.5475625 17.163672 6.3481875 17 6.1171875 17 L 3.9667969 17 z M 9.2421875 17 C 8.9121875 17 8.6658125 17.317766 8.7578125 17.634766 C 9.5418125 20.308766 10.814 22 12 22 C 13.186 22 14.458188 20.308766 15.242188 17.634766 C 15.335187 17.317766 15.087812 17 14.757812 17 L 9.2421875 17 z M 18.070312 17 C 17.644312 17 17.452437 17.163672 17.398438 17.388672 C 17.044438 18.865672 16.544594 20.152406 15.933594 21.191406 C 17.730594 20.419406 19.251266 19.133484 20.322266 17.521484 C 20.469266 17.300484 20.303109 17 20.037109 17 L 18.070312 17 z"></path>
                                        </svg>
                                    ) : list.target === 'security' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M 12 3 C 7.0414839 3 3 7.0414839 3 12 C 3 17.4 6.1992188 21.599609 6.1992188 21.599609 A 1.0003907 1.0003907 0 1 0 7.8007812 20.400391 C 7.8007812 20.400391 5 16.6 5 12 C 5 8.1225161 8.1225161 5 12 5 C 15.877484 5 19 8.1225161 19 12 C 19 12.56503 18.56503 13 18 13 C 17.43497 13 17 12.56503 17 12 A 1.0001 1.0001 0 0 0 16.994141 11.888672 C 16.933857 9.1904512 14.711981 7 12 7 C 9.2504839 7 7 9.2504839 7 12 C 7 17.533333 11.400391 20.800781 11.400391 20.800781 A 1.0003905 1.0003905 0 1 0 12.599609 19.199219 C 12.599609 19.199219 9 16.466667 9 12 C 9 10.331516 10.331516 9 12 9 C 13.668484 9 15 10.331516 15 12 A 1.0001 1.0001 0 0 0 15.021484 12.216797 C 15.135989 13.760669 16.429122 15 18 15 C 19.571539 15 20.864967 13.759624 20.978516 12.214844 A 1.0001 1.0001 0 0 0 21 12 A 1.0001 1.0001 0 0 0 20.994141 11.886719 C 20.932462 6.9806693 16.920271 3 12 3 z M 11.984375 10.986328 A 1.0001 1.0001 0 0 0 11 12 C 11 13.333333 11.571501 15.19752 12.982422 16.890625 C 14.393343 18.58373 16.722222 20 20 20 A 1.0001 1.0001 0 1 0 20 18 C 17.277778 18 15.606657 16.91627 14.517578 15.609375 C 13.428499 14.30248 13 12.666667 13 12 A 1.0001 1.0001 0 0 0 11.984375 10.986328 z"></path>
                                        </svg>
                                    ) : list.target === 'personal' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                                            <path
                                                fill="currentColor"
                                                d="M 6 3 C 4.3550302 3 3 4.3550302 3 6 L 3 9 A 1.0001 1.0001 0 1 0 5 9 L 5 6 C 5 5.4349698 5.4349698 5 6 5 L 9 5 A 1.0001 1.0001 0 1 0 9 3 L 6 3 z M 21 3 A 1.0001 1.0001 0 1 0 21 5 L 24 5 C 24.56503 5 25 5.4349698 25 6 L 25 9 A 1.0001 1.0001 0 1 0 27 9 L 27 6 C 27 4.3550302 25.64497 3 24 3 L 21 3 z M 9.984375 10.986328 A 1.0001 1.0001 0 0 0 9 12 L 9 14 A 1.0001 1.0001 0 1 0 11 14 L 11 12 A 1.0001 1.0001 0 0 0 9.984375 10.986328 z M 14.984375 10.986328 A 1.0001 1.0001 0 0 0 14 12 L 14 16 A 1.0001 1.0001 0 1 0 14 18 C 15.093063 18 16 17.093063 16 16 L 16 12 A 1.0001 1.0001 0 0 0 14.984375 10.986328 z M 19.984375 10.986328 A 1.0001 1.0001 0 0 0 19 12 L 19 14 A 1.0001 1.0001 0 1 0 21 14 L 21 12 A 1.0001 1.0001 0 0 0 19.984375 10.986328 z M 18 18.984375 A 1.0001 1.0001 0 0 0 17.349609 19.191406 C 16.777916 19.606881 15.983333 20 15 20 C 14.016667 20 13.222084 19.606881 12.650391 19.191406 A 1.0001 1.0001 0 0 0 12.09375 18.992188 A 1.0001 1.0001 0 0 0 11.474609 20.808594 C 12.278916 21.393119 13.483333 22 15 22 C 16.516667 22 17.721084 21.393119 18.525391 20.808594 A 1.0001 1.0001 0 0 0 18 18.984375 z M 3.984375 19.986328 A 1.0001 1.0001 0 0 0 3 21 L 3 24 C 3 25.64497 4.3550302 27 6 27 L 9 27 A 1.0001 1.0001 0 1 0 9 25 L 6 25 C 5.4349698 25 5 24.56503 5 24 L 5 21 A 1.0001 1.0001 0 0 0 3.984375 19.986328 z M 25.984375 19.986328 A 1.0001 1.0001 0 0 0 25 21 L 25 24 C 25 24.56503 24.56503 25 24 25 L 21 25 A 1.0001 1.0001 0 1 0 21 27 L 24 27 C 25.64497 27 27 25.64497 27 24 L 27 21 A 1.0001 1.0001 0 0 0 25.984375 19.986328 z"></path>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                            <path
                                                fill="currentColor"
                                                d="M18.5 18h-8C8.019 18 6 15.981 6 13.5v-3C6 8.019 8.019 6 10.5 6h8c2.481 0 4.5 2.019 4.5 4.5v3C23 15.981 20.981 18 18.5 18zM18.5 42h-8C8.019 42 6 39.981 6 37.5v-13c0-2.481 2.019-4.5 4.5-4.5h8c2.481 0 4.5 2.019 4.5 4.5v13C23 39.981 20.981 42 18.5 42zM37.5 42h-8c-2.481 0-4.5-2.019-4.5-4.5v-3c0-2.481 2.019-4.5 4.5-4.5h8c2.481 0 4.5 2.019 4.5 4.5v3C42 39.981 39.981 42 37.5 42zM37.5 28h-8c-2.481 0-4.5-2.019-4.5-4.5v-13C25 8.019 27.019 6 29.5 6h8c2.481 0 4.5 2.019 4.5 4.5v13C42 25.981 39.981 28 37.5 28z"></path>
                                        </svg>
                                    )}
                                    {list.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                {children}
            </section>
        </main>
    ) : (
        <main>
            <title>Dashboard — Nove</title>
            <Loader type="hidden" text={data?.body?.error?.message || "Something went wrong and we can't reach the API"} />
        </main>
    );
}
