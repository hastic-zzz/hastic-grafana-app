import './series_overrides_ctrl';
import './thresholds_form';

import template from './template';

import { GraphRenderer } from './graph_renderer';
import { GraphLegend } from './graph_legend';
import { DataProcessor } from './data_processor';
import { MetricExpanded } from './models/metric';
import { DatasourceRequest } from './models/datasource';
import { AnalyticUnitId, AnalyticUnit } from './models/analytic_unit';
import { AnalyticService } from './services/analytic_service';
import { AnalyticController } from './controllers/analytic_controller';

import { axesEditorComponent } from './axes_editor';

import { MetricsPanelCtrl, alertTab } from 'grafana/app/plugins/sdk';
import { BackendSrv } from 'grafana/app/core/services/backend_srv';
import { appEvents } from 'grafana/app/core/core'
import config from 'grafana/app/core/config';

import _ from 'lodash';

const BACKEND_VARIABLE_NAME = 'HASTIC_SERVER_URL';


class GraphCtrl extends MetricsPanelCtrl {
  static template = template;
  ANALYTIC_TYPES: Array<{name: string, value: string}> = [
    { name: 'General', value: 'general' },
    { name: 'Peaks', value: 'peak' },
    { name: 'Jumps', value: 'jump' },
    { name: 'Drops', value: 'drop' }
  ];

  hiddenSeries: any = {};
  seriesList: any = [];
  dataList: any = [];
  // annotations: any = [];


  _panelPath: any;
  _renderError: boolean = false;

  // annotationsPromise: any;
  dataWarning: any;
  colors: any = [];
  subTabIndex: number;
  processor: DataProcessor;

  datasourceRequest: DatasourceRequest;
  
  anomalyTypes = []; // TODO: remove it later. Only for alert tab
  analyticsController: AnalyticController;

  _graphRenderer: GraphRenderer;
  _graphLegend: GraphLegend;

  panelDefaults = {
    // datasource name, null = default datasource
    datasource: null,
    // sets client side (flot) or native graphite png renderer (png)
    renderer: 'flot',
    yaxes: [
      {
        label: null,
        show: true,
        logBase: 1,
        min: null,
        max: null,
        format: 'short',
      },
      {
        label: null,
        show: true,
        logBase: 1,
        min: null,
        max: null,
        format: 'short',
      },
    ],
    xaxis: {
      show: true,
      mode: 'time',
      name: null,
      values: [],
      buckets: null,
    },
    // show/hide lines
    lines: true,
    // fill factor
    fill: 1,
    // line width in pixels
    linewidth: 1,
    // show/hide dashed line
    dashes: false,
    // length of a dash
    dashLength: 10,
    // length of space between two dashes
    spaceLength: 10,
    // show hide points
    points: false,
    // point radius in pixels
    pointradius: 5,
    // show hide bars
    bars: false,
    // enable/disable stacking
    stack: false,
    // stack percentage mode
    percentage: false,
    // legend options
    legend: {
      show: true, // disable/enable legend
      values: false, // disable/enable legend values
      min: false,
      max: false,
      current: false,
      total: false,
      avg: false,
    },
    // how null points should be handled
    nullPointMode: 'null',
    // staircase line mode
    steppedLine: false,
    // tooltip options
    tooltip: {
      value_type: 'individual',
      shared: true,
      sort: 0,
    },
    // time overrides
    timeFrom: null,
    timeShift: null,
    // metric queries
    targets: [{}],
    // series color overrides
    aliasColors: {},
    // other style overrides
    seriesOverrides: [],
    thresholds: [],
    anomalyType: '',
  };

  /** @ngInject */
  constructor(
    $scope, $injector, private annotationsSrv,
    private keybindingSrv, private backendSrv,
    private popoverSrv, private contextSrv,
    private alertSrv
) {
    super($scope, $injector);

    _.defaults(this.panel, this.panelDefaults);
    _.defaults(this.panel.tooltip, this.panelDefaults.tooltip);
    _.defaults(this.panel.legend, this.panelDefaults.legend);
    _.defaults(this.panel.xaxis, this.panelDefaults.xaxis);

    this.processor = new DataProcessor(this.panel);

    
    var anomalyService = new AnalyticService(this.backendURL, backendSrv as BackendSrv);
    
    this.runBackendConnectivityCheck();

    this.analyticsController = new AnalyticController(this.panel, anomalyService, this.events);
    this.anomalyTypes = this.panel.anomalyTypes;
    keybindingSrv.bind('d', this.onDKey.bind(this));

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataSnapshotLoad.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));
    this.events.on('anomaly-type-alert-change', () => {
      this.$scope.$digest()
    });
    this.events.on('anomaly-type-status-change', async (anomalyType: AnalyticUnit) => {
      if(anomalyType === undefined) {
        throw new Error('anomalyType is undefined');
      }
      if(anomalyType.status === 'ready') {
        await this.analyticsController.fetchSegments(anomalyType, +this.range.from, +this.range.to);
      }
      this.render(this.seriesList);
      this.$scope.$digest();
    });
    appEvents.on('ds-request-response', data => {
      let requestConfig = data.config;
      this.datasourceRequest = {
        url: requestConfig.url,
        type: requestConfig.inspect.type,
        method: requestConfig.method,
        data: requestConfig.data,
        params: requestConfig.params
      };
    });

    this.analyticsController.fetchAnomalyTypesStatuses();

  }

  get backendURL(): string {
    if(this.templateSrv.index[BACKEND_VARIABLE_NAME] === undefined) {
      return undefined;
    }
    return this.templateSrv.index[BACKEND_VARIABLE_NAME].current.value;
  }

  async runBackendConnectivityCheck() {
    if(this.backendURL === '' || this.backendURL === undefined) {
      this.alertSrv.set(
        `Dashboard variable $${BACKEND_VARIABLE_NAME} is missing`, 
        `Please set $${BACKEND_VARIABLE_NAME}`, 
        'warning', 4000
      );
      return;
    }

    var as = new AnalyticService(this.backendURL, this.backendSrv);
    var isOK = await as.isBackendOk();
    if(!isOK) {
      this.alertSrv.set(
        'Can`t connect to Hastic server', `Hastic server: "${this.backendURL}"`, 'warning', 4000
      );
    } 
  }

  link(scope, elem, attrs, ctrl) {
    var $graphElem = $(elem[0]).find('#graphPanel');
    var $legendElem = $(elem[0]).find('#graphLegend');
    this._graphRenderer = new GraphRenderer(
      $graphElem, this.timeSrv, this.popoverSrv, this.contextSrv,this.$scope
    );
    this._graphLegend = new GraphLegend($legendElem, this.popoverSrv, this.$scope);
  }

  onInitEditMode() {
    var partialPath = this.panelPath + 'partials';
    this.addEditorTab('Analytics', `${partialPath}/tab_analytics.html`, 2);
    this.addEditorTab('Axes', axesEditorComponent, 3);
    this.addEditorTab('Legend', `${partialPath}/tab_legend.html`, 4);
    this.addEditorTab('Display', `${partialPath}/tab_display.html`, 5);

    if (config.alertingEnabled) {
      this.addEditorTab('Alert', alertTab, 6);
    }

    this.subTabIndex = 0;
  }

  onInitPanelActions(actions) {
    actions.push({ text: 'Export CSV', click: 'ctrl.exportCsv()' });
    actions.push({ text: 'Toggle legend', click: 'ctrl.toggleLegend()' });
  }

  issueQueries(datasource) {
    // this.annotationsPromise = this.annotationsSrv.getAnnotations({
    //   dashboard: this.dashboard,
    //   panel: this.panel,
    //   range: this.range,
    // });
    return super.issueQueries(datasource);
  }

  zoomOut(evt) {
    this.publishAppEvent('zoom-out', 2);
  }

  onDataSnapshotLoad(snapshotData) {
    // this.annotationsPromise = this.annotationsSrv.getAnnotations({
    //   dashboard: this.dashboard,
    //   panel: this.panel,
    //   range: this.range,
    // });
    this.onDataReceived(snapshotData);
  }

  onDataError(err) {
    this.seriesList = [];
    // this.annotations = [];
    this.render([]);
  }

  async onDataReceived(dataList) {

    this.dataList = dataList;
    this.seriesList = this.processor.getSeriesList({
      dataList: dataList,
      range: this.range,
    });

    //this.onPredictionReceived(this.seriesList);

    this.dataWarning = null;
    const hasSomePoint = this.seriesList.some(s => s.datapoints.length > 0);

    if (!hasSomePoint) {
      this.dataWarning = {
        title: 'No data points',
        tip: 'No datapoints returned from data query',
      };
    } else {
      for (let series of this.seriesList) {
        if (series.isOutsideRange) {
          this.dataWarning = {
            title: 'Data points outside time range',
            tip: 'Can be caused by timezone mismatch or missing time filter in query',
          };
          break;
        }
      }
    }

    var loadTasks = [
      // this.annotationsPromise,
      this.analyticsController.fetchAnomalyTypesSegments(+this.range.from, +this.range.to)
    ];

    var results =  await Promise.all(loadTasks);
    this.loading = false;
    // this.annotations = results[0].annotations;
    this.render(this.seriesList);

  }

  onPredictionReceived(spanList) {
    var predictions = [];
    for (var span of spanList) {
      var predictionLow = {
        target: '',
        color: '',
        datapoints: []
      };
      var predictionHigh = {
        target: '',
        color: '',
        datapoints: []
      };

      for (var datapoint of span.datapoints) {
        predictionHigh.datapoints.push([datapoint[0] + 2, datapoint[1]]);
        predictionLow.datapoints.push([datapoint[0] - 2, datapoint[1]]);
      }

      predictionHigh.target = `${span.label} high`;
      predictionLow.target = `${span.label} low`;
      predictionHigh.color = span.color;
      predictionLow.color = span.color;
      predictions.push(predictionHigh, predictionLow);
    }
    var predictionSeries = this.processor.getSeriesList({
      dataList: predictions,
      range: this.range
    });
    for (var serie of predictionSeries) {
      serie.prediction = true;
      this.seriesList.push(serie);
    }
  }

  onRender(data) {
    if (!this.seriesList) {
      return;
    }

    for (let series of this.seriesList) {
      if (series.prediction) {
        var overrideItem = _.find(
          this.panel.seriesOverrides,
          el => el.alias === series.alias
        )
        if (overrideItem !== undefined) {
          this.addSeriesOverride({
            alias: series.alias,
            linewidth: 0,
            legend: false,
            // if pointradius === 0 -> point still shows, that's why pointradius === -1
            pointradius: -1,
            fill: 3
          });
        }
      }
      series.applySeriesOverrides(this.panel.seriesOverrides);

      if (series.unit) {
        this.panel.yaxes[series.yaxis - 1].format = series.unit;
      }
    }

    if(!this.analyticsController.graphLocked) {
      this._graphLegend.render();
      this._graphRenderer.render(data);
    }
  }

  changeSeriesColor(series, color) {
    series.color = color;
    this.panel.aliasColors[series.alias] = series.color;
    this.render();
  }

  toggleSeries(serie, event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      if (this.hiddenSeries[serie.alias]) {
        delete this.hiddenSeries[serie.alias];
      } else {
        this.hiddenSeries[serie.alias] = true;
      }
    } else {
      this.toggleSeriesExclusiveMode(serie);
    }
    this.render();
  }

  toggleSeriesExclusiveMode(serie) {
    var hidden = this.hiddenSeries;

    if (hidden[serie.alias]) {
      delete hidden[serie.alias];
    }

    // check if every other series is hidden
    var alreadyExclusive = _.every(this.seriesList, value => {
      if (value.alias === serie.alias) {
        return true;
      }

      return hidden[value.alias];
    });

    if (alreadyExclusive) {
      // remove all hidden series
      _.each(this.seriesList, value => {
        delete this.hiddenSeries[value.alias];
      });
    } else {
      // hide all but this serie
      _.each(this.seriesList, value => {
        if (value.alias === serie.alias) {
          return;
        }

        this.hiddenSeries[value.alias] = true;
      });
    }
  }

  toggleAxis(info) {
    var override = _.find(this.panel.seriesOverrides, { alias: info.alias });
    if (!override) {
      override = { alias: info.alias };
      this.panel.seriesOverrides.push(override);
    }
    info.yaxis = override.yaxis = info.yaxis === 2 ? 1 : 2;
    this.render();
  }

  addSeriesOverride(override) {
    this.panel.seriesOverrides.push(override || {});
  }

  removeSeriesOverride(override) {
    this.panel.seriesOverrides = _.without(this.panel.seriesOverrides, override);
    this.render();
  }

  toggleLegend() {
    this.panel.legend.show = !this.panel.legend.show;
    this.refresh();
  }

  legendValuesOptionChanged() {
    var legend = this.panel.legend;
    legend.values = legend.min || legend.max || legend.avg || legend.current || legend.total;
    this.render();
  }

  exportCsv() {
    var scope = this.$scope.$new(true);
    scope.seriesList = this.seriesList;
    this.publishAppEvent('show-modal', {
      templateHtml: '<export-data-modal data="seriesList"></export-data-modal>',
      scope,
      modalClass: 'modal--narrow',
    });
  }

  // getAnnotationsByTag(tag) {
  //   var res = [];
  //   for (var annotation of this.annotations) {
  //     if (annotation.tags.indexOf(tag) >= 0) {
  //       res.push(annotation);
  //     }
  //   }
  //   return res;
  // }

  // get annotationTags() {
  //   var res = [];
  //   for (var annotation of this.annotations) {
  //     for (var tag of annotation.tags) {
  //       if (res.indexOf(tag) < 0) {
  //         res.push(tag);
  //       }
  //     }
  //   }
  //   return res;
  // }

  get panelPath() {
    if (this._panelPath === undefined) {
      this._panelPath = '/public/plugins/' + this.pluginId + '/';
    }
    return this._panelPath;
  }

  createNew() {
    this.analyticsController.createNew();
  }

  async saveNew() {
    this.refresh();
    await this.analyticsController.saveNew(
      new MetricExpanded(this.panel.datasource, this.panel.targets),
      this.datasourceRequest,
      this.panel.id
    );
    this.$scope.$digest();
    this.render(this.seriesList);
  }

  onColorChange(id: AnalyticUnitId, value: string) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    this.analyticsController.onAnalyticUnitColorChange(id, value);
    this.render();
  }

  onRemove(id: AnalyticUnitId) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    this.analyticsController.removeAnalyticUnit(id);
    this.render();
  }

  onCancelLabeling(key) {
    this.$scope.$root.appEvent('confirm-modal', {
      title: 'Clear anomaly labeling',
      text2: 'Your changes will be lost.',
      yesText: 'Clear',
      icon: 'fa-warning',
      altActionText: 'Save',
      onAltAction: () => {
        this.onToggleLabelingMode(key);
      },
      onConfirm: () => {
        this.analyticsController.undoLabeling();
        this.render();
      },
    });
  }

 async onToggleLabelingMode(key) {
    await this.analyticsController.toggleAnomalyTypeLabelingMode(key as AnalyticUnitId);
    this.$scope.$digest();
    this.render();
  }

  onDKey() {
    if(!this.analyticsController.labelingMode) {
      return;
    }
    this.analyticsController.toggleDeleteMode();
  }

  onAnomalyAlertChange(anomalyType: AnalyticUnit) {
    this.analyticsController.toggleAlertEnabled(anomalyType);
  }

  onToggleVisibility(id: AnalyticUnitId) {
    this.analyticsController.toggleVisibility(id);
    this.render();
  }

  get renderError(): boolean { return this._renderError; }
  set renderError(value: boolean) { this._renderError = value; }
}

export { GraphCtrl, GraphCtrl as PanelCtrl };
