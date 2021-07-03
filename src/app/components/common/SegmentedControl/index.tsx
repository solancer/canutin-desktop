import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { segmentedControlContainer, segment } from './styles';

const SegmentedControlContainer = styled.nav`
  ${segmentedControlContainer}
`;

interface SegmentedControlProps {
  children: ReactNode;
}

export const SegmentedControl = ({ children }: SegmentedControlProps) => (
  <SegmentedControlContainer>{children}</SegmentedControlContainer>
);

const SegmentContainer = styled.div<{ isActive: boolean }>`
  ${segment}
`;

interface SegmentProps {
  onClick: () => void;
  isActive: boolean;
  label: string;
}

export const Segment = ({ onClick, isActive, label }: SegmentProps) => (
  <SegmentContainer isActive={isActive} onClick={onClick}>
    {label}
  </SegmentContainer>
);
