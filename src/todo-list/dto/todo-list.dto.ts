import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoListDto {
  @ApiProperty({ description: 'todo list name', example: 'My First Todo' })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'provide a todo name' })
  name: string;
}

export class UpdateTodoListDto {
  @ApiProperty({ description: 'todo list name', example: 'My First Todo' })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'provide a todo name' })
  name: string;
}

export class TodoListQueryParameterDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  limit: number;

  @ApiProperty({
    type: String,
    required: false,
    enum: ['createdAt', 'updatedAt', 'name'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'name'])
  sortBy: string;

  @ApiProperty({
    type: String,
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  search: string;
}
