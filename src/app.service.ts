import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { Hello: string } {
    return { Hello: 'World' };
  }
}
