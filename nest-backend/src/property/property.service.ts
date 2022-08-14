import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import { NewPropertyDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertyService {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService
    ) {}

    async upsertProperty(
        @Req() request: Request,
        propertyDetails: NewPropertyDto
    ) {
        const user = await this.authService.getUserFromToken(request);
        const { address, name, totalFloors } = propertyDetails;
        const property = await this.prisma.property.create({
            data: { address, name, totalFloors, ownerId: user.id },
        });
        return { data: { property }, errorMessage: null };
    }
}
