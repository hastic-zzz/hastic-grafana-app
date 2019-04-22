import tinycolor from 'tinycolor2';
import { DetectionStatus } from './models/detection_span';

export const PALETTE_ROWS = 4;
export const PALETTE_COLUMNS = 14;
export const DEFAULT_ANNOTATION_COLOR = 'rgba(0, 211, 255, 1)';
export const OK_COLOR = 'rgba(11, 237, 50, 1)';
export const NO_DATA_COLOR = 'rgba(150, 150, 150, 1)';
export const REGION_FILL_ALPHA = 0.09;

let colors = [
  '#7EB26D',
  '#EAB839',
  '#6ED0E0',
  '#EF843C',
  '#E24D42',
  '#1F78C1',
  '#BA43A9',
  '#705DA0',
  '#508642',
  '#CCA300',
  '#447EBC',
  '#C15C17',
  '#890F02',
  '#0A437C',
  '#6D1F62',
  '#584477',
  '#B7DBAB',
  '#F4D598',
  '#70DBED',
  '#F9BA8F',
  '#F29191',
  '#82B5D8',
  '#E5A8E2',
  '#AEA2E0',
  '#629E51',
  '#E5AC0E',
  '#64B0C8',
  '#E0752D',
  '#BF1B00',
  '#0A50A1',
  '#962D82',
  '#614D93',
  '#9AC48A',
  '#F2C96D',
  '#65C5DB',
  '#F9934E',
  '#EA6460',
  '#5195CE',
  '#D683CE',
  '#806EB7',
  '#3F6833',
  '#967302',
  '#2F575E',
  '#99440A',
  '#58140C',
  '#052B51',
  '#511749',
  '#3F2B5B',
  '#E0F9D7',
  '#FCEACA',
  '#CFFAFF',
  '#F9E2D2',
  '#FCE2DE',
  '#BADFF4',
  '#F9D9F9',
  '#DEDAF7',
];

export const ANALYTIC_UNIT_COLORS = [
  '#FF99FF',
  '#71b1f9',
  '#aee9fb',
  '#9ce677',
  '#f88990',
  '#f9e26e',
  '#f8c171',
];

export const DEFAULT_DELETED_SEGMENT_COLOR = '#00f0ff';
export const REGION_UNLABEL_COLOR_LIGHT = '#d1d1d1';
export const REGION_UNLABEL_COLOR_DARK = 'white';
export const LABELED_SEGMENT_BORDER_COLOR = 'black';
export const DELETED_SEGMENT_BORDER_COLOR = 'black';

export const SEGMENT_FILL_ALPHA = 0.5;
export const SEGMENT_STROKE_ALPHA = 0.8;
export const LABELING_MODE_ALPHA = 0.7;

export const DETECTION_STATUS_COLORS = new Map<DetectionStatus, string>([
  [DetectionStatus.READY, 'green'],
  [DetectionStatus.RUNNING, 'yellow'],
  [DetectionStatus.FAILED, 'red']
]);

export function hexToHsl(color) {
  return tinycolor(color).toHsl();
}

export function hslToHex(color) {
  return tinycolor(color).toHexString();
}


export default colors;
