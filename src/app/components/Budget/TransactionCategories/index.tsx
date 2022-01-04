import Section from '@app/components/common/Section';

import { Budget } from '@database/entities';
import useBudget from '@app/hooks/useBudget';

import CategoriesTable from '../CategoriesTable';
import TransactionCategoriesForm from '../TransactionCategoriesForm';

interface TransactionCategoriesProps {
  expenseBudgets?: Budget[];
}

const TransactionCategories = () => {
  const { budgetExpenseGroups } = useBudget();

  return (
    <>
      <Section title="Manage categories">
        <TransactionCategoriesForm expenseBudgets={budgetExpenseGroups} />
      </Section>
      <Section title="Categories by expense group">
        <CategoriesTable expenseBudgets={budgetExpenseGroups} />
      </Section>
    </>
  );
};

export default TransactionCategories;
