import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = getCookie('accessToken', { req, res });
    if (!token) return res.json({ error: null, data: null });
    return res.json({ error: null, data: { token } });
}
