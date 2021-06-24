import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';
import { DATABASE_CONNECTED } from '@constants';
import { DB_GET_ACCOUNTS_ACK, DB_GET_ACCOUNTS, DB_NEW_ASSET } from '@constants/events';
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
    render(<AppCtxProvider><App /></AppCtxProvider>);

    const addAccountsOrAssetsButton = screen.getByText('Add accounts or assets').closest('a');

    if (addAccountsOrAssetsButton) {
      userEvent.click(addAccountsOrAssetsButton);
    }
    const onCreateNewAccountByHand = screen.getByRole('button', { name: /By hand/i });
    userEvent.click(onCreateNewAccountByHand);
  });

  test('Create new asset with required fields and with account', async () => {
    const addAssetByHandOptions = screen.getByLabelText('Asset');
    userEvent.click(addAssetByHandOptions);
    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    expect(spySendIpcRenderer).toBeCalledWith(DB_GET_ACCOUNTS);
    const addAccountsOrAssetsButton = screen.getByText('Add accounts or assets').closest('a');
    expect(screen.getByRole('form')).toHaveFormValues({});
    expect(addAccountsOrAssetsButton).toHaveAttribute('href', '/account/addAccountOrAsset');

    await selectEvent.select(screen.getByLabelText('Asset type'), 'Vehicle');

    // Required fields
    const nameInput = screen.getByLabelText('Name');
    const quantityInput = screen.getByLabelText('Quantity');
    const costInput = screen.getByLabelText('Cost');
    const valueInput = screen.getByLabelText('Value');
    
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    expect(continueButton).toBeDisabled();

    userEvent.type(nameInput, 'Test asset');
    userEvent.type(quantityInput, '2');
    userEvent.type(costInput, '25');

    await waitFor(() => {
      expect(nameInput).toHaveValue('Test asset');
      expect(quantityInput).toHaveValue(2);
      expect(costInput).toHaveValue(25);
      expect(valueInput).toHaveValue('$ 50');
      expect(continueButton).not.toBeDisabled();
    });

    userEvent.click(continueButton);
    await waitFor(() => {
      expect(spySendIpcRenderer).toHaveBeenLastCalledWith(DB_NEW_ASSET, {
        assetType: 'vehicle',
        cost: "25",
        quantity: "2",
        name: "Test asset"
      });
    });
  });
});
