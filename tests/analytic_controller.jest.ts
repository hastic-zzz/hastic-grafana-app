import { ANALYTIC_UNIT_COLORS } from '../src/panel/graph_panel/colors';
import { MetricExpanded } from '../src/panel/graph_panel/models/metric';
import { DatasourceRequest } from '../src/panel/graph_panel/models/datasource';

import { analyticController } from './setup_tests';


describe('AnalyticController', function () {
  it('should create analytic units with colors from palette', async function () {
    for (let color of ANALYTIC_UNIT_COLORS) {
      analyticController.createNew();
      expect(analyticController.basicAnalyticUnit.labeledColor).toBe(color);
      await analyticController.saveNew({} as MetricExpanded, {} as DatasourceRequest);
    }
  });

  it('should save analytic units', function () {
    expect(analyticController.analyticUnits).toHaveLength(ANALYTIC_UNIT_COLORS.length);
  });

  it('should remove analytic unit with right id', async function () {
    await analyticController.removeAnalyticUnit('2', true);
    for (let analyticUnit of analyticController.analyticUnits) {
      expect(analyticUnit.id).not.toBe('2');
    }
  });

  it('should set different color to newly created Analytic Unit, afer NOT last AU was deleted', async function() {
    let auArray = analyticController.analyticUnits;
    analyticController.createNew();
    await analyticController.saveNew({} as MetricExpanded, {} as DatasourceRequest);
    expect(auArray[auArray.length - 2].serverObject.labeledColor).not.toBe(auArray[auArray.length - 1].serverObject.labeledColor);
  });

  it('should set different color to newly created Analytic Unit, after LAST AU was deleted', async function () {
    let auArray = analyticController.analyticUnits;
    auArray.splice(-1, 1);
    analyticController.createNew();
    await analyticController.saveNew({} as MetricExpanded, {} as DatasourceRequest);
    expect(auArray[auArray.length - 2].serverObject.labeledColor).not.toBe(auArray[auArray.length - 1].serverObject.labeledColor);
  });

  it('should change color on choosing from palette', function () {
    analyticController.onAnalyticUnitColorChange('1', 'red', false);
    expect(analyticController.analyticUnits[0].labeledColor).toBe('red');
  });
});
