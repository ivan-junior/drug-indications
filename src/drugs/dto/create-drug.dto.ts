import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDrugDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  dailyMedUrl?: string;
}
