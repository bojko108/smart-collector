import Drawing from 'dxf-writer';

export const createDxf = features => {
  const layerName = 'smart-collector';

  const drawing = new Drawing();
  drawing.addLayer(layerName, Drawing.ACI.GREEN, 'CONTINUOUS');
  drawing.setActiveLayer(layerName);

  features.forEach(feature => {
    const [x, y] = feature.geometry.coordinates;
    drawing.drawPoint(x, y);
  });

  return drawing.toDxfString();
};
