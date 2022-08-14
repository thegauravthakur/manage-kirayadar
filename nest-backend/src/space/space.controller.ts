import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SpaceService } from './space.service';
import { NewSpaceDto } from './dto/newSpace.dto';

@Controller('space')
export class SpaceController {
    constructor(private spaceService: SpaceService) {}

    @Post('upsert')
    upsertSpace(@Body() spaceDetails: NewSpaceDto) {
        return '';
    }

    @Get()
    getSpace(@Query('spaceId') spaceId: number) {
        return '';
    }
}
