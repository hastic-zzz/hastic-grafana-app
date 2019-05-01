import { AnalyticUnitId } from './analytic_units/analytic_unit';

export enum Condition {
  ABOVE = '>',
  ABOVE_OR_EQUAL = '>=',
  EQUAL = '=',
  LESS_OR_EQUAL = '<=',
  LESS = '<',
  NO_DATA = 'NO_DATA'
};

export type Threshold = {
  id: AnalyticUnitId,
  value: number,
  condition: Condition 
};
