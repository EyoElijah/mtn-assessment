import { Test, TestingModule } from '@nestjs/testing';
import { TodoListController } from './todo-list.controller';
import { TodoListService } from './todo-list.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('TodoListController', () => {
  let controller: TodoListController;

  const mockTodoListService = {};
  const mockUserRepository = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListController],
      providers: [
        TodoListService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideProvider(TodoListService)
      .useValue(mockTodoListService)
      .compile();

    controller = module.get<TodoListController>(TodoListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
