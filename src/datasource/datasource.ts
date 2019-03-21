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
      return {
        status: 'success', title: 'Success',
        message: 'Datasource is working'
      };
    } catch(err) {
      console.error(err);
      return {
        status: 'error', title: 'Error',
        message: err.message
      };
    }
  }

  metricFindQuery(options: any) {
    return [];
  }
}
