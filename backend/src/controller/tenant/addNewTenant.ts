import { Response, Request } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';
import { sendError } from '../../utils/shared';
import { getUserFromToken } from '../../middleware/protected';

const bodySchema = z.object({
    name: z.string().min(2, 'name should be at least two character long'),
    email: z.string().email('email is not in correct format'),
    spaceId: z.number(),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function addNewTenant(request: Request, response: Response) {
    try {
        bodySchema.parse(request.body);
        const { name, email, spaceId } = request.body as unknown as BodySchema;
        const hasAccess = checkIfAccessOnSpace(request, Number(spaceId));
        if (!hasAccess) return response.status(401).json('unauthorized!');
        const tenant = await prismaClient.tenant.create({
            data: { name, email, spaceId },
        });
        return response.json({ errorMessage: null, data: { tenant } });
    } catch (error) {
        const message = 'Error occurred while creating a new tenant';
        sendError(response, error, message);
    }
}

async function checkIfAccessOnSpace(req: Request, spaceId: number) {
    const user = getUserFromToken(req);
    const space = await prismaClient.space.findUnique({
        where: { id: spaceId },
        include: { property: true },
    });
    return space?.property.ownerId === user?.id;
}
