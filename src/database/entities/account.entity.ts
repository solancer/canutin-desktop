import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Base } from './base.entity';
import { BalanceGroupEnum } from '../../enums/balanceGroup.enum';
import { AccountBalanceStatement } from './accountBalanceStatement.entity';
import { Transaction } from './transaction.entity';
import { AccountType } from './accountType.entity';
import { getBalanceGroupByAccountType } from '../helpers';

@Entity()
@Unique(['name'])
export class Account extends Base {
  @Column()
  name: string;

  @Column({ nullable: true })
  officialName?: string;

  @Column({ nullable: true })
  institution?: string;

  @Column()
  closed: boolean;

  @Column()
  autoCalculated: boolean;

  @Column()
  balanceGroup: BalanceGroupEnum;

  @OneToMany(() => AccountBalanceStatement, balanceStatement => balanceStatement.account)
  balanceStatements?: AccountBalanceStatement[];

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions?: Transaction[];

  @ManyToOne(() => AccountType, accountType => accountType.account)
  @JoinColumn()
  accountType: AccountType;

  constructor(
    name: string,
    closed: boolean,
    autoCalculated: boolean,
    accountType: AccountType,
    officialName?: string,
    institution?: string,
    transactions?: Transaction[],
    balanceStatements?: AccountBalanceStatement[]
  ) {
    super();
    this.name = name;
    this.officialName = officialName;
    this.institution = institution;
    this.closed = closed;
    this.autoCalculated = autoCalculated;
    this.balanceGroup = getBalanceGroupByAccountType(accountType?.name);
    this.accountType = accountType;
    this.transactions = transactions;
    this.balanceStatements = balanceStatements;
  }
}
