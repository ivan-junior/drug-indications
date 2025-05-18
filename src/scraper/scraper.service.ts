import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Service responsible for scraping drug information from DailyMed website
 */
@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private readonly url =
    'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=595f437d-2729-40bb-9c62-c8ece1f82780&audience=consumer';

  /**
   * Extracts drug indications from the DailyMed webpage
   * @returns Promise<string[]> Array of sentences describing drug indications
   * @throws {Error} When the "What is DUPIXENT?" section is not found
   */
  async extractIndications(): Promise<string[]> {
    this.logger.log(`Fetching page: ${this.url}`);
    const { data: html } = await axios.get(this.url);
    const $ = cheerio.load(html);

    // The "What is DUPIXENT?" section is inside a div with class .drug-info
    const rawText = $('.drug-info').text();
    const lower = rawText.toLowerCase();

    const startIdx = lower.indexOf('what is dupixent');
    if (startIdx === -1) {
      throw new Error('Section "What is DUPIXENT?" not found.');
    }

    // Get a text block from the desired section
    const snippet = rawText.slice(startIdx, startIdx + 2000); // 2000 chars after the start

    // Split into sentences and filter the most relevant ones
    const sentences = snippet
      .split(/[.\n]+/)
      .map((line) => line.trim())
      .filter(
        (line) => line.length > 20 && /is used|treats|indicated/i.test(line),
      );

    return sentences;
  }
}
