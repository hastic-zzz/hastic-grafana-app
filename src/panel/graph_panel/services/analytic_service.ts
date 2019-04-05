import { SegmentId } from '../models/segment';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { SegmentsSet } from '../models/segment_set';
import { AnalyticUnitId, AnalyticUnit, AnalyticSegment } from '../models/analytic_unit';
import { HasticServerInfo, HasticServerInfoUnknown } from '../models/hastic_server_info';
import { Threshold } from '../models/threshold';

import { isHasticServerResponse, isSupportedServerVersion, SUPPORTED_SERVER_VERSION } from '../../../utlis';

import { appEvents } from 'grafana/app/core/core';

import * as _ from 'lodash';


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

  async getThresholds(ids: AnalyticUnitId[]) {
    const resp = await this.get('/threshold', { ids: ids.join(',') });
    if(resp === undefined) {
      return [];
    }
    return resp.thresholds.filter(t => t !== null);
  }

  async updateThreshold(threshold: Threshold): Promise<void> {
    return this.patch('/threshold', threshold);
  }

  async postNewItem(
    newItem: AnalyticUnit,
    metric: MetricExpanded,
    datasource: DatasourceRequest,
    grafanaUrl: string,
    panelId: string
  ): Promise<AnalyticUnitId> {
    const response = await this.post('/analyticUnits', {
      grafanaUrl,
      panelId,
      type: newItem.type,
      name: newItem.name,
      metric: metric.toJSON(),
      datasource
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

  async * getStatusGenerator(id: AnalyticUnitId, duration: number):
    AsyncIterableIterator<{ status: string, errorMessage?: string }> {

    if(id === undefined) {
      throw new Error('id is undefined');
    }
    let statusCheck = async () => {
      try {
        return await this.get('/analyticUnits/status', { id });
      } catch(error) {
        if(error.status === 404) {
          return { status: '404' };
        }
        throw error;
      }
    }

    let timeout = async () => new Promise(
      resolve => setTimeout(resolve, duration)
    );

    while(true) {
      yield await statusCheck();
      await timeout();
    }
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

  async setAnalyticUnitAlert(analyticUnit: AnalyticUnit) {
    return this.patch('/analyticUnits/alert', {
      analyticUnitId: analyticUnit.id,
      alert: analyticUnit.alert
    });
  }

  async updateAnalyticUnit(updateObj: any) {
    return this.patch('/analyticUnits', updateObj);
  }

  async runDetect(ids: AnalyticUnitId | AnalyticUnitId[]) {
    if(!_.isArray(ids)) {
      ids = [ids];
    }
    return this.post('/analyticUnits/detect', { ids });
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
      if(error.xhrstatus === 'error' || error.status !== 200) {
        this.displayConnectionErrorAlert();
        this._isUp = false;
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
    appEvents.emit(
      'alert-error',
      [
        'No connection to Hastic Server',
        `Hastic Datasource URL: "${this._hasticDatasourceURL}"`,
      ]
    );
  }

  private displayWrongUrlAlert() {
    appEvents.emit(
      'alert-error',
      [
        'Please check Hastic Server URL',
        `Something is working at "${this._hasticDatasourceURL}" but it's not Hastic Server`,
      ]
    );
  }

  private displayUnsupportedVersionAlert(actual: string) {
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
