import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('/signup')
    signup(@Body() userDetails: CreateUserDto) {
        return this.auth.signup(userDetails);
    }
}
