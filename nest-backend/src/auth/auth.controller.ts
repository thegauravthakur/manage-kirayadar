import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { SendOtpDto } from './dto';
import { Request, Response } from 'express';

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

    @Get('/validate')
    validate(@Req() request: Request) {
        return this.auth.validateToken(request);
    }

    @Get('/logout')
    logout(@Res({ passthrough: true }) response: Response) {
        return this.auth.logout(response);
    }

    @Post('/sendOtp')
    sendOtp(@Body() otpDetails: SendOtpDto) {
        return this.auth.sendOtp(otpDetails);
    }
}
