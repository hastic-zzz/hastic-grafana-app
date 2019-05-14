import { AnalyticUnit, DetectorType } from './analytic_unit';
import { PatternAnalyticUnit } from './pattern_analytic_unit';
import { ThresholdAnalyticUnit } from './threshold_analytic_unit';
import { AnomalyAnalyticUnit } from './anomaly_analytic_unit';

export function createAnalyticUnit(serverObject: any): AnalyticUnit {
  const detectorType: DetectorType = serverObject.detectorType;
  switch(detectorType) {
    case DetectorType.PATTERN:
      return new PatternAnalyticUnit(serverObject);
    case DetectorType.THRESHOLD:
      return new ThresholdAnalyticUnit(serverObject);
    case DetectorType.ANOMALY:
      return new AnomalyAnalyticUnit(serverObject);
    default:
      throw new Error(`Can't create analytic unit with type "${detectorType}"`);
  }
}

export function msToPeriod(ms: number) {
  console.log(ms)
  if(ms < 60000) {
    // Less than 1 min
    return {
      value: Math.round(ms / 1000),
      unit: 'seconds'
    };
  } else if(ms < 3600000) {
    // Less than 1 hour, divide in minutes
    return {
      value: Math.round(ms / 60000),
      unit: 'minutes'
    };
  } else if(ms < 86400000) {
    // Less than one day, divide in hours
    return {
      value: Math.round(ms / 3600000),
      unit: 'hours'
    };
  } else if(ms < 31536000000) {
    // Less than one year, divide in days
    return {
      value: Math.round(ms / 86400000),
      unit: 'days'
    };
  }

  return {
    value: Math.round(ms / 31536000000),
    unit: 'years'
  };
}
