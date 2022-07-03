import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import {
    createEndpoint,
    JSONResponse,
    postWithToken,
} from '../../../helpers/fetchHelper';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = getCookie('accessToken', { req, res }) as string;
    if (!token)
        return res
            .status(401)
            .json({ errorMessage: 'Unauthorized!', data: null });
    const response = await postWithToken(
        createEndpoint('property/add'),
        token,
        req.body
    );
    const result: JSONResponse<Response> = await response.json();
    if (!response.ok) {
        return res.status(response.status).json(result);
    }
    return res.json(result);
}
