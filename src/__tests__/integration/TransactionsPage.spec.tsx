import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { endOfDay, format, startOfDay, startOfToday } from 'date-fns';

// Fixes `ReferenceError: regeneratorRuntime is not defined` error on `useAsyncDebounce`.
// REF: https://github.com/tannerlinsley/react-table/issues/2071
import 'regenerator-runtime/runtime';

import { dateInUTC } from '@app/utils/date.utils';
import { accountCheckingDetails } from '@database/seed/demoData/accounts';
import { accountCheckingTransactionSet } from '@database/seed/demoData/transactions';
import { filters } from '@app/constants/filters';
import mapCategories from '@database/helpers/importResources/mapCategories';
import { initAppWith } from '@tests/utils/initApp.utils';
import { seedMinimumAccount } from '@tests/factories/entitiesFactory';
import { DB_NEW_TRANSACTION } from '@constants/events';

describe('Transactions tests', () => {
  test("Sidebar link can't be clicked if no accounts or assets are present", async () => {
    initAppWith({});
    const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
    expect(transactionsSidebarLink).toHaveAttribute('disabled');
    expect(transactionsSidebarLink).toHaveAttribute('active', '0');
    expect(transactionsSidebarLink).toHaveStyle('pointer-events: none');
  });

  test('Transactions page displays an empty view when no enough data is available', async () => {
    initAppWith({ accounts: seedMinimumAccount });
    const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
    expect(transactionsSidebarLink).toHaveAttribute('active', '0');
    expect(transactionsSidebarLink).not.toHaveAttribute('disabled');
    expect(transactionsSidebarLink).toHaveAttribute('href', '#/transactions');

    userEvent.click(transactionsSidebarLink);
    expect(transactionsSidebarLink).toHaveAttribute('active', '1');
    await waitFor(() => {
      expect(screen.getByText('No transactions were found')).toBeVisible();
    });

    const scrollViewTransactions = screen.getByTestId('scrollview-transactions');
    expect(scrollViewTransactions).toMatchSnapshot();
  });

  test('Transactions page displays the correct data', async () => {
    const seedTransactionsThisMonth = accountCheckingTransactionSet()
      .filter(transaction => {
        // Mimic the logic in `TransactionRepository.getFilterTransactions()`
        const dateFrom = startOfDay(dateInUTC(filters[0].dateFrom));
        const dateTo = endOfDay(dateInUTC(filters[0].dateTo));
        return transaction.date >= dateFrom && transaction.date <= dateTo;
      })
      .map(transaction => ({
        ...transaction,
        account: { ...accountCheckingDetails },
        category: { name: mapCategories(transaction.categoryName) },
      }));

    initAppWith({ accounts: seedMinimumAccount, filterTransactions: seedTransactionsThisMonth });
    userEvent.click(screen.getByTestId('sidebar-big-picture')); // Resets path back to the default
    const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
    expect(transactionsSidebarLink).toHaveAttribute('active', '0');
    expect(transactionsSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(transactionsSidebarLink);
    expect(transactionsSidebarLink).toHaveAttribute('active', '1');

    await waitFor(() => {
      const cardTransactions = screen.getByTestId('card-transactions');
      expect(cardTransactions).toHaveTextContent('Transactions');
      expect(cardTransactions).toHaveTextContent('8');
    });

    let cardNetBalance = screen.getByTestId('card-net-balance');
    expect(cardNetBalance).toHaveTextContent('Net balance');
    expect(cardNetBalance).toHaveTextContent('$350');
    expect(cardNetBalance).not.toHaveTextContent('-$350');

    let rowTransactions = screen.getAllByTestId('row-transaction');
    expect(rowTransactions.length).toBe(8);
    expect(rowTransactions[0]).toHaveTextContent('Toyota - TFS Payment');
    expect(rowTransactions[0]).toHaveTextContent('Automotive');
    expect(rowTransactions[0]).toHaveTextContent("Alice's Checking");
    expect(rowTransactions[0]).toHaveTextContent('-$500');
    expect(rowTransactions[7]).toHaveTextContent('Westside Apartments');
    expect(rowTransactions[7]).toHaveTextContent('Housing');
    expect(rowTransactions[7]).toHaveTextContent("Alice's Checking");
    expect(rowTransactions[7]).toHaveTextContent('-$2,250');

    const tableHeaderDate = screen.getByText('Date');
    const tableHeaderAmount = screen.getByText('Amount');
    expect(tableHeaderDate).toBeVisible();
    expect(tableHeaderAmount).toBeVisible();
    expect(screen.getByText('Description')).toBeVisible();
    expect(screen.getByText('Category')).toBeVisible();
    expect(screen.getByText('Account')).toBeVisible();

    // Sort by "Date" (ascending)
    userEvent.click(tableHeaderDate);
    rowTransactions = screen.getAllByTestId('row-transaction');
    expect(rowTransactions[0]).toHaveTextContent('Westside Apartments');
    expect(rowTransactions[0]).toHaveTextContent('-$2,250');
    expect(rowTransactions[0]).not.toHaveTextContent('Toyota - TFS Payment');

    // Sort by "Amount" (ascending)
    userEvent.click(tableHeaderAmount);
    rowTransactions = screen.getAllByTestId('row-transaction');
    expect(rowTransactions[0]).toHaveTextContent('-$2,250');
    expect(rowTransactions[0]).not.toHaveTextContent('$2,800');

    // Sort by "Amount" (descending)
    userEvent.click(tableHeaderAmount);
    rowTransactions = screen.getAllByTestId('row-transaction');
    expect(rowTransactions[0]).toHaveTextContent('$2,800');
    expect(rowTransactions[0]).not.toHaveTextContent('-$2,250');
    expect(rowTransactions[7]).toHaveTextContent('-$2,250');

    // Filter by "Credits"
    userEvent.click(screen.getByText(/Credits/i));
    cardNetBalance = screen.getByTestId('card-net-balance');
    expect(cardNetBalance).toHaveTextContent('$5,600');

    rowTransactions = screen.getAllByTestId('row-transaction');
    expect(rowTransactions.length).toBe(3);
    expect(rowTransactions[0]).toHaveTextContent('$2,800');
    expect(rowTransactions[2]).toHaveTextContent('$0');
    expect(rowTransactions[2]).not.toHaveTextContent('-$2,250');

    // Filter by "Debits"
    userEvent.click(screen.getByText(/Debits/i));
    cardNetBalance = screen.getByTestId('card-net-balance');
    expect(cardNetBalance).toHaveTextContent('-$5,250');

    rowTransactions = screen.getAllByTestId('row-transaction');
    expect(rowTransactions.length).toBe(5);
    expect(rowTransactions[0]).toHaveTextContent('-$250');
    expect(rowTransactions[0]).not.toHaveTextContent('$2,800');
    expect(rowTransactions[4]).toHaveTextContent('-$2,250');

    // Filter by "All"
    userEvent.click(screen.getByText(/All/i));
    cardNetBalance = screen.getByTestId('card-net-balance');
    expect(cardNetBalance).toHaveTextContent('$350');

    rowTransactions = screen.getAllByTestId('row-transaction');
    expect(rowTransactions.length).toBe(8);
    expect(rowTransactions[0]).toHaveTextContent('$2,800');
    expect(rowTransactions[7]).toHaveTextContent('-$2,250');

    // Filter by keyword
    const inputSearch = screen.getByPlaceholderText(
      'Type to filter by date, description, category, account or amount'
    );
    userEvent.type(inputSearch, 'transfer to');
    await waitFor(() => {
      expect(screen.getAllByTestId('row-transaction').length).toBe(3);

      rowTransactions = screen.getAllByTestId('row-transaction');
      expect(rowTransactions.length).toBe(3);
      expect(rowTransactions[0].textContent).toContain('Transfer to MegaCoin Exchange');
      expect(rowTransactions[1].textContent).toContain('Transfer to Ransack Savings');
      expect(rowTransactions[2].textContent).toContain('Transfer to Loot Financial');
    });

    // Change date filter
    const selectLast3Months = screen.getByText('Last 3 months');
    await selectEvent.openMenu(selectLast3Months);
    expect(screen.getByText('This month')).toBeVisible();
    expect(screen.getByText('Last 6 months')).toBeVisible();
    expect(screen.getByText('Last 12 months')).toBeVisible();
    expect(screen.getByText('Year to date')).toBeVisible();
    expect(screen.getByText('Last year')).toBeVisible();
    expect(screen.getByText('Lifetime')).toBeVisible();

    // FIXME: onChange event is not fired when an option in `<CustomSelect>` is selected
    // await selectEvent.select(selectLast3Months, 'Last 6 months');
    // const spyOnIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    // const { dateFrom, dateTo } = filters.find(filter => {
    //   return filter.label === 'Last 6 months';
    // })!;
    // await waitFor(() => {
    //   expect(screen.queryByText('Last 3 months')).not.toBeVisible();
    //   expect(spyOnIpcRenderer).toHaveBeenCalledWith(FILTER_TRANSACTIONS, {
    //     dateFrom: dateFrom,
    //     dateTo: dateTo,
    //   });
    // });
  });

  test('Create a new transaction by hand', async () => {
    initAppWith({ accounts: seedMinimumAccount });
    const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
    userEvent.click(transactionsSidebarLink);
    expect(screen.getByText(/Browse transactions/i)).toBeInTheDocument();

    userEvent.click(screen.getByText('Add transaction'));
    expect(screen.queryByText(/Browse transactions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Transaction details/i)).toBeInTheDocument();
    expect(screen.getByText("Alice's Checking")).toBeVisible();
    expect(screen.getByText('Uncategorized')).toBeVisible();
    expect(screen.getByRole('form')).toHaveFormValues({});

    // Date field
    const today = new Date();
    expect(screen.getByText(format(today, 'yyyy'))).toBeVisible();
    expect(screen.getByText(format(today, 'MMM'))).toBeVisible();
    expect(screen.getByText(format(today, 'd'))).toBeVisible();

    const buttonAddTransaction = screen.getByRole('button', { name: /Add transaction/i });
    await waitFor(() => {
      expect(buttonAddTransaction).toBeDisabled();
    });

    const inputDescription = screen.getByLabelText('Description');
    const inputExcludeFromTotals = screen.getByLabelText('Exclude from totals');
    userEvent.type(inputDescription, 'Evergreen Market');
    userEvent.click(inputExcludeFromTotals);
    expect(buttonAddTransaction).toBeDisabled();

    userEvent.click(inputExcludeFromTotals);
    expect(buttonAddTransaction).toBeDisabled();

    const inputAmount = screen.getByLabelText('Amount');
    userEvent.type(inputAmount, '135.5');
    expect(inputAmount).toHaveValue('+$135.5');

    userEvent.type(inputAmount, '-');
    expect(inputAmount).toHaveValue('-$135.5');
    await waitFor(() => {
      expect(buttonAddTransaction).not.toBeDisabled();
    });

    await selectEvent.select(screen.getByLabelText('Category'), 'Groceries');
    userEvent.click(buttonAddTransaction);
    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    await waitFor(() => {
      expect(spySendIpcRenderer).toHaveBeenLastCalledWith(DB_NEW_TRANSACTION, {
        accountId: 1,
        amount: -135.5,
        categoryName: 'Groceries',
        date: dateInUTC(startOfToday()),
        description: 'Evergreen Market',
        excludeFromTotals: false,
        pending: false,
        id: undefined,
      });
    });
  });
});
