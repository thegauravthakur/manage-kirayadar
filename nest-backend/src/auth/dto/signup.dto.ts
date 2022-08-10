import { IsEmail, Length } from 'class-validator';

export class SignupDto {
    @Length(1)
    name: string;

    @IsEmail()
    email: string;

    @Length(5)
    password: string;

    @Length(6)
    otp: string;
}
