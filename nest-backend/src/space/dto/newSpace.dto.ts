import { IsIn, IsNumber, IsString, Max, Min } from 'class-validator';

const SpaceType = [
    'room',
    'one_Rk',
    'two_RK',
    'one_BHK',
    'two_BHK',
    'three_BHK',
    'four_BHK',
    'five_BHK',
] as const;

export class NewSpaceDto {
    @IsNumber()
    propertyId: number;

    @IsNumber()
    floor: number;

    @IsString()
    name: string;

    @IsIn(SpaceType, { message: 'Please select correct space type' })
    spaceType: typeof SpaceType[number];

    @Min(1)
    @IsNumber()
    rent: number;

    @Max(10)
    @Min(1)
    @IsNumber()
    sharingType: number;
}
