import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '@/user/v1/infrastructure/entities/user.entity';
import { TaskStatusEnum } from '@/task/v1/domain/task/task.status';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  estimationHours!: number;

  @Column()
  dueDate!: Date;

  @Column()
  status!: TaskStatusEnum;

  @Column()
  cost!: number;

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable()
  assignedUsers!: User[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
