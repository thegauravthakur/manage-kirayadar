import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

    async compareHash(password: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    signToken(payload: any) {
        return jwt.sign(payload, process.env.TOKEN_SECRET!, {
            expiresIn: '7 days',
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

    async fetchUser(email: string) {
        const user = await this.prismaClient.user.findUnique({
            where: { email },
            include: { password: true },
        });
        if (!user)
            throw new BadRequestException({
                errorMessage: 'wrong combination of email/password',
                data: null,
            });
        return user;
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

    async login(userDetails: LoginUserDto) {
        const { password, email } = userDetails;
        const user = await this.fetchUser(email);
        const isCorrectPassword = await this.compareHash(
            password,
            user.password?.hash ?? ''
        );
        if (!isCorrectPassword)
            throw new BadRequestException({
                errorMessage: 'wrong combination of email/password',
                data: null,
            });
        const { password: pass, ...filteredUser } = user;
        const access_token = this.signToken(filteredUser);
        return {
            data: { user: filteredUser, access_token },
            errorMessage: null,
        };
    }
}
