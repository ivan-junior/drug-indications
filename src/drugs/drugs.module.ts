import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Drug, DrugSchema } from './drugs.schema';
import { DrugsController } from './drugs.controller';
import { DrugsService } from './drugs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drug.name, schema: DrugSchema }]),
  ],
  controllers: [DrugsController],
  providers: [DrugsService],
  exports: [DrugsService],
})
export class DrugsModule {}
