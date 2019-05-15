import { AnalyticUnitId } from './analytic_units/analytic_unit';

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

export const DETECTION_STATUS_TEXT = new Map<DetectionStatus, string>([
  [DetectionStatus.READY, '[DetectionStatus]: done'],
  [DetectionStatus.RUNNING, '[DetectionStatus]: running...'],
  [DetectionStatus.FAILED, '[DetectionStatus]: failed']
]);
