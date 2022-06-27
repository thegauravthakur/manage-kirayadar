import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { sendEmail } from './send';

export async function generateOTP(req: Request, res: Response) {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const entry = await prismaClient.otp.create({ data: { otp, email } });
    await sendEmail({ otp: entry.otp, to: email });
    res.json({ errorMessage: null, data: null });
}
