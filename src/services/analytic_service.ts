import { Segment, SegmentKey } from '../models/segment';
import { MetricExpanded } from '../models/metric';
import { DatasourceRequest } from '../models/datasource';
import { SegmentsSet } from '../models/segment_set';
import { AnalyticUnitId, AnalyticUnit, AnalyticSegment } from '../models/analytic_unit';

import { BackendSrv } from 'grafana/app/core/services/backend_srv';



export class AnalyticService {
  constructor(private _backendURL: string, private _backendSrv: BackendSrv) {
  }

  async postNewAnalyticUnit(metric: MetricExpanded, datasourceRequest: DatasourceRequest, newAnomalyType: AnalyticUnit, panelId: number) {
    return this._backendSrv.post(
      this._backendURL + '/anomalies', 
      {
        name: newAnomalyType.name,
        metric: metric.toJSON(),
        panelUrl: window.location.origin + window.location.pathname + `?panelId=${panelId}&fullscreen`,
        datasource: datasourceRequest,
        pattern: newAnomalyType.pattern
      }
    )
  };

  async isBackendOk(): Promise<boolean> {
    try {
      var data = await this._backendSrv.get(this._backendURL);
      return true;
    } catch(e) {
      return false;
    }
  }
   
  async updateSegments(
    key: AnalyticUnitId, addedSegments: SegmentsSet<Segment>, removedSegments: SegmentsSet<Segment>
  ): Promise<SegmentKey[]> {

    const getJSONs = (segs: SegmentsSet<Segment>) => segs.getSegments().map(segment => ({
      "start": segment.from,
      "finish": segment.to
    }));

    var payload = {
      name: key,
      added_segments: getJSONs(addedSegments),
      removed_segments: removedSegments.getSegments().map(s => s.key)
    }

    var data = await this._backendSrv.patch(this._backendURL + '/segments', payload);
    if(data.added_ids === undefined) {
      throw new Error('Server didn`t send added_ids');
    }

    return data.added_ids as SegmentKey[];
  }

  async getSegments(key: AnalyticUnitId, from?: number, to?: number): Promise<AnalyticSegment[]> {
    var payload: any = { predictor_id: key };
    if(from !== undefined) {
      payload['from'] = from;
    }
    if(to !== undefined) {
      payload['to'] = to;
    }
    var data = await this._backendSrv.get(
      this._backendURL + '/segments',
      payload
    );
    if(data.segments === undefined) {
      throw new Error('Server didn`t return segments array');
    }
    var segments = data.segments as { id: number, start: number, finish: number, labeled: boolean }[];
    return segments.map(s => new AnalyticSegment(s.labeled, s.id, s.start, s.finish));
  }

  async * getAnomalyTypeStatusGenerator(key: AnalyticUnitId, duration: number) {
    let statusCheck = async () => {
      var data = await this._backendSrv.get(
        this._backendURL + '/anomalies/status', { name: key }
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

  async getAlertEnabled(key: AnalyticUnitId): Promise<boolean> {
    var data = await this._backendSrv.get(
      this._backendURL + '/alerts', { predictor_id: key }
    );
    return data.enable as boolean;

  }

  async setAlertEnabled(key: AnalyticUnitId, value: boolean): Promise<void> {
    return this._backendSrv.post(
      this._backendURL + '/alerts', { predictor_id: key, enable: value }
    );
  }

}
