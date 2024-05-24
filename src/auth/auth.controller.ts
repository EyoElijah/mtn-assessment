import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LogoutResponse, RegisterResponse } from './response/auth.response';
import { User } from '../entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Registers a new user',
    description: 'Regoisters a new user',
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: () => RegisterResponse,
  })
  @ApiBadRequestResponse({ description: 'User registeration failed' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'login a user',
    description: 'login a user',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'logout a user',
    description: 'logout a user',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: () => LogoutResponse,
  })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    return this.authService.logout(req.user);
  }
}
