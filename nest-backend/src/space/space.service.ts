import { Inject, Injectable, Scope } from '@nestjs/common';
import { NewSpaceDto } from './dto/newSpace.dto';
import { PropertyService } from '../property/property.service';
import { AuthService } from '../auth/auth.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class SpaceService {
    constructor(
        private propertyService: PropertyService,
        private authService: AuthService,
        @Inject(REQUEST) private readonly request: Request,
        private prisma: PrismaService
    ) {}

    async upsertSpace(spaceDetails: NewSpaceDto) {
        const { propertyId, name, floor, sharingType, spaceType, rent } =
            spaceDetails;
        const user = await this.authService.getUserFromToken(this.request);
        await this.propertyService.hasAccessOnProperty(user.id, propertyId);
        const space = await this.prisma.space.create({
            data: { propertyId, name, floor, rent, spaceType, sharingType },
        });
        return { data: { space }, errorMessage: null };
    }
}
