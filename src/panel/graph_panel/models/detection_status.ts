import { AnalyticUnitId } from './analytic_unit';

export enum DetectionState {
  READY = 'READY',
  RUNNING = 'RUNNING',
  FAILED = 'FAILED'
};

export type DetectionStatus = {
  id: AnalyticUnitId,
  state: DetectionState,
  from: number,
  to: number
};
