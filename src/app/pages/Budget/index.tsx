import React from 'react';

import ScrollView from '@components/common/ScrollView';
import EmptyCard from '@app/components/common/EmptyCard';

const Budget = () => (
  <>
    <ScrollView title="Budget">
      <EmptyCard
        message="
        This feature is currently under development. Look for updates on https://canutin.com"
      />
    </ScrollView>
  </>
);

export default Budget;
