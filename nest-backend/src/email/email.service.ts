import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(private config: ConfigService) {}
    transporter = nodemailer.createTransport({
        host: this.config.get('SMTP_HOST'),
        port: 587,
        secure: false,
        auth: {
            user: this.config.get('SMTP_USER'),
            pass: this.config.get('SMTP_PASS'),
        },
    });

    sendEmail(config: {
        from: string;
        to: string;
        subject: string;
        text: string;
        html: string;
    }) {
        const { to, html, text, subject, from } = config;
        this.transporter.sendMail({ from, to, subject, text, html });
    }
}
