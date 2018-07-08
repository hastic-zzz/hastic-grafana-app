import { Segment, SegmentId } from '../models/segment';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { SegmentsSet } from '../models/segment_set';
import { AnalyticUnitId, AnalyticUnit, AnalyticSegment } from '../models/analytic_unit';

import { BackendSrv } from 'grafana/app/core/services/backend_srv';


export class AnalyticService {
  constructor(private _backendURL: string, private _backendSrv: BackendSrv) {
  }

  async postNewItem(
    metric: MetricExpanded, datasourceRequest: DatasourceRequest, 
    newItem: AnalyticUnit, panelId: number
  ): Promise<AnalyticUnitId> {
    return this._backendSrv.post(
      this._backendURL + '/analyticUnits', 
      {
        name: newItem.name,
        metric: metric.toJSON(),
        panelUrl: window.location.origin + window.location.pathname + `?panelId=${panelId}&fullscreen`,
        datasource: datasourceRequest,
        type: newItem.type
      }
    ).then(res => res.id as AnalyticUnitId);
  };

  async isBackendOk(): Promise<boolean> {
    try {
      var data = await this._backendSrv.get(this._backendURL);
      // TODO: check version
      return true;
    } catch(e) {
      return false;
    }
  }
   
  async updateSegments(
    id: AnalyticUnitId, addedSegments: SegmentsSet<Segment>, removedSegments: SegmentsSet<Segment>
  ): Promise<SegmentId[]> {

    const getJSONs = (segs: SegmentsSet<Segment>) => segs.getSegments().map(segment => ({
      "start": segment.from,
      "finish": segment.to
    }));

    var payload = {
      id,
      addedSegments: getJSONs(addedSegments),
      removedSegments: removedSegments.getSegments().map(s => s.id)
    }

    var data = await this._backendSrv.patch(this._backendURL + '/segments', payload);
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
    var data = await this._backendSrv.get(this._backendURL + '/segments', payload);
    if(data.segments === undefined) {
      throw new Error('Server didn`t return segments array');
    }
    var segments = data.segments as { id: number, start: number, finish: number, labeled: boolean }[];
    return segments.map(s => new AnalyticSegment(s.labeled, s.id, s.start, s.finish));
  }

  async * getStatusGenerator(id: AnalyticUnitId, duration: number) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    let statusCheck = async () => {
      var data = await this._backendSrv.get(
        this._backendURL + '/analyticUnits/status', { id }
      );
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
    var data = await this._backendSrv.get(
      this._backendURL + '/alerts', { id }
    );
    if(data.enabled === undefined) {
      throw new Error('Server didn`t return "enabled"');
    }
    return data.enabled as boolean;

  }

  async setAlertEnabled(id: AnalyticUnitId, enabled: boolean): Promise<void> {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    return this._backendSrv.post(
      this._backendURL + '/alerts', { id, enabled }
    );
  }

}
