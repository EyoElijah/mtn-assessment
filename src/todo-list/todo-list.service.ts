import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateTodoListDto,
  TodoListQueryParameterDto,
  UpdateTodoListDto,
} from './dto/todo-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoList } from '../entities/todo-list.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import logger from '../common/logger';
import { User } from '../entities/user.entity';

@Injectable()
export class TodoListService {
  constructor(
    @InjectRepository(TodoList) private todoListRepo: Repository<TodoList>,
  ) {}

  /**
   * @method createTodo
   * @description this method creates a todo for a user with the given CreateTodoListDto
   * @param createTodoListDto
   * @param user
   * @returns object
   */
  async createTodo(createTodoListDto: CreateTodoListDto, user: User) {
    try {
      const { name } = createTodoListDto;

      if (await this.isTodoNameExist(name, user)) {
        throw new HttpException('todo name already exist', HttpStatus.CONFLICT);
      }

      const todo = await this.todoListRepo.save({
        name,
        user,
      });

      // remove the user object from the todo
      delete todo.user;

      return {
        message: 'Todo created successfully',
        success: true,
        todo,
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating todo');
    }
  }

  /**
   * @method getAllTodos
   * @description this method gets all the todos created by a particular user
   * @param user
   * @param queryParamsDto
   * @returns TodoList[]
   */
  async getAllTodos(user: User, queryParamsDto: TodoListQueryParameterDto) {
    try {
      const { page, limit, sortBy, sortOrder, search } = queryParamsDto;

      const perPage = page ? Number(page) : 1;
      const pageLimit = limit ? Number(limit) : 10;

      let skip = 0;
      if (perPage > 1) {
        skip = (perPage - 1) * pageLimit;
      }

      const queryOptions: FindManyOptions<TodoList> = {
        where: [
          {
            user: { id: user.id },
            ...(search ? { name: Like(`%${search}%`) } : {}),
          },
        ],
        skip,
        take: pageLimit,
        order: sortBy ? { [sortBy]: sortOrder || 'ASC' } : { createdAt: 'ASC' },
      };

      const [todos, count] = await this.todoListRepo.findAndCount(queryOptions);

      return {
        message: 'Todos retrieved successfully',
        success: true,
        todos,
        page: perPage,
        limit: pageLimit,
        total: count,
      };
    } catch (error) {
      logger.error(error).console();
      throw new InternalServerErrorException('Error retrieving todos');
    }
  }

  /**
   * @method getSingleTodo
   * @description this method gets a single todo for a user by the todoId
   * @param todoId
   * @param user
   * @returns TodoList
   */
  async getSingleTodo(todoId: string, user: User) {
    try {
      const todo = await this.foundTodo(todoId, user);

      if (!todo) {
        throw new HttpException('todo not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Todo retrieved successfully',
        success: true,
        todo,
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving todo');
    }
  }

  /**
   * @method updatedTask
   * @description - this method updates a todo by the todoId and the provided updateTodoListDto
   * @param todoId
   * @param updateTodoListDto
   * @param user
   * @returns  TodoList
   */
  async updateTodo(
    todoId: string,
    updateTodoListDto: UpdateTodoListDto,
    user: User,
  ) {
    try {
      const todo = await this.foundTodo(todoId, user);

      if (!todo) {
        throw new HttpException('todo not found', HttpStatus.NOT_FOUND);
      }

      if (await this.isTodoNameExist(updateTodoListDto.name, user)) {
        throw new HttpException('todo name already exist', HttpStatus.CONFLICT);
      }

      todo.name = updateTodoListDto.name;

      await this.todoListRepo.save(todo);

      return {
        message: 'Todo updated successfully',
        success: true,
        todo,
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating todo');
    }
  }

  /**
   *
   * @method deleteTodo
   * @description - this method deletes a todo by a particular user by the todoId
   * @param todoId
   * @param user
   * @returns  message status
   */
  async deleteTodo(todoId: string, user: User) {
    try {
      const todo = await this.foundTodo(todoId, user);

      if (!todo) {
        throw new HttpException('todo not found', HttpStatus.NOT_FOUND);
      }

      await this.todoListRepo.remove(todo);

      return {
        message: 'Todo deleted successfully',
        success: true,
      };
    } catch (error) {
      logger.error(error).console();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting todo');
    }
  }

  /**
   * @method isTodoNameExist - this method checks if a todo name akready exist in the database
   * @param user
   * @param name
   * @returns {boolean}
   */
  private async isTodoNameExist(name: string, user: User): Promise<boolean> {
    try {
      const foundRecord = await this.todoListRepo.findOne({
        where: {
          name,
          user: { id: user.id },
        },
      });

      if (foundRecord) return !!foundRecord;

      return false;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method foundTodo - this method returns a found todo
   * @param user
   * @param todoId
   * @returns {TodoList}
   */
  private async foundTodo(todoId: string, user: User): Promise<TodoList> {
    try {
      const todo = await this.todoListRepo.findOne({
        where: {
          id: todoId,
          user: {
            id: user.id,
          },
        },
      });

      return todo;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
