import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Indication, IndicationSchema } from './indications.schema';
import { IndicationsController } from './indications.controller';
import { IndicationsService } from './indications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Indication.name, schema: IndicationSchema },
    ]),
  ],
  controllers: [IndicationsController],
  providers: [IndicationsService],
  exports: [IndicationsService],
})
export class IndicationsModule {}
