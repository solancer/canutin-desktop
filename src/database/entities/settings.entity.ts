import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Settings extends Base {
  @Column()
  autoBudget: boolean;

  constructor(autoBudget: boolean) {
    super();
    this.autoBudget = autoBudget;
  }
}
