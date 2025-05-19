import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('mapping')
@ApiTags('Mapping')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}

  @Post()
  @ApiOperation({
    summary: 'Map medical condition to ICD-10',
    description:
      'Convert a medical condition text to its corresponding ICD-10 code using AI',
  })
  async mapCondition(@Body('condition') condition: string) {
    return this.mappingService.mapToICD10(condition);
  }
}
