import url from 'url-parse';


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
