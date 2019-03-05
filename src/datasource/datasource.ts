import HasticAPI from './hastic_api';

import { BackendSrv } from 'grafana/app/core/services/backend_srv';

export class HasticDatasource {
  private hastic: HasticAPI;

  /** @ngInject */
  constructor(instanceSettings: any, backendSrv: BackendSrv) {
    this.hastic = new HasticAPI(instanceSettings, backendSrv);
  }

  async query(options: any) {
    console.log(options);
  }

  async testDatasource() {
    try {
      await this.hastic.get('/');
      // TODO: check if it is hastic
      return {
        status: 'success', title: 'Success',
        message: 'Datasource is working'
      };
    } catch(err) {
      console.error(err);
      return {
        status: 'error', title: 'Error',
        message: 'Hastic connection error'
      };
    }
  }

  metricFindQuery(options: any) {
    return [];
  }
}
