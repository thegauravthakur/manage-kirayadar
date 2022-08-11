import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from '../email/email.service';

@Module({
    providers: [AuthService, EmailService],
    controllers: [AuthController],
})
export class AuthModule {}
