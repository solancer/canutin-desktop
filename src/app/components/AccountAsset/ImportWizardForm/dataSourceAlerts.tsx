import React from 'react';

import {
  enumImportTitleOptions,
} from '@appConstants/misc';

import FormAlert from '@components/common/FormAlert';

const MintAlert = (
  <FormAlert
    title="Mint.com"
    description={
      <div>
        This file format can update <b>Account/s</b> and <b>Transactions</b>.
      </div>
    }
  />
);

const CanutinFileAlert = (
  <FormAlert
    title="CanutinFile"
    description={
      <div>
        This file format can update <b>Assets</b>, <b>Accounts</b>, <b>Balances</b> and{' '}
        <b>Transactions</b>.
      </div>
    }
  />
);

const PersonalCapitalAlert = (
  <FormAlert
    title="Personal Capital"
    description={
      <div>
        This file format can update <b>Account/s</b> and <b>Transactions</b>.
      </div>
    }
  />
);

const OtherCSVAlert = (
  <FormAlert
    title="Importing a different CSV"
    description={
      <div>
        This file format may be able to update <b>assets, accounts</b> or <b>transactions.</b>
      </div>
    }
  />
);

const sourceAlertsLookup = (importTypeTitle: enumImportTitleOptions | null) => {
  switch (importTypeTitle) {
    case enumImportTitleOptions.CANUTIN_IMPORT_TYPE_TITLE:
      return CanutinFileAlert;
    case enumImportTitleOptions.MINT_IMPORT_TYPE_TITLE:
      return MintAlert;
    case enumImportTitleOptions.PERSONAL_CAPITAL_IMPORT_TYPE_TITLE:
      return PersonalCapitalAlert;
      case enumImportTitleOptions.OTHER_CSV_IMPORT_TYPE_TITLE:
        return OtherCSVAlert;
    default:
      return null;
  }
};

export default sourceAlertsLookup;
