export const DWG_CRS = {
  key: 'sc_dwg_crs',
  title: 'Output coordinate system',
  description: 'Select coordinates for exported files',
  default: 'WGS84',
  type: 'dropdown',
  options: [
    { label: 'Geographic coordinates', value: 'WGS84' },
    { label: 'UTM 35N', value: 'UTM35N' },
    { label: 'Cadastral coordinates', value: 'BGS2005KK' }
  ]
};
export const DWG_BLOCK_NAME = {
  key: 'sc_dwg_block',
  title: 'DWG Block Name',
  description: 'AutoCAD block name used when export type is "blocks"',
  default: 'MANHOLE',
  type: 'text'
};
export const DWG_EXPORT_TYPE = {
  key: 'sc_dwg_type',
  title: 'Export Type',
  description: 'Type of exported file',
  default: 'blocks',
  type: 'dropdown',
  options: [{ label: 'Blocks', value: 'blocks' }, { label: 'Points', value: 'points' }]
};
export const EMAIL = {
  key: 'sc_email',
  title: 'Email',
  description: 'Exported files will be send to this email address',
  default: 'bojko108@gmail.com',
  type: 'text'
};
