import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Budget extends Base {
  @Column()
  name: string;

  @Column()
  targetAmount: number;

  @Column()
  type: string;

  @Column()
  date: Date;

  @OneToMany(() => Transaction, transaction => transaction.budget)
  transactions?: Transaction;

  constructor(name: string, targetAmount: number, type: string, date: Date) {
    super();
    this.name = name;
    this.targetAmount = targetAmount;
    this.type = type;
    this.date = date;
  }
}
