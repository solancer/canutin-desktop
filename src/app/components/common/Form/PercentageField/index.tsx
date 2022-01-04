import styled from 'styled-components';

import { container, label } from './styles';

interface PercentageFieldProps {
  percentage: number;
  tooltip?: string;
  error?: boolean;
}

const Container = styled.div`
  ${container}
`;

const Label = styled.p`
  ${label}
`;

const PercentageField = ({ percentage, tooltip, error = false }: PercentageFieldProps) => {
  return (
    <Container error={error}>
      <Label title={tooltip}>{percentage}%</Label>
    </Container>
  );
};

export default PercentageField;
