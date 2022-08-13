import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('/signup')
    signup(@Body() userDetails: CreateUserDto) {
        return this.auth.signup(userDetails);
    }

    @Post('/login')
    login(
        @Body() userDetails: LoginUserDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.auth.login(userDetails, res);
    }

    @Post('/sendOtp')
    sendOtp() {
        return this.auth.sendOtp();
    }
}
