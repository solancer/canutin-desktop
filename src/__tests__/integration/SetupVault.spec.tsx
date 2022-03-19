import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import userEvent from '@testing-library/user-event';
import { mocked } from 'jest-mock';

import {
  initAppWith,
  initAppWithContexts,
  mockIpcRendererOnEvents,
} from '@tests/utils/initApp.utils';
import {
  VAULT_NOT_SET,
  VAULT_OPEN_SAVE_DIALOG,
  VAULT_OPEN_EXISTING_FILE_DIALOG,
  VAULT_UNLOCK,
} from '@constants/vault';
import { APP_SAFE_STORAGE_ACK, APP_VERSION_ACK } from '@constants/app';
import { seedMinimumAccount } from '@tests/factories/entitiesFactory';

test('Setup Page in case there is not a vault set', async () => {
  mockIpcRendererOnEvents([
    {
      eventName: VAULT_NOT_SET,
      eventValue: null,
    },
    {
      eventName: APP_SAFE_STORAGE_ACK,
      eventValue: true,
    },
  ]);

  initAppWithContexts();
  await waitFor(() => {
    expect(screen.getByText('New vault')).toBeInTheDocument();
    expect(screen.getByText(/Choose vault/i)).toBeInTheDocument();
    expect(screen.getByText('Existing vault')).toBeInTheDocument();
    expect(screen.getAllByText(/Vault setup/i)).toHaveLength(2);
  });

  mocked(ipcRenderer).invoke.mockImplementation((event, value) => {
    if (event === VAULT_OPEN_SAVE_DIALOG) {
      return Promise.resolve('Canutin.test.vault');
    }
    return Promise.resolve(value);
  });

  const spyOnIpcRendererInvoke = jest.spyOn(ipcRenderer, 'invoke');
  const spyOnIpcRendererSend = jest.spyOn(ipcRenderer, 'send');
  const onCreateNewVault = screen.getByRole('button', { name: /Create a brand new vault/i });
  userEvent.click(onCreateNewVault);
  await waitFor(() => {
    expect(spyOnIpcRendererInvoke).toBeCalledWith(VAULT_OPEN_SAVE_DIALOG);
    expect(screen.queryByText('New vault')).not.toBeInTheDocument();
    expect(screen.getByText('Vault encryption')).toBeInTheDocument();
    expect(screen.getByLabelText('Current vault')).toHaveValue('Canutin.test.vault');
    expect(screen.getByLabelText('Master key')).toHaveValue('');
    expect(screen.getByLabelText('Remember on this computer')).not.toBeChecked();
    expect(screen.getByText('Write down your master key somewhere safe')).toBeInTheDocument();
    expect(screen.getByText('Create vault')).toBeDisabled();
  });

  userEvent.click(screen.getByLabelText('Remember on this computer'));
  userEvent.type(screen.getByLabelText('Master key'), '1234567890');
  await waitFor(() => {
    expect(screen.getByLabelText('Remember on this computer')).toBeChecked();
    expect(screen.getByText('Create vault')).not.toBeDisabled();
  });

  userEvent.click(screen.getByText('Create vault'));
  await waitFor(() => {
    expect(spyOnIpcRendererSend).toBeCalledWith(VAULT_UNLOCK, {
      rememberVaultMasterKey: true,
      vaultMasterKey: '1234567890',
      vaultPath: 'Canutin.test.vault',
    });
  });

  mocked(ipcRenderer).invoke.mockImplementation((event, value) => {
    if (event === VAULT_OPEN_EXISTING_FILE_DIALOG) {
      return Promise.resolve('Canutin.test.vault');
    }
    return Promise.resolve(value);
  });

  mockIpcRendererOnEvents([
    {
      eventName: APP_SAFE_STORAGE_ACK,
      eventValue: false,
    },
  ]);

  userEvent.click(screen.getByText('Cancel'));
  await waitFor(() => {
    const onUseExisitngVault = screen.getByRole('button', {
      name: /Locate an existing vault file/i,
    });
    userEvent.click(onUseExisitngVault);
  });
  await waitFor(() => {
    expect(spyOnIpcRendererInvoke).toBeCalledWith(VAULT_OPEN_EXISTING_FILE_DIALOG);
    expect(screen.queryByText('Existing vault')).not.toBeInTheDocument();
    expect(screen.getByText('Vault encryption')).toBeInTheDocument();
    expect(screen.getByLabelText('Current vault')).toHaveValue('Canutin.test.vault');
    expect(screen.getByLabelText('Master key')).toHaveValue('');
    expect(screen.getByLabelText('Remember on this computer')).not.toBeChecked();
    expect(screen.queryByText('Write down your master key somewhere safe')).not.toBeInTheDocument();
    expect(screen.getByText('Unlock vault')).toBeDisabled();
  });

  userEvent.click(screen.getByLabelText('Remember on this computer'));
  userEvent.type(screen.getByLabelText('Master key'), '1234567890');
  await waitFor(() => {
    expect(screen.getByLabelText('Remember on this computer')).not.toBeChecked();
    expect(screen.getByText('Unlock vault')).not.toBeDisabled();
  });

  userEvent.click(screen.getByText('Unlock vault'));
  await waitFor(() => {
    expect(spyOnIpcRendererSend).toBeCalledWith(VAULT_UNLOCK, {
      rememberVaultMasterKey: false,
      vaultMasterKey: '1234567890',
      vaultPath: 'Canutin.test.vault',
    });
  });
});

test('Settings Page in case there is a vault set', async () => {
  initAppWith({ accounts: seedMinimumAccount });
  expect(screen.queryByText(/Vault setup/i)).not.toBeInTheDocument();
  expect(screen.getByText('Balance sheet')).toBeInTheDocument();
  expect(screen.getByText('Budget')).toBeInTheDocument();
  expect(screen.getByText('Transactions')).toBeInTheDocument();
  expect(screen.getByText('Trends')).toBeInTheDocument();
  expect(screen.getByText('Settings')).toBeInTheDocument();
  expect(screen.getAllByText(/Add or update data/i)).toHaveLength(1);

  mockIpcRendererOnEvents([
    {
      eventName: APP_VERSION_ACK,
      eventValue: '1.0.0',
    },
  ]);

  userEvent.click(screen.getByText('Settings'));
  await waitFor(() => {
    expect(screen.getByLabelText('Current vault')).toHaveValue('Canutin.test.vault');
    expect(screen.getByLabelText('Language')).toHaveValue('English');
    expect(screen.getByLabelText('Currency')).toHaveValue('USD $');
    expect(screen.getByLabelText('Date format')).toHaveValue('YYYY/MM/DD');
    expect(screen.getByLabelText('Number format')).toHaveValue('$111,222.33');
    expect(screen.getByLabelText('First day of the week')).toHaveValue('Monday');
    expect(screen.getByLabelText('Version')).toHaveValue('1.0.0');
  });

  userEvent.click(screen.getByText('Switch vault'));
  await waitFor(() => {
    expect(screen.getByText('New vault')).toBeInTheDocument();
    expect(screen.getByText('Existing vault')).toBeInTheDocument();
    expect(screen.queryByText('Current vault')).not.toBeInTheDocument();
  });
});
