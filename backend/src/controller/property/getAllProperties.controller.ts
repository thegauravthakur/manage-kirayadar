import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';

export async function getAllProperties(req: Request, res: Response) {
    try {
        const properties = await prismaClient.property.findMany();
        return res.json({ errorMessage: null, data: { properties } });
    } catch (error) {
        res.status(500).json({
            errorMessage: 'Error occurred while fetching all properties',
            data: null,
        });
    }
}
