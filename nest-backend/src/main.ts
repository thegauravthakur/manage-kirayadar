import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

function getExceptionFactory(error: ValidationError[]) {
    return new BadRequestException({
        errorMessage: Object.values(error.at(0).constraints).at(0),
        data: null,
    });
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            exceptionFactory: getExceptionFactory,
        })
    );
    await app.listen(8080);
}
bootstrap();
