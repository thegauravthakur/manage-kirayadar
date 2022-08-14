import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { AuthService } from '../auth/auth.service';

@Module({
    controllers: [PropertyController],
    providers: [PropertyService, AuthService],
})
export class PropertyModule {}
