import type { NextApiRequest, NextApiResponse } from 'next';
import {
    createEndpoint,
    JSONResponse,
    postWithData,
} from '../../../helpers/fetchHelper';
import { setCookie } from 'nookies';

interface Response {
    access_token: string;
    user: {};
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const response = await postWithData(
            createEndpoint('user/login'),
            req.body
        );
        const result: JSONResponse<Response> = await response.json();
        if (!response.ok) {
            res.status(response.status).json(result);
        }
        setCookie({ res }, 'access_token', result.data?.access_token ?? '');
        res.json({ errorMessage: null, data: null });
    } catch (error) {
        res.status(500).json({
            errorMessage: 'somethning went worng! please try again',
            data: null,
        });
    }
}
