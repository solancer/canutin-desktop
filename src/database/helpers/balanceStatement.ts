import { handleDate } from '@app/utils/date.utils';
import { AccountBalanceStatementRepository } from '@database/repositories/accountBalanceStatement.repository';
import { Account, AccountBalanceStatement, Asset, AssetBalanceStatement } from '@database/entities';
import { NewAccountType } from '@appTypes/account.type';
import { NewAssetType } from '@appTypes/asset.type';
import {
  CanutinFileAccountBalanceStatementType,
  CanutinFileAssetBalanceStatementType,
} from '@appTypes/canutinFile.type';
import { NewAccountBalanceStatementType } from '@appTypes/accountBalanceStatement.type';
import { NewAssetBalanceStatementType } from '@appTypes/assetBalanceStatement.type';
import { AssetBalanceStatementRepository } from '@database/repositories/assetBalanceStatement.entity';

export const handleAccountBalanceStatements = async (
  existingAccount: Account,
  newAccount: NewAccountType
) => {
  if (!newAccount.autoCalculated && newAccount.balanceStatements) {
    // Generate an accountBalanceStatement for each provided balanceStatement
    const newAccountBalanceStatements = newAccount.balanceStatements.map(
      (
        balanceStatement: NewAccountBalanceStatementType | CanutinFileAccountBalanceStatementType
      ) => {
        return new AccountBalanceStatement(
          balanceStatement.value ? balanceStatement.value : 0,
          existingAccount,
          handleDate(balanceStatement.createdAt)
        );
      }
    );

    await AccountBalanceStatementRepository.createBalanceStatements(newAccountBalanceStatements);
  } else if (!newAccount.autoCalculated && !newAccount.closed) {
    // Generate an accountBalanceStatement when no balanceStatements are provided
    await AccountBalanceStatementRepository.createBalanceStatement({
      createdAt: new Date(),
      value: 0,
      account: existingAccount,
    });
  }
};

export const handleAssetBalanceStatements = async (
  existingAsset: Asset,
  newAsset: NewAssetType
) => {
  if (!newAsset.sold && newAsset.balanceStatements) {
    // Generate an assetBalanceStatement for each provided balanceStatement
    const newAssetBalanceStatements = newAsset.balanceStatements.map(
      (balanceStatement: NewAssetBalanceStatementType | CanutinFileAssetBalanceStatementType) => {
        return new AssetBalanceStatement(
          balanceStatement.value ? balanceStatement.value : 0,
          existingAsset,
          handleDate(balanceStatement.createdAt),
          balanceStatement.quantity,
          balanceStatement.cost
        );
      }
    );

    await AssetBalanceStatementRepository.createBalanceStatements(newAssetBalanceStatements);
  } else if (!newAsset.sold) {
    // Generate an assetBalanceStatement when no balanceStatements are provided
    await AssetBalanceStatementRepository.createBalanceStatement({
      createdAt: new Date(),
      value: 0,
      asset: existingAsset,
    });
  }
};
