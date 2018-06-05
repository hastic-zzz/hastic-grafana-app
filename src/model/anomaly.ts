import { SegmentsSet } from './segment_set';
import { SegmentArray } from './segment_array';
import { Segment, SegmentKey } from './segment';
import { Metric } from './metric';

import _ from 'lodash';

export type AnomalySermentPair = { anomalyType: AnomalyType, segment: AnomalySegment };
export type AnomalySegmentsSearcher = (point: number) => AnomalySermentPair[];

export type AnomalyKey = string;

export class AnomalySegment extends Segment {
  constructor(public labeled: boolean, key: SegmentKey, from: number, to: number) {
    super(key, from, to);
    if(!_.isBoolean(labeled)) {
      throw new Error('labeled value is not boolean');
    }
  }
}

export class AnomalyType {

  private _selected: boolean = false;
  private _deleteMode: boolean = false;
  private _saving: boolean = false;
  private _segmentSet = new SegmentArray<AnomalySegment>();
  private _status: string;
  private _metric: Metric;
  
  private _alertEnabled?: boolean;

  constructor(private _panelObject?: any) {
    if(_panelObject === undefined) {
      this._panelObject = {};
    }
    _.defaults(this._panelObject, {
      name: 'anomaly_name', confidence: 0.2, color: 'red', pattern: 'General approach'
    });

    //this._metric = new Metric(_panelObject.metric);
  }

  get key(): AnomalyKey { return this.name; }

  set name(value: string) { this._panelObject.name = value; }
  get name(): string { return this._panelObject.name; }

  set pattern(value: string) { this._panelObject.pattern = value; }
  get pattern(): string { return this._panelObject.pattern; }

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

  addLabeledSegment(segment: Segment): AnomalySegment {
    var asegment = new AnomalySegment(true, segment.key, segment.from, segment.to);
    this._segmentSet.addSegment(asegment);
    return asegment;
  }

  removeSegmentsInRange(from: number, to: number): AnomalySegment[] {
    return this._segmentSet.removeInRange(from, to);
  }

  get segments(): SegmentsSet<AnomalySegment> { return this._segmentSet; }
  set segments(value: SegmentsSet<AnomalySegment>) {
    this._segmentSet.setSegments(value.getSegments());
  }
  
  get status() { return this._status; }
  set status(value) {
    if(
      value !== 'ready' && 
      value !== 'learning' && 
      value !== 'pending' && 
      value !== 'failed'
    ) {
      throw new Error('Unsupported status value: ' + value);
    }
    this._status = value;
  }

  get isActiveStatus() {
    return this.status !== 'ready' && this.status !== 'failed';
  }

  get panelObject() { return this._panelObject; }

  get alertEnabled(): boolean {
    return this._alertEnabled;
  }

  set alertEnabled(value) {
    this._alertEnabled = value;
  }

}

export class AnomalyTypesSet {

  private _mapAnomalyKeyIndex: Map<AnomalyKey, number>;
  private _anomalyTypes: AnomalyType[];

  constructor(private _panelObject: any[]) {
    if(_panelObject === undefined) {
      throw new Error('panel object can`t be undefined');
    }
    this._mapAnomalyKeyIndex = new Map<AnomalyKey, number>();
    this._anomalyTypes = _panelObject.map(p => new AnomalyType(p));
    this._rebuildIndex();
  }

  get anomalyTypes() { return this._anomalyTypes; }

  addAnomalyType(anomalyType: AnomalyType) {
    this._panelObject.push(anomalyType.panelObject);
    this._mapAnomalyKeyIndex[anomalyType.name] = this._anomalyTypes.length;
    this._anomalyTypes.push(anomalyType);
  }

  removeAnomalyType(key: AnomalyKey) {
    var index = this._mapAnomalyKeyIndex[key];
    this._panelObject.splice(index, 1);
    this._anomalyTypes.splice(index, 1);
    this._rebuildIndex();
  }

  _rebuildIndex() {
    this._anomalyTypes.forEach((a, i) => {
      this._mapAnomalyKeyIndex[a.key] = i;
    });
  }

  byKey(key: AnomalyKey): AnomalyType {
    return this._anomalyTypes[this._mapAnomalyKeyIndex[key]];
  }

  byIndex(index: number): AnomalyType {
    return this._anomalyTypes[index];
  }
}
