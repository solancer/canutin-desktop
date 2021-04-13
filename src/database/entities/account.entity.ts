import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { BalancegGroupEnum } from '../../enums/balancegGroup.enum';
import { BalanceStatement } from './balanceStatement.entity';
import { Asset } from './asset.entity';
import { Transaction } from './transaction.entity';
import { AccountType } from './accountType.entity';
import { getBalanceGroupByAccountType } from '../helpers';

@Entity()
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
  balanceGroup: BalancegGroupEnum;

  @OneToMany(() => BalanceStatement, balanceStatement => balanceStatement.account)
  balanceStatements?: BalanceStatement[];

  @OneToMany(() => Asset, asset => asset.account)
  assets?: Asset[];

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions?: Transaction[];

  @OneToOne(() => AccountType, accountType => accountType.account, { cascade: true })
  accountType: AccountType;

  constructor(
    name: string,
    closed: boolean,
    accountType: AccountType,
    officialName?: string,
    institution?: string
  ) {
    super();
    this.name = name;
    this.officialName = officialName;
    this.institution = institution;
    this.closed = closed;
    this.balanceGroup = getBalanceGroupByAccountType(accountType?.name);
    this.accountType = accountType;
  }
}
