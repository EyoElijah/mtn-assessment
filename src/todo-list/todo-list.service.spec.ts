import { Test, TestingModule } from '@nestjs/testing';
import { TodoListService } from './todo-list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoList } from '../entities/todo-list.entity';

describe('TodoListService', () => {
  let service: TodoListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoListService,
        {
          provide: getRepositoryToken(TodoList),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TodoListService>(TodoListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
