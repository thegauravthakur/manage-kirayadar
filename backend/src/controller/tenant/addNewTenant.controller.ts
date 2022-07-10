import { Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';

const bodySchema = z.object({
    name: z.string().min(2, 'name should be at least two character long'),
    email: z.string().email('email is not in correct format'),
    spaceId: z.number(),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function addNewTenant(request: Request, response: Response) {
    bodySchema.parse(request.body);
    const { name, email, spaceId } = request.body as unknown as BodySchema;
    const tenant = await prismaClient.tenant.create({
        data: { name, email, spaceId },
    });
    // todo: add error handling
    return response.json({ errorMessage: null, data: { tenant } });
}
