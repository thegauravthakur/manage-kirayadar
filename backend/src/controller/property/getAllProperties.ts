import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { sendError } from '../../utils/shared';
import { getUserFromToken } from '../../middleware/protected';

export async function getAllProperties(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req)!;
        const allProperties = await prismaClient.property.findMany({
            where: { ownerId: user.id },
            include: { spaces: { include: { tenants: true } } },
        });
        const properties = allProperties.map(({ spaces, ...rest }) => {
            const totalTenants = spaces.reduce((prev, current) => {
                return prev + current.tenants.length;
            }, 0);
            return { ...rest, totalTenants };
        });
        return res.json({ errorMessage: null, data: { properties } });
    } catch (error) {
        const message = 'An error occurred while fetching all properties';
        sendError(res, error, message);
    }
}
