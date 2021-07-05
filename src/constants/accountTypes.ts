import { BalanceGroupEnum } from '../enums/balanceGroup.enum';

export const accountTypes = [
  {
    balanceGroup: BalanceGroupEnum.CASH,
    accountTypes: [
      {
        label: 'Checking',
        value: 'checking',
      },
      {
        label: 'Savings',
        value: 'savings',
      },
      {
        label: 'Cash-only HSA (US)',
        value: 'cash hsa',
      },
      {
        label: 'Certificate of deposit',
        value: 'cd',
      },
      {
        label: 'Money market',
        value: 'money market',
      },
      {
        label: 'PayPal',
        value: 'paypal',
      },
      {
        label: 'Prepaid debit card',
        value: 'prepaid',
      },
      {
        label: 'Cash management',
        value: 'cash management',
      },
      {
        label: 'EBT (US)',
        value: 'ebt',
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.DEBT,
    accountTypes: [
      {
        label: 'Credit card',
        value: 'credit card',
      },
      {
        label: 'Auto loan',
        value: 'auto',
      },
      {
        label: 'Commercial loan',
        value: 'commercial',
      },
      {
        label: 'Consumer loan',
        value: 'consumer',
      },
      {
        label: 'HELOC',
        value: 'home equity',
      },
      {
        label: 'General loan',
        value: 'loan',
      },
      {
        label: 'Mortgage loan',
        value: 'mortgage',
      },
      {
        label: 'Pre-approved overdraft',
        value: 'overdraft',
      },
      {
        label: 'Pre-approved line of credit',
        value: 'line of credit',
      },
      {
        label: 'Student loan',
        value: 'student',
      },
      {
        label: 'Other loan',
        value: 'other loan',
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.INVESTMENT,
    accountTypes: [
      {
        label: '529 (US)',
        value: '529',
      },
      {
        label: '401a (US)',
        value: '401a',
      },
      {
        label: '401k (US)',
        value: '401k',
      },
      {
        label: '403b (US)',
        value: '403b',
      },
      {
        label: '457b (US)',
        value: '457b',
      },
      {
        label: 'Brokerage',
        value: 'brokerage',
      },
      {
        label: 'ISA (UK)',
        value: 'cash isa',
      },
      {
        label: 'ESA (US)',
        value: 'education savings account',
      },
      {
        label: 'Fixed annuity',
        value: 'fixed annuity',
      },
      {
        label: 'GIC (Canada)',
        value: 'gic',
      },
      {
        label: 'HRA (US)',
        value: 'health reimbursement arrangement',
      },
      {
        label: 'HSA (US)',
        value: 'hsa',
      },
      {
        label: 'IRA (US)',
        value: 'ira',
      },
      {
        label: 'ISA (UK)',
        value: 'isa',
      },
      {
        label: 'Keogh self-employed retirement plan (US)',
        value: 'keogh',
      },
      {
        label: 'LIF (Canada)',
        value: 'lif',
      },
      {
        label: 'LIRA (Canada)',
        value: 'lira',
      },
      {
        label: 'LRIF (Canada)',
        value: 'lrif',
      },
      {
        label: 'LRSP (Canada)',
        value: 'lrsp',
      },
      {
        label: 'Mutual fund',
        value: 'mutual fund',
      },
      {
        label: 'Non-taxable brokerage account',
        value: 'non-taxable brokerage account',
      },
      {
        label: 'Pension',
        value: 'pension',
      },
      {
        label: 'PRIF (Canada)',
        value: 'prif',
      },
      {
        label: 'Profit share plan',
        value: 'profit share plan',
      },
      {
        label: 'Qualifying share account',
        value: 'qshr',
      },
      {
        label: 'RSDP (Canada)',
        value: 'rdsp',
      },
      {
        label: 'RESP (Canada)',
        value: 'resp',
      },
      {
        label: 'Retirement',
        value: 'retirement',
      },
      {
        label: 'RLIF (Canada)',
        value: 'rlif',
      },
      {
        label: 'Roth IRA (US)',
        value: 'roth',
      },
      {
        label: 'Roth 401(k) (US)',
        value: 'roth 401k',
      },
      {
        label: 'RRIF (Canada)',
        value: 'rrif',
      },
      {
        label: 'RRSP (Canada)',
        value: 'rrsp',
      },
      {
        label: 'SARSEP (US)',
        value: 'sarsep',
      },
      {
        label: 'SEP IRA (US)',
        value: 'sep ira',
      },
      {
        label: 'Simple IRA (US)',
        value: 'simple ira',
      },
      {
        label: 'SIPP (UK)',
        value: 'sipp',
      },
      {
        label: 'Stock plan',
        value: 'stock plan',
      },
      {
        label: 'TFSA (Canada)',
        value: 'tfsa',
      },
      {
        label: 'Trust',
        value: 'trust',
      },
      {
        label: 'UGMA (US)',
        value: 'ugma',
      },
      {
        label: 'UTMA (US)',
        value: 'utma',
      },
      {
        label: 'Variable annuity',
        value: 'variable annuity',
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
    accountTypes: [
      {
        label: 'Other',
        value: 'other',
      },
    ],
  },
];

export const balanceGroupLabels = {
  [BalanceGroupEnum.CASH]: 'Cash',
  [BalanceGroupEnum.DEBT]: 'Debt',
  [BalanceGroupEnum.INVESTMENT]: 'Investment',
  [BalanceGroupEnum.OTHER_ASSETS]: 'Other assets',
};
