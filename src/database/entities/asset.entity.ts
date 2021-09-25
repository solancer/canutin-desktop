import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { BalanceGroupEnum } from '../../enums/balanceGroup.enum';
import { AssetType } from './assetType.entity';
import { getBalanceGroupByAssetType } from '../helpers';
import { AssetBalanceStatement } from './assetBalanceStatement.entity';

@Entity()
export class Asset extends Base {
  @Column()
  name: string;

  @ManyToOne(() => AssetType, assetType => assetType.asset, { cascade: true })
  @JoinColumn()
  assetType: AssetType;

  @Column()
  balanceGroup: BalanceGroupEnum;

  @Column({ nullable: true })
  symbol?: string;

  @OneToMany(() => AssetBalanceStatement, balanceStatement => balanceStatement.asset)
  balanceStatements?: AssetBalanceStatement[];

  constructor(
    name: string,
    assetType: AssetType,
    symbol?: string,
    balanceStatements?: AssetBalanceStatement[]
  ) {
    super();
    this.name = name;
    this.assetType = assetType;
    this.balanceGroup = getBalanceGroupByAssetType(assetType?.name);
    this.symbol = symbol;
    this.balanceStatements = balanceStatements;
  }
}
