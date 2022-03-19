import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import FieldNotice from '@app/components/common/Form/FieldNotice';
import Fieldset from '@app/components/common/Form/Fieldset';
import Form from '@app/components/common/Form/Form';
import SelectField from '@app/components/common/Form/SelectField';
import Field from '@app/components/common/Form/Field';
import FormFooter from '@app/components/common/Form/FormFooter';
import SubmitButton from '@app/components/common/Form/SubmitButton';

import { EntitiesContext } from '@app/context/entitiesContext';
import { CATEGORY_GROUPED_OPTIONS } from '@appConstants/categories';
import { EVENT_ERROR, EVENT_NEUTRAL, EVENT_SUCCESS } from '@constants/eventStatus';
import {
  DB_EDIT_BUDGET_CATEGORY_ACK,
  DB_REMOVE_BUDGET_CATEGORY_ACK,
} from '@constants/repositories';
import { Budget } from '@database/entities';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';
import BudgetIpc from '@app/data/budget.ipc';
import InputText from '@app/components/common/Form/InputText';

interface TransactionCategoriesFormProps {
  expenseBudgets?: Budget[];
}

export type EditBudgetCategorySubmitType = {
  budgetId: number;
  categoryName: string;
};

const TransactionCategoriesForm = ({ expenseBudgets }: TransactionCategoriesFormProps) => {
  const history = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { settingsIndex } = useContext(EntitiesContext);

  const { handleSubmit, watch, formState, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      categoryName: 'Uncategorized',
      budgetId: expenseBudgets?.[0].id,
    },
  });
  const { categoryName } = watch();
  const autoBudget = settingsIndex?.settings.autoBudget;
  const budgetOptions = expenseBudgets?.map(({ name, id }) => ({ value: id, label: name }));
  budgetOptions?.push({
    value: 0,
    label: 'Remove from current expense group',
  });

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_BUDGET_CATEGORY_ACK, (_: IpcRendererEvent, { status, message }) => {
      switch (status) {
        case EVENT_SUCCESS:
          setStatusMessage({
            message: 'The category was assigned to the expense group',
            sentiment: StatusEnum.POSITIVE,
            isLoading: false,
          });

          // FIXME: should use `routePaths.budget` but it breaks type definitions
          // when running `yarn electron-tsc`.
          history.push('/budget');
          break;
        case EVENT_NEUTRAL:
          setStatusMessage({ message, sentiment: StatusEnum.NEUTRAL, isLoading: false });
          break;
        case EVENT_ERROR:
          setStatusMessage({ message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });

    ipcRenderer.on(DB_REMOVE_BUDGET_CATEGORY_ACK, (_: IpcRendererEvent, { status, message }) => {
      switch (status) {
        case EVENT_SUCCESS:
          setStatusMessage({
            message: 'The category was removed from the expense group',
            sentiment: StatusEnum.NEUTRAL,
            isLoading: false,
          });

          // FIXME: should use `routePaths.budget` but it breaks type definitions
          // when running `yarn electron-tsc`.
          history.push('/budget');
          break;
        case EVENT_NEUTRAL:
          setStatusMessage({ message, sentiment: StatusEnum.NEUTRAL, isLoading: false });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_EDIT_BUDGET_CATEGORY_ACK);
      ipcRenderer.removeAllListeners(DB_REMOVE_BUDGET_CATEGORY_ACK);
    };
  }, []);

  const isDisabled = !formState.isValid || autoBudget;

  const onSubmit = (budgetCategory: EditBudgetCategorySubmitType) => {
    if (budgetCategory.budgetId !== 0) {
      BudgetIpc.addBudgetCategory(budgetCategory);
    } else {
      BudgetIpc.removeBudgetCategory(budgetCategory);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} role="form">
      <Fieldset>
        {autoBudget ? (
          <Field name="autoBudget" label="Auto-budget">
            <InputText name="autoBudget" value="Enabled" disabled />
          </Field>
        ) : (
          <SelectField
            name="categoryName"
            label="Category"
            groupedOptions={CATEGORY_GROUPED_OPTIONS}
            control={control}
            required
          />
        )}
        <FieldNotice
          title="Assigning categories"
          description={
            autoBudget ? (
              <div>
                Transaction categories can only be assigned to expense groups when auto-budget is
                disabled.
              </div>
            ) : (
              <div>
                Assigning a category to a budget group will associate transactions with that
                category to the corresponding expense group.
              </div>
            )
          }
        />
      </Fieldset>
      {!autoBudget ? (
        <Fieldset>
          {categoryName ? (
            <SelectField
              name="budgetId"
              label="Assign to expense group"
              control={control}
              required
              options={budgetOptions}
            />
          ) : (
            <Field name="budgetId" label="Assign to budget group">
              <InputText name="autoBudget" value="Choose a category first" disabled />
            </Field>
          )}
        </Fieldset>
      ) : null}
      <FormFooter>
        <SubmitButton disabled={isDisabled}>Save</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default TransactionCategoriesForm;
