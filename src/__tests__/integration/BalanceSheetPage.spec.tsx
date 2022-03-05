import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { seedAccounts, seedAssets, seedMinimumAccount } from '@tests/factories/entitiesFactory';
import { initAppWith } from '@tests/utils/initApp.utils';

describe('Balance sheet tests', () => {
  test("Sidebar link can't be clicked if no accounts or assets are present", async () => {
    initAppWith({});
    const balanceSheetSidebarLink = screen.getByTestId('sidebar-balance-sheet');
    expect(balanceSheetSidebarLink).toHaveAttribute('disabled');
    expect(balanceSheetSidebarLink).toHaveAttribute('active', '0');
    expect(balanceSheetSidebarLink).toHaveStyle('pointer-events: none');
  });

  test('Balance sheet page displays an empty view when no enough data is available', async () => {
    initAppWith({ accounts: seedMinimumAccount });
    userEvent.click(screen.getByTestId('sidebar-big-picture')); // Resets path back to the default
    const balanceSheetSidebarLink = screen.getByTestId('sidebar-balance-sheet');
    expect(balanceSheetSidebarLink).toHaveAttribute('active', '0');
    expect(balanceSheetSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(balanceSheetSidebarLink);
    expect(balanceSheetSidebarLink).toHaveAttribute('active', '1');

    const scrollViewBalanceSheet = screen.getByTestId('scrollview-balance-sheet');
    expect(scrollViewBalanceSheet).toMatchSnapshot();

    const buttonAddNew = screen.getByText('Add new');
    userEvent.click(buttonAddNew);
    expect(screen.getByText('Import wizard')).toBeVisible();
    expect(screen.getByText('By hand')).toBeVisible();
    expect(balanceSheetSidebarLink).toHaveAttribute('active', '0');

    userEvent.click(balanceSheetSidebarLink);
    expect(screen.getByText('Other assets')).toBeVisible();
    expect(balanceSheetSidebarLink).toHaveAttribute('active', '1');

    const buttonImport = screen.getByText('Import');
    userEvent.click(buttonImport);
    expect(
      screen.getByText('Add or update accounts, assets, balances and transactions')
    ).toBeVisible();
    expect(balanceSheetSidebarLink).toHaveAttribute('active', '0');

    expect(screen.getByTestId('button-back')).toBeVisible();
    // FIXME: clicking on this button normally takes the user back to
    // "Balance sheet" but doesn't work here, I'm guessing it has something to
    // do with the way react-router-dom works in tests.
  });

  test('Balance sheet page displays the correct data', async () => {
    initAppWith({ accounts: seedAccounts, assets: seedAssets });
    userEvent.click(screen.getByTestId('sidebar-big-picture')); // Resets path back to the default
    const balanceSheetSidebarLink = screen.getByTestId('sidebar-balance-sheet');
    expect(balanceSheetSidebarLink).toHaveAttribute('active', '0');
    expect(balanceSheetSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(balanceSheetSidebarLink);
    expect(balanceSheetSidebarLink).toHaveAttribute('active', '1');

    const scrollViewBalanceSheetAll = screen.getByTestId('scrollview-balance-sheet');
    expect(scrollViewBalanceSheetAll).toMatchSnapshot();

    userEvent.click(screen.getByText(/Accounts 7/i));
    const scrollViewBalanceSheetAccounts = screen.getByTestId('scrollview-balance-sheet');
    expect(scrollViewBalanceSheetAccounts).toMatchSnapshot();

    userEvent.click(screen.getByText(/Assets 6/i));
    const scrollViewBalanceSheetAssets = screen.getByTestId('scrollview-balance-sheet');
    expect(scrollViewBalanceSheetAssets).toMatchSnapshot();

    userEvent.click(screen.getByText(/All/i));
    expect(screen.getByText("Alice's Checking")).toBeVisible();
    expect(screen.getByText('Bitcoin')).toBeVisible();
  });
});
