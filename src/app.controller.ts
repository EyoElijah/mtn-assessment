import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

export class serverCheckRespone {
  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    type: Number,
  })
  status: number;
}

@ApiTags('Server Test')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiOperation({
    summary: 'check if the server is running',
    description: 'check if the server is running',
  })
  @ApiOkResponse({
    type: () => serverCheckRespone,
  })
  serverCheck() {
    return this.appService.serverCheck();
  }
}
