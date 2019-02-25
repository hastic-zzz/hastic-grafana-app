import template from './template.html';
import { normalizeUrl } from '../utlis';

class ConfigCtrl {
  static template = template;
  appModel: any;
  appEditCtrl: any;

  constructor() {
    if(this.appModel.jsonData === undefined) {
      this.appModel.jsonData = {};
    }

    this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
  }

  preUpdate() {
    this.normalizeUrl();
    return Promise.resolve();
  }

  postUpdate() {
    // TODO: check whether hasticServerUrl is accessible
    if(!this.appModel.enabled) {
      return Promise.resolve();
    }

    return { message: 'Hastic app installed!' };
  }

  normalizeUrl() {
    this.appModel.jsonData.hasticServerUrl = normalizeUrl(this.appModel.jsonData.hasticServerUrl);
  }
}

export { ConfigCtrl };
