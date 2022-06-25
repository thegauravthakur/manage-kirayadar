import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

interface SendEmailProps {
    to: string;
    otp: number;
}

export async function sendEmail(req: Request, res: Response) {
    const { to, otp } = req.body as SendEmailProps;
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: '"Manage Kirayadar" <no-reply@managekirayadar.com>', // sender address
        to,
        subject: 'Your OTP to login to Manage Kirayadar', // Subject line
        text: `${otp} is your OTP to login to INDmoney`,
        html: `<b>${otp} is your OTP to login to INDmoney</b>`, // html body
    });

    res.send('email sent');
}
