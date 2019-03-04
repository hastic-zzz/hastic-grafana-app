import { normalizeUrl } from '../utlis';
import configTemplate from './partials/config.html';


export class HasticConfigCtrl {
  public static template = configTemplate;
  public ACCESS_OPTIONS = [
    { key: 'proxy', value: 'Server (Default)' },
    { key: 'direct', value: 'Browser' }
  ];

  public showAccessHelp = false;

  constructor(private $scope: any) {
    if(this.$scope.current === undefined) {
      this.$scope.current = {
        url: '',
        access: 'proxy'
      };
    }
  }

  normalizeUrl() {
    if(this.$scope.current.url === '') {
      return;
    }
    this.$scope.current.url = normalizeUrl(this.$scope.current.url);
  }

  toggleAccessHelp() {
    this.showAccessHelp = !this.showAccessHelp;
  }
}
