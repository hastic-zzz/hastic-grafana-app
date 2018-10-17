export type ServerInfo = {
  nodeVersion: string,
  packageVersion: string,
  npmUserAgent: string,
  docker: boolean,
  zmqConectionString: string,
  serverPort: number,
  gitBranch: string,
  gitCommitHash: string
}

export type PanelInfo = {
  grafanaVersion: string,
  grafanaUrl: string,
  datasourceType: string,
  hasticServerUrl: string
}
