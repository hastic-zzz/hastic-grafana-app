import url from 'url-parse';
import * as _ from 'lodash';
import { appEvents } from 'grafana/app/core/core';

export const SUPPORTED_SERVER_VERSION = '0.3.6-beta';

export enum HasticDatasourceStatus {
  AVAILABLE,
  NOT_AVAILABLE
}

export enum hasticUrlStatus {
  NEW_URL,
  STATUS_CHANGES,
  NO_CHANGES
}

export function normalizeUrl(inputUrl: string) {
  if(!inputUrl) {
    return inputUrl;
  }
  let urlObj = new url(inputUrl, {});
  if(urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    inputUrl = `http://${inputUrl}`;
    urlObj = new url(inputUrl, {});
    console.log('No protocol provided in inputUrl -> inserting "http://"');
  }
  if(urlObj.slashes === false) {
    urlObj = new url(`${urlObj.protocol}//${urlObj.pathname}`, {});
    console.log('No slashes were provided after the protocol -> inserting slashes');
  } 
  if(urlObj.pathname.slice(-1) === '/') {
    urlObj.pathname = urlObj.pathname.slice(0, -1);
    console.log('Removing the slash at the end of inputUrl');
  }
  let finalUrl = `${urlObj.protocol}//${urlObj.hostname}`;
  if(urlObj.port !== '') {
    finalUrl = finalUrl + ':' + urlObj.port;
  }
  if(urlObj.pathname !== '') {
    finalUrl = finalUrl + urlObj.pathname;
  }
  return finalUrl;
}

export function isHasticServerResponse(response: any) {
  if(response === undefined) {
    return false;
  }
  if(!_.has(response, 'server')) {
    return false;
  }
  return true;
}

export function isSupportedServerVersion(response: any) {
  if(response.packageVersion !== SUPPORTED_SERVER_VERSION) {
    return false;
  }
  return true;
}

export function displayAlert(url: string, status: HasticDatasourceStatus, alert: string, message: string[]) {
  const urlStatus = updateHasticUrlStatus(url, status);
  if(urlStatus === hasticUrlStatus.NO_CHANGES) {
    return;
  } else if(urlStatus === hasticUrlStatus.STATUS_CHANGES) {
    appEvents.emit('hastic-datasource-status-changed', url);
  }
  appEvents.emit(
    alert,
    message
  );
}

export function updateHasticUrlStatus(hasticUrl: string, status: HasticDatasourceStatus): hasticUrlStatus {
  if(window.hasOwnProperty('hasticUrlMap') === false) {
    window.hasticDatasourcesStatuses = {};
  }
  if(window.hasticDatasourcesStatuses.hasOwnProperty(hasticUrl)) {
    if(window.hasticDatasourcesStatuses[hasticUrl] === status) {
      return hasticUrlStatus.NO_CHANGES;
    } else {
      window.hasticDatasourcesStatuses[hasticUrl] = status;
      return hasticUrlStatus.STATUS_CHANGES;
    }
  } else {
    window.hasticDatasourcesStatuses[hasticUrl] = status;
    return hasticUrlStatus.NEW_URL;
  }
}
