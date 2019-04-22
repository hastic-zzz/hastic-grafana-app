import { AnalyticUnitId } from './analytic_unit';

export enum DetectionStatus {
  READY = 'READY',
  RUNNING = 'RUNNING',
  FAILED = 'FAILED'
};

export type DetectionSpan = {
  id: AnalyticUnitId,
  status: DetectionStatus,
  from: number,
  to: number
};
