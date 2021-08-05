import { personalCapitalCSVEntryBuilder } from '../factories/personalCapitalCsvEntryFactory';
import { personalCapitalCsvToJson } from '../../electron/helpers/sourceHelpers/personalCapital';

test('Personal Capital CSV to Json', () => {
  const personalCapitalCSVEntries = [...Array(20).fill(personalCapitalCSVEntryBuilder()), ...Array(30).fill(personalCapitalCSVEntryBuilder())];
  expect(personalCapitalCsvToJson(personalCapitalCSVEntries)).not.toBeNull();

  // Metadata
  expect(personalCapitalCsvToJson(personalCapitalCSVEntries).metadata.countAccounts).toBe(2);
  expect(personalCapitalCsvToJson(personalCapitalCSVEntries).metadata.countTransactions).toBe(50);

  // Canutin File
  expect(personalCapitalCsvToJson(personalCapitalCSVEntries).data.accounts.length).toBe(2);
  expect(personalCapitalCsvToJson(personalCapitalCSVEntries).data.assets).toBeUndefined();
  expect(personalCapitalCsvToJson(personalCapitalCSVEntries).data.accounts[0].transactions.length).toBe(20);
  expect(personalCapitalCsvToJson(personalCapitalCSVEntries).data.accounts[1].transactions.length).toBe(30);
});