import { AnalyticUnit, DetectorType } from './analytic_unit';
import { msToPeriod } from './utils';

import _ from 'lodash';
import moment from 'moment';

const DEFAULTS = {
  detectorType: DetectorType.ANOMALY,
  type: 'ANOMALY',
  alpha: 0.5,
  confidence: 1,
  seasonality: 0
};

export class AnomalyAnalyticUnit extends AnalyticUnit {
  // TODO: timespan type
  private _seasonalityPeriod: any = {};

  constructor(_serverObject?: any) {
    super(_serverObject);
    _.defaults(this._serverObject, DEFAULTS);
    this.updateSeasonality();
  }

  toJSON() {
    const baseJSON = super.toJSON();
    return {
      ...baseJSON,
      alpha: this.alpha,
      confidence: this.confidence,
      seasonality: this.seasonality
    };
  }

  public updateSeasonality() {
    let seasonalityObj = {};
    seasonalityObj[this._seasonalityPeriod.unit] = this._seasonalityPeriod.value;
    this.seasonality = moment.duration(seasonalityObj).asMilliseconds();
    this._seasonalityPeriod = msToPeriod(this.seasonality);
  }

  set alpha(val: number) { this._serverObject.alpha = val; }
  get alpha(): number { return this._serverObject.alpha; }

  set confidence(val: number) { this._serverObject.confidence = val; }
  get confidence(): number { return this._serverObject.confidence; }

  set seasonality(val: number) { this._serverObject.seasonality = val; }
  get seasonality(): number { return this._serverObject.seasonality; }

  set hasSeasonality(val: boolean) {
    if(val) {
      this.seasonality = 1000;
    } else {
      this.seasonality = 0;
    }
  }
  get hasSeasonality(): boolean {
    return this.seasonality > 0;
  }

  get seasonalitySpanValue() {
    return this._seasonalityPeriod.value;
  }
  set seasonalitySpanValue(val: number) {
    this._seasonalityPeriod.value = val;
  }
  get seasonalitySpanUnit() {
    return this._seasonalityPeriod.unit;
  }
  set seasonalitySpanUnit(val: string) {
    this._seasonalityPeriod.unit = val;
  }
}
