import { SegmentsSet } from './segment_set';
import { SegmentArray } from './segment_array';
import { Segment, SegmentId } from './segment';

import { ANALYTIC_UNIT_COLORS, DEFAULT_DELETED_SEGMENT_COLOR } from '../colors';

import _ from 'lodash';


export enum LabelingMode {
  LABELING = 'LABELING',
  UNLABELING = 'UNLABELING',
  DELETING = 'DELETING',
  NOT_IN_LABELING_MODE = 'NOT_IN_LABELING_MODE'
};

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

  private _labelingMode: LabelingMode = LabelingMode.LABELING;
  private _selected: boolean = false;
  private _saving: boolean = false;
  private _segmentSet = new SegmentArray<AnalyticSegment>();
  private _status: string;
  private _error: string;

  constructor(private _panelObject?: any) {
    if(_panelObject === undefined) {
      this._panelObject = {};
    }
    _.defaults(this._panelObject, {
      name: 'AnalyticUnitName',
      labeledColor: ANALYTIC_UNIT_COLORS[0],
      deletedColor: DEFAULT_DELETED_SEGMENT_COLOR,
      detectorType: 'pattern',
      type: 'GENERAL',
      alert: false
    });
  }

  get id(): AnalyticUnitId { return this._panelObject.id; }
  set id(value: AnalyticUnitId) { this._panelObject.id = value; }

  set name(value: string) { this._panelObject.name = value; }
  get name(): string { return this._panelObject.name; }

  set detectorType(value: string) { this._panelObject.detectorType = value; }
  get detectorType(): string { return this._panelObject.detectorType; }

  set type(value: string) { this._panelObject.type = value; }
  get type(): string { return this._panelObject.type; }

  set confidence(value: number) { this._panelObject.confidence = value; }
  get confidence(): number { return this._panelObject.confidence; }

  set labeledColor(value: string) { this._panelObject.labeledColor = value; }
  get labeledColor(): string { return this._panelObject.labeledColor; }

  set deletedColor(value: string) { this._panelObject.deletedColor = value; }
  get deletedColor(): string { return this._panelObject.deletedColor; }

  set alert(value: boolean) { this._panelObject.alert = value; }
  get alert(): boolean { return this._panelObject.alert; }

  get selected(): boolean { return this._selected; }
  set selected(value: boolean) { this._selected = value; }

  get labelingMode(): LabelingMode { return this._labelingMode; }
  set labelingMode(value: LabelingMode) { this._labelingMode = value; }

  get saving(): boolean { return this._saving; }
  set saving(value: boolean) { this._saving = value; }

  get visible(): boolean {
    return (this._panelObject.visible === undefined) ? true : this._panelObject.visible
  }
  set visible(value: boolean) {
    this._panelObject.visible = value;
  }

  addLabeledSegment(segment: Segment, deleted: boolean): AnalyticSegment {
    const asegment = new AnalyticSegment(!deleted, segment.id, segment.from, segment.to, deleted);
    this._segmentSet.addSegment(asegment);
    return asegment;
  }

  removeSegmentsInRange(from: number, to: number): AnalyticSegment[] {
    let deletedSegments = this._segmentSet.removeInRange(from, to);
    return deletedSegments;
  }

  get segments(): SegmentsSet<AnalyticSegment> { return this._segmentSet; }
  set segments(value: SegmentsSet<AnalyticSegment>) {
    this._segmentSet.setSegments(value.getSegments());
  }

  get status() { return this._status; }
  set status(value) {
    if(
      value !== '404' &&
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
    switch(this.status) {
      case '404':
      case 'READY':
      case 'FAILED':
        return false;
    }
    return true;
  }

  get panelObject() { return this._panelObject; }

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
