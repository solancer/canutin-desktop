import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { BalancegGroupEnum } from '../enums/balancegGroup.enum';
import { Account } from './account.entity';
import { AssetType } from './assetType.entity';

@Entity()
export class Asset extends Base {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @Column()
  value: number;

  @Column()
  sold: Date;

  @Column()
  balanceGroup: BalancegGroupEnum;

  @ManyToOne(() => Account, account => account.assets)
  account?: Account;

  @OneToOne(() => AssetType, assetType => assetType.asset)
  assetType: AssetType;

  constructor(
    name: string,
    quantity: number,
    cost: number,
    value: number,
    sold: Date,
    balanceGroup: BalancegGroupEnum,
    account: Account,
    assetType: AssetType
  ) {
    super();
    this.name = name;
    this.quantity = quantity;
    this.cost = cost;
    this.value = value;
    this.sold = sold;
    this.balanceGroup = balanceGroup;
    this.account = account;
    this.assetType = assetType;
  }
}
