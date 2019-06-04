// Corresponds to https://github.com/hastic/hastic-server/blob/master/server/src/models/analytic_units/analytic_unit.ts

import { AnalyticService, TableTimeSeries } from '../services/analytic_service';

import {
  AnalyticUnitId, AnalyticUnit,
  AnalyticSegment, AnalyticSegmentsSearcher, AnalyticSegmentPair,
  LabelingMode
} from '../models/analytic_units/analytic_unit';
import { AnomalyAnalyticUnit } from '../models/analytic_units/anomaly_analytic_unit';
import { AnalyticUnitsSet } from '../models/analytic_units/analytic_units_set';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { Segment, SegmentId } from '../models/segment';
import { SegmentsSet } from '../models/segment_set';
import { SegmentArray } from '../models/segment_array';
import { HasticServerInfo, HasticServerInfoUnknown } from '../models/hastic_server_info';
import { Condition } from '../models/analytic_units/threshold_analytic_unit';
import { DetectionStatus, DETECTION_STATUS_TEXT, DetectionSpan } from '../models/detection';
import { createAnalyticUnit } from '../models/analytic_units/utils';
import helpSectionText from '../partials/help_section.html';

import {
  ANALYTIC_UNIT_COLORS,
  LABELED_SEGMENT_BORDER_COLOR,
  DELETED_SEGMENT_BORDER_COLOR,
  SEGMENT_FILL_ALPHA,
  SEGMENT_STROKE_ALPHA,
  LABELING_MODE_ALPHA,
  DETECTION_STATUS_COLORS
} from '../colors';

import { Emitter } from 'grafana/app/core/utils/emitter';

import _ from 'lodash';
import * as tinycolor from 'tinycolor2';

export type HSRTimeSeries = { datapoints: [number, number][]; target: string; };

export class AnalyticController {

  private _analyticUnitsSet: AnalyticUnitsSet;
  private _selectedAnalyticUnitId: AnalyticUnitId = null;

  private _labelingDataAddedSegments: SegmentsSet<AnalyticSegment>;
  private _labelingDataRemovedSegments: SegmentsSet<AnalyticSegment>;
  private _newAnalyticUnit: AnalyticUnit = null;
  private _creatingNewAnalyticUnit: boolean = false;
  private _savingNewAnalyticUnit: boolean = false;
  private _tempIdCounted: number = -1;
  private _graphLocked: boolean = false;
  private _statusRunners: Set<AnalyticUnitId> = new Set<AnalyticUnitId>();
  private _detectionRunners: Set<AnalyticUnitId> = new Set<AnalyticUnitId>();
  private _serverInfo: HasticServerInfo;
  private _currentMetric: MetricExpanded;
  private _currentDatasource: DatasourceRequest;
  private _loading = true;

  constructor(
    private _grafanaUrl: string,
    private _panelId: string,
    private _panelObject: any,
    private _emitter: Emitter,
    private _analyticService?: AnalyticService,
  ) {
    this._labelingDataAddedSegments = new SegmentArray<AnalyticSegment>();
    this._labelingDataRemovedSegments = new SegmentArray<AnalyticSegment>();
    this._analyticUnitsSet = new AnalyticUnitsSet([]);
    this.fetchAnalyticUnits();
  }

  get helpSectionText() { return helpSectionText; }

  get loading() {
    return this._loading;
  }

  getSegmentsSearcher(): AnalyticSegmentsSearcher {
    return this._segmentsSearcher.bind(this);
  }

  private _segmentsSearcher(point: number, rangeDist: number): AnalyticSegmentPair[] {
    let result: AnalyticSegmentPair[] = [];
    this._analyticUnitsSet.items.forEach(analyticUnit => {
      if(!analyticUnit.visible) {
        return;
      }
      const segs = analyticUnit.segments.findSegments(point, rangeDist);
      segs.forEach(s => {
        result.push({ analyticUnit, segment: s });
      });
    })
    return result;
  }

  createNew() {
    this._newAnalyticUnit = new AnalyticUnit();
    this._creatingNewAnalyticUnit = true;
    this._savingNewAnalyticUnit = false;
    if(this.analyticUnits.length === 0) {
      this._newAnalyticUnit.labeledColor = ANALYTIC_UNIT_COLORS[0];
    } else {
      let colorIndex = ANALYTIC_UNIT_COLORS.indexOf(_.last(this.analyticUnits).labeledColor) + 1;
      colorIndex %= ANALYTIC_UNIT_COLORS.length;
      this._newAnalyticUnit.labeledColor = ANALYTIC_UNIT_COLORS[colorIndex];
    }
  }

  cancelCreation() {
    delete this._newAnalyticUnit;
    this._creatingNewAnalyticUnit = false;
  }

  async saveNew(metric: MetricExpanded, datasource: DatasourceRequest) {
    this._savingNewAnalyticUnit = true;
    const newAnalyticUnit = createAnalyticUnit(this._newAnalyticUnit.toJSON());
    newAnalyticUnit.id = await this._analyticService.postNewAnalyticUnit(
      newAnalyticUnit, metric, datasource, this._grafanaUrl, this._panelId
    );
    this._analyticUnitsSet.addItem(newAnalyticUnit);
    this._creatingNewAnalyticUnit = false;
    this._savingNewAnalyticUnit = false;
    delete this._newAnalyticUnit;
  }

  get creatingNew() { return this._creatingNewAnalyticUnit; }
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

  async toggleAnalyticUnitLabelingMode(id: AnalyticUnitId, metric: MetricExpanded, datasource: DatasourceRequest) {
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
    const labelingModes = this.labelingUnit.labelingModes;
    this.toggleLabelingMode(labelingModes[0].value);
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

  addSegment(segment: Segment, deleted = false) {
    const addedSegment = this.labelingUnit.addSegment(segment, deleted);
    this._labelingDataAddedSegments.addSegment(addedSegment);
  }

  get analyticUnits(): AnalyticUnit[] {
    return this._analyticUnitsSet.items;
  }

  async onAnalyticUnitColorChange(id: AnalyticUnitId, value: string, deleted: boolean) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    const analyticUnit = this._analyticUnitsSet.byId(id);
    if(deleted) {
      analyticUnit.deletedColor = value;
    } else {
      analyticUnit.labeledColor = value;
    }
    analyticUnit.changed = true;
  }

  fetchAnalyticUnitsStatuses() {
    this.analyticUnits.forEach(a => this._runStatusWaiter(a));
  }

  fetchAnalyticUnitsDetections(from?: number, to?: number) {
    if(from === undefined || to === undefined) {
      return;
    }
    this.analyticUnits.forEach(analyticUnit => {
      if(analyticUnit.status === 'READY') {
        this._runDetectionsWaiter(analyticUnit, from, to);
      }
    });
  }

  stopAnalyticUnitsDetectionsFetching() {
    this.analyticUnits.forEach(analyticUnit => this._detectionRunners.delete(analyticUnit.id));
  }

  async fetchAnalyticUnitsDetectionSpans(from: number, to: number): Promise<void[]> {
    if(!_.isNumber(+from)) {
      throw new Error('from isn`t number');
    }
    if(!_.isNumber(+to)) {
      throw new Error('to isn`t number');
    }
    const tasks = this.analyticUnits
      .map(analyticUnit => this.fetchDetectionSpans(analyticUnit, from, to));
    return Promise.all(tasks);
  }

  async fetchDetectionSpans(analyticUnit: AnalyticUnit, from: number, to: number): Promise<void> {
    if(!_.isNumber(+from)) {
      throw new Error('from isn`t number');
    }
    if(!_.isNumber(+to)) {
      throw new Error('to isn`t number');
    }
    analyticUnit.detectionSpans = await this._analyticService.getDetectionSpans(analyticUnit.id, from, to);
  }

  async fetchAnalyticUnitsSegments(from: number, to: number): Promise<void[]> {
    if(!_.isNumber(+from)) {
      throw new Error('from isn`t number');
    }
    if(!_.isNumber(+to)) {
      throw new Error('to isn`t number');
    }
    const tasks = this.analyticUnits.map(a => this.fetchSegments(a, from, to));
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

  async redetectAll(from?: number, to?: number) {
    this.analyticUnits.forEach(unit => {
      // TODO: remove duplication with runDetect
      unit.segments.clear();
      unit.detectionSpans = [];
      unit.status = null;
    });
    const ids = this.analyticUnits.map(analyticUnit => analyticUnit.id);
    await this._analyticService.runDetect(ids, from, to);

    this.fetchAnalyticUnitsStatuses();
  }

  async runDetect(analyticUnitId: AnalyticUnitId, from?: number, to?: number) {
    const analyticUnit = this._analyticUnitsSet.byId(analyticUnitId);
    analyticUnit.segments.clear();
    analyticUnit.detectionSpans = [];
    analyticUnit.status = null;
    await this._analyticService.runDetect(analyticUnitId, from, to);
    this._runStatusWaiter(analyticUnit);
  }

  // TODO: move to renderer
  updateFlotEvents(isEditMode: boolean, plot: any): void {
    // We get a reference to flot options so we can change it and it'll be rendered
    let options = plot.getOptions();
    if(options.grid.markings === undefined) {
      options.grid.markings = [];
    }

    for(let i = 0; i < this.analyticUnits.length; i++) {
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

      if(!analyticUnit.inspect) {
        continue;
      }
      const detectionSpans = analyticUnit.detectionSpans;
      if(detectionSpans === undefined) {
        continue;
      }
      const minValue = _.min(_.map(plot.getYAxes(), axis => axis.min));
      detectionSpans.forEach(detectionSpan => {
        const underlineColor = DETECTION_STATUS_COLORS.get(detectionSpan.status);;

        options.grid.markings.push({
          xaxis: { from: detectionSpan.from, to: detectionSpan.to },
          color: underlineColor,
          yaxis: { from: minValue, to: minValue }
        });
      });
    }
  }

  updateLegend($elem: any) {
    const analyticUnit = this.inspectedAnalyticUnit;
    if(analyticUnit === null) {
      return;
    }

    let detectionStatuses: DetectionStatus[] = [];
    if(analyticUnit.detectionSpans !== undefined) {
      const statuses = analyticUnit.detectionSpans.map(span => span.status);
      detectionStatuses = _.concat(detectionStatuses, statuses);
    }
    detectionStatuses = _.uniq(detectionStatuses);

    detectionStatuses.forEach(status => {
      const html = `
        <div class="graph-legend-series">
          <div class="graph-legend-icon">
            <i class="fa fa-minus" style="color:${DETECTION_STATUS_COLORS.get(status)}"></i>
          </div>
          <a class="graph-legend-alias">${DETECTION_STATUS_TEXT.get(status)}</a>
        </div>
      `;
      $elem.append(html);
    });
  }

  deleteLabelingAnalyticUnitSegmentsInRange(from: number, to: number): void {
    const allRemovedSegs = this.labelingUnit.removeSegmentsInRange(from, to);
    allRemovedSegs.forEach(s => {
      if(!this._labelingDataAddedSegments.has(s.id)) {
        this._labelingDataRemovedSegments.addSegment(s);
      }
    });
    this._labelingDataAddedSegments.removeInRange(from, to);
  }

  toggleLabelingMode(labelingMode: LabelingMode): void {
    if(!this.inLabelingMode) {
      throw new Error(`Can't enter ${labelingMode} mode when labeling mode is disabled`);
    }
    this.labelingUnit.labelingMode = labelingMode;
  }

  async removeAnalyticUnit(id: AnalyticUnitId, silent: boolean = false): Promise<void> {
    if(id === this._selectedAnalyticUnitId) {
      this.dropLabeling();
    }
    if(!silent) {
      await this._analyticService.removeAnalyticUnit(id);
    }
    this._statusRunners.delete(id);
    this._detectionRunners.delete(id);
    this._analyticUnitsSet.removeItem(id);
  }

  async toggleAnalyticUnitAlert(analyticUnit: AnalyticUnit): Promise<void> {
    analyticUnit.alert = analyticUnit.alert ? true : false;
    // TODO: saveAnalyticUnit instead of specific method
    await this._analyticService.setAnalyticUnitAlert(analyticUnit);
  }

  toggleAnalyticUnitChange(analyticUnit: AnalyticUnit, value: boolean): void {
    analyticUnit.changed = value;
  }

  async saveAnalyticUnit(analyticUnit: AnalyticUnit): Promise<void> {
    if(analyticUnit.id === null || analyticUnit.id === undefined) {
      throw new Error('Cannot save analytic unit without id');
    }

    analyticUnit.saving = true;
    await this._analyticService.updateAnalyticUnit(analyticUnit.toJSON());
    analyticUnit.saving = false;
    analyticUnit.changed = false;
  }

  async getAnalyticUnits(): Promise<any[]> {
    if(this._analyticService === undefined) {
      return [];
    }

    return this._analyticService.getAnalyticUnits(this._panelId);
  }

  async fetchAnalyticUnits(): Promise<void> {
    const units = await this.getAnalyticUnits();
    this._analyticUnitsSet = new AnalyticUnitsSet(units);
    this._loading = false;
    this.fetchAnalyticUnitsStatuses();
  }

  async getHSR(from: number, to: number): Promise<{
    hsr: HSRTimeSeries,
    lowerBound?: HSRTimeSeries,
    upperBound?: HSRTimeSeries
  } | null> {
    // Returns HSR (Hastic Signal Representation) for analytic unit in "Inspect" mode
    // Returns null when there are no analytic units in "Inspect" mode
    // or if there is no response from server
    if(this.inspectedAnalyticUnit === null) {
      return null;
    }

    const response = await this._analyticService.getHSR(this.inspectedAnalyticUnit.id, from, to);
    if(response === null) {
      return null;
    }

    const hsr = convertTableToTimeSeries('HSR', response.hsr);
    const lowerBound = convertTableToTimeSeries('Lower bound', response.lowerBound);
    const upperBound = convertTableToTimeSeries('Upper bound', response.upperBound);

    return {
      hsr,
      lowerBound,
      upperBound
    };
  }

  async getHSRSeries(from: number, to: number) {
    const response = await this.getHSR(from, to);

    if(response === null) {
      return [];
    }
    const hsrSerie = {
      ...response.hsr,
      color: ANALYTIC_UNIT_COLORS[1],
      // TODO: render it separately from Metric series
      overrides: [
        { alias: 'HSR', linewidth: 3, fill: 0 }
      ]
    };

    if(response.lowerBound !== undefined && response.upperBound !== undefined) {
      // TODO: looks bad
      return [
        {
          target: '[AnomalyDetector]: lower bound',
          datapoints: response.lowerBound.datapoints,
          color: ANALYTIC_UNIT_COLORS[1],
          overrides: [{
            alias: '[AnomalyDetector]: lower bound',
            linewidth: 1,
            fill: 0,
            legend: false
          }]
        },
        {
          target: '[AnomalyDetector]: upper bound',
          datapoints: response.upperBound.datapoints,
          color: ANALYTIC_UNIT_COLORS[1],
          overrides: [{
            alias: '[AnomalyDetector]: upper bound',
            linewidth: 1,
            fill: 0,
            fillBelowTo: '[AnomalyDetector]: lower bound',
            legend: false
          }]
        },
        hsrSerie
      ];
    }
    return hsrSerie;
  }

  get inspectedAnalyticUnit(): AnalyticUnit | null {
    for(let analyticUnit of this.analyticUnits) {
      if(analyticUnit.inspect) {
        return analyticUnit;
      }
    };
    return null;
  }

  public get conditions() {
    return _.values(Condition);
  }

  private async _runStatusWaiter(analyticUnit: AnalyticUnit) {
    const statusGenerator = this._analyticService.getStatusGenerator(
      analyticUnit.id, 1000
    );

    return this._runWaiter<{ status: string, errorMessage?: string }>(
      analyticUnit,
      this._statusRunners,
      statusGenerator,
      (data) => {
        const status = data.status;
        const error = data.errorMessage;
        if(analyticUnit.status !== status) {
          analyticUnit.status = status;
          if(error !== undefined) {
            analyticUnit.error = error;
          }
          this._emitter.emit('analytic-unit-status-change', analyticUnit);
        }
        if(!analyticUnit.isActiveStatus) {
          return true;
        }
        return false;
      }
    );
  }

  // TODO: range type with "from" and "to" fields
  private async _runDetectionsWaiter(analyticUnit: AnalyticUnit, from: number, to: number) {
    const detectionsGenerator = this._analyticService.getDetectionsGenerator(analyticUnit.id, from, to, 1000);

    return this._runWaiter<DetectionSpan[]>(
      analyticUnit,
      this._detectionRunners,
      detectionsGenerator,
      (data) => {
        if(!_.isEqual(data, analyticUnit.detectionSpans)) {
          this._emitter.emit('analytic-unit-status-change', analyticUnit);
        }
        analyticUnit.detectionSpans = data;
        let isFinished = true;
        for(let detection of data) {
          if(detection.status === DetectionStatus.RUNNING) {
            isFinished = false;
          }
        }
        return isFinished;
      }
    );
  }

  private async _runWaiter<T>(
    analyticUnit: AnalyticUnit,
    runners: Set<AnalyticUnitId>,
    generator: AsyncIterableIterator<T>,
    iteration: (data: T) => boolean
  ) {
    if(this._analyticService === undefined) {
      return;
    }
    if(analyticUnit === undefined || analyticUnit === null) {
      throw new Error('analyticUnit not defined');
    }

    if(analyticUnit.id === undefined) {
      throw new Error('analyticUnit.id is undefined');
    }

    if(runners.has(analyticUnit.id)) {
      return;
    }

    runners.add(analyticUnit.id);

    for await (const data of generator) {
      if(data === undefined) {
        break;
      }
      if(!runners.has(analyticUnit.id)) {
        break;
      }
      const shouldBreak = iteration(data);
      if(shouldBreak) {
        break;
      }
    }

    runners.delete(analyticUnit.id);
  }

  public getNewTempSegmentId(): SegmentId {
    this._tempIdCounted--;
    return this._tempIdCounted.toString();
  }

  public toggleVisibility(id: AnalyticUnitId, value?: boolean) {
    const analyticUnit = this._analyticUnitsSet.byId(id);
    if(value !== undefined) {
      analyticUnit.visible = value;
    } else {
      analyticUnit.visible = !analyticUnit.visible;
    }
    analyticUnit.changed = true;
  }

  public toggleInspect(id: AnalyticUnitId) {
    this.analyticUnits
      .filter(analyticUnit => analyticUnit.id !== id)
      .forEach(unit => unit.inspect = false);

    const analyticUnit = this._analyticUnitsSet.byId(id);
    analyticUnit.inspect = !analyticUnit.inspect;
  }

  public toggleCollapsed(id: AnalyticUnitId) {
    const analyticUnit = this._analyticUnitsSet.byId(id);
    analyticUnit.collapsed = !analyticUnit.collapsed;
    analyticUnit.changed = true;
  }

  public async updateSeasonality(id: AnalyticUnitId, value?: number) {
    const analyticUnit = this._analyticUnitsSet.byId(id) as AnomalyAnalyticUnit;
    if(value !== undefined) {
      analyticUnit.seasonalityPeriod.value = value;
    }
    analyticUnit.changed = true;
  }

  public onAnalyticUnitDetectorChange(analyticUnitTypes: any) {
    // TODO: looks bad
    this._newAnalyticUnit.type = analyticUnitTypes[this._newAnalyticUnit.detectorType][0].value;
  }

  public async updateServerInfo() {
    if(!this._analyticService) {
      this._serverInfo = HasticServerInfoUnknown;
      return;
    }
    this._serverInfo = await this._analyticService.getServerInfo();
  }

  public get serverInfo() {
    return this._serverInfo;
  }

  public get serverStatus(): boolean {
    if(this._analyticService === undefined) {
      return false;
    }
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

function convertTableToTimeSeries(target: string, tableData?: TableTimeSeries): HSRTimeSeries {
  if(tableData === undefined) {
    return undefined;
  }
  const datapoints = tableData.values.map(value => value.reverse() as [number, number]);

  return { target, datapoints };
}
