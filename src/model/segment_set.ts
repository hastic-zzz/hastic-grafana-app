import { Segment, SegmentKey } from './segment'

export interface SegmentsSet<T extends Segment> {
  getSegments(from?: number, to?: number): T[];
  setSegments(segments: T[]): void;
  addSegment(segment: T): void;
  findSegments(point: number): T[];
  removeInRange(from: number, to: number): T[];
  remove(key: SegmentKey): boolean;
  has(key: SegmentKey): boolean;
  clear(): void;
  updateKey(fromKey: SegmentKey, toKey: SegmentKey): void;
  length: number;
}