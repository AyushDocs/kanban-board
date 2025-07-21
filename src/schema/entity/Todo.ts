import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { transformer } from '../utils/transformer';

export const PRIORITY={
  LOW:"LOW",
  MEDIUM:"MEDIUM",
  HIGH:"HIGH",
}
export const STATUS={
  PENDING:"PENDING",
  COMPLETED:"COMPLETED"
}

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({type:"text",nullable:true})
  public title!: string|null;

  @Column({type:"text",nullable:true})
  public description!: string|null;

  @Column()
  userEmail!: string;

  @ManyToOne(() => User, user => user.todos)
  public user: User;

  @Column({type: 'enum',enum:Object.values(STATUS),default: STATUS.PENDING})
  public status: string;

  @Column({type: 'enum',enum: Object.values(PRIORITY),default: PRIORITY.MEDIUM})
  public priority: string;

  @Column({transformer:transformer.date})
  public dueDate!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}

