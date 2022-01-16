import { handleDate } from '@app/utils/date.utils';
import { AccountBalanceStatementRepository } from '@database/repositories/accountBalanceStatement.repository';
import { Account, Asset } from '@database/entities';
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
    newAccount.balanceStatements.forEach(
      async (
        balanceStatement: NewAccountBalanceStatementType | CanutinFileAccountBalanceStatementType
      ) => {
        await AccountBalanceStatementRepository.createBalanceStatement({
          createdAt: handleDate(balanceStatement.createdAt),
          value: balanceStatement.value ? balanceStatement.value : 0,
          account: existingAccount,
        });
      }
    );
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
    newAsset.balanceStatements.forEach(
      async (
        balanceStatement: NewAssetBalanceStatementType | CanutinFileAssetBalanceStatementType
      ) => {
        await AssetBalanceStatementRepository.createBalanceStatement({
          createdAt: handleDate(balanceStatement.createdAt),
          value: balanceStatement.value ? balanceStatement.value : 0,
          cost: balanceStatement.cost,
          quantity: balanceStatement.quantity,
          asset: existingAsset,
        });
      }
    );
  } else if (!newAsset.sold) {
    // Generate an assetBalanceStatement when no balanceStatements are provided
    await AssetBalanceStatementRepository.createBalanceStatement({
      createdAt: new Date(),
      value: 0,
      asset: existingAsset,
    });
  }
};
