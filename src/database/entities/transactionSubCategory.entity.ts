import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { TransactionCategory } from './transactionCategory.entity';

@Entity()
export class TransactionSubCategory extends Base {
  @Column()
  name: string;

  @ManyToOne(
    () => TransactionCategory,
      transactionCategory => transactionCategory.transactionSubCategories,
  )
  transactionCategory: TransactionCategory;

  constructor(name: string, transactionCategory: TransactionCategory) {
    super();
    this.name = name;
    this.transactionCategory = transactionCategory;
  }
}
