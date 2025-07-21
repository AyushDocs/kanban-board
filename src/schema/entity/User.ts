import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Todo } from './Todo';

@Entity('users')
export class User {
    @PrimaryColumn()
    email: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    image?: string;

    @OneToMany(() => Todo, todo => todo.user)
    todos: Todo[];
}
