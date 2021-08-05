import { mintCSVEntryBuilder } from '../factories/mintCsvEntryFactory';
import { mintCsvToJson } from '../../electron/helpers/sourceHelpers/mint';

test('Mint CSV to Json', () => {
  const personalCapitalCSVEntries = [...Array(20).fill(mintCSVEntryBuilder()), ...Array(30).fill(mintCSVEntryBuilder())];
  expect(mintCsvToJson(personalCapitalCSVEntries)).not.toBeNull();

  // Metadata
  expect(mintCsvToJson(personalCapitalCSVEntries).metadata.countAccounts).toBe(2);
  expect(mintCsvToJson(personalCapitalCSVEntries).metadata.countTransactions).toBe(50);

  // Canutin File
  expect(mintCsvToJson(personalCapitalCSVEntries).data.accounts.length).toBe(2);
  expect(mintCsvToJson(personalCapitalCSVEntries).data.assets).toBeUndefined();
  expect(mintCsvToJson(personalCapitalCSVEntries).data.accounts[0].transactions.length).toBe(20);
  expect(mintCsvToJson(personalCapitalCSVEntries).data.accounts[1].transactions.length).toBe(30);
});