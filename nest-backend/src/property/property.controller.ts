import { Body, Controller, Post, Req } from '@nestjs/common';
import { PropertyService } from './property.service';
import { NewPropertyDto } from './dto';
import { Request } from 'express';

@Controller('property')
export class PropertyController {
    constructor(private propertyService: PropertyService) {}

    @Post('upsert')
    upsertProperty(
        @Body() propertyDetails: NewPropertyDto,
        @Req() request: Request
    ) {
        return this.propertyService.upsertProperty(request, propertyDetails);
    }
}
