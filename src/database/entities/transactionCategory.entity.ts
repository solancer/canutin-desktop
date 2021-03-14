import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { TransactionSubCategory } from './transactionSubCategory.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionCategory extends Base {
  @Column()
  name: string;

  @OneToMany(
    () => TransactionSubCategory,
      transactionSubCategory => transactionSubCategory.transactionCategory,
  )
  transactionSubCategories: TransactionSubCategory[];

  @OneToOne(() => Transaction, transaction => transaction.category)
  transaction: Transaction;

  constructor(
    name: string,
    transactionSubCategories: TransactionSubCategory[],
    transaction: Transaction,
  ) {
    super();
    this.name = name;
    this.transactionSubCategories = transactionSubCategories;
    this.transaction = transaction;
  }
}
