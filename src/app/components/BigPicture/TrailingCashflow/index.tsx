import { useState, useEffect } from 'react';

import Section from '@app/components/common/Section';
import Card from '@app/components/common/Card';
import { Segment, SegmentedControl } from '@app/components/common/SegmentedControl';
import {
  getTransactionTrailingCashflowAverage,
  TransactionsTrailingCashflowType,
} from '@app/utils/balance.utils';

export enum TrailingCashflowSegmentsEnum {
  LAST_6_MONTHS = 'Last 6 months',
  LAST_12_MONTHS = 'Last 12 months',
}

interface TrailingCashflowInterface {
  trailingCashflow: TransactionsTrailingCashflowType[] | undefined;
}

const TrailingCashflow = ({ trailingCashflow }: TrailingCashflowInterface) => {
  const [selectedSegment, setSelectedSegment] = useState(
    TrailingCashflowSegmentsEnum.LAST_6_MONTHS
  );
  const [trailingCashInfo, setTrailingCashInfo] = useState([0, 0, 0]);

  const balanceSheetSegments = (
    <SegmentedControl>
      {Object.values(TrailingCashflowSegmentsEnum).map((trailingCashflowSegmentTitle, key) => (
        <Segment
          onClick={() => setSelectedSegment(trailingCashflowSegmentTitle)}
          isActive={trailingCashflowSegmentTitle === selectedSegment}
          key={key}
          label={trailingCashflowSegmentTitle}
        />
      ))}
    </SegmentedControl>
  );

  useEffect(() => {
    trailingCashflow &&
      setTrailingCashInfo(getTransactionTrailingCashflowAverage(trailingCashflow, selectedSegment));
  }, [selectedSegment, trailingCashflow]);

  return (
    <Section
      title="Trailing cashflow"
      scope={balanceSheetSegments}
      dataTestId="big-picture-trailing-cashflow"
    >
      <Card
        label="Income per month"
        value={trailingCashInfo[0]}
        dataTestId="big-picture-trailing-cashflow-income"
        isCurrency
      />
      <Card
        label="Expenses per month"
        value={trailingCashInfo[1]}
        dataTestId="big-picture-trailing-cashflow-expenses"
        isCurrency
      />
      <Card
        label="Net surplus per month"
        value={trailingCashInfo[2]}
        dataTestId="big-picture-trailing-cashflow-surplus"
        isCurrency
      />
    </Section>
  );
};

export default TrailingCashflow;
