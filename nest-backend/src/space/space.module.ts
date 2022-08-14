import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { PropertyModule } from '../property/property.module';
import { AuthService } from '../auth/auth.service';

@Module({
    controllers: [SpaceController],
    providers: [SpaceService, AuthService],
    imports: [PropertyModule],
})
export class SpaceModule {}
