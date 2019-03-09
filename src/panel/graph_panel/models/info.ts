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

export const ServerInfoUnknown: ServerInfo = {
  nodeVersion: 'unknown',
  packageVersion: 'unknown',
  npmUserAgent: 'unknown',
  docker: 'unknown',
  zmqConectionString: 'unknown',
  serverPort: 'unknown',
  gitBranch: 'unknown',
  gitCommitHash: 'unknown'
};

export type PanelInfo = {
  grafanaVersion: string,
  grafanaUrl: string,
  datasourceType: string,
  hasticServerUrl: string
}
