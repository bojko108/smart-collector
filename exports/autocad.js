export const createScriptForBlocks = (features, blockName) => {
  const lines = features.map(feature => {
    const [x, y] = feature.geometry.coordinates;
    return `-insert blockName ${x},${y} 1 0`;
  });
  return lines;
};
// -insert "test" 1,1 1 0
// -insert test rotate 2 -0.5933,16.9896,-54.75 1 1
// -insert test rotate 30 -8.5000,14.7224,-58.75 1 1
// -insert test rotate 58 -14.4168,9.0086,-62.5 1 1
// -insert test rotate 182 0.5933,-16.9896,-54.75 1 1
// -insert test rotate 210 8.5000,-14.7224,-56.75 1 1
// -insert test rotate 238 14.4168,-9.0086,-60.75 1 1
