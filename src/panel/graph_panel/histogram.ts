
import _ from 'lodash';

/**
 * Convert series into array of series values.
 * @param data Array of series
 */
export function getSeriesValues(dataList: any[]): number[] {
  const VALUE_INDEX = 0;
  let values = [];

  // Count histogam stats
  for (let i = 0; i < dataList.length; i++) {
    let series = dataList[i];
    let datapoints = series.datapoints;
    for (let j = 0; j < datapoints.length; j++) {
      if (datapoints[j][VALUE_INDEX] !== null) {
        values.push(datapoints[j][VALUE_INDEX]);
      }
    }
  }

  return values;
}

/**
 * Convert array of values into timeseries-like histogram:
 * [[val_1, count_1], [val_2, count_2], ..., [val_n, count_n]]
 * @param values
 * @param bucketSize
 */
export function convertValuesToHistogram(values: number[], bucketSize: number): any[] {
  let histogram = {};

  for (let i = 0; i < values.length; i++) {
    let bound = getBucketBound(values[i], bucketSize);
    if (histogram[bound]) {
      histogram[bound] = histogram[bound] + 1;
    } else {
      histogram[bound] = 1;
    }
  }

  let histogam_series = _.map(histogram, (count, bound) => {
    return [Number(bound), count];
  });

  // Sort by Y axis values
  return _.sortBy(histogam_series, point => point[0]);
}

function getBucketBound(value: number, bucketSize: number): number {
  return Math.floor(value / bucketSize) * bucketSize;
}
