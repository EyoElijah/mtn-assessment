import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from '../common/token.service';
import { comparePassword, encryptPassword } from '../common/helper';
import Logger from '../common/logger';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * @method register
   * @description this method registers a new user with the RegisterUserDto
   * @param registerUserDto
   * @returns {Promise<{ message: string, success: boolean, accessToken:string, refreshToken: string }>}
   */
  async register(registerUserDto: RegisterDto): Promise<{
    message: string;
    success: boolean;
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const { email, firstName, lastName, password } = registerUserDto;

      const isEmailExit = await this.isEmailExit(email);
      if (isEmailExit) {
        throw new HttpException('Email already exist', HttpStatus.CONFLICT);
      }

      const hashedPassword = encryptPassword(password);

      const user = this.userRepository.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      const { accessToken, refreshToken } = this.tokenService.generateToken(
        user.id,
      );

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;

      await this.userRepository.save(user);

      return {
        message: 'Account created successfully',
        success: true,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      Logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error registering user');
    }
  }

  /**
   * @method login
   * @description this method logs in a user with the email and password
   * @param loginUserDto
   * @returns {Promise<{ message: string, success: boolean, user:User }>}
   */
  async login(loginUserDto: LoginDto): Promise<{
    message: string;
    success: boolean;
    user: User;
  }> {
    try {
      const { email, password } = loginUserDto;

      const isEmailExit = await this.isEmailExit(email);

      if (!isEmailExit) {
        throw new HttpException(
          'Incorrect email/password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userRepository.findOneBy({ email });

      const isPasswordValid = comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new HttpException(
          'Incorrect email/password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { accessToken, refreshToken } = this.tokenService.generateToken(
        user.id,
      );

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;

      await this.userRepository.save(user);

      // remove the password from the user object
      delete user.password;

      return {
        message: 'Account login successful',
        success: true,
        user,
      };
    } catch (error) {
      Logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error logging user');
    }
  }

  /**
   * @method logout
   * @description this method logs out a user
   * @param user
   * @returns {Promise<{ message: string, success: boolean }>} A Promise resolving to an object containing a message and a success flag.
   */
  async logout(user: User): Promise<{ message: string; success: boolean }> {
    try {
      await this.userRepository.save(
        Object.assign(user, { accessToken: '', refreshToken: '' }),
      );
      return {
        message: 'Account logout successful',
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException('logout error');
    }
  }

  /**
   * @method isEmailExit -
   * @description  this method checks if an email akready exist in the database
   * @param email
   * @returns {boolean}
   */
  private async isEmailExit(email: string): Promise<boolean> {
    try {
      const foundRecord = await this.userRepository.findOne({
        where: { email },
      });

      if (foundRecord) return !!foundRecord;

      return false;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
