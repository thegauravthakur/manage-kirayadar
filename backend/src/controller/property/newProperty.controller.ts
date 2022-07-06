import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';
import { getUserFromToken } from '../../middleware/protected';
import { User } from '../../types';

const propertySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    totalFloors: z.number().min(1, 'total floors should be more than 1'),
    address: z.string().min(1, 'Address is required'),
});

export async function addNewProperty(req: Request, res: Response) {
    try {
        const user = (await getUserFromToken(req)) as User;
        propertySchema.parse(req.body);
        const { address, name, totalFloors } = req.body as z.infer<
            typeof propertySchema
        >;
        const property = await prismaClient.property.create({
            data: { address, name, totalFloors, ownerId: user.id },
        });
        return res.json({ errorMessage: null, data: { property } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                errorMessage: error.issues[0].message,
                data: null,
            });
        } else
            res.status(500).json({
                errorMessage: 'Error occurred while creating a new property',
                data: null,
            });
    }
}
