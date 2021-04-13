import { BalancegGroupEnum } from '../enums/balancegGroup.enum';

export const accountTypes = [
  {
    balanceGroup: BalancegGroupEnum.CASH,
    accountTypes: [
      {
        label: "Checking",
        name: "checking",
      },
      {
        label: "Savings",
        name: "savings"
      },
      {
        label: "Cash-only HSA (US)",
        name: "cash hsa"
      },
      {
        label: "Certificate of deposit",
        name: "cd"
      },
      {
        label: "Money market",
        name: "money market"
      },
      {
        label: "PayPal",
        name: "paypal"
      },
      {
        label: "Prepaid debit card",
        name: "prepaid"
      },
      {
        label: "Cash management",
        name: "cash management"
      },
      {
        label: "EBT (US)",
        name: "ebt"
      }
    ]
  },
  {
    balanceGroup: BalancegGroupEnum.DEBT,
    accountTypes: [
      {
        label: "Credit card",
        name: "credit card",
      },
      {
        label: "Auto loan",
        name: "auto"
      },
      {
        label: "Commercial loan",
        name: "commercial"
      },
      {
        label: "Consumer loan",
        name: "consumer"
      },
      {
        label: "HELOC",
        name: "home equity"
      },
      {
        label: "General loan",
        name: "loan"
      },
      {
        label: "Mortgage loan",
        name: "mortgage"
      },
      {
        label: "Pre-approved overdraft",
        name: "overdraft"
      },
      {
        label: "Pre-approved line of credit",
        name: "line of credit"
      },
      {
        label: "Student loan",
        name: "student"
      },
      {
        label: "Other loan",
        name: "other"
      }
    ]
  },
  {
    balanceGroup: BalancegGroupEnum.INVESTMENT,
    accountTypes: [
      {
        label: "529 (US)",
        name: "529",
      },
      {
        label: "401a (US)",
        name: "401a"
      },
      {
        label: "401k (US)",
        name: "401k"
      },
      {
        label: "403b (US)",
        name: "403b"
      },
      {
        label: "457b (US)",
        name: "457b"
      },
      {
        label: "Brokerage",
        name: "brokerage"
      },
      {
        label: "ISA (UK)",
        name: "cash isa"
      },
      {
        label: "ESA (US)",
        name: "education savings account"
      },
      {
        label: "Fixed annuity",
        name: "fixed annuity"
      },
      {
        label: "GIC (Canada)",
        name: "gic"
      },
      {
        label: "HRA (US)",
        name: "health reimbursement arrangement"
      },
      {
        label: "HSA (US)",
        name: "hsa"
      },
      {
        label: "IRA (US)",
        name: "ira"
      },
      {
        label: "ISA (UK)",
        name: "isa"
      },
      {
        label: "Keogh self-employed retirement plan (US)",
        name: "keogh"
      },
      {
        label: "LIF (Canada)",
        name: "lif"
      },
      {
        label: "LIRA (Canada)",
        name: "lira"
      },
      {
        label: "LRIF (Canada)",
        name: "lrif"
      },
      {
        label: "LRSP (Canada)",
        name: "lrsp"
      },
      {
        label: "Mutual fund",
        name: "mutual fund"
      },
      {
        label: "Non-taxable brokerage account",
        name: "non-taxable brokerage account"
      },
      {
        label: "Pension",
        name: "pension"
      },
      {
        label: "PRIF (Canada)",
        name: "prif"
      },
      {
        label: "Profit share plan",
        name: "profit share plan"
      },
      {
        label: "Qualifying share account",
        name: "qshr"
      },
      {
        label: "RSDP (Canada)",
        name: "rdsp"
      },
      {
        label: "RESP (Canada)",
        name: "resp"
      },
      {
        label: "Retirement",
        name: "retirement"
      },
      {
        label: "RLIF (Canada)",
        name: "rlif"
      },
      {
        label: "Roth IRA (US)",
        name: "roth"
      },
      {
        label: "Roth 401(k) (US)",
        name: "roth 401k"
      },
      {
        label: "RRIF (Canada)",
        name: "rrif"
      },
      {
        label: "RRSP (Canada)",
        name: "rrsp"
      },
      {
        label: "SARSEP (US)",
        name: "sarsep"
      },
      {
        label: "SEP IRA (US)",
        name: "sep ira"
      },
      {
        label: "Simple IRA (US)",
        name: "simple ira"
      },
      {
        label: "SIPP (UK)",
        name: "sipp"
      },
      {
        label: "Stock plan",
        name: "stock plan"
      },
      {
        label: "TFSA (Canada)",
        name: "tfsa"
      },
      {
        label: "Trust",
        name: "trust"
      },
      {
        label: "UGMA (US)",
        name: "ugma"
      },
      {
        label: "UTMA (US)",
        name: "utma"
      },
      {
        label: "Variable annuity",
        name: "variable annuity"
      }
    ]
  },
  {
    balanceGroup: BalancegGroupEnum.OTHER_ASSETS,
    accountTypes: [
      {
        label: "Other",
        name: "other",
      }
    ]
  }
];