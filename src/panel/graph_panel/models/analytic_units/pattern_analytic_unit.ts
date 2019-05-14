import { AnalyticUnit, DetectorType, LabelingMode } from './analytic_unit';

import _ from 'lodash';

const DEFAULTS = {
  detectorType: DetectorType.PATTERN,
  type: 'GENERAL'
};

const LABELING_MODES = [
  { name: 'Label Positive', value: LabelingMode.LABELING },
  { name: 'Label Negative', value: LabelingMode.DELETING },
  { name: 'Unlabel', value: LabelingMode.UNLABELING }
];

export class PatternAnalyticUnit extends AnalyticUnit {

  constructor(_serverObject?: any) {
    super(_serverObject);
    _.defaults(this._serverObject, DEFAULTS);
  }

  toJSON() {
    const baseJSON = super.toJSON();
    return {
      ...baseJSON
    };
  }

  get labelingModes() {
    return LABELING_MODES;
  }
}
