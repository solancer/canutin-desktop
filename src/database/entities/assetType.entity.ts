import { Entity, Column, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { Asset } from './asset.entity';

@Entity()
export class AssetType extends Base {
  @Column()
  name: string;

  @OneToOne(() => Asset, asset => asset.assetType)
  asset: Asset;

  constructor(name: string, asset: Asset) {
    super();
    this.name = name;
    this.asset = asset;
  }
}
