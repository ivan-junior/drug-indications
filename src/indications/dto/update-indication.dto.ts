import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateIndicationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  condition?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  icd10Code?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  icd10Description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  unmapped?: boolean;
}
