import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';

function getExceptionFactory(error: ValidationError[]) {
    return new BadRequestException({
        errorMessage: Object.values(error.at(0).constraints).at(0),
        data: null,
    });
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            exceptionFactory: getExceptionFactory,
        })
    );
    await app.listen(3000);
}
bootstrap();
