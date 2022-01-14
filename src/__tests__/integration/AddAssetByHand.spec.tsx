import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import { DB_NEW_ASSET } from '@constants/events';
import { initAppWith } from '@tests/utils/initApp.utils';

describe('Add asset by Hand tests', () => {
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

  test('Create new asset with Vehicle category', async () => {
    const buttonAddByHand = screen.getByText('By hand');
    expect(buttonAddByHand).toBeInTheDocument();

    userEvent.click(buttonAddByHand);
    userEvent.click(screen.getByLabelText('Asset'));
    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    expect(screen.getByRole('form')).toHaveFormValues({});

    await selectEvent.select(screen.getByLabelText('Asset type'), 'Vehicle');

    // Required fields
    const nameInput = screen.getByLabelText('Name');
    const valueInput = screen.getByLabelText('Value');

    const continueButton = screen.getByRole('button', { name: /Continue/i });
    expect(continueButton).toBeDisabled();

    userEvent.type(nameInput, '2022 Ford F-150');
    userEvent.type(valueInput, '77970');

    await waitFor(() => {
      expect(nameInput).toHaveValue('2022 Ford F-150');
      expect(valueInput).toHaveValue('+$77,970');
      expect(continueButton).not.toBeDisabled();
    });

    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toHaveBeenLastCalledWith(DB_NEW_ASSET, {
        name: '2022 Ford F-150',
        assetType: 'vehicle',
        sold: false,
        balanceStatements: [
          {
            createdAt: expect.any(Number),
            quantity: undefined,
            cost: undefined,
            value: '77970',
          },
        ],
      });
    });
  });

  test('Create new asset with Cryptocurrency category', async () => {
    const buttonAddByHand = screen.getByText('By hand');
    expect(buttonAddByHand).toBeInTheDocument();

    userEvent.click(buttonAddByHand);
    userEvent.click(screen.getByLabelText('Asset'));
    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    expect(screen.getByRole('form')).toHaveFormValues({});

    await selectEvent.select(screen.getByLabelText('Asset type'), 'Cryptocurrency');

    // Required fields
    const nameInput = screen.getByLabelText('Name');
    const quantityInput = screen.getByLabelText('Quantity');
    const costInput = screen.getByLabelText('Cost');
    const valueInput = screen.getByLabelText('Value');

    // Optional fields
    const symbolInput = screen.getByLabelText('Symbol / Optional');
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    expect(continueButton).toBeDisabled();
    expect(valueInput).toBeDisabled();

    userEvent.type(nameInput, 'Bitcoin');
    userEvent.type(quantityInput, '2');
    userEvent.type(costInput, '50000');

    await waitFor(() => {
      expect(nameInput).toHaveValue('Bitcoin');
      expect(valueInput).toHaveValue('$100,000');
      expect(continueButton).not.toBeDisabled();
    });

    userEvent.type(symbolInput, 'BTC');
    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toHaveBeenLastCalledWith(DB_NEW_ASSET, {
        name: 'Bitcoin',
        balanceGroup: undefined,
        assetType: 'cryptocurrency',
        symbol: 'BTC',
        sold: false,
        balanceStatements: [
          {
            createdAt: expect.any(Number),
            quantity: '2',
            cost: '50000',
            value: '100000',
          },
        ],
      });
    });
  });
});
