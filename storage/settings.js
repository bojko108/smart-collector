export default [
  {
    key: 'mc_dwg_crs',
    title: 'Output coordinate system',
    default: 'WGS84',
    type: 'dropdown',
    options: [
      { title: 'Geographic coordinates', value: 'WGS84' },
      { title: 'UTM 35N', value: 'UTM35N' },
      { title: 'Cadastral coordinates', value: 'BGS2005KK' }
    ]
  },
  { key: 'mc_dwg_block', title: 'DWG Block Name', default: 'MANHOLE', type: 'text' },
  {
    key: 'mc_dwg_type',
    title: 'Export Type',
    default: 'blocks',
    type: 'dropdown',
    options: [{ title: 'Blocks', value: 'blocks' }, { title: 'Points', value: 'points' }]
  },
  { key: 'mc_email', title: 'Email', default: 'bojko108@gmail.com', type: 'text' }
];
