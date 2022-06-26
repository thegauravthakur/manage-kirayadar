import { OptionsType } from 'cookies-next/lib/types';

export const cookiesConfig: OptionsType = {
    httpOnly: true,
    secure: true,
    maxAge: 86400000,
    sameSite: 'none',
};
