import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgramsService } from './programs.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('programs')
@ApiTags('Programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get(':programId')
  @ApiOperation({
    summary: 'Get program by ID',
    description: 'Retrieve a specific program and its details by program ID',
  })
  async getProgram(@Param('programId') programId: string) {
    return this.programsService.getProgram(programId);
  }
}
