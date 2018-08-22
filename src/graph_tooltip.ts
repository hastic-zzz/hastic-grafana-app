import { AnalyticSegmentsSearcher } from 'models/analytic_unit';


export class GraphTooltip {

  private ctrl: any;
  private panel: any;
  private $tooltip: JQuery<HTMLElement>;
  private _visible = false;
  private _lastItem = undefined;

  constructor(
    private $elem: JQuery<HTMLElement>, private dashboard, 
    private scope, private getSeriesFn,
    private _anomalySegmentsSearcher: AnalyticSegmentsSearcher
  ) {
    this.ctrl = scope.ctrl;
    this.panel = this.ctrl.panel;
    this.$tooltip = $('<div class="graph-tooltip">');
  }

  clear(plot) {
    this._visible = false;
    this.$tooltip.detach();
    plot.clearCrosshair();
    plot.unhighlight();
  };

  show(pos, item?) {
    if(item === undefined) {
      item = this._lastItem;
    } else {
      this._lastItem = item;
    }

    this._visible = true;
    var plot = this.$elem.data().plot;
    var plotData = plot.getData();
    var xAxes = plot.getXAxes();
    var xMode = xAxes[0].options.mode;
    var seriesList = this.getSeriesFn();
    var allSeriesMode = this.panel.tooltip.shared;
    var group, value, absoluteTime, hoverInfo, i, series, seriesHtml, tooltipFormat;
    var rangeDist = Math.abs(xAxes[0].max - xAxes[0].min);

    // if panelRelY is defined another panel wants us to show a tooltip
    // get pageX from position on x axis and pageY from relative position in original panel
    if (pos.panelRelY) {
      var pointOffset = plot.pointOffset({x: pos.x});
      if (Number.isNaN(pointOffset.left) || pointOffset.left < 0 || pointOffset.left > this.$elem.width()) {
        this.clear(plot);
        return;
      }
      pos.pageX = this.$elem.offset().left + pointOffset.left;
      pos.pageY = this.$elem.offset().top + this.$elem.height() * pos.panelRelY;
      var isVisible = pos.pageY >= $(window).scrollTop() && 
        pos.pageY <= $(window).innerHeight() + $(window).scrollTop();
      if (!isVisible) {
        this.clear(plot);
        return;
      }
      plot.setCrosshair(pos);
      allSeriesMode = true;

      if (this.dashboard.sharedCrosshairModeOnly()) {
        // if only crosshair mode we are done
        return;
      }
    }

    if (seriesList.length === 0) {
      return;
    }

    if (seriesList[0].hasMsResolution) {
      tooltipFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
    } else {
      tooltipFormat = 'YYYY-MM-DD HH:mm:ss';
    }

    if (allSeriesMode) {
      plot.unhighlight();

      var seriesHoverInfo = this._getMultiSeriesPlotHoverInfo(plotData, pos);
      seriesHtml = '';
      absoluteTime = this.dashboard.formatDate(seriesHoverInfo.time, tooltipFormat);

      // Dynamically reorder the hovercard for the current time point if the
      // option is enabled.
      if (this.panel.tooltip.sort === 2) {
        seriesHoverInfo.series.sort((a: any, b: any) => b.value - a.value);
      } else if (this.panel.tooltip.sort === 1) {
        seriesHoverInfo.series.sort((a: any, b: any) => a.value - b.value);
      }

      for (i = 0; i < seriesHoverInfo.series.length; i++) {
        hoverInfo = seriesHoverInfo.series[i];

        if (hoverInfo.hidden) {
          continue;
        }

        var highlightClass = '';
        if (item && hoverInfo.index === item.seriesIndex) {
          highlightClass = 'graph-tooltip-list-item--highlight';
        }

        series = seriesList[hoverInfo.index];

        value = series.formatValue(hoverInfo.value);

        seriesHtml += '<div class="graph-tooltip-list-item ' + highlightClass + '"><div class="graph-tooltip-series-name">';
        seriesHtml += '<i class="fa fa-minus" style="color:' + hoverInfo.color +';"></i> ' + hoverInfo.label + ':</div>';
        seriesHtml += '<div class="graph-tooltip-value">' + value + '</div></div>';
        plot.highlight(hoverInfo.index, hoverInfo.hoverIndex);
      }

      seriesHtml += this._appendAnomaliesHTML(pos.x, rangeDist);

      this._renderAndShow(absoluteTime, seriesHtml, pos, xMode);
    }
    // single series tooltip
    else if (item) {
      series = seriesList[item.seriesIndex];
      group = '<div class="graph-tooltip-list-item"><div class="graph-tooltip-series-name">';
      group += '<i class="fa fa-minus" style="color:' + item.series.color +';"></i> ' + series.aliasEscaped + ':</div>';

      if (this.panel.stack && this.panel.tooltip.value_type === 'individual') {
        value = item.datapoint[1] - item.datapoint[2];
      }
      else {
        value = item.datapoint[1];
      }

      value = series.formatValue(value);

      absoluteTime = this.dashboard.formatDate(item.datapoint[0], tooltipFormat);

      group += '<div class="graph-tooltip-value">' + value + '</div>';

      group += this._appendAnomaliesHTML(pos.x, rangeDist);

      this._renderAndShow(absoluteTime, group, pos, xMode);
    }
    // no hit
    else {
      this.$tooltip.detach();
    }
  };

  
  destroy() {
    this._visible = false;
    this.$tooltip.remove();
  };

  get visible() { return this._visible; }

  private _findHoverIndexFromDataPoints(posX, series, last) {
    var ps = series.datapoints.pointsize;
    var initial = last*ps;
    var len = series.datapoints.points.length;
    for (var j = initial; j < len; j += ps) {
      // Special case of a non stepped line, highlight the very last point just before a null point
      if ((!series.lines.steps && series.datapoints.points[initial] != null && series.datapoints.points[j] == null)
          //normal case
          || series.datapoints.points[j] > posX) {
        return Math.max(j - ps,  0)/ps;
      }
    }
    return j/ps - 1;
  };

  private _findHoverIndexFromData(posX, series) {
    var lower = 0;
    var upper = series.data.length - 1;
    var middle;
    while (true) {
      if (lower > upper) {
        return Math.max(upper, 0);
      }
      middle = Math.floor((lower + upper) / 2);
      if (series.data[middle][0] === posX) {
        return middle;
      } else if (series.data[middle][0] < posX) {
        lower = middle + 1;
      } else {
        upper = middle - 1;
      }
    }
  };

  private _appendAnomaliesHTML(pos: number, rangeDist: number): string {
    var result = '';
    var segments = this._anomalySegmentsSearcher(pos, rangeDist);
    if(segments.length === 0) {
      return '';
    }
    segments.forEach(s => {
      var from = this.dashboard.formatDate(s.segment.from, 'HH:mm:ss.SSS');
      var to = this.dashboard.formatDate(s.segment.to, 'HH:mm:ss.SSS');
      
      result += `
        <div class="graph-tooltip-list-item">
          <div class="graph-tooltip-series-name">
            <i class="fa fa-exclamation" style="color:${s.anomalyType.color}"></i>
            ${s.anomalyType.name}:
          </div>
          <div class="graph-tooltip-value">
            <i class="fa ${ s.segment.labeled ? "fa-thumb-tack" : "fa-search-plus" }" aria-hidden="true"></i>
            ${from} — ${to}
          </div>
        </div>
      `;

       
    });
    return result;
  }

  private _renderAndShow(absoluteTime, innerHtml, pos, xMode) {
    if (xMode === 'time') {
      innerHtml = '<div class="graph-tooltip-time">'+ absoluteTime + '</div>' + innerHtml;
    }
    (this.$tooltip.html(innerHtml) as any).place_tt(pos.pageX + 20, pos.pageY);
  };

  private _getMultiSeriesPlotHoverInfo(seriesList, pos): { series: any[][], time: any } {
    var value, series, hoverIndex, hoverDistance, pointTime, yaxis;
    // 3 sub-arrays, 1st for hidden series, 2nd for left yaxis, 3rd for right yaxis.
    var results = [[],[],[]];

    //now we know the current X (j) position for X and Y values
    var lastValue = 0; //needed for stacked values

    var minDistance, minTime;

    for (let i = 0; i < seriesList.length; i++) {
      series = seriesList[i];

      if (!series.data.length || (this.panel.legend.hideEmpty && series.allIsNull)) {
        // Init value so that it does not brake series sorting
        results[0].push({ hidden: true, value: 0 });
        continue;
      }

      if (!series.data.length || (this.panel.legend.hideZero && series.allIsZero)) {
        // Init value so that it does not brake series sorting
        results[0].push({ hidden: true, value: 0 });
        continue;
      }

      hoverIndex = this._findHoverIndexFromData(pos.x, series);
      hoverDistance = pos.x - series.data[hoverIndex][0];
      pointTime = series.data[hoverIndex][0];

      // Take the closest point before the cursor, or if it does not exist, the closest after
      if (! minDistance
          || (hoverDistance >=0 && (hoverDistance < minDistance || minDistance < 0))
          || (hoverDistance < 0 && hoverDistance > minDistance)
      ) {
        minDistance = hoverDistance;
        minTime = pointTime;
      }

      if (series.stack) {
        if (this.panel.tooltip.value_type === 'individual') {
          value = series.data[hoverIndex][1];
        } else if (!series.stack) {
          value = series.data[hoverIndex][1];
        } else {
          lastValue += series.data[hoverIndex][1];
          value = lastValue;
        }
      } else {
        value = series.data[hoverIndex][1];
      }

      // Highlighting multiple Points depending on the plot type
      if (series.lines.steps || series.stack) {
        // stacked and steppedLine plots can have series with different length.
        // Stacked series can increase its length on each new stacked serie if null points found,
        // to speed the index search we begin always on the last found hoverIndex.
        hoverIndex = this._findHoverIndexFromDataPoints(pos.x, series, hoverIndex);
      }

      // Be sure we have a yaxis so that it does not brake series sorting
      yaxis = 0;
      if (series.yaxis) {
        yaxis = series.yaxis.n;
      }

      results[yaxis].push({
        value: value,
        hoverIndex: hoverIndex,
        color: series.color,
        label: series.aliasEscaped,
        time: pointTime,
        distance: hoverDistance,
        index: i
      });
    }

    // Contat the 3 sub-arrays
    results = results[0].concat(results[1], results[2]);

    // Time of the point closer to pointer

    return { series: results, time: minTime };
  };
}

