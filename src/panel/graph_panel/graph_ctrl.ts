import './series_overrides_ctrl';

import template from './template.html';

import { GraphRenderer } from './graph_renderer';
import { GraphLegend } from './graph_legend';
import { DataProcessor } from './data_processor';
import { MetricExpanded } from './models/metric';
import { DatasourceRequest } from './models/datasource';
import { AnalyticUnitId, AnalyticUnit } from './models/analytic_unit';
import { AnalyticService } from './services/analytic_service';
import { AnalyticController } from './controllers/analytic_controller';
import { PanelInfo } from './models/info';

import { axesEditorComponent } from './axes_editor';

import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import { appEvents } from 'grafana/app/core/core'
import { BackendSrv } from 'grafana/app/core/services/backend_srv';


import _ from 'lodash';

const BACKEND_VARIABLE_NAME = 'HASTIC_SERVER_URL';


class GraphCtrl extends MetricsPanelCtrl {
  static template = template;

  analyticService: AnalyticService;
  hiddenSeries: any = {};
  seriesList: any = [];
  dataList: any = [];

  _backendUrl: string = undefined;
  // annotations: any = [];

  private _datasourceRequest: DatasourceRequest;
  private _datasources: any;

  private _panelPath: any;
  private _renderError: boolean = false;

  // annotationsPromise: any;
  dataWarning: any;
  colors: any = [];
  subTabIndex: number;
  processor: DataProcessor;

  analyticsController: AnalyticController;

  _graphRenderer: GraphRenderer;
  _graphLegend: GraphLegend;

  _panelInfo: PanelInfo;

  private _analyticUnitTypes: any;

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
    thresholds: []
  };

  /** @ngInject */
  constructor(
    $scope, $injector, private $http,
    private annotationsSrv,
    private keybindingSrv,
    private backendSrv: BackendSrv,
    private popoverSrv,
    private contextSrv
) {
    super($scope, $injector);

    _.defaults(this.panel, this.panelDefaults);
    _.defaults(this.panel.tooltip, this.panelDefaults.tooltip);
    _.defaults(this.panel.legend, this.panelDefaults.legend);
    _.defaults(this.panel.xaxis, this.panelDefaults.xaxis);



  }

  bindDKey() {
    this.keybindingSrv.bind('d', this.onDKey.bind(this));
  }

  editPanel() {
    super.editPanel();
    this.bindDKey();
  }

  async getBackendURL(): Promise<string> {
    if(this._backendUrl !== undefined) {
      return this._backendUrl;
    }
    var data = await this.backendSrv.get('/api/plugins/hastic-app/settings');
    if(data.jsonData === undefined) {
      return undefined;
    }
    let val = data.jsonData.hasticServerUrl;
    if(val === undefined) {
      return undefined;
    }
    val = val.replace(/\/+$/, "");
    return val;
  }

  async updateAnalyticUnitTypes() {
    const analyticUnitTypes = await this.analyticService.getAnalyticUnitTypes();
    this._analyticUnitTypes = analyticUnitTypes;
  }

  get analyticUnitTypes() {
    return this._analyticUnitTypes;
  }

  get analyticUnitDetectorTypes() {
    return _.keys(this._analyticUnitTypes);
  }

  async runBackendConnectivityCheck() {
    let backendURL = await this.getBackendURL();
    if(backendURL === '' || backendURL === undefined) {
      appEvents.emit(
        'alert-warning',
        [
          `hasticServerUrl is missing`,
          `Please set it in config`
        ]
      );
      return;
    }

    let connected = await this.analyticService.isBackendOk();
    if(connected) {
      this.updateAnalyticUnitTypes();
      appEvents.emit(
        'alert-success',
        [
          'Connected to Hastic server',
          `Hastic server: "${backendURL}"`
        ]
      );
    }
  }

  async link(scope, elem, attrs, ctrl) {

    this.processor = new DataProcessor(this.panel);

    let backendURL = await this.getBackendURL();
    this.analyticService = new AnalyticService(backendURL, this.$http);

    this.runBackendConnectivityCheck();

    this.analyticsController = new AnalyticController(this.panel, this.analyticService, this.events);

    this.bindDKey();

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataSnapshotLoad.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));

    this.events.on('analytic-unit-status-change', async (analyticUnit: AnalyticUnit) => {
      if(analyticUnit === undefined) {
        throw new Error('analyticUnit is undefined');
      }
      if(analyticUnit.status === '404') {
        await this.analyticsController.removeAnalyticUnit(analyticUnit.id, true);
      }
      if(analyticUnit.status === 'READY') {
        await this.analyticsController.fetchSegments(analyticUnit, +this.range.from, +this.range.to);
      }
      this.render(this.seriesList);
      this.$scope.$digest();
    });

    this._datasources = {};

    appEvents.on('ds-request-response', data => {
      let requestConfig = data.config;

      this._datasourceRequest = {
        url: requestConfig.url,
        method: requestConfig.method,
        data: requestConfig.data,
        params: requestConfig.params,
        type: undefined
      };
    });

    this.analyticsController.fetchAnalyticUnitsStatuses();


    var $graphElem = $(elem[0]).find('#graphPanel');
    var $legendElem = $(elem[0]).find('#graphLegend');
    this._graphRenderer = new GraphRenderer(
      $graphElem, this.timeSrv, this.popoverSrv, this.contextSrv, this.$scope
    );
    this._graphLegend = new GraphLegend($legendElem, this.popoverSrv, this.$scope);
  }

  onInitEditMode() {
    this._updatePanelInfo();
    this.analyticsController.updateServerInfo();

    const partialPath = this.panelPath + '/partials';
    this.addEditorTab('Analytics', `${partialPath}/tab_analytics.html`, 2);
    this.addEditorTab('Webhooks', `${partialPath}/tab_webhooks.html`, 3);
    this.addEditorTab('Axes', axesEditorComponent, 4);
    this.addEditorTab('Legend', `${partialPath}/tab_legend.html`, 5);
    this.addEditorTab('Display', `${partialPath}/tab_display.html`, 6);
    this.addEditorTab('Hastic info', `${partialPath}/tab_info.html`, 7);

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
      this.analyticsController.fetchAnalyticUnitsSegments(+this.range.from, +this.range.to)
    ];

    var results =  await Promise.all(loadTasks);
    this.loading = false;
    // this.annotations = results[0].annotations;
    this.render(this.seriesList);

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
      this._graphRenderer.render(data);
      this._graphLegend.render();
      this._graphRenderer.renderPanel();
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
    var override: any = _.find(this.panel.seriesOverrides, { alias: info.alias });
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
      this._panelPath = 'public/plugins/hastic-app/panel/graph_panel';
    }
    return this._panelPath;
  }

  createNew() {
    this.analyticsController.createNew();
  }

  async saveNew() {
    try {
      const panelId = this.panel.id;
      const panelUrl = window.location.origin + window.location.pathname + `?panelId=${panelId}`;

      const datasource = await this._getDatasourceRequest();

      await this.analyticsController.saveNew(
        new MetricExpanded(this.panel.datasource, this.panel.targets),
        datasource,
        panelUrl
      );
    } catch(e) {
      appEvents.emit(
        'alert-error',
        [
          'Error while saving analytic unit',
          e.message
        ]
      );
    }
    this.$scope.$digest();
    this.render(this.seriesList);
  }

  onAnalyticUnitAlertChange(analyticUnit: AnalyticUnit) {
    this.analyticsController.toggleAnalyticUnitAlert(analyticUnit);
  }

  onAnalyticUnitNameChange(analyticUnit: AnalyticUnit) {
    this.analyticsController.fetchAnalyticUnitName(analyticUnit);
  }

  onColorChange(id: AnalyticUnitId, value: string) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    this.analyticsController.onAnalyticUnitColorChange(id, value);
    this.render();
  }

  async onRemove(id: AnalyticUnitId) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    await this.analyticsController.removeAnalyticUnit(id);
    this.render();
  }

  onCancelLabeling(id: AnalyticUnitId) {
    this.$scope.$root.appEvent('confirm-modal', {
      title: 'Clear labeling',
      text2: 'Your changes will be lost.',
      yesText: 'Clear',
      icon: 'fa-warning',
      altActionText: 'Save',
      onAltAction: () => {
        this.onToggleLabelingMode(id);
      },
      onConfirm: () => {
        this.analyticsController.undoLabeling();
        this.render();
      },
    });
  }

  async onToggleLabelingMode(id: AnalyticUnitId) {
    this.refresh();
    const datasource = await this._getDatasourceRequest();
    const metric = new MetricExpanded(this.panel.datasource, this.panel.targets);
    await this.analyticsController.toggleUnitTypeLabelingMode(id, metric, datasource);
    this.$scope.$digest();
    this.render();
  }

  onDKey() {
    if(!this.analyticsController.labelingMode) {
      return;
    }
    this.analyticsController.toggleDeleteMode();
    this.refresh();
  }

  onToggleVisibility(id: AnalyticUnitId) {
    this.analyticsController.toggleVisibility(id);
    this.render();
  }

  private async _updatePanelInfo() {
    const datasource = await this._getDatasourceByName(this.panel.datasource);
    const backendUrl = await this.getBackendURL();

    this._panelInfo = {
      grafanaVersion: this.contextSrv.version,
      grafanaUrl: window.location.host,
      datasourceType: datasource.type,
      hasticServerUrl: backendUrl
    };
  }

  private async _getDatasourceRequest() {
    if(this._datasourceRequest.type === undefined) {
      const datasource = await this._getDatasourceByName(this.panel.datasource);
      this._datasourceRequest.type = datasource.type;
    }
    return this._datasourceRequest;
  }

  private async _getDatasourceByName(name: string) {
    if(name === null) {
      throw new Error('Trying to get datasource with NULL name');
    }
    if(this._datasources[name] === undefined) {
      const datasource = await this.backendSrv.get(`/api/datasources/name/${name}`);
      return datasource;
    } else {
      return this._datasources[name];
    }
  }

  get panelInfo() {
    return this._panelInfo;
  }

  get renderError(): boolean { return this._renderError; }
  set renderError(value: boolean) { this._renderError = value; }
}

export { GraphCtrl, GraphCtrl as PanelCtrl };
