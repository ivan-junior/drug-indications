import { Controller, Get, UseGuards } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('scraper')
@ApiTags('Scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('indications')
  @ApiOperation({
    summary: 'Extract drug indications',
    description:
      'Scrape and extract medical indications from drug information webpage',
  })
  async getIndications() {
    return this.scraperService.extractIndications();
  }
}
