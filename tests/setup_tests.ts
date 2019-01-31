import { AnalyticController } from '../src/controllers/analytic_controller';
import { AnalyticUnit, AnalyticUnitId } from '../src/models/analytic_unit';
import { AnalyticService } from '../src/services/analytic_service';
import { MetricExpanded } from '../src/models/metric';
import { DatasourceRequest } from '../src/models/datasource';

import { Emitter } from 'grafana/app/core/utils/emitter';


// prevent "Symbol.asyncIterator is not defined" error
(<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");

var id = 0;

function $http() {
  return { data: { pattern: [], thresholds: [] }
  }
} 

const analyticService = new AnalyticService('', $http);
analyticService.postNewItem = async function (newItem: AnalyticUnit, metric: MetricExpanded, datasource: DatasourceRequest, panelUrl: string
): Promise<AnalyticUnitId> {
  id++;
  return Promise.resolve(id.toString());
}

export const analyticController = new AnalyticController({}, analyticService, new Emitter());

console.log = jest.fn();
console.error = jest.fn();
