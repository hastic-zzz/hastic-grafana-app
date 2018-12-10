import { ANALYTIC_UNIT_COLORS } from '../src/colors';
import { MetricExpanded } from '../src/models/metric';
import { DatasourceRequest } from '../src/models/datasource';

import { analyticController } from './setup_tests';


describe('AnalyticController', function () {
  it('should create analytic units with colors from palette', async function () {
    for (let color of ANALYTIC_UNIT_COLORS) {
      analyticController.createNew();
      expect(analyticController.newAnalyticUnit.color).toBe(color);
      await analyticController.saveNew({} as MetricExpanded, {} as DatasourceRequest, 1);
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
    await analyticController.saveNew({} as MetricExpanded, {} as DatasourceRequest, 1);
    expect(auArray[auArray.length - 2].panelObject.color).not.toBe(auArray[auArray.length - 1].panelObject.color);
  });

  it('should set different color to newly created Analytic Unit, afer LAST AU was deleted', async function () {
    let auArray = analyticController.analyticUnits;
    auArray.splice(-1, 1);
    analyticController.createNew();
    await analyticController.saveNew({} as MetricExpanded, {} as DatasourceRequest, 1);
    expect(auArray[auArray.length - 2].panelObject.color).not.toBe(auArray[auArray.length - 1].panelObject.color);
  });

  it('should change color on choosing from palette', function () {
    analyticController.onAnalyticUnitColorChange('1', 'red');
    expect(analyticController.analyticUnits[0].color).toBe('red');
  });
});
