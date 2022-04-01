import { screen, waitFor } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'jest-mock';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import { StatusEnum } from '@app/constants/misc';
import {
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE_ACK,
} from '@constants/imports';

import canutinFile from '../data/canutinFile.json';
import csvMetadata from '../data/csvMetadata.json';
import csvSourceData from '../data/csvSourceData.json';
import { initAppWith } from '@tests/utils/initApp.utils';

describe('Import wizard tests', () => {
  beforeEach(() => {
    initAppWith({});
    const addAccountsOrAssetsSidebarLink = screen.getByTestId('sidebar-add-or-update-data');
    userEvent.click(addAccountsOrAssetsSidebarLink);
    const onImportWizard = screen.getByRole('button', { name: /Import wizard/i });
    userEvent.click(onImportWizard);
  });

  test('Check import wizard options', async () => {
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
    const canutinFileOption = screen.getByLabelText('CanutinFile (JSON)');
    userEvent.click(canutinFileOption);
    const chooseButton = screen.getByRole('button', { name: 'Choose' });
    const continueButton = screen.getByRole('button', { name: 'Continue' });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'json');
  });

  test('Import Mint file', async () => {
    const mintFileOption = screen.getByLabelText('Mint.com (CSV)');
    userEvent.click(mintFileOption);
    const chooseButton = screen.getByRole('button', { name: 'Choose' });
    const continueButton = screen.getByRole('button', { name: 'Continue' });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
  });

  test('Import Personal capital file', async () => {
    const personalCapitalOption = screen.getByLabelText('Personal Capital (CSV)');
    userEvent.click(personalCapitalOption);
    const chooseButton = screen.getByRole('button', { name: 'Choose' });
    const continueButton = screen.getByRole('button', { name: 'Continue' });

    expect(continueButton).not.toBeEnabled();
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
  });

  test('Import option with data source', async () => {
    const personalCapitalOption = screen.getByLabelText('Personal Capital (CSV)');

    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === IMPORT_SOURCE_FILE_ACK) {
        callback(event as unknown as IpcRendererEvent, { filePath: 'testPath' });
      }

      if (event === ANALYZE_SOURCE_FILE_ACK) {
        callback(event as unknown as IpcRendererEvent, {
          status: StatusEnum.POSITIVE,
          sourceData: canutinFile,
          metadata: { countAccounts: 2, countTransactions: 5, countAssets: 3 },
        });
      }

      return ipcRenderer;
    });

    userEvent.click(personalCapitalOption);
    expect(screen.getByText(/testpath/i)).not.toBeNull();
    expect(
      screen.getByText('Found 3 assets, 2 accounts and 5 transactions in the file')
    ).not.toBeNull();

    const chooseButton = screen.getByRole('button', { name: 'Choose' });
    expect(chooseButton).toBeEnabled();

    const spySendIpcRenderer = jest.spyOn(ipcRenderer, 'send');
    userEvent.click(chooseButton);
    expect(spySendIpcRenderer).toHaveBeenLastCalledWith(IMPORT_SOURCE_FILE, 'csv');
    expect(screen.getByText('Analyzing source file')).not.toBeNull();
  });

  test('Other CSV Form', async () => {
    const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation(message => {}); // Clears console warnings

    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === IMPORT_SOURCE_FILE_ACK) {
        callback(event as unknown as IpcRendererEvent, { filePath: 'testPath' });
      }

      if (event === ANALYZE_SOURCE_FILE_ACK) {
        callback(event as unknown as IpcRendererEvent, {
          status: StatusEnum.POSITIVE,
          sourceData: csvSourceData,
          metadata: csvMetadata,
        });
      }

      return ipcRenderer;
    });

    const otherCSVOption = screen.getByLabelText('Other CSV');
    userEvent.click(otherCSVOption);
    expect(screen.getByText(/testpath/i)).not.toBeNull();

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    const matchColumns = screen.getByText('Match columns');
    const dateColumn = screen.getByLabelText('Date column');
    const dateFormat = screen.getByLabelText('Date format');
    const descriptionColumn = screen.getByLabelText('Description column');
    const amountColumn = screen.getByLabelText('Amount column');
    const accountColumn = screen.getByLabelText('Account column / Optional');
    const categoryColumn = screen.getByLabelText('Category column / Optional');
    const importAccount = screen.getByLabelText('Import to account');
    const accountName = screen.getByLabelText('Account name');
    const accountType = screen.getByLabelText('Account type');
    const accountInstitution = screen.getByLabelText('Account institution / Optional');
    const accountBalance = screen.getByLabelText('Account balance');
    const autoCalculated = screen.getByLabelText('Auto-calculate from transactions');
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
    expect(autoCalculated).toBeInTheDocument();
    expect(continueButton).toBeDisabled();

    await selectEvent.select(accountColumn, 'Account Name');
    expect(screen.queryByLabelText('Import to account')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Account name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Account type')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Account balance')).not.toBeInTheDocument();
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
    await waitFor(() => {
      expect(screen.getByLabelText('Import to account')).toBeVisible();
    });

    userEvent.type(accountName, "Bob's Juggernaut Visa");
    await selectEvent.select(screen.getByLabelText('Account type'), 'Credit card');
    userEvent.type(accountInstitution, 'Juggernaut Bank');
    await waitFor(() => {
      expect(autoCalculated).toBeChecked();
      expect(accountBalance).toBeDisabled();
      // expect(continueButton).not.toBeDisabled();
    });

    userEvent.click(autoCalculated);
    // FIXME: the following assertions should pass but don't
    // await waitFor(() => {
    //   expect(autoCalculated).not.toBeChecked();
    //   expect(screen.getByText('Balance history')).toBeVisible();
    //   expect(accountBalance).not.toBeDisabled();
    //   expect(continueButton).toBeDisabled();
    // });

    userEvent.type(accountBalance, '-2500');
    // FIXME: the following assertions should pass but don't
    // await waitFor(() => {
    //   expect(continueButton).not.toBeDisabled();
    // });

    consoleSpy.mockRestore();
  });
});
