import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TodoList } from 'src/entities/todo-list.entity';
import { Task } from 'src/entities/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TodoList, Task])],
  controllers: [TasksController],
  providers: [TasksService, JwtService],
})
export class TasksModule {}
