'use client';

import { axiosClient } from '@util/axios';
import { User } from '@util/schema';
import o from '@sass/account/profile/page.module.sass';
import { useRouter } from 'next/navigation';

export default function ProfilePublic({ user, cookie, lang }: { user: User; cookie?: string; lang: { label: string } }) {
    const router = useRouter();

    const handleSubmit = async (e: any) =>
        await axiosClient
            .patch('/v1/users/me', { profilePublic: e.target.checked }, { headers: { Authorization: `Owner ${cookie}` } })
            .then(() => router.refresh())
            .catch((e) => e);

    return (
        <label className={o.li} htmlFor="switch">
            <p>{lang.label}</p>
            <label className={o.switch}>
                <input id="switch" type="checkbox" defaultChecked={user.profilePublic} onChange={handleSubmit} />
                <span className={o.slider}></span>
            </label>
        </label>
    );
}
