import { Segment } from './models/segment';
import { GraphTooltip } from './graph_tooltip';

import { convertValuesToHistogram, getSeriesValues } from './histogram';
import {
  AnalyticController,
  REGION_FILL_ALPHA,
  REGION_STROKE_ALPHA,
  REGION_DELETE_COLOR_LIGHT,
  REGION_DELETE_COLOR_DARK
} from './controllers/analytic_controller';

import { GraphCtrl } from './module';

import 'jquery';
import './vendor/flot/jquery.flot.js';
import './vendor/flot/jquery.flot.selection.js';
import './vendor/flot/jquery.flot.time.js';
import './vendor/flot/jquery.flot.stack.js';
import './vendor/flot/jquery.flot.stackpercent.js';
import './vendor/flot/jquery.flot.fillbelow.js';
import './vendor/flot/jquery.flot.crosshair.js';
import './vendor/flot/jquery.flot.dashes.js';
import './vendor/flot/jquery.flot.events.js';

// import { EventManager } from './vendor/grafana/event_manager';
import { updateLegendValues } from './vendor/grafana/time_series2';
import { tickStep } from './vendor/grafana/ticks';
import { appEvents } from 'grafana/app/core/core';
import kbn from 'grafana/app/core/utils/kbn';

import _ from 'lodash';
import moment from 'moment';


const COLOR_SELECTION = '#666';


export class GraphRenderer {

  private _analyticController: AnalyticController;
  private data: any;
  private tooltip: GraphTooltip;
  private panelWidth: number;
  private plot: any;
  private sortedSeries: any;
  private ctrl: GraphCtrl;
  private dashboard: any;
  private panel: any;
  // private eventManager;
  private flotOptions: any = {}
  private $elem: JQuery<HTMLElement>;
  // private annotations: any[];
  private contextSrv: any;
  private popoverSrv: any;
  private scope: any;
  private timeSrv: any;
  private _graphMousePosition: any;

  constructor ($elem: JQuery<HTMLElement>, timeSrv, popoverSrv, contextSrv, scope) {

    var self = this;
    this.$elem = $elem;
    this.ctrl = scope.ctrl;
    this.dashboard = this.ctrl.dashboard;
    this.panel = this.ctrl.panel;

    this.timeSrv = timeSrv;
    this.popoverSrv = popoverSrv;
    this.contextSrv = contextSrv;
    this.scope = scope;

    this._analyticController = this.ctrl.analyticsController;
    if(this._analyticController === undefined) {
      throw new Error('analyticController is undefined');
    }


    // this.annotations = [];
    this.panelWidth = 0;

    // this.eventManager = new EventManager(this.ctrl);
    this.flotOptions = {}
    
    this.tooltip = new GraphTooltip(
      $elem, this.dashboard, scope, () => this.sortedSeries,
      this._analyticController.getSegmentsSearcher()
    );

    // panel events
    this.ctrl.events.on('panel-teardown', () => {

      if (this.plot) {
        this.plot.destroy();
        this.plot = null;
      }
    });

    // global events
    appEvents.on('graph-hover', this._onGraphHover.bind(this), scope);
    appEvents.on('graph-hover-clear', this._onGraphHoverClear.bind(this), scope);

    $elem.bind('plotselected', (event, selectionEvent) => {
      if (this.panel.xaxis.mode !== 'time') {
        // Skip if panel in histogram or series mode
        this.plot.clearSelection();
        return;
      }

      if(this._isHasticEvent(selectionEvent)) {
        this.plot.clearSelection();
        var id = this._analyticController.getNewTempSegmentId();
        var segment = new Segment(
          id,
          Math.round(selectionEvent.xaxis.from),
          Math.round(selectionEvent.xaxis.to)
        );
        if(this._analyticController.labelingDeleteMode) {
          this._analyticController.deleteLabelingAnalyticUnitSegmentsInRange(
            segment.from, segment.to
          );
        } else {
          this._analyticController.addLabelSegment(segment);
        }
        this.renderPanel();
        return;
      }

      if ((selectionEvent.ctrlKey || selectionEvent.metaKey) && contextSrv.isEditor) {
        // Add annotation
        setTimeout(() => {
          // this.eventManager.updateTime(selectionEvent.xaxis);
        }, 100);
      } else {
        scope.$apply(function() {
          timeSrv.setTime({
            from: moment.utc(selectionEvent.xaxis.from),
            to: moment.utc(selectionEvent.xaxis.to),
          });
        });
      }
    });

    $elem.bind('plotclick', (event, flotEvent, item) => {
      if (this.panel.xaxis.mode !== 'time') {
        // Skip if panel in histogram or series mode
        return;
      }

      if(this._isHasticEvent(flotEvent)) {
        return;
      }

      if ((flotEvent.ctrlKey || flotEvent.metaKey) && contextSrv.isEditor) {
        // Skip if range selected (added in "plotselected" event handler)
        let isRangeSelection = flotEvent.x !== flotEvent.x1;
        if (!isRangeSelection) {
          setTimeout(() => {
            // this.eventManager.updateTime({ from: flotEvent.x, to: null });
          }, 100);
        }
      }
    });

    $elem.mouseleave(() => {
      if (this.panel.tooltip.shared) {
        var plot = $elem.data().plot;
        if (plot) {
          this.tooltip.clear(plot);
        }
      }
      appEvents.emit('graph-hover-clear');
    });

    $elem.bind("plothover", (event, pos, item) => {
      self.tooltip.show(pos, item);
      pos.panelRelY = (pos.pageY - $elem.offset().top) / $elem.height();
      self._graphMousePosition = this.plot.p2c(pos);
      appEvents.emit('graph-hover', { pos: pos, panel: this.panel });
    });

    $elem.bind("plotclick", (event, pos, item) => {
      appEvents.emit('graph-click', { pos: pos, panel: this.panel, item: item });
    });

    $elem.mousedown(e => {
      this._analyticController.graphLocked = true;
      this._chooseSelectionColor(e);
    });

    $(document).mouseup(e => {
      this._analyticController.graphLocked = false;
    })

  }

  public render(renderData) {
    this.data = renderData || this.data;
    if (!this.data) {
      return;
    }
    // this.annotations = this.ctrl.annotations || [];
    this._buildFlotPairs(this.data);
    updateLegendValues(this.data, this.panel);
    this.renderPanel();
    if(this.tooltip.visible) {
      var pos = this.plot.c2p(this._graphMousePosition);
      var canvasOffset = this.$elem.find('.flot-overlay').offset();
      this.tooltip.show(pos);
      this.plot.setCrosshair(pos);
    }
  }

  private _onGraphHover(evt: any) {

    if (!this.dashboard.sharedTooltipModeEnabled()) {
      return;
    }

    // ignore if we are the emitter
    if (!this.plot || evt.panel.id === this.panel.id || this.ctrl.otherPanelInFullscreenMode()) {
      return;
    }

    this._graphMousePosition = this.plot.p2c(evt.pos);
    this.tooltip.show(evt.pos);
  }

  private _onGraphHoverClear() {
    if (this.plot) {
      this.tooltip.clear(this.plot);
    }
  }

  private _shouldAbortRender() {
    if (!this.data) {
      return true;
    }

    if (this.panelWidth === 0) {
      return true;
    }

    return false;
  }

  private _drawHook(plot) {
    // add left axis labels
    if (this.panel.yaxes[0].label && this.panel.yaxes[0].show) {
      $("<div class='axisLabel left-yaxis-label flot-temp-elem'></div>")
        .text(this.panel.yaxes[0].label)
        .appendTo(this.$elem);
    }

    // add right axis labels
    if (this.panel.yaxes[1].label && this.panel.yaxes[1].show) {
      $("<div class='axisLabel right-yaxis-label flot-temp-elem'></div>")
        .text(this.panel.yaxes[1].label)
        .appendTo(this.$elem);
    }

    if (this.ctrl.dataWarning) {
      $(`<div class="datapoints-warning flot-temp-elem">${this.ctrl.dataWarning.title}</div>`).appendTo(this.$elem);
    }

  }

  private _processOffsetHook(plot, gridMargin) {
    var left = this.panel.yaxes[0];
    var right = this.panel.yaxes[1];
    if (left.show && left.label) {
      gridMargin.left = 20;
    }
    if (right.show && right.label) {
      gridMargin.right = 20;
    }

    // apply y-axis min/max options
    var yaxis = plot.getYAxes();
    for (var i = 0; i < yaxis.length; i++) {
      var axis = yaxis[i];
      var panelOptions = this.panel.yaxes[i];
      axis.options.max = axis.options.max !== null ? axis.options.max : panelOptions.max;
      axis.options.min = axis.options.min !== null ? axis.options.min : panelOptions.min;
    }
  }

  // Series could have different timeSteps,
  // let's find the smallest one so that bars are correctly rendered.
  // In addition, only take series which are rendered as bars for this.
  private _getMinTimeStepOfSeries(data) {
    var min = Number.MAX_VALUE;

    for (let i = 0; i < data.length; i++) {
      if (!data[i].stats.timeStep) {
        continue;
      }
      if (this.panel.bars) {
        if (data[i].bars && data[i].bars.show === false) {
          continue;
        }
      } else {
        if (typeof data[i].bars === 'undefined' || typeof data[i].bars.show === 'undefined' || !data[i].bars.show) {
          continue;
        }
      }

      if (data[i].stats.timeStep < min) {
        min = data[i].stats.timeStep;
      }
    }

    return min;
  }

  // Function for rendering panel
  public renderPanel() {

    this.panelWidth = this.$elem.width();
    if (this._shouldAbortRender()) {
      return;
    }


    // un-check dashes if lines are unchecked
    this.panel.dashes = this.panel.lines ? this.panel.dashes : false;

    // Populate element
    this._buildFlotOptions(this.panel);
    this._prepareXAxis(this.panel);
    this._configureYAxisOptions(this.data);
    // this.eventManager.addFlotEvents(this.annotations, this.flotOptions);
    this._analyticController.updateFlotEvents(this.contextSrv.isEditor, this.flotOptions);

    this.sortedSeries = this._sortSeries(this.data, this.panel);
    this._callPlot(true);
  }

  private _chooseSelectionColor(e) {
    var color = COLOR_SELECTION;
    var fillAlpha = 0.4;
    var strokeAlpha = 0.4;
    if(this._isHasticEvent(e)) {
      if(this._analyticController.labelingDeleteMode) {
        color = this.contextSrv.user.lightTheme ?
          REGION_DELETE_COLOR_LIGHT :
          REGION_DELETE_COLOR_DARK;
      } else {
        color = this._analyticController.labelingUnit.color;
      }
      fillAlpha = REGION_FILL_ALPHA;
      strokeAlpha = REGION_STROKE_ALPHA;
    }
    this.plot.getOptions().selection.color = color
  }

  private _buildFlotPairs(data) {
    for (let i = 0; i < data.length; i++) {
      let series = data[i];
      series.data = series.getFlotPairs(series.nullPointMode || this.panel.nullPointMode);

      // if hidden remove points and disable stack
      if (this.ctrl.hiddenSeries[series.alias]) {
        series.data = [];
        series.stack = false;
      }
    }
  }

  private _prepareXAxis(panel) {
    switch (panel.xaxis.mode) {
      case 'series': {
        this.flotOptions.series.bars.barWidth = 0.7;
        this.flotOptions.series.bars.align = 'center';

        for (let i = 0; i < this.data.length; i++) {
          let series = this.data[i];
          series.data = [[i + 1, series.stats[panel.xaxis.values[0]]]];
        }

        this._addXSeriesAxis();
        break;
      }
      case 'histogram': {
        let bucketSize: number;
        let values = getSeriesValues(this.data);

        if (this.data.length && values.length) {
          let histMin = _.min(_.map(this.data, (s:any) => s.stats.min));
          let histMax = _.max(_.map(this.data, (s:any) => s.stats.max));
          let ticks = panel.xaxis.buckets || this.panelWidth / 50;
          bucketSize = tickStep(histMin, histMax, ticks);
          let histogram = convertValuesToHistogram(values, bucketSize);
          this.data[0].data = histogram;
          this.flotOptions.series.bars.barWidth = bucketSize * 0.8;
        } else {
          bucketSize = 0;
        }

        this._addXHistogramAxis(bucketSize);
        break;
      }
      case 'table': {
        this.flotOptions.series.bars.barWidth = 0.7;
        this.flotOptions.series.bars.align = 'center';
        this._addXTableAxis();
        break;
      }
      default: {
        this.flotOptions.series.bars.barWidth = this._getMinTimeStepOfSeries(this.data) / 1.5;
        this._addTimeAxis();
        break;
      }
    }
  }

  private _callPlot(incrementRenderCounter) {
    try {
      this.plot = $.plot(this.$elem, this.sortedSeries, this.flotOptions);
      if (this.ctrl.renderError) {
        delete this.ctrl.error;
        delete this.ctrl.inspector;
      }
    } catch (e) {
      console.log('flotcharts error', e);
      this.ctrl.error = e.message || 'Render Error';
      this.ctrl.renderError = true;
      this.ctrl.inspector = { error: e };
    }

    if (incrementRenderCounter) {
      this.ctrl.renderingCompleted();
    }
  }

  private _buildFlotOptions(panel) {
    const stack = panel.stack ? true : null;
    this.flotOptions = {
      hooks: {
        draw: [this._drawHook.bind(this)],
        processOffset: [this._processOffsetHook.bind(this)],
      },
      legend: { show: false },
      series: {
        stackpercent: panel.stack ? panel.percentage : false,
        stack: panel.percentage ? null : stack,
        lines: {
          show: panel.lines,
          zero: false,
          fill: this._translateFillOption(panel.fill),
          lineWidth: panel.dashes ? 0 : panel.linewidth,
          steps: panel.steppedLine,
        },
        dashes: {
          show: panel.dashes,
          lineWidth: panel.linewidth,
          dashLength: [panel.dashLength, panel.spaceLength],
        },
        bars: {
          show: panel.bars,
          fill: 1,
          barWidth: 1,
          zero: false,
          lineWidth: 0,
        },
        points: {
          show: panel.points,
          fill: 1,
          fillColor: false,
          radius: panel.points ? panel.pointradius : 2,
        },
        shadowSize: 0,
      },
      yaxes: [],
      xaxis: {},
      grid: {
        minBorderMargin: 0,
        markings: [],
        backgroundColor: null,
        borderWidth: 0,
        hoverable: true,
        clickable: true,
        color: '#c8c8c8',
        margin: { left: 0, right: 0 },
        labelMarginX: 0,
      },
      selection: {
        mode: 'x'
      },
      crosshair: {
        mode: 'x',
      },
    };
  }

  private _sortSeries(series, panel) {
    var sortBy = panel.legend.sort;
    var sortOrder = panel.legend.sortDesc;
    var haveSortBy = sortBy !== null || sortBy !== undefined;
    var haveSortOrder = sortOrder !== null || sortOrder !== undefined;
    var shouldSortBy = panel.stack && haveSortBy && haveSortOrder;
    var sortDesc = panel.legend.sortDesc === true ? -1 : 1;

    series.sort((x, y) => {
      if (x.zindex > y.zindex) {
        return 1;
      }

      if (x.zindex < y.zindex) {
        return -1;
      }

      if (shouldSortBy) {
        if (x.stats[sortBy] > y.stats[sortBy]) {
          return 1 * sortDesc;
        }
        if (x.stats[sortBy] < y.stats[sortBy]) {
          return -1 * sortDesc;
        }
      }

      return 0;
    });

    return series;
  }

  private _translateFillOption(fill) {
    if (this.panel.percentage && this.panel.stack) {
      return fill === 0 ? 0.001 : fill / 10;
    } else {
      return fill / 10;
    }
  }

  private _addTimeAxis() {
    var ticks = this.panelWidth / 100;
    var min = _.isUndefined(this.ctrl.range.from) ? null : this.ctrl.range.from.valueOf();
    var max = _.isUndefined(this.ctrl.range.to) ? null : this.ctrl.range.to.valueOf();

    this.flotOptions.xaxis = {
      timezone: this.dashboard.getTimezone(),
      show: this.panel.xaxis.show,
      mode: 'time',
      min: min,
      max: max,
      label: 'Datetime',
      ticks: ticks,
      timeformat: this._timeFormat(ticks, min, max),
    };
  }

  private _addXSeriesAxis() {
    var ticks = _.map(this.data, function(series: any, index) {
      return [index + 1, series.alias];
    });

    this.flotOptions.xaxis = {
      timezone: this.dashboard.getTimezone(),
      show: this.panel.xaxis.show,
      mode: null,
      min: 0,
      max: ticks.length + 1,
      label: 'Datetime',
      ticks: ticks,
    };
  }

  private _addXHistogramAxis(bucketSize) {
    let ticks, min, max;
    let defaultTicks = this.panelWidth / 50;

    if (this.data.length && bucketSize) {
      ticks = _.map(this.data[0].data, point => point[0]);
      min = _.min(ticks);
      max = _.max(ticks);

      // Adjust tick step
      let tickStep = bucketSize;
      let ticks_num = Math.floor((max - min) / tickStep);
      while (ticks_num > defaultTicks) {
        tickStep = tickStep * 2;
        ticks_num = Math.ceil((max - min) / tickStep);
      }

      // Expand ticks for pretty view
      min = Math.floor(min / tickStep) * tickStep;
      max = Math.ceil(max / tickStep) * tickStep;

      ticks = [];
      for (let i = min; i <= max; i += tickStep) {
        ticks.push(i);
      }
    } else {
      // Set defaults if no data
      ticks = defaultTicks / 2;
      min = 0;
      max = 1;
    }

    this.flotOptions.xaxis = {
      timezone: this.dashboard.getTimezone(),
      show: this.panel.xaxis.show,
      mode: null,
      min: min,
      max: max,
      label: 'Histogram',
      ticks: ticks,
    };

    // Use 'short' format for histogram values
    this._configureAxisMode(this.flotOptions.xaxis, 'short');
  }

  private _addXTableAxis() {
    var ticks = _.map(this.data, function(series: any, seriesIndex: any) {
      return _.map(series.datapoints, function(point, pointIndex) {
        var tickIndex = seriesIndex * series.datapoints.length + pointIndex;
        return [tickIndex + 1, point[1]];
      });
    });
    ticks = _.flatten(ticks); 

    this.flotOptions.xaxis = {
      timezone: this.dashboard.getTimezone(),
      show: this.panel.xaxis.show,
      mode: null,
      min: 0,
      max: ticks.length + 1,
      label: 'Datetime',
      ticks: ticks,
    };
  }

  private _configureYAxisOptions(data) {
    var defaults = {
      position: 'left',
      show: this.panel.yaxes[0].show,
      index: 1,
      logBase: this.panel.yaxes[0].logBase || 1,
      min: this._parseNumber(this.panel.yaxes[0].min),
      max: this._parseNumber(this.panel.yaxes[0].max),
      tickDecimals: this.panel.yaxes[0].decimals,
    };

    this.flotOptions.yaxes.push(defaults);

    if (_.find(data, { yaxis: 2 })) {
      var secondY = _.clone(defaults);
      secondY.index = 2;
      secondY.show = this.panel.yaxes[1].show;
      secondY.logBase = this.panel.yaxes[1].logBase || 1;
      secondY.position = 'right';
      secondY.min = this._parseNumber(this.panel.yaxes[1].min);
      secondY.max = this._parseNumber(this.panel.yaxes[1].max);
      secondY.tickDecimals = this.panel.yaxes[1].decimals;
      this.flotOptions.yaxes.push(secondY);

      this._applyLogScale(this.flotOptions.yaxes[1], data);
      this._configureAxisMode(this.flotOptions.yaxes[1], this.panel.percentage && this.panel.stack ? 'percent' : this.panel.yaxes[1].format);
    }
    this._applyLogScale(this.flotOptions.yaxes[0], data);
    this._configureAxisMode(this.flotOptions.yaxes[0], this.panel.percentage && this.panel.stack ? 'percent' : this.panel.yaxes[0].format);
  }

  private _parseNumber(value: any) {
    if (value === null || typeof value === 'undefined') {
      return null;
    }

    return _.toNumber(value);
  }

  private _applyLogScale(axis, data) {
    if (axis.logBase === 1) {
      return;
    }

    const minSetToZero = axis.min === 0;

    if (axis.min < Number.MIN_VALUE) {
      axis.min = null;
    }
    if (axis.max < Number.MIN_VALUE) {
      axis.max = null;
    }

    var series, i;
    var max = axis.max,
      min = axis.min;

    for (i = 0; i < data.length; i++) {
      series = data[i];
      if (series.yaxis === axis.index) {
        if (!max || max < series.stats.max) {
          max = series.stats.max;
        }
        if (!min || min > series.stats.logmin) {
          min = series.stats.logmin;
        }
      }
    }

    axis.transform = function(v) {
      return v < Number.MIN_VALUE ? null : Math.log(v) / Math.log(axis.logBase);
    };
    axis.inverseTransform = function(v) {
      return Math.pow(axis.logBase, v);
    };

    if (!max && !min) {
      max = axis.inverseTransform(+2);
      min = axis.inverseTransform(-2);
    } else if (!max) {
      max = min * axis.inverseTransform(+4);
    } else if (!min) {
      min = max * axis.inverseTransform(-4);
    }

    if (axis.min) {
      min = axis.inverseTransform(Math.ceil(axis.transform(axis.min)));
    } else {
      min = axis.min = axis.inverseTransform(Math.floor(axis.transform(min)));
    }
    if (axis.max) {
      max = axis.inverseTransform(Math.floor(axis.transform(axis.max)));
    } else {
      max = axis.max = axis.inverseTransform(Math.ceil(axis.transform(max)));
    }

    if (!min || min < Number.MIN_VALUE || !max || max < Number.MIN_VALUE) {
      return;
    }

    if (Number.isFinite(min) && Number.isFinite(max)) {
      if (minSetToZero) {
        axis.min = 0.1;
        min = 1;
      }

      axis.ticks = this._generateTicksForLogScaleYAxis(min, max, axis.logBase);
      if (minSetToZero) {
        axis.ticks.unshift(0.1);
      }
      if (axis.ticks[axis.ticks.length - 1] > axis.max) {
        axis.max = axis.ticks[axis.ticks.length - 1];
      }
    } else {
      axis.ticks = [1, 2];
      delete axis.min;
      delete axis.max;
    }
  }

  private _generateTicksForLogScaleYAxis(min, max, logBase) {
    let ticks = [];

    var nextTick;
    for (nextTick = min; nextTick <= max; nextTick *= logBase) {
      ticks.push(nextTick);
    }

    const maxNumTicks = Math.ceil(this.ctrl.height / 25);
    const numTicks = ticks.length;
    if (numTicks > maxNumTicks) {
      const factor = Math.ceil(numTicks / maxNumTicks) * logBase;
      ticks = [];

      for (nextTick = min; nextTick <= max * factor; nextTick *= factor) {
        ticks.push(nextTick);
      }
    }

    return ticks;
  }

  private _configureAxisMode(axis, format) {
    axis.tickFormatter = function(val, axis) {
      return kbn.valueFormats[format](val, axis.tickDecimals, axis.scaledDecimals);
    };
  }

  private _timeFormat(ticks, min, max) {
    if (min && max && ticks) {
      var range = max - min;
      var secPerTick = range / ticks / 1000;
      var oneDay = 86400000;
      var oneYear = 31536000000;

      if (secPerTick <= 45) {
        return '%H:%M:%S';
      }
      if (secPerTick <= 7200 || range <= oneDay) {
        return '%H:%M';
      }
      if (secPerTick <= 80000) {
        return '%m/%d %H:%M';
      }
      if (secPerTick <= 2419200 || range <= oneYear) {
        return '%m/%d';
      }
      return '%Y-%m';
    }

    return '%H:%M';
  }

  private _isHasticEvent(obj: any) {
    return (obj.ctrlKey || obj.metaKey) &&
           this.contextSrv.isEditor &&
           this._analyticController.labelingMode;
  }

}
