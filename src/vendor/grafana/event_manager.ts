import _ from 'lodash';
import moment from 'moment';
import tinycolor from 'tinycolor2';
import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import { AnnotationEvent } from './event';
import {
  DEFAULT_ANNOTATION_COLOR,
  OK_COLOR,
  ALERTING_COLOR,
  NO_DATA_COLOR,
  REGION_FILL_ALPHA
} from './colors';

export class EventManager {
  event: AnnotationEvent;
  editorOpen: boolean;

  constructor(private panelCtrl: MetricsPanelCtrl) { }

  editorClosed() {
    this.event = null;
    this.editorOpen = false;
    this.panelCtrl.render();
  }

  editorOpened() {
    this.editorOpen = true;
  }

  updateTime(range) {
    if (!this.event) {
      this.event = new AnnotationEvent();
      this.event.dashboardId = this.panelCtrl.dashboard.id;
      this.event.panelId = this.panelCtrl.panel.id;
    }

    // update time
    this.event.time = moment(range.from);
    this.event.isRegion = false;
    if (range.to) {
      this.event.timeEnd = moment(range.to);
      this.event.isRegion = true;
    }

    this.panelCtrl.render();
  }

  editEvent(event, elem?) {
    this.event = event;
    this.panelCtrl.render();
  }

  addFlotEvents(annotations, flotOptions) {
    if (!this.event && annotations.length === 0) {
      return;
    }

    var types = {
      $__alerting: {
        color: ALERTING_COLOR,
        position: 'BOTTOM',
        markerSize: 5,
      },
      $__ok: {
        color: OK_COLOR,
        position: 'BOTTOM',
        markerSize: 5,
      },
      $__no_data: {
        color: NO_DATA_COLOR,
        position: 'BOTTOM',
        markerSize: 5,
      },
      $__editing: {
        color: DEFAULT_ANNOTATION_COLOR,
        position: 'BOTTOM',
        markerSize: 5,
      },
    };

    if (this.event) {
      if (this.event.isRegion) {
        annotations = [
          {
            isRegion: true,
            min: this.event.time.valueOf(),
            timeEnd: this.event.timeEnd.valueOf(),
            text: this.event.text,
            eventType: '$__editing',
            editModel: this.event,
          },
        ];
      } else {
        annotations = [
          {
            min: this.event.time.valueOf(),
            text: this.event.text,
            editModel: this.event,
            eventType: '$__editing',
          },
        ];
      }
    } else {
      // annotations from query
      for (var i = 0; i < annotations.length; i++) {
        var item = annotations[i];

        // add properties used by jquery flot events
        item.min = item.time;
        item.max = item.time;
        item.eventType = item.source.name;

        if (item.newState) {
          item.eventType = '$__' + item.newState;
          continue;
        }

        if (!types[item.source.name]) {
          types[item.source.name] = {
            color: item.source.iconColor,
            position: 'BOTTOM',
            markerSize: 5,
          };
        }
      }
    }

    let regions = getRegions(annotations);
    addRegionMarking(regions, flotOptions);

    let eventSectionHeight = 20;
    let eventSectionMargin = 7;
    flotOptions.grid.eventSectionHeight = eventSectionMargin;
    flotOptions.xaxis.eventSectionHeight = eventSectionHeight;

    flotOptions.events = {
      levels: _.keys(types).length + 1,
      data: annotations,
      types: types,
      manager: this,
    };
  }
}

function getRegions(events) {
  return _.filter(events, 'isRegion');
}

function addRegionMarking(regions, flotOptions) {
  let markings = flotOptions.grid.markings;
  let defaultColor = DEFAULT_ANNOTATION_COLOR;
  let fillColor;

  _.each(regions, region => {
    if (region.source) {
      fillColor = region.source.iconColor || defaultColor;
    } else {
      fillColor = defaultColor;
    }

    fillColor = addAlphaToRGB(fillColor, REGION_FILL_ALPHA);
    markings.push({
      xaxis: { from: region.min, to: region.timeEnd },
      color: fillColor,
    });
  });
}

function addAlphaToRGB(colorString: string, alpha: number): string {
  let color = tinycolor(colorString);
  if (color.isValid()) {
    color.setAlpha(alpha);
    return color.toRgbString();
  } else {
    return colorString;
  }
}
