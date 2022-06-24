import { Request, Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';
import { generateHash } from '../../utils/bcrypt';

const UserData = z.object({
    name: z.string({ required_error: 'name is required' }),
    email: z
        .string({ required_error: 'email is required' })
        .email({ message: 'email is not present in correct format' }),
    password: z
        .string({ required_error: 'password is required' })
        .min(5, { message: 'password should have more than 5 characters' }),
});

/*
 * Controller responsible for creating a new user
 */
export async function createUser(req: Request, res: Response) {
    try {
        UserData.parse(req.body);
        const { name, password, email } = req.body as z.infer<typeof UserData>;
        const passwordHash = await generateHash(password);
        const user = await prismaClient.user.create({
            data: { name, email, passwordHash },
        });
        return res.json(user);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).send(error.issues.map(({ message }) => message));
        } else
            res.status(500).send([
                'Error occurred while creating a new account',
            ]);
    }
}
