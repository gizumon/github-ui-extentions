export interface IMessage {
  type: 'navigation';
  url: string; 
  host: string;
  path: string;
}

const urlPattern = /^https:\/\/([^\/]*)(\/.*)/;

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  console.log(tabId, info, tab);
  const hasLoadCompleted = info.status === 'complete';
  if (hasLoadCompleted) {
    const msg: IMessage = {
      type: 'navigation',
      url: tab.url || '',
      host: getHost(tab.url),
      path: getPath(tab.url),
    }
    chrome.tabs.sendMessage(tabId, msg, function(response) {
      console.log(response);
    });
  }
});

const getHost = (url: string = ''): string => {
  const matches = url.match(urlPattern);
  return matches && matches.length > 1 ? matches[1] : '';
}

const getPath = (url: string = ''): string => {
  const matches = url.match(urlPattern);
  return matches && matches.length > 2 ? matches[2] : '';
}