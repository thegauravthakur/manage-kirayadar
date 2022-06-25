import { CookieOptions, Request, Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';
import { compareHash } from '../../utils/bcrypt';
import { signToken } from '../../utils/jwt';

const UserData = z.object({
    email: z.string().email(),
    password: z.string().min(5),
});

/*
 * Controller responsible for creating a new user
 */
export async function loginUser(req: Request, res: Response) {
    try {
        UserData.parse(req.body);
        const { password, email } = req.body as z.infer<typeof UserData>;
        const user = await prismaClient.user.findUnique({ where: { email } });
        if (!user)
            return res
                .status(400)
                .send(['wrong combination of email/password']);
        const result = await compareHash(password, user.passwordHash ?? '');
        if (!result)
            return res
                .status(400)
                .send(['wrong combination of email/password']);
        const { passwordHash, ...filteredUser } = user;
        const access_token = signToken(filteredUser);
        return res.json({ user: filteredUser, access_token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // a neat trick
            res.status(400).send(['wrong combination of email/password']);
        } else
            res.status(500).send([
                'An error occurred while logging in, please try again later',
            ]);
    }
}
