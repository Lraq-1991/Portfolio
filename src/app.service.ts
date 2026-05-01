import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const greeting = "Hi Mai!<br><br>What are you doing?"
    return 'Hello World!';
  }
}
