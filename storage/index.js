import { AsyncStorage } from 'react-native';
import settings from './settings';

export const checkSettingsInStore = async () => {
  for (let i = 0; i < settings.length; i++) {
    const value = await getSetting(settings[i].key);
    if (value === null) {
      await setSetting(settings[i].key, settings[i].default);
    }
    console.log(value);
  }
};

export const getAllSettings = () => {
  return settings;
};

export const getSetting = async key => {
  return await AsyncStorage.getItem(key);
};

export const setSetting = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};
