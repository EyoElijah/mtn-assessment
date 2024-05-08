import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

declare module 'express' {
  interface Request {
    user: User;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // extract the http request header
    const jwtToken = this.extractTokenFromHeader(request); // extract the jsonwebtoken from the request object extracted above

    if (!jwtToken) {
      throw new HttpException(
        'missing or invalid authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const payload = (await this.jwtService.verifyAsync(jwtToken, {
        secret: this.configService.get('JWT_SECRET'),
      })) as { id: string; type: string };

      const user = await this.userRepo.findOneOrFail({
        where: { id: payload.id },
      });

      request['user'] = user; // add the user object to the request object
    } catch {
      throw new HttpException(
        'missing or expired authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  /**
   * @function extractTokenFromHeader
   * @description this funtion extracts the token from the header and returns undefined if not present
   * @param request - http Request object
   * @returns jwtToken or undefined
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, jwtToken] = request.headers.authorization?.split(' ') ?? [];

    const JWT_PREFIX = 'Bearer';
    return type === JWT_PREFIX ? jwtToken : undefined;
  }
}
