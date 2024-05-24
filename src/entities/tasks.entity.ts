import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TodoList } from './todo-list.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  pending = 'pending',
  completed = 'completed',
}

@Entity()
export class Task {
  constructor(data?: Task) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  description: string;

  @ApiProperty()
  @Column({ type: 'date' })
  dueDate: Date;

  @ApiProperty()
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.pending })
  status: TaskStatus;

  @ManyToOne(() => TodoList, ({ tasks }) => tasks)
  @JoinColumn()
  todoList: TodoList;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
