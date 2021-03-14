import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { BalancegGroupEnum } from '../enums/balancegGroup.enum';
import { BalanceStatement } from './balanceStatement.entity';
import { Asset } from './asset.entity';
import { Transaction } from './transaction.entity';
import { AccountType } from './accountType.entity';

@Entity()
export class Account extends Base {
  @Column()
  name: string;

  @Column()
  officialName: string;

  @Column()
  institution: string;

  @Column()
  closed: boolean;

  @Column()
  balanceGroup: BalancegGroupEnum;

  @OneToMany(() => BalanceStatement, balanceStatement => balanceStatement.account)
  balanceStatements?: BalanceStatement[];

  @OneToMany(() => Asset, asset => asset.account)
  assets?: Asset[];

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions?: Transaction[];

  @OneToOne(() => AccountType, accountType => accountType.account)
  accountType: AccountType;

  constructor(
    name: string,
    officialName: string,
    institution: string,
    closed: boolean,
    balanceGroup: BalancegGroupEnum,
    balanceStatements: BalanceStatement[],
    assets: Asset[],
    transactions: Transaction[],
    accountType: AccountType,
  ) {
    super();
    this.name = name;
    this.officialName = officialName;
    this.institution = institution;
    this.closed = closed;
    this.balanceGroup = balanceGroup;
    this.balanceStatements = balanceStatements;
    this.assets = assets;
    this.transactions = transactions;
    this.accountType = accountType;
  }
}
