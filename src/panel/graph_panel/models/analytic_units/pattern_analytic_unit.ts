import { AnalyticUnit, DetectorType, LabelingMode } from './analytic_unit';

import _ from 'lodash';

const DEFAULTS = {
  detectorType: DetectorType.PATTERN,
  type: 'GENERAL'
};

export class PatternAnalyticUnit extends AnalyticUnit {

  constructor(_serverObject?: any) {
    super(_serverObject);
    _.defaults(this._serverObject, DEFAULTS);

    this.LABELING_MODES = [
      { name: 'Label Positive', value: LabelingMode.LABELING },
      { name: 'Label Negative', value: LabelingMode.DELETING },
      { name: 'Unlabel', value: LabelingMode.UNLABELING }
    ];
  }

  toJSON() {
    const baseJSON = super.toJSON();
    return {
      ...baseJSON
    };
  }
}
