import { Injectable } from '@nestjs/common';
import { PORT } from '@common/constants/common.constant';

@Injectable()
export class AppService {
  getData(): { message: string } {
    console.log(`API is running on port ${PORT}`);
    return { message: 'Hello API' };
  }
}
