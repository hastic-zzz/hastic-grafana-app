import { AnalyticUnit, DetectorType, LabelingMode } from './analytic_unit';

import _ from 'lodash';
import moment from 'moment';

type TimePeriod = {
  value: number,
  unit: string
};

enum Bound {
  ALL = 'ALL',
  UPPER = 'UPPER',
  LOWER = 'LOWER'
};

export const BOUND_TYPES = [
  { name: 'Both', value: Bound.ALL },
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
  enableBounds: Bound.ALL
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
      enableBounds: this.enableBounds
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

  set enableBounds(val: Bound) { this._serverObject.enableBounds = val; }
  get enableBounds(): Bound { return this._serverObject.enableBounds; }

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

  get isValid(): boolean {
    const isAlphaValid = this.checkFieldValidity(
      () => this.alpha >= 0 && this.alpha <= 1,
      `Alpha must be between 0 and 1.`
    );

    return isAlphaValid;
  }

  get labelingModes() {
    return LABELING_MODES;
  }
}
