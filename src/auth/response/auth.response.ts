import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
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

export class LogoutResponse {
  @ApiProperty({
    type: String,
  })
  message: string;
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;
}
