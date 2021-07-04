import { AnalyzeSourceMetadataType } from '.';

export const generateSourceMessage = (metadata: AnalyzeSourceMetadataType) => {
  let sourceMessage = 'Found ';

  if (metadata.countAssets) {
    sourceMessage = sourceMessage.concat(`${metadata.countAssets} assets, `);
  }

  if (metadata.countAccounts) {
    sourceMessage = sourceMessage.concat(`${metadata.countAccounts} accounts, `);
  }

  if (metadata.countTransactions) {
    sourceMessage = sourceMessage.concat(
      `and ${metadata.countTransactions} transactions in the file`
    );
  }

  if (sourceMessage === 'Found ') {
    sourceMessage = "Empty file" // TODO: Double-check this message with @fmaclen
  }

  return sourceMessage;
};
