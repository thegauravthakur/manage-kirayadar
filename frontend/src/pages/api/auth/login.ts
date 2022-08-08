import type { NextApiRequest, NextApiResponse } from 'next';
import {
    createEndpoint,
    JSONResponse,
    postWithData,
} from '../../../helpers/fetchHelper';
import { setCookies } from 'cookies-next';
import { cookiesConfig } from '../../../helpers/cookiesHelper';
import { withSentry, captureException } from '@sentry/nextjs';

interface Response {
    access_token: string;
    user: {};
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await postWithData(
            createEndpoint('user/login'),
            req.body
        );
        const result: JSONResponse<Response> = await response.json();
        if (!response.ok) {
            return res.status(response.status).json(result);
        }
        setCookies('accessToken', result.data?.access_token ?? '', {
            res,
            req,
            ...cookiesConfig,
        });
        return res.json({ errorMessage: null, data: null });
    } catch (error) {
        captureException(error);
        res.status(500).json({
            errorMessage: 'somethning went worng! please try again',
            data: null,
        });
    }
}

export default withSentry(handler);
