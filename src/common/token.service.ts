import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @method generateToken
   * @description - this method generates a token for a user with the user id
   * @param id
   * @returns {accessToken refreshToken}
   */
  public generateToken(id: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtService.sign(
      {
        id,
        type: 'ACCESS_TOKEN',
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        id,
        type: 'REFRESH_TOKEN',
      },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'REFRESH_TOKEN_EXPIRATION_TIME',
        ),
      },
    );

    return { accessToken, refreshToken };
  }
}
