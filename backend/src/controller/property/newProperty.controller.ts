import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';

const propertySchema = z.object({
    ownerId: z.number({ required_error: 'Owner Id is required' }),
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
});

export async function addNewProperty(req: Request, res: Response) {
    try {
        console.log({ body: req.body });
        propertySchema.parse(req.body);
        const { ownerId, address, name } = req.body as z.infer<
            typeof propertySchema
        >;
        const property = await prismaClient.property.create({
            data: { ownerId, address, name },
        });
        res.json({ errorMessage: null, data: { property } });
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
