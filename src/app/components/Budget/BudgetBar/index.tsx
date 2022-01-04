import styled from 'styled-components';

import NumberFormat from '@app/components/common/NumberFormat';

import {
  container,
  header,
  progress,
  progressContainer,
  progressTooltip,
  balanceContainer,
} from './styles';
import { StatusEnum } from '@app/constants/misc';
import { proportionBetween } from '@app/utils/balance.utils';

const Container = styled.div`
  ${container}
`;
const Header = styled.header`
  ${header}
`;
const ProgressContainer = styled.div`
  ${progressContainer}
`;
const Progress = styled.div`
  ${progress}
`;
const ProgressTooltip = styled.p`
  ${progressTooltip}
`;
const BalanceContainer = styled.div`
  ${balanceContainer}
`;

interface BudgetBarProps {
  title: string;
  periodAmount: number;
  targetAmount: number;
  dataTestId?: string;
}

const BudgetBar = ({ title, periodAmount, targetAmount, dataTestId }: BudgetBarProps) => {
  const percentage = Math.round(proportionBetween(periodAmount, targetAmount));

  const getBudgetStatus = () => {
    if (percentage === 0) return;

    // Budget bar with negative targetAmount
    if (targetAmount < 0) return percentage < 100 ? StatusEnum.NEUTRAL : StatusEnum.NEGATIVE;

    // Budget bar with positive targetAmount
    switch (targetAmount > 0) {
      case percentage < 0:
        return StatusEnum.NEGATIVE;
      case percentage > 0 && percentage < 75:
        return StatusEnum.WARNING;
      case percentage >= 75:
        return StatusEnum.POSITIVE;
    }
  };

  return (
    <Container data-testid={dataTestId}>
      <Header>{title}</Header>
      <ProgressContainer>
        <Progress percentage={percentage} status={getBudgetStatus()}>
          <ProgressTooltip>
            <NumberFormat displayType={'text'} value={Math.round(periodAmount)} />
            {` (${percentage}%)`}
          </ProgressTooltip>
        </Progress>
      </ProgressContainer>
      <BalanceContainer>
        <NumberFormat displayType={'text'} value={targetAmount} />
      </BalanceContainer>
    </Container>
  );
};

export default BudgetBar;
