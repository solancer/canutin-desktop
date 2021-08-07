import { mintCSVEntryBuilder } from '../factories/mintCsvEntryFactory';
import { mintCsvToJson } from '../../electron/helpers/sourceHelpers/mint';

test('Mint CSV to Json', () => {
  const mintCSVEntries = [
    ...Array(20).fill(mintCSVEntryBuilder({ overrides: { 'Account Name': 'Account 1' } })),
    ...Array(30).fill(mintCSVEntryBuilder({ overrides: { 'Account Name': 'Account 2' } })),
  ];
  console.log(mintCSVEntries);
  expect(mintCsvToJson(mintCSVEntries)).not.toBeNull();

  // Metadata
  expect(mintCsvToJson(mintCSVEntries).metadata.countAccounts).toBe(2);
  expect(mintCsvToJson(mintCSVEntries).metadata.countTransactions).toBe(50);

  // Canutin File
  expect(mintCsvToJson(mintCSVEntries).data.accounts.length).toBe(2);
  expect(mintCsvToJson(mintCSVEntries).data.assets).toBeUndefined();
  expect(mintCsvToJson(mintCSVEntries).data.accounts[0].transactions.length).toBe(20);
  expect(mintCsvToJson(mintCSVEntries).data.accounts[1].transactions.length).toBe(30);
});
