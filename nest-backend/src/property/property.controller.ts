import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PropertyService } from './property.service';
import { NewPropertyDto } from './dto';

@Controller('property')
export class PropertyController {
    constructor(private propertyService: PropertyService) {}

    @Post('upsert')
    upsertProperty(@Body() propertyDetails: NewPropertyDto) {
        return this.propertyService.upsertProperty(propertyDetails);
    }

    @Get()
    getProperty(@Query('propertyId') propertyId: number) {
        return this.propertyService.getProperty(Number(propertyId));
    }
}
