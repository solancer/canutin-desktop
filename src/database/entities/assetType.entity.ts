import { Entity, Column, OneToOne } from 'typeorm';

import { Base } from './base.entity';
import { Asset } from './asset.entity';
import { AssetTypeEnum } from '../../enums/assetType.enum';

@Entity()
export class AssetType extends Base {
  @Column()
  name: AssetTypeEnum;

  @OneToOne(() => Asset, asset => asset.assetType)
  asset?: Asset;

  constructor(name: AssetTypeEnum, asset?: Asset) {
    super();
    this.name = name;
    this.asset = asset;
  }
}
