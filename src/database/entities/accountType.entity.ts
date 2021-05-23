import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Account } from './account.entity';

@Entity()
export class AccountType extends Base {
  @Column()
  name: string;

  @OneToMany(() => Account, account => account.accountType)
  account?: Account;

  constructor(name: string, account?: Account) {
    super();
    this.name = name;
    this.account = account;
  }
}
