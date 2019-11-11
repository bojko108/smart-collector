export const createScriptForBlocks = features => {
  const lines = features.map(feature => {
    const [x, y] = feature.geometry.coordinates;
    return `INSERT ${feature.properties.featureType} ${x},${y} 1 1 0`;
  });
  lines.push('');
  return lines;
};

// INSERT <block name> <X>,<Y> <ScaleX> <ScaleY> <Rotation>
// <empty line>
