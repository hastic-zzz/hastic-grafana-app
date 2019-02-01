var template = `
<div class="graph-panel" ng-class="{'graph-panel--legend-right': ctrl.panel.legend.rightSide}">
  <div class="graph-panel__chart" id="graphPanel" ng-dblclick="ctrl.zoomOut()" />
  <div class="hastic-graph-legend" id="graphLegend" />
</div>
`;

export default template;
