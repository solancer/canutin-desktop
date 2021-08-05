import React from 'react';
import styled from 'styled-components';

import InputCurrency, { InputCurrencyProps } from '@components/common/Form/InputCurrency';

import { container, currencyTypeButton, currencyTypeContainer } from './styles';

const Container = styled.div`
  ${container}
`;

const CurrencyTypeButton = styled.button`
  ${currencyTypeButton}
`;

const CurrencyTypeContainer = styled.div`
  ${currencyTypeContainer}
`;

interface InputCurrencyToggleProps extends InputCurrencyProps {
  currencyValue: number;
  setValue: (
    name: any,
    value: unknown,
    config?:
      | Partial<{
          shouldValidate: boolean;
          shouldDirty: boolean;
        }>
      | undefined
  ) => void;
}

const InputCurrencyToggle = ({ currencyValue, setValue, ...currencyProps }: InputCurrencyToggleProps) => {
  const onClickPositive = () => setValue(currencyProps.name, Math.abs(currencyValue));
  const onClickNegative = () => setValue(currencyProps.name, -Math.abs(currencyValue));

  return (
    <Container>
      <CurrencyTypeContainer>
        <CurrencyTypeButton type="button" onClick={onClickPositive}>+</CurrencyTypeButton>
        <CurrencyTypeButton type="button" onClick={onClickNegative}>-</CurrencyTypeButton>
      </CurrencyTypeContainer>
      <InputCurrency {...currencyProps} allowEmptyFormatting />
    </Container>
  );
};

export default InputCurrencyToggle;
