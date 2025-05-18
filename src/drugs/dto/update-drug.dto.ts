import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDrugDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  dailyMedUrl?: string;
}
