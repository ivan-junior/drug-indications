import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('mapping')
@ApiTags('Mapping')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}

  @Post()
  async mapCondition(@Body('condition') condition: string) {
    return this.mappingService.mapToICD10(condition);
  }
}
