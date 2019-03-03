import { HasticDatasource } from './datasource';
import { HasticQueryCtrl } from './query_ctrl';

import { normalizeUrl } from '../utlis';

import configTemplate from './partials/config.html';


class HasticConfigCtrl {
  public static template = configTemplate;
  public ACCESS_OPTIONS: any[] = [
    { key: 'proxy', value: 'Server (Default)' },
    { key: 'direct', value: 'Browser'}
  ];

  public current: any;
  private showAccessHelp: boolean = false;

  constructor($scope) {
    this.current.access = 'proxy';
    console.log($scope);
  }

  normalizeUrl() {
    this.current.url = normalizeUrl(this.current.url);
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
