import {
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../../entities/tasks.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'todo id',
    example: 'a7228feb-c0e6-4001-a98c-18b3a18338fe',
  })
  @IsUUID(4, { message: 'todoId must be a valid UUID' })
  todoId: string;

  @ApiProperty({
    description: 'description',
    example: 'Daily coding at 6pm',
  })
  @IsString({ message: 'description must be a string' })
  description: string;

  @ApiProperty({
    description: 'due date',
    example: '2024-12-31',
  })
  @IsDateString(
    { strict: true },
    { message: 'Date must be in the format YYYY-MM-DD e.g 2024-12-31' },
  )
  dueDate: string;
}

export class UpdateTaskDto {
  @ApiProperty({
    description: 'todo id',
    example: 'a7228feb-c0e6-4001-a98c-18b3a18338fe',
  })
  @IsUUID(4, { message: 'todoId must be a valid UUID' })
  todoId: string;

  @ApiProperty({
    description: 'description',
    example: 'Daily coding at 9pm',
  })
  @IsString({ message: 'description must be a string' })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'due date',
    example: '2024-12-31',
  })
  @IsDateString(
    { strict: true },
    { message: 'Date must be in the format YYYY-MM-DD e.g 2024-12-31' },
  )
  @IsOptional()
  dueDate: string;

  @ApiProperty({
    description: 'status',
    example: 'completed',
    enum: ['pending', 'completed'],
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}

export class TaskQueryParameterDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    type: String,
    required: false,
    enum: ['createdAt', 'updatedAt', 'status', 'statusColor'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'status', 'statusColor'])
  sortBy?: string;

  @ApiProperty({
    type: String,
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  search?: string;
}
