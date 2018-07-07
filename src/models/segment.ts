export type SegmentKey = number;

export class Segment {
  constructor(private _key: SegmentKey, public from: number, public to: number) {
    if(isNaN(this._key)) {
      throw new Error('Key can`t be NaN');
    }
    if(isNaN(+from)) {
      throw new Error('from can`t be NaN');
    }
    if(isNaN(+to)) {
      throw new Error('to can`t be NaN');
    }
  }
  
  get key(): SegmentKey { return this._key; }
  set key(value) { this._key = value; }

  get middle() { return (this.from + this.to) / 2; }

  get length() {
    return Math.max(this.from, this.to) - Math.min(this.from, this.to);
  }

  expandDist(allDist: number, portion: number): Segment {
    var p = Math.round(this.middle - allDist * portion / 2);
    var q = Math.round(this.middle + allDist * portion / 2);
    p = Math.min(p, this.from);
    q = Math.max(q, this.to);
    return new Segment(this._key, p, q);
  }

  equals(segment: Segment) {
    return this._key === segment._key;
  }
}
