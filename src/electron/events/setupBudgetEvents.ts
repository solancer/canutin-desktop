import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { QueryFailedError } from 'typeorm';

import {
  DB_GET_BUDGETS,
  DB_GET_BUDGETS_ACK,
  DB_EDIT_BUDGET_GROUPS,
  DB_EDIT_BUDGET_GROUPS_ACK,
  DB_EDIT_BUDGET_CATEGORY,
  DB_EDIT_BUDGET_CATEGORY_ACK,
  DB_REMOVE_BUDGET_CATEGORY,
  DB_REMOVE_BUDGET_CATEGORY_ACK,
} from '@constants/repositories';
import { EVENT_ERROR, EVENT_SUCCESS, EVENT_NEUTRAL } from '@constants/eventStatus';

import { EditBudgetCategorySubmitType } from '@app/components/Budget/TransactionCategoriesForm';
import { EditBudgetType } from '@app/components/Budget/EditBudgetGroups';
import { BudgetRepository } from '@database/repositories/budget.repository';
import { SettingsRepository } from '@database/repositories/settings.repository';
import { getSettings } from './setupSettingsEvents';

export const getBudgets = async (win: BrowserWindow) => {
  const budgets = await BudgetRepository.getBudgets();
  win.webContents.send(DB_GET_BUDGETS_ACK, budgets);
};

const setupBudgetEvents = async (win: BrowserWindow) => {
  ipcMain.on(DB_GET_BUDGETS, async (_: IpcMainEvent) => {
    await getBudgets(win);
  });

  ipcMain.on(DB_EDIT_BUDGET_GROUPS, async (_: IpcMainEvent, editBudgets: EditBudgetType) => {
    try {
      await SettingsRepository.editSettings(
        editBudgets.autoBudgetField === 'Enabled' ? true : false
      );
      await BudgetRepository.editBudgets(editBudgets);
      await getSettings(win);
      await getBudgets(win);
      win.webContents.send(DB_EDIT_BUDGET_GROUPS_ACK, { status: EVENT_SUCCESS });
    } catch (e) {
      win.webContents.send(DB_EDIT_BUDGET_GROUPS_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(
    DB_EDIT_BUDGET_CATEGORY,
    async (_: IpcMainEvent, editBudgetCategorySubmit: EditBudgetCategorySubmitType) => {
      try {
        await BudgetRepository.addBudgetCategory(editBudgetCategorySubmit);
        await getBudgets(win);
        win.webContents.send(DB_EDIT_BUDGET_CATEGORY_ACK, { status: EVENT_SUCCESS });
      } catch (e) {
        if (e instanceof QueryFailedError) {
          win.webContents.send(DB_EDIT_BUDGET_CATEGORY_ACK, {
            status: EVENT_NEUTRAL,
            message: 'The category is already assigned to the budget',
          });
        } else {
          win.webContents.send(DB_EDIT_BUDGET_CATEGORY_ACK, {
            status: EVENT_ERROR,
            message: 'An error occurred, please try again',
          });
        }
      }
    }
  );

  ipcMain.on(
    DB_REMOVE_BUDGET_CATEGORY,
    async (_: IpcMainEvent, editBudgetCategorySubmit: EditBudgetCategorySubmitType) => {
      try {
        await BudgetRepository.removeBudgetCategory(editBudgetCategorySubmit);
        await getBudgets(win);
        win.webContents.send(DB_REMOVE_BUDGET_CATEGORY_ACK, { status: EVENT_SUCCESS });
      } catch (e) {
        win.webContents.send(DB_EDIT_BUDGET_CATEGORY_ACK, {
          status: EVENT_NEUTRAL,
          message: 'The category is not assigned to any expense group',
        });
      }
    }
  );
};

export default setupBudgetEvents;
