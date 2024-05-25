import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateTaskDto,
  TaskQueryParameterDto,
  UpdateTaskDto,
} from './dto/task.dto';
import logger from '../common/logger';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoList } from '../entities/todo-list.entity';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { Task } from '../entities/tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TodoList) private todoListRepo: Repository<TodoList>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  /**
   * @method createTask
   * @description  this method creates a task with the given CreateTaskDto
   * @param createTaskDto
   * @param user
   * @returns Object
   */
  async createTask(createTaskDto: CreateTaskDto, user: User) {
    try {
      const { description, dueDate, todoId } = createTaskDto;

      const foundTodoList = await this.foundTodo(todoId, user);

      if (!foundTodoList) {
        throw new HttpException('todo list not found', HttpStatus.NOT_FOUND);
      }

      const task = await this.taskRepo.save({
        description,
        dueDate,
        todoList: foundTodoList,
      });

      return {
        success: true,
        message: 'Task created successfully',
        task,
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating task');
    }
  }

  /**
   * @method getAllTasks
   * @description this method retrieves all the tasks for a particular todo
   * @param todoId
   * @param user
   * @param queryParamDto
   * @returns object
   */
  async getAllTasks(
    todoId: string,
    user: User,
    queryParamDto?: TaskQueryParameterDto,
  ) {
    try {
      const foundTodo = await this.foundTodo(todoId, user);
      if (!foundTodo) {
        throw new HttpException('todo list not found', HttpStatus.NOT_FOUND);
      }

      const { page, limit, sortBy, sortOrder, search } = queryParamDto;

      const perPage = page ? Number(page) : 1;
      const pageLimit = limit ? Number(limit) : 10;

      let skip = 0;
      if (perPage > 1) {
        skip = (perPage - 1) * pageLimit;
      }

      const queryOptions: FindManyOptions<Task> = {
        where: [
          {
            todoList: { id: foundTodo.id },
            ...(search ? { description: Like(`%${search}%`) } : {}),
          },
          {
            todoList: { id: foundTodo.id },
            ...(search ? { status: In([search]) } : {}),
          },
        ],
        skip,
        take: pageLimit,
        order: sortBy ? { [sortBy]: sortOrder || 'ASC' } : { createdAt: 'ASC' },
      };

      const [tasks, count] = await this.taskRepo.findAndCount(queryOptions);

      return {
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
        page: perPage,
        limit: pageLimit,
        total: count,
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving tasks');
    }
  }

  /**
   * @method getTask
   * @description - this method retrieves a task by the taskId
   * @param taskId
   * @param user
   * @returns {Task}
   */
  async getTask(taskId: string, user: User) {
    try {
      const task = (await this.foundTask(taskId, user)) as Task & {
        statusColor: string;
      };

      if (!task) {
        throw new HttpException('task not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Task retrieved successfully',
        data: task,
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving tasks');
    }
  }

  /**
   * @method updatedTask
   * @description - this method updates a particular task by the taskId and the provided updateTaskDto
   * @param taskId
   * @param updateTaskDto
   * @param user
   * @returns object
   */

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, user: User) {
    try {
      const { status, todoId, description, dueDate } = updateTaskDto;

      const foundTodo = await this.foundTodo(todoId, user);

      if (!foundTodo) {
        throw new HttpException('todo not found', HttpStatus.NOT_FOUND);
      }

      const task = await this.foundTask(taskId, user);

      if (!task) {
        throw new HttpException('task not found', HttpStatus.NOT_FOUND);
      }

      const updatedTask = await this.taskRepo.save({
        id: task.id,
        description: description || task.description,
        dueDate: dueDate || task.dueDate,
        status: status || task.status,
        todoList: foundTodo,
      });

      return {
        success: true,
        message: 'Task updated successfully',
        updatedTask,
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating task');
    }
  }

  async deleteTask(taskId: string, user: User) {
    try {
      const task = await this.foundTask(taskId, user);

      if (!task) {
        throw new HttpException('task not found', HttpStatus.NOT_FOUND);
      }

      await this.taskRepo.softDelete(task.id);

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving tasks');
    }
  }

  /**
   * @method foundTodo - this method returns a found todo
   * @param todoId
   * @param user
   * @returns {TodoList}
   */
  private async foundTodo(todoId: string, user: User): Promise<TodoList> {
    try {
      return await this.todoListRepo.findOne({
        where: {
          id: todoId,
          user: {
            id: user.id,
          },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method foundTask
   * @description - this method returns a found task
   * @param taskId
   * @param user
   * @returns {Task}
   */
  private async foundTask(taskId: string, user: User): Promise<Task> {
    try {
      return await this.taskRepo.findOne({
        where: {
          id: taskId,
          todoList: {
            user: {
              id: user.id,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method getTaskStatusColor
   * @description this method returns the status colour of a particular task
   * @param task
   * @returns {string}
   */
  getTaskStatusColor(task: Task): string {
    const currentTime = new Date();
    const dueDate = task.dueDate;

    const timeDifference = new Date(dueDate).getTime() - currentTime.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);

    if (hoursDifference >= 72) {
      return 'green'; // More than three days remaining
    } else if (hoursDifference < 3) {
      return 'red'; // Within three hours remaining
    } else {
      return 'amber'; // Less than 24 hours remaining
    }
  }
}
