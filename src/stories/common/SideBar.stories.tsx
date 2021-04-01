import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import SideBar from '@components/common/SideBar';
import { MemoryRouter, Route } from 'react-router';

export default {
  title: 'Sidebar',
  component: SideBar,
} as Meta;

const Template: Story = args => (
  <MemoryRouter initialEntries={['/']}>
    <SideBar />
  </MemoryRouter>
);

export const SideBarApp = Template.bind({});
