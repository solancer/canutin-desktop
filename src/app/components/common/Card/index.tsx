import React from 'react';
import styled from 'styled-components';

import NumberFormat from '@components/common/NumberFormat';

import { container, label, value } from './styles';

const Container = styled.div`
  ${container}
`;
const Label = styled.p`
  ${label}
`;
const Value = styled.p`
  ${value}
`;
const Amount = styled(NumberFormat)`
  ${value}
`;

export enum CardAppearanceEnum {
  SECONDARY,
  CASH,
  DEBT,
  INVESTMENTS,
  OTHER_ASSETS,
  NET_WORTH,
}

export interface CardProps {
  label: string;
  value: number | string;
  appearance?: CardAppearanceEnum;
  isCurrency?: boolean;
  dataTestId?: string;
}

const Card = ({ label, value, appearance, isCurrency, dataTestId }: CardProps) => (
  <Container appearance={appearance} data-testid={dataTestId}>
    <Label appearance={appearance}>{label}</Label>
    {isCurrency ? (
      <Amount appearance={appearance} value={value} displayType="text" />
    ) : (
      <Value>{value}</Value>
    )}
  </Container>
);

export default Card;
