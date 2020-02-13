export type PanelTemplate = {
  analyticUnits?: any[],
  caches?: any[],
  detectionSpans?: any[],
  segments?: any[]
}

export type TemplateVariables = {
  grafanaUrl: string,
  panelId: string,
  datasourceUrl: string
};
