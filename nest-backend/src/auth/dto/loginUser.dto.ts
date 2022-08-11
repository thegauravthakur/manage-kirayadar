import { IsEmail, Length } from 'class-validator';

const message = 'wrong combination of email/password';
export class LoginUserDto {
    @IsEmail()
    email: string;

    @Length(5, 100, { message })
    password: string;
}
