import { getNextFeatureNumber } from '../storage';

export const createFeature = async (properties, coordinates, geometryType = 'Point') => {
  let geometry = { coordinates, type: geometryType };
  const fid = await getNextFeatureNumber();
  properties.fid = fid;
  return Object.assign({}, { type: 'Feature' }, { geometry, properties });
};

export const createFeatureCollection = features => {
  return Object.assign({}, { type: 'FeatureCollection', features });
};
