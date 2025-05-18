import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private readonly url =
    'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=595f437d-2729-40bb-9c62-c8ece1f82780&audience=consumer';

  async extractIndications(): Promise<string[]> {
    this.logger.log(`Fetching page: ${this.url}`);
    const { data: html } = await axios.get(this.url);
    const $ = cheerio.load(html);

    // A seção "What is DUPIXENT?" fica dentro de um div com class .drug-info
    const rawText = $('.drug-info').text();
    const lower = rawText.toLowerCase();

    const startIdx = lower.indexOf('what is dupixent');
    if (startIdx === -1) {
      throw new Error('Section "What is DUPIXENT?" not found.');
    }

    // Pegamos um bloco de texto a partir da seção desejada
    const snippet = rawText.slice(startIdx, startIdx + 2000); // 2000 chars após o início

    // Divide em frases e filtra as mais relevantes
    const sentences = snippet
      .split(/[.\n]+/)
      .map((line) => line.trim())
      .filter(
        (line) => line.length > 20 && /is used|treats|indicated/i.test(line),
      );

    return sentences;
  }
}
