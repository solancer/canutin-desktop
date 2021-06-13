import React from 'react';

import ScrollView from '@components/common/ScrollView';
import BalanceSheetRedirectButtons from '@components/BalanceSheet/BalanceSheetRedirectButtons';
import BalanceSheetTabViewer from '@components/BalanceSheet/BalanceSheetTabViewer';

const BalanceSheet = () => (
  <>
    <ScrollView
      title="Balance sheet"
      rightInformationComponent={<BalanceSheetRedirectButtons />}
    >
      <BalanceSheetTabViewer />
    </ScrollView>
  </>
);

export default BalanceSheet;
