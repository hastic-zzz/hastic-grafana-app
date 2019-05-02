import { AnalyticUnit, DetectorType } from './analytic_unit';
import { PatternAnalyticUnit } from './pattern_analytic_unit';
import { ThresholdAnalyticUnit } from './threshold_analytic_unit';

export function createAnalyticUnit(serverObject: any): AnalyticUnit {
  const detectorType: DetectorType = serverObject.detectorType;
  switch(detectorType) {
    case DetectorType.PATTERN:
      return new PatternAnalyticUnit(serverObject);
    case DetectorType.THRESHOLD:
      return new ThresholdAnalyticUnit(serverObject);
    default:
      throw new Error(`Can't create analytic unit with type "${detectorType}"`);
  }
}
