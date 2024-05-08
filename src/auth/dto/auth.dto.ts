import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({ description: 'Last Name', example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({ description: 'Email', example: 'JohnDoe@gmail.com' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Provide a valid Email' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'Password123#' })
  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
    message: `Password too weak. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
  })
  password: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Email', example: 'JohnDoe@gmail.com' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Provide a valid Email' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'Password123#' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
