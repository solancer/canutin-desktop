import { getRepository } from 'typeorm';

import { Settings } from '../entities';

export class SettingsRepository {
  static async createSettings(autoBudget: boolean): Promise<Settings> {
    return await getRepository<Settings>(Settings).save(new Settings(autoBudget));
  }

  static async getSettings(): Promise<Settings> {
    return (await getRepository<Settings>(Settings).findOne({
      order: { id: 'DESC' },
    })) as Settings; // Return the last (and only) one
  }

  static async editSettings(autoBudget: boolean): Promise<void> {
    const userSettings = await this.getSettings();

    await getRepository<Settings>(Settings).update(userSettings.id, {
      autoBudget,
    });
  }
}
