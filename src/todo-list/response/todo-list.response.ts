import { ApiProperty } from '@nestjs/swagger';
import { TodoList } from '../../entities/todo-list.entity';

export class CreateTodoListRespone {
  @ApiProperty({
    type: String,
  })
  message: string;
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: TodoList,
  })
  todo: TodoList;
}

export class GetAllTodoListResponse {
  @ApiProperty({
    type: String,
  })
  message: string;
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: [TodoList],
  })
  todos: TodoList[];

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

export class GetSingleTodoListResponse {
  @ApiProperty({
    type: String,
  })
  message: string;
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: TodoList,
  })
  todos: TodoList;
}

export class UpdateTodoListRespone {
  @ApiProperty({
    type: String,
  })
  message: string;
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: TodoList,
  })
  todo: TodoList;
}

export class DeleteTodoListRespone {
  @ApiProperty({
    type: String,
  })
  message: string;
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;
}
