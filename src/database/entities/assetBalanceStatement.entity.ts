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

  constructor(value = 0, asset: Asset, createdAt: Date, quantity?: number, cost?: number) {
    super();
    this.value = quantity && cost ? quantity * cost : value;
    this.asset = asset;
    this.createdAt = createdAt;
    this.quantity = quantity;
    this.cost = cost;
  }
}
