import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  email!: string;

  @Column()
  password!: string;
}
