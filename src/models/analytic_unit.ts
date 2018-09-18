import { SegmentsSet } from './segment_set';
import { SegmentArray } from './segment_array';
import { Segment, SegmentId } from './segment';
import { Metric } from './metric';

import { ANALYTIC_UNIT_COLORS } from '../colors';

import _ from 'lodash';


export type AnalyticSegmentPair = { analyticUnit: AnalyticUnit, segment: AnalyticSegment };
export type AnalyticSegmentsSearcher = (point: number, rangeDist: number) => AnalyticSegmentPair[];

export type AnalyticUnitId = string;

export class AnalyticSegment extends Segment {
  constructor(public labeled: boolean, id: SegmentId, from: number, to: number, public deleted = false) {
    super(id, from, to);
    if(!_.isBoolean(labeled)) {
      throw new Error('labeled value is not boolean');
    }
  }
}

export class AnalyticUnit {

  private _selected: boolean = false;
  private _deleteMode: boolean = false;
  private _saving: boolean = false;
  private _segmentSet = new SegmentArray<AnalyticSegment>();
  private _status: string;
  private _error: string;
  private _metric: Metric;

  private _alertEnabled?: boolean;

  constructor(private _panelObject?: any) {
    if(_panelObject === undefined) {
      this._panelObject = {};
    }
    _.defaults(this._panelObject, {
      name: 'AnalyticUnitName', confidence: 0.2, color: ANALYTIC_UNIT_COLORS[0], type: 'GENERAL'
    });

    //this._metric = new Metric(_panelObject.metric);
  }

  get id(): AnalyticUnitId { return this._panelObject.id; }
  set id(value: AnalyticUnitId) { this._panelObject.id = value; }

  set name(value: string) { this._panelObject.name = value; }
  get name(): string { return this._panelObject.name; }

  set type(value: string) { this._panelObject.type = value; }
  get type(): string { return this._panelObject.type; }

  set confidence(value: number) { this._panelObject.confidence = value; }
  get confidence(): number { return this._panelObject.confidence; }

  set color(value: string) { this._panelObject.color = value; }
  get color(): string { return this._panelObject.color; }

  get selected(): boolean { return this._selected; }
  set selected(value: boolean) { this._selected = value; }

  get deleteMode(): boolean { return this._deleteMode; }
  set deleteMode(value: boolean) { this._deleteMode = value; }

  get saving(): boolean { return this._saving; }
  set saving(value: boolean) { this._saving = value; }

  get visible(): boolean {
    return (this._panelObject.visible === undefined) ? true : this._panelObject.visible
  }
  set visible(value: boolean) {
    this._panelObject.visible = value;
  }

  get metric() { return this._metric; }

  addLabeledSegment(segment: Segment): AnalyticSegment {
    var asegment = new AnalyticSegment(true, segment.id, segment.from, segment.to);
    this._segmentSet.addSegment(asegment);
    return asegment;
  }

  removeSegmentsInRange(from: number, to: number): AnalyticSegment[] {
    let deletedSegments = this._segmentSet.removeInRange(from, to);
    deletedSegments.forEach(s => {
      s.deleted = true;
    });
    return deletedSegments;
  }

  get segments(): SegmentsSet<AnalyticSegment> { return this._segmentSet; }
  set segments(value: SegmentsSet<AnalyticSegment>) {
    this._segmentSet.setSegments(value.getSegments());
  }

  get status() { return this._status; }
  set status(value) {
    if(
      value !== 'READY' &&
      value !== 'LEARNING' &&
      value !== 'PENDING' &&
      value !== 'FAILED'
    ) {
      throw new Error('Unsupported status value: ' + value);
    }
    this._status = value;
  }

  get error() { return this._error; }
  set error(value) { this._error = value; }

  get isActiveStatus() {
    return this.status !== 'READY' && this.status !== 'FAILED';
  }

  get panelObject() { return this._panelObject; }

  get alertEnabled(): boolean { return this._alertEnabled; }
  set alertEnabled(value) { this._alertEnabled = value;}

}

export class AnalyticUnitsSet {

  private _mapIdIndex: Map<AnalyticUnitId, number>;
  private _items: AnalyticUnit[];

  constructor(private _panelObject: any[]) {
    if(_panelObject === undefined) {
      throw new Error('panel object can`t be undefined');
    }
    this._mapIdIndex = new Map<AnalyticUnitId, number>();
    this._items = _panelObject.map(p => new AnalyticUnit(p));
    this._rebuildIndex();
  }

  get items() { return this._items; }

  addItem(item: AnalyticUnit) {
    this._panelObject.push(item.panelObject);
    this._mapIdIndex[item.id] = this._items.length;
    this._items.push(item);
  }

  removeItem(id: AnalyticUnitId) {
    var index = this._mapIdIndex[id];
    this._panelObject.splice(index, 1);
    this._items.splice(index, 1);
    this._rebuildIndex();
  }

  _rebuildIndex() {
    this._items.forEach((a, i) => {
      this._mapIdIndex[a.id] = i;
    });
  }

  byId(id: AnalyticUnitId): AnalyticUnit {
    return this._items[this._mapIdIndex[id]];
  }

  byIndex(index: number): AnalyticUnit {
    return this._items[index];
  }
}
