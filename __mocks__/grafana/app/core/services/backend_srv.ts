export class BackendSrv {
  private $http;
  private alertSrv;
  private $rootScope;
  private $q;
  private $timeout;
  inFlightRequests: {};
  HTTP_REQUEST_CANCELLED: number;

  constructor($http: any, alertSrv: any, $rootScope: any, $q: any, $timeout: any) {}
  get(url: any, params?: any) {
    return Promise.resolve({ enabled: true });
  }
  delete(url: any) {}
  post(url: any, data: any) {}
  patch(url: any, data: any) {}
  put(url: any, data: any) {}
  requestErrorHandler(err: any) {}
  request(options: any) {};
  datasourceRequest(options: any) {};
  loginPing() {};
  search(query: any) {};
  getDashboard(type: any, slug: any) {};
  saveDashboard(dash: any, options: any) {};
}
