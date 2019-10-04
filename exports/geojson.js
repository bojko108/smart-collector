export const createFeature = (properties, coordinates, geometryType = 'Point') => {
  let geometry = { coordinates, type: geometryType };
  return Object.assign({}, { type: 'Feature' }, geometry, { properties });
};

export const createFeatureCollection = features => {
  return Object.assign({}, { type: 'FeatureCollection' }, features);
};
