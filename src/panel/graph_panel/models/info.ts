export type ServerInfo = {
  nodeVersion: string,
  packageVersion: string,
  npmUserAgent: string,
  docker: string | boolean,
  zmqConectionString: string,
  serverPort: string | number,
  gitBranch: string,
  gitCommitHash: string
}

export type PanelInfo = {
  grafanaVersion: string,
  grafanaUrl: string,
  datasourceType: string,
  hasticServerUrl: string
}
