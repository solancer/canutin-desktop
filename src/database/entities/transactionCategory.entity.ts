import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { TransactionSubCategory } from './transactionSubCategory.entity';

@Entity({ name: 'transaction_category_group' })
export class TransactionCategory extends Base {
  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => TransactionSubCategory,
    transactionSubCategory => transactionSubCategory.transactionCategory
  )
  transactionSubCategories?: TransactionSubCategory[];

  constructor(name: string, transactionSubCategories?: TransactionSubCategory[]) {
    super();
    this.name = name;
    this.transactionSubCategories = transactionSubCategories;
  }
}
