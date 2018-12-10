export class AlertSrv {
  private $timeout;
  private $sce;
  private $rootScope;
  private $modal;
  list: any[];
  /** @ngInject */
  constructor($timeout: any, $sce: any, $rootScope: any, $modal: any) {}
  init(): void {}
  set(title: any, text: any, severity: any, timeout: any): {
      title: any;
      text: any;
      severity: any;
  } 
  {
    return { title: '', text: '', severity: '' }
  }
  clear(alert: any): void {}
  clearAll(): void {}
  showConfirmModal(payload: any): void {}
}
