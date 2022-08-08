import type { NextApiRequest, NextApiResponse } from 'next';
import { removeCookies } from 'cookies-next';
import { cookiesConfig } from '../../../helpers/cookiesHelper';
import { withSentry } from '@sentry/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    removeCookies('accessToken', { res, req, ...cookiesConfig });
    return res.send(null);
}

export default withSentry(handler);
