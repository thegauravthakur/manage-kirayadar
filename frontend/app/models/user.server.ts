import z from 'zod';
import { prisma } from '../../utils/db';
import { generateHash } from '../../utils/bcrypt';
import APIError from '~/models/error.server';

export const UserData = z.object({
    name: z.string({ required_error: 'name is required' }),
    email: z
        .string({ required_error: 'email is required' })
        .email({ message: 'email is not present in correct format' }),
    password: z
        .string({ required_error: 'password is required' })
        .min(5, { message: 'password should have more than 5 characters' }),
});

export async function createUser(body: z.infer<typeof UserData>) {
    UserData.parse(body);
    const { name, password, email } = body;
    const doesUserExists = await prisma.user.findUnique({
        where: { email },
    });
    if (doesUserExists)
        throw new APIError({
            code: 400,
            messages: ['user already exists'],
        });
    const passwordHash = await generateHash(password);
    return await prisma.user.create({
        data: { name, email, passwordHash },
        select: { email: true, name: true, avatarUrl: true, id: true },
    });
}
