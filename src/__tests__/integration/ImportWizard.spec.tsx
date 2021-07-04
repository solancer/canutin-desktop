import { screen } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';
import { DATABASE_CONNECTED } from '@constants';
import {
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE_ACK,
  DB_GET_ACCOUNTS_ACK,
} from '@constants/events';
import { accountBuilder } from '@tests/factories/accountFactory';
import { render } from '@tests/utils';

import canutinFile from '../data/canutinFile.json';
import csvMetadata from '../data/csvMetadata.json';
import csvSourceData from '../data/csvSourceData.json';

const initImportWizard = () => {
  render(
    <AppCtxProvider>
      <App />
    </AppCtxProvider>
  );

  const addAccountsOrAssetsButton = screen.getByText('Add accounts or assets').closest('a');

  if (addAccountsOrAssetsButton) {
    userEvent.click(addAccountsOrAssetsButton);
  }
  const onImportWizard = screen.getByRole('button', { name: /Import Wizard/i });
  userEvent.click(onImportWizard);
};

describe('Import Wizard tests', () => {
  test('Check import wizard options', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      return ipcRenderer;
    });

    initImportWizard();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    const canutinFileOption = screen.getByLabelText('CanutinFile (JSON)');
    const mintOption = screen.getByLabelText('Mint.com (CSV)');
    const personalCapitalOption = screen.getByLabelText('Personal Capital (CSV)');
    const otherCsvOption = screen.getByLabelText('Other CSV');

    userEvent.click(canutinFileOption);
    expect(canutinFileOption).toBeChecked();
    expect(mintOption).not.toBeChecked();
    expect(personalCapitalOption).not.toBeChecked();
    expect(otherCsvOption).not.toBeChecked();

    userEvent.click(mintOption);
    expect(canutinFileOption).not.toBeChecked();
    expect(mintOption).toBeChecked();
    expect(personalCapitalOption).not.toBeChecked();
    expect(otherCsvOption).not.toBeChecked();

    userEvent.click(personalCapitalOption);
    expect(canutinFileOption).not.toBeChecked();
    expect(mintOption).not.toBeChecked();
    expect(personalCapitalOption).toBeChecked();
    expect(otherCsvOption).not.toBeChecked();

    userEvent.click(otherCsvOption);
    expect(canutinFileOption).not.toBeChecked();
    expect(mintOption).not.toBeChecked();
    expect(personalCapitalOption).not.toBeChecked();
    expect(otherCsvOption).toBeChecked();
  });

  test('Import canutin file', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      return ipcRenderer;
    });

    initImportWizard();
    const canutinFileOption = screen.getByLabelText('CanutinFile (JSON)');
    userEvent.click(canutinFileOption);
    const chooseButton = screen.getByRole('button', { name: /Choose/i });
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'json');
  });

  test('Import Mint file', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      return ipcRenderer;
    });

    initImportWizard();
    const mintFileOption = screen.getByLabelText('Mint.com (CSV)');
    userEvent.click(mintFileOption);
    const chooseButton = screen.getByRole('button', { name: /Choose/i });
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
  });

  test('Import Personal capital file', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      return ipcRenderer;
    });

    initImportWizard();
    const personalCapitalOption = screen.getByLabelText('Personal Capital (CSV)');
    userEvent.click(personalCapitalOption);
    const chooseButton = screen.getByRole('button', { name: /Choose/i });
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
  });

  test('Import option with data source', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      if (event === IMPORT_SOURCE_FILE_ACK) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testPath' });
      }

      if (event === ANALYZE_SOURCE_FILE_ACK) {
        callback((event as unknown) as IpcRendererEvent, {
          status: 'success',
          sourceData: canutinFile,
          metadata: { countAccounts: 2, countTransactions: 5 },
        });
      }

      return ipcRenderer;
    });

    initImportWizard();
    const personalCapitalOption = screen.getByLabelText('Personal Capital (CSV)');
    userEvent.click(personalCapitalOption);
    expect(screen.getByText(/testpath/i)).not.toBeNull();
    expect(screen.getByText(/Found 2 accounts, and 5 transactions in the file/i)).not.toBeNull();

    const chooseButton = screen.getByRole('button', { name: /Choose/i });
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
    expect(screen.getByText(/Analyzing file.../i)).not.toBeNull();
  });

  test('Other CSV Form', async () => {
    const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation(message => {});
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testFilePath' });
      }

      if (event === IMPORT_SOURCE_FILE_ACK) {
        callback((event as unknown) as IpcRendererEvent, { filePath: 'testPath' });
      }

      if (event === ANALYZE_SOURCE_FILE_ACK) {
        callback((event as unknown) as IpcRendererEvent, {
          status: 'success',
          sourceData: csvSourceData,
          metadata: csvMetadata,
        });
      }

      if (event === DB_GET_ACCOUNTS_ACK) {
        const accountMock = accountBuilder();
        callback((event as unknown) as IpcRendererEvent, [accountMock]);
      }

      return ipcRenderer;
    });

    initImportWizard();
    const otherCSVOption = screen.getByLabelText('Other CSV');
    userEvent.click(otherCSVOption);
    expect(screen.getByText(/testpath/i)).not.toBeNull();

    const continueButton = screen.getByRole('button', { name: /Continue/i });
    const matchColumns = screen.getByText(/Match columns/i);
    const dateColumn = screen.getByLabelText(/Date column/i);
    const dateFormat = screen.getByLabelText(/Date format/i);
    const descriptionColumn = screen.getByLabelText(/Description column/i);
    const amountColumn = screen.getByLabelText(/Amount column/i);
    const accountColumn = screen.getByLabelText('Account column / Optional');
    const categoryColumn = screen.getByLabelText('Category column / Optional');
    const importAccount = screen.getByLabelText(/Import to account/i);
    const accountName = screen.getByLabelText(/Account name/i);
    const accountType = screen.getByLabelText(/Account type/i);
    const accountInstitution = screen.getByLabelText('Account institution / Optional');
    const accountBalance = screen.getByLabelText(/Account balance/i);
    const autoCalculate = screen.getByLabelText('Auto-calculate from transactions');

    expect(matchColumns).toBeInTheDocument();
    expect(dateColumn).toBeInTheDocument();
    expect(dateFormat).toBeInTheDocument();
    expect(descriptionColumn).toBeInTheDocument();
    expect(amountColumn).toBeInTheDocument();
    expect(accountColumn).toBeInTheDocument();
    expect(categoryColumn).toBeInTheDocument();
    expect(importAccount).toBeInTheDocument();
    expect(accountName).toBeInTheDocument();
    expect(accountType).toBeInTheDocument();
    expect(accountInstitution).toBeInTheDocument();
    expect(accountBalance).toBeInTheDocument();
    expect(autoCalculate).toBeInTheDocument();
    expect(continueButton).toBeDisabled();

    await selectEvent.select(accountColumn, 'Account Name');
    expect(screen.queryByLabelText(/Import to account/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Account name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Account type/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Account balance/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Account institution / Optional')).not.toBeInTheDocument();
    expect(screen.queryByText('Choose types for new accounts')).toBeInTheDocument();
    await selectEvent.select(categoryColumn, 'Category');
    expect(screen.queryByText('Match categories')).toBeInTheDocument();
    await selectEvent.select(dateColumn, 'Date');
    await selectEvent.select(amountColumn, 'Amount');
    await selectEvent.select(descriptionColumn, 'Description');
    expect(continueButton).not.toBeDisabled();

    await selectEvent.clearAll(categoryColumn);
    expect(continueButton).not.toBeDisabled();
    await selectEvent.clearAll(accountColumn);
    expect(continueButton).toBeDisabled();
    userEvent.type(accountName, 'Test account');
    await selectEvent.select(screen.getByLabelText('Account type'), 'Checking');
    userEvent.type(accountInstitution, 'Test Institution');
    userEvent.click(autoCalculate);
    expect(autoCalculate).not.toBeChecked();
    userEvent.type(accountBalance, '123');

    consoleSpy.mockRestore();
  });
});
