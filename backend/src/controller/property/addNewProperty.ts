import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';
import { getUserFromToken } from '../../middleware/protected';
import { User } from '../../types';
import propertyRoute from '../../routes/property.route';
import { sendError } from '../../utils/shared';

const propertySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    totalFloors: z.number().min(1, 'total floors should be more than 1'),
    address: z.string().min(1, 'Address is required'),
});

type PropertySchema = z.infer<typeof propertySchema>;

export async function addNewProperty(req: Request, res: Response) {
    try {
        const user = (await getUserFromToken(req)) as User;
        propertySchema.parse(req.body);
        const { address, name, totalFloors } = req.body as PropertySchema;
        const property = await prismaClient.property.create({
            data: { address, name, totalFloors, ownerId: user.id },
        });
        return res.json({ errorMessage: null, data: { property } });
    } catch (error) {
        const message = 'An error occurred while creating a new property';
        sendError(res, error, message);
    }
}
