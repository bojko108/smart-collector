import * as geojson from './geojson';
import * as autocad from './autocad';
import { transformGeographicToLambert, transformGeographicToUTM } from '../transformations';

const createFeatureCollection = features => {
  return geojson.createFeatureCollection(features);
};

export const createPointFeature = (coordinates, properties = {}) => {
  return geojson.createFeature(properties, coordinates, 'Point');
};

export const saveAsGeoJson = async (features, targetCRS = 'WGS84') => {
  if (targetCRS === 'BGS2005KK') {
    features.forEach(feature => {
      feature.geometry.coordinates = transformGeographicToLambert(feature.geometry.coordinates);
    });
  }
  if (targetCRS === 'UTM35N') {
    features.forEach(feature => {
      feature.geometry.coordinates = transformGeographicToUTM(feature.geometry.coordinates);
    });
  }

  const featureCollection = createFeatureCollection(features);
  return featureCollection;
};

export const saveAsAutoCad = async (features, targetCRS = 'WGS84') => {
  if (targetCRS === 'BGS2005KK') {
    features.forEach(feature => {
      feature.geometry.coordinates = transformGeographicToLambert(feature.geometry.coordinates);
    });
  }
  if (targetCRS === 'UTM35N') {
    features.forEach(feature => {
      feature.geometry.coordinates = transformGeographicToUTM(feature.geometry.coordinates);
    });
  }

  const scriptLines = autocad.createScriptForBlocks(features, blockName);
  return scriptLines;
};
