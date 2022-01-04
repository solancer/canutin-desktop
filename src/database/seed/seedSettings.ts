import { SettingsRepository } from '../repositories/settings.repository';

const seedSettings = async () => {
    await SettingsRepository.createSettings(true);
};

export default seedSettings;
