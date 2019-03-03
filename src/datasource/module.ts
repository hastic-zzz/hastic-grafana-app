import { HasticDatasource } from './datasource';
import { HasticQueryCtrl } from './query_ctrl';

import { normalizeUrl } from '../utlis';

import configTemplate from './partials/config.html';


class HasticConfigCtrl {
  public static template = configTemplate;
  public accessOptions: any[];
  public current: any;

  constructor() {
    console.log(this);
    this.accessOptions = [
      { key: 'proxy', value: 'Server (Default)' },
      { key: 'direct', value: 'Browser'}
    ];
    //this.current.access = 'proxy';
    // if(this.appModel.jsonData === undefined) {
    //   this.appModel.jsonData = {};
    // }

    // this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
    // this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
  }

  normalizeUrl() {
    // this.appModel.jsonData.hasticServerUrl = normalizeUrl(this.appModel.jsonData.hasticServerUrl);
  }

}

export {
  HasticDatasource as Datasource,
  HasticConfigCtrl as ConfigCtrl,
  HasticQueryCtrl as QueryCtrl
};
