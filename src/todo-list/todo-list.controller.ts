import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import {
  CreateTodoListDto,
  TodoListQueryParameterDto,
  UpdateTodoListDto,
} from './dto/todo-list.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTodoListRespone,
  DeleteTodoListRespone,
  GetAllTodoListResponse,
  GetSingleTodoListResponse,
  UpdateTodoListRespone,
} from './response/todo-list.response';

@ApiTags('Todo-List')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('todo-list')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Creates a new todo list',
    description: 'Creates a new todo list for a particular user',
  })
  @ApiCreatedResponse({
    type: () => CreateTodoListRespone,
  })
  async createTodo(
    @Req() req: Request,
    @Body() createTodoListDto: CreateTodoListDto,
  ) {
    return this.todoListService.createTodo(createTodoListDto, req.user);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all todo lists',
    description: 'Retrieves all todo lists for a particular user',
  })
  @ApiOkResponse({
    type: () => GetAllTodoListResponse,
  })
  async getAllTodos(
    @Req() req: Request,
    @Query() queryParamsDto: TodoListQueryParameterDto,
  ) {
    return this.todoListService.getAllTodos(req.user, queryParamsDto);
  }

  @Get(':todoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve a single todo list',
    description: 'Retrieve a single todo list by the todoId',
  })
  @ApiOkResponse({
    type: () => GetSingleTodoListResponse,
  })
  async getSingleTodo(
    @Req() req: Request,
    @Param('todoId', ParseUUIDPipe) todoId: string,
  ) {
    return this.todoListService.getSingleTodo(todoId, req.user);
  }

  @Patch(':todoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a todo list',
    description: 'Updates a todo list by todoId',
  })
  @ApiOkResponse({
    type: () => UpdateTodoListRespone,
  })
  async updateTodo(
    @Req() req: Request,
    @Param('todoId', ParseUUIDPipe) todoId: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
  ) {
    return this.todoListService.updateTodo(todoId, updateTodoListDto, req.user);
  }

  @Delete(':todoId')
  @ApiOperation({
    summary: 'Delete a todo list',
    description: 'Delete a todo list by todoId',
  })
  @ApiOkResponse({
    type: () => DeleteTodoListRespone,
  })
  async deleteTodo(
    @Req() req: Request,
    @Param('todoId', ParseUUIDPipe) todoId: string,
  ) {
    return this.todoListService.deleteTodo(todoId, req.user);
  }
}
