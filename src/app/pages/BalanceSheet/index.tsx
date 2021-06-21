import React from 'react';

import ScrollView from '@components/common/ScrollView';
import HeaderButtons from '@app/components/BalanceSheet/HeaderButtons';
import BalanceSheetTabViewer from '@components/BalanceSheet/BalanceSheetTabViewer';

const BalanceSheet = () => (
  <>
    <ScrollView title="Balance sheet" headerNav={<HeaderButtons />}>
      <BalanceSheetTabViewer />
    </ScrollView>
  </>
);

export default BalanceSheet;
