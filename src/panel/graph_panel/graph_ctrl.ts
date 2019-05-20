import './series_overrides_ctrl';

import template from './template.html';

import { GraphRenderer } from './graph_renderer';
import { GraphLegend } from './graph_legend';
import { DataProcessor } from './data_processor';
import { MetricExpanded } from './models/metric';
import { DatasourceRequest } from './models/datasource';
import { AnalyticUnitId, AnalyticUnit, LabelingMode } from './models/analytic_units/analytic_unit';
import { AnalyticService } from './services/analytic_service';
import { AnalyticController } from './controllers/analytic_controller';
import { HasticPanelInfo } from './models/hastic_panel_info';

import { axesEditorComponent } from './axes_editor';

import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import { appEvents } from 'grafana/app/core/core'
import { BackendSrv } from 'grafana/app/core/services/backend_srv';

import _ from 'lodash';


class GraphCtrl extends MetricsPanelCtrl {
  static template = template;

  analyticService: AnalyticService;
  hiddenSeries: any = {};
  seriesList: any = [];
  dataList: any = [];

  // annotations: any = [];

  private _datasourceRequest: DatasourceRequest;
  private _datasources: any;

  private _renderError: boolean = false;

  // annotationsPromise: any;
  dataWarning: any;
  colors: any = [];
  subTabIndex: number;
  processor: DataProcessor;

  analyticsController: AnalyticController;

  _graphRenderer: GraphRenderer;
  _graphLegend: GraphLegend;

  _panelInfo: HasticPanelInfo;

  private _analyticUnitTypes: any;
  private _hasticDatasources: any[];

  private $graphElem: any;
  private $legendElem: any;

  private _grafanaUrl: string;
  private _panelId: string;

  private _dataTimerange: {
    from?: number,
    to?: number
  };

  panelDefaults = {
    // datasource name, null = default datasource
    datasource: null,
    hasticDatasource: null,
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
    seriesOverrides: []
  };

  /** @ngInject */
  constructor(
    $scope, $injector, private $http,
    private annotationsSrv,
    private backendSrv: BackendSrv,
    private popoverSrv,
    private contextSrv
) {
    super($scope, $injector);

    _.defaults(this.panel, this.panelDefaults);
    _.defaults(this.panel.tooltip, this.panelDefaults.tooltip);
    _.defaults(this.panel.legend, this.panelDefaults.legend);
    _.defaults(this.panel.xaxis, this.panelDefaults.xaxis);

    // because of https://github.com/hastic/hastic-grafana-app/issues/162
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

    const grafanaUrlRegex = /^(.+)\/d/;
    const parsedUrl = window.location.href.match(grafanaUrlRegex);
    if(parsedUrl !== null) {
      this._grafanaUrl = parsedUrl[1];
    } else {
      throw new Error('Cannot parse grafana url');
    }

    this._panelId = `${this.dashboard.uid}/${this.panel.id}`;
    this._datasources = {};
  }

  rebindKeys() {
    const dKeyCode = 68;
    const uKeyCode = 85;

    $(document).off('keydown.hasticDKey');
    $(document).on('keydown.hasticDKey', (e) => {
      if(e.keyCode === dKeyCode) {
        this.onDKey();
      }
    });

    $(document).off('keydown.hasticUKey');
    $(document).on('keydown.hasticUKey', (e) => {
      if(e.keyCode === uKeyCode) {
        this.onUKey();
      }
    });
  }

  editPanel() {
    super.editPanel();
    this.rebindKeys();
  }

  get hasticDatasource(): { url: string, name: string } | undefined {
    const hasticDatasourceId = this.panel.hasticDatasource;
    if(hasticDatasourceId !== undefined && hasticDatasourceId !== null) {
      const hasticDatasource = _.find(this._hasticDatasources, { id: hasticDatasourceId });
      if(hasticDatasource === undefined) {
        return undefined;
      }
      let url = hasticDatasource.url;
      if(hasticDatasource.access === 'proxy') {
        url = `api/datasources/proxy/${hasticDatasource.id}`;
      }
      return {
        url,
        name: hasticDatasource.name
      };
    }
    return undefined;
  }

  async updateAnalyticUnitTypes() {
    const analyticUnitTypes = await this.analyticService.getAnalyticUnitTypes();
    this._analyticUnitTypes = analyticUnitTypes;
    this.$scope.$digest();
  }

  get analyticUnitTypes() {
    return this._analyticUnitTypes;
  }

  get analyticUnitDetectorTypes() {
    return _.keys(this._analyticUnitTypes);
  }

  async runDatasourceConnectivityCheck() {
    try {
      const connected = await this.analyticService.isDatasourceOk();
      if(connected) {
        this.updateAnalyticUnitTypes();
        appEvents.emit(
          'alert-success',
          [
            'Connected to Hastic Datasource',
            `Hastic datasource URL: "${this.analyticService.hasticDatasourceURL}"`
          ]
        );
      }
    }
    catch(err) {
      console.error(err);
    }
  }

  async link(scope, elem, attrs, ctrl) {
    this.$graphElem = $(elem[0]).find('#graphPanel');
    this.$legendElem = $(elem[0]).find('#graphLegend');

    this.onHasticDatasourceChange();

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataSnapshotLoad.bind(this));
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));

    this.events.on('analytic-unit-status-change', async (analyticUnit: AnalyticUnit) => {
      if(analyticUnit === undefined) {
        throw new Error('analyticUnit is undefined');
      }
      if(analyticUnit.status === '404') {
        await this.analyticsController.removeAnalyticUnit(analyticUnit.id, true);
      }
      this.refresh();
    });

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
  }

  onInitEditMode() {

    this.rebindKeys(); // a small hask: bind if we open page in edit mode

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

  async onHasticDatasourceChange() {
    this.processor = new DataProcessor(this.panel);

    await this._fetchHasticDatasources();
    const hasticDatasource = this.hasticDatasource;
    if(hasticDatasource === undefined) {
      delete this.analyticService;
    } else {
      this.analyticService = new AnalyticService(hasticDatasource.url, this.$http);
      this.runDatasourceConnectivityCheck();
    }

    this.analyticsController = new AnalyticController(this._grafanaUrl, this._panelId, this.panel, this.events, this.analyticService);

    this._updatePanelInfo();
    this.analyticsController.updateServerInfo();

    this._graphRenderer = new GraphRenderer(
      this.$graphElem, this.timeSrv, this.contextSrv, this.$scope, this.analyticsController
    );
    this._graphLegend = new GraphLegend(this.$legendElem, this.popoverSrv, this.$scope, this.analyticsController);
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
    this.loading = true;

    const { from, to } = this.rangeTimestamp;

    if(this.analyticsController !== undefined) {
      const hsrSeries = await this.analyticsController.getHSRSeries(from, to);
      this.dataList = _.concat(this.dataList, hsrSeries);
    }
    this.seriesList = this.processor.getSeriesList({
      dataList: this.dataList,
      range: this.range,
    });

    this.dataWarning = null;
    const hasSomePoint = this.seriesList.some(s => s.datapoints.length > 0);

    if(!hasSomePoint) {
      this.dataWarning = {
        title: 'No data points',
        tip: 'No datapoints returned from data query',
      };
    } else {
      for(let series of this.seriesList) {
        if(series.isOutsideRange) {
          this.dataWarning = {
            title: 'Data points outside time range',
            tip: 'Can be caused by timezone mismatch or missing time filter in query',
          };
          break;
        }
        const from = _.find(series.datapoints, datapoint => datapoint[0] !== null);
        const to = _.findLast(series.datapoints, datapoint => datapoint[0] !== null);

        this._dataTimerange = {};
        if(from !== undefined && to !== undefined) {
          this._dataTimerange = { from: from[1], to: to[1] };
        }
      }
    }

    if(this.analyticsController !== undefined) {
      await this.analyticsController.fetchAnalyticUnitsSegments(from, to);
      // TODO: make statuses and detection spans connected
      this.analyticsController.fetchAnalyticUnitsStatuses();
      this.analyticsController.stopAnalyticUnitsDetectionsFetching();
      // TODO: re-run detection waiters if this._dataTimerange is changed
      this.analyticsController.fetchAnalyticUnitsDetections(
        this._dataTimerange.from,
        this._dataTimerange.to
      );
      this.render(this.seriesList);
    }

    this.loading = false;
  }

  onRender() {
    if(!this.seriesList) {
      return;
    }

    for(let series of this.seriesList) {
      if (series.unit) {
        this.panel.yaxes[series.yaxis - 1].format = series.unit;
      }
    }

    if(!this.analyticsController.graphLocked) {
      this._graphRenderer.render(this.seriesList);
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

  get pluginPath() {
    return 'public/plugins/corpglory-hastic-app';
  }

  get panelPath() {
    return this.pluginPath + '/panel/graph_panel';
  }

  createNew() {
    this.analyticsController.createNew();
  }

  cancelCreation() {
    this.analyticsController.cancelCreation();
  }

  redetectAll() {
    this.analyticsController.redetectAll();
  }

  async runDetectInCurrentRange(analyticUnitId: AnalyticUnitId) {
    const { from, to } = this.rangeTimestamp;

    this.analyticsController.runDetect(
      analyticUnitId,
      from, to
    );
  }

  async saveNew() {
    try {
      const datasource = await this._getDatasourceRequest();

      await this.analyticsController.saveNew(
        new MetricExpanded(this.panel.datasource, this.panel.targets),
        datasource
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

  async onAnalyticUnitAlertChange(analyticUnit: AnalyticUnit) {
    await this.analyticsController.toggleAnalyticUnitAlert(analyticUnit);
  }

  onAnalyticUnitChange(analyticUnit: AnalyticUnit) {
    this.analyticsController.toggleAnalyticUnitChange(analyticUnit, true);
  }

  async onAnalyticUnitSave(analyticUnit: AnalyticUnit) {
    await this.analyticsController.saveAnalyticUnit(analyticUnit);
    this.refresh();
  }

  async onColorChange(id: AnalyticUnitId, deleted: boolean, value: string) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    await this.analyticsController.onAnalyticUnitColorChange(id, value, deleted);
    this.refresh();
  }

  async onRemove(id: AnalyticUnitId) {
    if(id === undefined) {
      throw new Error('id is undefined');
    }
    await this.analyticsController.removeAnalyticUnit(id);
    this.refresh();
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
    await this.analyticsController.toggleAnalyticUnitLabelingMode(id, metric, datasource);
    this.$scope.$digest();
    this.render();
  }

  onDKey() {
    if(!this.analyticsController.inLabelingMode) {
      return;
    }
    this.analyticsController.toggleLabelingMode(LabelingMode.DELETING);
    this.refresh();
  }

  onUKey() {
    if(!this.analyticsController.inLabelingMode) {
      return;
    }
    this.analyticsController.toggleLabelingMode(LabelingMode.UNLABELING);
    this.refresh();
  }

  onToggleVisibility(id: AnalyticUnitId) {
    this.analyticsController.toggleVisibility(id);
    this.refresh();
  }

  onToggleInspect(id: AnalyticUnitId) {
    this.analyticsController.toggleInspect(id);
    this.refresh();
  }

  onSeasonalityChange(id: AnalyticUnitId, value?: number) {
    this.analyticsController.updateSeasonality(id, value);
    this.refresh();
  }

  private async _updatePanelInfo() {
    let datasource = undefined;
    if(this.panel.datasource) {
      datasource = await this._getDatasourceByName(this.panel.datasource);
    }

    const hasticDatasource = this.hasticDatasource;

    let grafanaVersion = 'unknown';
    if(_.has(window, 'grafanaBootData.settings.buildInfo.version')) {
      grafanaVersion = window.grafanaBootData.settings.buildInfo.version;
    }
    this._panelInfo = {
      grafanaVersion,
      grafanaUrl: window.location.host,
      datasourceName: datasource === undefined ? 'unknown' : datasource.name,
      datasourceType: datasource === undefined ? 'unknown' : datasource.type,
      hasticDatasourceName: hasticDatasource === undefined || datasource === undefined ? 'unknown' : hasticDatasource.name,
      hasticDatasourceUrl: hasticDatasource === undefined ? 'unknown' : hasticDatasource.url
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
    if(this._datasources[name] === undefined) {
      if(name === null) {
        // Default datasource has null name
        const datasources = await this.backendSrv.get(`api/datasources`);
        this._datasources[name] = _.find(datasources, datasource => datasource.isDefault);
        if(this._datasources[name] === undefined) {
          throw new Error('No default datasource found');
        }
      } else {
        this._datasources[name] = await this.backendSrv.get(`api/datasources/name/${name}`);
      }
    }
    return this._datasources[name];
  }

  private async _fetchHasticDatasources() {
    this._hasticDatasources = await this.backendSrv.get('api/datasources');
    this._hasticDatasources = this._hasticDatasources.filter(ds => ds.type === 'corpglory-hastic-datasource');
    this.$scope.$digest();
  }

  get rangeTimestamp(): { from: number, to: number } {
    if(this.range === undefined) {
      this.updateTimeRange();
    }

    return {
      from: +this.range.from,
      to: +this.range.to
    };
  }

  get hasticDatasources() {
    return this._hasticDatasources;
  }

  get panelInfo() {
    return this._panelInfo;
  }

  get renderError(): boolean { return this._renderError; }
  set renderError(value: boolean) { this._renderError = value; }
}

export { GraphCtrl, GraphCtrl as PanelCtrl };
