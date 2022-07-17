import type { Request, Response } from 'express';
export async function getAllDocuments(req: Request, res: Response) {
    res.send('okay');
}
