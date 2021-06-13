import React from 'react';
import { useHistory } from 'react-router-dom';

import Button, { SubmitButtonOptions } from '@components/common/Form/ButtonSubmit';

import { routesPaths } from '@routes';

const BalanceSheetRedirectButtons = () => {
  const history = useHistory();

  return (
    <div>
      <Button
        buttonType={SubmitButtonOptions.SECONDARY}
        onClick={() => history.push(routesPaths.addAccountOrAssetByHand)}
      >
        Add new
      </Button>
      <Button
        buttonType={SubmitButtonOptions.SECONDARY}
        onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}
      >
        Import wizard
      </Button>
    </div>
  );
};

export default BalanceSheetRedirectButtons;
