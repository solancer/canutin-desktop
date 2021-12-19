import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Base } from './base.entity';
import { Asset } from './asset.entity';

@Entity()
@Unique('UQ_COLUMNS', ['asset', 'createdAt'])
export class AssetBalanceStatement extends Base {
  @Column({ default: 0 })
  value: number;

  @Column({ nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  cost?: number;

  @ManyToOne(() => Asset, asset => asset.balanceStatements, { eager: false })
  @JoinColumn()
  asset: Asset;

  constructor(asset: Asset, createdAt: Date, value = 0, cost?: number, quantity?: number) {
    super();
    this.asset = asset;
    this.createdAt = createdAt;
    this.value = quantity && cost ? quantity * cost : value;
    this.quantity = quantity;
    this.cost = cost;
  }
}
