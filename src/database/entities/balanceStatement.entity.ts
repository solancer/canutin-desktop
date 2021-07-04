import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Account } from './account.entity';

@Entity()
export class BalanceStatement extends Base {
  @Column({ nullable: true })
  value?: number;

  @Column({ default: true })
  autoCalculate: boolean;

  @ManyToOne(() => Account, account => account.balanceStatements, { eager: false })
  @JoinColumn()
  account: Account;

  constructor(autoCalculate: boolean, account: Account, value?: number) {
    super();
    this.value = value;
    this.autoCalculate = autoCalculate;
    this.account = account;
  }
}
