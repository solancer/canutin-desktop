import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import { DB_NEW_ACCOUNT } from '@constants/events';
import { initAppWith } from '@tests/utils/initApp.utils';

describe('Add account by Hand tests', () => {
  beforeEach(() => {
    initAppWith({});
    const addAccountsOrAssetsSidebarLink = screen.getByTestId('sidebar-add-account-or-assets');
    userEvent.click(addAccountsOrAssetsSidebarLink);
  });

  test('Sidebar link can be clicked if no accounts or assets are present', async () => {
    const addAccountsOrAssetsSidebarLink = screen.getByTestId('sidebar-add-account-or-assets');
    expect(addAccountsOrAssetsSidebarLink).toHaveAttribute('active', '1');
    expect(addAccountsOrAssetsSidebarLink).not.toHaveAttribute('disabled');
    expect(addAccountsOrAssetsSidebarLink).toHaveAttribute('href', '#/addAccountOrAsset');
  });

  test('Create new account only with required fields', async () => {
    const buttonAddByHand = screen.getByText('By hand');
    expect(buttonAddByHand).toBeInTheDocument();

    userEvent.click(buttonAddByHand);
    userEvent.click(screen.getByLabelText('Account'));
    await selectEvent.select(screen.getByLabelText('Account type'), 'Checking');

    // Required fields
    const nameInput = screen.getByLabelText('Name');
    const autoCalculatedInput = screen.getByLabelText('Auto-calculate from transactions');
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    expect(continueButton).toBeDisabled();

    userEvent.type(nameInput, "Alice's Checking");
    userEvent.click(autoCalculatedInput);
    await waitFor(() => {
      expect(nameInput).toHaveValue("Alice's Checking");
      expect(autoCalculatedInput).toBeChecked();
      expect(continueButton).not.toBeDisabled();
    });

    userEvent.click(autoCalculatedInput);
    await waitFor(() => {
      expect(continueButton).toBeDisabled();
    });
    userEvent.click(autoCalculatedInput);
    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toBeCalledWith(DB_NEW_ACCOUNT, {
        name: "Alice's Checking",
        balanceGroup: undefined,
        accountType: 'checking',
        autoCalculated: true,
        closed: false,
        officialName: '',
        institution: '',
        balanceStatements: [{ createdAt: expect.any(Number), value: null }],
      });
    });
  });

  test('Create new account with optional fields', async () => {
    const buttonAddByHand = screen.getByText('By hand');
    expect(buttonAddByHand).toBeInTheDocument();

    userEvent.click(buttonAddByHand);
    userEvent.click(screen.getByLabelText('Account'));
    await selectEvent.select(screen.getByLabelText('Account type'), 'Auto loan');
    const nameInput = screen.getByLabelText('Name');
    const officialNameInput = screen.getByLabelText('Official name / Optional');
    const institutionInput = screen.getByLabelText('Institution / Optional');
    const balanceInput = screen.getByLabelText('Balance');
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(continueButton).toBeDisabled();

    // Fill inputs
    userEvent.type(nameInput, 'Ford Auto Loan');
    userEvent.type(officialNameInput, 'Ford F-150 Loan (36 months)');
    userEvent.type(institutionInput, 'Ford Financial Services');
    userEvent.type(balanceInput, '-42500');

    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
      expect(nameInput).toHaveValue('Ford Auto Loan');
      expect(officialNameInput).toHaveValue('Ford F-150 Loan (36 months)');
      expect(institutionInput).toHaveValue('Ford Financial Services');
      expect(balanceInput).toHaveValue('-$42,500');
    });

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toBeCalledWith(DB_NEW_ACCOUNT, {
        name: 'Ford Auto Loan',
        balanceGroup: undefined,
        accountType: 'auto',
        autoCalculated: false,
        closed: false,
        officialName: 'Ford F-150 Loan (36 months)',
        institution: 'Ford Financial Services',
        balanceStatements: [{ createdAt: expect.any(Number), value: '-42500' }],
      });
    });
  });
});
