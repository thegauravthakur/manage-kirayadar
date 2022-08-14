import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginUserDto, SendOtpDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { SendEmailDto } from '../email/dto';
import { addDays, addSeconds, differenceInSeconds, isFuture } from 'date-fns';
import { Response, Request } from 'express';
import { User } from '../shared/types';

@Injectable()
export class AuthService {
    constructor(
        private prismaClient: PrismaService,
        private config: ConfigService,
        private email: EmailService
    ) {}

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

    signToken(payload: User) {
        return jwt.sign(payload, this.config.get('TOKEN_SECRET'), {
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

    async login(
        userDetails: LoginUserDto,
        response: Response,
        shouldGenerateCookie: boolean
    ) {
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
        if (shouldGenerateCookie)
            response.cookie('access_token', access_token, {
                httpOnly: true,
                expires: addDays(Date.now(), 7),
            });
        return {
            data: { user: filteredUser, access_token },
            errorMessage: null,
        };
    }

    async logout(response: Response) {
        response.clearCookie('access_token');
        return { data: null, errorMessage: null };
    }

    async verifyToken(token: string): Promise<User | null> {
        try {
            return jwt.verify(token, this.config.get('TOKEN_SECRET'));
        } catch (error) {
            return null;
        }
    }

    /*
     * Returns the user present in cookie/bearer token
     */
    async getUserFromToken(request: Request) {
        const authHeader = request.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        const token = request.cookies['access_token'] ?? accessToken;
        if (!token)
            throw new UnauthorizedException({
                data: null,
                errorMessage: 'user not authorized',
            });
        return await this.verifyToken(token);
    }

    async validateToken(request: Request) {
        const user = this.getUserFromToken(request);
        return { data: { user }, errorMessage: null };
    }

    generateOtpTemplate(otp: number, to: string): SendEmailDto {
        return {
            from: '"People App" <no-reply@peopleApp.io>',
            to,
            html: `<b>${otp} is your OTP to log in to People Platform</b>`,
            text: `${otp} is your OTP to login to People App`,
            subject: 'Your OTP to login to People App',
        };
    }

    async checkIfPreviousOtpIsValid(email: string) {
        const otp = await this.prismaClient.otp.findUnique({
            where: { email },
        });
        if (otp) {
            if (isFuture(otp.expirationDate))
                throw new BadRequestException({
                    data: null,
                    errorMessage: `Please request new OTP after ${differenceInSeconds(
                        otp.expirationDate,
                        Date.now()
                    )} seconds`,
                });
        }
    }

    async sendOtp(config: SendOtpDto) {
        await this.checkIfPreviousOtpIsValid(config.to);
        // random six digit number
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expirationDate = addSeconds(Date.now(), 120);
        await this.prismaClient.otp.upsert({
            create: { otp, email: config.to, expirationDate },
            where: { email: config.to },
            update: { otp, expirationDate },
        });
        const template = this.generateOtpTemplate(otp, config.to);
        this.email.sendEmail(template);
        return { errorMessage: null, data: null };
    }
}
