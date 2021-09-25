import { useState, useEffect } from 'react';

import Section from '@app/components/common/Section';
import Card from '@app/components/common/Card';
import { Segment, SegmentedControl } from '@app/components/common/SegmentedControl';
import {
  getTransactionTrailingCashflowAverage,
  TransactionsTrailingCashflowType,
} from '@app/utils/balance.utils';

export enum TrailingCashflowSegmentsEnum {
  LAST_6_MONTHS = 'Last 6 Months',
  LAST_12_MONTHS = 'Last 12 Months',
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
    <Section title="Trailing cashflow" scope={balanceSheetSegments}>
      <Card label="Income per month" value={trailingCashInfo[0]} isCurrency />
      <Card label="Expenses per month" value={trailingCashInfo[1]} isCurrency />
      <Card label="Net surplus per month" value={trailingCashInfo[2]} isCurrency />
    </Section>
  );
};

export default TrailingCashflow;
