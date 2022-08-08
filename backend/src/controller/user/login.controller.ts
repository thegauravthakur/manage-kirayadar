import { Request, Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';
import { compareHash } from '../../utils/bcrypt';
import { signToken } from '../../utils/jwt';
import * as Sentry from '@sentry/node';

const UserData = z.object({
    email: z.string().email(),
    password: z.string().min(5),
});

export async function loginUser(req: Request, res: Response) {
    try {
        UserData.parse(req.body);
        const { password, email } = req.body as z.infer<typeof UserData>;
        const user = await prismaClient.user.findUnique({
            where: { email },
            include: { password: true },
        });
        if (!user)
            return res.status(400).json({
                errorMessage: 'wrong combination of email/password',
                data: null,
            });
        const result = await compareHash(password, user.password?.hash ?? '');
        if (!result)
            return res.status(400).json({
                errorMessage: 'wrong combination of email/password',
                data: null,
            });
        const { password: p, ...filteredUser } = user;
        const access_token = signToken(filteredUser);
        return res.json({
            data: { user: filteredUser, access_token },
            errorMessage: null,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // a neat trick
            res.status(400).send({
                errorMessage: 'wrong combination of email/password',
                data: null,
            });
        } else {
            Sentry.captureException(error);
            res.status(500).json({
                errorMessage:
                    'An error occurred while logging in, please try again later',
                data: null,
            });
        }
    }
}
