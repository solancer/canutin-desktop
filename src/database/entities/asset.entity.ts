import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { BalanceGroupEnum } from '../../enums/balanceGroup.enum';
import { Account } from './account.entity';
import { AssetType } from './assetType.entity';
import { getBalanceGroupByAssetType } from '../helpers';

@Entity()
export class Asset extends Base {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @ManyToOne(() => AssetType, assetType => assetType.asset, { cascade: true })
  @JoinColumn()
  assetType: AssetType;

  @Column()
  balanceGroup: BalanceGroupEnum;

  @Column({ nullable: true })
  sold?: Date;

  @ManyToOne(() => Account, account => account.assets, { nullable: true })
  @JoinColumn()
  account?: Account;

  constructor(
    name: string,
    quantity: number,
    cost: number,
    assetType: AssetType,
    account?: Account | null,
    sold?: Date
  ) {
    super();
    this.name = name;
    this.quantity = quantity;
    this.cost = cost;
    this.account = account ? account : undefined;
    this.assetType = assetType;
    this.sold = sold;
    this.balanceGroup = getBalanceGroupByAssetType(assetType?.name);
  }
}
