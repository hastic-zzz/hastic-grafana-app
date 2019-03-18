import { AnalyticController } from '../src/panel/graph_panel/controllers/analytic_controller';
import { AnalyticUnit, AnalyticUnitId } from '../src/panel/graph_panel/models/analytic_unit';
import { AnalyticService } from '../src/panel/graph_panel/services/analytic_service';
import { MetricExpanded } from '../src/panel/graph_panel/models/metric';
import { DatasourceRequest } from '../src/panel/graph_panel/models/datasource';

import { Emitter } from 'grafana/app/core/utils/emitter';


// prevent "Symbol.asyncIterator is not defined" error
(<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");

var id = 0;

function $http() {
  return { data: { pattern: [], thresholds: [] } };
} 

const analyticService = new AnalyticService('', $http);
analyticService.postNewItem = async function (
  newItem: AnalyticUnit, metric: MetricExpanded, 
  datasource: DatasourceRequest, panelUrl: string
): Promise<AnalyticUnitId> {
  id++;
  return Promise.resolve(id.toString());
}

export const analyticController = new AnalyticController('http://localhost:3000/d/dashboardid', {}, new Emitter(), analyticService);

jest.mock('../src/panel/graph_panel/partials/help_section.html', () => '');

console.log = jest.fn();
console.error = jest.fn();
