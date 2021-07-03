import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import { Base } from './base.entity';
import { BalanceGroupEnum } from '../../enums/balanceGroup.enum';
import { AssetType } from './assetType.entity';
import { getBalanceGroupByAssetType } from '../helpers';

@Entity()
export class Asset extends Base {
  @Column()
  name: string;

  @Column({ default: 0 })
  value?: number;

  @ManyToOne(() => AssetType, assetType => assetType.asset, { cascade: true })
  @JoinColumn()
  assetType: AssetType;

  @Column()
  balanceGroup: BalanceGroupEnum;

  @Column({ default: 0 })
  quantity?: number;

  @Column({ default: 0 })
  cost?: number;

  @Column({ nullable: true })
  symbol?: string;

  constructor(
    name: string,
    assetType: AssetType,
    value = 0,
    quantity = 0,
    cost = 0,
    symbol?: string
  ) {
    super();
    this.name = name;

    if (quantity !== undefined && cost !== undefined) {
      this.value = quantity * cost;
    } else {
      this.value = value;
    }

    this.assetType = assetType;
    this.balanceGroup = getBalanceGroupByAssetType(assetType?.name);
    this.quantity = quantity;
    this.cost = cost;
    this.symbol = symbol;
  }
}
