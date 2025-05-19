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
import { DrugsService } from './drugs.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('drugs')
@ApiTags('Drugs')
@ApiBearerAuth()
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new drug',
    description: 'Create a new drug entry in the system',
  })
  create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugsService.create(createDrugDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all drugs',
    description: 'Retrieve a list of all drugs in the system',
  })
  findAll() {
    return this.drugsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a drug by ID',
    description: 'Retrieve a specific drug by its ID',
  })
  findOne(@Param('id') id: string) {
    return this.drugsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a drug',
    description: 'Update a specific drug by its ID',
  })
  update(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto) {
    return this.drugsService.update(id, updateDrugDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a drug',
    description: 'Remove a specific drug from the system',
  })
  remove(@Param('id') id: string) {
    return this.drugsService.remove(id);
  }
}
