import { HasticDatasource } from './datasource';
import { HasticQueryCtrl } from './query_ctrl';

import { normalizeUrl } from '../utlis';

import configTemplate from './partials/config.html';


class HasticConfigCtrl {
  public static template = configTemplate;
  public accessOptions: any[];
  public current: any;
  private showAccessHelp: boolean = false;

  constructor($scope) {
    console.log(this);
    this.accessOptions = [
      { key: 'proxy', value: 'Server (Default)' },
      { key: 'direct', value: 'Browser'}
    ];
    this.current.access = 'proxy';
  }

  normalizeUrl() {
    this.current.url = normalizeUrl(this.current.url);
  }

  toggleAccessHelp() {
    console.log('hey');
    this.showAccessHelp = !this.showAccessHelp;
  }

}

export {
  HasticDatasource as Datasource,
  HasticConfigCtrl as ConfigCtrl,
  HasticQueryCtrl as QueryCtrl
};
