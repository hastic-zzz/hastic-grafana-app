// Corresponds to https://github.com/hastic/hastic-server/blob/master/server/src/models/analytic_unit.ts

import { AnalyticService } from '../services/analytic_service'

import {
  AnalyticUnitId, AnalyticUnit,
  AnalyticUnitsSet, AnalyticSegment, AnalyticSegmentsSearcher, AnalyticSegmentPair
} from '../models/analytic_unit';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { Segment, SegmentId } from '../models/segment';
import { SegmentsSet } from '../models/segment_set';
import { SegmentArray } from '../models/segment_array';
import { ServerInfo } from '../models/info';

import { ANALYTIC_UNIT_COLORS } from '../colors';

import { Emitter } from 'grafana/app/core/utils/emitter';

import _ from 'lodash';
import * as tinycolor from 'tinycolor2';

export const REGION_FILL_ALPHA = 0.7;
export const REGION_STROKE_ALPHA = 0.9;
export const REGION_DELETE_COLOR_LIGHT = '#d1d1d1';
export const REGION_DELETE_COLOR_DARK = 'white';
const LABELED_SEGMENT_BORDER_COLOR = 'black';
const DELETED_SEGMENT_FILL_COLOR = 'black';
const DELETED_SEGMENT_BORDER_COLOR = 'black';


export class AnalyticController {

  private _analyticUnitsSet: AnalyticUnitsSet;
  private _selectedAnalyticUnitId: AnalyticUnitId = null;

  private _labelingDataAddedSegments: SegmentsSet<AnalyticSegment>;
  private _labelingDataDeletedSegments: SegmentsSet<AnalyticSegment>;
  private _newAnalyticUnit: AnalyticUnit = null;
  private _creatingNewAnalyticType: boolean = false;
  private _savingNewAnalyticUnit: boolean = false;
  private _tempIdCounted: number = -1;
  private _graphLocked: boolean = false;
  private _statusRunners: Set<AnalyticUnitId> = new Set<AnalyticUnitId>();
  private _serverInfo: ServerInfo;

  constructor(private _panelObject: any, private _analyticService: AnalyticService, private _emitter: Emitter) {
    if(_panelObject.analyticUnits === undefined) {
      _panelObject.analyticUnits = _panelObject.anomalyTypes || [];
    }
    this._labelingDataAddedSegments = new SegmentArray<AnalyticSegment>();
    this._labelingDataDeletedSegments = new SegmentArray<AnalyticSegment>();
    this._analyticUnitsSet = new AnalyticUnitsSet(this._panelObject.analyticUnits);
    // this.analyticUnits.forEach(a => this.runEnabledWaiter(a));
  }

  getSegmentsSearcher(): AnalyticSegmentsSearcher {
    return this._segmentsSearcher.bind(this);
  }

  private _segmentsSearcher(point: number, rangeDist: number): AnalyticSegmentPair[] {
    var result: AnalyticSegmentPair[] = [];
    this._analyticUnitsSet.items.forEach(at => {
      var segs = at.segments.findSegments(point, rangeDist);
      segs.forEach(s => {
        result.push({ analyticUnit: at, segment: s });
      })
    })
    return result;
  }

  createNew() {
    this._newAnalyticUnit = new AnalyticUnit();
    this._creatingNewAnalyticType = true;
    this._savingNewAnalyticUnit = false;
    if (this.analyticUnits.length === 0) {
      this._newAnalyticUnit.color = ANALYTIC_UNIT_COLORS[0];
    } else {
      let colorIndex = ANALYTIC_UNIT_COLORS.indexOf(_.last(this.analyticUnits).color) + 1;
      colorIndex %= ANALYTIC_UNIT_COLORS.length;
      this._newAnalyticUnit.color = ANALYTIC_UNIT_COLORS[colorIndex];
    }
  }

  async saveNew(metricExpanded: MetricExpanded, datasourceRequest: DatasourceRequest, panelId: number) {
    this._savingNewAnalyticUnit = true;
    this._newAnalyticUnit.id = await this._analyticService.postNewItem(
      metricExpanded, datasourceRequest, this._newAnalyticUnit, panelId
    );
    this._analyticUnitsSet.addItem(this._newAnalyticUnit);
    this._creatingNewAnalyticType = false;
    this._savingNewAnalyticUnit = false;
    // this.runEnabledWaiter(this._newAnalyticUnit);
    this._runStatusWaiter(this._newAnalyticUnit);
  }

  get creatingNew() { return this._creatingNewAnalyticType; }
  get saving() { return this._savingNewAnalyticUnit; }
  get newAnalyticUnit(): AnalyticUnit { return this._newAnalyticUnit; }

  get graphLocked() { return this._graphLocked; }
  set graphLocked(value) { this._graphLocked = value; }

  get labelingUnit(): AnalyticUnit {
    if(this._selectedAnalyticUnitId === null) {
      return null;
    }
    return this._analyticUnitsSet.byId(this._selectedAnalyticUnitId);
  }

  async toggleUnitTypeLabelingMode(id: AnalyticUnitId) {
    if(this.labelingUnit && this.labelingUnit.saving) {
      throw new Error('Can`t toggle during saving');
    }
    if(this._selectedAnalyticUnitId === id) {
      return this.disableLabeling();
    }
    await this.disableLabeling();
    this._selectedAnalyticUnitId = id;
    this.labelingUnit.selected = true;
    this.toggleVisibility(id, true);
  }

  async disableLabeling() {
    if(this._selectedAnalyticUnitId === null) {
      return;
    }
    this.labelingUnit.saving = true;
    var newIds = await this._saveLabelingData();
    this._labelingDataAddedSegments.getSegments().forEach((s, i) => {
      this.labelingUnit.segments.updateId(s.id, newIds[i]);
    });

    this.labelingUnit.saving = false;

    var anomaly = this.labelingUnit;
    this.dropLabeling();
    this._runStatusWaiter(anomaly);
  }

  undoLabeling() {
    this._labelingDataAddedSegments.getSegments().forEach(s => {
      this.labelingUnit.segments.remove(s.id);
    });
    this._labelingDataDeletedSegments.getSegments().forEach(s => {
      s.deleted = false;
    });
    this.dropLabeling();
  }

  dropLabeling() {
    this._labelingDataAddedSegments.clear();
    this._labelingDataDeletedSegments.clear();
    this.labelingUnit.selected = false;
    this._selectedAnalyticUnitId = null;
    this._tempIdCounted = -1;
  }

  get labelingMode(): boolean {
    return this._selectedAnalyticUnitId !== null;
  }

  get labelingDeleteMode(): boolean {
    if(!this.labelingMode) {
      return false;
    }
    return this.labelingUnit.deleteMode;
  }

  addLabelSegment(segment: Segment) {
    var asegment = this.labelingUnit.addLabeledSegment(segment);
    this._labelingDataAddedSegments.addSegment(asegment);
  }

  get analyticUnits(): AnalyticUnit[] {
    return this._analyticUnitsSet.items;
  }

  onAnalyticUnitColorChange(id: AnalyticUnitId, value: string) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    this._analyticUnitsSet.byId(id).color = value;
  }

  fetchAnalyticUnitsStatuses() {
    this.analyticUnits.forEach(a => this._runStatusWaiter(a));
  }

  async fetchAnalyticUnitsSegments(from: number, to: number) {
    if(!_.isNumber(+from)) {
      throw new Error('from isn`t number');
    }
    if(!_.isNumber(+to)) {
      throw new Error('to isn`t number');
    }
    var tasks = this.analyticUnits.map(a => this.fetchSegments(a, from, to));
    return Promise.all(tasks);
  }

  async fetchSegments(analyticUnit: AnalyticUnit, from: number, to: number): Promise<void> {
    if(!_.isNumber(+from)) {
      throw new Error('from isn`t number');
    }
    if(!_.isNumber(+to)) {
      throw new Error('to isn`t number');
    }
    var allSegmentsList = await this._analyticService.getSegments(analyticUnit.id, from, to);
    var allSegmentsSet = new SegmentArray(allSegmentsList);
    if(analyticUnit.selected) {
      this._labelingDataAddedSegments.getSegments().forEach(s => allSegmentsSet.addSegment(s));
      this._labelingDataDeletedSegments.getSegments().forEach(s => allSegmentsSet.remove(s.id));
    }
    analyticUnit.segments = allSegmentsSet;
  }

  private async _saveLabelingData(): Promise<SegmentId[]> {
    var unit = this.labelingUnit;
    if(unit === null) {
      throw new Error('analytic unit is not selected');
    }

    if(
      this._labelingDataAddedSegments.length === 0 &&
      this._labelingDataDeletedSegments.length === 0
    ) {
      return [];
    }

    return this._analyticService.updateSegments(
      unit.id, this._labelingDataAddedSegments, this._labelingDataDeletedSegments
    );
  }

  // TODO: move to renderer
  updateFlotEvents(isEditMode, options) {
    if(options.grid.markings === undefined) {
      options.markings = [];
    }

    for(var i = 0; i < this.analyticUnits.length; i++) {
      var analyticUnit = this.analyticUnits[i];
      var borderColor = addAlphaToRGB(analyticUnit.color, REGION_STROKE_ALPHA);
      var fillColor = addAlphaToRGB(analyticUnit.color, REGION_FILL_ALPHA);
      var segments = analyticUnit.segments.getSegments();
      if(!analyticUnit.visible) {
        continue;
      }
      if(isEditMode && this.labelingMode) {
        if(analyticUnit.selected) {
          borderColor = addAlphaToRGB(borderColor, 0.7);
          fillColor = addAlphaToRGB(borderColor, 0.7);
        } else {
          continue;
        }
      }

      var rangeDist = +options.xaxis.max - +options.xaxis.min;

      let labeledSegmentBorderColor = tinycolor(LABELED_SEGMENT_BORDER_COLOR).toRgbString();
      labeledSegmentBorderColor = addAlphaToRGB(labeledSegmentBorderColor, REGION_STROKE_ALPHA);
      let deletedSegmentFillColor = tinycolor(DELETED_SEGMENT_FILL_COLOR).toRgbString();
      deletedSegmentFillColor = addAlphaToRGB(deletedSegmentFillColor, REGION_STROKE_ALPHA);
      let deletedSegmentBorderColor = tinycolor(DELETED_SEGMENT_BORDER_COLOR).toRgbString();
      deletedSegmentBorderColor = addAlphaToRGB(deletedSegmentBorderColor, REGION_STROKE_ALPHA);

      segments.forEach(s => {
        let segmentBorderColor;
        let segmentFillColor = fillColor;

        if(this.labelingDeleteMode) {
          if(s.deleted) {
            segmentBorderColor = deletedSegmentBorderColor;
            segmentFillColor = deletedSegmentFillColor;
          }
        } else {
          if(s.deleted) {
            return;
          }
        }

        if(s.labeled) {
          segmentBorderColor = labeledSegmentBorderColor;
        } else {
          segmentBorderColor = borderColor;
        }

        var expanded = s.expandDist(rangeDist, 0.01);
        options.grid.markings.push({
          xaxis: { from: expanded.from, to: expanded.to },
          color: segmentFillColor
        });
        options.grid.markings.push({
          xaxis: { from: expanded.from, to: expanded.from },
          color: segmentBorderColor
        });
        options.grid.markings.push({
          xaxis: { from: expanded.to, to: expanded.to },
          color: segmentBorderColor
        });
      });
    }

  }

  deleteLabelingAnomalySegmentsInRange(from: number, to: number) {
    var allRemovedSegs = this.labelingUnit.removeSegmentsInRange(from, to);
    allRemovedSegs.forEach(s => {
      if(!this._labelingDataAddedSegments.has(s.id)) {
        this._labelingDataDeletedSegments.addSegment(s);
      }
    });
    this._labelingDataAddedSegments.removeInRange(from, to);
  }

  toggleDeleteMode() {
    if(!this.labelingMode) {
      throw new Error('Cant enter delete mode is labeling mode disabled');
    }
    this.labelingUnit.deleteMode = !this.labelingUnit.deleteMode;
  }

  async removeAnalyticUnit(id: AnalyticUnitId, silent: boolean = false) {
    if(id === this._selectedAnalyticUnitId) {
      this.dropLabeling();
    }
    this._analyticUnitsSet.removeItem(id);
    if(!silent) {
      await this._analyticService.removeAnalyticUnit(id);
    }
  }

  async toggleAnalyticUnitAlert(analyticUnit: AnalyticUnit) {
    analyticUnit.alert = analyticUnit.alert ? true : false;
    await this._analyticService.setAnalyticUnitAlert(analyticUnit);
  }

  private async _runStatusWaiter(analyticUnit: AnalyticUnit) {
    if(analyticUnit === undefined || analyticUnit === null) {
      throw new Error('analyticUnit not defined');
    }

    if(analyticUnit.id === undefined) {
      throw new Error('analyticUnit.id is undefined');
    }

    if(this._statusRunners.has(analyticUnit.id)) {
      return;
    }

    this._statusRunners.add(analyticUnit.id);

    var statusGenerator = this._analyticService.getStatusGenerator(
      analyticUnit.id, 1000
    );

    for await (const data of statusGenerator) {
      let status = data.status;
      let error = data.errorMessage;
      if(analyticUnit.status !== status) {
        analyticUnit.status = status;
        if(error !== undefined) {
          analyticUnit.error = error;
        }
        this._emitter.emit('analytic-unit-status-change', analyticUnit);
      }
      if(!analyticUnit.isActiveStatus) {
        break;
      }
    }

    this._statusRunners.delete(analyticUnit.id);
  }

  public getNewTempSegmentId(): SegmentId {
    this._tempIdCounted--;
    return this._tempIdCounted.toString();
  }

  public toggleVisibility(id: AnalyticUnitId, value?: boolean) {
    var analyticUnit = this._analyticUnitsSet.byId(id);
    if(value !== undefined) {
      analyticUnit.visible = value;
    } else {
      analyticUnit.visible = !analyticUnit.visible;
    }
  }

  public onAnalyticUnitDetectorChange(analyticUnitTypes: any) {
    this.newAnalyticUnit.type = analyticUnitTypes[this.newAnalyticUnit.detectorType][0].value;
  }

  public async updateServerInfo() {
    this._serverInfo = await this._analyticService.getServerInfo();
  }

  public get serverInfo() {
    return this._serverInfo;
  }

  public get serverStatus() {
    return this._analyticService.isUp;
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
