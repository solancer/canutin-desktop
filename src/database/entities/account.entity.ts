import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Base } from './base.entity';
import { BalanceGroupEnum } from '../../enums/balanceGroup.enum';
import { BalanceStatement } from './balanceStatement.entity';
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
  balanceGroup: BalanceGroupEnum;

  @OneToMany(() => BalanceStatement, balanceStatement => balanceStatement.account)
  balanceStatements?: BalanceStatement[];

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions?: Transaction[];

  @ManyToOne(() => AccountType, accountType => accountType.account)
  @JoinColumn()
  accountType: AccountType;

  constructor(
    name: string,
    closed: boolean,
    accountType: AccountType,
    officialName?: string,
    institution?: string,
    transactions?: Transaction[],
    balanceStatements?: BalanceStatement[]
  ) {
    super();
    this.name = name;
    this.officialName = officialName;
    this.institution = institution;
    this.closed = closed;
    this.balanceGroup = getBalanceGroupByAccountType(accountType?.name);
    this.accountType = accountType;
    this.transactions = transactions;
    this.balanceStatements = balanceStatements;
  }
}
