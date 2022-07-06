import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';

const propertySchema = z.object({
    propertyId: z.number(),
    floor: z.number().min(1, 'total floors should be more than 1'),
    name: z.string().min(1, 'Name is required'),
});

export async function addNewSpace(req: Request, res: Response) {
    try {
        propertySchema.parse(req.body);
        const { propertyId, name, floor } = req.body as z.infer<
            typeof propertySchema
        >;
        // add extra check to verify propertyId belongs to current user;
        const space = await prismaClient.space.create({
            data: { propertyId, name, floor },
        });
        return res.json({ errorMessage: null, data: { space } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                errorMessage: error.issues[0].message,
                data: null,
            });
        } else
            res.status(500).json({
                errorMessage: 'Error occurred while creating a new space',
                data: null,
            });
    }
}
