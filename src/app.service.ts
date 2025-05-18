import { Injectable } from '@nestjs/common';

/**
 * Main application service
 */
@Injectable()
export class AppService {
  /**
   * Returns a hello world message
   * @returns Object containing hello world message
   */
  getHello(): { Hello: string } {
    return { Hello: 'World' };
  }
}
