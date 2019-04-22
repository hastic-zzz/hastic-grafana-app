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

export const DETECTION_STATUS_TEXT = new Map<DetectionStatus, string>();
DETECTION_STATUS_TEXT.set(DetectionStatus.READY, 'Detection is done');
DETECTION_STATUS_TEXT.set(DetectionStatus.RUNNING, 'Detection is running...');
DETECTION_STATUS_TEXT.set(DetectionStatus.FAILED, 'Detection failed');
