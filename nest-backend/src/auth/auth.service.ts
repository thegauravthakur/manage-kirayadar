import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto';

// const { name, password, email, otp } = req.body as UserSchema;
// if (email !== 'gthakur581@gmail.com')
//     return res.status(400).json({
//         errorMessage:
//             'sorry, this product is in preview currently, stay tuned!',
//         data: null,
//     });
// const otpEntry = await prismaClient.otp.findUnique({
//     where: { email },
// });
// if (otpEntry?.otp !== Number(otp))
//     return res
//         .status(400)
//         .json({ errorMessage: 'wrong OTP', data: null });
//
// const doesUserExists = await prismaClient.user.findUnique({
//     where: { email },
// });
// if (doesUserExists)
//     return res.status(400).json({
//         errorMessage: 'user already exists!',
//         data: null,
//     });
//
// const passwordHash = await generateHash(password);
// const user = await prismaClient.user.create({
//     data: { name, email, password: { create: { hash: passwordHash } } },
// });
// return res.json({ errorMessage: null, data: { user } });

@Injectable()
export class AuthService {
    constructor(private prismaClient: PrismaService) {}

    async signup(userDetails: SignupDto) {
        const { name, otp, password, email } = userDetails;
        if (email !== 'gthakur581@gmail.com') throw new HttpException('', 401);
        return 'signup';
    }
}
