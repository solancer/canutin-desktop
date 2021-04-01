import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import PrimaryCard, { PrimaryCardProps } from '@components/PrimaryCard';

import { ReactComponent as Vault } from '@assets/icons/Vault.svg';
import { ReactComponent as Browse } from '@assets/icons/Browse.svg';

export default {
  title: 'Primary Card',
  component: PrimaryCard,
} as Meta;

const Template: Story<PrimaryCardProps> = args => <PrimaryCard {...args} />;

export const PrimaryCardVault = Template.bind({});
PrimaryCardVault.args = {
  icon: <Vault />,
  title: 'New vault',
  subTitle: 'Create a brand new vault',
};

export const PrimaryCardBrowse = Template.bind({});
PrimaryCardBrowse.args = {
  icon: <Browse />,
  title: 'Existing vault',
  subTitle: 'Locate an existing vault file',
};
