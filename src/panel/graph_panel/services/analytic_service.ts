import { SegmentId } from '../models/segment';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { SegmentsSet } from '../models/segment_set';
import { AnalyticUnitId, AnalyticUnit, AnalyticSegment } from '../models/analytic_units/analytic_unit';
import { HasticServerInfo, HasticServerInfoUnknown } from '../models/hastic_server_info';
import { DetectionSpan } from '../models/detection';

import { isHasticServerResponse, isSupportedServerVersion, SUPPORTED_SERVER_VERSION, checkHasticUrlStatus } from '../../../utlis';

import { appEvents } from 'grafana/app/core/core';
import { HasticDatasourceStatus } from './../graph_ctrl';

import * as _ from 'lodash';

// TODO: TableTimeSeries is bad name
export type TableTimeSeries = {
  values: [number, number][];
  columns: string[];
};

export class AnalyticService {
  private _isUp: boolean = false;

  constructor(
    private _hasticDatasourceURL: string,
    private $http
  ) {
    if(this._hasticDatasourceURL === undefined) {
      throw new TypeError('_hasticDatasourceURL is undefined');
    }
  }

  async getAnalyticUnitTypes() {
    const resp = await this.get('/analyticUnits/types');
    if(resp === undefined) {
      return {};
    }
    return resp;
  }

  async getAnalyticUnits(panelId: string) {
    const resp = await this.get('/analyticUnits/units', { panelId });
    if(resp === undefined) {
      return [];
    }
    return resp.analyticUnits;
  }

  async postNewAnalyticUnit(
    analyticUnit: AnalyticUnit,
    metric: MetricExpanded,
    datasource: DatasourceRequest,
    grafanaUrl: string,
    panelId: string
  ): Promise<AnalyticUnitId> {
    const analyticUnitJson = analyticUnit.toJSON();
    const response = await this.post('/analyticUnits', {
      grafanaUrl,
      panelId,
      metric: metric.toJSON(),
      datasource,
      ...analyticUnitJson
    });

    return response.id as AnalyticUnitId;
  }

  async updateMetric(
    analyticUnitId: AnalyticUnitId,
    metric: MetricExpanded,
    datasource: DatasourceRequest
  ) {
    await this.patch('/analyticUnits/metric', {
      analyticUnitId,
      metric: metric.toJSON(),
      datasource
    });
  }

  async removeAnalyticUnit(id: AnalyticUnitId) {
    return this.delete('/analyticUnits', { id });
  }

  async isDatasourceOk(): Promise<boolean> {
    if(!this._checkDatasourceConfig()) {
      this._isUp = false;
      return false;
    }
    const response = await this.get('/');
    if(!isHasticServerResponse(response)) {
      this.displayWrongUrlAlert();
      this._isUp = false;
    } else if(!isSupportedServerVersion(response)) {
      this.displayUnsupportedVersionAlert(response.packageVersion);
      this._isUp = false;
    }
    return this._isUp;
  }

  async updateSegments(
    id: AnalyticUnitId,
    addedSegments: SegmentsSet<AnalyticSegment>,
    removedSegments: SegmentsSet<AnalyticSegment>
  ): Promise<SegmentId[]> {
    const getJSONs = (segs: SegmentsSet<AnalyticSegment>) => segs.getSegments().map(segment => ({
      from: segment.from,
      to: segment.to,
      labeled: segment.labeled,
      deleted: segment.deleted
    }));

    const payload = {
      id,
      addedSegments: getJSONs(addedSegments),
      removedSegments: removedSegments.getSegments().map(s => s.id)
    };

    const data = await this.patch('/segments', payload);
    if(data.addedIds === undefined) {
      throw new Error('Server didn`t send addedIds');
    }
    return data.addedIds as SegmentId[];
  }

  async getDetectionSpans(id: AnalyticUnitId, from: number, to: number): Promise<DetectionSpan[]> {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    let payload: any = { id, from, to };
    const data = await this.get('/detections/spans', payload);
    if(data === undefined || data.spans === undefined) {
      throw new Error('Server didn`t return spans array');
    }
    return data.spans;
  }

  async getSegments(id: AnalyticUnitId, from?: number, to?: number): Promise<AnalyticSegment[]> {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    var payload: any = { id };
    if(from !== undefined) {
      payload['from'] = from;
    }
    if(to !== undefined) {
      payload['to'] = to;
    }
    var data = await this.get('/segments', payload);
    if(data.segments === undefined) {
      throw new Error('Server didn`t return segments array');
    }
    var segments = data.segments as { id: SegmentId, from: number, to: number, labeled: boolean, deleted: boolean }[];
    return segments.map(s => new AnalyticSegment(s.labeled, s.id, s.from, s.to, s.deleted));
  }

  getStatusGenerator(
    id: AnalyticUnitId,
    duration: number
  ): AsyncIterableIterator<{ status: string, errorMessage?: string }> {
    return getGenerator<{ status: string, errorMessage?: string }>(
      id,
      duration,
      async (id) => {
        try {
          return this.get('/analyticUnits/status', { id });
        } catch(error) {
          if(error.status === 404) {
            return { status: '404' };
          }
          throw error;
        }
      }
    );
  }

  getDetectionsGenerator(
    id: AnalyticUnitId,
    from: number,
    to: number,
    duration: number
  ): AsyncIterableIterator<DetectionSpan[]> {
    return getGenerator<DetectionSpan[]>(
      id,
      duration,
      this.getDetectionSpans.bind(this),
      from,
      to
    );
  }

  async getServerInfo(): Promise<HasticServerInfo> {
    const data = await this.get('/');
    if(data === undefined) {
      return HasticServerInfoUnknown;
    }
    return {
      nodeVersion: data.nodeVersion,
      packageVersion: data.packageVersion,
      npmUserAgent: data.npmUserAgent,
      docker: data.docker,
      zmqConectionString: data.zmqConectionString,
      serverPort: data.serverPort,
      gitBranch: data.git.branch,
      gitCommitHash: data.git.commitHash
    };
  }

  async getHSR(analyticUnitId: AnalyticUnitId, from: number, to: number): Promise<{
    hsr: TableTimeSeries,
    lowerBound?: TableTimeSeries,
    upperBound?: TableTimeSeries
  } | null> {
    const data = await this.get('/query', { analyticUnitId, from, to });
    if(data === undefined) {
      return null;
    }
    return data.results;
  }

  async setAnalyticUnitAlert(analyticUnit: AnalyticUnit) {
    return this.patch('/analyticUnits/alert', {
      analyticUnitId: analyticUnit.id,
      alert: analyticUnit.alert
    });
  }

  async updateAnalyticUnit(updateObj: any) {
    return this.patch('/analyticUnits', updateObj);
  }

  async runDetect(ids: AnalyticUnitId | AnalyticUnitId[], from?: number, to?: number) {
    if(!_.isArray(ids)) {
      ids = [ids];
    }
    return this.post('/analyticUnits/detect', { ids, from, to });
  }

  private async _analyticRequest(method: string, url: string, data?: any) {
    try {
      method = method.toUpperCase();
      url = this._hasticDatasourceURL + url;
      let requestObject: any = { method, url };
      if(method === 'GET' || method === 'DELETE') {
        requestObject.params = data;
      } else {
        requestObject.data = data;
      }
      const response = await this.$http(requestObject);
      this._isUp = true;
      return response.data;
    } catch(error) {
      // xhrStatus may be one of: ('complete', 'error', 'timeout' or 'abort')
      // See: https://github.com/angular/angular.js/blob/55075b840c9194b8524627a293d6166528b9a1c2/src/ng/http.js#L919-L920
      if(error.xhrStatus !== 'complete' || error.status > 500) {
        this.displayConnectionErrorAlert();
        this._isUp = false;
        throw new Error(`Fetching error: ${error.status}: ${error.statusText}`);
      } else {
        this._isUp = true;
      }
    }
  }

  get hasticDatasourceURL(): string {
    return this._hasticDatasourceURL;
  }

  private _checkDatasourceConfig(): boolean {
    if(this._hasticDatasourceURL === null || this._hasticDatasourceURL === undefined || this._hasticDatasourceURL === '') {
      appEvents.emit(
        'alert-warning',
        [
          `Hastic Datasource is missing`,
          `Please setup Hastic Datasource. More info: https://github.com/hastic/hastic-grafana-app/wiki/Getting-started`
        ]
      );
      return false;
    }
    return true;
  }

  private async get(url, params?) {
    return this._analyticRequest('GET', url, params);
  }

  private async post(url, data?) {
    return this._analyticRequest('POST', url, data);
  }

  private async patch(url, data?) {
    return this._analyticRequest('PATCH', url, data);
  }

  private async delete(url, data?) {
    return this._analyticRequest('DELETE', url, data);
  }

  private displayConnectionErrorAlert() {
    if(checkHasticUrlStatus(this._hasticDatasourceURL, HasticDatasourceStatus.NOT_AVAILABLE)) {
      return;
    }
    appEvents.emit(
      'alert-error',
      [
        'Timeout when connecting to Hastic Server',
        `Hastic Datasource URL: "${this._hasticDatasourceURL}"`,
      ]
    );
  }

  private displayWrongUrlAlert() {
    if(checkHasticUrlStatus(this._hasticDatasourceURL, HasticDatasourceStatus.NOT_AVAILABLE)) {
      return;
    }
    appEvents.emit(
      'alert-error',
      [
        'Please check Hastic Server URL',
        `Something is working at "${this._hasticDatasourceURL}" but it's not Hastic Server`,
      ]
    );
  }

  private displayUnsupportedVersionAlert(actual: string) {
    if(checkHasticUrlStatus(this._hasticDatasourceURL, HasticDatasourceStatus.NOT_AVAILABLE)) {
      return;
    }
    appEvents.emit(
      'alert-error',
      [
        'Unsupported Hastic Server version',
        `Hastic Server at "${this._hasticDatasourceURL}" has unsupported version (got ${actual}, should be ${SUPPORTED_SERVER_VERSION})`,
      ]
    );
  }

  public get isUp(): boolean {
    return this._isUp;
  }
}

async function *getGenerator<T>(
  id: AnalyticUnitId,
  duration: number,
  func: (...args: any[]) => Promise<T>,
  ...args
): AsyncIterableIterator<T> {
  if(id === undefined) {
    throw new Error('id is undefined');
  }

  let timeout = async () => new Promise(
    resolve => setTimeout(resolve, duration)
  );

  while(true) {
    yield await func(id, ...args);
    await timeout();
  }
}
