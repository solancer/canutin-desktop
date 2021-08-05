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
  SUMMARY,
  CASH,
  DEBT,
  INVESTMENTS,
  OTHER_ASSETS,
}

export interface CardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  appearance?: CardAppearanceEnum;
}

const Card = ({ label, value, appearance, isCurrency }: CardProps) => (
  <Container appearance={appearance}>
    <Label>{label}</Label>
    {isCurrency ? <Amount value={value} displayType="text" /> : <Value>{value}</Value>}
  </Container>
);

export default Card;
