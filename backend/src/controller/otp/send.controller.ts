import nodemailer from 'nodemailer';

interface SendEmailProps {
    to: string;
    otp: number;
}

export async function sendEmail({ otp, to }: SendEmailProps) {
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
        text: `${otp} is your OTP to login to Manage Kirayadar`,
        html: `<b>${otp} is your OTP to login to Manage Kirayadar</b>`, // html body
    });
}
