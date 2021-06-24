import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { BalanceGroupEnum } from '../../enums/balanceGroup.enum';
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

  constructor(
    name: string,
    quantity: number,
    cost: number,
    assetType: AssetType,
    sold?: Date
  ) {
    super();
    this.name = name;
    this.quantity = quantity;
    this.cost = cost;
    this.assetType = assetType;
    this.sold = sold;
    this.balanceGroup = getBalanceGroupByAssetType(assetType?.name);
  }
}
