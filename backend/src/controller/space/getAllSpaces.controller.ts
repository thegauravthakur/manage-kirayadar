import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';

const propertySchema = z.object({
    propertyId: z.number(),
});

export async function getAllSpaces(req: Request, res: Response) {
    try {
        propertySchema.parse(req.body);
        const { propertyId } = req.body as z.infer<typeof propertySchema>;
        // add extra check to verify propertyId belongs to current user;
        const spaces = await prismaClient.space.findMany({
            where: { propertyId },
        });
        return res.json({ errorMessage: null, data: { spaces } });
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
