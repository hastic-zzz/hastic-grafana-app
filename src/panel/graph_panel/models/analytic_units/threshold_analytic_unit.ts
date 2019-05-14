import { AnalyticUnit, DetectorType } from './analytic_unit';

import _ from 'lodash';


export enum Condition {
  ABOVE = '>',
  ABOVE_OR_EQUAL = '>=',
  EQUAL = '=',
  LESS_OR_EQUAL = '<=',
  LESS = '<',
  NO_DATA = 'NO_DATA'
};

const DEFAULTS = {
  detectorType: DetectorType.THRESHOLD,
  type: 'THRESHOLD',
  value: 0,
  condition: Condition.ABOVE_OR_EQUAL
};

const LABELING_MODES = [];

export class ThresholdAnalyticUnit extends AnalyticUnit {

  constructor(_serverObject?: any) {
    super(_serverObject);
    _.defaults(this._serverObject, DEFAULTS);
  }

  toJSON() {
    const baseJSON = super.toJSON();
    return {
      ...baseJSON,
      value: this.value,
      condition: this.condition
    };
  }

  set value(val: number) { this._serverObject.value = val; }
  get value(): number { return this._serverObject.value; }

  set condition(val: Condition) { this._serverObject.condition = val; }
  get condition(): Condition { return this._serverObject.condition; }

  get labelingModes() {
    return LABELING_MODES;
  }
}
