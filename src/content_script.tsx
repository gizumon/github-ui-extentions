import React from 'react';
import ReactDOM from 'react-dom';
import { Octokit } from "@octokit/rest";
import { IMessage } from './background';
import Label, { labelClassName } from "./components/label";
import Notification, { notificationClassName, notificationId } from "./components/notification";

window.addEventListener("focus", () => {
  const path = window.location.pathname;
  pathHandler(path);
});

const baseRefClassName = 'base-ref';
const headRefClassName = 'head-ref';
const mergeDetailClassName = 'mergeability-details';

const regexpPullReq = /^issue_([0-9]+)$/;
const regexpPullsPage = /\/([^\/]+)\/([^\/]+)\/pulls.+/; // 0:org, 1:repo
const regexpPullDetailPage = /\/([^\/]+)\/([^\/]+)\/pull\/([^\/#?]+)[#?]?/; // 0:org, 1:repo, 2:id
const isPullsListPage = (path: string): boolean => regexpPullsPage.test(path);
const isPullDetailPage = (path: string): boolean => regexpPullDetailPage.test(path);
const getPullReqId = (id: string): string => {
  const results = id.match(regexpPullReq);
  if (!results || results.length < 1) {
    return '';
  }
  return results[0];
}

const host = window.location.host;
// const octokit = isGithubHost(host) ? new Octokit() : new Octokit({ baseUrl: `https://${host}/api/v3` });

chrome.runtime.onMessage.addListener(function (msg: IMessage, sender, sendResponse) {
  if (!validateNavMessage(msg) || host !== msg.host) {
    return;
  }
  pathHandler(msg.path);
});

const pathHandler = (path: string = '') => {
  switch (true) {
    // case isPullsListPage(msg.path):
    //   return;
    case isPullDetailPage(path):
      return onPullDetailPageLoad();
    default:
      return;
  }
}

const validateNavMessage = (msg: IMessage): boolean => {
  if (!msg) return false;
  if (msg.type !== 'navigation') return false;
  if (!msg.url) return false;
  return true;
}

const onPullsListPageLoad = async() => {
  if (hasElementAdded(labelClassName)) {
    return;
  }

  const els = document.querySelectorAll("div[id^=issue_]");
  // octokit.rest.pulls.get({
  //   owner: "octokit",
  //   repo: "rest.js",
  //   pull_number: 123,
  // }).catch(e => {
  //   console.warn(e);
  // })
  els.forEach((el, i) => {
    const pullReqId = getPullReqId(el.id);
    if (!pullReqId) {
      return;
    }
    const extensionEl = document.createElement('div');
    extensionEl.id = `extensions-label-${pullReqId}`;
    el.prepend(extensionEl);
    ReactDOM.hydrate(<Label pullReqId={pullReqId} />, extensionEl);
  });
}

const onPullDetailPageLoad = async(): Promise<void> => {
  let count = 0;
  const maxRetry = 5;
  const delay = 500;
  if (hasElementAdded(notificationClassName)) {
    return;
  }
  while (!hasReady() && count < maxRetry) {
    count = count + 1;
    await sleepWithDelay(delay);
  }

  if (count < maxRetry) {
    appendNotificationEl();
  }
}

const hasReady = () => {
  const targetEl = document.getElementsByClassName(mergeDetailClassName);
  const baseRefEl = document.getElementsByClassName(baseRefClassName);
  const headRefEl = document.getElementsByClassName(headRefClassName);
  if (
    !targetEl || targetEl.length < 1 ||
    !baseRefEl || baseRefEl.length < 1 ||
    !headRefEl || headRefEl.length < 1
  ) {
    return false;
  }
  return true;
}

const appendNotificationEl = () => {
  const targetEl = document.getElementsByClassName(mergeDetailClassName);
  const baseRefEl = document.getElementsByClassName(baseRefClassName);
  const headRefEl = document.getElementsByClassName(headRefClassName);
  const baseBranchName = baseRefEl[0]?.querySelector('span')?.textContent || '';
  const baseBranchHref = baseRefEl[0]?.querySelector('a')?.href || '';
  const headBranchName = headRefEl[0]?.querySelector('span')?.textContent || '';
  const headBranchHref = headRefEl[0]?.querySelector('a')?.href || '';

  if (document.getElementById(notificationId)) {
    return; // already added
  }

  const extensionEl = document.createElement('div');
  extensionEl.id = notificationId;
  targetEl[0].appendChild(extensionEl);
  ReactDOM.hydrate(
    <Notification
      baseBranchName={baseBranchName}
      baseBranchHref={baseBranchHref}
      headBranchName={headBranchName}
      headBranchHref={headBranchHref}
    />,
    extensionEl
  );
}

const hasElementAdded = (className: string): boolean => {
  const labelEls = document.getElementsByClassName(className);
  if (labelEls && labelEls.length > 0) {
    return true;
  }
  return false;
}

const sleepWithDelay = async(delay: number = 500): Promise<boolean> => await new Promise((resolve) => setTimeout(resolve, delay));
