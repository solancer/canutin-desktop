import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { TransactionCategory } from './transactionCategory.entity';
import { Transaction } from './transaction.entity';

@Entity({ name: 'transaction_category' })
export class TransactionSubCategory extends Base {
  @Column()
  name: string;

  @ManyToOne(
    () => TransactionCategory,
    transactionCategory => transactionCategory.transactionSubCategories,
    { cascade: true }
  )
  @JoinColumn()
  transactionCategory: TransactionCategory;

  @OneToMany(() => Transaction, transaction => transaction)
  transactions?: Transaction[];

  constructor(
    name: string,
    transactionCategory: TransactionCategory,
    transactions?: Transaction[]
  ) {
    super();
    this.name = name;
    this.transactions = transactions;
    this.transactionCategory = transactionCategory;
  }
}
