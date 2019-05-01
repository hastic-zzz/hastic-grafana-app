import { SegmentsSet } from '../segment_set';
import { SegmentArray } from '../segment_array';
import { Segment, SegmentId } from '../segment';
import { DetectionSpan } from '../detection';

import { ANALYTIC_UNIT_COLORS, DEFAULT_DELETED_SEGMENT_COLOR } from '../../colors';

import _ from 'lodash';


export enum DetectorType {
  PATTERN = 'pattern',
  THRESHOLD = 'threshold'
};

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
    if(!_.isBoolean(this.labeled)) {
      throw new Error('labeled value is not boolean');
    }
  }
}

// TODO: make it class field
const DEFAULTS = {
  name: 'AnalyticUnitName',
  labeledColor: ANALYTIC_UNIT_COLORS[0],
  deletedColor: DEFAULT_DELETED_SEGMENT_COLOR,
  alert: false,
  id: null,
  visible: true
};

export abstract class AnalyticUnit {

  private _labelingMode: LabelingMode = LabelingMode.LABELING;
  private _selected: boolean = false;
  private _saving: boolean = false;
  private _segmentSet = new SegmentArray<AnalyticSegment>();
  private _detectionSpans: DetectionSpan[];
  private _inspect = false;
  private _status: string;
  private _error: string;

  constructor(protected _serverObject?: any) {
    if(_serverObject === undefined) {
      this._serverObject = DEFAULTS;
    }
    _.defaults(this._serverObject, DEFAULTS);
  }

  get id(): AnalyticUnitId { return this._serverObject.id; }
  set id(value: AnalyticUnitId) { this._serverObject.id = value; }

  set name(value: string) { this._serverObject.name = value; }
  get name(): string { return this._serverObject.name; }

  set detectorType(value: DetectorType) { this._serverObject.detectorType = value; }
  get detectorType(): DetectorType { return this._serverObject.detectorType; }

  set type(value: string) { this._serverObject.type = value; }
  get type(): string { return this._serverObject.type; }

  set labeledColor(value: string) { this._serverObject.labeledColor = value; }
  get labeledColor(): string { return this._serverObject.labeledColor; }

  set deletedColor(value: string) { this._serverObject.deletedColor = value; }
  get deletedColor(): string { return this._serverObject.deletedColor; }

  set alert(value: boolean) { this._serverObject.alert = value; }
  get alert(): boolean { return this._serverObject.alert; }

  get selected(): boolean { return this._selected; }
  set selected(value: boolean) { this._selected = value; }

  get labelingMode(): LabelingMode { return this._labelingMode; }
  set labelingMode(value: LabelingMode) { this._labelingMode = value; }

  get saving(): boolean { return this._saving; }
  set saving(value: boolean) { this._saving = value; }

  get inspect(): boolean { return this._inspect; }
  set inspect(value: boolean) { this._inspect = value; }

  get visible(): boolean {
    return (this._serverObject.visible === undefined) ? true : this._serverObject.visible
  }
  set visible(value: boolean) {
    this._serverObject.visible = value;
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

  get detectionSpans(): DetectionSpan[] { return this._detectionSpans; }
  set detectionSpans(value: DetectionSpan[]) { this._detectionSpans = value; }

  get status() { return this._status; }
  set status(value) {
    // TODO: use enum
    if(
      value !== '404' &&
      value !== 'READY' &&
      value !== 'LEARNING' &&
      value !== 'PENDING' &&
      value !== 'FAILED' &&
      value !== null
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

  get serverObject() { return this._serverObject; }

}
