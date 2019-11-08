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
  const savedFeatures = transformFeatures(features, targetCRS);
  const featureCollection = createFeatureCollection(savedFeatures);
  return featureCollection;
};

export const saveAsAutoCadScript = async (features, targetCRS = 'WGS84') => {
  const savedFeatures = transformFeatures(features, targetCRS);
  const scriptLines = autocad.createScriptForBlocks(savedFeatures, blockName);
  return scriptLines;
};

export const saveAsDxf = async (features, targetCRS = 'WGS84') => {
  const savedFeatures = transformFeatures(features, targetCRS);
  const dxfAsString = dxf.createDxf(savedFeatures);
  return dxfAsString;
};

const transformFeatures = (features, targetCRS) => {
  return features.map(({ type, properties, geometry }) => {
    const transformed = Object.assign({}, { type: geometry.type }, { coordinates: geometry.coordinates.map(c => c) });
    if (targetCRS === 'BGS2005KK') {
      const [x, y] = transformGeographicToLambert(transformed.coordinates.reverse());
      transformed.coordinates = [y, x];
    }
    if (targetCRS === 'UTM35N') {
      const [x, y] = transformGeographicToUTM(transformed.coordinates.reverse());
      transformed.coordinates = [y, x];
    }
    return Object.assign({}, { type, properties, geometry: transformed });
  });
};
