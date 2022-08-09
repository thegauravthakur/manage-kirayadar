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
        const hasAccess = await checkIfAccessOnSpace(request, spaceId);
        if (!hasAccess)
            return response
                .status(401)
                .json({ errorMessage: 'unauthorized!', data: null });
        const space = await prismaClient.space.findUnique({
            where: { id: spaceId },
            include: { tenants: true },
        });
        if (space && space.tenants.length === space.sharingType) {
            if (space.sharingType === 10)
                return response.status(401).json({
                    errorMessage: 'maximum share type can by only ten sharing',
                    data: null,
                });
            await prismaClient.space.update({
                where: { id: space.id },
                data: { sharingType: space.sharingType + 1 },
            });
        }
        const tenant = await prismaClient.tenant.create({
            data: { name, email, spaceId },
        });
        return response.json({ errorMessage: null, data: { tenant } });
    } catch (error) {
        const message = 'Error occurred while creating a new tenant';
        sendError(response, error, message);
    }
}

export async function checkIfAccessOnSpace(req: Request, spaceId: number) {
    const user = getUserFromToken(req);
    const space = await prismaClient.space.findUnique({
        where: { id: spaceId },
        include: { property: true },
    });
    return space?.property.ownerId === user?.id;
}
