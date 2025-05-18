import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Indication, IndicationSchema } from './indications.schema';
import { IndicationsController } from './indications.controller';
import { IndicationsService } from './indications.service';
import { DrugsModule } from 'src/drugs/drugs.module';
import { MappingModule } from 'src/mapping/mapping.module';
import { ScraperModule } from 'src/scraper/scraper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Indication.name, schema: IndicationSchema },
    ]),
    DrugsModule,
    ScraperModule,
    MappingModule,
  ],
  controllers: [IndicationsController],
  providers: [IndicationsService],
  exports: [IndicationsService],
})
export class IndicationsModule {}
