import Drawing from 'dxf-writer';

export const createDxf = features => {
  const layer = { pylon: 'smart-collector-pylons', manhole: 'smart-collector-manholes' };

  const drawing = new Drawing();
  drawing.addLayer(layer.pylon, Drawing.ACI.GREEN, 'CONTINUOUS');
  drawing.addLayer(layer.manhole, Drawing.ACI.GREEN, 'CONTINUOUS');

  features.forEach(({ properties, geometry }) => {
    drawing.setActiveLayer(layer[properties.featureType]);
    const [x, y] = geometry.coordinates;
    drawing.drawPoint(x, y);
    let i = 1;
    for (let key in properties) {
      if (properties[key] && key.startsWith('c_')) {
        const dx = 1;
        const dy = i === 1 ? 1 : 1 + (i - 1) * 2.5;
        const text = escape(properties[key]).replace(/%u/g, '\\U+');
        drawing.drawText(x + dx, y + dy, 2, 0, text);
        i++;
      }
    }
  });

  return drawing.toDxfString();
};
