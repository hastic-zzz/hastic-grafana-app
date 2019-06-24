import { AnalyticUnit, DetectorType, LabelingMode } from './analytic_unit';

import _ from 'lodash';
import moment from 'moment';

type TimePeriod = {
  value: number,
  unit: string
};

enum Bound {
  NONE = 'NONE',
  UPPER = 'UPPER',
  LOWER = 'LOWER'
};

export const BOUND_TYPES = [
  { name: 'None', value: Bound.NONE },
  { name: 'Upper', value: Bound.UPPER },
  { name: 'Lower', value: Bound.LOWER }
];

const DEFAULTS = {
  detectorType: DetectorType.ANOMALY,
  type: 'ANOMALY',
  alpha: 0.5,
  confidence: 1,
  seasonality: 0,
  seasonalityPeriod: {
    value: 0,
    unit: 'seconds'
  },
  disableBound: Bound.NONE
};

const LABELING_MODES = [
  { name: 'Label Negative', value: LabelingMode.DELETING },
  { name: 'Unlabel', value: LabelingMode.UNLABELING }
];

export class AnomalyAnalyticUnit extends AnalyticUnit {

  constructor(_serverObject?: any) {
    super(_serverObject);
    _.defaults(this._serverObject, DEFAULTS);
  }

  toJSON() {
    const baseJSON = super.toJSON();
    return {
      ...baseJSON,
      alpha: this.alpha,
      confidence: this.confidence,
      seasonality: this.seasonality,
      seasonalityPeriod: this.seasonalityPeriod,
      disableBound: this.disableBound
    };
  }

  set alpha(val: number) { this._serverObject.alpha = val; }
  get alpha(): number { return this._serverObject.alpha; }

  set confidence(val: number) { this._serverObject.confidence = val; }
  get confidence(): number { return this._serverObject.confidence; }

  get seasonality(): number {
    let seasonalityObj = {};
    seasonalityObj[this.seasonalityPeriod.unit] = this.seasonalityPeriod.value;
    return moment.duration(seasonalityObj).asMilliseconds();
  }

  set seasonalityPeriod(val: TimePeriod) { this._serverObject.seasonalityPeriod = val; }
  get seasonalityPeriod(): TimePeriod { return this._serverObject.seasonalityPeriod; }

  set disableBound(val: Bound) { this._serverObject.disableBound = val; }
  get disableBound(): Bound { return this._serverObject.disableBound; }

  // TODO: merge seasonality and hasSeasonality
  set hasSeasonality(val: boolean) {
    if(val) {
      this.seasonalityPeriod = { value: 1, unit: 'seconds' };
    } else {
      this.seasonalityPeriod = { value: 0, unit: 'seconds' };
    }
  }
  get hasSeasonality(): boolean {
    return this.seasonality > 0;
  }

  get labelingModes() {
    return LABELING_MODES;
  }
}
