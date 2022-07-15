import { Request, Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';
import { generateHash } from '../../utils/bcrypt';
import { sendError } from '../../utils/shared';

const UserData = z.object({
    name: z
        .string({ required_error: 'name is required' })
        .min(1, 'name is required'),
    email: z
        .string({ required_error: 'email is required' })
        .email({ message: 'email is not present in correct format' }),
    password: z
        .string({ required_error: 'password is required' })
        .min(5, { message: 'password should have more than 5 characters' }),
    otp: z.string().length(6),
});

type UserSchema = z.infer<typeof UserData>;

export async function createUser(req: Request, res: Response) {
    try {
        UserData.parse(req.body);
        const { name, password, email, otp } = req.body as UserSchema;
        const doesUserExists = await prismaClient.user.findUnique({
            where: { email },
        });
        if (doesUserExists)
            return res
                .status(400)
                .json({ errorMessage: 'user already exists!', data: null });
        const otpEntry = await prismaClient.otp.findUnique({
            where: { email },
        });
        if (otpEntry?.otp !== Number(otp))
            return res
                .status(400)
                .json({ errorMessage: 'wrong OTP', data: null });

        const passwordHash = await generateHash(password);
        const user = await prismaClient.user.create({
            data: { name, email, password: { create: { hash: passwordHash } } },
        });
        return res.json({ errorMessage: null, data: { user } });
    } catch (error) {
        const message = 'Error occurred while creating a new account';
        sendError(res, error, message);
    }
}
