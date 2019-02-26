// Corresponds to https://github.com/hastic/hastic-server/blob/master/server/src/models/analytic_unit.ts

import { AnalyticService } from '../services/analytic_service'

import {
  AnalyticUnitId, AnalyticUnit,
  AnalyticUnitsSet, AnalyticSegment, AnalyticSegmentsSearcher, AnalyticSegmentPair,
  LabelingMode
} from '../models/analytic_unit';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { Segment, SegmentId } from '../models/segment';
import { SegmentsSet } from '../models/segment_set';
import { SegmentArray } from '../models/segment_array';
import { ServerInfo } from '../models/info';
import { Threshold, Condition } from '../models/threshold';
import text from '../partials/help_section.html';

import {
  ANALYTIC_UNIT_COLORS,
  LABELED_SEGMENT_BORDER_COLOR,
  DELETED_SEGMENT_BORDER_COLOR,
  SEGMENT_FILL_ALPHA,
  SEGMENT_STROKE_ALPHA,
  LABELING_MODE_ALPHA
} from '../colors';

import { Emitter } from 'grafana/app/core/utils/emitter';

import _ from 'lodash';
import * as tinycolor from 'tinycolor2';

export class AnalyticController {

  private _analyticUnitsSet: AnalyticUnitsSet;
  private _selectedAnalyticUnitId: AnalyticUnitId = null;

  private _labelingDataAddedSegments: SegmentsSet<AnalyticSegment>;
  private _labelingDataRemovedSegments: SegmentsSet<AnalyticSegment>;
  private _newAnalyticUnit: AnalyticUnit = null;
  private _creatingNewAnalyticType: boolean = false;
  private _savingNewAnalyticUnit: boolean = false;
  private _tempIdCounted: number = -1;
  private _graphLocked: boolean = false;
  private _statusRunners: Set<AnalyticUnitId> = new Set<AnalyticUnitId>();
  private _serverInfo: ServerInfo;
  private _currentMetric: MetricExpanded;
  private _currentDatasource: DatasourceRequest;
  private _thresholds: Threshold[];

  constructor(private _panelObject: any, private _analyticService: AnalyticService, private _emitter: Emitter) {
    if(_panelObject.analyticUnits === undefined) {
      _panelObject.analyticUnits = _panelObject.anomalyTypes || [];
    }
    this._labelingDataAddedSegments = new SegmentArray<AnalyticSegment>();
    this._labelingDataRemovedSegments = new SegmentArray<AnalyticSegment>();
    this._analyticUnitsSet = new AnalyticUnitsSet(this._panelObject.analyticUnits);
    this._thresholds = [];
    this.updateThresholds();

    // this.analyticUnits.forEach(a => this.runEnabledWaiter(a));
  }

  get helpSectionText() { return text; }

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

  async sendThresholdParamsToServer(id: AnalyticUnitId) {
    await this.saveThreshold(id);
    await this._analyticService.runDetect(id);
    await this._runStatusWaiter(this._analyticUnitsSet.byId(id));
  }

  createNew() {
    this._newAnalyticUnit = new AnalyticUnit();
    this._creatingNewAnalyticType = true;
    this._savingNewAnalyticUnit = false;
    if (this.analyticUnits.length === 0) {
      this._newAnalyticUnit.labeledColor = ANALYTIC_UNIT_COLORS[0];
    } else {
      let colorIndex = ANALYTIC_UNIT_COLORS.indexOf(_.last(this.analyticUnits).labeledColor) + 1;
      colorIndex %= ANALYTIC_UNIT_COLORS.length;
      this._newAnalyticUnit.labeledColor = ANALYTIC_UNIT_COLORS[colorIndex];
    }
  }

  async saveNew(metric: MetricExpanded, datasource: DatasourceRequest, panelUrl: string) {
    this._savingNewAnalyticUnit = true;
    this._newAnalyticUnit.id = await this._analyticService.postNewItem(
      this._newAnalyticUnit, metric, datasource, panelUrl
    );
    if(this._newAnalyticUnit.detectorType === 'threshold') {
      await this.saveThreshold(this._newAnalyticUnit.id);
    }
    this._analyticUnitsSet.addItem(this._newAnalyticUnit);
    this._creatingNewAnalyticType = false;
    this._savingNewAnalyticUnit = false;
    if(this._newAnalyticUnit.detectorType !== 'threshold') {
      this._runStatusWaiter(this._newAnalyticUnit);
    }
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

  async toggleUnitTypeLabelingMode(id: AnalyticUnitId, metric: MetricExpanded, datasource: DatasourceRequest) {
    this._currentMetric = metric;
    this._currentDatasource = datasource;

    if(this.labelingUnit && this.labelingUnit.saving) {
      throw new Error('Can`t toggle during saving');
    }
    if(this._selectedAnalyticUnitId === id) {
      return this.disableLabeling();
    }
    await this.disableLabeling();
    this._selectedAnalyticUnitId = id;
    this.labelingUnit.selected = true;
    this.toggleLabelingMode(LabelingMode.LABELING);
    this.toggleVisibility(id, true);
  }

  async disableLabeling() {
    if(this._selectedAnalyticUnitId === null) {
      return;
    }
    this.labelingUnit.saving = true;
    const newIds = await this._saveLabelingData();
    this._labelingDataAddedSegments.getSegments().forEach((s, i) => {
      this.labelingUnit.segments.updateId(s.id, newIds[i]);
    });

    this.labelingUnit.saving = false;

    let unit = this.labelingUnit;
    this.dropLabeling();
    this._runStatusWaiter(unit);
  }

  undoLabeling() {
    this._labelingDataAddedSegments.getSegments().forEach(s => {
      this.labelingUnit.segments.remove(s.id);
    });
    this._labelingDataRemovedSegments.getSegments().forEach(s => {
      this.labelingUnit.segments.addSegment(s);
    });
    this.dropLabeling();
  }

  dropLabeling() {
    this._labelingDataAddedSegments.clear();
    this._labelingDataRemovedSegments.clear();
    this.labelingUnit.selected = false;
    this._selectedAnalyticUnitId = null;
    this._tempIdCounted = -1;
  }

  get inLabelingMode(): boolean {
    return this._selectedAnalyticUnitId !== null;
  }

  get labelingMode(): LabelingMode {
    if(!this.inLabelingMode) {
      return LabelingMode.NOT_IN_LABELING_MODE;
    }
    return this.labelingUnit.labelingMode;
  }

  set labelingMode(labelingMode: LabelingMode) {
    this.labelingUnit.labelingMode = labelingMode;
  }

  addLabelSegment(segment: Segment, deleted = false) {
    const asegment = this.labelingUnit.addLabeledSegment(segment, deleted);
    this._labelingDataAddedSegments.addSegment(asegment);
  }

  get analyticUnits(): AnalyticUnit[] {
    return this._analyticUnitsSet.items;
  }

  onAnalyticUnitColorChange(id: AnalyticUnitId, value: string, deleted: boolean) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    if(deleted) {
      this._analyticUnitsSet.byId(id).deletedColor = value;
    } else {
      this._analyticUnitsSet.byId(id).labeledColor = value;
    }
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
      this._labelingDataRemovedSegments.getSegments().forEach(s => allSegmentsSet.remove(s.id));
    }
    analyticUnit.segments = allSegmentsSet;
  }

  private async _saveLabelingData(): Promise<SegmentId[]> {
    let unit = this.labelingUnit;
    if(unit === null) {
      throw new Error('analytic unit is not selected');
    }

    if(
      this._labelingDataAddedSegments.length === 0 &&
      this._labelingDataRemovedSegments.length === 0
    ) {
      return [];
    }


    await this._analyticService.updateMetric(unit.id, this._currentMetric, this._currentDatasource);
    const newIds = await this._analyticService.updateSegments(
      unit.id, this._labelingDataAddedSegments, this._labelingDataRemovedSegments
    );
    if(unit.labelingMode !== LabelingMode.UNLABELING) {
      await this._analyticService.runDetect(unit.id);
    }
    return newIds;
  }

  // TODO: move to renderer
  updateFlotEvents(isEditMode: boolean, options: any) {
    if(options.grid.markings === undefined) {
      options.markings = [];
    }

    for(var i = 0; i < this.analyticUnits.length; i++) {
      const analyticUnit = this.analyticUnits[i];
      if(!analyticUnit.visible) {
        continue;
      }

      let defaultBorderColor = addAlphaToRGB(analyticUnit.labeledColor, SEGMENT_STROKE_ALPHA);
      let defaultFillColor = addAlphaToRGB(analyticUnit.labeledColor, SEGMENT_FILL_ALPHA);
      let labeledSegmentBorderColor = tinycolor(LABELED_SEGMENT_BORDER_COLOR).toRgbString();
      labeledSegmentBorderColor = addAlphaToRGB(labeledSegmentBorderColor, SEGMENT_STROKE_ALPHA);
      let deletedSegmentFillColor = tinycolor(analyticUnit.deletedColor).toRgbString();
      deletedSegmentFillColor = addAlphaToRGB(deletedSegmentFillColor, SEGMENT_FILL_ALPHA);
      let deletedSegmentBorderColor = tinycolor(DELETED_SEGMENT_BORDER_COLOR).toRgbString();
      deletedSegmentBorderColor = addAlphaToRGB(deletedSegmentBorderColor, SEGMENT_STROKE_ALPHA);

      if(isEditMode && this.inLabelingMode && analyticUnit.selected) {
        defaultBorderColor = addAlphaToRGB(defaultBorderColor, LABELING_MODE_ALPHA);
        defaultFillColor = addAlphaToRGB(defaultFillColor, LABELING_MODE_ALPHA);
        labeledSegmentBorderColor = addAlphaToRGB(labeledSegmentBorderColor, LABELING_MODE_ALPHA);
        deletedSegmentFillColor = addAlphaToRGB(deletedSegmentFillColor, LABELING_MODE_ALPHA);
        deletedSegmentBorderColor = addAlphaToRGB(deletedSegmentBorderColor, LABELING_MODE_ALPHA);
      }

      const segments = analyticUnit.segments.getSegments();
      const rangeDist = +options.xaxis.max - +options.xaxis.min;

      segments.forEach(s => {
        let segmentBorderColor = defaultBorderColor;
        let segmentFillColor = defaultFillColor;

        if(s.deleted) {
          segmentBorderColor = deletedSegmentBorderColor;
          segmentFillColor = deletedSegmentFillColor;
        } else {
          if(s.labeled) {
            segmentBorderColor = labeledSegmentBorderColor;
          }
        }

        const expanded = s.expandDist(rangeDist, 0.01);
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

  deleteLabelingAnalyticUnitSegmentsInRange(from: number, to: number) {
    const allRemovedSegs = this.labelingUnit.removeSegmentsInRange(from, to);
    allRemovedSegs.forEach(s => {
      if(!this._labelingDataAddedSegments.has(s.id)) {
        this._labelingDataRemovedSegments.addSegment(s);
      }
    });
    this._labelingDataAddedSegments.removeInRange(from, to);
  }

  toggleLabelingMode(labelingMode: LabelingMode) {
    if(!this.inLabelingMode) {
      throw new Error(`Can't enter ${labelingMode} mode when labeling mode is disabled`);
    }
    if(this.labelingUnit.labelingMode === labelingMode) {
      this.labelingUnit.labelingMode = LabelingMode.LABELING;
    } else {
      this.labelingUnit.labelingMode = labelingMode;
    }
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

  async fetchAnalyticUnitName(analyticUnit: AnalyticUnit) {
    let updateObj = {
      id: analyticUnit.id,
      name: analyticUnit.name
    }
    await this._analyticService.updateAnalyticUnit(analyticUnit.id, updateObj);
  }

  async updateThresholds() {
    const ids = _.map(this._panelObject.analyticUnits, (analyticUnit: any) => analyticUnit.id);
    const thresholds = await this._analyticService.getThresholds(ids);
    this._thresholds = thresholds;
  }

  getThreshold(id: AnalyticUnitId) {
    let threshold = _.find(this._thresholds, { id });
    if(threshold === undefined) {
      threshold = {
        id,
        value: 0,
        condition: Condition.ABOVE
      };
      this._thresholds.push(threshold);
    }
    return threshold;
  }

  async saveThreshold(id: AnalyticUnitId) {
    const threshold = this.getThreshold(id);
    if(threshold.value === undefined) {
      throw new Error('Cannot save threshold with undefined value');
    }
    if(threshold.condition === undefined) {
      throw new Error('Cannot save threshold with undefined condition');
    }
    return this._analyticService.updateThreshold(threshold);
  }

  public get conditions() {
    return _.values(Condition);
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
