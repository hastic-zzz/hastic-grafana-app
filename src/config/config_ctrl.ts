import template from './template.html';


class ConfigCtrl {
  static template = template;
  appModel: any;
  constructor() {
    if (!this.appModel.jsonData) {
      this.appModel.jsonData = {};
    }
  }
}

export { ConfigCtrl };
