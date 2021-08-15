import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Asset } from './asset.entity';

@Entity()
export class AssetBalanceStatement extends Base {
  @Column({ default: 0 })
  value: number;

  @Column({ nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  cost?: number;

  @Column({ default: false })
  sold: boolean;

  @ManyToOne(() => Asset, asset => asset.balanceStatements, { eager: false })
  @JoinColumn()
  asset: Asset;

  constructor(asset: Asset, value = 0, cost?: number, quantity?: number, sold = false) {
    super();

    if (quantity && cost) {
      this.value = quantity * cost;
    } else {
      this.value = value;
    }
    this.quantity = quantity;
    this.cost = cost;
    this.sold = sold;
    this.asset = asset;
  }
}
