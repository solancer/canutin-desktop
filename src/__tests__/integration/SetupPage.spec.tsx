import { screen } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';

import { DATABASE_NOT_DETECTED } from '@constants';
import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT } from '@constants/events';
import { initAppWith, initAppWithContexts } from '@tests/utils/initApp.utils';

test('Setup Page in case there is not a database set', async () => {
  mocked(ipcRenderer).on.mockImplementation((event, callback) => {
    if (event === DATABASE_NOT_DETECTED) {
      callback((event as unknown) as IpcRendererEvent);
    }

    return ipcRenderer;
  });

  initAppWithContexts();
  expect(await screen.getByText('New vault')).toBeInTheDocument();
  expect(screen.getByText(/Choose Vault/i)).toBeInTheDocument();
  expect(screen.getByText('Existing vault')).toBeInTheDocument();
  expect(screen.getAllByText(/Canutin setup/i)).toHaveLength(1);

  const spyOnIpcRenderer = jest.spyOn(ipcRenderer, 'send');
  const onCreateNewVault = screen.getByRole('button', { name: /Create a brand new vault/i });
  userEvent.click(onCreateNewVault);
  expect(spyOnIpcRenderer).toBeCalledWith(OPEN_CREATE_VAULT);

  const onUseExisitngVault = screen.getByRole('button', { name: /Locate an existing vault file/i });
  userEvent.click(onUseExisitngVault);
  expect(spyOnIpcRenderer).toBeCalledWith(OPEN_EXISTING_VAULT);
});

test('Setup Page in case there is a database set', async () => {
  initAppWith({});
  expect(screen.queryByText(/Canutin setup/i)).not.toBeInTheDocument();
  expect(screen.getByText('Balance sheet')).toBeInTheDocument();
  expect(screen.getByText('Budget')).toBeInTheDocument();
  expect(screen.getByText('Transactions')).toBeInTheDocument();
  expect(screen.getByText('Trends')).toBeInTheDocument();
  expect(screen.getByText('Settings')).toBeInTheDocument();
  expect(screen.getAllByText(/Add accounts or assets/i)).toHaveLength(3);
});
