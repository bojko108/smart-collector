import { AsyncStorage } from 'react-native';

import * as SETTINGS from './settings';
export { SETTINGS };

export const checkSettingsInStore = async () => {
  const settings = getAllSettings();
  for (let i = 0; i < settings.length; i++) {
    const value = await getSetting(settings[i].key);
    if (value === null) {
      await setSetting(settings[i].key, settings[i].default);
    }
    console.log(value);
  }
};

export const getAllSettings = () => {
  return Object.keys(SETTINGS).map(key => SETTINGS[key]);
};

export const getSetting = async key => {
  return await AsyncStorage.getItem(key);
};

export const setSetting = async (key, value) => {
  return await AsyncStorage.setItem(key, value);
};

export const getFeatures = async () => {
  const featuresString = await AsyncStorage.getItem('sc_features');
  return featuresString ? JSON.parse(featuresString) : [];
};

export const setFeatures = async features => {
  return await AsyncStorage.setItem('sc_features', JSON.stringify(features));
};
