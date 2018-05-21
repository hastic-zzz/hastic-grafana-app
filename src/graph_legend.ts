import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from 'jquery';
import _ from 'lodash';


export class GraphLegend {
  firstRender = true;
  ctrl: any;
  panel: any;
  data;
  seriesList;
  legendScrollbar;

  constructor(private $elem: JQuery<HTMLElement>, private popoverSrv, private scope) {
    this.ctrl = scope.ctrl;
    this.panel = this.ctrl.panel;
    scope.$on('$destroy', () => {
      if (this.legendScrollbar) {
        this.legendScrollbar.destroy();
      }
    });
  }

  getSeriesIndexForElement(el) {
    return el.parents('[data-series-index]').data('series-index');
  }

  openColorSelector(e) {
    // if we clicked inside poup container ignore click
    if ($(e.target).parents('.popover').length) {
      return;
    }

    var el = $(e.currentTarget).find('.fa-minus');
    var index = this.getSeriesIndexForElement(el);
    var series = this.seriesList[index];
    
    this.popoverSrv.show({
      element: el[0],
      position: 'bottom left',
      targetAttachment: 'top left',
      template:
        '<series-color-picker series="series" onToggleAxis="toggleAxis" onColorChange="colorSelected"/>',
      openOn: 'hover',
      model: {
        series: series,
        toggleAxis: () => {
          this.ctrl.toggleAxis(series);
        },
        colorSelected: color => {
          this.ctrl.changeSeriesColor(series, color);
        },
      },
    });
    
  }

  toggleSeries(e) {
    var el = $(e.currentTarget);
    var index = this.getSeriesIndexForElement(el);
    var seriesInfo = this.seriesList[index];
    var scrollPosition = this.$elem.find('tbody').scrollTop();
    this.ctrl.toggleSeries(seriesInfo, e);
    this.$elem.find('tbody').scrollTop(scrollPosition);
  }

  sortLegend(e) {
    var el = $(e.currentTarget);
    var stat = el.data('stat');

    if (stat !== this.panel.legend.sort) {
      this.panel.legend.sortDesc = null;
    }

    // if already sort ascending, disable sorting
    if (this.panel.legend.sortDesc === false) {
      this.panel.legend.sort = null;
      this.panel.legend.sortDesc = null;
      this.ctrl.render();
      return;
    }

    this.panel.legend.sortDesc = !this.panel.legend.sortDesc;
    this.panel.legend.sort = stat;
    this.ctrl.render();
  }

  getTableHeaderHtml(statName) {
    if (!this.panel.legend[statName]) {
      return '';
    }
    var html = '<th class="pointer" data-stat="' + statName + '">' + statName;

    if (this.panel.legend.sort === statName) {
      var cssClass = this.panel.legend.sortDesc ? 'fa fa-caret-down' : 'fa fa-caret-up';
      html += ' <span class="' + cssClass + '"></span>';
    }

    return html + '</th>';
  }

  render() {
    this.data = this.ctrl.seriesList;
    if (!this.ctrl.panel.legend.show) {
      this.$elem.empty();
      this.firstRender = true;
      return;
    }

    if (this.firstRender) {
      this.$elem.on('click', '.graph-legend-icon', this.openColorSelector.bind(this));
      this.$elem.on('click', '.graph-legend-alias', this.toggleSeries.bind(this));
      this.$elem.on('click', 'th', this.sortLegend.bind(this));
      this.firstRender = false;
    }

    this.seriesList = this.data;

    this.$elem.empty();

    // Set min-width if side style and there is a value, otherwise remove the CSS propery
    var width = this.panel.legend.rightSide && this.panel.legend.sideWidth ? this.panel.legend.sideWidth + 'px' : '';
    this.$elem.css('min-width', width);

    this.$elem.toggleClass('graph-legend-table', this.panel.legend.alignAsTable === true);

    var tableHeaderElem;
    if (this.panel.legend.alignAsTable) {
      var header = '<tr>';
      header += '<th colspan="2" style="text-align:left"></th>';
      if (this.panel.legend.values) {
        header += this.getTableHeaderHtml('min');
        header += this.getTableHeaderHtml('max');
        header += this.getTableHeaderHtml('avg');
        header += this.getTableHeaderHtml('current');
        header += this.getTableHeaderHtml('total');
      }
      header += '</tr>';
      tableHeaderElem = $(header);
    }

    if (this.panel.legend.sort) {
      this.seriesList = _.sortBy(this.seriesList, function(series) {
        return series.stats[this.panel.legend.sort];
      });
      if (this.panel.legend.sortDesc) {
        this.seriesList = this.seriesList.reverse();
      }
    }

    // render first time for getting proper legend height
    if (!this.panel.legend.rightSide) {
      this.renderLegendElement(tableHeaderElem);
      this.$elem.empty();
    }

    this.renderLegendElement(tableHeaderElem);
  }

  renderSeriesLegendElements() {
    let seriesElements = [];
    for (let i = 0; i < this.seriesList.length; i++) {
      var series = this.seriesList[i];

      if (series.hideFromLegend(this.panel.legend)) {
        continue;
      }

      var html = '<div class="graph-legend-series';

      if (series.yaxis === 2) {
        html += ' graph-legend-series--right-y';
      }
      if (this.ctrl.hiddenSeries[series.alias]) {
        html += ' graph-legend-series-hidden';
      }
      html += '" data-series-index="' + i + '">';
      html += '<div class="graph-legend-icon">';
      html += '<i class="fa fa-minus pointer" style="color:' + series.color + '"></i>';
      html += '</div>';

      html +=
        '<a class="graph-legend-alias pointer" title="' + series.aliasEscaped + '">' + series.aliasEscaped + '</a>';

      if (this.panel.legend.values) {
        var avg = series.formatValue(series.stats.avg);
        var current = series.formatValue(series.stats.current);
        var min = series.formatValue(series.stats.min);
        var max = series.formatValue(series.stats.max);
        var total = series.formatValue(series.stats.total);

        if (this.panel.legend.min) {
          html += '<div class="graph-legend-value min">' + min + '</div>';
        }
        if (this.panel.legend.max) {
          html += '<div class="graph-legend-value max">' + max + '</div>';
        }
        if (this.panel.legend.avg) {
          html += '<div class="graph-legend-value avg">' + avg + '</div>';
        }
        if (this.panel.legend.current) {
          html += '<div class="graph-legend-value current">' + current + '</div>';
        }
        if (this.panel.legend.total) {
          html += '<div class="graph-legend-value total">' + total + '</div>';
        }
      }

      html += '</div>';
      seriesElements.push($(html));
    }
    return seriesElements;
  }

  renderLegendElement(tableHeaderElem) {
    var seriesElements = this.renderSeriesLegendElements();

    if (this.panel.legend.alignAsTable) {
      var tbodyElem = $('<tbody></tbody>');
      tbodyElem.append(tableHeaderElem);
      tbodyElem.append(seriesElements);
      this.$elem.append(tbodyElem);
    } else {
      this.$elem.append(seriesElements);
    }

    if (!this.panel.legend.rightSide) {
      this.addScrollbar();
    } else {
      this.destroyScrollbar();
    }
  }

  addScrollbar() {
    const scrollbarOptions = {
      // Number of pixels the content height can surpass the container height without enabling the scroll bar.
      scrollYMarginOffset: 2,
      suppressScrollX: true,
    };

    if (!this.legendScrollbar) {
      this.legendScrollbar = new PerfectScrollbar(this.$elem[0], scrollbarOptions);
    } else {
      this.legendScrollbar.update();
    }
  }

  destroyScrollbar() {
    if (this.legendScrollbar) {
      this.legendScrollbar.destroy();
    }
  }
}
