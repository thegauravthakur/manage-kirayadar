import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { EmailModule } from './email/email.module';

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        EmailModule,
        PropertyModule,
    ],
})
export class AppModule {}
