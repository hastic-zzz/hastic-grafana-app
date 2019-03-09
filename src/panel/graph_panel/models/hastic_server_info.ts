export type HasticServerInfo = {
  nodeVersion: string,
  packageVersion: string,
  npmUserAgent: string,
  docker: string | boolean,
  zmqConectionString: string,
  serverPort: string | number,
  gitBranch: string,
  gitCommitHash: string
}

export const HasticServerInfoUnknown: HasticServerInfo = {
  nodeVersion: 'unknown',
  packageVersion: 'unknown',
  npmUserAgent: 'unknown',
  docker: 'unknown',
  zmqConectionString: 'unknown',
  serverPort: 'unknown',
  gitBranch: 'unknown',
  gitCommitHash: 'unknown'
};