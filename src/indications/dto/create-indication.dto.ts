import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIndicationDto {
  @IsMongoId()
  @ApiProperty()
  drug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  condition: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  icd10Code?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  icd10Description?: string;

  @IsOptional()
  @ApiProperty()
  unmapped?: boolean;
}
