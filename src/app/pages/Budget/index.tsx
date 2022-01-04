import { useContext } from 'react';
import { format, getDaysInMonth, isThisMonth } from 'date-fns';
import styled from 'styled-components';

import { proportionBetween } from '@app/utils/balance.utils';
import { TransactionsContext } from '@app/context/transactionsContext';
import useBudget from '@app/hooks/useBudget';

import ScrollView from '@components/common/ScrollView';
import Section from '@app/components/common/Section';
import EmptyCard from '@app/components/common/EmptyCard';
import BudgetBar from '@app/components/Budget/BudgetBar';
import BudgetHeaderButtons from '@app/components/Budget/BudgetHeaderButtons';
import {
  currentPeriodDate,
  bugetThisMonthContainer,
  bugetThisMonthTime,
  bugetThisMonthLabel,
} from './styles';
import Card from '@app/components/common/Card';

const thisMonthDay = format(new Date(), 'dd');
const thisMonthPercentage = Math.round(
  proportionBetween(Number.parseInt(thisMonthDay), getDaysInMonth(new Date()))
);

const CurrentPeriodDate = styled.h2`
  ${currentPeriodDate}
`;
const BudgetThisMonthContainer = styled.div`
  ${bugetThisMonthContainer}
`;
const BudgetThisMonthTime = styled.time`
  ${bugetThisMonthTime}
`;
const BudgetThisMonthLabel = styled.span`
  ${bugetThisMonthLabel}
  width: ${thisMonthPercentage}%;
`;

const Budget = () => {
  const { budgetFilterOption } = useContext(TransactionsContext);

  const {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    periodIncomeAmount,
    periodExpensesAmount,
    periodSavingsAmount,
    periodOutOfBudgetAmount,
    periodExpenseGroups,
    periodTransactions,
    isLoading,
    autoBudget,
  } = useBudget();

  return (
    <>
      <ScrollView
        title="Budget"
        subTitle={autoBudget ? 'Auto-budget' : 'Custom budget'}
        headerNav={<BudgetHeaderButtons />}
      >
        {!isLoading && targetIncomeAmount > 0 && periodTransactions.length > 0 && (
          <>
            <BudgetThisMonthContainer>
              {isThisMonth(budgetFilterOption?.value?.dateFrom) && (
                <BudgetThisMonthTime>
                  <BudgetThisMonthLabel>{thisMonthDay}</BudgetThisMonthLabel>
                </BudgetThisMonthTime>
              )}

              <Section
                title="Summary"
                scope={
                  <CurrentPeriodDate>
                    {format(budgetFilterOption?.value?.dateFrom, 'MMM yyyy')}
                  </CurrentPeriodDate>
                }
              >
                <BudgetBar
                  periodAmount={periodIncomeAmount}
                  targetAmount={targetIncomeAmount}
                  title="Income"
                  dataTestId="budget-bar-income"
                />
                <BudgetBar
                  periodAmount={periodExpensesAmount}
                  targetAmount={targetExpensesAmount}
                  title="Expenses"
                  dataTestId="budget-bar-expenses"
                />
                <BudgetBar
                  periodAmount={periodSavingsAmount}
                  targetAmount={targetSavingsAmount}
                  title="Savings"
                  dataTestId="budget-bar-savings"
                />
              </Section>

              {periodExpenseGroups.length > 0 && (
                <Section title="Expenses by group">
                  {periodExpenseGroups.map(budgetGroup => (
                    <BudgetBar
                      key={budgetGroup.name}
                      title={budgetGroup.name}
                      periodAmount={budgetGroup.periodAmount}
                      targetAmount={budgetGroup.targetAmount}
                      dataTestId={`budget-bar-${budgetGroup.name.toLocaleLowerCase()}`}
                    />
                  ))}
                </Section>
              )}
            </BudgetThisMonthContainer>

            {periodOutOfBudgetAmount !== 0 && (
              <Section title="Other expenses">
                <Card
                  label="Out of budget"
                  value={periodOutOfBudgetAmount}
                  isCurrency={true}
                  dataTestId="budget-out-of-budget"
                />
              </Section>
            )}
          </>
        )}

        {!isLoading && autoBudget && targetIncomeAmount <= 0 && (
          <EmptyCard message="Need at least 2 months of transactions for budgets to be displayed when auto-budget is enabled" />
        )}
      </ScrollView>
    </>
  );
};

export default Budget;
