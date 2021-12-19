import React from 'react';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import ImportWizardForm from '@components/AccountAsset/ImportWizardForm';

const AddAccountAssetByWizard = () => {
  return (
    <ScrollView
      title="Import wizard"
      subTitle="Add or update accounts, assets, balances and transactions"
    >
      <Section title="Data source">
        <ImportWizardForm />
      </Section>
    </ScrollView>
  );
};

export default AddAccountAssetByWizard;
