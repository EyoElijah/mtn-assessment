import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  Req,
  ParseUUIDPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  TaskQueryParameterDto,
  UpdateTaskDto,
} from './dto/task.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  GetAllTasksResponse,
  GetTaskResponse,
  UpdateTaskResponse,
} from './response/tasks.response';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  @ApiOperation({
    summary: 'Creates a new task',
    description: 'Creates a new task for a specific todo list',
  })
  @ApiOkResponse({
    type: () => CreateTaskResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Req() req: Request, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get('/todo/:todoId')
  @ApiOperation({
    summary: 'Retrieves all tasks in a particular todo',
    description: 'Retrieves all tasks in a particular todo by the todoId',
  })
  @ApiOkResponse({
    type: () => GetAllTasksResponse,
  })
  @HttpCode(HttpStatus.OK)
  async getAllTasks(
    @Req() req: Request,
    @Param('todoId', ParseUUIDPipe) todoId: string,
    @Query() queryParamDto: TaskQueryParameterDto,
  ) {
    return this.tasksService
      .getAllTasks(todoId, req.user, queryParamDto)
      .then((result) => {
        const tasksWithStatusColor = result.tasks.map((task) => ({
          ...task,
          statusColor: this.tasksService.getTaskStatusColor(task),
        }));
        return { ...result, tasks: tasksWithStatusColor };
      });
  }

  @UseGuards(AuthGuard)
  @Get(':taskId')
  @ApiOperation({
    summary: 'Retrieve a task',
    description: 'Retrieve a task by its taskId',
  })
  @ApiOkResponse({
    type: () => GetTaskResponse,
  })
  @HttpCode(HttpStatus.OK)
  async getTask(
    @Req() req: Request,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.tasksService.getTask(taskId, req.user).then((result) => {
      result.task.statusColor = this.tasksService.getTaskStatusColor(
        result.task,
      );
      return result;
    });
  }

  @UseGuards(AuthGuard)
  @Patch(':taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Updates a task',
    description: 'Updates a task by its taskId',
  })
  @ApiOkResponse({
    type: () => UpdateTaskResponse,
  })
  async updateTask(
    @Req() req: Request,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, updateTaskDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':taskId')
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Deletes a task by its taskId',
  })
  @ApiOkResponse({
    type: () => DeleteTaskResponse,
  })
  @HttpCode(HttpStatus.OK)
  async deleteTask(
    @Req() req: Request,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.tasksService.deleteTask(taskId, req.user);
  }
}
