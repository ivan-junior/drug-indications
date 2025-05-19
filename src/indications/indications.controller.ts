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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('indications')
@ApiTags('Indications')
export class IndicationsController {
  constructor(private readonly indicationsService: IndicationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new indication',
    description: 'Create a new medical indication for a drug',
  })
  create(@Body() dto: CreateIndicationDto) {
    return this.indicationsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all indications',
    description: 'Retrieve a list of all medical indications',
  })
  findAll() {
    return this.indicationsService.findAll();
  }

  @Get('drug/:drugId')
  @ApiOperation({
    summary: 'Get indications by drug',
    description: 'Retrieve all medical indications for a specific drug',
  })
  findByDrug(@Param('drugId') drugId: string) {
    return this.indicationsService.findByDrug(drugId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get indication by ID',
    description: 'Retrieve a specific medical indication by its ID',
  })
  findOne(@Param('id') id: string) {
    return this.indicationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an indication',
    description: 'Update a specific medical indication by its ID',
  })
  update(@Param('id') id: string, @Body() dto: UpdateIndicationDto) {
    return this.indicationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an indication',
    description: 'Remove a specific medical indication from the system',
  })
  remove(@Param('id') id: string) {
    return this.indicationsService.remove(id);
  }

  @Post('generate-from-scraper/:drugId')
  @ApiOperation({
    summary: 'Generate indications from scraper',
    description:
      'Automatically generate indications for a drug by scraping its information',
  })
  async generateFromScraper(@Param('drugId') drugId: string) {
    return this.indicationsService.generateFromScraper(drugId);
  }
}
