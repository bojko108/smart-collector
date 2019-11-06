import { GET_FEATURES, ADD_FEATURE, REMOVE_ALL_FEATURES, REMOVE_FEATURE } from './actionTypes';
import * as featuresStorage from '../../storage';

export function getFeaturesTask(features) {
  return { type: GET_FEATURES, features };
}

export function addFeatureTask(createdFeature) {
  return { type: ADD_FEATURE, createdFeature };
}

export function removeAllFeaturesTask() {
  return { type: REMOVE_ALL_FEATURES };
}

export function removeFeatureTask(fid) {
  return { type: REMOVE_FEATURE, fid };
}

export function getFeatures() {
  return dispatch => {
    return featuresStorage
      .getFeatures()
      .then(features => {
        dispatch(getFeaturesTask(features));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function addFeature(feature) {
  return dispatch => {
    return featuresStorage
      .addFeature(feature)
      .then(createdFeature => {
        dispatch(addFeatureTask(createdFeature));
        return createdFeature;
      })
      .catch(error => {
        throw error;
      });
  };
}

export function removeFeature(fid) {
  return dispatch => {
    return featuresStorage
      .removeFeature(fid)
      .then(() => {
        dispatch(removeFeatureTask(fid));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function removeAllFeatures() {
  return dispatch => {
    return featuresStorage
      .removeAllFeatures()
      .then(() => {
        dispatch(removeAllFeaturesTask());
      })
      .catch(error => {
        throw error;
      });
  };
}
