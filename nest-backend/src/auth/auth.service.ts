import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prismaClient: PrismaService) {}

    async generateHash(password: string): Promise<string> {
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) reject(err);
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) reject(err);
                    resolve(hash);
                });
            });
        });
    }

    checkIfEmailHasAccess(email: string) {
        const whitelist = ['gthakur581@gmail.com', 'rudra.kaniya.rk@gmail.com'];
        const msg = 'sorry, the product is not available for preview currently';
        if (!whitelist.includes(email))
            throw new BadRequestException({ errorMessage: msg, data: null });
    }

    async checkIfOTPIsCorrect(email: string, otp: string) {
        const otpEntry = await this.prismaClient.otp.findUnique({
            where: { email },
        });
        if (otpEntry?.otp !== Number(otp))
            throw new BadRequestException({
                errorMessage: 'wrong OTP',
                data: null,
            });
    }

    async checkIfUserAlreadyExists(email: string) {
        const doesUserExists = await this.prismaClient.user.findUnique({
            where: { email },
        });
        if (doesUserExists)
            throw new BadRequestException({
                errorMessage: 'user already exists!',
                data: null,
            });
    }

    async signup(userDetails: CreateUserDto) {
        const { name, otp, password, email } = userDetails;
        this.checkIfEmailHasAccess(email);
        await this.checkIfOTPIsCorrect(email, otp);
        await this.checkIfUserAlreadyExists(email);
        const passwordHash = await this.generateHash(password);
        const user = await this.prismaClient.user.create({
            data: { name, email, password: { create: { hash: passwordHash } } },
        });
        return { errorMessage: null, data: { user } };
    }
}
