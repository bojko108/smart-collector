import * as geojson from './geojson';
import * as autocad from './autocad';
import * as dxf from './dxf';

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
      const [x, y] = transformGeographicToLambert(feature.geometry.coordinates.reverse());
      feature.geometry.coordinates = [y, x];
    });
  }
  if (targetCRS === 'UTM35N') {
    features.forEach(feature => {
      const [x, y] = transformGeographicToUTM(feature.geometry.coordinates.reverse());
      feature.geometry.coordinates = [y, x];
    });
  }

  const featureCollection = createFeatureCollection(features);
  return featureCollection;
};

export const saveAsAutoCadScript = async (features, targetCRS = 'WGS84') => {
  if (targetCRS === 'BGS2005KK') {
    features.forEach(feature => {
      const [x, y] = transformGeographicToLambert(feature.geometry.coordinates.reverse());
      feature.geometry.coordinates = [y, x];
    });
  }
  if (targetCRS === 'UTM35N') {
    features.forEach(feature => {
      const [x, y] = transformGeographicToUTM(feature.geometry.coordinates.reverse());
      feature.geometry.coordinates = [y, x];
    });
  }

  const scriptLines = autocad.createScriptForBlocks(features, blockName);
  return scriptLines;
};

export const saveAsDxf = async (features, targetCRS = 'WGS84') => {
  if (targetCRS === 'BGS2005KK') {
    features.forEach(feature => {
      const [x, y] = transformGeographicToLambert(feature.geometry.coordinates.reverse());
      feature.geometry.coordinates = [y, x];
    });
  }
  if (targetCRS === 'UTM35N') {
    features.forEach(feature => {
      const [x, y] = transformGeographicToUTM(feature.geometry.coordinates.reverse());
      feature.geometry.coordinates = [y, x];
    });
  }

  const dxfAsString = dxf.createDxf(features);
  return dxfAsString;
};
