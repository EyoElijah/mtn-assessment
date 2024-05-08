import { ApiProperty } from '@nestjs/swagger';
import { Task, TaskStatus } from '../../entities/tasks.entity';
import { TodoList } from '../../entities/todo-list.entity';

export class TaskDetails {
  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
  })
  dueDate: string;

  @ApiProperty({
    type: TodoList,
  })
  todoList: TodoList;
}

export class CreateTaskResponse {
  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: TaskDetails,
  })
  task: TaskDetails;
}

export class GetAllTasksResponse {
  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: [Task],
  })
  tasks: Task[];

  @ApiProperty({
    type: Number,
  })
  page: number;

  @ApiProperty({
    type: Number,
  })
  limit: number;

  @ApiProperty({
    type: Number,
  })
  total: number;
}

export class GetTaskResponse {
  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: Task,
  })
  task: Task;

  @ApiProperty({
    type: String,
  })
  statusColor: string;
}

export class UpdateTaskResponse {
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
    description: 'The status of the task',
    enum: TaskStatus,
  })
  status: TaskStatus;

  @ApiProperty({
    type: TaskDetails,
  })
  task: TaskDetails;
}

export class DeleteTaskResponse {
  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    type: Boolean,
  })
  success: boolean;
}
