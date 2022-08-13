import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
    @Length(1)
    name: string;

    @IsEmail()
    email: string;

    @Length(5, 50, { message: 'Password should be at least 5 character long' })
    password: string;

    @Length(6, 6, { message: 'OTP should be six character long' })
    otp: string;
}
