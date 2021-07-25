import React from 'react';
import Select, { components, OptionTypeBase, ControlProps } from 'react-select';

import { SelectFieldValue, CustomSelect } from '@components/common/Form/Select';
import { grey70 } from '@appConstants/colors';
import { sansSerifBold } from '@appConstants/fonts';

interface SelectButtonProps {
  options: SelectFieldValue[];
  onChange: (e: SelectFieldValue | null) => void;
  value: SelectFieldValue | null;
}

const customStyles = {
  container: (base: any) => ({
    ...base,
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: '8px',
    borderRadius: '3px'
  }),
  control: (base: any) => ({
    ...base,
    height: 30,
    minHeight: 30,
    width: 125,
    background: 'none',
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: '12px',
    fontWeight: '600',
    color: grey70,
  }),
  indicatorsContainer: () => ({
    fontSize: '8px',
    paddingRight: '12px'
  })
};

const DropdownIndicator = () => <>▼</>;

const SelectButton = ({ options, value, onChange }: SelectButtonProps) => (
  <CustomSelect
    options={options}
    value={value}
    onChange={onChange}
    isSearchable={false}
    styles={customStyles}
    components={{ DropdownIndicator, IndicatorSeparator: null }}
  />
);

export default SelectButton;
