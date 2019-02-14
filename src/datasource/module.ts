import { HasticDatasource } from './datasource';
import { HasticQueryCtrl } from './query_ctrl';

import configTemplate from './partials/config.html';

class HasticConfigCtrl {
  public static template = configTemplate;
}

export {
  HasticDatasource as Datasource,
  HasticConfigCtrl as ConfigCtrl,
  HasticQueryCtrl as QueryCtrl
};
