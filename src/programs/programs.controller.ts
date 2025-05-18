import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgramsService } from './programs.service';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('programs')
@ApiTags('Programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get(':programId')
  async getProgram(@Param('programId') programId: string) {
    return this.programsService.getProgram(programId);
  }
}
