import { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { EntitiesContext } from '@app/context/entitiesContext';
import { DB_EDIT_BUDGET_GROUPS_ACK } from '@constants/events';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';
import useBudget from '@app/hooks/useBudget';
import BudgetIpc from '@app/data/budget.ipc';

import Section from '@app/components/common/Section';
import Form from '@app/components/common/Form/Form';
import Fieldset from '@app/components/common/Form/Fieldset';
import Field from '@app/components/common/Form/Field';
import FieldNotice from '@app/components/common/Form/FieldNotice';
import InputText from '@app/components/common/Form/InputText';
import InputCurrency from '@app/components/common/Form/InputCurrency';
import FormFooter from '@app/components/common/Form/FormFooter';
import SubmitButton from '@app/components/common/Form/SubmitButton';
import RadioGroupField from '@app/components/common/Form/RadioGroupField';
import Button from '@app/components/common/Button';
import PercentageField from '@app/components/common/Form/PercentageField';
import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { proportionBetween } from '@app/utils/balance.utils';
import { percentageFieldContainer, buttonFieldContainer, buttonFieldset } from './styles';
import { TransactionSubCategory } from '@database/entities';
import { handleBudgets } from '@app/utils/budget.utils';

const PercentageFieldContainer = styled.div`
  ${percentageFieldContainer}
`;
const ButtonFieldContainer = styled.div`
  ${buttonFieldContainer}
`;
const ButtonFieldset = styled.div`
  ${buttonFieldset}
`;

export type EditBudgetType = {
  autoBudgetField: 'Enabled' | 'Disabled';
  editedBudgets?: {
    name: string;
    targetAmount: number;
    type: BudgetTypeEnum;
    categories?: TransactionSubCategory[];
  }[];
};

type EditExpenseGroupFieldsetType = {
  index: number;
  namespace: string;
  categoriesCount: number;
  error: boolean;
  targetAmount?: number;
  name?: string;
  disabled?: boolean;
};

type EditBudgetSubmitType = {
  autoBudgetField: 'Enabled' | 'Disabled';
  targetIncomeField: string;
  expenseGroupFields: [
    { targetAmount: number; name: string; id: number; categories?: TransactionSubCategory[] }
  ];
  newExpenseGroupFields: [{ targetAmount: number; name: string }];
  autoBudgetExpenseGroupFields: [{ targetAmount: number; name: string }];
};

const EditBudgetGroups = () => {
  const history = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { budgetsIndex } = useContext(EntitiesContext);
  const { targetIncomeAmount, targetSavingsAmount, budgetExpenseGroups, autoBudget } = useBudget();
  const [removeGroupIds, setRemoveGroupIds] = useState<number[]>([]);
  const [newExpenseGroups, setNewExpenseGroups] = useState<
    { name: string; targetAmount: number }[]
  >([]);

  const autoBudgetIndex = budgetsIndex?.autoBudgets;
  const autoBudgetTargetSavingsAmount =
    autoBudgetIndex && handleBudgets(autoBudgetIndex).targetSavingsAmount;
  const autoBudgetTargetIncome = autoBudgetIndex && autoBudgetIndex[0]?.targetAmount;
  const autoBudgetExpenseGroups = budgetsIndex?.autoBudgets.filter(
    ({ type }) => type === BudgetTypeEnum.EXPENSE
  );

  const { handleSubmit, register, watch, setValue, getValues, control, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      autoBudgetField: autoBudget ? 'Enabled' : 'Disabled',
      targetIncomeField: targetIncomeAmount,
      targetSavingsField: targetSavingsAmount,
      expenseGroupFields: budgetExpenseGroups.reduce(
        (accGroup, expenseGroup) => ({
          ...accGroup,
          [expenseGroup.id]: {
            id: expenseGroup.id,
            targetAmount: expenseGroup.targetAmount,
            name: expenseGroup.name,
            categories: expenseGroup.categories,
            categoriesCount: expenseGroup.categories.length,
          },
        }),
        {}
      ) as {
        [id: string]: {
          id: number;
          name?: string;
          targetAmount: number;
          categories?: TransactionSubCategory[];
          categoriesCount: number;
        };
      },
      newExpenseGroupFields: [] as { [id: string]: { name: string; targetAmount: number } }[],
    },
  });

  const {
    autoBudgetField,
    targetIncomeField,
    targetSavingsField,
    expenseGroupFields,
    newExpenseGroupFields,
  } = watch();

  const getPercentageOfTargetIncome = (fieldTargetAmount: number) => {
    return Math.round(proportionBetween(fieldTargetAmount, targetIncomeField));
  };

  const isAutoBudget = autoBudgetField === 'Enabled';
  const hasNoExpenseGroups = !isAutoBudget && targetSavingsField == targetIncomeField;
  const hasNoSavings = targetSavingsField < 0;
  const submitIsDisabled =
    !formState.isValid || hasNoSavings || hasNoExpenseGroups || (autoBudget && isAutoBudget);

  useEffect(() => {
    let totalTargetsExpenses = expenseGroupFields
      ? Object.keys(expenseGroupFields).reduce(
          (acc, key) =>
            expenseGroupFields[parseInt(key)].targetAmount
              ? acc + Number(expenseGroupFields[parseInt(key)].targetAmount)
              : acc,
          0
        )
      : 0;
    totalTargetsExpenses += newExpenseGroupFields
      ? Object.keys(newExpenseGroupFields).reduce(
          (acc, key) =>
            newExpenseGroupFields[parseInt(key)].targetAmount
              ? acc + Number(newExpenseGroupFields[parseInt(key)].targetAmount)
              : acc,
          0
        )
      : 0;
    setValue('targetSavingsField', Number(targetIncomeField) + totalTargetsExpenses);
  }, [
    targetIncomeField,
    isAutoBudget,
    JSON.stringify(expenseGroupFields),
    JSON.stringify(newExpenseGroupFields),
  ]);

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_BUDGET_GROUPS_ACK, (_: IpcRendererEvent, { status, message }) => {
      switch (status) {
        case EVENT_SUCCESS:
          setStatusMessage({
            message: 'Budget edited successfully',
            sentiment: StatusEnum.POSITIVE,
            isLoading: false,
          });
          history.push('/budget');
          break;
        case EVENT_ERROR:
          setStatusMessage({ message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
          break;
      }
    });
  }, []);

  const onRemove = (id: number) => {
    setRemoveGroupIds(prev => [...prev, id]);
  };

  const onSubmit = (editBudgetSubmit: EditBudgetSubmitType) => {
    const {
      autoBudgetField,
      targetIncomeField,
      expenseGroupFields,
      newExpenseGroupFields,
    } = editBudgetSubmit;

    const editedBudgets = [];
    if (autoBudgetField === 'Disabled') {
      editedBudgets.push({
        name: 'Income',
        targetAmount: parseInt(targetIncomeField),
        type: BudgetTypeEnum.INCOME,
      });

      expenseGroupFields &&
        expenseGroupFields.forEach(expenseGroup => {
          editedBudgets.push({
            name: expenseGroup.name,
            targetAmount: expenseGroup.targetAmount,
            type: BudgetTypeEnum.EXPENSE,
            categories: expenseGroup.categories ? expenseGroup.categories : [],
          });
        });

      newExpenseGroupFields &&
        newExpenseGroupFields.forEach(expenseGroup => {
          editedBudgets.push({
            name: expenseGroup.name,
            targetAmount: expenseGroup.targetAmount,
            type: BudgetTypeEnum.EXPENSE,
          });
        });
    }

    BudgetIpc.editBudgetGroups({ autoBudgetField, editedBudgets });
  };

  const TOOLTIP_BUDGET_INCOME_PERCENTAGE =
    'The income amount you expect to make in any given month';
  const TOOLTIP_BUDGET_EXPENSE_PERCENTAGE =
    'The percentage of the target income that this expense group amounts to';
  const TOOLTIP_BUDGET_SAVINGS_PERCENTAGE =
    "The percentage that's left after your expense groups are substracted from the target income";

  const editExpenseGroupFieldset = ({
    index,
    namespace,
    categoriesCount,
    error,
  }: EditExpenseGroupFieldsetType) => (
    <Fieldset key={index} dataTestId="budget-fieldset-expense-group">
      <input {...register(`${namespace}.${index}.id`)} type="hidden" />
      <Field label="Expense group name" name={`${namespace}.${index}.name`}>
        <ButtonFieldContainer>
          <InputText name={`${namespace}.${index}.name`} register={register} />
          <Button disabled={isAutoBudget} onClick={() => onRemove(index)}>
            Remove
          </Button>
        </ButtonFieldContainer>
      </Field>

      <Field label="Target amount" name={`${namespace}.${index}.targetAmount`}>
        <PercentageFieldContainer>
          <InputCurrency
            name={`${namespace}.${index}.targetAmount`}
            control={control}
            onlyNegative={true}
          />
          <PercentageField
            percentage={Math.abs(
              getPercentageOfTargetIncome(
                parseInt(getValues(`${namespace}.${index}.targetAmount`)) < 0
                  ? getValues(`${namespace}.${index}.targetAmount`)
                  : 0
              )
            )}
            tooltip={TOOLTIP_BUDGET_EXPENSE_PERCENTAGE}
            error={error}
          />
        </PercentageFieldContainer>
      </Field>

      <Field label="Categories" name={`${namespace}.${index}.categoriesCount`}>
        <input {...register(`${namespace}.${index}.categories`)} type="hidden" />
        <InputText
          name={`${namespace}.${index}.categoriesCount`}
          value={categoriesCount.toString()}
          disabled
          readOnly
        />
      </Field>
    </Fieldset>
  );

  return (
    <Section title="Budget groups">
      <Form onSubmit={handleSubmit(onSubmit)} role="form">
        <Fieldset>
          <RadioGroupField
            label="Auto-budget"
            name="autoBudgetField"
            register={register}
            values={['Enabled', 'Disabled']}
          />
          {isAutoBudget ? (
            <FieldNotice
              title="What is auto-budget?"
              description={
                <div>
                  When auto-budget is enabled Canutin estimates your income based on the 6-month
                  trailing average income and applies the 50/30/20 rule of thumb which is a
                  budgeting guideline where expenses are allocated as: 50% for "needs", 30% to wants
                  " and the remaining 20% for "financial goals/savings".
                </div>
              }
            />
          ) : (
            <FieldNotice
              title="Custom budget"
              description={
                <div>{`By manually updating the following values you'll be setting a new budget for the current month (${format(
                  new Date(),
                  'MMM yyyy'
                )}). This budget will also be used for future months until it's updated again.`}</div>
              }
            />
          )}
        </Fieldset>

        {!isAutoBudget && (
          <>
            <Fieldset dataTestId="budget-fieldset-target-income">
              <Field label="Target income" name="targetIncomeField">
                <PercentageFieldContainer>
                  <InputCurrency name="targetIncomeField" control={control} />
                  <PercentageField percentage={100} tooltip={TOOLTIP_BUDGET_INCOME_PERCENTAGE} />
                </PercentageFieldContainer>
              </Field>
            </Fieldset>

            {budgetExpenseGroups.map(expenseGroup => {
              if (!removeGroupIds.includes(expenseGroup.id)) {
                return editExpenseGroupFieldset({
                  index: expenseGroup.id,
                  namespace: 'expenseGroupFields',
                  error: hasNoSavings,
                  categoriesCount: expenseGroup.categories.length,
                });
              }
              return null;
            })}

            {!isAutoBudget &&
              newExpenseGroups.map((_, index) => {
                const indexOffset = index + 100; // Prevents onRemove() from removing non-newExpenseGroups
                if (!removeGroupIds.includes(indexOffset)) {
                  return editExpenseGroupFieldset({
                    index: indexOffset,
                    namespace: 'newExpenseGroupFields',
                    error: hasNoSavings,
                    categoriesCount: 0,
                  });
                }
                return null;
              })}

            <Fieldset dataTestId="budget-fieldset-add-expense-group">
              <Field name="addGroup" label="Expense group">
                <ButtonFieldset>
                  <Button
                    disabled={isAutoBudget}
                    onClick={() => {
                      setNewExpenseGroups(prev => [...prev, { name: '', targetAmount: 0 }]);
                    }}
                  >
                    Add new
                  </Button>
                </ButtonFieldset>
              </Field>
              {hasNoExpenseGroups && (
                <FieldNotice
                  title="No expenses in budget"
                  description={
                    <div>
                      You need to add at least one expense group with a target amount to save this
                      budget.
                    </div>
                  }
                />
              )}
            </Fieldset>
            <Fieldset dataTestId="budget-fieldset-target-savings">
              <Field label="Target savings" name="targetSavingsField">
                <PercentageFieldContainer>
                  <InputCurrency
                    name="targetSavingsField"
                    value={targetSavingsField}
                    control={control}
                    disabled={true}
                  />
                  <PercentageField
                    percentage={getPercentageOfTargetIncome(targetSavingsField)}
                    error={hasNoSavings}
                    tooltip={TOOLTIP_BUDGET_SAVINGS_PERCENTAGE}
                  />
                </PercentageFieldContainer>
              </Field>
            </Fieldset>
          </>
        )}

        {isAutoBudget && (
          <>
            <Fieldset dataTestId="budget-fieldset-target-income">
              <Field label="Target income" name="targetIncomeField">
                <PercentageFieldContainer>
                  <InputCurrency
                    name="targetIncomeField"
                    control={control}
                    value={autoBudgetTargetIncome}
                    disabled={true}
                  />
                  <PercentageField percentage={100} tooltip={TOOLTIP_BUDGET_INCOME_PERCENTAGE} />
                </PercentageFieldContainer>
              </Field>
            </Fieldset>

            {autoBudgetExpenseGroups?.map(expenseGroup => (
              <Fieldset key={expenseGroup.id} dataTestId="budget-fieldset-expense-group">
                <Field
                  label="Expense group name"
                  name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.name`}
                >
                  <InputText
                    name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.name`}
                    value={expenseGroup.name.toString()}
                    readOnly={true}
                    disabled={true}
                    register={register}
                  />
                </Field>
                <Field
                  label="Target amount"
                  name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.targetAmount`}
                >
                  <PercentageFieldContainer>
                    <InputCurrency
                      name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.targetAmount`}
                      value={expenseGroup.targetAmount}
                      readOnly={true}
                      disabled={true}
                      control={control}
                      onlyNegative={true}
                    />
                    <PercentageField
                      percentage={Math.abs(getPercentageOfTargetIncome(expenseGroup.targetAmount))}
                      tooltip={TOOLTIP_BUDGET_EXPENSE_PERCENTAGE}
                    />
                  </PercentageFieldContainer>
                </Field>
                <Field
                  label="Categories"
                  name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.categoriesCount`}
                >
                  <InputText
                    name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.categoriesCount`}
                    value={expenseGroup.categories.length.toString()}
                    disabled
                    readOnly
                  />
                </Field>
              </Fieldset>
            ))}

            <Fieldset dataTestId="budget-fieldset-target-savings">
              <Field label="Target savings" name="autoBudgetTargetSavingsField">
                <PercentageFieldContainer>
                  <InputCurrency
                    name="autoBudgetTargetSavingsField"
                    value={autoBudgetTargetSavingsAmount}
                    control={control}
                    readOnly={true}
                    disabled={true}
                  />
                  <PercentageField
                    percentage={getPercentageOfTargetIncome(autoBudgetTargetSavingsAmount!)}
                    tooltip={TOOLTIP_BUDGET_SAVINGS_PERCENTAGE}
                  />
                </PercentageFieldContainer>
              </Field>
            </Fieldset>
          </>
        )}

        <FormFooter>
          <SubmitButton disabled={submitIsDisabled}>Save</SubmitButton>
        </FormFooter>
      </Form>
    </Section>
  );
};

export default EditBudgetGroups;
