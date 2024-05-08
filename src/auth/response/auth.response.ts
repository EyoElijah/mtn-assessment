import { ApiProperty } from '@nestjs/swagger';

export class RegisterRespone {
  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: String,
  })
  accessToken: string;
  @ApiProperty({
    type: String,
  })
  refreshToken: string;
}

export class LogoutRespone {
  @ApiProperty({
    type: String,
  })
  message: string;
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;
}
