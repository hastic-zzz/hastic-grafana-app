import { AnomalyService } from '../services/anomaly_service'

import {
  AnomalyKey, AnomalyType,
  AnomalyTypesSet, AnomalySegment, AnomalySegmentsSearcher, AnomalySermentPair
} from '../model/anomaly';
import { MetricExpanded } from '../model/metric';
import { DatasourceRequest } from '../model/datasource';
import { Segment, SegmentKey } from '../model/segment';
import { SegmentsSet } from '../model/segment_set';
import { SegmentArray } from '../model/segment_array';
import { Emitter } from 'grafana/app/core/utils/emitter'

import _ from 'lodash';

export const REGION_FILL_ALPHA = 0.7;
export const REGION_STROKE_ALPHA = 0.9;
export const REGION_DELETE_COLOR_LIGHT = '#d1d1d1';
export const REGION_DELETE_COLOR_DARK = 'white';


export class AnomalyController {

  private _anomalyTypesSet: AnomalyTypesSet;
  private _selectedAnomalyKey: AnomalyKey = null;

  private _labelingDataAddedSegments: SegmentsSet<AnomalySegment>;
  private _labelingDataDeletedSegments: SegmentsSet<AnomalySegment>;
  private _newAnomalyType: AnomalyType = null;
  private _creatingNewAnomalyType: boolean = false;
  private _savingNewAnomalyType: boolean = false;
  private _tempIdCounted = -1;
  private _graphLocked = false;

  private _statusRunners: Set<AnomalyKey> = new Set<AnomalyKey>();


  constructor(private _panelObject: any, private _anomalyService: AnomalyService, private _emitter: Emitter) {
    if(_panelObject.anomalyTypes === undefined) {
      _panelObject.anomalyTypes = [];
    }
    this._labelingDataAddedSegments = new SegmentArray<AnomalySegment>();
    this._labelingDataDeletedSegments = new SegmentArray<AnomalySegment>();
    this._anomalyTypesSet = new AnomalyTypesSet(this._panelObject.anomalyTypes);
    this.anomalyTypes.forEach(a => this.runAnomalyTypeAlertEnabledWaiter(a));
  }

  getAnomalySegmentsSearcher(): AnomalySegmentsSearcher {
    return this._anomalySegmentsSearcher.bind(this);
  }

  private _anomalySegmentsSearcher(point: number): AnomalySermentPair[] {
    var result: AnomalySermentPair[] = [];
    this._anomalyTypesSet.anomalyTypes.forEach(at => {
      var segs = at.segments.findSegments(point);
      segs.forEach(s => {
        result.push({ anomalyType: at, segment: s });
      })
    })
    return result;
  }

  createAnomalyType() {
    this._newAnomalyType = new AnomalyType();
    this._creatingNewAnomalyType = true;
    this._savingNewAnomalyType = false;
  }

  async saveNewAnomalyType(metricExpanded: MetricExpanded, datasourceRequest: DatasourceRequest, panelId: number) {
    this._savingNewAnomalyType = true;
    await this._anomalyService.postNewAnomalyType(metricExpanded, datasourceRequest, this._newAnomalyType, panelId);
    this._anomalyTypesSet.addAnomalyType(this._newAnomalyType);
    this._creatingNewAnomalyType = false;
    this._savingNewAnomalyType = false;
    this.runAnomalyTypeAlertEnabledWaiter(this._newAnomalyType);
  }

  get creatingAnomalyType() { return this._creatingNewAnomalyType; }
  get savingAnomalyType() { return this._savingNewAnomalyType; }
  get newAnomalyType(): AnomalyType { return this._newAnomalyType; }

  get graphLocked() { return this._graphLocked; }
  set graphLocked(value) {
    this._graphLocked = value;
  }

  get labelingAnomaly(): AnomalyType {
    if(this._selectedAnomalyKey === null) {
      return null;
    }
    return this._anomalyTypesSet.byKey(this._selectedAnomalyKey);
  }

  async toggleAnomalyTypeLabelingMode(key: AnomalyKey) {
    if(this.labelingAnomaly && this.labelingAnomaly.saving) {
      throw new Error('Can`t toggel during saving');
    }
    if(this._selectedAnomalyKey === key) {
      return this.disableAnomalyLabeling();
    }
    await this.disableAnomalyLabeling();
    this._selectedAnomalyKey = key;
    this.labelingAnomaly.selected = true;
    this.toggleAnomalyVisibility(key, true);
  }

  async disableAnomalyLabeling() {
    if(this._selectedAnomalyKey === null) {
      return;
    }
    this.labelingAnomaly.saving = true;
    var newIds = await this._saveLabelingData();
    this._labelingDataAddedSegments.getSegments().forEach((s, i) => {
      this.labelingAnomaly.segments.updateKey(s.key, newIds[i]);
    })
    this.labelingAnomaly.saving = false;
    
    var anomaly = this.labelingAnomaly;
    this.dropLabeling();
    this._runAnomalyTypeStatusWaiter(anomaly);
  }

  undoLabeling() {
    this._labelingDataAddedSegments.getSegments().forEach(s => {
      this.labelingAnomaly.segments.remove(s.key);
    });
    this._labelingDataDeletedSegments.getSegments().forEach(s => {
      this.labelingAnomaly.segments.addSegment(s);
    });
    this.dropLabeling();
  }

  dropLabeling() {
    this._labelingDataAddedSegments.clear();
    this._labelingDataDeletedSegments.clear();
    this.labelingAnomaly.selected = false;
    this._selectedAnomalyKey = null;
    this._tempIdCounted = -1;
  }

  get labelingMode(): boolean {
    return this._selectedAnomalyKey !== null;
  }

  get labelingDeleteMode(): boolean {
    if(!this.labelingMode) {
      return false;
    }
    return this.labelingAnomaly.deleteMode;
  }

  addLabelSegment(segment: Segment) {
    var asegment = this.labelingAnomaly.addLabeledSegment(segment);
    this._labelingDataAddedSegments.addSegment(asegment);
  }

  get anomalyTypes(): AnomalyType[] {
    return this._anomalyTypesSet.anomalyTypes;
  }

  onAnomalyColorChange(key: AnomalyKey, value) {
    this._anomalyTypesSet.byKey(key).color = value;
  }

  fetchAnomalyTypesStatuses() {
    this.anomalyTypes.forEach(a => this._runAnomalyTypeStatusWaiter(a));
  }

  async fetchAnomalyTypesSegments(from: number, to: number) {
    if(!_.isNumber(from)) {
      throw new Error('from isn`t number');
    }
    if(!_.isNumber(+to)) {
      throw new Error('to isn`t number');
    }
    var tasks = this.anomalyTypes.map(a => this.fetchSegments(a, from, to));
    return Promise.all(tasks);
  }

  async fetchSegments(anomalyType: AnomalyType, from: number, to: number): Promise<void> {
    if(!_.isNumber(from)) {
      throw new Error('from isn`t number');
    }
    if(!_.isNumber(+to)) {
      throw new Error('to isn`t number');
    }
    var allSegmentsList = await this._anomalyService.getSegments(anomalyType.key, from, to);
    var allSegmentsSet = new SegmentArray(allSegmentsList);
    if(anomalyType.selected) {
      this._labelingDataAddedSegments.getSegments().forEach(s => allSegmentsSet.addSegment(s));
      this._labelingDataDeletedSegments.getSegments().forEach(s => allSegmentsSet.remove(s.key));
    }
    anomalyType.segments = allSegmentsSet;
  }

  private async _saveLabelingData(): Promise<SegmentKey[]> {
    var anomaly = this.labelingAnomaly;
    if(anomaly === null) {
      throw new Error('anomaly is not selected');
    }

    if(
      this._labelingDataAddedSegments.length === 0 &&
      this._labelingDataDeletedSegments.length === 0
    ) {
      return [];
    }

    return this._anomalyService.updateSegments(
      anomaly.key, this._labelingDataAddedSegments, this._labelingDataDeletedSegments
    );
  }

  // TODO: move to renderer
  updateFlotEvents(isEditMode, options) {
    if(options.grid.markings === undefined) {
      options.markings = [];
    }

    for(var i = 0; i < this.anomalyTypes.length; i++) {
      var anomalyType = this.anomalyTypes[i];
      var borderColor = addAlphaToRGB(anomalyType.color, REGION_STROKE_ALPHA);
      var fillColor = addAlphaToRGB(anomalyType.color, REGION_FILL_ALPHA);
      var segments = anomalyType.segments.getSegments();
      if(!anomalyType.visible) {
        continue;
      }
      if(isEditMode && this.labelingMode) {
        if(anomalyType.selected) {
          borderColor = addAlphaToRGB(borderColor, 0.7);
          fillColor = addAlphaToRGB(borderColor, 0.7);
        } else {
          continue;
        }
      }

      var rangeDist = +options.xaxis.max - +options.xaxis.min;
      segments.forEach(s => {
        var expanded = s.expandDist(rangeDist, 0.01);
        options.grid.markings.push({
          xaxis: { from: expanded.from, to: expanded.to },
          color: fillColor
        });
        options.grid.markings.push({
          xaxis: { from: expanded.from, to: expanded.from },
          color: borderColor
        });
        options.grid.markings.push({
          xaxis: { from: expanded.to, to: expanded.to },
          color: borderColor
        });
      });
    }

  }

  deleteLabelingAnomalySegmentsInRange(from: number, to: number) {
    var allRemovedSegs = this.labelingAnomaly.removeSegmentsInRange(from, to);
    allRemovedSegs.forEach(s => {
      if(!this._labelingDataAddedSegments.has(s.key)) {
        this._labelingDataDeletedSegments.addSegment(s);
      }
    });
    this._labelingDataAddedSegments.removeInRange(from, to);
  }

  toggleDeleteMode() {
    if(!this.labelingMode) {
      throw new Error('Cant enter delete mode is labeling mode disabled');
    }
    this.labelingAnomaly.deleteMode = !this.labelingAnomaly.deleteMode;
  }

  removeAnomalyType(key) {
    if(key === this._selectedAnomalyKey) {
      this.dropLabeling();
    }
    this._anomalyTypesSet.removeAnomalyType(key);
  }

  private async _runAnomalyTypeStatusWaiter(anomalyType: AnomalyType) {
    if(anomalyType === undefined || anomalyType === null) {
      throw new Error('anomalyType not defined');
    }

    if(this._statusRunners.has(anomalyType.key)) {
      return;
    }

    this._statusRunners.add(anomalyType.key);

    var statusGenerator = this._anomalyService.getAnomalyTypeStatusGenerator(
      anomalyType.key, 1000
    );

    for await (const status of statusGenerator) {
      if(anomalyType.status !== status) {
        anomalyType.status = status;
        this._emitter.emit('anomaly-type-status-change', anomalyType);
      }
      if(!anomalyType.isActiveStatus) {
        break;
      }
    }

    this._statusRunners.delete(anomalyType.key);
  }

  async runAnomalyTypeAlertEnabledWaiter(anomalyType: AnomalyType) {
    var enabled = await this._anomalyService.getAlertEnabled(anomalyType.key);
    if(anomalyType.alertEnabled !== enabled) {
      anomalyType.alertEnabled = enabled;
      this._emitter.emit('anomaly-type-alert-change', anomalyType);
    }
  }

  async toggleAnomalyTypeAlertEnabled(anomalyType: AnomalyType) {
    var enabled = anomalyType.alertEnabled;
    anomalyType.alertEnabled = undefined;
    await this._anomalyService.setAlertEnabled(anomalyType.key, enabled);
    anomalyType.alertEnabled = enabled;
    this._emitter.emit('anomaly-type-alert-change', anomalyType);
  }

  public getIdForNewLabelSegment() {
    this._tempIdCounted--;
    return this._tempIdCounted;
  }

  public toggleAnomalyVisibility(key: AnomalyKey, value?: boolean) {
    var anomaly = this._anomalyTypesSet.byKey(key);
    if(value !== undefined) {
      anomaly.visible = value;
    } else {
      anomaly.visible = !anomaly.visible;
    }
  }

}

function addAlphaToRGB(colorString: string, alpha: number): string {
  let color = tinycolor(colorString);
  if (color.isValid()) {
    color.setAlpha(color.getAlpha() * alpha);
    return color.toRgbString();
  } else {
    return colorString;
  }
}
