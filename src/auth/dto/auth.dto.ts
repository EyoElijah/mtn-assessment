import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'provide a first name' })
  firstName: string;

  @ApiProperty({ description: 'Last Name', example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'provide a last name' })
  lastName: string;

  @ApiProperty({ description: 'Email', example: 'JohnDoe@gmail.com' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Provide a valid Email' })
  @IsNotEmpty({ message: 'provide an email' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'Password123#' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'provide a password' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
    message: `Password too weak. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
  })
  password: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Email', example: 'JohnDoe@gmail.com' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Provide a valid Email' })
  @IsNotEmpty({ message: 'provide an email' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'Password123#' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'provide a password' })
  password: string;
}
