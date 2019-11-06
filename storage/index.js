import { AsyncStorage } from 'react-native';
import mapStyle from './mapStyle';
import * as SETTINGS from './settings';
import { getPropertiesFor } from './fields';

export { mapStyle, SETTINGS, getPropertiesFor };

export const checkSettingsInStore = async () => {
  const settings = getAllSettings();
  for (let i = 0; i < settings.length; i++) {
    const value = await getSetting(settings[i].key);
    if (value === null) {
      await setSetting(settings[i].key, settings[i].default);
    }
    // console.log(value);
  }
};

export const getAllSettings = () => {
  return Object.keys(SETTINGS).map(key => SETTINGS[key]);
};

export const getSetting = async key => {
  return await AsyncStorage.getItem(key.key || key);
};

export const setSetting = async (key, value) => {
  return await AsyncStorage.setItem(key.key || key, value);
};

export const getFeatures = async () => {
  const featuresString = await AsyncStorage.getItem('sc_features');
  return featuresString ? JSON.parse(featuresString) : [];
};

export const setFeatures = async features => {
  return await AsyncStorage.setItem('sc_features', JSON.stringify(features));
};

export const addFeature = async feature => {
  let features = await getFeatures();
  features.push(feature);
  await setFeatures(features);
  return feature;
};

export const removeFeature = async fid => {
  console.log('remove feature with id:' + fid);
  const features = await getFeatures();
  const newFeatures = features.filter(i => i.properties.fid !== fid);
  await setFeatures(newFeatures);
  return fid;
};

export const removeAllFeatures = async () => {
  await setFeatures([]);
};
