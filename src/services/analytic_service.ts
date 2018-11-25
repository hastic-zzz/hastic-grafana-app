import { Segment, SegmentId } from '../models/segment';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { SegmentsSet } from '../models/segment_set';
import { AnalyticUnitId, AnalyticUnit, AnalyticSegment } from '../models/analytic_unit';
import { ServerInfo } from '../models/info';


export class AnalyticService {
  private _isUp = false;

  constructor(private _backendURL: string, private $http, private alertSrv) {
    this.isBackendOk();
  }

  async postNewItem(
    metric: MetricExpanded, datasourceRequest: DatasourceRequest,
    newItem: AnalyticUnit, panelId: number
  ): Promise<AnalyticUnitId> {
    let datasource = await this.get(`/api/datasources/name/${metric.datasource}`);
    datasourceRequest.type = datasource.type;

    const response = await this.post('/analyticUnits', {
      panelUrl: window.location.origin + window.location.pathname + `?panelId=${panelId}&fullscreen`,
      type: newItem.type,
      name: newItem.name,
      metric: metric.toJSON(),
      datasource: datasourceRequest
    });

    return response.id as AnalyticUnitId;
  }

  async removeAnalyticUnit(id: AnalyticUnitId) {
    return this.delete('/analyticUnits', { id });
  }

  async isBackendOk(): Promise<boolean> {
    await this.get('/');
    return this._isUp;
  }

  async updateSegments(
    id: AnalyticUnitId, addedSegments: SegmentsSet<Segment>, removedSegments: SegmentsSet<Segment>
  ): Promise<SegmentId[]> {
    const getJSONs = (segs: SegmentsSet<Segment>) => segs.getSegments().map(segment => ({
      from: segment.from,
      to: segment.to
    }));

    var payload = {
      id,
      addedSegments: getJSONs(addedSegments),
      removedSegments: removedSegments.getSegments().map(s => s.id)
    };

    var data = await this.patch('/segments', payload);
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

  async * getStatusGenerator(id: AnalyticUnitId, duration: number) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    let statusCheck = async () => {
      var data = await this.get('/analyticUnits/status', { id });
      return data;
    }

    let timeout = async () => new Promise(
      resolve => setTimeout(resolve, duration)
    );

    while(true) {
      yield await statusCheck();
      await timeout();
    }
  }

  async getAlertEnabled(id: AnalyticUnitId): Promise<boolean> {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    var data = await this.get('/alerts', { id });
    if(data.enabled === undefined) {
      throw new Error('Server didn`t return "enabled"');
    }
    return data.enabled as boolean;
  }

  async setAlertEnabled(id: AnalyticUnitId, enabled: boolean): Promise<void> {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    return await this.post('/alerts', { id, enabled });
  }

  async getServerInfo(): Promise<ServerInfo> {
    let data = await this.get('/');
    console.log(data);
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

  private async _analyticRequest(method: string, url: string, data?) {
    try {
      method = method.toLocaleUpperCase();
      url = this._backendURL + url;
      let requestObject: any = { method, url };
      if(method === 'GET' || method === 'DELETE') {
        requestObject.params = data;
      } else {
        requestObject.data = data;
      }
      let response = await this.$http(requestObject);
      this._isUp = true;
      return response.data;
    } catch(error) {
      if(error.xhrStatus === 'error') {
        this.displayConnectionAlert();
        this._isUp = false;
      } else {
        this._isUp = true;
      }
      throw error;
    } 
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
    console.log('DEETEREA');
    console.log(data);
    return this._analyticRequest('DELETE', url, data);
  }

  private displayConnectionAlert() {
    this.alertSrv.set(
      'No connection to Hastic server',
      `Hastic server: "${this._backendURL}"`,
      'warning', 4000
    );
  }

  public get isUp() {
    return this._isUp;
  }
}
