import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IndicationsService } from './indications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateIndicationDto } from './dto/create-indication.dto';
import { UpdateIndicationDto } from './dto/update-indication.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('indications')
@ApiTags('Indications')
export class IndicationsController {
  constructor(private readonly indicationsService: IndicationsService) {}

  @Post()
  create(@Body() dto: CreateIndicationDto) {
    return this.indicationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.indicationsService.findAll();
  }

  @Get('drug/:drugId')
  findByDrug(@Param('drugId') drugId: string) {
    return this.indicationsService.findByDrug(drugId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.indicationsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIndicationDto) {
    return this.indicationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.indicationsService.remove(id);
  }

  @Post('generate-from-scraper/:drugId')
  async generateFromScraper(@Param('drugId') drugId: string) {
    return this.indicationsService.generateFromScraper(drugId);
  }
}
