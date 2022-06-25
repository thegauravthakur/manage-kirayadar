import { createCookie } from '@remix-run/node'; // or "@remix-run/cloudflare"

export const accessToken = createCookie('access_token', {
    httpOnly: true,
    secure: true,
    maxAge: 86400000,
    sameSite: 'none',
});
