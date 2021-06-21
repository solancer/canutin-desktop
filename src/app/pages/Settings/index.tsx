import React from 'react';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import DefaultSettings from '@components/Settings/DefaultSettings';
import Vault from '@components/Settings/Vault';

const Settings = () => {
  return (
    <ScrollView title="Settings">
      <Section title="Vault">
        <Vault />
      </Section>
      <Section title="Default settings">
        <DefaultSettings />
      </Section>
    </ScrollView>
  );
};

export default Settings;
