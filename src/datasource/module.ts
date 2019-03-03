import { HasticDatasource } from './datasource';
import { HasticQueryCtrl } from './query_ctrl';

import { normalizeUrl } from '../utlis';

import configTemplate from './partials/config.html';


class HasticConfigCtrl {
  public static template = configTemplate;
  public ACCESS_OPTIONS = [
    { key: 'proxy', value: 'Server (Default)' },
    { key: 'direct', value: 'Browser'}
  ];

  public current: any;
  private showAccessHelp: boolean = false;

  constructor(private $scope) {
  }

  normalizeUrl() {
    if(this.$scope.current.url === "") {
      return;
    }
    this.$scope.current.url = normalizeUrl(this.$scope.current.url);
  }

  toggleAccessHelp() {
    this.showAccessHelp = !this.showAccessHelp;
  }

}

export {
  HasticDatasource as Datasource,
  HasticConfigCtrl as ConfigCtrl,
  HasticQueryCtrl as QueryCtrl
};
