import React from 'react';
import styled from 'styled-components';

import { Asset } from '@database/entities';

import Section from '@app/components/common/Section';

const Container = styled.div``;

interface AssetOverviewInformationProps {
  asset: Asset;
}

const AssetOverviewInformation = ({ asset }: AssetOverviewInformationProps) => {
  return (
    <Container>
      <Section title="Value history"></Section>
    </Container>
  );
};

export default AssetOverviewInformation;
