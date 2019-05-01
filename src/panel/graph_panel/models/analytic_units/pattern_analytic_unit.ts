import { AnalyticUnit, DetectorType } from './analytic_unit';

import _ from 'lodash';

const DEFAULTS = {
  detectorType: DetectorType.PATTERN,
  type: 'GENERAL'
};

export class PatternAnalyticUnit extends AnalyticUnit {

  constructor(_serverObject?: any) {
    super(_serverObject);
    _.defaults(this._serverObject, DEFAULTS);
  }
}
