import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { SendOtpDto } from './dto';
import { Response } from 'express';

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
        @Res({ passthrough: true }) response: Response,
        @Query('shouldGenerateCookie') shouldGenerateCookie: boolean
    ) {
        return this.auth.login(userDetails, response, shouldGenerateCookie);
    }

    @Post('/sendOtp')
    sendOtp(@Body() otpDetails: SendOtpDto) {
        return this.auth.sendOtp(otpDetails);
    }
}
