import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';
import { endOfDay, format, startOfDay, subMonths } from 'date-fns';

import { render } from '@tests/utils';
import App from '@components/App';
import {
  DB_GET_ACCOUNTS_ACK,
  DB_GET_BUDGETS_ACK,
  DB_GET_TRANSACTION_CATEGORY_ACK,
  FILTER_TRANSACTIONS_ACK,
} from '@constants/events';
import { DATABASE_CONNECTED } from '@constants';
import { AppCtxProvider } from '@app/context/appContext';
import { EntitiesProvider } from '@app/context/entitiesContext';
import { TransactionsProvider } from '@app/context/transactionsContext';
import { seedAccounts } from '@tests/factories/seededEntitiesFactory';
import { autoBudgetCategoriesBuilder } from '@tests/factories/autoBudgetCategoriesFactory';
import {
  accountCheckingDetails,
  accountCreditCardDetails,
  accountSavingsDetails,
} from '@database/seed/demoData/accounts';
import {
  accountCheckingTransactionSet,
  accountSavingsTransactionSet,
  accountCreditCardTransactionSet,
} from '@database/seed/demoData/transactions';
import { filters } from '@app/constants/filters';
import { dateInUTC } from '@app/utils/date.utils';
import mapCategories from '@database/helpers/importResources/mapCategories';
import BudgetIpc from '@app/data/budget.ipc';

const initAppWithContexts = () => {
  render(
    <AppCtxProvider>
      <EntitiesProvider>
        <TransactionsProvider>
          <App />
        </TransactionsProvider>
      </EntitiesProvider>
    </AppCtxProvider>
  );
};

describe('Budget tests', () => {
  const minimumAccount = [{ ...accountCheckingDetails, transactions: [] }];

  test("Sidebar link can't be clicked if no accounts or assets are present", async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, {
          filePath: 'testFilePath',
        });
      }

      return ipcRenderer;
    });

    initAppWithContexts();
    const budgetSidebarLink = screen.getByTestId('sidebar-budget');
    expect(budgetSidebarLink).toHaveAttribute('disabled');

    userEvent.click(budgetSidebarLink);
    expect(budgetSidebarLink).not.toHaveAttribute('active', '1');
  });

  test('Budget page displays an empty view when no enough data is available', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, {
          filePath: 'testFilePath',
        });
      }

      if (event === DB_GET_ACCOUNTS_ACK) {
        callback((event as unknown) as IpcRendererEvent, minimumAccount);
      }

      if (event === FILTER_TRANSACTIONS_ACK) {
        callback((event as unknown) as IpcRendererEvent, { transactions: [] });
      }

      return ipcRenderer;
    });

    initAppWithContexts();
    const budgetSidebarLink = screen.getByTestId('sidebar-budget');
    expect(budgetSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(budgetSidebarLink);
    expect(budgetSidebarLink).toHaveAttribute('active', '1');
    expect(screen.getByText('Auto-budget')).toBeVisible();
    expect(
      screen.getByText(
        'Need at least 2 months of transactions for budgets to be displayed when auto-budget is enabled'
      )
    ).toBeVisible();

    const periodChooser = screen.getByText(format(new Date(), 'MMMM yyyy'));
    expect(periodChooser).toBeVisible();

    userEvent.click(periodChooser);
    expect(screen.getByText(format(subMonths(new Date(), 6), 'MMMM yyyy'))).toBeVisible();
    expect(screen.getByText(format(subMonths(new Date(), 12), 'MMMM yyyy'))).toBeVisible();
  });

  test('Budget page displays the correct data when auto-budget is enabled', async () => {
    let oneMonthOfTransactions = accountCheckingTransactionSet()
      .filter(transaction => {
        // Mimic the logic in `TransactionRepository.getFilterTransactions()`
        const dateFrom = dateInUTC(startOfDay(filters[0].dateFrom));
        const dateTo = dateInUTC(endOfDay(filters[0].dateTo));
        return transaction.date >= dateFrom && transaction.date <= dateTo;
      })
      .map(transaction => {
        return {
          ...transaction,
          account: { ...accountCheckingDetails },
          category: { name: mapCategories(transaction.categoryName) },
        };
      });

    accountSavingsTransactionSet()
      .filter(transaction => {
        const dateFrom = dateInUTC(startOfDay(filters[0].dateFrom));
        const dateTo = dateInUTC(endOfDay(filters[0].dateTo));
        return transaction.date >= dateFrom && transaction.date <= dateTo;
      })
      .forEach(transaction => {
        oneMonthOfTransactions.push({
          ...transaction,
          account: { ...accountSavingsDetails },
          category: { name: mapCategories(transaction.categoryName) },
        });
      });

    accountCreditCardTransactionSet()
      .filter(transaction => {
        const dateFrom = dateInUTC(startOfDay(filters[0].dateFrom));
        const dateTo = dateInUTC(endOfDay(filters[0].dateTo));
        return transaction.date >= dateFrom && transaction.date <= dateTo;
      })
      .forEach(transaction => {
        oneMonthOfTransactions.push({
          ...transaction,
          account: { ...accountCreditCardDetails },
          category: { name: mapCategories(transaction.categoryName) },
        });
      });

    // Out of budget transaction
    oneMonthOfTransactions.push({
      description: 'Better Purchase Electronics Co.',
      amount: -99.99,
      date: new Date(),
      categoryName: 'Uncategorized',
      excludeFromTotals: false,
      account: { ...accountCreditCardDetails },
      category: { name: mapCategories('Uncategorized') },
    });

    const {
      needsCategories,
      wantsCategories,
      transactionsWithCategories,
    } = autoBudgetCategoriesBuilder(oneMonthOfTransactions);
    oneMonthOfTransactions = transactionsWithCategories;

    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, {
          filePath: 'testFilePath',
        });
      }

      if (event === DB_GET_ACCOUNTS_ACK) {
        callback((event as unknown) as IpcRendererEvent, seedAccounts);
      }

      if (event === FILTER_TRANSACTIONS_ACK) {
        callback((event as unknown) as IpcRendererEvent, {
          transactions: oneMonthOfTransactions,
        });
      }

      if (event === DB_GET_TRANSACTION_CATEGORY_ACK) {
        needsCategories.forEach(category => {
          callback((event as unknown) as IpcRendererEvent, category);
        });
        wantsCategories.forEach(category => {
          callback((event as unknown) as IpcRendererEvent, category);
        });
      }

      if (event === DB_GET_BUDGETS_ACK) {
        callback((event as unknown) as IpcRendererEvent, []);
      }

      return ipcRenderer;
    });

    initAppWithContexts();
    userEvent.click(screen.getByTestId('sidebar-big-picture')); // Resets path back to the default
    const budgetSidebarLink = screen.getByTestId('sidebar-budget');
    expect(budgetSidebarLink).toHaveAttribute('active', '0');
    expect(budgetSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(budgetSidebarLink);
    expect(budgetSidebarLink).toHaveAttribute('active', '1');

    const budgetBarIncome = screen.getByTestId('budget-bar-income');
    expect(budgetBarIncome).toHaveTextContent('Income');
    expect(budgetBarIncome).toHaveTextContent('$7,577');
    expect(budgetBarIncome).toHaveTextContent('$8,050 (106%)');

    const budgetBarExpenses = screen.getByTestId('budget-bar-expenses');
    expect(budgetBarExpenses).toHaveTextContent('Expenses');
    expect(budgetBarExpenses).toHaveTextContent('-$6,061');
    expect(budgetBarExpenses).toHaveTextContent('-$7,922 (131%)');

    const budgetBarSavings = screen.getByTestId('budget-bar-savings');
    expect(budgetBarSavings).toHaveTextContent('Savings');
    expect(budgetBarSavings).toHaveTextContent('$1,516');
    expect(budgetBarSavings).toHaveTextContent('$128 (8%)');

    const budgetBarNeeds = screen.getByTestId('budget-bar-needs');
    expect(budgetBarNeeds).toHaveTextContent('Needs');
    expect(budgetBarNeeds).toHaveTextContent('-$4,053 (107%)');
    expect(budgetBarNeeds).toHaveTextContent('-$3,788');

    const budgetBarWants = screen.getByTestId('budget-bar-wants');
    expect(budgetBarWants).toHaveTextContent('Wants');
    expect(budgetBarWants).toHaveTextContent('-$3,769 (166%)');
    expect(budgetBarWants).toHaveTextContent('-$2,273');

    const budgetBarOutOfBudget = screen.getByTestId('budget-out-of-budget');
    expect(budgetBarOutOfBudget).toHaveTextContent('Out of budget');
    expect(budgetBarOutOfBudget).toHaveTextContent('-$100');

    userEvent.click(screen.getByText('Edit'));
    await waitFor(() => {
      expect(screen.getByText('What is auto-budget?')).toBeVisible();
      expect(screen.getByDisplayValue('Enabled')).toBeChecked();
      expect(screen.getByDisplayValue('Disabled')).not.toBeChecked();
      expect(screen.getByText('Save')).toHaveAttribute('disabled');
      expect(screen.queryByText('Add new')).toBeNull();
    });

    const budgetFieldsetTargetIncome = screen.getByTestId('budget-fieldset-target-income');
    expect(budgetFieldsetTargetIncome).toHaveTextContent('Target income');
    expect(budgetFieldsetTargetIncome).toHaveTextContent('100%');
    expect(screen.getByDisplayValue('+$7,577')).toHaveAttribute('disabled');

    let budgetFieldsetExpenseGroups = screen.getAllByTestId('budget-fieldset-expense-group');
    expect(budgetFieldsetExpenseGroups[0]).toHaveTextContent('Expense group name');
    expect(budgetFieldsetExpenseGroups[0]).toHaveTextContent('Target amount');
    expect(budgetFieldsetExpenseGroups[0]).toHaveTextContent('Categories');
    expect(budgetFieldsetExpenseGroups[0]).toHaveTextContent('50%');
    expect(budgetFieldsetExpenseGroups[1]).toHaveTextContent('30%');
    expect(screen.getByDisplayValue('Needs')).toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('-$3,788')).toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('32')).toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('Wants')).toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('-$2,273')).toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('53')).toHaveAttribute('disabled');

    let budgetFieldsetTargetSavings = screen.getByTestId('budget-fieldset-target-savings');
    expect(budgetFieldsetTargetSavings).toHaveTextContent('Target savings');
    expect(budgetFieldsetTargetSavings).toHaveTextContent('20%');
    expect(screen.getByDisplayValue('$1,516')).toHaveAttribute('disabled');

    userEvent.click(screen.getByText('Transaction categories'));
    expect(screen.getByDisplayValue('Enabled')).toHaveAttribute('disabled');
    expect(screen.getByText('Assigning categories')).toBeVisible();
    expect(screen.getByText('Save')).toHaveAttribute('disabled');
    expect(screen.queryAllByRole('row').length).toEqual(86);

    userEvent.click(screen.getByText('Budget groups'));
    await waitFor(() => {
      userEvent.click(screen.getByDisplayValue('Disabled'));
      expect(screen.getByDisplayValue('Disabled')).toBeChecked();
      expect(screen.getByText('Custom budget')).toBeVisible();
      expect(screen.getByDisplayValue('Enabled')).not.toBeChecked();
      expect(screen.getByText('Save')).not.toHaveAttribute('disabled');
    });
    expect(screen.getByDisplayValue('+$7,577')).not.toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('Needs')).not.toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('-$3,788')).not.toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('Wants')).not.toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('-$2,273')).not.toHaveAttribute('disabled');

    // FIXME: When disabling auto-budget from the Edit page, the expense groups are
    // populated with the data from auto-budget but only in the app and not during the tests.
    userEvent.clear(screen.getByDisplayValue('+$7,577'));
    let expenseGroupTargetAmountInput = screen.getAllByPlaceholderText('$0.00');
    expect(expenseGroupTargetAmountInput.length).toEqual(4);

    userEvent.clear(expenseGroupTargetAmountInput[0]);
    userEvent.type(expenseGroupTargetAmountInput[0], '1000');
    userEvent.clear(expenseGroupTargetAmountInput[1]);
    userEvent.type(expenseGroupTargetAmountInput[1], '500');
    userEvent.clear(expenseGroupTargetAmountInput[2]);
    userEvent.type(expenseGroupTargetAmountInput[2], '400');
    budgetFieldsetExpenseGroups = screen.getAllByTestId('budget-fieldset-expense-group');
    expect(budgetFieldsetExpenseGroups.length).toEqual(2);
    expect(budgetFieldsetExpenseGroups[0]).toHaveTextContent('50%');
    expect(budgetFieldsetExpenseGroups[1]).toHaveTextContent('40%');

    budgetFieldsetTargetSavings = screen.getByTestId('budget-fieldset-target-savings');
    expect(budgetFieldsetTargetSavings).toHaveTextContent('10%');
    expect(screen.getByText('Save')).not.toHaveAttribute('disabled');

    const spyOnSubmit = jest.spyOn(BudgetIpc, 'editBudgetGroups');
    userEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(spyOnSubmit).toHaveBeenCalledTimes(1);
      expect(spyOnSubmit).toMatchSnapshot();
    });

    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons.length).toEqual(2);

    userEvent.click(removeButtons[0]);
    await waitFor(() => {
      budgetFieldsetExpenseGroups = screen.getAllByTestId('budget-fieldset-expense-group');
      expect(budgetFieldsetExpenseGroups.length).toEqual(1);
      expect(budgetFieldsetExpenseGroups[0]).not.toHaveTextContent('50%');
      expect(budgetFieldsetExpenseGroups[0]).toHaveTextContent('40%');

      budgetFieldsetTargetSavings = screen.getByTestId('budget-fieldset-target-savings');
      expect(budgetFieldsetTargetSavings).not.toHaveTextContent('10%');
      expect(budgetFieldsetTargetSavings).toHaveTextContent('60%');
    });

    userEvent.click(removeButtons[1]);
    await waitFor(() => {
      budgetFieldsetExpenseGroups = screen.queryAllByTestId('budget-fieldset-expense-group');
      expect(budgetFieldsetExpenseGroups.length).toEqual(0);

      budgetFieldsetTargetSavings = screen.getByTestId('budget-fieldset-target-savings');
      expect(budgetFieldsetTargetSavings).not.toHaveTextContent('60%');
      expect(budgetFieldsetTargetSavings).toHaveTextContent('100%');
    });
    expect(screen.getByText('No expenses in budget')).toBeVisible();

    userEvent.click(screen.getByText('Add new'));
    await waitFor(() => {
      budgetFieldsetExpenseGroups = screen.getAllByTestId('budget-fieldset-expense-group');
      expect(budgetFieldsetExpenseGroups.length).toEqual(1);
      expect(budgetFieldsetExpenseGroups[0]).toHaveTextContent('0%');
    });

    expenseGroupTargetAmountInput = screen.getAllByPlaceholderText('$0.00');
    expect(expenseGroupTargetAmountInput.length).toEqual(3);
    expect(screen.getByText('Save')).toHaveAttribute('disabled');

    userEvent.type(expenseGroupTargetAmountInput[1], '1500');
    await waitFor(() => {
      budgetFieldsetExpenseGroups = screen.getAllByTestId('budget-fieldset-expense-group');
      expect(budgetFieldsetExpenseGroups[0]).toHaveTextContent('150%');
    });
    budgetFieldsetTargetSavings = screen.getByTestId('budget-fieldset-target-savings');
    expect(budgetFieldsetTargetSavings).toHaveTextContent('-50%');
    expect(screen.getByText('Save')).toHaveAttribute('disabled');
  });

  // TODO: test('Budget page displays the correct data when auto-budget is disabled', async () => {});
});
