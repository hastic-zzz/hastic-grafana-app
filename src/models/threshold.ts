import { AnalyticUnitId } from './analytic_unit';

export enum Condition {
  ABOVE = '>',
  ABOVE_OR_EQUAL = '>=',
  EQUAL = '=',
  LESS_OR_EQUAL = '<=',
  LESS = '<'
};

export type Threshold = {
  id: AnalyticUnitId,
  value: number,
  condition: Condition 
};
