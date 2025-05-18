import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { IndicationsModule } from 'src/indications/indications.module';
import { DrugsModule } from 'src/drugs/drugs.module';

@Module({
  imports: [DrugsModule, IndicationsModule],
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
