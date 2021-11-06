import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Base } from './base.entity';
import { Account } from './account.entity';
import { Budget } from './budget.entity';
import { TransactionSubCategory } from './transactionSubCategory.entity';

@Entity()
@Unique('UQ_COLUMNS', ['account', 'date', 'description', 'amount', 'createdAt'])
export class Transaction extends Base {
  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @Column()
  excludeFromTotals: boolean;

  @ManyToOne(() => Account, account => account.transactions, {
    cascade: true,
  })
  @JoinColumn()
  account: Account;

  @ManyToOne(() => Budget, budget => budget.transactions, {
    cascade: true,
  })
  @JoinColumn()
  budget?: Budget;

  @ManyToOne(
    () => TransactionSubCategory,
    transactionSubCategory => transactionSubCategory.transactions
  )
  @JoinColumn()
  category: TransactionSubCategory;

  constructor(
    description: string,
    date: Date,
    amount: number,
    excludeFromTotals: boolean,
    account: Account,
    category: TransactionSubCategory,
    createdAt: Date,
    budget?: Budget
  ) {
    super();
    this.description = description;
    this.date = date;
    this.amount = amount;
    this.excludeFromTotals = excludeFromTotals ? excludeFromTotals : false;
    this.account = account;
    this.category = category;
    this.createdAt = createdAt;
    this.budget = budget;
  }
}
