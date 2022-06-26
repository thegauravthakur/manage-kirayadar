import type { NextApiRequest, NextApiResponse } from 'next';
import {
    createEndpoint,
    JSONResponse,
    postWithData,
} from '../../../helpers/fetchHelper';
import { removeCookies, setCookies } from 'cookies-next';
import { cookiesConfig } from '../../../helpers/cookiesHelper';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    removeCookies('accessToken', { res, req, ...cookiesConfig });
    return res.send(null);
}
