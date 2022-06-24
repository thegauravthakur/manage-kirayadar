import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';

/*
 * Controller responsible for creating a new user
 */
export async function createUser(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await prismaClient.user.create({
        data: { password, username },
    });
    console.log(user);
    return res.json(user);
}
