import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serverCheck() {
    return {
      message: 'server is up and running',
      status: HttpStatus.OK,
    };
  }
}
