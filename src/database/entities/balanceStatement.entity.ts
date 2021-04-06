import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { Account } from './account.entity';

@Entity()
export class BalanceStatement extends Base {
  @Column()
  value: number;

  @Column()
  date: Date;

  @Column()
  manual: boolean;

  @ManyToOne(() => Account, account => account.balanceStatements)
  account: Account;

  constructor(value: number, date: Date, manual: boolean, account: Account) {
    super();
    this.value = value;
    this.date = date;
    this.manual = manual;
    this.account = account;
  }
}
