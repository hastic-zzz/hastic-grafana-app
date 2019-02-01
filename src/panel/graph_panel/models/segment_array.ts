import { SegmentsSet } from './segment_set';
import { Segment, SegmentId } from './segment';


export class SegmentArray<T extends Segment> implements SegmentsSet<T> {
  private _segments: T[];
  private _keyToSegment: Map<SegmentId, T> = new Map<SegmentId, T>();

  constructor(private segments?: T[]) {
    this.setSegments(segments);
  }

  getSegments(from?: number, to?: number): T[] {
    if(from === undefined) {
      from = -Infinity;
    }
    if(to === undefined) {
      to = Infinity;
    }
    var result = [];
    for(var i = 0; i < this._segments.length; i++) {
      var s = this._segments[i];
      if(from <= s.from && s.to <= to) {
        result.push(s);
      }
    }
    return result;
  }

  setSegments(segments: T[]) {
    this._segments = [];
    this._keyToSegment.clear();
    if(segments) {
      segments.forEach(s => {
        this.addSegment(s);
      });
    }
  }

  addSegment(segment: T) {
    if(this.has(segment.id)) {
      throw new Error(`Segment with key ${segment.id} exists in set`);
    }
    this._keyToSegment.set(segment.id, segment);
    this._segments.push(segment);
  }

  findSegments(point: number, rangeDist: number): T[] {
    return this._segments.filter(s => {
      var expanded = s.expandDist(rangeDist, 0.01);
      return (expanded.from <= point) && (point <= expanded.to);
    });
  }

  removeInRange(from: number, to: number): T[] {
    var deleted = [];
    var newSegments = [];
    for(var i = 0; i < this._segments.length; i++) {
      var s = this._segments[i];
      if(from <= s.from && s.to <= to) {
        this._keyToSegment.delete(s.id);
        deleted.push(s);
      } else {
        newSegments.push(s);
      }
    }
    this._segments = newSegments;
    return deleted;
  }

  get length() {
    return this._segments.length;
  }

  clear() {
    this._segments = [];
    this._keyToSegment.clear();
  }

  has(key: SegmentId): boolean {
    return this._keyToSegment.has(key);
  }

  remove(key: SegmentId): boolean {
    if(!this.has(key)) {
      return false;
    }
    var index = this._segments.findIndex(s => s.id === key);
    this._segments.splice(index, 1);
    this._keyToSegment.delete(key);
    return true;
  }

  updateId(fromKey: SegmentId, toKey: SegmentId) {
    var segment = this._keyToSegment.get(fromKey);
    this._keyToSegment.delete(fromKey);
    segment.id = toKey;
    this._keyToSegment.set(toKey, segment);
  }

}
