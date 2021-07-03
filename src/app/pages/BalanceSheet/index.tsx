import React from 'react';

import ScrollView from '@components/common/ScrollView';
import HeaderButtons from '@app/components/BalanceSheet/HeaderButtons';
import BalanceSheetSection from '@app/components/BalanceSheet/BalanceSheetSection';

const BalanceSheet = () => (
  <>
    <ScrollView title="Balance sheet" headerNav={<HeaderButtons />}>
      <BalanceSheetSection />
    </ScrollView>
  </>
);

export default BalanceSheet;
