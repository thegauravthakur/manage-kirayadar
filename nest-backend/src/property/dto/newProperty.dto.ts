import { IsNumber, IsString, Length, Min } from 'class-validator';

export class NewPropertyDto {
    @Length(1)
    @IsString()
    name: string;

    @Min(1)
    @IsNumber()
    totalFloors: number;

    @Length(1)
    @IsString()
    address: string;
}
