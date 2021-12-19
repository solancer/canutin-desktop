import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';
import { DATABASE_CONNECTED } from '@constants';
import { DB_GET_ACCOUNTS_ACK, DB_NEW_ASSET } from '@constants/events';
import { accountBuilder } from '@tests/factories/accountFactory';

import { render } from '@tests/utils';

describe('Add asset by Hand tests', () => {
  const accountMock = accountBuilder();

  beforeEach(() => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      if (event === DB_GET_ACCOUNTS_ACK) {
        callback((event as unknown) as IpcRendererEvent, [accountMock]);
      }

      return ipcRenderer;
    });
    render(
      <AppCtxProvider>
        <App />
      </AppCtxProvider>
    );

    const addAccountsOrAssetsButton = screen.getByTestId('sidebar-add-account-or-assets');

    if (addAccountsOrAssetsButton) {
      userEvent.click(addAccountsOrAssetsButton);
    }
    const onCreateNewAccountByHand = screen.getByRole('button', { name: /By hand/i });
    userEvent.click(onCreateNewAccountByHand);
  });

  test('Create new asset with Vehicle category', async () => {
    const addAssetByHandOptions = screen.getByLabelText('Asset');
    userEvent.click(addAssetByHandOptions);
    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    const addAccountsOrAssetsButton = screen.getByTestId('sidebar-add-account-or-assets');
    expect(screen.getByRole('form')).toHaveFormValues({});
    expect(addAccountsOrAssetsButton).toHaveAttribute('href', '/addAccountOrAsset');

    await selectEvent.select(screen.getByLabelText('Asset type'), 'Vehicle');

    // Required fields
    const nameInput = screen.getByLabelText('Name');
    const valueInput = screen.getByLabelText('Value');

    const continueButton = screen.getByRole('button', { name: /Continue/i });
    expect(continueButton).toBeDisabled();

    userEvent.type(nameInput, 'Test asset');
    userEvent.type(valueInput, '200');

    await waitFor(() => {
      expect(nameInput).toHaveValue('Test asset');
      expect(valueInput).toHaveValue('+$200');
      expect(continueButton).not.toBeDisabled();
    });

    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toHaveBeenLastCalledWith(DB_NEW_ASSET, {
        name: 'Test asset',
        assetType: 'vehicle',
        sold: false,
        balanceStatements: [
          {
            createdAt: expect.any(Number),
            quantity: undefined,
            cost: undefined,
            value: '200',
          },
        ],
      });
    });
  });

  test('Create new asset with Cryptocurrency category', async () => {
    const addAssetByHandOptions = screen.getByLabelText('Asset');
    userEvent.click(addAssetByHandOptions);
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

    userEvent.type(nameInput, 'Test Cryptocurrency');
    userEvent.type(quantityInput, '2');
    userEvent.type(costInput, '200');

    await waitFor(() => {
      expect(nameInput).toHaveValue('Test Cryptocurrency');
      expect(valueInput).toHaveValue('$400');
      expect(continueButton).not.toBeDisabled();
    });

    userEvent.type(symbolInput, 'USD');

    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toHaveBeenLastCalledWith(DB_NEW_ASSET, {
        name: 'Test Cryptocurrency',
        balanceGroup: undefined,
        assetType: 'cryptocurrency',
        symbol: 'USD',
        sold: false,
        balanceStatements: [
          {
            createdAt: expect.any(Number),
            quantity: '2',
            cost: '200',
            value: '400',
          },
        ],
      });
    });
  });
});
