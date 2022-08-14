import {
    Inject,
    Injectable,
    Scope,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { NewPropertyDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class PropertyService {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
        @Inject(REQUEST) private readonly request: Request
    ) {}

    async upsertProperty(propertyDetails: NewPropertyDto) {
        const user = await this.authService.getUserFromToken(this.request);
        const { address, name, totalFloors } = propertyDetails;
        const property = await this.prisma.property.create({
            data: { address, name, totalFloors, ownerId: user.id },
        });
        return { data: { property }, errorMessage: null };
    }

    async getAllProperties(userId: number) {
        const allProperties = await this.prisma.property.findMany({
            where: { ownerId: userId },
            include: { spaces: { include: { tenants: true } } },
        });
        return allProperties.map(({ spaces, ...rest }) => {
            const totalTenants = spaces.reduce((prev, current) => {
                return prev + current.tenants.length;
            }, 0);
            const totalSpaces = spaces.length;
            return { ...rest, totalTenants, totalSpaces };
        });
    }

    async getSingleProperty(propertyId: number) {
        const { spaces, ...rest } = await this.prisma.property.findUnique({
            where: { id: propertyId },
            include: { spaces: { include: { tenants: true } } },
        });
        const totalTenants = spaces.reduce((prev, current) => {
            return prev + current.tenants.length;
        }, 0);
        return { ...rest, totalTenants, totalSpaces: spaces.length };
    }

    async hasAccessOnProperty(userId: number, propertyId: number) {
        const property = await this.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (property.ownerId !== userId)
            throw new UnauthorizedException({
                data: null,
                errorMessage: 'unauthorized!',
            });
    }

    async getProperty(propertyId?: number) {
        const user = await this.authService.getUserFromToken(this.request);
        if (!!propertyId) {
            await this.hasAccessOnProperty(user.id, propertyId);
            const property = await this.getSingleProperty(propertyId);
            return { data: { property }, errorMessage: null };
        } else {
            const properties = await this.getAllProperties(user.id);
            return { data: { properties }, errorMessage: null };
        }
    }
}
