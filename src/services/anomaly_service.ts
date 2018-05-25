import { Segment, SegmentKey } from '../model/segment';
import { MetricExpanded } from '../model/metric';
import { DatasourceRequest } from '../model/datasource';
import { SegmentsSet } from '../model/segment_set';
import { AnomalyKey, AnomalyType, AnomalySegment } from '../model/anomaly';

import { BackendSrv } from 'grafana/app/core/services/backend_srv';



export class AnomalyService {
  constructor(private _backendURL: string, private _backendSrv: BackendSrv) {
  }

  async postNewAnomalyType(metric: MetricExpanded, datasourceRequest: DatasourceRequest, newAnomalyType: AnomalyType, panelId: number) {
    return this._backendSrv.post(
      this._backendURL + '/anomalies', 
      {
        name: newAnomalyType.name,
        metric: metric.toJSON(),
        panelUrl: window.location.origin + window.location.pathname + `?panelId=${panelId}&fullscreen`,
        datasource: datasourceRequest
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
    key: AnomalyKey, addedSegments: SegmentsSet<Segment>, removedSegments: SegmentsSet<Segment>
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

  async getSegments(key: AnomalyKey, from?: number, to?: number): Promise<AnomalySegment[]> {
    var payload: any = { anomaly_id: key };
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
    return segments.map(s => new AnomalySegment(s.labeled, s.id, s.start, s.finish));
  }

  async * getAnomalyTypeStatusGenerator(key: AnomalyKey, duration: number) {
    let statusCheck = async () => {
      var data = await this._backendSrv.get(
        this._backendURL + '/anomalies/status', { name: key }
      );
      return data.status as string;
    }

    let timeout = async () => new Promise(
      resolve => setTimeout(resolve, duration)
    );

    while(true) {
      yield await statusCheck();
      await timeout();
    }
    
  }

  async getAlertEnabled(key: AnomalyKey): Promise<boolean> {
    var data = await this._backendSrv.get(
      this._backendURL + '/alerts', { anomaly_id: key }
    );
    return data.enable as boolean;

  }

  async setAlertEnabled(key: AnomalyKey, value: boolean): Promise<void> {
    return this._backendSrv.post(
      this._backendURL + '/alerts', { anomaly_id: key, enable: value }
    );
  }

}
