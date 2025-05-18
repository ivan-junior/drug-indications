import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

/**
 * Service responsible for mapping medical conditions to ICD-10 codes using OpenAI's GPT
 */
@Injectable()
export class MappingService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(MappingService.name);

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  /**
   * Maps a medical condition to its corresponding ICD-10 code using GPT
   * @param condition - The medical condition to be mapped
   * @returns Promise containing the ICD-10 code and its description
   * @throws {Error} When GPT response cannot be parsed as valid JSON
   */
  async mapToICD10(
    condition: string,
  ): Promise<{ code: string; description: string }> {
    this.logger.log(`Mapping condition: ${condition}`);

    const prompt = `
You are a medical coding assistant. Given the following medical condition, respond with the most appropriate ICD-10 code and its full description.
Condition: "${condition}"
Respond in JSON format with keys: code, description.
Example:
{ "code": "J32.9", "description": "Chronic sinusitis, unspecified" }
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    });

    const text = response.choices[0].message?.content || '';

    try {
      return JSON.parse(text);
    } catch (err) {
      this.logger.error('Failed to parse GPT response:', text);
      throw new Error('Invalid GPT response');
    }
  }
}
