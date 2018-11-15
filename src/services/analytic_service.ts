import { Segment, SegmentId } from '../models/segment';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { SegmentsSet } from '../models/segment_set';
import { AnalyticUnitId, AnalyticUnit, AnalyticSegment } from '../models/analytic_unit';
import { ServerInfo } from '../models/info';

import { BackendSrv } from 'grafana/app/core/services/backend_srv';


export class AnalyticService {
  public isUp: boolean = false;

  constructor(private _backendURL: string, private _backendSrv: BackendSrv, public $http, public alertSrv) {
    this.isBackendOk();
  }

  async postNewItem(
    metric: MetricExpanded, datasourceRequest: DatasourceRequest, 
    newItem: AnalyticUnit, panelId: number
  ): Promise<AnalyticUnitId> {
      let datasource = await this.get(`/api/datasources/name/${metric.datasource}`);
      datasourceRequest.type = datasource.type;

      return this.post(this._backendURL + '/analyticUnits', {
          panelUrl: window.location.origin + window.location.pathname + `?panelId=${panelId}&fullscreen`,
          type: newItem.type,
          name: newItem.name,
          metric: metric.toJSON(),
          datasource: datasourceRequest
        }
      )
        .then(res => res.id as AnalyticUnitId);
    }

  async isBackendOk(): Promise<boolean> {
    try { 
      let response = await this.$http({ method: 'GET', url: this._backendURL }); 
      if(response.status !== -1) {
        this.isUp = true;
        return true;
      } else {
        this.isUp = false;
        return false;
      }
      // TODO: check version
    } catch(e) {
      this.isUp = false;
      return false;
    }
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

    var data = await this.patch(this._backendURL + '/segments', payload);
    if (data.addedIds === undefined) {
      throw new Error('Server didn`t send addedIds');
    }
    return data.addedIds as SegmentId[];
  }

  async getSegments(id: AnalyticUnitId, from?: number, to?: number): Promise<AnalyticSegment[]> {
    if (id === undefined) {
      throw new Error('id is undefined');
    }
    var payload: any = { id };
    if (from !== undefined) {
      payload['from'] = from;
    }
    if (to !== undefined) {
      payload['to'] = to;
    }
    var data = await this.get(this._backendURL + '/segments', payload);
    if (data.segments === undefined) {
      throw new Error('Server didn`t return segments array');
    }
    var segments = data.segments as { id: SegmentId, from: number, to: number, labeled: boolean, deleted: boolean }[];
    return segments.map(s => new AnalyticSegment(s.labeled, s.id, s.from, s.to, s.deleted));
  }

  async * getStatusGenerator(id: AnalyticUnitId, duration: number) {
    if (id === undefined) {
      throw new Error('id is undefined');
    }
    let statusCheck = async () => {
      var data = await this.get(this._backendURL + '/analyticUnits/status', { id });
      return data;
    }

    let timeout = async () => new Promise(
      resolve => setTimeout(resolve, duration)
    );

    while (true) {
      yield await statusCheck();
      await timeout();
    }
  }

  async getAlertEnabled(id: AnalyticUnitId): Promise<boolean> {
    if (id === undefined) {
      throw new Error('id is undefined');
    }
    var data = await this.get(this._backendURL + '/alerts', { id });
    if (data.enabled === undefined) {
      throw new Error('Server didn`t return "enabled"');
    }
    return data.enabled as boolean;
  }

  async setAlertEnabled(id: AnalyticUnitId, enabled: boolean): Promise<void> {
    if (id === undefined) {
      throw new Error('id is undefined');
    }
    return await this.post(this._backendURL + '/alerts', { id, enabled });
  }

  async getServerInfo(): Promise<ServerInfo> {
    let data = await this.get(this._backendURL);
    console.log(data)
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

  private async get(url, params?) {
    try {
      let response = await this.$http({ method: 'GET', url: url, params: params });
      this.isUp = true;
      return response.data;
    } catch (error) {
      this.alertSrv.set(
        'No connection to Hastic server',
        `Hastic server: "${this._backendURL}"`,
        'warning', 4000
      );
      console.log(error);
      this.isUp = false
    } 
  }

  private async post(url, data) {
    try {
      let response = await this.$http({ method: 'POST', url: url, data: data });
      this.isUp = true;
      return response.data;
    } catch (error) {
      this.alertSrv.set(
        'No connection to Hastic server',
        `Hastic server: "${this._backendURL}"`,
        'warning', 4000
      );
      console.log(error);
      this.isUp = false;
    } 
  }

  private async patch(url, data) {
    try {
      let response = await this.$http({ method: 'PATCH', url: url, data: data });
      this.isUp = true;
      return response.data;
    } catch (error) {
      this.alertSrv.set(
        'No connection to Hastic server',
        `Hastic server: "${this._backendURL}"`,
        'warning', 4000
      );
      console.log(error);
      this.isUp = false;
    }
  }
}
