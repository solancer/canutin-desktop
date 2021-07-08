import { AnalyzeSourceMetadataType } from '.';

export const generateSourceMessage = (metadata: AnalyzeSourceMetadataType) => {
  const hasAssets = metadata.countAssets && metadata.countAssets > 0;
  const hasAccounts = metadata.countAccounts && metadata.countAccounts > 0;
  const hasTransactions = metadata.countTransactions && metadata.countTransactions > 0;

  let sourceMessage = 'Found ';

  if (hasAssets) {

    if (hasAccounts) {
      sourceMessage = sourceMessage.concat(`${metadata.countAssets} assets, `);
    } else {
      sourceMessage = sourceMessage.concat(`${metadata.countAssets} assets`);
    }
  }

  if (hasAccounts) {

    if (hasTransactions) {
      sourceMessage = sourceMessage.concat(`${metadata.countAccounts} accounts, `);
    } else {
      sourceMessage = sourceMessage.concat(`and ${metadata.countAccounts} accounts`);
    }
  }

  if (hasTransactions) {
    sourceMessage = sourceMessage.concat(
      `and ${metadata.countTransactions} transactions in the file`
    );
  }

  if (!hasAccounts && !hasAccounts && !hasAssets) {
    sourceMessage = "Empty file" // TODO: Double-check this message with @fmaclen
  }

  return sourceMessage;
};
