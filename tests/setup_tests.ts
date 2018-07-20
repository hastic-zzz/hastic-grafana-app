import { AnalyticController } from '../src/controllers/analytic_controller';
import { AnalyticUnit, AnalyticUnitId } from '../src/models/analytic_unit';
import { AnalyticService } from '../src/services/analytic_service';
import { MetricExpanded } from '../src/models/metric';
import { DatasourceRequest } from '../src/models/datasource';

import { BackendSrv } from 'grafana/app/core/services/backend_srv';
import { Emitter } from 'grafana/app/core/utils/emitter';


// prevent "Symbol.asyncIterator is not defined" error
(<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");

var id = 0;

const analyticService = new AnalyticService('', new BackendSrv({}, {}, {}, {}, {}));
analyticService.postNewItem = async function (
  metric: MetricExpanded, datasourceRequest: DatasourceRequest,
  newItem: AnalyticUnit, panelId: number
): Promise<AnalyticUnitId> {
  id++;
  return Promise.resolve(id.toString());
}

export const analyticController = new AnalyticController({}, analyticService, new Emitter());

console.log = jest.fn();
console.error = jest.fn();
