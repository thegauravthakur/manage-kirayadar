import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService, private config: ConfigService) {}

    @Post('/signup')
    signup(@Body() body: SignupDto) {
        console.log(this.config.get('TOKEN_SECRET'));
        return this.auth.signup(body);
    }
}
