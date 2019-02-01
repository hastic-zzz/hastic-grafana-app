import { Segment, SegmentId } from './segment'

export interface SegmentsSet<T extends Segment> {
  getSegments(from?: number, to?: number): T[];
  setSegments(segments: T[]): void;
  addSegment(segment: T): void;
  findSegments(point: number, rangeDist: number): T[];
  removeInRange(from: number, to: number): T[];
  remove(id: SegmentId): boolean;
  has(id: SegmentId): boolean;
  clear(): void;
  updateId(fromId: SegmentId, toId: SegmentId): void;
  length: number;
}
